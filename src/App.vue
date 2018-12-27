<template>
    <div>
    <router-view/>
  </div>
</template>

<script>
  import Vue from "vue";
  import utils from "./assets/js/utils";
  import _def from "./assets/js/define";
  import _appConf from "./app.conf";

  export default {
    name: "App",
    data: function () {
      return {
        loading: true
      };
    },
    beforeCreate() {
      // 进入页面后先整理一些参数
      var that = this;
      let sup8 = {
        _def: _def,
        _appConf: _appConf,
        env: _def.env.run,
        permissionLevel: 1,
        urlparams: utils.parseUrl(),
        $utils: utils,
        queryEventId:undefined // 解码、查防伪要使用同一个eventid 用于记日志
      };
      sup8.role = _.find(sup8._def.role, {
        code: sup8.urlparams.role
      }) || {
        permissionLevel: 1
      };

      utils.setAppKey();

      // 系统产生一些上下文参数，所有组件都可以使用
      sup8.context=sup8.$utils.updateContext(sup8.context,sup8.urlparams);
      Vue.prototype.sup8 = sup8;
    },
    mounted() {
      this.loading = false;
    }
  };

</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

</style>

