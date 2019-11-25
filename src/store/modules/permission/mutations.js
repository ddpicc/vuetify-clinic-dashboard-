import { asyncRouterMap, constantRouterMap } from '../../../router/index';
export default {
	SET_ROUTERS: (state, routers) => {
		state.addRouters = routers;
		state.routers = constantRouterMap.concat(routers);
	},
}