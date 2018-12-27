<template>
  <div class='env-run'>
    <div class="rich" v-html="content">
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import "mint-ui/lib/style.css";


export default {
  name: "CustomPage",
  data: function() {
    return {
      title: "hello",
      content:''
    };
  },
  methods: {

  },
  watch: {
  },
  mounted() {
    var that = this;
    document.title = that.$route.params.title; 
    that.content=decodeURIComponent(that.$route.params.content);
  }
};
</script>
<style>
@import "./assets/css/index.css";
</style>
<style scoped>

</style>
