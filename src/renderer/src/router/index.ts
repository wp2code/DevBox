/** @format */

import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// export const Layout = () => import("@/layout/components/AppMain/index.vue");
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import('@/views/welcome/index.vue'),
  },
  {
    path: '/website',
    children: [
      {
        path: "website",
        name: "website",
        component: () => import('@/views/website/index.vue'),
        meta: { title: "网址", icon: "website" },
      },
    ]
  },
  {
    path: '/code',
    children: [
      {
        path: "code",
        name: "code",
        component: () => import('@/views/code/index.vue'),
        meta: { title: "源码", icon: "code" },
      },
    ]
  },

  {
    path: '/container',
    children: [
      {
        path: "container",
        name: "container",
        component: () => import('@/views/container/index.vue'),
        meta: { title: "容器", icon: "container" },
      },
    ]
  },
  {
    path: "/github",
    children: [
      {
        path: "https://www.baidu.com/",
        redirect: "/github",
        meta: { title: "源码", icon: "github" },
      },
    ]
  },
];
/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;