import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const datas: AppRouteModule = {
  path: '/data',
  name: 'Data',
  component: LAYOUT,
  redirect: '/data/goods',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('st.page.goods'),
  },
  children: [
    {
      path: 'goods',
      name: 'Goods',
      component: () => import('/@/views/st/goods/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.goods'),
      },
    },
    {
      path: 'censor',
      name: 'Censor',
      component: () => import('/@/views/st/censor/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.censor'),
      },
    },
    {
      path: 'license',
      name: 'License',
      component: () => import('/@/views/st/license/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.license'),
      },
    },
    {
      path: 'user',
      name: 'User',
      component: () => import('/@/views/st/user/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.user'),
      },
    },
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
  ],
};

export default datas;
