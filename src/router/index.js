import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/plane",
    name: "Plane",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Plane.vue"),
  },
  {
    path: "/shanghai",
    name: "Shanghai",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Shanghai.vue"),
  },
  {
    path: "/phy",
    name: "Phy",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Physics/Phy.vue"),
  },
  {
    path: "/ballFly",
    name: "BallFly",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Physics/BallFly.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
