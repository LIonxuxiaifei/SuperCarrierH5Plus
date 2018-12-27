// 防伪组件，查询防伪信息并展示
<template>
  <div class="root">
    <div v-if="!antifakeInfo.Result" class="fake">
      <img :src="comp.props.bgImg.val" alt>
    </div>

    <div v-if="!showInput" class="result bg-color">
      <mt-cell title="查验结果" class="bg-color" style>
        <img slot="icon" :src="icons.query" width="16" height="16">
        <!-- <div @click="continueSearch()">
          <span style="margin-right: 24px">继续查询</span>
          <i class="mint-cell-allow-right"></i>
        </div>-->
      </mt-cell>
      <div
        class="bg-color"
        :class="{'reply-true':antifakeInfo.Result,'reply-false':!antifakeInfo.Result}"
        v-html="antifakeInfo.Content"
      ></div>
    </div>

    <!-- <div v-if="showInput" class="result">
      <div class="input-code">
        <img
          class="img-search"
          src="http://image.supercarrier8.com/antifaketemplae/%E8%BE%93%E5%85%A5%E9%98%B2%E4%BC%AA%E7%A0%81%E5%9B%BE%E6%A0%87.png"
        >
        <input type="text" v-model="code" name id placeholder="请输入防伪码">
        <img
          class="img-ok"
          src="http://image.supercarrier8.com/antifaketemplae/%E7%A1%AE%E5%AE%9A%E6%8C%89%E9%92%AE.png"
          @click="search()"
          :disable="true"
        >
      </div>
    </div>-->
  </div>
</template>

<script>
import $ from "jquery";
import apiHelper from "../assets/js/apiHelper.js";
import eventBus from "../assets/js/eventBus.js";
import _stringResource from "../assets/js/stringResource.js";
import { Toast } from "mint-ui";
export default {
  name: "CompAntiFake",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      title: "",
      code: "",
      showInput: false,
      icons: {
        query:
          "http://image.supercarrier8.com/antifaketemplae/%E9%98%B2%E4%BC%AA%E7%BB%93%E6%9E%9C.png"
      },
      antifakeInfo: {
        Result: true,
        Content: "正在查询，请稍后..."
      }
    };
  },
  methods: {
    search() {
      var that = this;
      var reg = /^[0-9]{16}$/;
      if (!reg.test(that.code)) {
        Toast("请输入正确的防伪码");
        return;
      }

      // 由于逻辑的修改 再次输入码时，重新走一次正常的查询逻辑 2018年9月5日 15点51分 幻视
      var url = "{0}?1{1}{2}".format(
        location.origin,
        that.code,
        _.random(100000, 999999)
      );
      window.location.href = url;

      //this.showInput = false;

      // apiHelper.decode(
      //   that.code,
      //   that.sup8.codeInfo.EnterpriseNo,
      //   function(res) {
      //     if (!res.flag || !res.data) {
      //       that.sup8.msg = res.msg;
      //       that.$router.push("/error");
      //       return;
      //     } else {
      //       that.showInput = false;

      //       // 先解码，再查防伪
      //       that.searchAntifake(res.data);
      //     }
      //   },
      //   function() {
      //     that.sup8.msg = "出错啦,请稍后重试。";
      //     that.$router.push("/error");
      //   }
      // );
    },
    continueSearch() {
      this.showInput = true;
    },

    //调接口、查防伪
    searchAntifake(codeInfo) {
      var that = this;

      if (!codeInfo) {
      } else {
        that.sup8.codeInfo = codeInfo;
        let antifakeCodeLen = 16; // 防伪码的长度
        // 如果不是合法的防伪码，不查防伪
        if (!codeInfo.Code || codeInfo.Code.length !== antifakeCodeLen) {
          that.showInput = true;
          return;
        }

        // 表示查询的是不是一个新的产品
        var isNewProduct = that.sup8.codeInfo.ProductId !== codeInfo.ProductId;
        apiHelper.getAntifakeInfo(
          codeInfo.EnterpriseNo,
          //'',
          codeInfo.ProductId,
          codeInfo.Code,
          // "20",
          that.sup8.UA.geo.latitude + "," + that.sup8.UA.geo.longitude ||
            that.sup8.UA.ip.cip,
          that.sup8.context.decodestatus,
          that.sup8.codeInfo.LabelNo,
          function(res) {
            if (res.flag === true && that.antifakeInfo.Result === true) {
              that.antifakeInfo = res.data;
              that.sup8.antifakeInfo = res.data;

              eventBus.publish("event_enable_comp", "防伪查询正确数码");

              if (isNewProduct) {
                eventBus.publish(eventBus.eventKey.pruductChange);
              }

              eventBus.publish(eventBus.eventKey.antifakeTrue, {
                isNewProduct: isNewProduct,
                msg: "防伪查询正确数码"
              });
            } else {
              that.antifakeInfo = {
                Result: true,
                Content: res.msg || "未查询到该码的信息，谨防假冒"
              };
            }
          },
          function(res) {
            that.antifakeInfo = {
              Result: true,
              Content: res.msg || "未查询到该码的信息，谨防假冒"
            };
            // eventBus.subscribe("event_disable_comp", "防伪查询不正确数码");
            // eventBus.subscribe(
            //   eventBus.eventKey.antifakeFalse,
            //   "防伪查询不正确数码"
            // );
          }
        );
      }
    }
  },

  /*在此处对数据进行初始化*/
  created: function() {
    let that = this;
    that.mergeCompProps(that.comp);

    that.title =
      that.sup8.productInfo && that.sup8.productInfo.name
        ? `${that.sup8.productInfo.name} ${that.sup8.productInfo.code}`
        : "商品名称";

    // 如果缓存中已经有了防伪信息，则不再查询
    switch (that.sup8.env) {
      case that.sup8._def.env.design: // 设计器模式
      case that.sup8._def.env.preview: // 预览模式
        that.antifakeInfo = {
          Result: true,
          Content: "您查询的为正品"
        };
        break;
      case that.sup8._def.env.run: // 运行模式
        if (that.sup8.antifakeInfo) {
          that.antifakeInfo = that.sup8.antifakeInfo;
        } else {
          that.searchAntifake(that.sup8.codeInfo);
        }
        break;
      default:
        break;
    }
  },

  mounted: function() {
    console.log("CompAntiFake:mounted:this.comp", this.comp);
  }
};
</script>

<style scoped>
.root {
  padding-bottom: 10px;
}

.root .result {
  margin-top: 10px;
  /* border: 1px solid #d9d9d9; */
}

.root .fake img {
  width: 100%;
}

.reply-true {
  color: green;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 20px 0;
}

.reply-false {
  color: red;
  text-align: center;
  font-size: 1.2rem;
  padding: 20px 0;
}

.input-code {
  margin: 10px;
  border-radius: 4px;
  background: white;
  height: 50px;
  border: 1px solid #d9d9d9;
}

.input-code .mint-field-core {
  font-size: 1.5rem !important;
}

.input-code .img-search {
  margin: 10px 0 0 10px;
  float: left;
  width: 30px;
  height: 30px;
}

.input-code img {
  width: 48px;
  height: 48px;
  /* width: 10% */
}

.input-code .img-ok {
  position: relative;
  top: 3px;
  float: right;
}

.input-code input,
.input-code input:focus {
  border: 0;
  font-size: 18px;
  margin: 13px 0;
  float: left;
  width: 60%;
  outline: none;
  vertical-align: middle;
  line-height: 24px;
}
</style>
