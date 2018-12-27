<template>
  <div class="root" :style="style">
    <div>
      <strong>尊敬的用户您好：</strong>
      <br>
      <span v-if="antifakeInfo.Code">您查询的数码为：{{antifakeInfo.Code}}</span>
      <br>
      <div v-html="antifakeInfo.Content"></div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import apiHelper from "../assets/js/apiHelper.js";
import eventBus from "../assets/js/eventBus.js";
import _stringResource from "../assets/js/stringResource.js";
import { Toast } from "mint-ui";
// import func from "./vue-temp/vue-editor-bridge.js";

export default {
  name: "CompAntiFake01",
  props: ["comp", "cfg", "selectedPage", "sup88"],
  data() {
    return {
      style: {},
      title: "",
      code: "",
      showInput: false,
      antifakeInfo: {
        Code: "",
        Result: true,
        Content: "正在查询，请稍后..."
      }
    };
  },
  methods: {
    searchAntifake(codeInfo) {
      var that = this;

      // if (!codeInfo) {
      // } else
      {
        that.sup8.codeInfo = codeInfo;
        // 如果不是合法的防伪码，不查防伪
        // if (!codeInfo.Code) {
        //   return;
        // }

        that.antifakeInfo.Code = codeInfo.Code;

        // 表示查询的是不是一个新的产品
        var isNewProduct = that.sup8.codeInfo.ProductId !== codeInfo.ProductId;
        apiHelper.getAntifakeInfo(
          codeInfo.EnterpriseNo,
          codeInfo.ProductId,
          codeInfo.Code,
          that.sup8.UA.geo.latitude + "," + that.sup8.UA.geo.longitude ||
            that.sup8.UA.ip.cip,
          that.sup8.context.decodestatus,
          that.sup8.codeInfo.LabelNo,
          function(res) {
            if (res.flag === true && that.antifakeInfo.Result === true) {
              that.antifakeInfo = res.data;
              that.sup8.antifakeInfo = res.data;

              // eventBus.publish("event_enable_comp", "防伪查询正确数码");

              // if (isNewProduct) {
              //   eventBus.publish(eventBus.eventKey.pruductChange);
              // }

              // eventBus.publish(eventBus.eventKey.antifakeTrue, {
              //   isNewProduct: isNewProduct,
              //   msg: "防伪查询正确数码"
              // });
            } else {
              // that.antifakeInfo = {
              //   Result: true,
              //   Content: res.msg || "未查询到该码的信息，谨防假冒"
              // };
            }

            that.antifakeInfo.Code = codeInfo.Code;
          },
          function(res) {
            that.antifakeInfo = {
              Result: true,
              Content: res.msg || "未查询到该码的信息，谨防假冒"
            };
          }
        );
      }
    },
    render: function() {
      var that = this;
      switch (that.sup8.env) {
        case that.sup8._def.env.preview:
          break;
        case that.sup8._def.env.run:
          that.searchAntifake(that.sup8.codeInfo);
          break;
        default:
          break;
      }
    },
    initStyle() {
      var that = this;
      that.style = {};
      var CompHeader02 = _.find(that.selectedPage.components, {
        componentViewName: "CompHeader02"
      });

      var CompNavBar = _.find(that.selectedPage.components, {
        componentViewName: "CompNavBar"
      });

      that.style = {
        paddingTop: "0"
      };
      switch (that.sup8.env) {
        case that.sup8._def.env.design:
          break;
        case that.sup8._def.env.preview:
          if (CompHeader02) {
            that.style.paddingTop = "100px";
          }
          if (CompNavBar) {
            that.style.paddingBottom = "110px";
          }
          break;
        case that.sup8._def.env.run:
          if (CompHeader02) {
            that.style.paddingTop = "100px";
          }

          if (CompNavBar) {
            that.style.paddingBottom = "130px";
          }
          break;
      }
    }
  },

  created: function() {
    var that = this;
    that.mergeCompProps(that.comp);

    switch (that.sup8.env) {
      case that.sup8._def.env.design:
      case that.sup8._def.env.preview:
        that.antifakeInfo = {
          Code: "xxxxxxxxxxxxxxx",
          Result: true,
          Content: "您查询的为正品"
        };

        that.selectedPage =
          that.selectedPage ||
          _.find(that.cfg.pages, {
            type: that.sup8.context.ptype || "1"
          });

        break;
      case that.sup8._def.env.run:
        break;
      default:
        break;
    }

    that.initStyle();
  },

  mounted: function() {
    console.log("CompAntiFake:mounted:this.comp", this.comp);
    var that = this;
    if (that.sup8.antifakeInfo) {
      that.antifakeInfo = that.sup8.antifakeInfo;
    } else {
      that.render();
    }
  }
};
</script>

<style scoped>
.root {
  padding: 1em;
  color: #606060;
}
</style>
