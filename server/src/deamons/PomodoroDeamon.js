import * as timeMachineController from "../controllers/timeMachine.js";
import * as pomodoroController from "../controllers/pomodoro.js";

export function updatePomodoroDeamon() {
    //console.log("Pomodoro daemon started at " + new Date());

    async function scheduleNextDay() {
        try {
            // console.log("Checking if pomodoros are scheduled for yesterday...");
            const yesterdayServer = timeMachineController.getYYYYMMDDyesterday();
           //  console.log("Yesterday server: ", yesterdayServer);
            const todayServer = timeMachineController.getYYYYMMDDserverClock();

            // Find all pomodoros for yesterday
            const pomodorosYesterday = await pomodoroController.findAllPomodoroByDate(yesterdayServer) || [];

            if (pomodorosYesterday.length > 0) {
                // console.log(`Found ${pomodorosYesterday.length} pomodoros for yesterday. Processing...`);

                // Find all pomodoros for today
                const pomodorosToday = await pomodoroController.findAllPomodoroByDate(todayServer) || [];

                // Mapping owner to pomodoro for today
                const pomodorosTodayMap = new Map(
                    pomodorosToday.map(pomo => [pomo.ownerPomodoro, pomo])
                );

                for (const pomodoro of pomodorosYesterday) {
                    const owner = pomodoro.ownerPomodoro;
                    const pomodoroToday = pomodorosTodayMap.get(owner);

                    if (pomodoroToday) {
                        // console.log(`Updating pomodoro for owner: ${owner} (adding yesterday's cycles)...`);
                        await pomodoroController.deletePomodoro(owner, yesterdayServer);
                        await pomodoroController.deletePomodoro(owner, todayServer);
                        const cycleSum = pomodoro.cycles + pomodoroToday.cycles;
                        await pomodoroController.createPomodoro(owner, cycleSum,
                                                    pomodoro.duration, pomodoro.breakDuration,
                                                    todayServer);
                        // console.log(`Pomodoro updated for owner: ${owner}`);
                    } else {
                        // console.log(`Rescheduling yesterday's pomodoro for owner: ${owner}...`);
                        await pomodoroController.deletePomodoro(owner, yesterdayServer);
                        await pomodoroController.createPomodoro(owner, pomodoro.cycles,
                                                    pomodoro.duration, pomodoro.breakDuration,
                                                    todayServer);
                        // console.log(`Pomodoro rescheduled for owner: ${owner}`);
                    }
                }
            } else {
                // console.log("No pomodoros found for yesterday.");
            }
        } catch (error) {
            //console.error("Error in scheduleNextDay:", error);
        }
    }

    const intervalId = setInterval(scheduleNextDay, 3000); // 86400000 = 24h  
    return () => clearInterval(intervalId);
}
