import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from './views/Layout.vue';
import { TachometerAlt, Tools } from '@vicons/fa';
import {
  DashboardSharp, SearchSharp, CloudDownloadSharp, BugReportSharp,
  AssignmentFilled, TabOutlined, DeveloperBoardSharp,
  TrackChangesSharp, PeopleSharp, SettingsSharp, SettingsSuggestSharp,
  FreeBreakfastSharp, DownloadForOfflineRound, PublicSharp,
  FolderOpenSharp, WidgetsSharp, SettingsBackupRestoreSharp,
  FavoriteSharp, AddAPhotoSharp, HistorySharp, MergeTypeSharp
} from '@vicons/material';

function dynamicImportView (view: string) {
  return import(/* webpackChunkName: "views/[request]" */ `./views/${view}.vue`);
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Overview',
    meta: { isMainMenu: true, label: '概览', icon: TachometerAlt },
    component: Layout,
    children: [
      {
        path: '/search-data',
        name: 'SearchData',
        meta: { label: '搜索结果', icon: SearchSharp },
        component: () => dynamicImportView('Overview/SearchData')
      },
      {
        path: '/my-data',
        name: 'MyData',
        alias: '',
        meta: { label: '我的数据', icon: DashboardSharp },
        component: () => dynamicImportView('Overview/MyData')
      },
      {
        path: '/my-client',
        name: 'MyClient',
        meta: { label: '我的下载器', icon: DownloadForOfflineRound },
        component: () => dynamicImportView('Overview/MyClient')
      },
      {
        path: '/my-collection',
        name: 'MyCollection',
        meta: { label: '收藏列表', icon: FavoriteSharp },
        component: () => dynamicImportView('Overview/MyCollection')
      },
      {
        path: '/search-result-snapshot',
        name: 'SearchResultSnapshot',
        meta: { label: '搜索结果快照', icon: FavoriteSharp },
        component: () => dynamicImportView('Overview/SearchResultSnapshot')
      },
      {
        path: '/download-history',
        name: 'DownloadHistory',
        meta: { label: '下载历史', icon: HistorySharp },
        component: () => dynamicImportView('Overview/DownloadHistory')
      },
      {
        path: '/keep-upload-task',
        name: 'KeepUploadTask',
        meta: { label: '辅种任务', icon: MergeTypeSharp },
        component: () => dynamicImportView('Overview/KeepUploadTask')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { isMainMenu: true, label: '参数设置', icon: SettingsSharp },
    component: Layout,
    children: [
      {
        path: '/set-base',
        name: 'setBase',
        meta: { label: '常规设置', icon: SettingsSuggestSharp },
        component: () => dynamicImportView('Settings/setBase')
      },
      {
        path: '/set-client',
        name: 'setClient',
        meta: { label: '下载器设置', icon: CloudDownloadSharp },
        component: () => dynamicImportView('Settings/setClient')
      },
      {
        path: '/set-site',
        name: 'setSite',
        meta: { label: '站点设置', icon: PublicSharp },
        component: () => dynamicImportView('Settings/setSite')
      },
      {
        path: '/set-download-paths',
        name: 'setDownloadPaths',
        meta: { label: '下载目录设置', icon: FolderOpenSharp },
        component: () => dynamicImportView('Settings/setDownloadPaths')
      },
      {
        path: '/set-search-solution',
        name: 'setSearchSolution',
        meta: { label: '搜索方案定义', icon: WidgetsSharp },
        component: () => dynamicImportView('Settings/setSearchSolution')
      },
      {
        path: '/set-backup',
        name: 'setBackup',
        meta: { label: '参数备份与恢复', icon: SettingsBackupRestoreSharp },
        component: () => dynamicImportView('Settings/setBackup')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    meta: { isMainMenu: true, keepAlive: true, label: '插件相关', icon: TabOutlined },
    component: Layout,
    children: [
      {
        path: '/technology-stack',
        name: 'TechnologyStack',
        meta: { label: '项目参考与引用', icon: DeveloperBoardSharp },
        component: () => dynamicImportView('About/TechnologyStack')
      },
      {
        path: '/change-log',
        name: 'ChangeLog',
        meta: { label: '更新日志', icon: TrackChangesSharp },
        component: () => dynamicImportView('About/ChangeLog')
      },
      {
        path: '/dev-team',
        name: 'DevTeam',
        meta: { label: '特别感谢', icon: PeopleSharp },
        component: () => dynamicImportView('About/DevTeam')
      },
      {
        path: '/donate',
        name: 'Donate',
        meta: { label: '友情捐赠', icon: FreeBreakfastSharp },
        component: () => dynamicImportView('About/Donate')
      }
    ]
  },
  {
    path: '/devtools',
    name: 'Devtools',
    meta: { isMainMenu: true, label: '开发工具', icon: Tools },
    component: Layout,
    children: [
      {
        path: '/system-log',
        name: 'SystemLog',
        meta: { label: '系统日志', icon: AssignmentFilled },
        component: () => dynamicImportView('Devtools/SystemLog')
      },
      {
        path: '/debugger',
        name: 'Debugger',
        meta: { label: '调试信息', icon: BugReportSharp },
        component: () => dynamicImportView('Devtools/Debugger')
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
