<template>
	<div class="about">
		<my-navi activeIndex="4"></my-navi>
		<!-- <h2>Return & Warranty</h2> -->
		<div class="" style="">
			<el-container>
				<el-header style="position: relative;">
					<el-dropdown @command="
              e => {
                searchKey = e;
                searchParam = '';
              }
            ">
						<el-button type="primary">
							{{ searchBtnText(searchKey)
              }}<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="order">订单号</el-dropdown-item>
							<el-dropdown-item command="tracker">运单号</el-dropdown-item>
							<el-dropdown-item command="SN">SN</el-dropdown-item>
							<el-dropdown-item command="date">日期</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-input v-model="searchParam" v-if="searchKey != 'date'" style="margin:0 10px; width: 70%;"
						@keyup.enter.native="searchRecord"></el-input>

					<el-date-picker v-else style="margin: 0 10px; width: 50%;" v-model="searchParam" type="daterange"
						align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
						value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>

					<el-button type="primary" @click="searchRecord">
						搜索 <i class="el-icon-search"></i>
					</el-button>
					<el-button type="primary" style="position: absolute; right: 50px;"
						@click="directToAdd">新增退货</el-button>
				</el-header>
				<el-container>
					<el-main>
						<el-tabs v-model="activeStatus" type="card" @tab-click="handleStatusClick">
							<el-tab-pane label="全部" name="all"></el-tab-pane>
							<el-tab-pane label="需要质保" name="0"></el-tab-pane>
						</el-tabs>
						<el-table :cell-click="check_when_copyed" :height="table_max_height" v-loading="loading"
							:data="tableData" :row-style="tagBroke">
							<el-table-column prop="rt_id" label="ID" width="100">
							</el-table-column>
							<el-table-column prop="decision" label="Decision" width="110" :formatter="decisionFmt">
							</el-table-column>
							<el-table-column prop="rec_dt" label="Received On" width="110" :formatter="dateformat">
							</el-table-column>
							<el-table-column prop="created_at" label="Processed On" width="111" :formatter="dateformat">
							</el-table-column>
							<el-table-column prop="brand" label="Brand" width="90">
							</el-table-column>
							<el-table-column prop="model" label="Model" width="180">
							</el-table-column>
							<el-table-column prop="upc" label="UPC" width="115">
							</el-table-column>
							<el-table-column prop="rt_qty" label="Quantity" width="100">
							</el-table-column>
							<el-table-column prop="is_need_war" label="Repair" width="100">
								<template slot-scope="scope">
									<el-checkbox style="transform: scale(1.3);" :value="scope.row.is_need_war"
										disabled></el-checkbox>
								</template>
							</el-table-column>
							<el-table-column prop="rt_track" label="Return Tracking" width="170">
							</el-table-column>
							<el-table-column prop="cur_config" label="Current Config" width="160">
							</el-table-column>
							<el-table-column prop="lb_type" label="Label Type" width="100">
							</el-table-column>
							<el-table-column prop="order_id" label="Order#" width="170">
							</el-table-column>
							<el-table-column prop="seller" label="Store" width="90">
							</el-table-column>
							<el-table-column prop="creator" label="Operator" width="90">
							</el-table-column>
							<el-table-column prop="rt_dt" label="Returned Date" width="120" :formatter="dateformat">
							</el-table-column>
							<el-table-column prop="sn" label="SN" width="160">
							</el-table-column>
							<el-table-column prop="cur_config" label="Current Config" width="160">
							</el-table-column>
							<el-table-column prop="rt_cmt" label="Condition Notes:" width="200">
							</el-table-column>
							<el-table-column prop="rt_cmt_cs" label="Comments for service" width="200">
							</el-table-column>
							<el-table-column prop="rt_reason" label="Return Reason" width="200">
							</el-table-column>
							<!-- <el-table-column prop="war_expire_dt" label="Expire On" width="100">
							</el-table-column>
							<el-table-column prop="war_opr" label="Warranty Operator" width="100">
							</el-table-column>
							<el-table-column prop="war_method" label="Repair Method" width="100">
							</el-table-column>
							<el-table-column prop="war_track_out" label="Outbound Tracking" width="100">
							</el-table-column>
							<el-table-column prop="war_track_in" label="Inbound Tracking" width="100">
							</el-table-column>
							<el-table-column prop="war_dt" label="Date" width="100">
							</el-table-column>
							<el-table-column prop="war_case" label="Case#" width="100">
							</el-table-column>
							<el-table-column prop="war_cmt" label="Warranty Comments" width="200">
							</el-table-column> -->
							<el-table-column label="操作" width="150">
								<template slot-scope="scope">
									<el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">
										Edit</el-button>
									<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
										Del</el-button>
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
	import moment from "moment-timezone";
	import axios from "../js/request.js";
	import Clipboard from "clipboard";
	import {
		Loading
	} from "element-ui";

	export default {
		data() {
			return {
				//展示表数据
				tableData: [],
				//查询类型
				searchKey: "order",
				//搜索条件
				searchParam: "",
				//页面数据
				table_max_height: window.innerHeight - 220,

			};
		},
		created() {
			this.getInitData();
		},
		mounted() {
			console.log("刷新页面")
		},
		methods: {
			getInitData() {
				axios.get("getReturn").then((e) => {
					this.tableData = e.data;
				})
			},
			dateformat(row, column, cellValue, index) {
				let res = cellValue.split(' ')
				return res[0]
			},
			decisionFmt(row, column, cellValue, index) {
				if (cellValue) {
					let ori = ["Sell as new", "Used: Good", "Repair needed", "Junk for parts", "Pending Decision"]
					return ori[parseInt(cellValue)]
				} else {
					return ""
				}
			},
			//标记某行为警示颜色
			tagBroke(rowObj) {
				let index = rowObj.rowIndex
				if (this.tableData[index].is_need_war) {
					return {
						// "background-color":"red",
						// "color":"white"
					}
				}
			},
			searchBtnText(e) {
				var text = "";
				switch (e) {
					case "order":
						text = "订单号";
						break;
					case "tracker":
						text = "运单号";
						break;
					case "SN":
						text = "SN";
						break;
					case "date":
						text = "日期";
						break;
				}
				return text;
			},
			searchRecord(e) {},

			handleEdit(index, row) {
				this.$router.push({
					path: "/addreturn",
					query: {
						data: JSON.stringify(row)
					}
				})
			},

			handleDelete(index, row) {
				this.$confirm("此操作将删除该运单, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {

					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			//导航到创建页
			directToAdd() {
				this.$router.push({
					path: "/addreturn"
				}).catch(err => {
					console.log(err)
				})
			},

			//复制内容
			check_when_copyed(row, column, cell, event) {
				let identify = "123";
				const clipboard = new Clipboard(identify);
				clipboard.on("success", (e) => {
					this.$message({
						type: "success",
						message: '已复制到剪切板'
					});
					// 释放内存
					clipboard.destroy();
				});
				clipboard.on("error", e => {
					// 不支持复制
					this.$message.error('该浏览器不支持复制');
					// 释放内存
					clipboard.destroy();
				});
			}
		}
	};
</script>

<style>
	.el-header,
	.el-footer {
		background-color: #b3c0d1;
		color: #333;
		text-align: center;
		line-height: 60px;
		display: flex;
		align-items: center;
		padding: 0 3rem;
	}

	.el-aside {
		background-color: #d3dce6;
		color: #333;
		text-align: center;
		line-height: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
	}

	.el-main {
		background-color: #e9eef3;
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