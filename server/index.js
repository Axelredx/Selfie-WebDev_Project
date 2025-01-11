import express from 'express';
import morgan from 'morgan';
import cookie_parser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import path from "path";
import compression from 'compression';
import { fileURLToPath } from 'url';
import env from "./src/utils/env.js";
import userRoute from './src/routers/user.js';
import pomodoroRoute from './src/routers/pomodoro.js';
import noteRoute from './src/routers/note.js';
import eventRoute from './src/routers/event.js';
import timeMachineRoute from './src/routers/timeMachine.js';
import checkerRoute from './src/routers/checker.js';
import * as authMiddlewere from './src/middlewares/auth.js';
import * as commonMiddlewere from './src/middlewares/common.js';
import * as userMiddlewere from './src/middlewares/user.js';
import * as enterValidation from './src/utils/validation.js';
import * as clockDeamon from './src/deamons/ClockDeamon.js';
import * as eventDeamon from './src/deamons/EventDeamon.js';
import * as pomodoroDeamon from './src/deamons/PomodoroDeamon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8000;
const mongouri = `your mongo uri`;

// create express app
const app = express();

app.use(compression());

// prevent 304 reload status code
app.disable('etag');

// prevent get on favicon.ico
app.use(function(req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }
  next();
});

// enable morgan logger for better tracking of requests via console
app.use(morgan("dev", {
  skip: (req, res) => res.headersSent
}));

app.use(express.json());
// enable CORS for all requests
app.use(cors({
  origin: ["http://localhost:8000", "http://localhost:5173"],
  credentials: true
}));
app.options('*', cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.enable('trust proxy');

// connect to mongodb
mongoose.connect(mongouri)
  .then(() => { 
    console.log("Connected to Mongodb"); 
  })
  .catch((err) => { 
    console.log(`Error on connecting to mongouri: ${mongouri}`);
    console.error(`MongoDB connection error: ${err}`); 
  });

// import routes with middlewares
app.get("/api", authMiddlewere.validateCookie(), enterValidation.testIfLogged);

app.use("/api/user", authMiddlewere.validateCookie(), commonMiddlewere.failedValidationMsg, authMiddlewere.validateToken, userMiddlewere.isUserDeleted, userRoute);
app.use("/api/pomodoro", authMiddlewere.validateCookie(), commonMiddlewere.failedValidationMsg, authMiddlewere.validateToken, pomodoroRoute);
app.use("/api/note", authMiddlewere.validateCookie(), commonMiddlewere.failedValidationMsg, authMiddlewere.validateToken, noteRoute);
app.use("/api/event", authMiddlewere.validateCookie(), commonMiddlewere.failedValidationMsg, authMiddlewere.validateToken, eventRoute);
app.use("/api/timeMachine", authMiddlewere.validateCookie(), commonMiddlewere.failedValidationMsg, authMiddlewere.validateToken, timeMachineRoute);
app.use("/api/checker", authMiddlewere.validateCookie(), commonMiddlewere.failedValidationMsg, authMiddlewere.validateToken, checkerRoute);

app.post("/api/signup", authMiddlewere.validateBodySignUp(), commonMiddlewere.failedValidationMsg, enterValidation.signUp);
app.post("/api/signin", authMiddlewere.validateBodySignIn(), commonMiddlewere.failedValidationMsg, enterValidation.signIn);
app.post("/api/signout", authMiddlewere.validateCookie(), commonMiddlewere.failedValidationMsg, authMiddlewere.validateToken, userMiddlewere.isUserDeleted, enterValidation.signOut);


app.use(express.static(path.join(__dirname, 'dist')));
app.get("*", (_req, res) =>
  res.sendFile(path.join(__dirname, 'dist/index.html'))
);

app.listen(PORT, () => {
  console.log(`Server started at time: ${new Date()}`);
  console.log(`Server running at port: ${PORT}`)
});

// start clock deamons
clockDeamon.updateClockDeamon();
eventDeamon.updateEventDeamon();
pomodoroDeamon.updatePomodoroDeamon();

export default app;
