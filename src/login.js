import router from './router'
import store from './store'


function hasPermission(roles, permissionRoles) {
	if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
	if (!permissionRoles) return true
	return permissionRoles.indexOf(roles) >= 0
}

const whiteList = ['/login','/','/registerp','/displayp']// 不重定向白名单
router.beforeEach((to, from, next) => {
	if (store.state.user.token) { // 判断是否有token
	  if (to.path === '/login') {
			next({ path: '/dashboard' })
	  } else {
			if (store.state.user.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
				store.dispatch('user/GetInfo').then(res => { // 拉取user_info
				const roles = res.data[0].role;  
				store.dispatch('permission/GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
					router.addRoutes(store.state.permission.addRouters); // 动态添加可访问路由表
					next({ ...to }); // hack方法 确保addRoutes已完成
					})
				}).catch(err => {
					console.log('all good');
					store.dispatch('user/FedLogOut').then(() => {
						next({ path: '/login' })
					})
				})
			} else {		  
		  //store.dispatch('permission/getNowRoutes', to);
  
		  	if (hasPermission(store.state.user.roles, to.meta.role)) {
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