<template>
  <div class="root" :style='style'>
    <div class="rich"  v-html='content'>

    </div>
  </div>

</template>

<script>
import apiHelper from "../assets/js/apiHelper.js";
import eventBus from "../assets/js/eventBus.js";

export default {
  name: "CompEnterpriseInfo",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      style: {},
      content: ""
    };
  },
  created: function() {
    var that = this;
    // 合并参数是为了当实际属性少于基础属性时 补位
    that.mergeCompProps(that.comp);
    switch (that.sup8.env) {
      case that.sup8._def.env.preview:
        that.selectedPage = _.find(that.cfg.pages, {
          type: that.sup8.context.ptype
        });
        eventBus.$on(that.sup8._def.eventKey.previewdataChange, function(res) {
          that.content = res.content;
        });
        break;
      case that.sup8._def.env.design:
        that.content =
          '<div style=""><h2>企业介绍-假数据</h2><hr><p> 企业介绍</p><img style="width: 100%" src="http://image.supercarrier8.com/antifaketemplae/%E4%BC%81%E4%B8%9A%E4%BB%8B%E7%BB%8D%E5%9B%BE%E7%89%87.png" alt=""></div></div>';
        break;
      case that.sup8._def.env.run:
        apiHelper.getEnterpriseInfo(
          that.sup8.codeInfo.EnterpriseNo,
          that.sup8.portalInfo.NavigatingData,
          function(res) {
            if (res.flag && res.data !== undefined) {
              that.content = res.data;
            }
          },
          function(res) {}
        );
        break;
      default:
        break;
    }

    that.initStyle();
  },
  methods: {
    initStyle() {
      var that = this;
      that.style = {};
      var CompHeader02 = _.find(that.selectedPage.components, {
        componentViewName: "CompHeader02"
      });

      var CompNavBar = _.find(that.selectedPage.components, {
        componentViewName: "CompNavBar"
      });

      switch (that.sup8.env) {
        case that.sup8._def.env.design:
          break;
        case that.sup8._def.env.preview:
          if (CompHeader02) {
            that.style.paddingTop = "70px";
          }
          if (CompNavBar) {
            that.style.paddingBottom = "110px";
          }
          break;
        case that.sup8._def.env.run:
          if (CompHeader02) {
            that.style.paddingTop = "70px";
          }

          if (CompNavBar) {
            that.style.paddingBottom = "130px";
          }
          break;
      }
    }
  },
  mounted: function() {
    console.log("CompEnterpriseInfo:mounted:this.comp", this.comp);
  }
};
</script>

<style scoped>
</style>
