<template>
  <div>
    <mt-header :title="comp.props.title.val" :style="{backgroundColor:comp.props.bgColor.val }">
      <mt-button icon="more" slot="right" @click="sheetVisible=true"></mt-button>
    </mt-header>

    <mt-actionsheet :actions="cfg.pages" v-model="sheetVisible"></mt-actionsheet>

  </div>
</template>

<script>
  export default {
    name: "CompHeader",
    props: ["comp", "cfg", "selectedPage"],
    data() {
      return {
        sheetVisible: false,
        selectPageId: "",
        isFixed: false
      };
    },
    methods: {},
    watch: {},
    created: function () {
      var that = this;
      // 合并参数是为了当实际属性少于基础属性时 补位
      that.mergeCompProps(that.comp);

      _.forEach(that.cfg.pages, function (page) {
        page.method = function (data) {
          that.$emit("clickSheet", data);
        }
      });


      that.isFixed = that.sup8.env == that.sup8._def.env.run || that.sup8.env == that.sup8._def.env.preview

    },
    mounted: function () {
      console.log("CompHeader:mounted:this.comp", this.comp);
      var that = this;
    }
  };

</script>

<style>
  body {
    /* background-color: aqua */
  }

</style>
