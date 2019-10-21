/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: '/dashboard',
    // Relative to /src/views
    view: 'Dashboard'
  },
  {
    path: '/user-profile',
    name: 'User Profile',
    view: 'UserProfile'
  },
  {
    path: '/med-list',
    name: '药品管理',
    view: 'MedList'
  },
  {
    path: '/ord-list',
    name: '处方管理',
    view: 'OrderList'
  },
  {
    path: '/create-ord',
    name: '生成处方',
    view: 'CreateOrd'
  },
  {
    path: '/icons',
    view: 'Icons'
  },
  {
    path: '/notifications',
    view: 'Notifications'
  },
  {
    path: '/upgrade',
    name: 'Upgrade to PRO',
    view: 'Upgrade'
  },
  {
    path: '/settings',
    name: 'Setting',
    view: 'Setting'
  },
]
