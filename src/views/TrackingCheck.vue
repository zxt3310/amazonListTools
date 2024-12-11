<template>
	<div class="about">
		<h2>CA Tracking Check</h2>
		<div class="" style="">
			<el-container style="height: 45rem;">
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
							<el-table-column prop="id" label="ID" width="100">
							</el-table-column>
							<el-table-column prop="updated_at" label="扫描时间" width="220">
							</el-table-column>
							<el-table-column prop="order_id" label="订单号" width="120">
							</el-table-column>
							<el-table-column prop="express_num" label="运单号" width="220">
							</el-table-column>
							<el-table-column prop="SN" label="Serial Number" width="220">
							</el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
										删除</el-button>
								</template>
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
				UpsToken:"",
				appId:"vMMcWqjwiIWDuS8n3Mg6Mt2Wzj9t0U7celxYCTMmvVHfHXBr",
				appSecret:"msWuqdWTkAEI8RVxmBfxzjVAlGNAySbsIVMokpochWm95JU9uVG43q1jCskuAfm5"
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
			getCATrakcingInMonth(){
				axios.get('getcaorder').then((e) =>{
					this.tableData = e.data;
				})
			},
			//执行检查步骤
			checkCATracking(){
				
			},
			//检查ups token
			preAuthToUPS(){
				
			},
			//跳转授权
			redirectToAuthUPS(){
				// axios.post("gettoken",{
				// 	"clientid":this.$UPS_APPID,
				// 	"secret": this.$UPS_APPSECRET
				// }).then((res)=>{
				// 	console.log(res)
				// })
				
					
				axios.post("trackingcheck",{
					'tracking_id':'1ZAC95659113215464'
				}).then((res)=>{
					console.log(res)
				})
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
