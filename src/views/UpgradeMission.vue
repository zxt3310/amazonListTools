<template>

	<div ref="mission_page" class="about">
		<my-navi activeIndex="3"></my-navi>
		<!-- <div style="padding: 10px;">
      <router-link to="/">改机任务列表 |</router-link>
      <router-link to="/"> 统计</router-link>
    </div> -->
		<!-- <h2>Update Workbench</h2> -->
		<div class="" style="">
			<el-row :gutter="10">
				<transition name="resize">
					<el-col :style="{width:spanWidth.table}" class="left-col">
						<el-container>
							<el-header style="display: flex; justify-content: space-between; padding: 0 1rem;">
								<div style="flex:1;">
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
											<el-dropdown-item command="order">订单号</el-dropdown-item>
											<el-dropdown-item command="date">日期</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									<el-input v-model="searchParam" v-if="searchKey != 'date'"
										style="margin:0 10px; width: 50%;"
										@keyup.enter.native="searchRecord"></el-input>

									<el-date-picker v-else style="margin: 0 10px; width: 50%;" v-model="searchParam"
										type="daterange" align="right" unlink-panels range-separator="至"
										start-placeholder="开始日期" end-placeholder="结束日期"
										value-format="yyyy-MM-dd HH:mm:ss">
									</el-date-picker>

									<el-button type="primary" @click="searchRecord">
										搜索 <i class="el-icon-search"></i>
									</el-button>
								</div>
								<div>
									<el-button type="primary" circle="" @click="collesp"><i
											class=el-icon-s-data></i></el-button>
								</div>
							</el-header>
							<el-container>
								<el-main>
									<el-tabs v-model="activeStatus" type="card" @tab-click="handleStatusClick">
										<el-tab-pane label="全部" name="all"></el-tab-pane>
										<el-tab-pane label="需刻盘" name="0"></el-tab-pane>
									</el-tabs>
									<el-table :max-height="table_max_height" v-loading="loading" :data="tableData"
										stripe>
										<el-table-column prop="id" label="ID" width="100">
										</el-table-column>
										<!-- <el-table-column prop="code" label="code" width="100">
											<VueBarcode></VueBarcode>
										</el-table-column> -->
										<el-table-column prop="operator" label="操作员" width="120">
										</el-table-column>
										<el-table-column prop="brand" label="品牌" width="100">
										</el-table-column>
										<el-table-column prop="upc" label="UPC" width="120">
										</el-table-column>
										<el-table-column v-if="activeStatus == 'all'" prop="orderid" label="订单号"
											width="170">
										</el-table-column>
										<el-table-column v-if="activeStatus== 'all'" prop="asin" label="ASIN"
											width="120">
										</el-table-column>
										<el-table-column v-if="activeStatus== 'all'" prop="tracking" label="Tracking"
											width="170">
										</el-table-column>
										<el-table-column prop="ram" label="内存" width="120">
										</el-table-column>
										<el-table-column :formatter="ssdFmt" label="SSD" width="150">
										</el-table-column>
										<el-table-column prop="system" label="系统" width="120">
										</el-table-column>
										<el-table-column prop="status" label="已刻盘" width="80">
											<template slot-scope="scope">
												<el-checkbox style="transform: scale(1.5);"
													:disabled="activeStatus==='all'"
													:value="scope.row.status == 1 ? true : false"
													@change="statusChange(scope.row)"></el-checkbox>
											</template>
										</el-table-column>
										<el-table-column prop="is_dispatch" :label="activeStatus=='all'?'已派单':''"
											width="80">
											<template slot-scope="scope">
												<el-checkbox v-if="activeStatus=='all'" style="transform: scale(1.5);"
													:value="scope.row.is_dispatch == 1 ? true : false"
													@change="dispatch_status(scope.row)"></el-checkbox>
											</template>
										</el-table-column>
										<el-table-column v-if="showall" prop="created_at" label="创建时间" width="150">
										</el-table-column>
										<el-table-column v-if="showall" prop="updated_at" label="更新时间" width="150">
										</el-table-column>
										<el-table-column label="操作" width="150">
											<template slot-scope="scope">
												<el-button :disabled="activeStatus!='all'" size="mini" type="primary"
													@click="handleEdit(scope.$index, scope.row)">
													编辑</el-button>
												<el-button :disabled="activeStatus!='all'" size="mini" type="danger"
													@click="handleDelete(scope.$index, scope.row)">
													删除</el-button>
											</template>
										</el-table-column>
										<el-table-column align="right">
											<template slot="header">
												<el-button size="mini" type="primary"
													@click="showall=!showall">{{showall?"部分":"完整"}}</el-button>
											</template>
										</el-table-column>
									</el-table>
								</el-main>
								<el-aside width="120px">
									<el-button type="primary" style="width: 100px;height: 100px;"
										@click="drawer = !drawer">新增任务
									</el-button>
								</el-aside>
							</el-container>
						</el-container>
					</el-col>
				</transition>
				<transition name="resize">
					<el-col :style="{width:spanWidth.other}" class="right-col">
						<el-row ref="chartct">
							<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
								<el-tab-pane label="操作员" name="operator"></el-tab-pane>
								<el-tab-pane label="品牌" name="brand"></el-tab-pane>
								<el-tab-pane label="RAM" name="ram"></el-tab-pane>
								<el-tab-pane label="SSD" name="ssd"></el-tab-pane>
								<el-tab-pane label="UPC" name="upc"></el-tab-pane>
							</el-tabs>
							<div ref="chart" style="width: 100%; height: 400px;"></div>
						</el-row>
						<el-row>
							<div style="padding: 10px;">配置: 选项之间用逗号隔开</div>
							<div style="padding: 10px;">
								<el-input placeholder="请输入内容" v-model="configOri.operator">
									<template slot="prepend">操作员</template>
								</el-input>
							</div>
							<div style="padding: 10px;">
								<el-input placeholder="请输入内容" v-model="configOri.brand">
									<template slot="prepend">品牌</template>
								</el-input>
							</div>
							<div style="padding: 10px;">
								<el-input placeholder="请输入内容" v-model="configOri.ssd">
									<template slot="prepend">SSD</template>
								</el-input>
							</div>
							<div style="padding: 10px;">
								<el-input placeholder="请输入内容" v-model="configOri.system">
									<template slot="prepend">系统</template>
								</el-input>
							</div>
						</el-row>
						<el-row style="text-align: center;margin-top: 30px;">
							<el-button style="width: 30%;" type="primary" @click="SubmitConfig"
								:loading="saveBtnHidding">保存配置</el-button>
						</el-row>
					</el-col>
				</transition>
			</el-row>
			<el-drawer @opened="onOpen" @closed="onClose" :modal="false" title="新增改机任务" :visible.sync="drawer"
				:append-to-body="true">
				<div style="padding: 20px;">
					<el-scrollbar class="hide-horizontal-scrollbar" :style="draw_style">
						<el-row class="row-bg">
							<el-select style="width: 100%;" v-model="missionData.brand" placeholder="请选择品牌">
								<el-option v-for="(item, index) in config.brand" :key="index" :label="item"
									:value="item"></el-option>
							</el-select>
						</el-row>
						<el-row class="row-bg">
							<el-input v-model="missionData.upc" placeholder="请输入UPC"></el-input>
						</el-row>
						<el-row class="row-bg">
							<el-input v-model="missionData.asin" placeholder="请输入ASIN"></el-input>
						</el-row>
						<el-row class="row-bg">
							<div v-for="(orderid,index) in missionData.orderids" :key="index">
								<el-input v-model="missionData.orderids[index]" placeholder="请输入OrderNumber">
									<el-button v-if="index==missionData.orderids.length-1" style="font-size: 30px;" slot="append" type="primary" @click="addId">+</el-button>
								</el-input>
							</div>
						</el-row>
						<el-row class="row-bg">
							<div v-for="(tracking,index) in missionData.trackings" :key="index">
								<el-input v-model="missionData.trackings[index]" placeholder="请输入Tracking">
									<el-button v-if="index==missionData.trackings.length-1" style="font-size: 30px;" slot="append" type="primary" @click="addTracking">+</el-button>
								</el-input>
							</div>
						</el-row>
						<el-row class="row-bg">
							<el-input v-model="missionData.ram" placeholder="请输入内存"></el-input>
						</el-row>
						<el-row class="row-bg">
							<el-select style="width: 100%;" v-model="missionData.capacity1" placeholder="请选择SSD1">
								<el-option v-for="(item, index) in config.ssd" :key="index" :label="item"
									:value="item"></el-option>
							</el-select>
						</el-row>
						<el-row class="row-bg">
							<el-select style="width: 100%;" v-model="missionData.capacity2" placeholder="请选择SSD2">
								<el-option v-for="(item, index) in config.ssd" :key="index" :label="item"
									:value="item"></el-option>
							</el-select>
						</el-row>
						<el-row class="row-bg">
							<el-select style="width: 100%;" v-model="missionData.system" placeholder="请选择系统">
								<el-option v-for="(item, index) in config.system" :key="index" :label="item"
									:value="item"></el-option>
							</el-select>
						</el-row>
						<el-row class="row-bg">
							<el-select style="width: 100%;" v-model="missionData.operator" placeholder="请选择操作员">
								<el-option v-for="(item, index) in config.operator" :key="index" :label="item"
									:value="item"></el-option>
							</el-select>
						</el-row>

						<el-row class="row-bg">
							<el-input style="width: 50%;" :disabled="!multiple" type="number" :min="1"
								v-model="missionData.cnt" placeholder="数量">
								<template slot="prepend">
									<el-checkbox @change="multipleChange" v-model="multiple">批量创建</el-checkbox>
								</template>
							</el-input>
						</el-row>

						<div class="textarea">
							<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="autoFillStr"
								placeholder="请输入内容">
							</el-input>

							<el-button class="textarea-btn" type="primary" size="mini"
								@click="autoFill">自动识别</el-button>
						</div>


						<el-alert v-if="scanError.show" type="error" :title="scanError.msg" effect="dark" show-icon=""
							:closable="false">
						</el-alert>
						<el-row style="text-align: center;margin-top: 30px;">
							<el-button style="width: 50%;" type="primary" :loading="submitBtnHidding"
								@click="confirm_Submit">提交</el-button>
						</el-row>
					</el-scrollbar>
				</div>
			</el-drawer>
		</div>
		<el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
			<span style="font-size: 30px; text-align: center;">是否需要刻盘？</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="SubmitMission(0)">需要</el-button>
				<el-button type="danger" @click="SubmitMission(1)">不需要</el-button>
				<el-button type="text" @click="centerDialogVisible = false">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import * as echarts from "echarts";
	import moment from "moment-timezone";
	import axios from "../js/request.js";
	import axiosEx from "axios";
	// import VueBarcode from "vue-barcode";
	export default {
		// components: {
		// 	VueBarcode
		// },
		computed:{
			draw_style() {
				return {
					margin: "20px",
					backgroundColor:"white",
					height: `${window.innerHeight - 110}px`
				}
			}
		},
		data() {
			return {
				//初始
				spanWidth: {
					table: '100%',
					other: '0%'
				},
				drawer: false,
				//展示表数据
				tableData: [],
				//缓存数据
				tableCache: [],
				//查询类型
				searchKey: "date",
				//时间快捷选项
				scanError: {
					show: false,
					msg: ""
				},
				loading: false,
				//搜索条件
				searchParam: "",
				//页面数据
				table_max_height: window.innerHeight - 220,
				missionData: {
					orderids:[
						""
					],
					trackings:[
						""
					]
				},
				activeName: "operator",

				//原始数据
				configOri: {
					brand: "",
					ssd: "",
					operator: "",
					system: ""
				},
				config: {
					brand: [],
					ssd: [],
					operator: [],
					system: []
				},
				myChart: null,
				saveBtnHidding: false,
				submitBtnHidding: false,
				//当前编辑的行
				editingRowIndex: null,
				//是否批量创建
				multiple: false,
				autoFillStr: "",
				showall: false,
				activeStatus: "all",
				//弹窗状态
				centerDialogVisible: false,
				//是否触发搜索
				isSearched: false
			};
		},
		created() {
			this.getInitData();
			this.getConfigData();
			// localStorage.clear();
		},

		beforeDestroy() {
			// 销毁 ECharts 实例
			if (this.myChart) {
				this.myChart.dispose();
			}
			if (this.resizeObserver) {
				this.resizeObserver.disconnect(); // 移除监听器
			}

			document.removeEventListener('keydown', this.handleGlobalEnter);
		},

		mounted() {
			// 基于准备好的dom，初始化echarts实例
			this.myChart = echarts.init(this.$refs.chart);
			// 监听chart父容器尺寸变化
			const chartContainer = this.$refs.chartct.$el;
			this.resizeObserver = new ResizeObserver(() => {
				this.resizeChart();
			});
			this.resizeObserver.observe(chartContainer);

			document.addEventListener('keydown', this.handleGlobalEnter)
		},


		watch: {
			tableData(newValue, oldValue) {
				this.handleClick();
			}
		},
		methods: {
			ssdFmt(row, column, cellValue, index) {
				let ssd1 = this.tableData[index].capacity1;
				let ssd2 = this.tableData[index].capacity2;
				return `${ssd1?ssd1:""} ${ssd2 ? "+ " + ssd2 : ""}`;
			},
			getInitData() {
				this.loading = true;
				axios.get("getMissionsToday").then(e => {
					this.tableData = e.data;
					this.loading = false;
					//保存数据
					this.tableCache = [...this.tableData]
				}).catch((e) => {
					console.log(e);
					this.loading = false;
				});
			},
			getConfigData() {
				axios.get("getConfig").then(e => {
					let temp = this.config;
					let result = e.data;
					for (let key in temp) {
						temp[key] = result[key].split(",");
					}
					//加载配置选项
					this.confg = temp;
					//保存配置请求参数
					this.configOri = result;
				});
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
					case "date":
						text = "日期";
						break;
				}
				return text;
			},
			searchRecord() {
				if (this.searchParam.length == 0) {
					return;
				}
				this.loading = true;
				axios
					.post("searchMissions", {
						type: this.searchKey,
						param: this.searchParam
					})
					.then(res => {
						this.tableData = res.data;
						this.loading = false;
						//保存数据
						this.tableCache = [...this.tableData]
						//搜索过
						this.isSearched = true
					})
					.catch(e => {
						console.log(e);
						if (e.statusCode != 200) {
							alert("出错了！");
							this.loading = false;
						}
					});
			},
			onSubmit(e) {
				console.log(e);
			},
			
			addId(){
				this.missionData.orderids.push("")
			},
			addTracking(){
				this.missionData.trackings.push("")
			},
			//重置missionData
			resetData(){
				return{
					orderids:[
						""
					],
					trackings:[
						""
					]
				}
			},
			
			confirm_Submit() {
				let data = this.missionData;
				const regex = /^-?\d+$/;
				if (data.cnt != null && !regex.test(data.cnt)) {
					this.$alert("请输入数字");
					return
				}
				if (data.cnt != null && data.cnt < 1) {
					this.$alert("数量不能小于1");
					return
				}
				this.centerDialogVisible = true;
			},
			SubmitMission(status) {
				this.centerDialogVisible = false
				let data = this.missionData;
				data.status = status;
				this.submitBtnHidding = true;
				axios
					.post("addMission", data)
					.then(res => {
						if (!data.id) {
							this.getInitData();
						} else {
							let index = this.editingRowIndex;
							let table = this.tableData;
							table[index] = data;
							console.log(table)
							this.tableData = [...table];
						}
						this.submitBtnHidding = false;
						this.missionData = this.resetData();
						this.multiple = false;
						this.editingRowIndex = null;
					})
					.catch(e => {
						console.log(e);
						if (e.statusCode != 200) {
							alert("出错了！");
							this.submitBtnHidding = false;
						}
					});
			},
			//抽屉打开时回调
			onOpen() {
				// this.$refs.tracker_input.focus();
			},
			onClose() {
				this.missionData = this.resetData();
				this.multiple = false;
				this.autoFillStr = "";
			},
			multipleChange(value) {
				if (!value) {
					this.missionData.cnt = null;
				}
			},
			SubmitConfig() {
				this.saveBtnHidding = true;
				let configData = this.configOri;
				axios
					.post("updateConfig", configData)
					.then(e => {
						this.getConfigData();
						this.saveBtnHidding = false;
						this.$message({
							message: "更新成功",
							type: "success"
						});
					})
					.catch(e => {
						this.saveBtnHidding = false;
						if (e.statusCode != 200) {
							alert("出错了！");
							this.loading = false;
						}
					});
			},
			//标签页切换
			handleClick(tab, event) {
				switch (this.activeName) {
					case "operator":
						this.chartWithOperator();
						break;
					case "brand":
						this.chartWithBrand();
						break;
					case "ram":
						this.chartWithRAM();
						break;
					case "ssd":
						this.chartWithSSD();
						break;
					case "upc":
						this.chartWithUPC();
						break;
					default:
						this.chartWithOperator();
						break;
				}
			},
			handleEdit(index, row) {
				this.missionData = {
					...row
				};
				this.drawer = true;
				this.editingRowIndex = index;
			},
			handleDelete(index, row) {
				this.$confirm("此操作将删除该任务, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.loading = true;
						axios
							.post("rmMission", {
								id: row.id,
								express_num: row.express_num
							})
							.then(res => {
								if (res.ret == 0) {
									this.tableData.splice(index, 1);
								} else {
									alert(res.msg);
								}
								this.loading = false;
							}).catch((e) => {
								// this.$alert(e)
								this.loading = false;
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},

			//配置图标数据函数
			chartWithOperator() {
				// 指定图表的配置项和数据
				let data = this.tableData;
				let xdata = {};
				for (let value of data) {
					if (!xdata[value.operator]) {
						xdata[value.operator] = 0;
					}
					xdata[value.operator] += 1;
				}
				let result = [];
				for (let key in xdata) {
					result.push({
						value: xdata[key],
						name: key
					});
				}

				var option = {
					title: {
						text: `总数：${data.length}`
					},
					tooltip: {
						trigger: "item" // 触发类型为数据项
					},
					series: [{
						show: true,
						type: "pie",
						data: result,
						label: {
							position: 'inside',
							formatter: '{b}: {c}',
							align: 'center',
							verticalAlign: 'middle',
							rotate: 'radial'
						},

					}],
				};
				// 使用刚指定的配置项和数据显示图表。
				this.myChart.clear();
				this.myChart.setOption(option);
			},
			chartWithBrand() {
				// 指定图表的配置项和数据
				let data = this.tableData;
				let xdata = {};
				for (let value of data) {
					if (!xdata[value.brand]) {
						xdata[value.brand] = 0;
					}
					xdata[value.brand] += 1;
				}
				let x = [];
				let result = [];
				for (let key in xdata) {
					x.push(key);
					result.push(xdata[key]);
				}
				this.setOptionWithCharbar(x, result);
			},
			chartWithRAM() {
				let data = this.tableData;
				let xdata = {};
				for (let value of data) {
					if (value.ram == null) {
						continue
					}
					if (!xdata[value.ram]) {
						xdata[value.ram] = 0;
					}
					xdata[value.ram] += 1;
				}
				let x = [];
				let result = [];
				for (let key in xdata) {
					x.push(key);
					result.push(xdata[key]);
				}
				this.setOptionWithCharbar(x, result);
			},
			chartWithSSD() {
				let data = this.tableData;
				let xdata = {};
				for (let value of data) {
					if (value.capacity1 != null) {
						let cap1 = value.capacity1.replace(/.*?(\d+(GB|TB)).*/, '$1')
						if (!xdata[cap1]) {
							xdata[cap1] = 0;
						}
						xdata[cap1] += 1;
					}

					if (value.capacity2) {
						let cap2 = value.capacity2.replace(/.*?(\d+(GB|TB)).*/, '$1')
						if (!xdata[cap2]) {
							xdata[cap2] = 0;
						}
						xdata[cap2] += 1;
					}

				}
				let x = [];
				let result = [];
				for (let key in xdata) {
					x.push(key);
					result.push(xdata[key]);
				}
				this.setOptionWithCharbar(x, result);
			},
			chartWithUPC() {
				let data = this.tableData;
				let xdata = {};
				for (let value of data) {
					if (!xdata[value.upc]) {
						xdata[value.upc] = 0;
					}
					xdata[value.upc] += 1;
				}
				let result = [];
				for (let key in xdata) {
					result.push({
						value: xdata[key],
						name: key
					});
				}
				var option = {
					title: {
						text: `总数：${data.length}`
					},
					tooltip: {
						trigger: "item" // 触发类型为数据项
					},
					series: [{
						type: "pie",
						data: result
					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				this.myChart.clear();
				this.myChart.setOption(option);
			},
			setOptionWithCharbar(x, value) {
				var option = {
					tooltip: {},
					legend: {
						data: []
					},
					xAxis: {
						data: x,
						axisLabel: {
							rotate: 45
						},
						axisTick: {
							alignWithLabel: true
						}
					},
					yAxis: {
						minInterval: 1
					},
					series: [{
						type: "bar",
						data: value,
						label: {
							show: true
						}
					}]
				};
				this.myChart.clear();
				this.myChart.setOption(option);
			},
			resizeChart() {
				if (this.myChart) {
					this.myChart.resize();
				}
			},
			statusChange(row) {
				row.status = row.status == 0 ? 1 : 0;
				axios
					.post("updateStatus", {
						id: row.id,
						status: row.status
					})
					.then(e => {})
					.catch(e => {
						alert("出错了");
					});
			},
			dispatch_status(row) {
				row.is_dispatch = row.is_dispatch == 0 ? 1 : 0;
				axios
					.post("dispatched", {
						id: row.id,
						is_dispatch: row.is_dispatch
					})
					.then(e => {})
			},
			collesp() {
				let before = this.spanWidth;
				if (before.table === '100%') {
					this.spanWidth = {
						table: '65%',
						other: '35%'
					}
				} else {
					this.spanWidth = {
						table: '100%',
						other: '0%'
					}
				}
			},
			autoFill() {
				const regex = {
					brand: /ASIN:[^\n]*\n+([ \t]*\n)*.*?\n\s*([A-Z][a-zA-Z]+)/, // 匹配品牌
					upc: /UPC:[\s\u3000]*(\d+)/, // 用 \u3000 代替全角空格
					asin: /ASIN:[\s\u3000]*([A-Z0-9]{10})/, // 用 \u3000 代替全角空格
					itemCount: /Item Count:[\s\u3000]*(\d+)/, // 用 \u3000 代替全角空格
					orderNumber: /Amazon Order#\s*([0-9-]+)/gm,
					custom: /\[Customize\].*/,
					// size: /:\s*([^-\s]+)-((?:[^-\s+]+)(?:\+[^-\s+]+)*)-([^-\s]+)/
					size: /G\d+:\s*([^-]+(?:-[^-]+)*)/,
					trackingContent: /^\d+\s+.*?Amazon Order#\s+[\d-]+.*$/gm,
					upsTracking: /\b1Z[A-Z0-9]{16,}\b/g,
					uspsTracking: /\b(\d{30}|\d{34}|\d{12}|94\d{18}|9[35]\d{17}|7\d{19}|[A-Z]{2}\d{9}[A-Z]{2})\b/g
				}
				// 提取并返回结果
				const extractData = (text) => {
					const upcMatch = text.match(regex.upc);
					const asinMatch = text.match(regex.asin);
					const itemCountMatch = text.match(regex.itemCount);
					const orderNumberMatch = [...text.matchAll(regex.orderNumber)].map(match=>match[1]);
					console.log(orderNumberMatch)
					const brandMatch = text.match(regex.brand);
					const customized = text.match(regex.custom);
					const customizeLine = customized ? customized[0] : null;

					//先找到包含Tracking的行
					const trackContentMatch = text.match(regex.trackingContent);
					console.log(trackContentMatch)
					const trackContent = trackContentMatch ? trackContentMatch[0] : "未匹配";
					//继续匹配
					const upsMatch = trackContent.match(regex.upsTracking);
					const uspsMatch = trackContent.match(regex.uspsTracking);

					let ram = ""
					let ssdStr = ""
					let ssd1 = ""
					let ssd2 = ""
					let system = ""
					if (customizeLine) {
						let match = customizeLine.match(regex.size)
						// console.log(match)
						if (match) {
							let result = match[1].split('-')
							for (let i = 0; i < result.length; i++) {
								let str = result[i];
								//判断含存储单位字符，则进一步提取
								if (str.includes('GB') || str.includes('TB')) {
									//硬盘位
									if (str.includes('+')) {
										const tem = str.split('+')
										ssd1 = tem[0]
										ssd2 = tem[1]
									} else {
										const opacityMatch = str.match(/(\d+)(?=GB)/)
										if (opacityMatch && opacityMatch[1] < 128) {
											ram = str
										} else {
											ssd1 = str
										}
									}
								} else {
									system = str;
								}
							}
						}
					}

					return {
						brand: brandMatch ? brandMatch[2].toUpperCase() : "未匹配",
						upc: upcMatch ? upcMatch[1] : "未匹配",
						asin: asinMatch ? asinMatch[1] : "未匹配",
						cnt: itemCountMatch ? itemCountMatch[1] : "未匹配",
						orderids: orderNumberMatch, //? orderNumberMatch[1] : "未匹配",
						trackings: upsMatch?upsMatch:uspsMatch, //? upsMatch[0] : (uspsMatch ? uspsMatch[0] : "未匹配"),
						ram: ram,
						system: system,
						capacity1: ssd1,
						capacity2: ssd2
					}
				}

				let data = extractData(this.autoFillStr)
				if (data.cnt > 1) {
					this.multiple = true;
				}
				this.missionData = {
					...data
				}
			},
			handleStatusClick(tab, event) {
				let data = this.tableCache
				switch (this.activeStatus) {
					case "all": {
						if (this.isSearched)
							this.searchRecord()
						else
							this.getInitData()
					}
					break;
					default: {
						let newData = data.filter((item, index) => {
							return item.status == this.activeStatus
						})
						this.tableData = newData
						console.log(newData)
					}
					break;
				}
			},
			//监控键盘回调
			handleGlobalEnter(e) {
				// 1. 判断是否为回车键
				if (e.key == 'Escape') {
					this.drawer = false;
					return
				}
				if (e.key == 'Enter') {
					// 2. 获取当前焦点元素
					const focusedElement = document.activeElement;

					// 3. 检查焦点元素是否为输入类元素（input/textarea）
					const isInputFocused = ['INPUT', 'TEXTAREA'].includes(
						focusedElement?.tagName // 兼容性：空值使用可选链操作符
					);

					// 4. 如果焦点不在输入类元素上，触发按钮
					if (!isInputFocused) {
						e.preventDefault(); // 防止默认行为（如表单提交）
						this.drawer = true;
					}
				}
			},
		}
	};
</script>

<style scoped>
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

	.row-bg {
		padding: 10px 0;
	}


	/* 使用 flex 布局 */
	.flex-container {
		display: flex;
		width: 100%;
	}

	/* 定义过渡效果 */
	.resize-enter-active,
	.resize-leave-active {
		transition: all 2s ease;
	}

	.resize-enter-from,
	.resize-leave-to {
		opacity: 0;
		transform: scaleX(0);
	}

	.resize-enter-to,
	.resize-leave-from {
		opacity: 1;
		transform: scaleX(1);
	}

	.left-col,
	.right-col {
		overflow: hidden;
		transition: width 500ms ease;
		/* 添加 width 过渡 */
	}

	.textarea {
		position: relative;
	}

	.textarea-btn {
		position: absolute;
		right: 10px;
		bottom: 10px;
	}
</style>