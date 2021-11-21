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
    meta: { isMainMenu: true, icon: TachometerAlt },
    component: Layout,
    children: [
      {
        path: '/search-data',
        name: 'SearchData',
        meta: { icon: SearchSharp },
        component: () => dynamicImportView('Overview/SearchData')
      },
      {
        path: '/my-data',
        name: 'MyData',
        alias: '',
        meta: { icon: DashboardSharp },
        component: () => dynamicImportView('Overview/MyData')
      },
      {
        path: '/my-client',
        name: 'MyClient',
        meta: { icon: DownloadForOfflineRound },
        component: () => dynamicImportView('Overview/MyClient')
      },
      {
        path: '/my-collection',
        name: 'MyCollection',
        meta: { icon: FavoriteSharp },
        component: () => dynamicImportView('Overview/MyCollection')
      },
      {
        path: '/search-result-snapshot',
        name: 'SearchResultSnapshot',
        meta: { icon: AddAPhotoSharp },
        component: () => dynamicImportView('Overview/SearchResultSnapshot')
      },
      {
        path: '/download-history',
        name: 'DownloadHistory',
        meta: { icon: HistorySharp },
        component: () => dynamicImportView('Overview/DownloadHistory')
      },
      {
        path: '/keep-upload-task',
        name: 'KeepUploadTask',
        meta: { icon: MergeTypeSharp },
        component: () => dynamicImportView('Overview/KeepUploadTask')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { isMainMenu: true, icon: SettingsSharp },
    component: Layout,
    children: [
      {
        path: '/set-base',
        name: 'setBase',
        meta: { icon: SettingsSuggestSharp },
        component: () => dynamicImportView('Settings/setBase')
      },
      {
        path: '/set-site',
        name: 'setSite',
        meta: { icon: PublicSharp },
        component: () => dynamicImportView('Settings/setSite')
      },
      {
        path: '/set-search-solution',
        name: 'setSearchSolution',
        meta: { icon: WidgetsSharp },
        component: () => dynamicImportView('Settings/setSearchSolution')
      },
      {
        path: '/set-client',
        name: 'setClient',
        meta: { icon: CloudDownloadSharp },
        component: () => dynamicImportView('Settings/setClient')
      },
      {
        path: '/set-download-paths',
        name: 'setDownloadPaths',
        meta: { icon: FolderOpenSharp },
        component: () => dynamicImportView('Settings/setDownloadPaths')
      },
      {
        path: '/set-backup',
        name: 'setBackup',
        meta: { icon: SettingsBackupRestoreSharp },
        component: () => dynamicImportView('Settings/setBackup')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    meta: { isMainMenu: true, keepAlive: true, icon: TabOutlined },
    component: Layout,
    children: [
      {
        path: '/technology-stack',
        name: 'TechnologyStack',
        meta: { icon: DeveloperBoardSharp },
        component: () => dynamicImportView('About/TechnologyStack')
      },
      {
        path: '/change-log',
        name: 'ChangeLog',
        meta: { icon: TrackChangesSharp },
        component: () => dynamicImportView('About/ChangeLog')
      },
      {
        path: '/dev-team',
        name: 'DevTeam',
        meta: { icon: PeopleSharp },
        component: () => dynamicImportView('About/DevTeam')
      },
      {
        path: '/donate',
        name: 'Donate',
        meta: { icon: FreeBreakfastSharp },
        component: () => dynamicImportView('About/Donate')
      }
    ]
  },
  {
    path: '/devtools',
    name: 'Devtools',
    meta: { isMainMenu: true, icon: Tools },
    component: Layout,
    children: [
      {
        path: '/system-log',
        name: 'SystemLog',
        meta: { icon: AssignmentFilled },
        component: () => dynamicImportView('Devtools/SystemLog')
      },
      {
        path: '/debugger',
        name: 'Debugger',
        meta: { icon: BugReportSharp },
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
