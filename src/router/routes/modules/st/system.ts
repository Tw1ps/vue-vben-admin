import type { AppRouteModule } from '@/router/types';

import { RoleEnum } from '@/enums/roleEnum';
import { t } from '@/hooks/web/useI18n';
import { LAYOUT } from '@/router/constant';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/setting',
  meta: {
    orderNo: 90,
    icon: 'ant-design:setting-outlined',
    title: t('st.menu.system'),
    roles: [RoleEnum.SU, RoleEnum.ADMIN, RoleEnum.SERVICE, RoleEnum.OVERVIEW],
  },
  children: [
    {
      path: 'status',
      name: 'SystemInfo',
      component: () => import('@/views/st/system/info/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.status'),
      },
    },
    {
      path: 'log',
      name: 'SystemLog',
      component: () => import('@/views/st/system/log/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.system_log'),
        roles: [RoleEnum.SU, RoleEnum.ADMIN],
      },
    },
    {
      path: 'fmtlog',
      name: 'FmtLog',
      component: () => import('@/views/st/fmtlogs/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.fmt_log'),
      },
    },
    {
      path: 'setting',
      name: 'Setting',
      component: () => import('@/views/st/system/setting/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.system_setting'),
        roles: [RoleEnum.SU, RoleEnum.ADMIN],
      },
    },
  ],
};

export default system;
