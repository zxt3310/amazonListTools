<template>
	<div>
		<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
			background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<el-submenu index="1">
				<template slot="title">
					<i class="el-icon-office-building"></i>
					<span>Work Flow</span>
				</template>
				<el-menu-item index="1">Tracking SN管理</el-menu-item>
				<el-menu-item index="2">CA Tracking追踪</el-menu-item>
				<el-menu-item index="3">Upgrade Workbench</el-menu-item>
				<el-menu-item index="4">Return</el-menu-item>
				<el-menu-item index="5">Need Refund</el-menu-item>
				<el-menu-item index="6">Warranty</el-menu-item>
			</el-submenu>
			<el-submenu index="2">
				<template slot="title">
					<i class="el-icon-box"></i>
					<span>Material</span>
				</template>
				<el-menu-item index="8">UPC 获取</el-menu-item>
				<el-menu-item index="9">UPC 计算</el-menu-item>
				<el-menu-item index="10">Pro Code</el-menu-item>
			</el-submenu>
			<el-menu-item index="7">
				<i class="el-icon-sold-out"></i>
				<span>上下架</span>
			</el-menu-item>
			
			<el-submenu index="3" v-if="$store.getters.isAdmin">
				<template slot="title">
					<i class="el-icon-setting"></i>
					<span>Setting</span>
				</template>
				<el-menu-item index="11">
					<i class="el-icon-s-custom"></i>
					<span>User Manage</span>
				</el-menu-item>
			</el-submenu>
			
			<div style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%);">
				<el-button style="font-size: 20px; color: white;" type="text" @click="show=true"
					icon="el-icon-s-operation"></el-button>
			</div>
		</el-menu>
		<el-drawer :visible.sync="show" :append-to-body="true" :modal-append-to-body="true" size="13%">
			<div slot="title">
				{{user?user.name:"未登录"}}
			</div>
			<el-divider></el-divider>
			<div></div>
			<div style="text-align: center;">
				<el-button @click="logout">Logout</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script>
	export default {
		name: 'MyNavi',
		data() {
			return {
				show: false,
				user: this.$store.state.userinfo
				// activeIndex: '1',
			};
		},
		props: {
			activeIndex: {
				type: String,
				default: "2"
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
					"/Warranty",
					"/inventory-adjustment",
					"/UPC",
					"/CaculateUPC",
					"/procode",
					"/user"
				]
				if (curPath === routerPath[key - 1]) {
					return
				}

				this.$router.replace({
					path: routerPath[key - 1]
				});
			},
			logout() {
				this.$store.commit("logout")
			}
		}
	}
</script>

<style>
</style>