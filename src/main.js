import Vue from 'vue'
import store from './store'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router/index'

Vue.use(VueRouter)

import '@/assets/scss/main.scss'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
