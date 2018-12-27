<template>
  <el-form ref="form" label-width="80px">


    <el-form-item  label="属性1">
      <el-input v-model="comp.props.Content1.val">
      </el-input>
    </el-form-item>
	
	<el-form-item  label="属性2">
      <el-input v-model="comp.props.Content2.val">
      </el-input>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: "TestCompProp1",
  props: ["comp", "cfg", "selectedPage"],
  data() {
    return {

    };
  },
  methods: {

  },
  mounted: function() {
    console.log("TestCompProp1:mounted:this.comp", this.comp);

  }
};
</script>
