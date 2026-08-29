export default {
  displayYaowan: state => state.settings.displayYaowan == null ? true : Boolean(state.settings.displayYaowan),
  displayProfit: state => Boolean(state.settings.displayProfit),
  displayLessMenu: state => Boolean(state.settings.displayLessMenu),
  defaultDoctor: state => state.settings.defaultDoctor || '',
}
