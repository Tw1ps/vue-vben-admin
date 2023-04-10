import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const usr: AppRouteModule = {
  path: '/usr',
  name: 'Usr',
  component: LAYOUT,
  redirect: '/data/user',
  meta: {
    orderNo: 30,
    icon: 'ant-design:team-outlined',
    title: t('st.page.usr'),
  },
  children: [
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
  ],
};

export default usr;
