<template>
<div>
<el-dialog title="" :visible.sync="qrConfig.dialogVisible"
  :fullscreen='true'
  :before-close="handleClose"
  :custom-class="'m-dialog'"
  >

  {{qrConfig.previewUrl}}
  <iframe :src="'https://cli.im/api/qrcode/code?text='+qrConfig.previewUrl+'&env=preview&'" width="100%" height="500px" ></iframe>
</el-dialog>
</div>
</template>


<script >
export default {
  props: ["qrConfig"],
  name: "CompQr",
  data() {
    return {};
  },
  watch: {},
  mounted() {
    //debugger
  },

  methods: {
    handleClose(done) {
      done();
      // this.dialogVisible=false
    }
  }
};
</script>


<style  scoped>

iframe {
  overflow: hidden;
  border: 0;
}

.m-dialog,
.el-dialog {
  background-color: #6c6c6c !important;
  opacity: 0.95 !important;
}

.el-dialog__close {
  color: #fff !important;
  font-size: 30px;
}
</style>

