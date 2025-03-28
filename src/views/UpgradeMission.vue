<template>

	<div class="about">
		<my-navi activeIndex="3"></my-navi>
		<!-- <div style="padding: 10px;">
      <router-link to="/">改机任务列表 |</router-link>
      <router-link to="/"> 统计</router-link>
    </div> -->
		<h2>Update Workbench</h2>
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
											<el-dropdown-item command="date">日期</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									<el-input v-model="searchParam" v-if="searchKey != 'date'" style="margin:0 10px;"
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
									<el-table :height="table_max_height" v-loading="loading" :data="tableData" stripe>
										<el-table-column prop="id" label="ID" width="100">
										</el-table-column>
										<el-table-column prop="operator" label="操作员" width="120">
										</el-table-column>
										<el-table-column prop="brand" label="品牌" width="100">
										</el-table-column>
										<el-table-column prop="upc" label="UPC" width="120">
										</el-table-column>
										<el-table-column prop="orderid" label="订单号" width="170">
										</el-table-column>
										<el-table-column prop="asin" label="ASIN" width="120">
										</el-table-column>
										<el-table-column prop="ram" label="内存" width="120">
										</el-table-column>
										<el-table-column :formatter="ssdFmt" label="SSD" width="150">
										</el-table-column>
										<el-table-column prop="system" label="系统" width="120">
										</el-table-column>
										<el-table-column prop="status" label="完成" width="80">
											<template #default="{ row }">
												<el-checkbox :value="row.status == 1 ? true : false"
													@change="statusChange(row)"></el-checkbox>
											</template>
										</el-table-column>
										<el-table-column prop="created_at" label="创建时间" width="150">
										</el-table-column>
										<el-table-column prop="updated_at" label="更新时间" width="150">
										</el-table-column>
										<el-table-column label="操作">
											<template slot-scope="scope">
												<el-button size="mini" type="primary"
													@click="handleEdit(scope.$index, scope.row)">
													编辑</el-button>
												<el-button size="mini" type="danger"
													@click="handleDelete(scope.$index, scope.row)">
													删除</el-button>
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
						<el-input v-model="missionData.orderid" placeholder="请输入OrderNumber"></el-input>
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

						<el-button class="textarea-btn" type="primary" size="mini" @click="autoFill">自动识别</el-button>
					</div>


					<el-alert v-if="scanError.show" type="error" :title="scanError.msg" effect="dark" show-icon=""
						:closable="false">
					</el-alert>
					<el-row style="text-align: center;margin-top: 30px;">
						<el-button style="width: 50%;" type="primary" :loading="submitBtnHidding"
							@click="SubmitMission">提交</el-button>
					</el-row>
				</div>
			</el-drawer>
		</div>
	</div>
</template>

<script>
	import * as echarts from "echarts";
	import moment from "moment-timezone";
	import axios from "../js/request.js";
	import axiosEx from "axios";
	import {
		Switch
	} from "element-ui";
	export default {
		// components:{
		// 	myNavi
		// },
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
				missionData: {},
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
				autoFillStr: ""
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
				console.log("移除监听")
			}
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
			searchRecord(e) {
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
			SubmitMission() {
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
						this.missionData = {};
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
				this.missionData = {};
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
			chartWithSSD() {
				let data = this.tableData;
				let xdata = {};
				for (let value of data) {
					if (value.capacity1 == null) {
						continue;
					}
					if (!xdata[value.capacity1]) {
						xdata[value.capacity1] = 0;
					}
					xdata[value.capacity1] += 1;
					if (value.capacity2) {
						if (!xdata[value.capacity2]) {
							xdata[value.capacity2] = 0;
						}
						xdata[value.capacity2] += 1;
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
					orderNumber: /Amazon Order#\s*([0-9-]+)/
				}
				// 提取并返回结果
				const extractData = (text) => {
					const upcMatch = text.match(regex.upc);
					const asinMatch = text.match(regex.asin);
					const itemCountMatch = text.match(regex.itemCount);
					const orderNumberMatch = text.match(regex.orderNumber);
					const brandMatch = text.match(regex.brand);

					return {
						brand: brandMatch ? brandMatch[2].toUpperCase() : "未匹配",
						upc: upcMatch ? upcMatch[1] : "未匹配",
						asin: asinMatch ? asinMatch[1] : "未匹配",
						cnt: itemCountMatch ? itemCountMatch[1] : "未匹配",
						orderid: orderNumberMatch ? orderNumberMatch[1] : "未匹配"
					}
				}
				
				let data = extractData(this.autoFillStr)
				if(data.cnt>1){
					this.multiple = true;
				}
				this.missionData = {
					...data
				}
			}
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