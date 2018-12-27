<template>
  <div>
    <img class="img-bg" :src="comp.props.bgImg.val">
    <img id="btn_shouming" :src="imgRes.活动说明按钮" @click.prevent="shouming">
    <img id="btn_canyu" :src="imgRes.参与抽奖按钮" @click.prevent="choujiang">

    <!-- 活动说明弹框 -->
    <mt-popup v-model="showPopup_shouming" position="right">
      <img :src="comp.props.imgDes.val" @click.prevent="hideAllPopup">
    </mt-popup>

    <!-- 未中奖弹框 -->
    <mt-popup v-model="showPopup_result_no" position="right">
      <img :src="imgRes.未中奖" @click.prevent="hideAllPopup">
    </mt-popup>

    <!-- 领取成功弹框 -->
    <mt-popup v-model="showPopup_result_yes" position="right">
      <img :src="imgRes.领取成功" @click.prevent="hideAllPopup">
    </mt-popup>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "CompActivity",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      imgRes: {
        活动说明按钮:
          "http://respic8.yesno.com.cn/activity/%E6%B4%BB%E5%8A%A8%E8%AF%B4%E6%98%8E%E6%8C%89%E9%92%AE.png",
        参与抽奖按钮:
          "http://respic8.yesno.com.cn/activity/%E6%8C%89%E9%92%AE.png",
        未中奖: "http://respic8.yesno.com.cn/activity/未中奖.png",
        领取成功: "http://respic8.yesno.com.cn/activity/领取成功.png"
      },
      showPopup_shouming: false,
      showPopup_result_yes: false,
      showPopup_result_no: false,
      selected: "1",
      traceInfo: {
        enterpriseProfile: ""
      }
    };
  },
  methods: {
    render: function() {
      var that = this;
      switch (that.sup8.env) {
        case that.sup8._def.env.design:
          this.sup8.codeInfo = {
            Querycode: "31xxxxxx"
          };
          break;
        case that.sup8._def.env.run:
          // 去查防伪信息

          break;
        default:
          break;
      }
    },
    hideAllPopup() {
      this.showPopup_shouming = false;
      this.showPopup_result_yes = false;
      this.showPopup_result_no = false;
    },
    shouming() {
      if (this.sup8.env === this.sup8._def.env.run) {
        this.showPopup_shouming = true;
        this.showPopup_result_yes = false;
        this.showPopup_result_no = false;
      }
    },
    choujiang() {
      if (this.sup8.env === this.sup8._def.env.run) {
        this.showPopup_shouming = false;
        this.showPopup_result_yes = false;
        this.showPopup_result_no = false;

        // 31表示中奖码，3X其他表示未中奖
        if (
          this.sup8.codeInfo.Querycode &&
          this.sup8.codeInfo.Querycode.substring(0, 2) === "31"
        ) {
          this.showPopup_result_yes = true;
        } else {
          this.showPopup_result_no = true;
        }
      }
    }
  },
  watch: {
    traceInfo(newVal, oldVal) {}
  },
  created: function() {
    var that = this;
    that.mergeCompProps(that.comp);
  },

  mounted: function() {
    console.log("CompAntiFake:mounted:this.comp", this.comp);

    var that = this;
    that.render();
  }
};
</script>

<style scoped>
/* .img-bg {
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        background-size: 100%100%;
      } */

img {
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  background-size: 100%100%;
}

.mt-popup {
  width: fit-content;
}

img[lazy="loaded"] {
  width: 100%;
  height: 100%;
  margin: auto;
}

#btn_canyu {
  position: absolute;
  bottom: 10%;
  width: 60%;
  left: 20%;
  height: 10%;
  /* border: 1px solid green; */
}

#btn_shouming {
  position: absolute;
  bottom: 25%;
  width: 40%;
  left: 30%;
  height: 5%;
  /* border: 1px solid green; */
}
</style>
