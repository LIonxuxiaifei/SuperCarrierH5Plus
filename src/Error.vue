<template>
  <div class="error">
    <div class="main">
      <img class='error-img' src="http://image.supercarrier8.com/antifaketemplae/error.png" alt="" >
      <div class='msg'>{{sup8.msg||'出错啦！请稍后重试。(101)'}}</div>
      <!-- <div class='msg'>对不起，查无此商品</div> -->
    </div>

    <!-- <div class='copy-right'>
      <img src="http://respic8i.yesno.com.cn/logo/super8/logo_v3.png" alt="">
      <span>由超级8提供技术支持</span>
    </div> -->
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "Error",
  data: function() {
    return {};
  },
  methods: {},
  mounted() {
    document.title = "扫码结果";
    $("#appx").css("display", "none");
  }
};
</script>

<style>
@import "./assets/css/index.css";
</style>
<style scoped>
body {
  margin: 0;
  background-color: f8f8f8;
}

.error-img {
  width: 50%;
  background-color: #f3f3f3;
  border-radius: 50%;
  margin: 30% 25% 5% 25%;
}

.msg {
  font-size: 1rem;
  text-align: center;
  margin-top: 1rem;
  color: #bebebe;
}
</style>
