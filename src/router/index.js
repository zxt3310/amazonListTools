import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import About from "../views/About.vue";
// import CAConvert from "../views/CAConvert.vue";
import UPC from "../views/UPC.vue";
import CaculateUPC from "../views/CaculateUPC.vue";
import TrackingCheck from "../views/TrackingCheck.vue";
import UpgradeMission from "../views/UpgradeMission.vue";
import Login from "../views/login.vue"
import Return from "../views/Return.vue";
import UnRefund from "../views/UnRefund.vue";
import Warranty from "../views/Warranty.vue";
import AddRtWrVue from "../views/AddRtWr.vue";
import store from "../store";
import InventoryAjustment from "../views/InventoryAjustment.vue";
import WinProCode from "../views/WinProCode.vue";
import UserManage from "../views/UserManage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "About",
    component: About
  },
 //  {
 //    path: "/about",
 //    name: "About",
 //    // route level code-splitting
 //    // this generates a separate chunk (about.[hash].js) for this route
 //    // which is lazy-loaded when the route is visited.
 //    // component: () =>
 //    //   import(/* webpackChunkName: "about" */ "../views/About.vue")
	// component: About
 //  },
 //  {
	//   path:"/CAConvert",
	//   name:"CAConvert",
	//   component: CAConvert
  // },
  {
	  path:"/UPC",
	  name:"UPC",
	  component: UPC
  },
  {
	  path:"/CaculateUPC",
	  name:"UPC计算器",
	  component: CaculateUPC
  },
  {
	  path:"/trackingcheck",
	  name:"CA Tracking Check",
	  component: TrackingCheck
  },
  {
	  path:"/UpgradeMission",
	  name:"UpgradeMission",
	  component: UpgradeMission
  },
  {
	  path:"/login",
	  name:"Login",
	  component: Login
  },
  {
	  path:"/return",
	  name:"Return",
	  component:Return,
	  meta: { keepAlive: true }
  },
  {
  	  path:"/warranty",
  	  name:"Warranty",
  	  component:Warranty
  },
  {
  	  path:"/unrefund",
  	  name:"UnRefund",
  	  component:UnRefund
  },
  {
	  path:"/addreturn",
	  name:"addreturn",
	  component:AddRtWrVue
  },
  {
	  path:"/inventory-adjustment",
	  name:"inventory",
	  component:InventoryAjustment
  },
  {
	  path:"/procode",
	  name:"ProCode",
	  component:WinProCode
  },
  {
	  path:"/user",
	  name:"User Manage",
	  component:UserManage
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // 记录上一个路由到Vuex
  store.commit('setPreviousRoute', from);
  next();
});

export default router;
