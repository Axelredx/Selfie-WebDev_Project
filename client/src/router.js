import { createRouter, createWebHistory } from 'vue-router'
import { session } from '@/session'
import HomePage from '@/views/HomePage.vue'
import PomodoroPage from '@/views/PomodoroPage.vue'
import NotePage from './views/NotePage.vue'
import CalendarPage from '@/views/CalendarPage.vue'
import SignIn from '@/components/Login/signin.vue'
import SignUp from '@/components/Login/signup.vue'
import TimeMachinePage from './views/TimeMachinePage.vue'


export const hasLoggedIn = async ( _to, _from) => {
  const resp = await session.get("/api")
  if (resp.data.username == undefined) {
    return "/signin";
  }
}

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    beforeEnter: [hasLoggedIn]
  },
  {
    path: "/signin",
    name: "signin",
    component: SignIn
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp
  },
  {
    path: '/pomodoro',
    name: 'pomdoro',
    component: PomodoroPage
  },
  {
    path: '/note',
    name: 'note',
    component: NotePage
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarPage
  },
  {
    path: '/tmachine',
    name: 'tmachine',
    component: TimeMachinePage
  }
]
