import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/stock/balance',
    children: [
      // Stock routes
      {
        path: '/stock/balance',
        name: 'Balance',
        component: () => import('@/views/stock/BalancesView.vue'),
        meta: { title: 'Баланс', icon: 'pi pi-box' }
      },
      {
        path: '/stock/receipts',
        name: 'Receipts',
        component: () => import('@/views/stock/ReceiptsView.vue'),
        meta: { title: 'Поступления', icon: 'pi pi-arrow-down' }
      },
      {
        path: '/stock/receipts/add',
        name: 'AddReceipt',
        component: () => import('@/views/stock/ReceiptCreateView.vue'),
        meta: {
          title: 'Добавить поступление', icon: 'pi pi-arrow-down',
          hideInMenu: true
        }
      },
      {
        path: '/stock/shipments',
        name: 'Shipments',
        component: () => import('@/views/stock/ShipmentsView.vue'),
        meta: { title: 'Отгрузки', icon: 'pi pi-arrow-up' }
      },
      // Reference routes
      {
        path: '/references/clients',
        name: 'Clients',
        component: () => import('@/views/refs/ClientsView.vue'),
        meta: { title: 'Клиенты', icon: 'pi pi-users' }
      },
      {
        path: '/references/clients/add',
        name: 'AddClient',
        component: () => import('@/views/refs/ClientEditView.vue'),
        meta: {
          title: 'Добавить клиента',
          hideInMenu: true
        }
      },
      {
        path: '/references/clients/edit/:id',
        name: 'EditClient',
        component: () => import('@/views/refs/ClientEditView.vue'),
        meta: {
          title: 'Редактировать клиента',
          hideInMenu: true
        },
        props: true
      },
      {
        path: '/references/units',
        name: 'Units',
        component: () => import('@/views/refs/UnitsView.vue'),
        meta: { title: 'Единицы измерения', icon: 'pi pi-gauge' }
      },
      {
        path: '/references/units/add',
        name: 'AddUnit',
        component: () => import('@/views/refs/UnitEditView.vue'),
        meta: {
          title: 'Добавить единицу измерения',
          hideInMenu: true
        }
      },
      {
        path: '/references/units/edit/:id',
        name: 'EditUnit',
        component: () => import('@/views/refs/UnitEditView.vue'),
        meta: {
          title: 'Редактировать единицу измерения',
          hideInMenu: true
        },
        props: true
      },
      // Resources routes
     {
        path: '/references/resources',
        name: 'Resources',
        component: () => import('@/views/refs/ResourcesView.vue'),
        meta: { title: 'Ресурсы', icon: 'pi pi-tags' }
      },
      {
        path: '/references/resources/add',
        name: 'AddResource',
        component: () => import('@/views/refs/ResourceEditView.vue'),
        meta: {
          title: 'Добавить ресурс',
          hideInMenu: true // Mark this route as hidden
        }
      },
      {
        path: '/references/resources/edit/:id',
        name: 'EditResource',
        component: () => import('@/views/refs/ResourceEditView.vue'),
        meta: {
          title: 'Редактировать ресурс',
          hideInMenu: true // Mark this route as hidden
        },
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router