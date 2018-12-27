<template>
  <el-form ref="form" label-width="80px">
    <el-form-item v-if="comp.props.bgImg.available" label="背景图片">
      <el-upload class="upload-demo" :action="''" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="uploadImgList" list-type="picture"
        multiple>
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb </div>
      </el-upload>
      <el-input placeholder="请输入图片地址" v-model="comp.props.bgImg.val"></el-input>
      <label class="prop-intro">{{comp.props.bgImg.description}}</label>
    </el-form-item>

    <!-- <el-form-item label="跳转到">
      <el-select v-model="comp.props.linkType.val" placeholder="请选择" > 
        <el-option v-for="item in sup8._def.linkType" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="comp.props.linkType.val===sup8._def.linkType.innerPage.value" label="选择页面">
      <el-select v-model="comp.props.linkVal.val" placeholder="请选择">
        <el-option v-for="p in cfg.pages" :key="p.id" :label="p.name" :value="p.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="comp.props.linkType.val===sup8._def.linkType.outerPage.value" label="外部地址">
      <el-input v-model="comp.props.linkVal.val" placeholder="请输入地址"></el-input>
    </el-form-item>

    <el-form-item v-if="comp.props.linkType.val===sup8._def.linkType.otherTemplate.value" label="模板编号">
      <el-input v-model="comp.props.linkVal.val" placeholder="请输入模板编号"></el-input>
    </el-form-item> -->

  </el-form>

</template>

<script>
export default {
  name: "CompAntiFakeProps",
  props: ["cfg", "comp"],
  data() {
    return {
      uploadImgList:[],
      linkVal: {
        innerPage: "",
        outerPage: "",
        otherTemplate: ""
      }
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  },
  watch: {
    "comp.props.linkType.val": function(n, o) {
      var that = this;

      // switch (o) {
      //   case that.sup8._def.linkType.innerPage.value:
      //     that.linkVal.innerPage = that.comp.props.linkVal.val;
      //     break;
      //   case that.sup8._def.linkType.outerPage.value:
      //     that.linkVal.outerPage = that.comp.props.linkVal.val;
      //     break;
      //   case that.sup8._def.linkType.otherTemplate.value:
      //     that.linkVal.otherTemplate = that.comp.props.linkVal.val;
      //     break;
      // }

      // switch (n) {
      //   case that.sup8._def.linkType.innerPage.value:
      //     that.comp.props.linkVal.val = that.linkVal.innerPage;
      //     break;
      //   case that.sup8._def.linkType.outerPage.value:
      //     that.comp.props.linkVal.val = that.linkVal.outerPage;
      //     break;
      //   case that.sup8._def.linkType.otherTemplate.value:
      //     that.comp.props.linkVal.val = that.linkVal.otherTemplate;
      //     break;
      // }
    }
  },
  mounted: function() {
    var that = this;
    console.log(that.comp);
  }
};
</script>

<style scoped>
</style>
