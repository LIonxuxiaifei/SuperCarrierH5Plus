<template>
  <div class="bg">
    <mt-cell title="名称" :label="comp.baseCompName||comp.name" ></mt-cell>
    <mt-cell title="版本" :label="comp.ver" ></mt-cell>
    <mt-cell title="描述" label="调用简单接口" ></mt-cell>
    <!-- <mt-cell title="属性1" :label="comp.props.Content1.val" ></mt-cell>
    <mt-cell title="属性2" :label="comp.props.Content2.val" ></mt-cell> -->
    <mt-cell title="接口状态" :label="msg" ></mt-cell>
  </div>
</template>

<script>
import "../assets/style-testcomp1.css";
import $ from "jquery";
import _conf from "../assets/conf";

export default {
  name: "CustomComp2",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return { msg: "" };
  },
  methods: {
    render: function() {
      var that = this;
      switch (that.sup8.env) {
        case that.sup8._def.env.design:
          that.msg = "用于显示接口的执行结果";
          break;
        case that.sup8._def.env.run:
          var params = {
            appkey: sessionStorage.appkey,
            accesstoken: sessionStorage.accesstoken
          };

          $.ajax({
            url: _conf.url_emptyapi,
            data: params,
            type: "post",
            dataType: "json",
            success: function(res) {
              that.msg = JSON.stringify(res);
            },
            error: function() {
              that.msg = "请求失败";
            }
          });
          break;

        default:
          break;
      }
    }
  },
  mounted: function() {
    console.log("TestComp2:mounted:this.comp", this.comp);
    var that = this;
    that.render();
  }
};
</script>
