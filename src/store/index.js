import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'

import mutations from './mutations'
import actions from './actions'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user
  },
  getters,
  mutations,
  actions
})

export default store
