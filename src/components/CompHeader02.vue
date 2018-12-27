<template>
  <div class="container" :style="style" style="width:100%;background-color:unset">
    <mt-cell title="" style=""  :style="{backgroundColor:comp.props.bgColor.val}">
      <span class="title-text"  :style="styleTitleText">{{comp.props.title.val}}</span>
      <img class="title-logo" :style='styleTitleLogo' slot="icon" :src="model.logoUrl" >
    </mt-cell>

  </div>
</template>

<script>
import apiHelper from "../assets/js/apiHelper.js";
export default {
  name: "CompHeader02",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      style: {},
      styleTitleText: {},
      styleTitleLogo: {},
      selectPageId: "",
      defaultLogoUrl: "http://image.supercarrier8.com/logo/ccn/logo.gif",
      model: { logoUrl: "" }
    };
  },
  methods: {
    getEnterprise() {
      var that = this;
      apiHelper.getEnterprise(that.sup8.context.eno, function(res) {
        if (res.flag && res.data && res.data.logoUrl) {
          that.model.logoUrl = res.data.logoUrl;
        } else {
          that.model.logoUrl = that.defaultLogoUrl;
        }
      });
    }
  },
  watch: {},
  created: function() {
    var that = this;
    // 合并参数是为了当实际属性少于基础属性时 补位
    that.mergeCompProps(that.comp);

    //that.style.backgroundColor = that.comp.props.bgColor.val;

    that.style = {};
    switch (that.sup8.env) {
      case that.sup8._def.env.design:
        that.model.logoUrl = that.defaultLogoUrl;
        that.style.fontSize = "16px";
        that.styleTitleText.fontSize = "14px";
        that.styleTitleLogo.maxWidth = "50%";
        break;
      case that.sup8._def.env.preview:
        that.getEnterprise();
        that.style.position = "fixed";
        that.style.top = 0;
        that.styleTitleText.fontSize = "14px";
        that.styleTitleLogo.maxWidth = "50%";
        break;
      case that.sup8._def.env.run:
        that.getEnterprise();
        that.style.position = "fixed";
        that.style.top = 0;
        that.style.fontSize = "20px";
        break;

      default:
        break;
    }
  },
  mounted: function() {
    console.log("CompHeader:mounted:this.comp", this.comp);
    var that = this;
  }
};
</script>

<style scoped>
.container {
  /* position: fixed;
  top: 0%;
  width: 100%; */
  z-index: 1;
}

.container .mint-cell-wrapper {
  background-origin: unset;
  background-image: unset;
}

.title-text {
  color: #333 !important;
  font-size: 1.2rem;
  font-weight: 700 !important;
  font-family: sans-serif;
}

.title-logo {
  margin: 5px 0;
  max-width: 46%;
  max-height: 60px;
}
</style>
