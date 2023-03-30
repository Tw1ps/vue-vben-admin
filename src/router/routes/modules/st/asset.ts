import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';

const asset: AppRouteModule = {
  path: '/asset',
  name: 'Asset',
  component: LAYOUT,
  redirect: '/asset/bot',
  meta: {
    orderNo: 20,
    icon: 'ant-design:project-outlined',
    title: t('st.page.asset'),
  },
  children: [
    {
      path: 'bot',
      name: 'Bot',
      component: () => import('/@/views/st/bot/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.bot'),
      },
    },
    {
      path: 'watch',
      name: 'Watch',
      component: () => import('/@/views/st/watch/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.watch'),
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
      path: 'host',
      name: 'Host',
      component: () => import('/@/views/st/host/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.host'),
        roles: [RoleEnum.SU, RoleEnum.ADMIN],
      },
    },
    {
      path: 'account',
      name: 'Account',
      component: () => import('/@/views/st/account/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.account'),
        roles: [RoleEnum.SU, RoleEnum.ADMIN],
      },
    },
  ],
};

export default asset;
