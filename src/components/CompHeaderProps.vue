<template>
  <el-form ref="form" label-width="80px">
    <!-- <el-form-item  label="标题">
      <el-input v-model="comp.props.title.val">
      </el-input>
    </el-form-item>

    <el-form-item  label="key1">
      <el-input v-model="comp.props.key1.val">
      </el-input>
    </el-form-item> -->

        <el-form-item  label="标题">
      <el-input v-model="comp.props.title.val">
      </el-input>
    </el-form-item>

    <!-- <el-form-item  label="key1">
      <el-input v-model="comp.props.key1.val">
      </el-input>
    </el-form-item> -->
  </el-form>

</template>

<script>
export default {
  name: "CompHeaderProps",
  props: ["comp"],
  data() {
    return {};
  },
  methods: {},
  watch: {},
  mounted: function() {}
};
</script>

<style scoped>

</style>



