<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import { session } from '@/session';

  const stopped = ref(true);
  const timer = ref('00:00');
  const totalCycle = ref(0);
  const totCopy = ref(0);
  let interval = null;
  const isTomato = ref(false);
  const isPause = ref(false);
  //const remainigCycle = ref(0);
  const modifyC = ref(1);
  const modifyT = ref(1);
  const modifyP = ref(1);
  const tomatoToday = ref(false);

  const state = reactive({
    tot_cycle : 4,
    tomato_min : 25,
    pause_min : 5, 
    state_date: new Date().toISOString().split('T')[0],
    //remaining_cycles: 0,
  })
  //totalCycle.value += remainigCycle.value*2;

  // Func. for Toast
  const PomodoroToast = () => {
    toast.info('Pomodoro cycle started!',{
      autoClose: 2000,
      theme: 'dark'
    });
  };

  const TomatoToast = () => {
    toast.info('Tomato session started!',{
      autoClose: 2000,
      theme: 'dark'
    });
  };

  const EndPomodoroToast = () => {
    toast.success('Pomodoro cycle ended!',{
      autoClose: 2000,
      theme: 'dark'
    });
  };

  const PauseToast = () => {
    toast.info('Pause session started!',{
      autoClose: 2000,
      theme: 'colored',
    });
  };

  const SkipToast = () => {
    toast.warning('Tomato session skipped! Passing to the next one...',{
      autoClose: 2000,
      theme: 'dark'
    });
  };

  const RedoToast = () => {
    toast.warning('Tomato session redone! Added one cycle to the total...',{
      autoClose: 2000,
    });
  };

  const AbortToast = () => {
    toast.error('Tomato session aborted!',{
      autoClose: 2000,
      theme: 'dark',
    });
  };

  // Functions dedicated to managing SVGs
  const showTomatoSvg = () => {
    isTomato.value = !isTomato.value;
    isPause.value = false;
  };

  const showPauseSvg = () => {
    isPause.value = !isPause.value;
    isTomato.value = false;
  };

  const dontShowSvg = () => {
    isPause.value = false;
    isTomato.value = false;
  };

  // Func. for managing tomato cycle
  const Tomato = () => {
    if (!stopped.value) return;
    totalCycle.value = (state.tot_cycle * 2) - 1;
    totCopy.value = totalCycle.value;
    PomodoroToast();
    startTomato();
  };

  const startTomato = () => {
    stopped.value = false;
    runCycle(0);
  };

  const runCycle = (cycle) => {
    //console.log('cycle remaining: ' + totCopy.value);
    if (cycle > totalCycle.value) {
      stopped.value = true;
      dontShowSvg();
      EndPomodoroToast();
      return;
    }
    let duration = cycle % 2 === 0 ? state.tomato_min : state.pause_min;
    if(cycle % 2 === 0){
      showTomatoSvg();
      // prevent having 2 toast at same time (e.g.: Pomo.toast and Tom.toast)
      if (cycle > 0){
        TomatoToast();
      }
    }else{
      showPauseSvg();
      PauseToast();
    }
    //console.log(cycle % 2 === 0 ? 'tomato session' : 'pause');
    startTimer(duration, () => {
      totCopy.value--;
      runCycle(cycle + 1);
    });
  };

  const startTimer = (minutes, callback) => {
    const endTime = Date.now() + minutes * 60000;
    interval = setInterval(() => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0 || stopped.value) {
        clearInterval(interval);
        timer.value = '00:00';
        if (!stopped.value) {
          callback();
        }
        return;
      }

      const remainingMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      timer.value = `${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
  };

  // Func. dedicated to buttons
  const stopTimer = () => {
    dontShowSvg();
    if (totalCycle.value <= 0) {
      //console.log('Cant stop cycle!');
      return;
    }
    stopped.value = true;
    timer.value = '00:00';
    totalCycle.value = 0;
    totCopy.value = 0;
    clearInterval(interval);
  };

  const skipCycle = () => {
    if (totalCycle.value <= 0) {
      //console.log('Cant skip cycle!');
      return;
    }
    SkipToast();
    //console.log('Cycle skipped!');
    let cycle = totCopy.value - 2;
    stopTimer();
    dontShowSvg();
    if (cycle > 0) {
      totCopy.value = cycle;
      totalCycle.value = cycle;
      startTomato();
    } else {
      AbortToast();
      //console.log('Tomato aborted, all cycle remaining has been skipped!');
    }
  };

  const redoCycle = () => {
    dontShowSvg();
    if (totalCycle.value <= 0) {
      //console.log('Cant redo cycle!');
      return;
    }
    RedoToast();
    //console.log('Cycle redone! (added a tomato + pause cycle)');
    let cycle = totCopy.value;
    stopTimer();
    totCopy.value = cycle + 2;
    totalCycle.value = cycle + 2;
    startTomato();
  };

  const abortCycle = () => {
    dontShowSvg();
    if (totalCycle.value <= 0) {
      //console.log('Cant abort/stop cycle!');
      return;
    }
    AbortToast();
    stopTimer();
    //console.clear();
    //console.log('Cycle! aborted');
  }

  //Func. modify time after started
  const modify = () => {
    state.tot_cycle = modifyC.value;
    state.tomato_min = modifyT.value;
    state.pause_min = modifyP.value;
  }

  //Func. to show tomato cycle of today
  const getTomatoToday = async () => {
    try {
      const username = await session.get('/api/user').then((resp) => resp.data.username);
      const res = await session.get('/api/pomodoro/todayServer', { params: { ownerPomodoro: username } });
      if (res.data) {
        const tomato = res.data; 
        state.tot_cycle = tomato.cycles;
        state.tomato_min = tomato.duration;
        state.pause_min = tomato.breakDuration;
        state.date = tomato.datePomodoro;

        document.getElementById('tomatoInDays').innerHTML = `
          <p><strong>Pomodoro found: </strong> ${tomato.duration} min. / ${tomato.breakDuration} min. - ${tomato.cycles} cycles</p>`;
        tomatoToday.value = true;
      } else {
        tomatoToday.value = false;
        document.getElementById('tomatoInDays').innerHTML = `<p>No pomodoro cycle for today!</p>`;
      }
    } catch (error) {
      //console.error("Error fetching today's pomodoros:", error);
    }
  };

  const deleteTomato = async () => {
    try {
      const username = await session.get('/api/user').then(resp => resp.data.username);
      const res = await session.delete('/api/pomodoro/todayServer', { params: { ownerPomodoro: username } });
      //console.log('Pomodoro deleted:', res.data);
      document.getElementById('tomatoInDays').innerHTML = `<p>No remaining pomodoro cycle for today!</p>`;
      tomatoToday.value = false;
    } catch (error) {
      //console.error('Error deleting today\'s pomodoros:', error);
    }
  };

  const handleTomatoToday = () => {
    Tomato();
    // deletion of pomodoro in DB after starting it
    deleteTomato();
  };

  onMounted(() => {
    getTomatoToday();
  });
</script>

<template>
<div id="tomato">
  <div class="pomodoro">
      <form id="studyForm" @submit.prevent="Tomato">
          <div class="form-floating">
              <input class="form-control" placeholder="Number of tomatoes" v-model.number="state.tot_cycle" type="number" min="1" required>
              <label>N° Cycles</label>
          </div>
          <div class="form-floating">
              <input class="form-control" placeholder="Minutes of tomatoes" v-model.number="state.tomato_min" type="number" min="1" required>
              <label>Min. Tomato</label>
          </div> 
          <div class="form-floating">
              <input class="form-control" placeholder="Minutes of pauses" v-model.number="state.pause_min" type="number" min="1" required>
              <label >Min. Pause</label>
          </div>
          <button type="submit" class="btn btn-primary" id="strt">
            Start! <img src="@/assets/stopwatch.svg" alt="Stop"/>
          </button>
      </form>
      <div id="visual"> 
          <div id="clock" v-if="isTomato == false && isPause == false">
            <div id="timer">{{timer}}</div> 
          </div>
          <div id="clock_tomato" v-if="isTomato == true && isPause == false">
            <div id="timer">{{timer}}</div> 
          </div>
          <div id="clock_pause" v-if="isPause == true && isTomato == false">
            <div id="timer">{{timer}}</div> 
          </div>     
          <div id="buttons">
                <button @click="abortCycle" type="button" class="btn btn-danger" id="stop-btn">
                      Stop Studying! <img src="@/assets/slash-circle.svg" alt="Stop"/>
                </button>
                <button @click="skipCycle" type="button" class="btn btn-warning" id="skip-btn">
                    Skip a Cycle! <img src="@/assets/skip-forward-fill.svg" alt="Skip"/>
                </button>
                <button @click="redoCycle" type="button" class="btn btn-light" id="redo-btn">
                    Redo a Cycle! <img src="@/assets/redo.svg" alt="Redo"/>
                </button>
          </div>       
      </div>
  </div>
  <div id="utils">
    <h6 class="utils-title">Pomodoro cycle of today:</h6>
    <div id="tomatoInDays"></div>
    <button v-if="tomatoToday == true" @click="handleTomatoToday" type="button" class="btn btn-primary" id="strt">Start!</button>
    <div id="tdycyc"></div>
    <h6 class="utils-title">Need to modify time after starting? Try this!</h6>
    <form id="modifyForm" @submit.prevent="modify">
      <div class="form-group">
        <label for="modifyCycle">New n° cycles</label>
        <input id="modifyCycle" class="form-control" placeholder="e.g., 4" type="number" min="1" v-model.number="modifyC" required>
      </div>
      <div class="form-group">
        <label for="modifyTomato">New tomato minutes</label>
        <input id="modifyTomato" class="form-control" placeholder="e.g., 25" type="number" min="1" v-model.number="modifyT" required>
      </div>
      <div class="form-group">
        <label for="modifyPause">New pause minutes</label>
        <input id="modifyPause" class="form-control" placeholder="e.g., 5" type="number" min="1" v-model.number="modifyP" required>
      </div>
      <button type="submit" class="btn btn-primary modify-btn">Modify now!</button>
    </form>
  </div>
</div>
</template>

<style scope>
  #tomato{
    display: flex;
    flex-direction: row;  
    justify-content: center;
    align-items: center;
    height: 93vh;
    width: 100%;
  }

  .pomodoro{
    display: flex;
    flex-direction: column;
    width: 40vw;
    height: 75vh;
    border: 1px solid black;
    border-radius:10px;
    align-items: center;
    background-color: white;
    margin: 10px;
  }

  #studyForm{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin: 5px;
      /*border: solid black;*/
  }

  #visual{
      width: 40vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      /*justify-content: center;*/
      align-items: center;
      background-image: url(https://site212248.tw.cs.unibo.it/img/tomato.png);
      background-size: 100% 100%;
      background-position: center;
      /*border: solid black;*/
  }

  #clock, #clock_tomato, #clock_pause {
      font-weight: bold;
      font-size: 4em;
      color: whitesmoke;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px;
      text-shadow: 
          -1px -1px 0 black,  
          1px -1px 0 black,
          -1px 1px 0 black,
          1px 1px 0 black;
      /*margin-top: 70px;*/
      background-size: 100% 100%;
      background-position: center;
      height: 30vh;
      width: 30vw;
      border-radius: 200px;
      margin-bottom: 15vh;
      transform-origin: center;
      animation: rotate-background 10s linear infinite;
      /*border: solid black;*/
  }

  #clock_tomato{
    background-image: url(@/assets/fire.svg);
  }

  #clock_pause{
    background-image: url(@/assets/hand-green.svg);
  }

  #buttons{
      display: flex;
      justify-content: center;
      align-items: center;
      /*border: solid black;*/
  }

  button, .form-floating{
    margin: 1px;
  }

  /*css animation*/
  #timer{
    animation: counter-rotate 10s linear infinite;
  }

  #tdycyc{
    margin: 10px;
    border-top: 1px solid black;
    width: 95%;
  }

  #tomatoInDays {
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
  }

  #mdfy {
    background-color: darkorange;
    border-color: darkorange;
  }

  #mdfy:hover {
    background-color: chocolate;
    border-color: chocolate;
  }

  #strt {
    background-color: #0c8b00;
    border-color: #0c8b00;;
  }

  #strt:hover {
    background-color: #006600;
    border-color: #006600;
  }

  #redo-btn, #skip-btn, #stop-btn {
    border-color: black;
  }

  #skip-btn:hover {
    background-color: #c29b00;
  }

  #utils {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 50vw;
    padding: 1.5rem;
    border: 1px solid #d3d3d3;
    border-radius: 12px;
    background: linear-gradient(to bottom, #f9f9ff, #e6e6fa);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    align-items: center;
  }
  
  .utils-title {
    font-size: 1.1rem;
    color: #333;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  #modifyForm {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .form-group {
    flex: 1 1 calc(33% - 1rem);
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: #555;
  }
  
  .form-group input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #007bff;
  }
  
  .modify-btn {
    background-color: #ff7f50;
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .modify-btn:hover {
    background-color: #e06b3c;
  }
  
  #tdycyc {
    margin: 10px 0;
    border-top: 1px solid #d3d3d3;
    width: 95%;
  }
  
  #tomatoInDays {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  

  @keyframes rotate-background {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /*to make timer still*/
  @keyframes counter-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  @media (max-width: 900px) {
    #tomato{
      flex-direction: column;
      height: auto;
      overflow-y: scroll;
    }

    .pomodoro{
      width: 90vw;
      height: 55vh;
    }

    #buttons, #studyForm{
      flex-direction: row;
    }

    #clock, #clock_tomato, #clock_pause{
      margin-bottom: 2vh;
    }

    #clock, #clock_tomato, #clock_pause{
      width: 100%;
    }
    #visual, #utils, #PomodoroInvite{
      width: 90%;
    }
  }

  @media (max-width: 500px) {
    .pomodoro{
      width: 90vw;
      height: 65vh;
    }

    #buttons, #studyForm{
      flex-direction: row;
    }

    #visual, #utils, #PomodoroInvite{
      width: 90%;
    }
  }
</style>