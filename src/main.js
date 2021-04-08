import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router/router.js'
import store from './store.js'
// 样式文件
import '@/styles/index.less'
Vue.use(ElementUI)
Vue.config.productionTip = false
// 设置前置导航守卫
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('vue_xiangmu_token')
  if (token || to.name === 'login') {
    next()
  } else if (!token && to.name !== 'login') {
    next({ name: 'login' })
  }
})
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
