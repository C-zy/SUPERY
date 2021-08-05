import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		calendar:null,//每日放送
		time:null,//时间
	},
    mutations: {},
    actions: {}
})
export default store