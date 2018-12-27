import _appConfig from '../../app.conf'
import $ from 'jquery'
import _ from 'lodash'
import utils from './utils'
import eventBus from './eventBus.js'
import {
  sign
} from './cryptoHelper'

export default {
  requestApi (params) {
    var defaultParams = {
      data: {
        appkey: _appConfig.app.key,
        accesstoken: sessionStorage.accesstoken,
        eventid: utils.newGuid()
      },
      type: 'post',
      dataType: 'json',
      timeout: 0,
      success: function (res) {
        console.log('request api success')
      },
      error: function () {
        console.log('request api error')
      }
    }

    // 覆盖默认参数
    params = _.defaultsDeep(params, defaultParams)

    params.data.timestamp = new Date().getTime()
    params.data.sign = sign(_appConfig.sign.key, params.data)
    $.ajax(params)
  },

  /**
   * 执行指定函数
   * @param {Function} fun 待执行的函数
   * @param {*} params 参数
   */
  execFun (fun, params) {
    if (fun && typeof fun === 'function') {
      fun(params)
    }
  },

  /**
   * 解url
   * @param {String} url
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  decodeUrl (url, cbSuccess, cbError) {
    var that = this
    url = url.split('&')[0]
    sessionStorage.queryEventId = utils.newGuid()

    var params = {
      url: _appConfig.apiUrl.decodeUrl,
      data: {
        eventid: sessionStorage.queryEventId,
        url,
        gps: sessionStorage.gps
      },
      async: true,
      success: function (res) {
        // 兼容微信分享后带“=”的问题
        if (res.flag === false && _.endsWith(url, '=')) {
          url = url.substr(0, url.length - 1)
          that.decodeUrl(url, cbSuccess, cbError)
          return
        }

        that.execFun(cbSuccess, res)
      },
      error: function (e) {
        that.execFun(cbError, e)
      }
    }

    this.requestApi(params)
  },

  /**
   * 获取一套模板的全部数据
   * @param {String} tId 模板编号 必填
   * @param {String} eNo 企业编号
   * @param {String} pageId 页面编号
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  getConfig (tId, eNo, pageId, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.config,
      data: {
        id: tId,
        enterpriseno: eNo,
        pageid: pageId
      },
      success: cbSuccess,
      error: cbError
    }
    this.requestApi(params)
  },

  /**
   * 解数码
   * @param {String} code
   * @param {String} enterpriseNo
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  decode (code, enterpriseNo, cbSuccess, cbError) {
    sessionStorage.queryEventId = utils.newGuid()

    var params = {
      url: _appConfig.apiUrl.decode,
      data: {
        eventid: sessionStorage.queryEventId,
        code: code,
        enterpriseno: enterpriseNo,
        gps: sessionStorage.gps
      },
      success: cbSuccess,
      error: cbError
    }
    this.requestApi(params)
  },

  /**
   * 获取一套配置中使用到的组件
   * @param {String} tId
   * @param {Number} level
   */
  getBaseComponentList (tId, level, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getBaseComponentList,
      data: {
        configid: tId,
        level: level
      },
      success: cbSuccess,
      error: cbError
    }
    this.requestApi(params)
  },

  /**
   * 获取产品信息
   * @param {String} enterpriseNo 企业编号
   * @param {String} templateId 模板编号
   * @param {String} productId 产品编号
   * @param {Function} cbSuccess  正确回调
   * @param {Function} cbError 错误回调
   */
  getProductInfo (code, enterpriseNo, templateId, productId, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getProductInfo,
      timeout: 300000,
      data: {
        code,
        productid: productId,
        templateid: templateId,
        enterpriseno: enterpriseNo
      },
      success: cbSuccess,
      error: cbError
    }
    this.requestApi(params)
  },

  /**
   * 获取防伪信息
   * @param {String} enterpriseno
   * @param {String} productid
   * @param {String} code 数码
   * @param {String} Channeltype 通道类型
   * @param {String} Channel 通道，ip或gps
   * @param {String} decodeStatus 解码状态，如：300102、300102等
   * @param {String} labelno
   * @param {*} cbSuccess 成功回调
   * @param {*} cbError 错误回调
   */
  getAntifakeInfo (enterpriseno, productid, code, channel, decodestatus, labelno, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getAntifakeInfo,
      timeout: 300000,
      data: {
        eventid: sessionStorage.queryEventId,
        enterpriseno,
        productid,
        code,
        channel,
        decodestatus,
        labelno,
        gps: sessionStorage.gps
      },
      success: cbSuccess,
      error: cbError
    }

    this.requestApi(params)
  },

  /**
   * 获取防伪答复
   * @param {String} eNo 企业编号
   * @param {String} rType 答复类型
   * @param {String} cType 通道类型
   * @param {Function} cbSuccess 成功回调
   * @param {Function} cbError 错误回调
   */
  getReply (eNo, rType, cType, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getReply,
      data: {
        enterpriseno: eNo,
        channletype: cType,
        replytemptype: rType
      },
      success: cbSuccess,
      error: cbError
    }

    this.requestApi(params)
  },

  /**
   * 获取溯源信息
   * @param {String} eNo 企业编号
   * @param {String} code 数码
   * @param {String} pId
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  getTraceInfo (eNo, code, pId, tId, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getTraceInfo,
      data: {
        enterpriseno: eNo,
        code: code,
        productid: pId,
        templateid: tId
      },
      success: cbSuccess,
      error: cbError
    }

    this.requestApi(params)
  },

  /**
   * 获取企业设置的首页背景图
   * @param {String} eId
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  getBgImg (eId, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getBgImg,
      data: {
        eid: eId
      },
      success: cbSuccess,
      error: cbError
    }

    this.requestApi(params)
  },

  /**
   * 获取品牌信息
   * @param {String} bId 品牌编号
   * @param {String} tId 模板编号
   * @param {String} eId 企业编号
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  getBrandInfo (bId, tId, eId, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getBrandInfo,
      data: {
        brandid: bId,
        templateid: tId,
        enterpriseno: eId
      },
      success: cbSuccess,
      error: cbError
    }
    this.requestApi(params)
  },

  /**
   * 获取企业简介
   * @param {String} eNo 企业编号
   * @param {String} tId 模板编号
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  getEnterpriseInfo (eNo, tId, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getEnterpriseInfo,
      data: {
        enterpriseno: eNo,
        templateid: tId
      },
      success: cbSuccess,
      error: cbError
    }

    this.requestApi(params)
  },

  /**
   * 获取企业名称，logo等信息
   * @param {String} eNo 企业编号
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  getEnterprise (eNo, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getEnterprise,
      data: {
        enterpriseno: eNo
      },
      success: cbSuccess,
      error: cbError
    }

    this.requestApi(params)
  },

  /**
   * 获取页面类型
   * @param {String} eNo 企业编号
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  getPageTypeList (eNo, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getPageTypeList,
      data: {
        enterpriseno: eNo,
        templatetype: '1' // 暂时默认这个值
      },
      success: cbSuccess,
      error: cbError
    }

    this.requestApi(params)
  },

  /**
   * 获取导航列表
   * @param {String} eNo 企业编号
   * @param {Function} cbSuccess
   * @param {Function} cbError
   */
  getNavList (eNo, cbSuccess, cbError) {
    var params = {
      url: _appConfig.apiUrl.getNavList,
      data: {
        enterpriseno: eNo,
        templatetype: '1' // 暂时默认这个值
      },
      success: cbSuccess,
      error: cbError
    }

    this.requestApi(params)
  }
}
