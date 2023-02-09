import { asyncRouterMap, constantRouterMap } from '../../../router/index';

function hasPermission(role, route) {
    if (route.meta && route.meta.roles) {
      return route.meta.roles.indexOf(role) >= 0;
    } else {
      return true;
    }
  }
  
  /**
   * 递归过滤异步路由表，返回符合用户角色权限的路由表
   * @param asyncRouterMap
   * @param role
   */
  function filterAsyncRouter(asyncRouterMap, role) {
    const accessedRouters = asyncRouterMap.filter(route => {
      if (hasPermission(role, route)) {
  
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, role);
        }
        return true;
      }
      return false;
    })
    return accessedRouters
  }

export default {
  GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { role } = data;
        let accessedRouters = [];
        if (role.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap;
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        }


        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    },
 
}