<template>
	<div>
		<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
			background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<el-menu-item index="1">Tracking SN管理</el-menu-item>
			<el-menu-item index="2">CA Tracking追踪</el-menu-item>
			<el-menu-item index="3">Upgrade Workbench</el-menu-item>
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
				console.log(this.$router)
				let curPath = this.$router.history.current.path;
				let routerPath = [
					"/",
					"/trackingcheck",
					"/UpgradeMission"
				]
				if(curPath === routerPath[key-1]){
					return
				}
				this.$router.push({
					path:routerPath[key-1]
				});
			}
		}
	}
</script>

<style>
</style>