import type { AppRouteModule } from '@/router/types';

import { t } from '@/hooks/web/useI18n';
import { LAYOUT } from '@/router/constant';

const cluster: AppRouteModule = {
  path: '/cluster',
  name: 'Cluster',
  component: LAYOUT,
  redirect: '/cluster/nodes',
  meta: {
    orderNo: 30,
    icon: 'ant-design:setting-outlined',
    title: t('st.menu.cluster'),
  },
  children: [
    {
      path: 'nodes',
      name: 'Nodes',
      component: () => import('@/views/st/cluster/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.cluster'),
      },
      children: [
        {
          path: 'detail/:id',
          name: 'NodeDetail',
          component: () => import('@/views/st/cluster/detail/index.vue'),
          meta: {
            // affix: true,
            title: t('st.page.node_detail'),
            // roles: [RoleEnum.SU, RoleEnum.ADMIN],
            hideMenu: true,
            dynamicLevel: 5,
            realPath: '/cluster/nodes/detail',
          },
        },
      ],
    },
  ],
};

export default cluster;
