/**
 * 消息事件总线
 *
 */
import Vue from 'vue'

let bus = new Vue({
  data () {
    return {

      /*
        1.此处定义目前系统支持的事件
        2.可以自定义事件key，但需要发布和订阅时保持一致
        3.事件key命名规则:全部小写，多级时以.分割，长度最大50
       */
      eventKey: {
        test: 'test', // 用于测试
        antifakeFalse: 'antifake.false', // 防伪查询结果数码不合法、假码等
        antifakeTrue: 'antifake.true', // 防伪查询结果数码合法
        pruductChange: 'pruduct.change', // 产品变更
        previewdataChange: 'previewdata.change', // 演示数据变更
        hasNavList: 'has.navlist'
      }
    }
  },
  methods: {
    /**
    * 发布消息
    * @param {string} key 事件key
    * @param {*} data 事件传递的参数
    */
    publish  (key, data) {
      this.$emit(key, data)
    },

    /**
     * 订阅事件
     * @param {string} key 订阅的事件key
     * @param {*} cb  待执行的回调
     */
    subscribe (key, cb) {
      this.$on(key, cb)
    }
  }
})

export default bus
