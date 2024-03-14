import type { AppRouteModule } from '@/router/types';

import { t } from '@/hooks/web/useI18n';
import { LAYOUT } from '@/router/constant';

const asset: AppRouteModule = {
  path: '/asset',
  name: 'Asset',
  component: LAYOUT,
  redirect: '/asset/bot',
  meta: {
    orderNo: 20,
    icon: 'ant-design:project-outlined',
    title: t('st.menu.asset'),
  },
  children: [
    {
      path: 'bot',
      name: 'Bot',
      component: () => import('@/views/st/bot/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.bot'),
      },
    },
    {
      path: 'keyword',
      name: 'Keyword',
      component: () => import('/@/views/st/keyword/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.keyword'),
      },
    },
    {
      path: 'task',
      name: 'Task',
      component: () => import('@/views/st/task/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.task'),
      },
    },
    // {
    //   path: 'host',
    //   name: 'Host',
    //   component: () => import('/@/views/st/host/index.vue'),
    //   meta: {
    //     // affix: true,
    //     title: t('st.page.host'),
    //     // roles: [RoleEnum.SU, RoleEnum.ADMIN],
    //   },
    // },
  ],
};

export default asset;
