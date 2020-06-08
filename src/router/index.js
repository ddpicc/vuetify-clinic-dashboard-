/**
 * Vue Router
 *
 * @library
 *
 * https://router.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import Router from 'vue-router'
import Meta from 'vue-meta'
import Homepage from '../views/HomePage'
import Login from '../views/Login'
import LoadDataPage from '../views/LoadDataPage'
import RegisterP from '../views/RegisterPatient'


//不理解，但是是为了解决 next()的时候路由导航钩子时出现"uncaught (in promise) undefined 
//https://blog.csdn.net/hgs_5683/article/details/101027580
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export const constantRouterMap = [
  { path: '', component: Homepage, hidden: true},
  { path: '/login', component: Login, hidden: true },
  { path: '/loading', component: LoadDataPage, hidden: true },
  { path: '/registerp', component: RegisterP, hidden: true }
]
// Create a new router
const router = new Router({
  mode: 'history',
  routes: constantRouterMap,
  
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  }
});

export const asyncRouterMap = [
  {
    path: '/dashboard',
    component: () => import('../Full.vue'),
    children: [
      {path: '/dashboard', component: () => import('../views/Dashboard.vue')},
      {path: '/patient-profile', name: 'Patient Profile', component: () => import('../views/PatientProfile.vue')},
      {path: '/med-list', name: '药品管理', component: () => import('../views/MedList.vue')},
      {path: '/ord-list', name: '处方管理', component: () => import('../views/OrderList.vue')},
      {path: '/create-ord', name: '生成处方', component: () => import('../views/CreateOrd.vue')},
      {path: '/patient-list', name: '病人管理', component: () => import('../views/PatientList.vue')},
      {path: '/detail-info', name: '详细账单', component: () => import('../views/DetailInfo.vue')},
      {path: '/settings', component: () => import('../views/Setting.vue')},
      { path: '*', redirect: '/' }
    ]
  }
]

Vue.use(Meta)

// Bootstrap Analytics
// Set in .env
// https://github.com/MatteoGabriele/vue-analytics
if (process.env.GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.GOOGLE_ANALYTICS,
    router,
    autoTracking: {
      page: process.env.NODE_ENV !== 'development'
    }
  })
}

export default router
