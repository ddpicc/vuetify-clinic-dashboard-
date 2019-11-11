import router from './router'
import store from './store'

router.beforeEach((to,from,next)=>{
	if(to.meta.requireAuth){
		if(store.state.order.post_order == 2){
				next();
		}else{
				next({path:'/login'});
		}
	}else{
		next();
	}
})