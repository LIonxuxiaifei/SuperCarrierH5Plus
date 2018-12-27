<template>
<div class="root">
  <img  src="http://respic8.yesno.com.cn/logo/super8/logo.png"  :style="{'height':comp.props.height.val}"/>
</div>

</template>

<script>
export default {
  name: "CompImg",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      isShowIcon: false,
      link: ""
    };
  },
  created: function() {
    var that = this;
    // 合并参数是为了当实际属性少于基础属性时 补位
    that.mergeCompProps(that.comp);

    switch (that.sup8.env) {
      case that.sup8._def.env.design:
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
</style>
