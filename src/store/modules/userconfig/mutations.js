export default {
  SET_USER_SETTING (state, settings) {
    state.settings = settings || {}
  },
  PATCH_USER_SETTING (state, patch) {
    state.settings = Object.assign({}, state.settings, patch)
  }
}
