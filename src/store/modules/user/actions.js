import axios from 'axios';
import Cookies from 'js-cookie';

export default {
	LoginByEmail({ commit }, userInfo) {
		const username = userInfo.username.trim();
		const password = userInfo.password.trim();
		return new Promise((resolve, reject) => {
			axios.get('/api/getTokenFromLogin',{
				params: {
					username : username,
					password : password,
					}
				}).then(response => {
				const data = response.data;
				//Cookies.set('Admin-Token', data[0].token,{expires: 1});
				Cookies.set('Admin-Token', data[0].token);
				commit('SET_TOKEN', data[0].token);
				resolve();
			}).catch(error =>{
				reject(error);
			});
		});
	},


	// 获取用户信息
	GetInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			axios.get('/api/getUserInfo',{
				params: {
					token : state.token
					}
				}).then(response => {
				const data = response.data;
				commit('SET_ROLES', data[0].role);
				commit('SET_PREFIX',data[0].dbs_prefix);
				commit('SET_USERID',data[0].id);
				resolve(response);
			}).catch(error => {
				reject(error);
			});
		});
	},

	// 第三方验证登录
	LoginByThirdparty({ commit, state }, code) {
		return new Promise((resolve, reject) => {
			commit('SET_CODE', code);
			loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
				commit('SET_TOKEN', response.data.token);
				Cookies.set('Admin-Token', response.data.token);
				resolve();
			}).catch(error => {
				reject(error);
			});
		});
	},


	// 登出
	LogOut({ commit, state }) {
		return new Promise((resolve, reject) => {
			logout(state.token).then(() => {
				commit('SET_TOKEN', '');
				commit('SET_ROLES', []);
				Cookies.remove('Admin-Token');
				resolve();
			}).catch(error => {
				reject(error);
			});
		});
	},

	// 前端 登出
	FedLogOut({ commit }) {
		return new Promise(resolve => {
			commit('SET_TOKEN', '');
			commit('SET_ROLES', []);
			Cookies.remove('Admin-Token');
			resolve();
		});
	},

	// 动态修改权限
	ChangeRole({ commit }, role) {
		return new Promise(resolve => {
			commit('SET_ROLES', [role]);
			commit('SET_TOKEN', role);
			Cookies.set('Admin-Token', role);
			resolve();
		})
	}
}