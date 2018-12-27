<template>
  <div class='env-design'>
    <el-container v-loading="loading" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(170,170,170,0.8)">
      <!-- 头部 -->
      <el-header class="part-header" style="height:7vh">
        <span class="title">H5 Plus 设计器</span>
        <el-button v-if="sup8.urlparams.option==sup8._def.optionType.addPortal||sup8.urlparams.option==sup8._def.optionType.modifyPortal" class='btn-goback' icon="el-icon-back" @click="goBack">返回模板列表</el-button>
        <!-- <el-button @click="onClickPreview()" icon="el-icon-mobile-phone">预览</el-button> -->
        <el-button class='btn-save' type="primary" @click="onClickSave()" icon="el-icon-check">保存</el-button>

      </el-header>
  
      <el-container style="height:90vh">
        <!-- 左 -->
        <el-aside v-if="sup8.role.permissionLevel>1"  class="part part-left">
          <component :is="'PartCompList'"  @onAddComp="onAddComp" :cfg='cfg' :selectedPage='selectedPage' :selectedComp='selectedComp' @changeData='changeData' keep-alive></component>
        </el-aside>
  
        <!-- 中 -->
        <el-main class="part part-center">
          <div id='part_phone' class="mobiReviewBackground">
            <div v-if="selectedPage&&selectedPage.components" class='part_phone_screen' >
              <div  v-for="(comp,index) in selectedPage.components" :key="comp.id" class="comp" :class="{active:comp.id===selectedComp.id}" draggable="true" keep-alive>
                <el-row class="design-tool-bar">
                  <el-button-group>
                    <el-button type="success" size="small" icon="el-icon-edit" circle @click="onClickSetting(comp,index)"></el-button>
                    <el-button v-if="sup8.role.permissionLevel>1&&!(comp.canDel===false)" type="success" size="small" icon="el-icon-delete" circle @click="onClickDelete(comp,index)" ></el-button>
                    <el-button v-if="sup8.role.permissionLevel>1"  type="success" size="small" icon="el-icon-sort-up" circle @click="onClickUp(comp,index)"></el-button>
                    <el-button  v-if="sup8.role.permissionLevel>1" type="success" size="small" icon="el-icon-sort-down" circle @click="onClickDown(comp,index)"></el-button>
                  </el-button-group>
                </el-row>
                <component :key="comp.id" v-bind:is="comp.componentViewName" :comp="comp" @ChangeSelectComp="ChangeSelectComp" :cfg='cfg' :selectedPage='selectedPage' @changeData='changeData' keep-alive>
                </component>
              </div>
            </div>
          </div>
        </el-main>
  
        <!-- 右 beg-->
        <el-aside class="part part-right" style="width:100%">
          <el-tabs v-model="partRightActiveTab">
            <el-tab-pane label="组件" name="tab_compprops">
              <component v-if="selectedComp" :is="selectedComp.componentPropViewName?selectedComp.componentPropViewName:'PartPropsSetting'" @PropsChange="PropsChange" :key="selectedComp?selectedComp.id:'0000'" keep-alive :comp="selectedComp" :cfg='cfg' :selectedPage='selectedPage'></component>
            </el-tab-pane>

            <!-- <el-tab-pane  v-if="sup8.role.permissionLevel>1"  label="页面" name="tab_page"> -->
            <el-tab-pane    label="页面" name="tab_page">
              <component  :is="'PartPageList'"  keep-alive  :cfg='cfg' :selectedPage='selectedPage' @changeData='changeData'></component>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <!-- 右 end-->
  
      </el-container>

<!-- <el-footer class='part-footer'>Footer</el-footer> -->


    </el-container>
    <component :is="'CompQr'" :qrConfig="qrConfig"></component>
    <component :is="'CompSaveDialog'" :cfg="cfg" :saveDialogVisible='saveDialogVisible' @changeData='changeData'></component>
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import ElementUI from "element-ui";
import "mint-ui/lib/style.css";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/mobiModule.min.css";
import _apiHelper from "./assets/js/apiHelper.js";

