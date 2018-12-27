<template>
  <el-form ref="form" label-width="80px">
    <!-- <el-form-item label="标题">
      <el-input v-model="comp.props.title.val">
      </el-input>
    </el-form-item>

    <el-form-item label="描述">
      <el-input v-model="comp.props.desp.val">
      </el-input>
    </el-form-item>

    <el-form-item label="图标">
      <el-input v-model="comp.props.icon.val">
      </el-input>
    </el-form-item>

    <el-form-item label="跳转到">
      <el-select v-model="comp.props.linkType.val" placeholder="请选择">
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
  name: "CompProductProps",
  props: ["cfg", "comp"],
  data() {
    return {};
  },
  methods: {},
  watch: {},
  mounted: function() {
    var that = this;
  }
};
</script>

<style scoped>
</style>
