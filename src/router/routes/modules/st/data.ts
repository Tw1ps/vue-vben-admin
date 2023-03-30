import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const data: AppRouteModule = {
  path: '/data',
  name: 'Data',
  component: LAYOUT,
  redirect: '/data/goods',
  meta: {
    orderNo: 10,
    icon: 'ant-design:database-outlined',
    title: t('st.page.data'),
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
  ],
};

export default data;
