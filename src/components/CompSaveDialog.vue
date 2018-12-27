<template>
  <el-dialog title="保存配置信息" :visible.sync="saveDialogVisible" :show-close='false' :close-on-click-modal='false'>
    <el-form :model="cfg">
      <el-form-item label="模板名称">
        <el-input v-model="cfg.title"></el-input>
      </el-form-item>
      <el-form-item label="模板类型">
        <el-radio v-model="cfg.type" label="1">入口模板</el-radio>
        <el-radio v-model="cfg.type" label="2">营销模板</el-radio>
      </el-form-item>

      <el-form-item label="是否启用">
        <el-switch v-model="cfg.state"></el-switch>
      </el-form-item>

      <el-form-item label="是否公开" v-if="isShowOpenSetting">
        <el-switch v-model="cfg.isOpen"></el-switch>
      </el-form-item>

      <el-form-item label="描述信息">
        <el-input type="textarea" v-model="cfg.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "CompSaveDialog",
  props: ["cfg", "saveDialogVisible"],
  data() {
    return {
      isShowOpenSetting: false // 是否显示“公开”设置
    };
  },
  methods: {
    onCloseDialog: function() {
      var opt = {
        saveDialogVisible: false
      };
      this.$emit("changeData", opt);
    },
    onSave: function() {
      console.log("onSave:this.cfg:", this.cfg);
      var that = this;

      var opt = {
        saveDialogVisible: false,
        loading: true,
        loadingText: "保存中，请稍候..."
      };

      this.$emit("changeData", opt);

      // 整理数据
      var copyData = _.cloneDeep(this.cfg);
      copyData.state = this.cfg.state === true ? "Y" : "N";
      copyData.isOpen = this.isShowOpenSetting&&this.cfg.isOpen === true ? "Y" : "N";
      copyData.updateId = that.sup8.urlparams.uid;
      copyData.createId = that.sup8.urlparams.uid;
      copyData.enterpriseId = that.sup8.urlparams.eid;

      var d1 = this.convertCompPropsToList(_.cloneDeep(copyData));
      var d = encodeURI(JSON.stringify(d1));

      // 确定保存类型
      var saveType = 0;
      switch (that.sup8.urlparams.option) {
        case that.sup8._def.optionType.add:
        case that.sup8._def.optionType.addPortal:
          saveType = that.sup8._def.optionType.add;
          break;
        case that.sup8._def.optionType.modify:
        case that.sup8._def.optionType.modifyPortal:
          saveType = that.sup8._def.optionType.modify;
          break;
        default:
          saveType = that.sup8.urlparams.option;
          break;
      }

      that.$http
        .post(that.sup8._appConf.apiUrl.saveConfig, {
          appkey: sessionStorage.appkey,
          // accesstoken: sessionStorage.accesstoken,
          accesstoken: that.sup8.urlparams.accesstoken,
          data: d,
          option: saveType
        })
        .then(
          function(response) {
            console.log("$http.post:success", response);
            that.$emit("changeData", {
              loading: false
            });
            if (response.body.flag === true) {
              that.$notify({
                title: "提示",
                type: "success",
                message: "保存成功！"
              });

              switch (that.sup8.urlparams.option) {
                case that.sup8._def.optionType.add:
                  setTimeout(function() {
                    // 如果是新增配置，再完成保存后要进入 修改模式
                    var newUrl =
                      window.location.origin +
                      "/design/?id=" +
                      response.body.msg +
                      "&uid=" +
                      that.sup8.uid +
                      "&role=" +
                      that.sup8.urlparams.role +
                      "&option=2&accesstoken=" +
                      that.sup8.urlparams.accesstoken;
                    window.location.href = newUrl;
                  }, 1000);
                  break;
                case that.sup8._def.optionType.addPortal:
                case that.sup8._def.optionType.modifyPortal:
                  setTimeout(function() {
                    history.go(-1);
                  }, 1000);
                  break;
                default:
                  break;
              }
            } else {
              that.$emit("changeData", {
                loading: false
              });
              that.$notify({
                type: "info",
                message: "保存失败！"
              });
            }
          },
          function(response) {
            console.log("$http.post:error", response);
            that.$emit("changeData", {
              loading: false
            });
            that.$notify({
              type: "info",
              message: "保存失败！"
            });
          }
        );
    }
  },
  created() {
    var role = this.sup8.urlparams.role;
    if (role && role !== "R_0011") {
      this.isShowOpenSetting = true;
    } else {
      this.isShowOpenSetting = false;
      this.cfg.isOpen = false;
    }
  },
  mounted: function() {
    console.log("CompSaveDialog:mounted:this.cfg", this.cfg);
    var that = this;
    if (this.cfg.pages && this.cfg.pages.length > 0) {
      _.forEach(this.cfg.pages, function(sheet) {
        sheet.method = function(optional) {
          that.$emit("clickSheet", optional);
        };
      });
    }
  }
};
</script>

<style>
/* .el-dialog__wrapper{
      z-index: 99999 !important
  } */
</style>
