import type { AppRouteModule } from '@/router/types';

import { t } from '@/hooks/web/useI18n';
import { LAYOUT } from '@/router/constant';

const data: AppRouteModule = {
  path: '/data',
  name: 'data',
  component: LAYOUT,
  redirect: '/data/host',
  meta: {
    orderNo: 20,
    icon: 'ant-design:project-outlined',
    title: t('st.page.goods'),
  },
  children: [
    {
      path: 'host',
      name: 'Host',
      component: () => import('@/views/st/host/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.site'),
        // roles: [RoleEnum.SU, RoleEnum.ADMIN],
      },
      children: [
        {
          path: 'detail/:id',
          name: 'HostDetail',
          component: () => import('@/views/st/host-detail/index.vue'),
          meta: {
            // affix: true,
            title: t('st.page.site_detail'),
            // roles: [RoleEnum.SU, RoleEnum.ADMIN],
            hideMenu: true,
            dynamicLevel: 5,
            realPath: '/data/host/detail',
          },
        },
      ],
    },
  ],
};

export default data;
