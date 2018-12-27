<template>
  <div class="root" :style="style">
    <div class="rich"  v-html='content'>
    </div>
  </div>

</template>

<script>
import apiHelper from "../assets/js/apiHelper.js";
import eventBus from "../assets/js/eventBus.js";

export default {
  name: "CompBrand",
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
        eventBus.subscribe(eventBus.eventKey.previewdataChange, function(res) {
          that.content = res.content;
        });
        break;
      case that.sup8._def.env.design:
        that.content =
          '<div style="margin:10px"><h2>品牌故事-假数据</h2><hr><p> 品牌故事</p><img style="width: 100%" src="http://image.supercarrier8.com/antifaketemplae/%E5%93%81%E7%89%8C%E6%95%85%E4%BA%8B%E5%9B%BE%E7%89%87.png" alt=""></div></div>';
        break;
      case that.sup8._def.env.run:
        if (
          !that.sup8.context.brandContent ||
          !that.sup8.productInfo ||
          !that.sup8.productInfo.BrandId
        ) {
          apiHelper.getProductInfo(
            that.sup8.codeInfo.Code,
            that.sup8.codeInfo.EnterpriseNo,
            that.sup8.portalInfo.NavigatingData,
            that.sup8.codeInfo.ProductId,
            function(res) {
              that.sup8.productInfo = res.data;
              that.productInfo = res.data;

              // 如果没有设置这个值就使用默认的图片
              if (that.sup8.productInfo && that.sup8.productInfo.BrandId) {
                apiHelper.getBrandInfo(
                  that.sup8.productInfo.BrandId,
                  that.sup8.portalInfo.NavigatingData,
                  that.sup8.codeInfo.EnterpriseNo,
                  function(res) {
                    if (
                      res !== undefined &&
                      res.flag === true &&
                      res.data !== undefined
                    ) {
                      that.content = res.data;
                      that.sup8.context.brandContent = that.content;
                    }
                  },
                  function(res) {}
                );
              }
            }
          );
        } else {
          that.content = that.sup8.context.brandContent;
        }

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
    console.log("CompBrand:mounted:this.comp", this.comp);
  }
};
</script>

<style scoped>
</style>
