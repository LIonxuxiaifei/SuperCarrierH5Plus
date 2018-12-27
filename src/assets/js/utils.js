import {
  aes,
  sign
} from './cryptoHelper'
import _ from 'lodash'
import Vue from 'vue'

export default {
  getUrlKey: function (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
  },

  /**
   * 解析出url中的参数，以键值对的形式返回
   */
  parseUrl: function () {
    // 通过url传递过来的参数,与上下文中的参数名一致
    // _p:经过加密的参数json
    // tid:模板编号
    // pageid:页面编号
    // code:数码
    // eno：企业编号
    // ename：企业名称
    // pid：产品编号

    var url = location.href
    var result = {}

    if (url.indexOf('?') <= 0) {
      return result
    }

    var query = url.split('?')[1]
    query = decodeURIComponent(query.replace(/%20/g, '+'))
    var queryArr = query.split('&')
    queryArr.forEach(function (item) {
      var key = item.split('=')[0]
      var value = item.split('=')[1]
      // sessionStorage[key] = value;
      result[key] = value

      // if (key.toLowerCase() === 'role') {
      //   var level =_.find(_def.role,{code:value})
      //   result['level'] = level
      //   sessionStorage['level'] = level;
      // }
    })

    if (result._p) {
      query = aes.de(result._p) || ''

      try {
        result = JSON.parse(query)
      } catch (error) {

      }
    }

    return result
  },

  /**
   * 解析出url中的参数，以键值对的形式返回
   */
  getUrlParmas: function (url) {
    var result = {}

    if (url.indexOf('?') <= 0) {
      return result
    }

    var query = url.split('?')[1]
    query = decodeURIComponent(query.replace(/%20/g, '+'))
    var queryArr = query.split('&')
    queryArr.forEach(function (item) {
      var key = item.split('=')[0]
      var value = item.split('=')[1]
      result[key] = value
    })

    return result
  },

  /**
   * 将obj 转换为标准的url
   * @param {string} url
   * @param {bool} hasTimestamp 是否要加入时间戳
   * @param {bool}  hasSign 是否要加入签名
   */
  generateUrl (url, hasTimestamp, hasSign) {
    if (!url) {
      return ''
    }

    // 获取地址中包含的所有参数
    let paramsObj = this.getUrlParmas(url)

    if (hasTimestamp) {
      paramsObj.timestamp = this.getTimestamp()
    }

    if (hasSign) {
      paramsObj.sign = sign(paramsObj)
    }

    url = url.split('?')[0]
    var paramsStr = '?'
    _.forEach(paramsObj, function (value, key) {
      paramsStr += key + '=' + value + '&'
    })

    paramsStr = _.trimEnd(paramsStr, '&')
    url += paramsStr

    return url
  },

  newGuid: function () {
    var guid = ''
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16)
      guid += n
      if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
        guid += ''
      }
    }
    return guid
  },

  getTimestamp () {
    return new Date().getTime()
  },

  setAppKey: function () {
    // 这是暂时用于调试的设置
    sessionStorage.appkey = '11111'
    sessionStorage.accesstoken = '456456'
  },

  /**
   * 将url中的参数占位符全部替换为实际的参数值
   * @param {string} url
   * @param {string} params
   */
  replaceUrlParams (url, params) {
    if (url && params && _.isPlainObject(params)) {
      _.forEach(params, function (val, key) {
        try {
          url = url.replace(new RegExp('{' + key + '}', 'gi'), val)
        } catch (error) {

        }
      })
    }
    return url
  },

  /**
   * 更新上下文参数集
   * @param {*} context
   * @param {*} data
   */
  updateContext (context, data) {
    if (!data) {
      return {}
    }

    if (!context) {
      context = {}
    }

    _.forEach(data, function (val, key) {
      // 由于接口传过来的字段名称不统一，所以这里尽量处理统一下
      key = _.toLower(key)
      if (_.includes(['code', 'querycode'], key)) {
        context['code'] = val
      } else if (_.includes(['eno', 'enterpriseno'], key)) {
        context['eno'] = val
        context['enterpriseno'] = val
      } else if (_.includes(['ename', 'enterprisename'], key)) {
        context['ename'] = val
        context['enterprisename'] = val
      } else if (_.includes(['tid', 'templateid'], key)) {
        context['tid'] = val
        context['templateid'] = val
      } else if (_.includes(['pid', 'productid'], key)) {
        context['pid'] = val
        context['productid'] = val
      } else {
        context[key] = val
      }
    })

    return context
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.format = function (args) {
  var result = this
  let reg
  if (arguments.length > 0) {
    if (arguments.length === 1 && typeof (args) === 'object') {
      for (var key in args) {
        if (args[key] !== undefined) {
          reg = new RegExp('({' + key + '})', 'g')
          result = result.replace(reg, args[key])
        }
      }
    } else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) {
          reg = new RegExp('({)' + i + '(})', 'g')
          result = result.replace(reg, arguments[i])
        }
      }
    }
  }
  return result
}

// 转换成list型，如 转换成object型，如[{key：'key1',val:'val1'}] =>{key1:'val1'}
Vue.prototype.convertCompProps = function (props) {
  var that = this
  var jsonProps = {}
  _.forEach(props, function (ch, i) {
    jsonProps[ch.key] = ch

    // 判断当前用户是否对该属性有操作的权限
    jsonProps[ch.key].available = that.sup8.role.permissionLevel >= ch.level
  })

  return jsonProps
}

// 将object型的参数 转换成list型
Vue.prototype.convertCompPropsToList = function (cfg) {
  if (!cfg || !cfg.pages) {
    return cfg
  }

  _.forEach(cfg.pages, function (page, i) {
    if (page.components && page.components.length > 0) {
      _.forEach(page.components, function (comp, j) {
        if (comp.props) {
          var tempProp = []
          _.forEach(comp.props, function (prop) {
            tempProp.push(prop)
          })
          comp.props = tempProp
        }
      })
    }
  })
  return cfg
}

// 定义全局函数
Vue.prototype.getCompPropVal = function (prorps, propKey) {
  if (!prorps || !propKey) {
    return undefined
  }
  return _.find(prorps, {
    key: propKey
  }).val
}

/**
 * 合并填充组件的属性值，给没有获取到的属性附上默认值
 * @param {*} prorps 实际属性值
 * @param {*} defaultprorps 默认属性值
 */
Vue.prototype.mergeCompProps = function (comp) {
  if (!comp || !this.sup8 || !this.sup8._baseComponentList) {
    return
  }

  let baseComp = _.find(this.sup8._baseComponentList, {
    id: comp.baseCompId
  })
  if (!baseComp) {
    return
  }

  let defaultProrps = baseComp.props

  for (let index = 0; index < defaultProrps.length; index++) {
    let ch = defaultProrps[index]
    if (comp.props[ch.key] === undefined || comp.props[ch.key] === null) {
      comp.props[ch.key] = ch
    } else if ((comp.props[ch.key].val === undefined || comp.props[ch.key].val === null) && ch.required === true) {
      comp.props[ch.key].val = ch.val // 给默认值
    }
  }
}
