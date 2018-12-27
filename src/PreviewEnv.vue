<template>
  <div class="env-preview">
    <div v-if="selectedPage&&selectedPage.components">
      <div
        v-for="(comp) in selectedPage.components"
        :key="comp.id"
        class="comp"
        draggable="true"
        keep-alive
      >
        <component
          :key="comp.id"
          v-bind:is="comp.componentViewName"
          :comp="comp"
          :cfg="cfg"
          @clickSheet="onClickSheet"
          keep-alive
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import vueLoading from "vue-loading-template";
import "mint-ui/lib/style.css";
import _h5portal from "./assets/js/h5portal/h5portal";
import _apiHelper from "./assets/js/apiHelper.js";
import eventBus from "./assets/js/eventBus.js";

export default {
  name: "PreviewEnv",

  data: function() {
    return {
      cfg: {},
      selectedPage: undefined,
      homePage: {},
      loading: true
    };
  },
  methods: {
    onClickSheet: function(op) {
      this.selectedPage = op;
    },
    registerComp: function(cb_success) {
      var that = this;

      function regist(compList) {
        _.forEach(compList, function(ch, key) {
          var viewDir = "";
          if (ch.bundleName === null) {
            viewDir = that.sup8._appConf.systemComponentsPath;
          } else {
            viewDir =
              that.sup8._appConf.installComponentsPath +
              ch.bundleName +
              "_" +
              ch.ver +
              "/components/";
          }
          var compViewPath = viewDir + ch.componentViewName;
          Vue.component(
            ch.componentViewName,
            () => import(`${compViewPath}`)
            //import(compViewPath)
          );
        });
      }

      // 待注册的组件列表
      var compList = [
        { name: "导航栏", componentViewName: "CompCell", bundleName: null }
      ];

      _apiHelper.getBaseComponentList(
        that.sup8.portalInfo.NavigatingData,
        undefined,
        function(res) {
          if (res.flag && res.data) {
            that.sup8._baseComponentList = _.concat(compList, res.data);
            regist(that.sup8._baseComponentList);
            cb_success && cb_success();
          }
        },
        function(res) {
          console.log("error", res);
        }
      );
    },

    //获取页面配置并加载
    load: function() {
      var that = this;
      _apiHelper.getConfig(
        that.sup8.portalInfo.NavigatingData,
        that.sup8.codeInfo.EnterpriseNo,
        that.sup8.urlparams.pageid || "",
        function(response) {
          var resData = response.data;
          if (!resData) {
            return;
          }
          that.cfg = resData;
          _.forEach(that.cfg.pages, function(page, i) {
            _.forEach(page.components, function(com, k) {
              com.props = that.convertCompProps(com.props);
            });
          });
          if (
            that.sup8.urlparams.pageid &&
            that.sup8.urlparams.pageid.length > 0
          ) {
            that.selectedPage = _.find(that.cfg.pages, {
              id: that.sup8.urlparams.pageid
            });
          } else if (
            that.sup8.urlparams.ptype &&
            that.sup8.urlparams.ptype.length > 0
          ) {
            that.selectedPage = _.find(that.cfg.pages, {
              type: that.sup8.urlparams.ptype
            });
          } else {
            that.selectedPage = _.find(that.cfg.pages, {
              isHome: true
            });
            if (!that.selectedPage) {
              that.selectedPage = that.cfg.pages[0];
            }
          }
          that.loading = false;
        },
        function(response) {
          console.log(response);
          that.loading = false;
        }
      );
    },
    changeData: function(opt) {
      this._data = _.assign(this._data, opt);
      this.$forceUpdate();
    }
  },
  watch: {
    selectedPage: function(n, o) {
      document.title = n.name;
    }
  },
  beforeCreate: function() {
    let that = this;

    //初始化、整理各种参数
    that.sup8.env = that.sup8._def.env.preview;

    /**
     * 进入这个页面有两种方式：
     * 1.扫描二维码、解码、查找模板、加载模板
     * 2.地址中直接指定模板、加载模板
     */
    //tid:模板编号
    var codeInfo = undefined;
    var portalInfo = undefined;
    if (that.sup8.urlparams.tid) {
      portalInfo = {
        NavigatingData: that.sup8.urlparams.tid
      };
      codeInfo = {
        Querycode: that.sup8.urlparams.code
        // EnterpriseNo:that.sup8.urlparams.eno
      };

      that.sup8.codeInfo = codeInfo;
      that.sup8.portalInfo = portalInfo;
    } else {
    }
  },
  created: function() {
    var that = this;
    if (that.sup8.gotoError) {
      that.$router.push("/error");
    } else {
      that.registerComp(that.load);
      //that.loading = false;
    }
  },
  mounted() {
    console.log("mounted");
    var that = this;
    $("#appx").css("display", "none");

    // 接收来自预览页面的预览数据
    window.addEventListener(
      "message",
      function(e) {
        if (e.data.type === "update") {
          console.log("h5plus:postmessage", e.data);

          var CompNavBar = undefined;
          if (that.selectedPage) {
            CompNavBar = _.find(that.selectedPage.components, {
              componentViewName: "CompNavBar"
            });
          }

          // 更新页面的组件，添加或更新一个组件

          if (
            (e.data.target === "page" && that.selectedPage) ||
            (e.data.target === "CompNavBar" && !CompNavBar && that.selectedPage)
          ) {
            that.selectedPage.components = _.reject(
              that.selectedPage.components,
              { tag: "preview" }
            );
            that.selectedPage.components = _.concat(
              that.selectedPage.components,
              e.data.data
            );
          } else {
            eventBus.publish(
              eventBus.eventKey.previewdataChange,
              e.data.data
            );
          }
        }
      },
      false
    );
  }
};
</script>

<style>
@import "./assets/css/index.css";
</style>

<style>
html {
  /* overflow: hidden; */
  /* overflow:-moz-scrollbars-none; */
}
</style>
