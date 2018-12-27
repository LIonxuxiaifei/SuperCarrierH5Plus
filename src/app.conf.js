/**
 * app config
 */

// 本地调式
// const _baseConfig = {
//   debug: true,
//   appKey: 'appkey_h5plus',
//   nodeApiHost: 'http://localhost:3000',
//   publicPath: 'http://res8.yesno.com.cn/'
// }

// 192.168.10.182、192.168.10.185
const _baseConfig = {
  debug: true,
  appKey: 'appkey_h5plus',
  nodeApiHost: 'http://h5api8.yesno.com.cn:81',
  publicPath: 'http://res8.yesno.com.cn/'
}

// 阿里云正式环境
// const _baseConfig = {
//   debug: false,
//   appKey: 'appkey_h5plus',
//   nodeApiHost: 'http://h5api.supercarrier8.com',
//   publicPath: 'http://cj8.ren/'
// }

module.exports = {
  version: '2.0.2', // 当前版本
  debug: _baseConfig.debug,
  app: {
    key: _baseConfig.appKey
  },
  // export default {
  cdn: {
    open: false, // 是否开启cdn
    publicPath: _baseConfig.publicPath
  },
  nodeApiHost: _baseConfig.nodeApiHost,
  apiUrl: {
    config: `${_baseConfig.nodeApiHost}/index/getconfig`,
    saveConfig: `${_baseConfig.nodeApiHost}/index/saveconfig`,
    updateConfig: `${_baseConfig.nodeApiHost}/index/update`,
    getBaseComponentList: `${_baseConfig.nodeApiHost}/index/getbasecomponentlist`,
    getComponentProps: `${_baseConfig.nodeApiHost}/index/getcomponenproplist`,
    getPageTypeList: `${_baseConfig.nodeApiHost}/index/getpagetypelist`,
    upload: `${_baseConfig.nodeApiHost}/file/UploadFile`,
    getNavList: `${_baseConfig.nodeApiHost}/index/getnavlist`,

    // provides for you h5port
    decodeUrl: `${_baseConfig.nodeApiHost}/code/decodeurl`,
    decode: `${_baseConfig.nodeApiHost}/code/decode`,
    getReply: `${_baseConfig.nodeApiHost}/code/getReply`,

    getPortal: `${_baseConfig.nodeApiHost}/portal/getportal`,
    getTemplate: `${_baseConfig.nodeApiHost}/template/gettemplate`,

    getProductInfo: `${_baseConfig.nodeApiHost}/code/getProductInfo`,
    getAntifakeInfo: `${_baseConfig.nodeApiHost}/code/getAntifakeInfo`, // 查询防伪信息接口
    getTraceInfo: `${_baseConfig.nodeApiHost}/content/getTraceInfo`, // 查询溯源信息接口

    // 内容管理
    getBgImg: `${_baseConfig.nodeApiHost}/content/getBgImg`,
    getBrandInfo: `${_baseConfig.nodeApiHost}/content/getBrandInfo`,

    // 企业
    getEnterpriseInfo: `${_baseConfig.nodeApiHost}/content/getEnterpriseInfo`,
    getEnterprise: `${_baseConfig.nodeApiHost}/enterprise/getEnterprise`
  },

  systemComponentsPath: './components/', // 系统组件存放位置
  installComponentsPath: './components.install/', // 安装组件存放位置

  design: {
    mainView: './DesignEnv',
    errorView: './Error',
    components: [
      'PartCompList', // 属性列表区
      'PartPropsSetting', // 属性设置区
      'CompQr',
      'CompSaveDialog',
      'PartPageList'
    ]
  },

  run: {
    mainView: './RunEnv',
    errorView: './Error'
  },

  sign: {
    open: true, // 是否开启签名验证
    key: 'sup8signkey', // 需与服务端一致
    expiresIn: 30 * 60 // 单位s
  }
}

// 测试tfs
