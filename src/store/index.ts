import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import modules from './modules'
import states from './state'
Vue.use(Vuex)
export function createStore(){
  return new Vuex.Store({
    state:states,
    getters,
    actions,
    mutations,
    modules
  })
}
