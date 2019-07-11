import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Wellcome from '../views/Wellcome.vue'
import Users from '../views/Users/Users.vue'
import jueSe from '@/views/roles/jueSe.vue'
import quanXian from '@/views/roles/quanXian.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/List.vue'
import Add from '@/views/goods/Add.vue'
import Reports from '@/views/Reports/reports.vue'
Vue.use(VueRouter)
var router = new VueRouter({
  routes: [
    { path: '/', redirect: { path: '/login' } },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { path: '/home/wel' },
      children: [
        { name: 'wel',
          path: 'wel',
          component: Wellcome },
        { name: 'users',
          path: 'users',
          component: Users },
        { name: 'juese',
          path: 'roles',
          component: jueSe },
        { name: 'quanxian',
          path: 'rights',
          component: quanXian },
        { name: 'goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'list' },
          children: [
            { name: 'list',
              path: 'lists',
              component: List },
            { name: 'add',
              path: 'Add',
              component: Add }
          ] },
        // 数据表
        { name: 'reports', path: 'reports', component: Reports }
      ]
    }
  ]
})

export default router
