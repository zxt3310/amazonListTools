import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import About from "../views/About.vue";
// import CAConvert from "../views/CAConvert.vue";
// import UPC from "../views/UPC.vue";
// import CaculateUPC from "../views/CaculateUPC.vue";
import TrackingCheck from "../views/TrackingCheck.vue";
import UpgradeMission from "../views/UpgradeMission.vue";

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
 //  },
 //  {
	//   path:"/UPC",
	//   name:"UPC",
	//   component: UPC
 //  },
 //  {
	//   path:"/CaculateUPC",
	//   name:"UPC计算器",
	//   component: CaculateUPC
 //  },
  {
	  path:"/trackingcheck",
	  name:"CA Tracking Check",
	  component: TrackingCheck
  },
  {
	  path:"/UpgradeMission",
	  name:"UpgradeMission",
	  component: UpgradeMission
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
