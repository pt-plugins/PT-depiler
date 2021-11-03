/**
 * 由于 Vue-i18n v9 在 CSP 环境中无法进行编译操作，所以所有语言文件需要在此处预注册，
 * 不然不会在插件页面显示，也不能实现像 v1.x 中的”临时添加新语言功能“
 */
import { ILangMetaData } from '@/shared/interfaces/common';

export default <ILangMetaData[]>[
  {
    name: 'English (Beta)',
    code: 'en',
    authors: [
      'ronggang', 'ylxb2016', 'xiongqiwei', 'jackson008'
    ]
  },
  {
    name: '简体中文 Chinese (Simplified)',
    code: 'zh-CN',
    authors: [
      '栽培者'
    ]
  }
];
