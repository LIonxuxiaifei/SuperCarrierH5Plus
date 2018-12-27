<template>
  <div class="env-run">
    <div class="main" v-show="!loading" id="mainx" v-if="selectedPage&&selectedPage.components">
      <component
        v-for="comp in selectedPage.components"
        :key="comp.id"
        v-bind:is="comp.componentViewName"
        :comp="comp"
        :cfg="cfg"
        :selectedPage="selectedPage"
        @clickSheet="onClickSheet"
        @changeData="changeData"
        keep-alive
      ></component>
    </div>
    <!-- <div class='copy-right'>
      <img src="http://image.supercarrier8.com/logo/super8/logo_v3.png" alt="">
      <span>由超级8提供技术支持</span>
    </div>-->
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import "mint-ui/lib/style.css";
import _stringResource from "./assets/js/stringResource.js";
import _h5portal from "./assets/js/h5portal/h5portal";
import _apiHelper from "./assets/js/apiHelper.js";
import { sign } from "./assets/js/cryptoHelper.js";
import _gis from "./assets/js/location-common.js";
import eventBus from "./assets/js/eventBus.js";

export default {
  name: "RunEnv",
  data: function() {
    return {
      cfg: {},
      selectedPage: undefined,
      homePage: {},
      loading: false,
      history: [] // 页面浏览历史
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
    changeData: function(opt) {
      this._data = _.assign(this._data, opt);
      this.$forceUpdate();
    },

    getGeo() {
      let gis = new _gis();
      $("#load_msg").text("定位中...");
      gis.getGeo(function(res) {
        that.sup8.UA.geo = res;
        sessionStorage.gps = res.latitude + "," + res.longitude;
      });

      // return new Promise(function(resolve, reject) {
      //   if (true) {
      //     resolve("11111");
      //   } else {
      //     reject(err);
      //   }
      // });
    },

    // 获取入口信息
    getPortal() {
      /**
       * 进入这个页面有两种方式：
       * 1.扫描二维码、解码、查找模板、加载模板
       * 2.地址中直接指定模板、加载模板
       */
      //tid:模板编号
      var that = this;
      var codeInfo = {};
      var portalInfo = {};
      if (that.sup8.urlparams.tid) {
        if (that.sup8._appConf.sign.open === true) {
          // 校验签名
          let signStr = sign(that.sup8._appConf.sign.key, that.sup8.urlparams);
          if (signStr != that.sup8.urlparams.sign) {
            that.sup8.gotoError = true;
            that.sup8.msg = "链接已失效，请更新后重试。(107)";
            return;
          }
        }

        portalInfo = {
          NavigatingData: that.sup8.urlparams.tid
        };

        codeInfo = {
          //Querycode: that.sup8.urlparams.code
          Code: that.sup8.urlparams.code,
          EnterpriseNo: that.sup8.urlparams.eno,
          ProductId: that.sup8.urlparams.pid
        };
        that.sup8.codeInfo = codeInfo;
        that.sup8.portalInfo = portalInfo;
      } else {
        // 查询数码,解码
        _apiHelper.decodeUrl(
          window.location.href,
          function(res) {
            that.sup8.codeInfo = res.data || {};

            that.sup8.$utils.updateContext(
              that.sup8.context,
              that.sup8.codeInfo
            );
            //记录解码时的错误码，查防伪的时候会用到
            that.sup8.context.decodestatus = res.errorCode || "";
            portalInfo = _h5portal.getPortal(that.sup8.codeInfo);

            if (
              !portalInfo ||
              !portalInfo.flag ||
              !portalInfo.data.NavigatingData
            ) {
              that.sup8.gotoError = true;
              that.sup8.msg = res.msg;
            }

            that.sup8.portalInfo = portalInfo.data;
            if (portalInfo && portalInfo.flag === true) {
              switch (portalInfo.data.PortalType) {
                // 第三方的要跳出去
                case that.sup8._def.portalType.third.code:
                  window.open(portalInfo.data.NavigatingData, "_parent");
                  break;
                default:
                  that.sup8.$utils.updateContext(that.sup8.context, {
                    tid: portalInfo.data.NavigatingData
                  });
                  break;
              }
            } else {
              debugger;
              that.sup8.gotoError = true;
              that.sup8.msg = _stringResource.notFountTemplate;
              that.$router.push("/error");
              return;
            }
            $("#appx").css("display", "none");
            if (that.sup8.gotoError) {
              that.$router.push("/error");
            } else {
              that.registerComp(that.load);
            }
          },
          function(e) {
            that.sup8.msg = "网络异常，请稍后重试";
            that.$router.push("/error");
            $("#appx").css("display", "none");
          }
        );
      }
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
    }
  },
  watch: {
    selectedPage: function(n, o) {
      document.title = n.name; //this
      n.historyIndex = this.history.length;
      this.history.push(n);
      var url = location.href;
      window.history.pushState(
        {
          title: document.title + n.id,
          url: url
        },
        document.title + n.id,
        url
      );
      console.log("watch::selectedPage");
    }
  },
  beforeCreate: function() {
    let that = this; //初始化、整理各种参数
    that.sup8.env = that.sup8._def.env.run;
  },
  created: function() {
    var that = this;

    //获取用户设备、地理信息
    that.sup8.UA = {
      ua: navigator.userAgent,
      geo: {}
    };

    // 如果已经有定位信息，不再次定位
    if (!sessionStorage.gps) {
      let gis = new _gis();
      $("#load_msg").text("定位中...");

      if (that.sup8._appConf.debug) {
        that.sup8.UA = {};
        var res = { latitude: "31.86694226", longitude: "117.28269909" };
        that.sup8.UA.geo = res;
        sessionStorage.gps = res.latitude + "," + res.longitude;
        that.getPortal();
      } else {
        gis.getGeo(function(res) {
          that.sup8.UA.geo = res;
          sessionStorage.gps = res.latitude + "," + res.longitude;
          that.getPortal();
        });
      }
    }

    //监控浏览器返回事件
    "pushState" in window.history &&
      setTimeout(function() {
        window.addEventListener("popstate", function(e) {
          if (that.history.length > 1) {
            var tempPage = undefined;
            try {
              if (that.selectedPage.historyIndex) {
                tempPage = _.cloneDeep(
                  that.history[that.selectedPage.historyIndex - 1]
                );
              } else {
                tempPage = _.cloneDeep(
                  that.history[that.selectedPage.length - 2]
                );
              }

              tempPage.back = true; // 表示是按返回键返回的页面
              that.selectedPage = tempPage;
            } catch (error) {
              alert("popstate error");
            }

            return false;
          } else {
            return true;
          }
        });
      }, 1000);
  },
  mounted() {
    var that = this;

    eventBus.subscribe("test", data => {
      console.log("eventBus", data);
    });

    // todo:发送事件
    eventBus.publish("test", "test1");
  }
};
</script>
<style>
@import "./assets/css/index.css";
</style>
<style scoped>
body {
  margin: 0;
  background: #f8f8f8;
  font-family: "方正圆体" !important;
  font-weight: 100 !important;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.comp {
  position: relative;
  width: 100%;
}
</style>
