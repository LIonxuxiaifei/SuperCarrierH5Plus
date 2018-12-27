<template>
  <div class="bg">
    <mt-cell title="名称" :label="comp.baseCompName||comp.name" ></mt-cell>
    <mt-cell title="版本" :label="comp.ver" ></mt-cell>
    <mt-cell title="描述" :label="'不调用接口'" ></mt-cell>
    <mt-cell title="属性1" :label="comp.props.Content1.val" ></mt-cell>
    <mt-cell title="属性2" :label="comp.props.Content2.val" ></mt-cell>
  </div>
</template>

<script>
import "../assets/style-testcomp1.css";
import $ from "jquery";

export default {
  name: "CustomComp1",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return { msg: "" };
  },
  methods: {
    render: function() {
      var that = this;
      switch (that.sup8.env) {
        case that.sup8._def.env.design:
          break;
        case that.sup8._def.env.run:
          break;
        default:
          break;
      }
    }
  },
  mounted: function() {
    console.log("TestComp1:mounted:this.comp", this.comp);
    var that = this;
    that.render(); that.render();
  }
};
</script>
