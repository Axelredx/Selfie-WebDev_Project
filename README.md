# Selfie

Selfie is a WebApp styled like i-Calendar, aimed at simplifying the organization of university students' lives. The application allows users to create, edit with detailed information, and delete events, all in the _Calendar_ section. Additionally, there is a dedicated screen for tracking study hours using the _Pomodoro_ study method and a section dedicated to taking _Notes_. 

## Table of Contents

- [Contributors](#contributors)
- [Choice of Technology](#choice-of-technology)
    - [Frontend](#frontend)
    - [Backend](#backend)
- [Use of AI](#use-of-ai)
- [Project Setup](#project-setup)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)

## Contributors

Alex Rossi alex.rossi7@studio.unibo.it 0001089916;

Giuseppe Iannone giuseppe.iannone2@studio.unibo.it 0001070486;

Vittorio Massimiliano Incerti vittorio.incerti@studio.unibo.it 0001070634.

Specifically:
- Alex Rossi: 
    - **Frontend**: Login, Register, Home, Pomodoro, Notes, TimeMachine.
    - **Backend**: Account management, User management, TimeMachine, Notes, Pomodoro.

- Giuseppe Iannone: 
    - **Frontend**: Calendar, Events on the calendar (Event, Activity, Pomodoro).
    - **Backend**: Calendar, Events, Notification system, TimeMachine, Pomodoro.

- Vittorio Massimiliano Incerti: 
    - **Frontend**: Calendar, Events on the calendar (Event, Activity, Pomodoro).
    - **Backend**: Calendar, Events, Notification system, TimeMachine, Pomodoro.

Despite the division of labor, all group members actively contributed to the realization of the project, participating in all development phases, often using agile methodologies like _Pair Programming_.

## Choice of Technology

The project was developed using the following technologies/frameworks:

#### Frontend

Developed using the **_Vue.js_** framework. The application was designed to be _responsive_ and _mobile-friendly_. \
For graphics/UI, the **_Bootstrap_** framework was used. \
Other technologies include **_Axios_** for HTTP requests, **_FullCalendar_** for client-side calendar management, and **_Vue Router_** for page navigation.

#### Backend

Developed in JavaScript using the **_Node.js_** framework. \
Other technologies include **_Express_** for server creation, **_JWT_** for session management, **_Mongoose_** for managing _MongoDB_, **_Cors_** for handling _server-client_ requests, and **_Nodemailer_** for the email-based notification system.

## Use of AI

The use of _AI_ tools was limited to **only occasional** assistance in UI creation, particularly for the _color palette_, to ensure a user-friendly product.

## Project Setup

### Prerequisites
- Node.js
- Vue.js
- MongoDB

### Setup
1. Clone the repository:
    ```shell
    git clone
    ```
2. Install the dependencies:
    ```shell
    cd [Name-repo]/sources/client && npm i && cd ../server && npm i && cd ..
    ```
3. Run the server:
    ```shell
    cd [Name-repo]/sources/server && npm start && cd ..
    ```
4. Run the client:
    ```shell
    cd [Name-repo]/sources/client && npm run dev
    
