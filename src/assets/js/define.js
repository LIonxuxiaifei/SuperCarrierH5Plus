/**
 * 用于定义一些基础变量
 */

export default {
  env: {
    design: {
      val: 'design',
      title: '设计器模式'
    },
    run: {
      val: 'run',
      title: '运行模式'
    },
    preview: {
      val: 'preview',
      title: '预览模式'
    }
  },

  optionType: {
    add: '1',
    modify: '2',
    copy: '3',
    addPortal: '4', // 新增入口模板,新增完成后要跳转回原页面
    modifyPortal: '5' // 修改入口模板,修改完成后要跳转回原页面
  },

  role: [
    {
      code: 'default',
      permissionLevel: 1,
      title: '缺省'
    },

    {
      code: 'R_0001',
      permissionLevel: 1,
      title: '品牌商'
    },
    {
      code: 'R_0002',
      permissionLevel: 2,
      title: '制造商/OEM工厂'
    },
    {
      code: 'R_0003',
      permissionLevel: 3,
      title: '经销商/代理商'
    },
    {
      code: 'R_0004',
      permissionLevel: 4,
      title: '门店/商超'
    },
    {
      code: 'R_0005',
      permissionLevel: 5,
      title: '集团/总部'
    },
    {
      code: 'R_0006',
      permissionLevel: 6,
      title: '平台运营方'
    },
    {
      code: 'R_0007',
      permissionLevel: 7,
      title: '个人开发者'
    },
    {
      code: 'R_0008',
      permissionLevel: 8,
      title: '企业或者团队开发者'
    },
    {
      code: 'R_0009',
      permissionLevel: 9,
      title: '标签供应商'
    },
    {
      code: 'R_0010',
      permissionLevel: 10,
      title: '系统服务商'
    },
    {
      code: 'R_0011',
      permissionLevel: 1,
      title: '第三方软件公司'
    }
  ],

  /* 入口类型 */
  portalType: {
    default: {
      code: 0,
      msg: '默认'
    },
    third: {
      code: 1,
      msg: '第三方插件'
    },
    marketing: {
      code: 2,
      msg: '营销活动'
    },
    custom: {
      code: 3,
      msg: '自定义配置'
    }
  },

  linkType: { // 页面中链接的跳转方式
    innerPage: {
      value: '0',
      label: '内部页面'
    },
    outerPage: {
      value: '1',
      label: '外部页面'
    },
    otherTemplate: {
      value: '2',
      label: '其他模板'
    },
    customContent: {
      value: '3',
      label: '富文本'
    }
  }

  // /**
  //  * 事件列表
  //  */
  // eventKey: {
  //   //disable:'disable.comp'
  //   antifakeFalse: 'antifake.false', //防伪查询结果数码不合法、假码等
  //   antifakeTrue: 'antifake.true', //防伪查询结果数码合法
  //   pruductChange: 'pruduct.change', // 产品变更
  //   previewdataChange: 'previewdata.change', // 演示数据变更
  //   hasNavList: 'has.navlist',
  // }
}
