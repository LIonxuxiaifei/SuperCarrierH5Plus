// 组件：显示商品简介及企业logo
<template keep-alive>
  <div v-show="show" class="root">
    <div class="header" :style="{backgroundColor:comp.props.bgColor.val }">
      <img
        v-if="productInfo.Thumbnail"
        class="thumbnail"
        :src="sup8.context.logoUrl||productInfo.Thumbnail||defaultLogoUrl"
      >

      <div v-if="productInfo.Name" class="procuct-name" @click="onClick">
        {{productInfo.Name}}
        <i
          class="mint-cell-allow-right"
          style="position: relative;right: -35px"
        ></i>
      </div>
      <div class="enterprise-name">
        <img src="http://image.supercarrier8.com/icon/accepted.png" alt>
        {{sup8.urlparams.ename||sup8.context.ename||productInfo.EnterpriseName}}
      </div>
    </div>
    <div v-if="productInfo.ImgUrl" class="content">
      <img :src="productInfo.ImgUrl||''" alt>
    </div>

    <div class="footer" v-if="productInfo.Intro">
      <mt-cell title="商品简介"></mt-cell>
      <div v-if="productInfo.Intro" class="intro">{{productInfo.Intro}}</div>
    </div>
  </div>
</template>
<script>
import apiHelper from "../assets/js/apiHelper.js";
import eventBus from "../assets/js/eventBus.js";
export default {
  name: "CompProduct01",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      show: true,
      productInfo: {
        Name: "",
        Thumbnail: "",
        EnterpriseName: "",
        ImgUrl: ""
      },
      defaultLogoUrl: "http://image.supercarrier8.com/logo/super8/logo_v3.png"
    };
  },
  methods: {
    onClick: function(e) {
      var that = this;
      switch (that.sup8.env) {
        case that.sup8._def.env.design:
          break;
        case that.sup8._def.env.run:
          switch (that.comp.props.linkType.val) {
            case that.sup8._def.linkType.innerPage.value:
              let newPage = _.find(that.cfg.pages, {
                id: that.comp.props.linkVal.val
              });
              that.$emit("changeData", {
                selectedPage: newPage
              });
              break;
            case that.sup8._def.linkType.outerPage.value:
              window.location.href = that.comp.props.linkVal.val;
              break;
            case that.sup8._def.linkType.otherTemplate.value:
              window.location.href = that.comp.props.linkVal.val;
              window.location.href =
                location.origin +
                "?tid=" +
                that.comp.props.linkVal.val +
                "&code=" +
                this.sup8.codeInfo.Querycode;
              break;
          }
          break;
        default:
          break;
      }
    },

    getEntersprise() {
      var that = this;

      if (that.sup8.context.logourl) {
        that.productInfo = that.productInfo || {};
        that.productInfo.EnterpriseName =
          that.productInfo.EnterpriseName || that.sup8.context.ename;
        that.productInfo.Thumbnail =
          that.productInfo.Thumbnail || that.sup8.context.logourl;
        return;
      }

      apiHelper.getEnterprise(that.sup8.context.eno, function(res) {
        console.log(res);

        if (res.flag && res.data) {
          that.productInfo.Thumbnail = res.data.logoUrl||that.defaultLogoUrl;
          res.data.ename = res.data.name;
          that.sup8.$utils.updateContext(that.sup8.context, res.data);
        } 


        that.$forceUpdate();
      });
    },

    init(isForce) {
      var that = this;
      switch (that.sup8.env) {
        case that.sup8._def.env.design:
        case that.sup8._def.env.preview:
          that.show = true;
          that.sup8.productInfo = {
            Code: "",
            ProductId: "p001",
            BrandId: "b001",
            Name: "降噪蓝牙耳机",
            EnterpriseName: "上海中商网络",
            Thumbnail: "http://image.supercarrier8.com/product/earphone/sm.png",
            ImgUrl: "http://image.supercarrier8.com/product/earphone/1.png",
            Intro:
              "更优秀的音量优化处理技术，配载双麦克风降噪系统，让你随时尽享清晰通话，把我每一个关键信息",
            //http://image.supercarrier8.com/product/coffee/1.jpg
            RichText:
              '<p>可在此处编辑更多信息<img src="http://image.supercarrier8.com/antifaketemplae/%E5%95%86%E5%93%81%E4%BB%8B%E7%BB%8D%E5%9B%BE%E7%89%87.png" style="max-width: 100%;"></p>',
            Parameters: [
              {
                Key: "品牌",
                Value: "降噪蓝牙耳机"
              },
              {
                Key: "名称",
                Value: "RP-HD605N"
              },
              {
                Key: "产地",
                Value: "中国"
              },
              {
                Key: "规格",
                Value: "3.5mm"
              }
            ]
          };

          that.productInfo = that.sup8.productInfo;

          break;
        case that.sup8._def.env.run:
          that.productInfo.EnterpriseName = that.sup8.codeInfo.EnterpriseName;
          // 查询数据集中是否有产品信息，如果没有再查一次
          if (isForce || that.sup8.productInfo === undefined) {
            apiHelper.getProductInfo(
              that.sup8.codeInfo.Code,
              that.sup8.codeInfo.EnterpriseNo,
              that.sup8.portalInfo.NavigatingData,
              that.sup8.codeInfo.ProductId,
              function(res) {
                if (res.flag) {
                  that.sup8.productInfo = res.data;
                  that.productInfo = res.data;
                  that.productInfo.EnterpriseName =
                    that.sup8.codeInfo.EnterpriseName;

                  if (res.data.Thumbnail) {
                    that.productInfo.Thumbnail = res.data.Thumbnail;
                  } else {
                    that.getEntersprise();
                  }

                  that.show = true;
                }
              }
            );
            that.getEntersprise();
          } else {
            that.productInfo = that.sup8.productInfo;
            that.productInfo.EnterpriseName =
              that.productInfo.EnterpriseName || that.sup8.context.ename;
            that.productInfo.Thumbnail =
              that.productInfo.Thumbnail || that.sup8.context.logourl;
          }

          that.getEntersprise();

          break;
        default:
      }
    }
  },
  created: function() {
    console.log("CompProduct01.1:created");
    var that = this;
    that.mergeCompProps(that.comp);

    that.init();
  },
  mounted: function() {
    console.log("CompProduct01:mounted:this.comp", this.comp);
    var that = this;
    //that.productInfo.EnterpriseName=that.sup8.urlparams.ename;

    // 订阅事件
    eventBus.subscribe(eventBus.eventKey.pruductChange, function(e) {
      that.init(true);
      that.show = true;
    });

    eventBus.subscribe(eventBus.eventKey.antifakeFalse, function(e) {
      that.show = false;
    });
  }
};
</script>
<style scoped>
.root {
  background-color: white;
  margin-bottom: 10px;
}

.root .header {
  background-color: #362918;
  text-align: center;
  padding: 20px;
}

.root .header .thumbnail {
  height: 50px;
  width: 50px;
  background-color: white;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
}

.root .header .procuct-name {
  color: white;
  font-size: 1.2rem;
  margin: 10px;
}

.root .header .enterprise-name {
  color: #bab1a5;
  font-size: 0.8rem;
}

.root .header .enterprise-name img {
  width: 18px;
  padding-top: 5px;
  position: relative;
  top: 3px;
}

.root .content {
  padding: 10px;
}

.root .content img {
  width: 100%;
  background: white;
}

.root .footer .intro {
  padding: 0 10px 10px;
  font-size: 1rem;
  color: #898989;
  line-height: 22px;
}

/* .root .footer .title {
  margin-bottom: 4px;
  
} */
</style>
