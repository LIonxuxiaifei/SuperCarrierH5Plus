<template>
<div class="root">
  <img v-if="showImg"  :src="comp.props.url.val"  />
</div>

</template>

<script>
import apiHelper from "../assets/js/apiHelper.js";

export default {
  name: "CompImg",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return { showImg: false };
  },
  created: function() {
    var that = this;
    // 合并参数是为了当实际属性少于基础属性时 补位
    that.mergeCompProps(that.comp);
    switch (that.sup8.env) {
      case that.sup8._def.env.design:
        that.showImg=true;
        break;
      case that.sup8._def.env.run:
        // 如果没有设置这个值就使用默认的图片
        apiHelper.getBgImg(
          that.sup8.codeInfo.enterpriseId,
          function(res) {
            if (
              res !== undefined &&
              res.flag === true &&
              res.data !== undefined
            ) {
              that.comp.props.url.val = res.data.imgUrl;
              that.showImg=true;
            }
          },
          function(res) {}
        );

        break;
      default:
        break;
    }
  },
  methods: {},
  mounted: function() {
    console.log("CompImg:mounted:this.comp", this.comp);
    
  }
};
</script>

<style scoped>
.root {
  background-color: black;
  /* text-align: right */
}

.root img {
  width: 100%;
}
</style>
