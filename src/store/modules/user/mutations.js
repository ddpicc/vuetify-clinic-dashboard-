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
	SET_ROLES: (state, role) => {
		state.role = role;
	},
	SET_PREFIX: (state, prefix) => {
		state.dbs_prefix = prefix;
	},
	SET_USERID: (state, user_id) => {
		state.user_id = user_id;
	},
	LOGIN_SUCCESS: () => {
		console.log('login success')
	}
}