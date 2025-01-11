import * as timeMachineController from "../controllers/timeMachine.js";

export function updateClockDeamon() {
    //console.log("Clock deamon started at " + new Date());

    let currentTime = new Date(timeMachineController.getServerClock());

    // every 1 sec it updates the server clock
    function updateTime() {
        let currentTime = new Date(timeMachineController.getServerClock());
        currentTime.setSeconds(currentTime.getSeconds() + 1); 
        timeMachineController.setServerClock(currentTime); 
        //console.log(`Server time updated to: ${timeMachineController.getServerClock()}`);
    }
  
    // update every 1 sec
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
}