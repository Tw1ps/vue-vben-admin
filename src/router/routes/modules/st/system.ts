import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const usr: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/setting',
  meta: {
    orderNo: 40,
    icon: 'ant-design:setting-outlined',
    title: t('st.page.system'),
  },
  children: [
    {
      path: 'setting',
      name: 'Setting',
      // component: () => import('/@/views/st/setting/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.setting'),
      },
    },
    {
      path: 'logger',
      name: 'Logger',
      component: () => import('/@/views/st/logger/index.vue'),
      meta: {
        // affix: true,
        title: t('st.page.logger'),
      },
    },
  ],
};

export default usr;
