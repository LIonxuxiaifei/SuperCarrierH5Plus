<template>

</template>

<script>

export default {
  name: '',
  data: function () {
    return {
      props:[{id:'id1',val:'val1'}]
    }
  },
  methods: {
  },
  mounted: function () {
    var that = this
    this.$http.get(this.apiUrl.config).then(function (response) {
      if (!response || !response.data.IsSuccess || !response.data.ResponseData) {
        return
      }
      this.cfg = response.data.ResponseData
      _.forEach(this.cfg.pages, function (page, i) {
        _.forEach(page.components, function (com, k) {
          com.props = that.convertCompProps(com.props)
        })
      })

      this.homePage=_.find(this.cfg.pages,{isHome:1})
      if(!this.homePage){
        this.homePage=this.cfg.pages[0]
      }


    }, function (response) {
      console.log(response)
    });
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.comp {
  position: relative;
  width: 100%;
}
</style>
