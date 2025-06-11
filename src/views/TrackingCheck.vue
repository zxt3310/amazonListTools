<template>
	<div class="page">
		<my-navi activeIndex="2"></my-navi>
		<h2>CA Tracking Check</h2>
		<div class="">
			<el-container>
				<el-header>
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
							<el-dropdown-item command="tracker">运单号</el-dropdown-item>
							<el-dropdown-item command="date">日期</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-input v-model="searchParam" v-if="searchKey != 'date'" style="margin:0 10px;"
						@keyup.enter.native="searchRecord"></el-input>

					<el-date-picker v-else style="margin: 0 10px; width: 50%;" v-model="searchParam" type="daterange"
						align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
						:picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>

					<el-button type="primary" :disabled="searching" @click="searchRecord">
						搜索 <i class="el-icon-search"></i>
					</el-button>

					<div style="margin-left: 50px;">
						<el-button size="medium" :loading="searching"
							@click="redirectToAuthUPS()">{{ btnTilte }}</el-button>
					</div>
				</el-header>
				<el-container v-loading="loading">
					<el-aside width="200px"> </el-aside>
					<el-main>
						<el-table :data="tableData" stripe :max-height="table_max_height-220">
							<el-table-column prop="id" label="ID" width="80">
							</el-table-column>
							<el-table-column prop="updated_at" label="扫描时间" width="160">
							</el-table-column>
							<el-table-column prop="express_num" label="运单号" width="180">
							</el-table-column>
							<el-table-column label="状态" width="120">
								<template slot-scope="scope">
									<el-tag :type="tag_enmu[scope.row.ca_tag].style">
										{{ tag_enmu[scope.row.ca_tag].status }}
									</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="" width="120">
								<template slot-scope="scope">
									<el-button size="mini" type="primary"
										@click="handleDelete(scope.$index, scope.row)">
										查看
									</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="last_description" label="Last Status">
							</el-table-column>
						</el-table>
					</el-main>
				</el-container>
			</el-container>
			<el-drawer @opened="onOpen" :modal="false" :visible.sync="drawer" :append-to-body="true" size="35%">
				<template #title>
					<h2>{{ showingTracking.inquiryNumber }}</h2>
				</template>
				<div style="line-height: 5px;">
					<el-row>
						<el-col :span="12" :offset="2">
							<h4>FROM:</h4>
							<h4>
								{{
					  showingTracking.package[0].packageAddress[0].address
					    .addressLine1
					}}
							</h4>
							<h4>
								{{ showingTracking.package[0].packageAddress[0].address.city }}
								{{
					  showingTracking.package[0].packageAddress[0].address
					    .stateProvince
					}}
								{{
					  showingTracking.package[0].packageAddress[0].address.postalCode
					}}
								{{
					  showingTracking.package[0].packageAddress[0].address.countryCode
					}}
							</h4>
						</el-col>
						<el-col :span="10">
							<h4>TO:</h4>
							<h4>
								{{
					  showingTracking.package[0].packageAddress[1].address
					    .addressLine1
					}}
							</h4>
							<h4>
								{{ showingTracking.package[0].packageAddress[1].address.city }}
								{{
					  showingTracking.package[0].packageAddress[1].address
					    .stateProvince
					}}
								{{
					  showingTracking.package[0].packageAddress[1].address.postalCode
					}}
								{{
					  showingTracking.package[0].packageAddress[1].address.countryCode
					}}
							</h4>
						</el-col>
					</el-row>
				</div>
				<el-timeline>
					<el-scrollbar class="hide-horizontal-scrollbar" :style="draw_style">
						<el-timeline-item v-for="(activity, index) in showingTracking.package[0].activity" :key="index"
							placement="top" :timestamp="timeformat(activity.date, activity.time)">
							<el-card>
								<h4>
									{{ locationformat(activity.location.address) }}
								</h4>
								<p>{{ activity.status.description }}</p>
							</el-card>
						</el-timeline-item>
					</el-scrollbar>
				</el-timeline>
			</el-drawer>
		</div>
	</div>
</template>

