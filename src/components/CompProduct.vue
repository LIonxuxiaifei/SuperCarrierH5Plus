<template>
  <div class="root" :style="style">
    <div class="header">
      <img v-if="productInfo.ImgUrl" :src="productInfo.ImgUrl" alt srcset>
      <mt-cell :title="productInfo.Name||''"></mt-cell>
    </div>
    <div>
      <mt-cell title="商品介绍"></mt-cell>
      <mt-cell
        v-for="(item,index) in productInfo.Parameters"
        :title="item.Key+'：'+(item.Value?item.Value:'-')"
        :key="index"
      ></mt-cell>
    </div>
    <div class="rich" v-html="productInfo.RichText||''"></div>
  </div>
</template>
<script>
import apiHelper from "../assets/js/apiHelper.js";
import eventBus from "../assets/js/eventBus.js";
export default {
  name: "CompProduct",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      style: {},
      productInfo: {
        ImgUrl: "",
        Name: "",
        Parameters: []
      },
      fakeData: {
        Code: "",
        ProductId: "p001",
        BrandId: "b001",
        Name: "降噪蓝牙耳机-测试",
        ImgUrl:
          "http://image.supercarrier8.com/antifaketemplae/%E6%AD%A3%E5%93%81%E5%9B%BE%E7%89%87.png",
        RichText:
          '<p>可在此处编辑更多信息(测试)<img src="http://image.supercarrier8.com/antifaketemplae/%E5%95%86%E5%93%81%E4%BB%8B%E7%BB%8D%E5%9B%BE%E7%89%87.png" style="max-width: 100%;"></p>',
        Parameters: [
          {
            Key: "产品名称",
            Value: "降噪蓝牙耳机"
          },
          {
            Key: "产品分类",
            Value: "RP-HD605N"
          },
          {
            Key: "品牌",
            Value: "HS-x"
          },
          {
            Key: "型号",
            Value: "1115-165"
          },
          {
            Key: "规格",
            Value: "3.5mm"
          }
        ]
      }
    };
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
  created: function() {
    console.log("CompProduct:created");
    var that = this;
    that.mergeCompProps(that.comp);
    switch (that.sup8.env) {
      case that.sup8._def.env.preview:
        that.selectedPage = _.find(that.cfg.pages, {
          type: that.sup8.context.ptype
        });
        that.productInfo.ImgUrl = that.fakeData.ImgUrl;
        that.productInfo.Name = that.fakeData.Name;
        eventBus.$on(that.sup8._def.eventKey.previewdataChange, function(res) {
          that.productInfo.Parameters = res.Parameters;
          if (res.ImgUrl) {
            that.productInfo.ImgUrl = res.ImgUrl;
          }
          that.productInfo.RichText = res.Content;
        });
        break;
      case that.sup8._def.env.design:
        that.sup8.productInfo = that.fakeData;
        break;
      case that.sup8._def.env.run: // 查询数据集中是否有产品信息，如果没有再查一次
        if (!that.sup8.productInfo) {
          apiHelper.getProductInfo(
            that.sup8.codeInfo.Code,
            that.sup8.codeInfo.EnterpriseNo,
            that.sup8.portalInfo.NavigatingData,
            that.sup8.codeInfo.ProductId,
            function(res) {
              that.sup8.productInfo = res.data;
              that.productInfo = res.data;
            }
          );
        } else {
          that.productInfo = that.sup8.productInfo;
        }
        break;
      default:
    }

    that.initStyle();
  },
  mounted: function() {
    console.log("CompProduct:mounted:this.comp", this.comp);
    var that = this;
  }
};
</script>
<style scoped>
.root img {
  width: 100%;
}

.root .header {
  margin-bottom: 15px;
}
</style>
