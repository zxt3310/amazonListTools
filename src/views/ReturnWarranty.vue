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
						<el-table :height="table_max_height" v-loading="loading" :data="tableData" stripe>
							<el-table-column prop="rt_id" label="ID" width="80">
							</el-table-column>
							<el-table-column prop="condition" label="Condition" width="100">
							</el-table-column>
							<el-table-column prop="brand" label="Brand" width="80">
							</el-table-column>
							<el-table-column prop="model" label="Model" width="100">
							</el-table-column>
							<el-table-column prop="seller" label="Seller" width="100">
							</el-table-column>
							<el-table-column prop="rt_rma" label="RMA" width="150">
							</el-table-column>
							<el-table-column prop="order_id" label="Order#" width="150">
							</el-table-column>
							<el-table-column prop="rt_track" label="Tracking" width="100">
							</el-table-column>
							<el-table-column prop="upc" label="UPC" width="100">
							</el-table-column>
							<el-table-column prop="sn" label="SN" width="100">
							</el-table-column>
							<el-table-column prop="cur_config" label="Current Config" width="180">
							</el-table-column>
							<el-table-column prop="cmt" label="Comment" width="200">
							</el-table-column>
							<el-table-column prop="cmt_cs" label="Comments for Service" width="300">
							</el-table-column>
							<el-table-column prop="rt_reason" label="Reason" width="300">
							</el-table-column>
							<el-table-column prop="creator" label="Name" width="80">
							</el-table-column>
							<el-table-column prop="war_case" label="Warranty Case" width="150">
							</el-table-column>
							<el-table-column prop="war_sta" label="Warranty Status" width="200">
							</el-table-column>
							<el-table-column prop="war_opr" label="Operator" width="100">
							</el-table-column>
							<el-table-column prop="war_ship_date" label="Warranty Ship Date" width="200">
							</el-table-column>
							<el-table-column prop="war_track" label="Warranty Tracking" width="200">
							</el-table-column>
							<el-table-column prop="war_back_date" label="Warranty Back Date" width="200">
							</el-table-column>
							<el-table-column prop="war_cmt" label="Warranty Comment" width="280">
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
	import moment from "moment-timezone";
	import axios from "../js/request.js";
	import axiosEx from "axios";
	import {
		Loading
	} from "element-ui";

	export default {
		data() {
			return {
				drawer: false,
				//展示表数据
				tableData: [],
				//查询类型
				searchKey: "order",
				//时间快捷选项
				scanError: {
					show: false,
					msg: ""
				},
				//搜索条件
				searchParam: "",
				//页面数据
				table_max_height: window.innerHeight - 220,
				history: {
					today: 0,
					yestoday: 0,
					exthird: 0,
					exfourth: 0,
					exfifth: 0
				},
				scandata: {
					scan_order: "",
					scan_tracker: "",
					scan_SN: ""
				}
			};
		},
		created() {
			// this.getInitData();
		},
		methods: {
			getInitData() {
				axios.get("getpage").then(e => {
					this.tableData = e.data.orders;
					this.history = e.data.history;
				});
			},
			getDateName(cnt) {
				return moment(new Date().getTime() - cnt * 1000 * 24 * 3600).format(
					"MM-DD"
				);
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
			onSubmit(e) {
				// console.log(e);
				this.$refs.SN_input.focus();
			},
			SNEditing() {
				// console.log(this.scandata.scan_SN)
				let SNs = this.scandata.scan_SN.split("\n");
				let flag = "SN_Scan_END_FLAG";
				if (SNs.includes(flag)) {
					SNs.splice(-2, 2);
					console.log(SNs);
					this.scanOrder(SNs.join(", "));
				}
			},
			scanOrder(SN_post) {},
			onOpen() {
				this.$refs.tracker_input.focus();
			},
			handleDelete(index, row) {
				this.$confirm("此操作将删除该运单, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						axios
							.post("removeorder", {
								id: row.id,
								express_num: row.express_num
							})
							.then(res => {
								if (res.ret == 0) {
									this.getInitData();
								}
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			directToAdd() {
				this.$router.push({
					path: "/addreturn"
				}).catch(err => {
					console.log(err)
				})
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