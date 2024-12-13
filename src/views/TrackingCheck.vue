<template>
	<div class="about">
		<!-- <h2>CA Tracking Check</h2> -->
		<div class="" style="">
			<el-container>
				<el-header>
					30日内的加拿大Tracking Number
				</el-header>
				<el-container>
					<el-aside width="200px">
						<el-button size="medium" @click="redirectToAuthUPS()">加拿大Tracking预警
						</el-button>
					</el-aside>
					<el-main>
						<el-table max-height="700" v-loading="loading" :data="tableData" stripe>
							<el-table-column prop="id" label="ID" width="80">
							</el-table-column>
							<el-table-column prop="updated_at" label="扫描时间" width="160">
							</el-table-column>
							<el-table-column prop="express_num" label="运单号" width="180">
							</el-table-column>
							<el-table-column label="状态" width="120">
								<template slot-scope="scope">
									<el-tag :type="tag_enmu[scope.row.ca_tag].style">
										{{tag_enmu[scope.row.ca_tag].status}}
									</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="" width="120">
								<template slot-scope="scope">
									<el-button size="mini" type="primary"
										@click="handleDelete(scope.$index, scope.row)">
										查看 </el-button>
								</template>
							</el-table-column>
							<el-table-column prop="last_description" label="Last Status">
							</el-table-column>
						</el-table>
					</el-main>
				</el-container>
			</el-container>
		</div>
	</div>
</template>

<script>
	import moment from 'moment-timezone';
	// import axios from 'axios'
	import axios from '../js/request.js';
	import axiosEx from 'axios';
	import {
		Loading
	} from 'element-ui';
	export default {
		data() {
			return {
				tableData: [],
				tag_enmu: [{
						"status": "Unknow",
						"style": "info"
					},
					{
						"status": "Shipping",
						"style": "warning"
					},
					{
						"status": "delivered",
						"style": "success"
					},
					{
						"status": "Warning",
						"style": "danger"
					},
				]
			}
		},
		created() {
			this.getCATrakcingInMonth()
		},
		methods: {
			getInitData() {
				axios.get('getpage').then((e) => {
					this.tableData = e.data.orders;
					this.history = e.data.history;
				})
			},
			getCATrakcingInMonth() {
				axios.get('getcaorder').then((e) => {
					this.tableData = e.data;
				})
			},

			delay(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			},

			//开启批量请求
			async redirectToAuthUPS() {
				let index = 0;
				let end = this.tableData.length;
				let that = this;
				for (let index = 0; index < end; index++) {
					let order = that.tableData[index];
					let res;
					try{
						res = await axios.post("trackingcheck", {
							'tracking_id': order.express_num
						});
					}catch(e){
						console.log(e);
					}
					let tracking = res.data;
					//获取包裹
					let pack = tracking.trackResponse.shipment[0].package[0];
					//获取扫描点
					let activity = pack.activity;
					//获取包裹最新状态
					let curStatus = pack.currentStatus;
					if (curStatus.code != "011") {
						order.ca_tag = 1;
						if (activity.length > 1) {
							let last1 = activity[0].status.statusCode;
							let last2 = activity[1].status.statusCode;
							if (last1 == last2 == "016") {
								order.ca_tag = 3;
							}
						}
					} else {
						order.ca_tag = 2;
						axios.post("updateCaTag", {
							"id": order.id
						})
					}
					order.last_description = activity[0].status.description;
					that.tableData[index] = order;
					await this.delay(2000);
				}

				// let intervalId = setInterval(function() {
				// 		let order = that.tableData[index];
				// 		try {
				// 			axios.post("trackingcheck", {
				// 				'tracking_id': order.express_num
				// 			}).then((res) => {
				// 				let tracking = res.data;
				// 				//获取包裹
				// 				let pack = tracking.trackResponse.shipment[0].package[0];
				// 				//获取扫描点
				// 				let activity = pack.activity;
				// 				//获取包裹最新状态
				// 				let curStatus = pack.currentStatus;
				// 				if (curStatus.code != "011") {
				// 					let last1 = activity[0].statusCode;
				// 					let last2 = activity[1].statusCode
				// 					if (last1 == last2 == "016") {
				// 						order.ca_tag = 3;
				// 						that.tableData[index] = order;
				// 					} else {
				// 						order.ca_tag = 1;
				// 						that.tableData[index] = order;
				// 					}
				// 				} else {
				// 					order.ca_tag = 2;
				// 					that.tableData[index] = order;
				// 					axios.post("updateCaTag", {
				// 						"id": order.id
				// 					})
				// 				}
				// 			})
				// 		} catch (e) {
				// 			//TODO handle the exception
				// 			console.log(e)
				// 		} finally {
				// 			//判断结束状态
				// 			index = index + 1;
				// 			if (index == end) {
				// 				clearInterval(intervalId);
				// 			}
				// 		}

				// 	},
				// 	2000);
			},

			handleDelete(index, row) {
				this.$confirm('此操作将删除该运单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					axios.post("removeorder", {
						"id": row.id,
						"express_num": row.express_num
					}).then((res) => {
						if (res.ret == 0) {
							this.getInitData();
						} else {
							alert(res.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
		}
	}
</script>

<style>
	.el-header,
	.el-footer {
		background-color: #B3C0D1;
		color: #333;
		text-align: center;
		line-height: 60px;
		display: flex;
		align-items: center;
		padding: 0 3rem;
	}

	.el-aside {
		background-color: #D3DCE6;
		color: #333;
		text-align: center;
		line-height: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
	}

	.el-main {
		background-color: #E9EEF3;
		color: #333;
		text-align: center;
	}

	body>.el-container {
		margin-bottom: 40px;
	}

	.el-container:nth-child(5) .el-aside,
	.el-container:nth-child(6) .el-aside {
		line-height: 260px;
	}

	.el-container:nth-child(7) .el-aside {
		line-height: 320px;
	}
</style>