<template>
  <div class="hello">
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(imgUrl,index) in imgs" :key="index">
        <img v-bind:src="decodeURIComponent(imgUrl.url)" alt="">
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>

export default {
  name: 'CompSwiper',
  props: ['comp'],
  data() {
    return {
      imgs: []
    }
  },
  methods: {
  },
  computed: {
    // imgs() {
    //       var jsonStr=this.getCompPropVal(this.comp.props,'imgs')
    // return (new Function("","return "+jsonStr))()
    // }
  },
  created(){
    let that=this
    that.mergeCompProps(that.comp)
  },
  mounted: function () {
    console.log('CompSwiper:mounted', this.comp)
    //var jsonStr=this.getCompPropVal(this.comp.props,'imgs')
    //this.comp.props.imgs =(new Function("","return "+this.comp.props.imgs))()

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mint-swipe {
  height: 134px;
}

.mint-swipe-item img {
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  background-size: 100%100%;
}
</style>
