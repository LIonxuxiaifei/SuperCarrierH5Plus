<template>
  <div class="container" :style='style'>
    <div class='rich' v-html="comp.props.content.val" :style='{backgroundColor:comp.props.bgColor.val}'></div>
  </div>
</template>

<script>
import eventBus from "../assets/js/eventBus.js";

export default {
  name: "CompFooter",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      style: {}
    };
  },
  methods: {},
  created() {
    var that = this;
    that.mergeCompProps(that.comp);

    //that.style.backgroundColor = that.comp.props.bgColor.val;

    // 不同模式下的数据展示方式
    that.style = {};
    that.style.backgroundColor = that.comp.props.bgColor.val;
    that.style.padding = "16px 0px";
    that.style.bottom = "0px";
    switch (that.sup8.env) {
      case that.sup8._def.env.preview:
        that.style.position = "fixed";
        that.style.width = "100%";
        that.style.fontSize = "12px";
        that.style.padding = "0px 0px";

        break;
      case that.sup8._def.env.design:
        that.style.fontSize = "12px";
        that.style.padding = "0px 0px";
        break;
      case that.sup8._def.env.run:
        that.style.position = "fixed";
        that.style.width = "100%";
        that.style.padding = "16px 0px";
        that.style.bottom = "0px";

        break;
      default:
        break;
    }
  },
  updated() {
    console.log("rich updated");
  },
  mounted: function() {
    var that = this;
    console.log("richedit::mounted", this.comp);

    eventBus.$on(that.sup8._def.eventKey.hasNavList, function(e) {
      that.style.bottom = "26px";
      that.$forceUpdate();
    });
  }
};
</script>

<style  scoped>
.container {
  line-height: 23px;
  font-weight: normal;
  font-size: 14px;
}

.container .rich p {
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  white-space: nowrap !important;
}
</style>
