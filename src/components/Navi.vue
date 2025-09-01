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
				<el-menu-item index="12">AMZ Invoice</el-menu-item>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title">
					<i class="el-icon-box"></i>
					<span>Inventory</span>
				</template>
				<el-menu-item index="7">
					<i class="el-icon-sold-out"></i>
					<span>上下架指令发布</span>
				</el-menu-item>
				<el-menu-item index="13">
					<i class="el-icon-sold-out"></i>
					<span>库存修改文件导出</span>
				</el-menu-item>
			</el-submenu>
			<el-submenu index="3" v-if="$store.getters.isSuperAdmin">
				<template slot="title">
					<i class="el-icon-setting"></i>
					<span>Setting</span>
				</template>
				<el-menu-item index="11">
					<i class="el-icon-s-custom"></i>
					<span>User Manage</span>
				</el-menu-item>
			</el-submenu>

			<div style="position: absolute; right: 80px; top: 50%; transform: translateY(-50%);">
				<el-badge :value="dots==0?null:dots" class="badge-item">
					<el-popover placement="bottom-end" trigger="hover" width="500">
						<el-table :data="notifications" stripe :show-header="false" @row-click="notify_click">
							<el-table-column prop="type" width="120px" show-overflow-tooltip></el-table-column>
							<el-table-column prop="message" with="220px" show-overflow-tooltip></el-table-column>
							<el-table-column>
								<template slot-scope="scope">
									<el-badge is-dot :hidden="scope.row.is_read"
										style="margin-top: 10px;margin-right: 40px;">
										<el-button size="mini" v-if="!scope.row.is_read"
											@click="handleReaded(scope.$index, scope.row)">
											Readed</el-button>
									</el-badge>
									<el-button style="color: red; font-size: 18px;" type="text" icon="el-icon-delete"
										@click="handleDelete(scope.$index, scope.row)"></el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-button slot="reference" style="font-size: 20px; color: white;" type="text"
							icon="el-icon-message-solid"></el-button>
					</el-popover>
				</el-badge>
			</div>

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
	import axios from '../js/request.js';
	export default {
		name: 'MyNavi',
		data() {
			return {
				show: false,
				user: this.$store.state.userinfo,
				countOfNotification: null
				// activeIndex: '1',
			};
		},
		props: {
			activeIndex: {
				type: String,
				default: "2"
			}
		},
		computed: {
			notifications() {
				return this.$store.state.notifications;
			},
			dots() {
				let items = this.notifications;
				let unreads = items.filter(item => item.is_read == false)
				return unreads.length;
			}
		},
		// watch:{
		// 	notifications(newValue,oldValue){
		// 		if(oldValue != newValue){
		// 			this.countOfNotification = newValue.length
		// 		}
		// 	}
		// },
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
					"/user",
					"/invoice",
					"/inventory-modify-output"
				]
				if (curPath === routerPath[key - 1]) {
					return
				}

				this.$router.replace({
					path: routerPath[key - 1]
				});
			},
			notify_click(row, column, event) {
				this.$router.replace({
					path: row.path
				})
			},
			logout() {
				this.$store.commit("logout")
			},
			handleReaded(index, row) {
				axios.post("readMessage", {
					id: row.id
				}).then((e) => {
					if (e.ret == 0) {
						this.$store.dispatch("fetchMessage")
					}
				})
			},
			handleDelete(index,row){
				axios.post("delMessage",{
					id: row.id
				}).then((e)=>{
					if (e.ret == 0) {
						this.$store.dispatch("fetchMessage")
					}
				})
			}
		}
	}
</script>

<style>
	.badge-item {
		/* margin-top: 20px !important;
	  margin-right: 40px !important; */
	}
</style>