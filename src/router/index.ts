import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import * as Routes from '@/router/routes'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainLayout,
    redirect: Routes.ROOT,
    children: [
      // Stock routes
      {
        path: Routes.BALANCES,
        name: "Balances",
        component: () => import("@/views/stock/BalancesView.vue"),
        meta: { title: "Баланс", icon: "pi pi-box" },
      },
      {
        path: Routes.RECEIPTS,
        name: "Receipts",
        component: () => import("@/views/stock/ReceiptsView.vue"),
        meta: { title: "Поступления", icon: "pi pi-arrow-down" },
      },
      {
        path: Routes.RECEIPT_ADD,
        name: "AddReceipt",
        component: () => import("@/views/stock/ReceiptEditView.vue"),
        meta: {
          title: "Добавить поступление",
          icon: "pi pi-arrow-down",
          hideInMenu: true
        }
      },
      {
        path: Routes.RECEIPT_EDIT,
        name: "EditReceipt",
        component: () => import("@/views/stock/ReceiptEditView.vue"),
        props: (route) => ({ id: route.params.id }),
        meta: {
          title: "Редактировать поступление",
          icon: "pi pi-arrow-down",
          hideInMenu: true
        }
      },
      {
        path: Routes.SHIPMENTS,
        name: "Shipments",
        component: () => import("@/views/stock/ShipmentsView.vue"),
        meta: { title: "Отгрузки", icon: "pi pi-arrow-up" },
      },
      {
        path: Routes.SHIPMENT_ADD,
        name: "AddShipment",
        component: () => import("@/views/stock/ShipmentEditView.vue"),
        meta: {
          title: "Добавить отгрузку",
          icon: "pi pi-arrow-down",
          hideInMenu: true
        }
      },
      {
        path: Routes.SHIPMENT_EDIT,
        name: "EditShipment",
        component: () => import("@/views/stock/ShipmentEditView.vue"),
        props: (route) => ({ id: route.params.id }),
        meta: {
          title: "Редактировать отгрузку",
          icon: "pi pi-arrow-down",
          hideInMenu: true
        }
      },
      // Reference routes
      {
        path: Routes.CLIENTS,
        name: "Clients",
        component: () => import("@/views/refs/ClientsView.vue"),
        meta: { title: "Клиенты", icon: "pi pi-users" },
      },
      {
        path: Routes.CLIENT_ADD,
        name: "AddClient",
        component: () => import("@/views/refs/ClientEditView.vue"),
        meta: {
          title: "Добавить клиента",
          hideInMenu: true
        },
      },
      {
        path: Routes.CLIENT_EDIT,
        name: "EditClient",
        component: () => import("@/views/refs/ClientEditView.vue"),
        meta: {
          title: "Редактировать клиента",
          hideInMenu: true
        },
        props: true,
      },
      {
        path: Routes.UNITS,
        name: "Units",
        component: () => import("@/views/refs/UnitsView.vue"),
        meta: { title: "Единицы измерения", icon: "pi pi-gauge" },
      },
      {
        path: Routes.UNIT_ADD,
        name: "AddUnit",
        component: () => import("@/views/refs/UnitEditView.vue"),
        meta: {
          title: "Добавить единицу измерения",
          hideInMenu: true
        },
      },
      {
        path: Routes.UNIT_EDIT,
        name: "EditUnit",
        component: () => import("@/views/refs/UnitEditView.vue"),
        meta: {
          title: "Редактировать единицу измерения",
          hideInMenu: true
        },
        props: true,
      },
      // Resources routes
      {
        path: Routes.RESOURCES,
        name: "Resources",
        component: () => import("@/views/refs/ResourcesView.vue"),
        meta: { title: "Ресурсы", icon: "pi pi-tags" },
      },
      {
        path: Routes.RESOURCE_ADD,
        name: "AddResource",
        component: () => import("@/views/refs/ResourceEditView.vue"),
        meta: {
          title: "Добавить ресурс",
          hideInMenu: true
        },
      },
      {
        path: Routes.RESOURCE_EDIT,
        name: "EditResource",
        component: () => import("@/views/refs/ResourceEditView.vue"),
        meta: {
          title: "Редактировать ресурс",
          hideInMenu: true
        },
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router