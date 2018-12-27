<template>
  <el-form ref="form" label-width="80px" label-suffix=''>

    <!-- v-if="propBase.readonly!=='1'"  这个设置是为了区分权限，控制是否可见 -->
    <el-form-item v-for="propBase in compPropsBase" :key="propBase.id" :label="propBase.title" v-if="propBase.readonly!=='1'">
      <el-input v-if="propBase.inputType==='text'" :placeholder="'请输入'+propBase.title" v-model="comp.props[propBase.key].val" v-bind:disabled="propBase.readonly==='1'">
      </el-input>

      <el-upload v-else-if="propBase.inputType==='uploadimg'" class="upload-demo" :action="''" :on-preview="handlePreview" :on-remove="handleRemove"
        :file-list="imgs" list-type="picture" multiple>

        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb </div>
      </el-upload>

      <div v-if="propBase.inputType==='uploadimg'">
        <el-input :placeholder="'请输入'+propBase.title" v-model="comp.props[propBase.key].val"></el-input>
      </div>

      <div v-if="propBase.inputType==='link'">
        <el-select v-model="comp.props[propBase.key].val" :placeholder="'请选择'+propBase.title">
          <el-option v-for="page in cfg.pages" :key="page.id" v-if="page.id!==selectedPage.id" :label="page.name" :value="page.id"></el-option>
        </el-select>
        <!-- <el-input :placeholder="'请输入自定义'+propBase.title" v-model="comp.props[propBase.key].val"></el-input> -->
      </div>

      <div v-if="propBase.inputType==='color'">
        <el-color-picker v-model="comp.props[propBase.key].val" v-bind:disabled="propBase.readonly==='1'"></el-color-picker>
      </div>

    </el-form-item>
    <div id="editor-content" style="text-align:left"></div>
  </el-form>
</template>

<script>
  //import quillEditor from 'vue-quill-editor' //调用编辑器
  import E from "wangeditor";

  export default {
    name: "CompPropsSetting",
    props: ["comp", "cfg", "selectedPage"],
    data() {
      return {
        compPropsBase: undefined, // 当前编辑的这个组件的基本属性列表
        compProps: {},
        imgs: []
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      getContent() {
        alert(this.editorContent);
      },
      afterGetPropData(props) {
        var that = this;
        // 对数据进行处理，防止实际属性列表和默认不匹配时报错
        _.forEach(props, function (ch) {
          if (ch && ch.key && !that.comp.props[ch.key]) {
            props[ch.key] = ch;
            props[ch.key].val = "";
            props[ch.key].available = props === "0";
          }

          // 如果是富文本框形式的参数项，需要些特殊配置
          if (ch.inputType === "rich") {
            var editor = new E("#editor-content");
            if (editor) {
              editor.customConfig.onchange = html => {
                that.comp.props[ch.key].val = html;
              };

              editor.customConfig.uploadImgServer =
                that.sup8._appConf.apiUrl.upload;
              editor.customConfig.showLinkImg = true;
              editor.customConfig.hideLinkImg = false;
              editor.customConfig.colors = [
                "#000000",
                "#eeece0",
                "#1c487f",
                "#4d80bf",
                "#c24f4a",
                "#8baa4a",
                "#7b5ba1",
                "#46acc8",
                "#f9963b",
                "#ffffff",
                "#CC0000"
              ];

              editor.customConfig.uploadImgShowBase64 = true;
              editor.create();
              editor.txt.html(that.comp.props[ch.key].val);
            }
          }
        });
      }
    },
    watch: {
      "selectedPage.isHome": function (n, o) {
        console.log("CompPropsSetting:watch:selectedPage", n);
        var that = this;
        _.forEach(this.cfg.pages, function (page) {
          if (page.id !== that.selectedPage.id) {
            page.isHome = false;
          }
        });
      }
    },
    created() {
      var that = this;
      // debugger;
    },
    mounted: function () {
      console.log("CompPropSetting:mounted:", this.comp);
      var that = this;
      that.compPropsBase;
      // 查找此插件的数据是不是已经有了
      if (that.sup8._baseComponentList !== undefined) {
        let baseComp = _.find(that.sup8._baseComponentList, {
          id: that.comp.baseCompId,
          ver: that.comp.ver
        });

        if (baseComp !== undefined && baseComp.props !== undefined) {
          that.compPropsBase = baseComp.props;
        }
      }

      if (that.compPropsBase === undefined) {
        //  if (true) {
        var reqParam = {
          appkey: sessionStorage.appkey,
          accesstoken: sessionStorage.accesstoken,
          compid: this.comp.baseCompId,
          ver: this.comp.ver,
          level: that.sup8.role.permissionLevel
        };
        that.$http
          .post(that.sup8._appConf.apiUrl.getComponentProps, reqParam)
          .then(
            function (response) {
              var resData = response.body;
              that.compPropsBase = resData.data;
              that.afterGetPropData(that.compPropsBase);
            },
            function (response) {
              console.log("error", response);
            }
          );
      } else {
        that.afterGetPropData(that.compPropsBase);
      }

      //this.comp.props = this.convertCompProps(this.comp.props)
    }
  };

</script>

<style scoped>
  .w-e-text-container {
    height: auto;
  }

  .w-e-text {
    padding: 0 !important;
  }

  #editor-content {
    /* width: 316px; */
  }

  .w-e-text-container {
    height: 800px;
  }

</style>
