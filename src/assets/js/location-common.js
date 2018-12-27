var CCN = function () {
  var ipScript = false // 是否已经加载了获取ip的js

  /**
   * 获取操作系统
   * @returns {}
   */
  this.getOS = function () {
    var flag = 'unknown'
    var agent = navigator.userAgent.toLowerCase()

    var supportOsList = [{
      keyword: 'android',
      regStr: /android [\d.]+/gi
    },
    {
      keyword: 'iphone os',
      regStr: /iphone os [\d_]+/gi
    },
    {
      keyword: 'ipod',
      regStr: /ipod+/gi
    },
    {
      keyword: 'ipad',
      regStr: /ipad+/gi
    },
    {
      keyword: 'meego',
      regStr: /meego+/gi
    },
    {
      keyword: 'windows phone',
      regStr: /windows phone [\d.]+/gi
    },
    {
      keyword: 'windows nt',
      regStr: /windows nt [\d.]+/gi
    },
    {
      keyword: 'macintosh',
      regStr: /macintosh+/gi
    },
    {
      keyword: 'ubuntu',
      regStr: /ubuntu [\d.]+/gi
    }
    ]

    $.each(supportOsList, function (i, item) {
      if (agent.indexOf(item.keyword) >= 0) {
        flag = agent.match(item.regStr)[0]
        return false
      }
      return true
    })

    return flag
  }

  /**
   * 获取浏览器信息
   * @returns {}
   */
  this.getBrowser = function () {
    var agent = navigator.userAgent.toLowerCase()
    var browser = 'unknown'
    var supportBrowserList = [{
      keyword: 'micromessenger',
      regStr: /micromessenger\/[\d.]+/gi
    },
    {
      keyword: 'baidubrowser',
      regStr: /baidubrowser\/[\d.]+/gi
    },
    {
      keyword: 'ucbrowser',
      regStr: /ucbrowser\/[\d.]+/gi
    },
    {
      keyword: 'msie',
      regStr: /ie [\d.]+/gi
    },
    {
      keyword: 'trident',
      regStr: /trident\/[\d.]+/gi
    },
    {
      keyword: 'firefox',
      regStr: /firefox\/[\d.]+/gi
    },
    {
      keyword: 'chrome',
      regStr: /chrome\/[\d.]+/gi
    },
    {
      keyword: 'safari',
      regStr: /safari\/[\d.]+/gi
    }
    ]

    $.each(supportBrowserList, function (i, item) {
      if (agent.indexOf(item.keyword) >= 0) {
        browser = agent.match(item.regStr)[0]
        return false
      }
      return true
    })

    return browser
  }

  function loadJs (url, callback) {
    // debugger
    var script = document.createElement('script')
    script.type = 'text/javascript'
    if (typeof (callback) !== 'undefined') {
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null
            callback()
          }
        }
      } else {
        script.onload = function () {
          callback()
        }
      }
    }
    script.src = url
    document.body.appendChild(script)
  };

  var importBaiduMap = function (callback) {
    // var domId = 'baidumap';
    // var $dom = document.getElementById(domId);
    // if ($dom) { // 不再重复加载
    //   return;
    // }

    // var oHead = document.getElementsByTagName('HEAD').item(0);
    // var oScript = document.createElement("script");
    // oScript.type = "text/javascript";
    // oScript.src = "http://api.map.baidu.com/getscript?v=2.0&ak=DAkHeza7GMvAuA5FL2p8GAZxC84WoMLh";
    // oScript.async = false; // 同步
    // oScript.id = domId;
    // oHead.appendChild(oScript);

    var url = 'http://api.map.baidu.com/getscript?v=2.0&ak=DAkHeza7GMvAuA5FL2p8GAZxC84WoMLh'
    loadJs(url, callback)
  }

  var importWechatJs = function () {
    var domId = 'wechatjs'
    var $dom = document.getElementById(domId)
    if ($dom) { // 不再重复加载
      return
    }

    var oHead = document.getElementsByTagName('HEAD').item(0)
    var oScript = document.createElement('script')
    oScript.type = 'text/javascript'
    oScript.src = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js'
    oScript.async = false // 同步
    oScript.id = domId
    oHead.appendChild(oScript)
  }

  /**
   * 通过百度地图获取地理位置
   * @param {} _cb_success
   * @param {} _cb_error
   * @returns {}
   */
  var getGeoByBaiduMap = function (_cb_success, _cb_error) {
    console.log('getGeoByBaiduMap')
    // debugger
    importBaiduMap(function () {
      var geolocation = new BMap.Geolocation()
      var startTime = new Date().getTime()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var endTime = new Date().getTime()

          if (typeof _cb_success === 'function') {
            _cb_success({
              time: endTime - startTime, // 耗时
              latitude: r.point.lat,
              longitude: r.point.lng,
              map: 'baidu'
            })
          }
        } else {
          if (typeof _cb_error === 'function') {
            _cb_error('failed')
          }
        }
      }, {
        enableHighAccuracy: true,
        timeout: 10000
      })
    })
  }

  /**
   * 获取地理位置
   * @param {} _cb_success  成功回调
   * @param {} _cb_error 失败回调
   * @returns {}
   */
  this.getGeo = function (_cb_success, _cb_error) {
    var nav = window.navigator
    var error = {
      code: -1,
      message: '无法获取当前位置'
    }

    getGeoByBaiduMap(_cb_success, _cb_error)

    // if (nav != null) {
    //   var geoloc = nav.geolocation;
    //   if (geoloc != null) {
    //     //if (this.getBrowser().indexOf('chrome') >= 0) {// 如果是谷歌浏览器，使用百度定位
    //     //    getGeoByBaiduMap(_cb_success, _cb_error);
    //     //    return;
    //     //}
    //     //else
    //     { // 使用原始定位方式
    //       var startTime = new Date().getTime();
    //       geoloc.getCurrentPosition(function (position) {
    //         var endTime = new Date().getTime();
    //         if (position.coords !== undefined) {
    //           if (typeof _cb_success === "function") {
    //             _cb_success({
    //               time: endTime - startTime, // 耗时
    //               latitude: position.coords.latitude,
    //               longitude: position.coords.longitude,
    //               map: 'browser'
    //             });
    //           }

    //         };
    //       }, function (error) {
    //         // 定位失败了，用百度再定位一次
    //         getGeoByBaiduMap(_cb_success, _cb_error);
    //       }, {
    //         timeout: 2000
    //       });
    //     }

    //   } else { // 浏览器不支持定位
    //     if (typeof _cb_error === "function") {
    //       _cb_error(error);
    //     }
    //   }
    // } else {
    //   if (typeof _cb_error === "function") {
    //     _cb_error(error);
    //   }
    // }
  }

  // 初始化微信jssdk配置
  function intiWeiXinConfig (parameters) {
    var _currentUrl = location.href.split('#')[0]
    console.log('当前页面地址：' + _currentUrl)
    $.ajax({
      url: 'http://mit.yesno.com.cn:8031/WeChatInterface/Share/GetWeChatConfig',
      data: {
        url: _currentUrl
      },
      type: 'post',
      dataType: 'json',
      success: function (data) {
        console.log('获取配置信息：', data)
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.AppId, // 必填，公众号的唯一标识
          timestamp: data.Timestamp, // 必填，生成签名的时间戳
          nonceStr: data.NonceStr, // 必填，生成签名的随机串
          signature: data.Signature, // 必填，签名，见附录1
          jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
      },
      error: function () {
        console.log('获取配置信息失败')
      }
    })
  }

  this.getGeoByWechat = function (_cb_success, _cb_error) {
    var startTime = new Date().getTime()
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        var endTime = new Date().getTime()
        var time = endTime - startTime // 耗时
        res.time = time

        if (typeof _cb_success === 'function') {
          _cb_success(res)
        }
      },
      error: function () {
        if (typeof _cb_error === 'function') {
          _cb_error('微信定位失败')
        }
      }
    })
  }

  /**
   * 获取IP地址
   * @param {} _cb_success 回调
   * @param {} _cb_error 回调
   * @returns {}
   */
  this.getIp = function (_cb_success, _cb_error) {
    if (ipScript) {
      if (window.returnCitySN !== undefined) {
        if (typeof _cb_success === 'function') {
          _cb_success(window.returnCitySN)
        }
      } else {
        if (typeof _cb_error === 'function') {
          _cb_error('获取IP失败')
        }
      }
    } else {
      $.ajax({
        url: 'http://pv.sohu.com/cityjson',
        dataType: 'script',
        success: function (res) {
          ipScript = true
          if (typeof _cb_success === 'function') {
            _cb_success(window.returnCitySN)
          }
        },
        error: function () {
          if (typeof _cb_error === 'function') {
            _cb_error('获取IP失败')
          }
        }
      })
    }
  }

  var init = function () {
    var agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('micromessenger') >= 0) {
      importWechatJs()
      intiWeiXinConfig()
    } else {
      // importBaiduMap();
    }
  //  importBaiduMap();
  }

  // init();
  this.Geo = function (_cb_success, _cb_error) {
    var agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('micromessenger') >= 0) {
      this.getGeoByWechat(_cb_success, _cb_error)
    } else {
      this.getGeo(_cb_success, _cb_error)
    }
  }
}

module.exports = CCN
