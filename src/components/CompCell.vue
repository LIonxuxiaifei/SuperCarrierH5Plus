<template>
  <div class='root' :class="{'disabled':disabled}">
    <div class='body' @click="onClick('')">
      <mt-cell is-link :title="comp.props.title.val" :label='comp.props.desp.val'>
        <img slot="icon" :src="comp.props.icon.val" width="16" height="16">
        <i class="mint-cell-allow-right"></i>
      </mt-cell>
    </div>
  </div>
</template>

<script>
import eventBus from "../assets/js/eventBus.js";
import { sign, aes } from "../assets/js/cryptoHelper.js";

export default {
  name: "CompCell",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      disabled: false,
      title: "",
      isShowIcon: false,
      link: "",
      popupVisible: false
    };
  },
  methods: {
    onClick: function(e) {
      var that = this;
      switch (that.sup8.env) {
        case that.sup8._def.env.design:
          that.sup8.codeInfo = {
            Code: "1xxxxxxxxxxxxxxx"
          };
          break;
        case that.sup8._def.env.run:
          switch (that.comp.props.linkType.val) {
            case that.sup8._def.linkType.innerPage.value:
              // 之前按照页面编号查找跳转，现改为按照页面类型跳转 -幻视  2018年12月12日 17点08分
              // let newPage = _.find(that.cfg.pages, {
              //   id: that.comp.props.linkVal.val
              // });

              let newPage = _.find(that.cfg.pages, {
                type:that.comp.props.linkVal.val
              });

              if (newPage) {
                that.$emit("changeData", {
                  selectedPage: newPage
                });
              }

              break;
            case that.sup8._def.linkType.outerPage.value:
              var url = that.comp.props.linkVal.val;
              if (url && url.length > 0) {
                url = that.sup8.$utils.replaceUrlParams(url, that.sup8.context);
                if (that.sup8._appConf.sign.open) {
                  url = that.sup8.$utils.generateUrl(url, true, true);
                }
              }

              window.location.href = url;
              break;

            case that.sup8._def.linkType.otherTemplate.value:
              let p = {
                tid: that.comp.props.linkVal.val,
                code: this.sup8.codeInfo.Code || "",
                timestamp: that.sup8.$utils.getTimestamp()
              };

              if ((that.sup8._appConf.sign.open = true)) {
                p.sign = sign(that.sup8._appConf.sign.key, p);
              }

              var paramsStr = "?";
              _.forEach(p, function(value, key) {
                paramsStr += key + "=" + value + "&";
              });

              paramsStr = _.trimEnd(paramsStr, "&");
              window.location.href = location.origin + paramsStr;
              break;
            case that.sup8._def.linkType.customContent.value:
              that.$router.push({
                name: "CustomPage",
                params: {
                  title: that.comp.props.title.val,
                  content: that.comp.props.linkVal.val
                }
              });
              break;
          }
          break;
        default:
          break;
      }
    }
  },
  created: function() {
    var that = this;
    // 合并参数是为了当实际属性少于基础属性时 补位
    that.mergeCompProps(that.comp);

    switch (that.sup8.env) {
      case that.sup8._def.env.design:
        that.sup8.codeInfo = {
          Code: "1xxxxxxxxxxxxxx1"
        };

        break;
      case that.sup8._def.env.run:
        // if(that.sup8._def.linkType.customContent.value==that.comp.props.linkType.val){
        //       that.popupVisible=true;
        // }
        break;
      default:
        break;
    }
  },
  mounted: function() {
    var that = this;
    console.log("CompCell:mounted:this.comp", this.comp);

    eventBus.subscribe("event_disable_comp", function(e) {
      that.disabled = true;
    });

    eventBus.subscribe("event_enable_comp", function(e) {
      that.disabled = false;
    });
  }
};
</script>

<style scoped>
.root {
  background-color: white;
}

/* .root > .body {
  margin: 0 20px;
} */

.mint-cell .mint-cell-wrappe {
  padding: 0 !important;
  background-color: red !important;
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.mint-popup,
.popup-content {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.btn-close {
  background-color: red;
  float: right;
  width: 16px;
  border-radius: 8px;
}
</style>
