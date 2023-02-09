import router from './router'
import store from './store'


// 过滤符合条件的路由-可根据自己业务做调整-根据参数 to 做信息判定，如果符合条件，则前往相应页面，否则前往404 
function hasPermission(role, to) {
  if (role.indexOf('admin') >= 0) {
    return true // admin permission passed directly
  }
  if (to.meta.roles) {
    return to.meta.roles.indexOf(role) >= 0
  } else {
    return true
  }
}

const whiteList = ['/login','/','/registerp','/displayp']// 不重定向白名单
router.beforeEach((to, from, next) => {
	if (store.state.user.token) { // 判断是否有token
	  if (to.path === '/login') {
			next({ path: '/create-ord' })
	  } else {
			if (store.state.user.role.length === 0) { // 判断当前用户是否已拉取完user_info信息
				store.dispatch('user/GetInfo').then(res => { // 拉取user_info
				const role = res.data[0].role;
				store.dispatch('permission/GenerateRoutes', { role }).then(() => { // 生成可访问的路由表
					router.addRoutes(store.state.permission.addRouters); // 动态添加可访问路由表
					next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
					})
				}).catch(err => {
					console.log('error');
					store.dispatch('user/FedLogOut').then(() => {
						next({ path: '/login' })
					})
				})
			} else {		  
		  //store.dispatch('permission/getNowRoutes', to);
  
		  	if (hasPermission(store.state.user.role, to)) {
					next()//
		  	} else {
					next({ path: '/'})
		  	}
			}
	  }
	} else {
	  if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
			next()
	  } else {
			next('/login') // 否则全部重定向到登录页
	  }
	}
})