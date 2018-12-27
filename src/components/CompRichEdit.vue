<template>
  <div class="container" :style="{backgroundColor:comp.props.bgColor.val }">
    <div class='rich' v-html="comp.props.content.val"></div>
  </div>
</template>

<script>
import eventBus from "../assets/js/eventBus.js";

export default {
  name: "CompRichEdit",
  props: ["comp"],
  data() {
    return {

    };
  },
  methods: {},
  created() {
    var that = this;
    that.mergeCompProps(that.comp);

    // 不同模式下的数据展示方式
    switch (that.sup8.env) {
      case that.sup8._def.env.preview:
        break;
      case that.sup8._def.env.design:
      case that.sup8._def.env.run:
        break;
      default:
        break;
    }
  },
  updated(){
    console.log('rich updated');
  },
  mounted: function() {
    console.log('richedit::mounted',this.comp);
    // if (
    //   !this.comp.props.content.val ||
    //   !this.comp.props.content.val.length <= 0
    // ) {
    //   this.comp.props.content.val = "";
    // }
  }
};
</script>