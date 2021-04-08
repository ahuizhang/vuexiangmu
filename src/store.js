import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 存数据
const state = {
  loginuersname: ''
}
// 操作数据函数
const mutations = {
  setloginuersname: function (state, value) {
    state.loginuersname = value
  }
}
const actions = {
  setloginuersnameaction: function ({ commit }, value) {
    commit('setloginuersname', value)
  }
}
const getters = {
  getloginuersname: function (state) {
    return state.loginuersname
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
