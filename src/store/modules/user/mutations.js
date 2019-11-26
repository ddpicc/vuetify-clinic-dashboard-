export default {
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_NAME: (state, name) => {
		state.name = name;
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar;
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles;
	},
	SET_PREFIX: (state, prefix) => {
		state.dbs_prefix = prefix;
	},
	LOGIN_SUCCESS: () => {
		console.log('login success')
	}
}