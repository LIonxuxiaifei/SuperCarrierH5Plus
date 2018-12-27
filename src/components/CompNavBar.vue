<template>
  <div class="container" style="width:100%" :style="style" v-if="navList&&navList.length>0">
    <mt-navbar v-model="selected" :xxxxxx="selected">
      <mt-tab-item
        style="color: #fff;text-overflow:ellipsis"
        v-for="nav in navList"
        :key="nav.Id"
        :id="nav.Content"
      >
        <div class="navbar-item" @click="clickNav(nav)">{{nav.Title}}</div>
      </mt-tab-item>
    </mt-navbar>
  </div>
</template>

<script>
import eventBus from "../assets/js/eventBus.js";
import { sign, aes } from "../assets/js/cryptoHelper.js";
import apiHelper from "../assets/js/apiHelper.js";

export default {
  name: "CompNavBar",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {
      style: {},
      navList: [],
      selected: "",
      disabled: false,
      title: "",
      isShowIcon: false,
      link: "",
      popupVisible: false
    };
  },
  methods: {
    clickNav: function(nav) {
      //debugger
      var that = this;
      switch (that.sup8.env) {
        case that.sup8._def.env.design:
          break;
        case that.sup8._def.env.run:
          switch (nav.Type + "") {
            case that.sup8._def.linkType.innerPage.value:
              // 之前按照页面编号查找跳转，现改为按照页面类型跳转 -幻视  2018年12月12日 17点08分
              // let newPage = _.find(that.cfg.pages, {
              //   id: that.comp.props.linkVal.val
              // });

              let newPage = _.find(_.cloneDeep(that.cfg.pages), {
                type: nav.Content
              });

              if (newPage) {
                that.$emit("changeData", {
                  selectedPage: newPage
                });
              }

              break;
            case that.sup8._def.linkType.outerPage.value:
              var url = nav.Content;
              if (url && url.length > 0) {
                url = that.sup8.$utils.replaceUrlParams(url, that.sup8.context);
                if (that.sup8._appConf.sign.open) {
                  url = that.sup8.$utils.generateUrl(url, true, true);
                }
              }

              window.location.href = url;
              break;

            case that.sup8._def.linkType.otherTemplate.value:
              let p = {
                tid: nav.Content,
                code: this.sup8.codeInfo.Code || "",
                timestamp: that.sup8.$utils.getTimestamp()
              };

              if ((that.sup8._appConf.sign.open = true)) {
                p.sign = sign(that.sup8._appConf.sign.key, p);
              }

              var paramsStr = "?";
              _.forEach(p, function(value, key) {
                paramsStr += key + "=" + value + "&";
              });

              paramsStr = _.trimEnd(paramsStr, "&");
              window.location.href = location.origin + paramsStr;
              break;
            case that.sup8._def.linkType.customContent.value:
              that.$router.push({
                name: "CustomPage",
                params: {
                  title: nav.Title,
                  content: nav.Content
                }
              });
              break;
          }
          break;

        case that.sup8._def.env.preview:
          var page = _.find(that.cfg.pages, {
            type: nav.Content
          });

          that.$emit("changeData", {
            selectedPageId: page.id,
            selectedPage: page
          });

          that.$forceUpdate();
          break;
        default:
          break;
      }
    },
    getNavList() {
      var that = this;
      apiHelper.getNavList(that.sup8.context.eno, function(res) {
        if (res.flag && res.data && res.data.Rows && res.data.Rows.length > 0) {
          that.navList = _.orderBy(res.data.Rows, ["Sort"], ["desc"]);
          eventBus.publish(eventBus.eventKey.hasNavList);
        }
      });
    },

    // 订阅消息
    subscibeMessage() {
      var that = this;
      window.addEventListener(
        "message",
        function(e) {
          if (e.data.type === "update") {
            // 更新导航栏组件
            if (e.data.target === "CompNavBar") {
              that.navList = [];
              if (e.data && e.data.data && e.data.data.length > 0) {
                // 将数据格式转化为当前组件的形式
                _.forEach(e.data.data, function(ch) {
                  that.navList.push({
                    Title: ch.props.title.val
                  });
                });
                eventBus.subscribe(eventBus.eventKey.hasNavList);
                that.$forceUpdate();
              }
            } else {
            }
          }
        },
        false
      );
    }
  },
  watch: {},
  created: function() {
    var that = this;
    // 合并参数是为了当实际属性少于基础属性时 补位
    that.mergeCompProps(that.comp);

    switch (that.sup8.env) {
      case that.sup8._def.env.design:
        that.navList = [
          {
            Id: "1",
            Title: "溯源信息",
            Type: 0,
            Content: "1x"
          },
          {
            Id: "2",
            Title: "企业介绍",
            Type: 0,
            Content: "2x"
          },
          {
            Id: "3",
            Title: "品牌故事",
            Type: 0,
            Content: "3x"
          },
          {
            Id: "4",
            Title: "关于我们",
            Type: 0,
            Content: "4x"
          }
        ];
        that.selected = that.selectedPage ? that.selectedPage.type : "1";
        break;
      case that.sup8._def.env.preview:
        that.getNavList();
        // 样式，固定在底部
        that.style.position = "fixed";
        that.style.bottom = "0";
        that.selected = that.sup8.context.ptype || "1";
        break;

      case that.sup8._def.env.run:
        // 样式，固定在底部
        that.style.position = "fixed";
        that.style.bottom = "0";
        that.selected = that.selectedPage ? that.selectedPage.type : "1";
        
        // 只有在首查、复查的正确状态下，才需要导航
        if (_.includes(['300104','300105','',undefined,null],that.sup8.context.decodestatus)) {
          that.getNavList();
        }

        break;
      default:
        break;
    }
  },
  mounted: function() {
    var that = this;
    that.subscibeMessage();
  }
};
</script>

<style scoped>
.container {
  /* position: fixed;
  top: 0%;
  width: 100%; */

  color: #fff;
  text-shadow: 0 1px 0 #111;
}

.navbar-item {
  color: #fff !important;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.mint-navbar .mint-tab-item {
  display: block;
  text-align: center;
  text-overflow: ellipsis !important;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #1f1f1f;
  background-color: #333;
  padding: 6px 0;
}

.mint-navbar .mint-tab-item.is-selected {
  background-color: #2ad;
}
</style>
