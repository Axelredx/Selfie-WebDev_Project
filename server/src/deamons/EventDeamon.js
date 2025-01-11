import * as EventController from "../controllers/event.js";
import * as UserController from "../controllers/user.js";
import * as TM from "../controllers/timeMachine.js";
import nodemailer from "nodemailer";

const EventoOra = 0;
const EventoProssimo = 1;
const EventoOggi = 2;
const AttivitaOggi = 3;
const AttivitaProssima = 4;
const AttivitaSettimana = 5;
const AttivitaRitardo = 6;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'gyattdipeppe@gmail.com',
        pass: 'znbbsfjgzrlleotc' //non è una stringa 
    },
});

//console.log("Event/Notifier daemon started at " + new Date());


const sendmail = async (username, domain, event_name, flag) => {
    
    if (flag == AttivitaRitardo) {
        const tmpstr = "La tua attività " + event_name + " è in ritardo!";
        transporter.sendMail({
            to: 'gyattdipeppe@gmail.com',
            subject:  tmpstr,
            html: `<h1><h1>Ciao ${username}, la tua attività "${event_name}" è ritardata come Peppe</h1>
                    <p>Non preoccuparti, puoi ancora farcela!</p>`,
        }).then(() => {
            //console.log('Email sent');
        }).catch((error) => {  
            //console.error('There was an error!', error);
        });
    }
    else if (flag == AttivitaProssima) {
        const tmpstr = "La tua attività " + event_name + " è prossima!";
        transporter.sendMail({
            to: domain,
            subject: tmpstr,
            html: `<h1>Ciao ${username}, la tua attività "${event_name}" è prossima</h1>
                    <p>Non dimenticarti di prepararti!</p>`,
        }).then(() => {
            //console.log('Email sent');
        }).catch((error) => {  
            //console.error('There was an error!', error);
        });
    }
    else if (flag == AttivitaOggi) {
        const tmpstr = "La tua attività " + event_name + " è oggi!";
        transporter.sendMail({
            to: domain,
            subject: tmpstr,
            html: `<h1>Ciao ${username}, la tua attività "${event_name}" è oggi</h1>
                    <p>Buona fortuna con lo sprint finale!</p>`,
        }).then(() => {
            //console.log('Email sent');
        }).catch((error) => {  
            //console.error('There was an error!', error);
        });
    }
    else if (flag == AttivitaSettimana) {
        const tmpstr = "La tua attività " + event_name + " è in questa settimana!";
        transporter.sendMail({
            to: domain,
            subject: tmpstr,
            html: `<h1>Ciao ${username}, la tua attività "${event_name}" è in questa settimana</h1>
                    <p>Buon lavoro!</p>`,
        }).then(() => {
            //console.log('Email sent');
        }).catch((error) => {  
            //console.error('There was an error!', error);
        });
    }
    else if (flag == EventoOra) {
        const tmpstr = "L'evento " + event_name + " è in corso!";
        transporter.sendMail({
            to: domain,
            subject: tmpstr,
            html: `<h1>Ciao ${username}, l'evento "${event_name}" è in corso</h1>
                    <p>Divertiti!</p>`,
        }).then(() => {
            //console.log('Email sent');
        }).catch((error) => {  
            //console.error('There was an error!', error);
        });
    }
    else if (flag == EventoProssimo) {
        const tmpstr = "L'evento " + event_name + " è prossimo!";
        transporter.sendMail({
            to: domain,
            subject: tmpstr,
            html: `<h1>Ciao ${username}, l'evento "${event_name}" è prossimo</h1>
                    <p>Manca poco!</p>`,
        }).then(() => {
            //console.log('Email sent');
        }).catch((error) => {  
            //console.error('There was an error!', error);
        });
    }
    else if (flag == EventoOggi) {
        const tmpstr = "L'evento " + event_name + " è oggi!";
        transporter.sendMail({
            to: domain,
            subject: tmpstr,
            html: `<h1>Ciao ${username}, l'evento "${event_name}" è oggi</h1>
                    <p>Non farti cogliere impreparato!</p>`,
        }).then(() => {
            //console.log('Email sent');
        }).catch((error) => {  
            //console.error('There was an error!', error);
        });
    }
}


export function updateEventDeamon() {

    function  updateActivity() {
        EventController.findActiviesLate().then((events) => {//trova le attività in ritardo
            events.forEach((event) => {
                if (event.color != "#ff00ff"){// se è la prima volta che l'attività viene flaggata come in ritardo
                    UserController.findUser(event.owner).then((tempUser) => {
                        sendmail(event.owner, tempUser.email, event.title, AttivitaRitardo);
                    });
                }
                EventController.delayActivity(event.owner, event._id);
            });
        });
        EventController.findEventsInTime(false).then((events) => {//trova gli eventi che si svolgono tra 5 minuti (minimo preavviso)
            //console.log("DAEMON");
            //console.log(TM.getServerClock());
            events.forEach((event) => {
                
                //console.log(event);
                UserController.findUser(event.owner).then((tempUser) => {
                    sendmail(event.owner, tempUser.email, event.title, EventoOra);
                });
            });
        });
        EventController.findEventsInTime(true).then((events) => {//trova gli eventi che si svolgono tra 60 minuti
            events.forEach((event) => {
                UserController.findUser(event.owner).then((tempUser) => {
                    sendmail(event.owner, tempUser.email, event.title, EventoProssimo);
                });
            });
        });
        EventController.findActivitiesInTime(24,0).then((events) => {//trova le attività che si svolgono tra 24 ore
            events.forEach((event) => {
                UserController.findUser(event.owner).then((tempUser) => {
                    sendmail(event.owner, tempUser.email, event.title, AttivitaOggi);
                });
            });
        });
        //sendmail('gyattdipeppe@gmail.com', 'test'); // test
    }
    
    
    // update every 10 sec
    const intervalId = setInterval(updateActivity, 60000);
    return () => clearInterval(intervalId);
}