Vue.use(ElementUI);
export default {
  name: "Design",
  data: function() {
    return {
      qrConfig: {
        previewUrl: "x",
        dialogVisible: false
      },

      loading: false, // 是否显示加载效果
      loadingText: "加载中...",
      cfg: {}, // 全套配置
      selectedComp: undefined,
      selectedPageId: "",
      selectedPage: {
        name: ""
      },
      saveDialogVisible: false, // 是否显示保存配置的弹框
      partRightActiveTab: "tab_compprops" // 右侧tab
    };
  },
  methods: {
    onClickSetting(comp) {
      this.selectedComp = comp;
      this.partRightActiveTab = "tab_compprops";
      this.$forceUpdate();
    },
    onClickDelete(comp) {
      let that = this;
      this.$confirm("删除后数据将无法恢复，是否继续？", "提示", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(c => {
          _.remove(that.selectedPage.components, {
            id: comp.id
          });

          if (
            this.selectedComp.id === comp.id &&
            that.selectedPage.components.length > 0
          ) {
            this.selectedComp = that.selectedPage.components[0];
          }

          if (that.selectedPage.components.length <= 0) {
            this.selectedComp = undefined;
          }

          that.updateCompSort();
        })
        .catch(c => {});
    },
    onClickUp(comp, index) {
      console.log("上移", comp, index);
      _.pullAt(this.selectedPage.components, index);
      this.selectedPage.components.splice(index - 1, 0, comp);
      this.updateCompSort();
    },
    onClickDown(comp, index) {
      console.log("下移", comp, index);
      _.pullAt(this.selectedPage.components, index);
      this.selectedPage.components.splice(index + 1, 0, comp);
      this.updateCompSort();
    },
    ChangeSelectComp(comp) {
      this.selectedComp = comp;
    },
    PropsChange(newPropsVal) {
      console.log("App.vue:methods:PropsChange:newPropsVal", newPropsVal);
      this.$set(this.selectedComp, newPropsVal);
      this.$forceUpdate();
      console.log("App.vue:methods:PropsChange:this.$data", this.$data);
    },
    onAddComp(comp) {
      console.log("DesignEnv.vue:methods:onAddComp:comp", comp);
      var newComp = _.cloneDeep(comp);

      // 获取当前选中的组件，然后在此组件后面添加新的组件
      var index = this.selectedComp ? this.selectedComp.sort : -1;

      if (
        this.selectedPage.components &&
        this.selectedPage.components.length > 0
      ) {
        index = _.findIndex(this.selectedPage.components, {
          id: this.selectedComp.id
        });
      }

      newComp.baseCompId = newComp.id;
      newComp.id = this.sup8.$utils.newGuid();
      newComp.title = newComp.name;
      this.selectedPage.components.splice(index + 1, 0, newComp);
      this.selectedComp = this.selectedPage.components[index + 1];

      this.selectedComp.props = this.convertCompProps(this.selectedComp.props);
      this.partRightActiveTab = "tab_compprops";
    },
    updateCompSort() {
      if (!this.selectedPage || !this.selectedPage.components) {
        return;
      }

      _.forEach(this.selectedPage.components, function(ch, i) {
        ch.sort = i;
      }); 
      this.$forceUpdate();
    },
    onClickPreview() {
      console.log("onClickPreview");
      this.qrConfig.previewUrl = window.location.host + "?id=" + this.cfg.id;
      this.qrConfig.dialogVisible = true;
    },
    onClickSave() {
      console.log("onClickSave:this.cfg:", this.cfg);
      this.saveDialogVisible = false;
      this.saveDialogVisible = true;
    },

    // 修改当前vue中的数据
    changeData: function(opt) {
      //debugger
      this._data = _.assign(this._data, opt);
      this.$forceUpdate();
    },

    registerComp: function(cb_success) {
      var that = this;
      var reqParam = {
        appkey: sessionStorage.appkey,
        accesstoken: sessionStorage.accesstoken,
        level: that.sup8.role.permissionLevel
      };

      function regist(compList) {
        _.forEach(compList, function(ch, key) {
          var viewDir = "";
          if (ch.bundleName === null) {
            viewDir = "./components/";
          } else {
            viewDir =
              "./components.install/" +
              ch.bundleName +
              "_" +
              ch.ver +
              "/components/";
          }

          var compViewPath = viewDir + ch.componentViewName;
          console.debug("compviewpath", compViewPath);
          Vue.component(ch.componentViewName, () => import(`${compViewPath}`));
          if (ch.componentPropViewName && ch.componentPropViewName.length > 0) {
            var compPropViewPath = viewDir + ch.componentPropViewName;
            console.log("compPropViewPath", compPropViewPath);

            Vue.component(ch.componentPropViewName, () =>
              import(`${compPropViewPath}`)
            );
          }
        });
      }

      _apiHelper.getBaseComponentList(
        undefined,
        that.sup8.role.permissionLevel,
        function(res) {
          if (res.flag && res.data) {
            that.sup8._baseComponentList = res.data;
            regist(res.data);
            cb_success && cb_success();
          }
        },
        function(res) {
          console.log("error", res);
        }
      );
    },

    load: function() {
      var that = this;
      that.loading = true;
      that.loadingText = "加载中，请稍候...";
      _apiHelper.getConfig(
        that.sup8.urlparams.id,
        undefined,
        that.sup8.urlparams.pageid ? that.sup8.urlparams.pageid : "",
        function(response) {
          that.loading = false;
          var data = response.data;
          if (!data || !data.length <= 0) {
            return;
          }
          that.cfg = data;
          that.cfg.state = that.cfg.state === "Y";
          that.cfg.isOpen = that.cfg.isOpen === "Y";

          if (that.sup8.urlparams.option === "1") {
            that.cfg.title = "";
            that.cfg.description = "";
          }

          // 转换属性形式
          _.forEach(that.cfg.pages, function(page, i) {
            _.forEach(page.components, function(com, k) {
              com.props = that.convertCompProps(com.props);
            });
          });
        },
        function(response) {
          console.log(response);
          that.loading = false;
        }
      );
    },
    // 设置组件属性值
    setCompProps: function(compProps) {
      this.selectedComp = compProps;
    },
    goBack() {
      window.history.go(-1);
    }
  },
  watch: {
    cfg: function(n, o) {
      console.log("watch:cfg", n, o);
      var homePage = _.find(n.pages, {
        isHome: true
      });
      if (homePage) {
        this.selectedPage = homePage;
      } else {
        this.selectedPage = n.pages[0];
      }

      this.selectedComp = this.selectedPage.components[0];
      this.selectedPageId = this.selectedPage.id;
    },
    selectedComp: function(n, o) {},
    selectedPageId: function(n, o) {
      console.log("DesignEnv::watch:selectedPageId", n);
      this.updateCompSort();

      this.cfg.pages.forEach(element => {
        var isCurrent = element.id === n;
        element.isSelected = isCurrent;
      });

      var p = _.find(this.cfg.pages, {
        id: n
      });

      if (!p) return;
      //p.isSelected=true
      this.selectedPage = p;

      if (
        this.selectedPage.components &&
        this.selectedPage.components.length > 0
      ) {
        this.selectedComp = this.selectedPage.components[0];
      }

      this.$forceUpdate();
      console.log(
        "watch:selectedPageId:this.selectedPage",
        this.selectedPage,
        this.selectedPage.name
      );
    },
    selectedPage: function(n, o) {
      //debugger
      console.log("DesignEnv::watch:selectedPage", n);
      if (
        !this.selectedPage.components ||
        this.selectedPage.components.length <= 0
      ) {
        this.selectedComp = undefined;
        return;
      }

      // 排序
      this.selectedPage.components = _.sortBy(
        this.selectedPage.components,
        "sort"
      );

      this.selectedComp = this.selectedPage.components[0];
    },

    dialogVisible: function(n, o) {
      console.log("watch:dialogVisible:", this.dialogVisible);
    }
  },

  beforeCreate() {
    let that = this;
    //初始化、整理各种参数
    that.sup8.env = that.sup8._def.env.design;

    // 注册必须的页面组件
    let compPath = that.sup8._appConf.systemComponentsPath;
    _.forEach(that.sup8._appConf.design.components, function(ch, i) {
      console.log(compPath + ch + ".vue");
      Vue.component(ch, () => import(compPath + ch + ".vue"));
    });
  },
  created() {
    console.log("DesignEnv::created:mounted");
    let that = this;
    document.title = "超级8|设计器";
    this.registerComp(that.load);
  },
  mounted() {
    $("#appx").css("display", "none");
  }
};
</script>

<style>
@import "./assets/css/index.css";
</style>


<style scoped>
.btn-goback {
  float: unset;
  background-color: #f7f7f7;
  padding: 3px 5px;
  font-size: 12px;
  border-radius: 0;
}

.btn-goback:hover {
  background-color: white;
}
</style>



