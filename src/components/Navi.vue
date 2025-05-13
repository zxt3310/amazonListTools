<template>
	<div>
		<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
			background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<el-menu-item index="1">Tracking SN管理</el-menu-item>
			<el-menu-item index="2">CA Tracking追踪</el-menu-item>
			<el-menu-item index="3">Upgrade Workbench</el-menu-item>
			<el-menu-item index="4">Return</el-menu-item>
			<el-menu-item index="5">UnRefund</el-menu-item>
			<el-menu-item index="6">Warranty</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
	export default {
		name: 'MyNavi',
		data() {
			return {
				// activeIndex: '1',
			};
		},
		props:{
			activeIndex:{
				type:String,
				default:"2"
			}
		},
		methods: {
			handleSelect(key, keyPath) {
				let curPath = this.$router.history.current.path;
				let routerPath = [
					"/",
					"/trackingcheck",
					"/UpgradeMission",
					"/Return",
					"/unrefund",
					"/Warranty"
				]
				if(curPath === routerPath[key-1]){
					return
				}
				
				this.$router.replace({
					path:routerPath[key-1]
				});
			}
		}
	}
</script>

<style>
</style>