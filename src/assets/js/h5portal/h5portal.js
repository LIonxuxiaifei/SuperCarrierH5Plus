import Vue from "vue"
import errorCode from './errorcode'
import _h5portalconfig from '../../../app.conf'
// import axios from 'axios'
import qs from 'qs';
import $ from 'jquery'
import {
  sign
} from '../cryptoHelper'

/**
 * H5 Plus Portal
 */
export default {
  /**
   * 获取h5 入口地址
   */
  getPortal: function (codeInfo) {
    // todo:此处要调用openpi 接口，确定数码的信息,码是否合法有效
    var result = {}
    // 请求的参数
    var params = {
      appkey: sessionStorage.appkey,
      accesstoken: sessionStorage.accesstoken,
      enterpriseno: codeInfo.EnterpriseNo || codeInfo.EnterPriseNo, // 企业编号
      productid: codeInfo.ProductId, // 产品
      orderno: codeInfo.OrderNo // 标签
    }

    params.timestamp = new Date().getTime()
    params.sign = sign(_h5portalconfig.sign.key, params)

    $.ajax({
      url: _h5portalconfig.apiUrl.getPortal,
      data: params,
      type: 'POST',
      async: false,
      dataType: 'json',
      success: function (res) {
        result = res

        // 测试数据
        if (result.flag && result.data.PortalType != 3) {

        }
      },
      error: function () {

      }
    })


    return result
  }
}