<script>
	import moment from "moment-timezone";
	// import axios from 'axios'
	import axios from "../js/request.js";
	import axiosEx from "axios";
	import {
		Loading
	} from "element-ui";
	export default {
		computed: {
			draw_style() {
				return {
					margin: "20px",
					height: `${window.innerHeight - 220}px`
				}
			}
		},
		data() {
			return {
				tableData: [],
				tag_enmu: [{
						status: "Unknow",
						style: "info"
					},
					{
						status: "Shipping",
						style: "warning"
					},
					{
						status: "delivered",
						style: "success"
					},
					{
						status: "Warning",
						style: "danger"
					}
				],
				//按钮文字
				btnTilte: "点击开始",
				//查询类型
				searchKey: "date",
				//时间快捷选项
				pickerOptions: {
					shortcuts: [{
							text: "最近一周",
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit("pick", [start, end]);
							}
						},
						{
							text: "最近一个月",
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit("pick", [start, end]);
							}
						}
					]
				},
				//loading
				loading: false,
				//搜索条件
				searchParam: "",
				//查询状态
				searching: false,
				//抽屉
				drawer: false,
				//table高度
				table_max_height: window.innerHeight,
				//当前抽屉展示中的tracking全信息
				showingTracking: {
					package: [{
						activity: [{
							location: {
								address: {}
							},
							status: {
								description: ""
							},
							date: "",
							time: ""
						}],
						packageAddress: [{
								address: {
									addressLine1: "",
									city: "",
									stateProvince: "",
									postalCode: "",
									countryCode: ""
								}
							},
							{
								address: {
									addressLine1: "",
									city: "",
									stateProvince: "",
									postalCode: "",
									countryCode: ""
								}
							}
						]
					}]
				},
				//中断请求
				cancelToken:false
			};
		},
		created() {
			this.getCATrakcingInMonth();
		},
		beforeDestroy() {
			this.cancelToken = true;
		},
		methods: {
			getInitData() {
				axios.get("getpage").then(e => {
					this.tableData = e.data.orders;
					this.history = e.data.history;
				});
			},
			getCATrakcingInMonth() {
				this.loading = true;
				axios.get("getcaorder").then(e => {
					this.tableData = e.data;
					this.loading = false;
				});
			},
			searchBtnText(e) {
				var text = "";
				switch (e) {
					case "tracker":
						text = "运单号";
						break;
					case "date":
						text = "日期";
						break;
				}
				return text;
			},
			searchRecord(e) {
				if (this.searchParam.length == 0) {
					return;
				}
				let key = this.searchKey;
				if (key == "date") {
					this.loading = true;
					axios
						.post("searchtrackings", {
							type: key,
							param: this.searchParam
						})
						.then(res => {
							this.tableData = res.data;
							this.loading = false;
						});
				}
				if (key == "tracker") {
					this.searchSingleTrack(this.searchParam);
				}
			},

			delay(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			},

			//开启批量请求
			async redirectToAuthUPS() {
				this.searching = true;
				let index = 0;
				let end = this.tableData.length;
				let that = this;
				for (let index = 0; index < end; index++) {
					let order = that.tableData[index];
					//忽略已经delivered
					if (order.ca_tag == 2) {
						continue;
					}
					let res;
					try {
						res = await axios.post("trackingcheck", {
							tracking_id: order.express_num
						});
					} catch (e) {
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
							if (last1 == last2 && last1 == "016") {
								order.ca_tag = 3;
							}
						}
					} else {
						order.ca_tag = 2;
						axios.post("updateCaTag", {
							id: order.id
						});
					}
					order.last_description = activity[0].status.description;
					that.tableData[index] = order;
					this.btnTilte = `进度：${index + 1} / ${end}`;
					if(this.cancelToken){
						return;
					}
					await this.delay(1000);
				}
				this.searching = false;
				this.btnTilte = "点击开始";
			},
			onOpen() {},
			//单个tracking查询
			handleDelete(index, row) {
				this.searchSingleTrack(row.express_num);
			},
			searchSingleTrack(tracking) {
				this.loading = true;
				axios
					.post("trackingcheck", {
						tracking_id: tracking
					})
					.then(res => {
						this.drawer = true;
						this.showingTracking = res.data.trackResponse.shipment[0];
						this.loading = false;
					});
			},
			timeformat(dateString, timeString) {
				var year = dateString.substring(0, 4);
				var month = dateString.substring(4, 6);
				var day = dateString.substring(6, 8);
				var hour = timeString.substring(0, 2);
				var min = timeString.substring(2, 4);
				var second = timeString.substring(4, 6);
				return `${year}-${month}-${day} ${hour}:${min}:${second}`;
			},
			locationformat(location) {
				var city = location.city || "";
				var stateProvince = location.stateProvince || "";
				var country = location.country || "";

				return `${city} ${stateProvince} ${country}`;
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

	.hide-horizontal-scrollbar {
		-ms-overflow-style: none;
		/* IE 10+ */
		scrollbar-width: none;
		/* Firefox */
	}

	.hide-horizontal-scrollbar::-webkit-scrollbar {
		display: none;
		/* Chrome, Safari, Opera*/
	}

	.page {
		width: 100%;
		height: 100%;
	}


	#el-drawer__title {
		margin-bottom: 0;
	}
</style>