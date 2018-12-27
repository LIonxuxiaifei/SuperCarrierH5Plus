import Vue from 'vue'
import Router from 'vue-router'
//import RunEnv from '../RunEnv'
//import Error from '../Error'
//import DesignEnv from '../DesignEnv'
//import PreviewEnv from '../PreviewEnv'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'RunEnv',
      //component: RunEnv
     component:(resolve)=>require(['../RunEnv.vue'],resolve)
    },
    {
      path: '/run',
      name: 'RunEnv',
     // component: RunEnv
     component:(resolve)=>require(['../RunEnv.vue'],resolve)
    },
    {
      path: '/design',
      name: 'DesignEnv',
      //component: DesignEnv
      component:(resolve)=>require(['../DesignEnv.vue'],resolve)
    },
    {
      path: '/preview',
      name: 'PreviewEnv',
     // component: PreviewEnv
      component:(resolve)=>require(['../PreviewEnv.vue'],resolve)
    },
    {
      path: '/custompage',
      name: 'CustomPage',
      //component: Error
      component:(resolve)=>require(['../CustomPage.vue'],resolve)
    },
    {
      path: '/error',
      name: 'Error',
      //component: Error
      component:(resolve)=>require(['../Error.vue'],resolve)
    }
  ]
})
