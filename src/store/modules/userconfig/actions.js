import axios from 'axios';

export default {
  loadUserSetting ({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getUserSetting', {
        params: {
          userid: rootState.user.user_id
        }
      }).then(response => {
        const settings = (response.data && response.data[0]) || {}
        commit('SET_USER_SETTING', settings)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
