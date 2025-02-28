<template>
	<div class="about">
		<div style="padding: 10px;">
			<router-link to="/">改机任务列表 |</router-link>
			<router-link to="/"> 统计</router-link>
		</div>

		<div class="" style="">
			<el-row>
				<el-col :span="15">
					<el-container>
						<el-header>
							<el-dropdown @command="(e)=>{searchKey = e; searchParam = '';}">
								<el-button type="primary">
									{{
								searchBtnText(searchKey)
							}}<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="date">日期</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<el-input v-model="searchParam" v-if="searchKey!='date'" style="margin:0 10px;"
								@keyup.enter.native="searchRecord"></el-input>

							<el-date-picker v-else style="margin: 0 10px; width: 50%;" v-model="searchParam"
								type="daterange" align="right" unlink-panels range-separator="至"
								start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
							</el-date-picker>

							<el-button type="primary" @click="searchRecord">
								搜索 <i class="el-icon-search"></i>
							</el-button>
						</el-header>
						<el-container v-loading="loading">
							<el-main>
								<el-table :height="table_max_height" v-loading="loading" :data="tableData" stripe>
									<el-table-column prop="id" label="ID" width="100">
									</el-table-column>
									<el-table-column prop="operator" label="操作员" width="80">
									</el-table-column>
									<el-table-column prop="brand" label="品牌" width="100">
									</el-table-column>
									<el-table-column prop="upc" label="UPC" width="120">
									</el-table-column>
									<el-table-column :formatter="ssdFmt" label="SSD" width="100">
									</el-table-column>
									<el-table-column prop="system" label="系统" width="120">
									</el-table-column>
									<el-table-column prop="updated_at" label="创建时间" width="150">
									</el-table-column>
									<el-table-column label="操作">
										<template slot-scope="scope">
											<el-button size="mini" type="danger"
												@click="handleDelete(scope.$index, scope.row)">
												删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-main>
							<el-aside width="120px">
								<el-button type="primary" style="width: 100px;height: 100px;"
									@click="drawer=!drawer; ">新增任务
								</el-button>
							</el-aside>
						</el-container>
					</el-container>
				</el-col>
				<el-col :span="9">
					<el-row>
						<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
							<el-tab-pane label="操作员" name="first">
								<div ref='chart' style="width: 100%; height: 200px;"></div>
							</el-tab-pane>
							<el-tab-pane label="品牌" name="second"></el-tab-pane>
							<el-tab-pane label="SSD" name="third"></el-tab-pane>
							<el-tab-pane label="UPC" name="fourth"></el-tab-pane>
						</el-tabs>
					</el-row>
				</el-col>
			</el-row>
			<el-drawer @opened="onOpen" :modal="false" title="新增改机任务" :visible.sync="drawer" :append-to-body="true">
				<div style="padding: 20px;">
					<el-row class="row-bg">
						<el-select style="width: 100%;" v-model="missionData.brand" placeholder="请选择品牌">
							<el-option v-for="(item,index) in config.brand" :key="index" :label="item"
								:value="item"></el-option>
						</el-select>
					</el-row>
					<el-row class="row-bg">
						<el-input v-model="missionData.upc" placeholder="请输入UPC"></el-input>
					</el-row>
					<el-row class="row-bg">
						<el-select style="width: 100%;" v-model="missionData.capacity1" placeholder="请选择SSD1">
							<el-option v-for="(item,index) in config.ssd" :key="index" :label="item"
								:value="item"></el-option>
						</el-select>
					</el-row>
					<el-row class="row-bg">
						<el-select style="width: 100%;" v-model="missionData.capacity2" placeholder="请选择SSD2">
							<el-option v-for="(item,index) in config.ssd" :key="index" :label="item"
								:value="item"></el-option>
						</el-select>
					</el-row>
					<el-row class="row-bg">
						<el-select style="width: 100%;" v-model="missionData.system" placeholder="请选择系统">
							<el-option v-for="(item,index) in config.system" :key="index" :label="item"
								:value="item"></el-option>
						</el-select>
					</el-row>
					<el-row class="row-bg">
						<el-select style="width: 100%;" v-model="missionData.operator" placeholder="请选择操作员">
							<el-option v-for="(item,index) in config.operator" :key="index" :label="item"
								:value="item"></el-option>
						</el-select>
					</el-row>

					<el-alert v-if="scanError.show" type="error" :title="scanError.msg" effect="dark" show-icon=""
						:closable="false">
					</el-alert>
					<el-row style="text-align: center;margin-top: 30px;">
						<el-button style="width: 50%;" type="primary" @click="SubmitMission">提交</el-button>
					</el-row>
				</div>

			</el-drawer>
		</div>
	</div>
</template>

<script>
	import * as echarts from 'echarts'
	import moment from 'moment-timezone';
	// import axios from 'axios'
	import axios from '../js/request.js';
	import axiosEx from 'axios';
	export default {
		data() {
			return {
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
				searchParam: '',
				//页面数据
				table_max_height: window.innerHeight - 220,
				missionData: {},
				activeName: 'first',
				myChart: {},
				config: {
					brand: [],
					ssd: [],
					operator: [],
					system: []
				}
			}

		},
		created() {
			this.getInitData()
		},

		mounted() {
			// 基于准备好的dom，初始化echarts实例
			this.myChart = echarts.init(this.$refs.chart);
		},

		methods: {
			ssdFmt(row, column, cellValue, index) {
				let ssd1 = this.tableData[index].capacity1;
				let ssd2 = this.tableData[index].capacity2;
				return `${ssd1} ${ssd2?'+ '+ssd2:''}`
			},
			getInitData() {
				axios.get('getMissionsToday').then((e) => {
					this.tableData = e.data;
				})
				axios.get('getConfig').then((e) => {
					let temp = this.config;
					let result = e.data;
					for (let key in temp) {
						temp[key] = result[key].split(',')
					}
					this.confg = temp;
				})
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
				return text
			},
			searchRecord(e) {
				if (this.searchParam.length == 0) {
					return;
				}
				this.loading = true;
				axios.post('searchMissions', {
					"type": this.searchKey,
					"param": this.searchParam
				}).then((res) => {
					this.tableData = res.data;
					this.loading = false
				}).catch((e) => {
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
				let data = this.missionData
				this.loading = true;
				axios.post("addMission", data).then((res) => {
					this.getInitData();
					this.loading = false;
					this.missionData = {};
				}).catch((e) => {
					console.log(e);
					if (e.statusCode != 200) {
						alert("出错了！");
						this.loading = false;
					}
				});
			},
			onOpen() {
				// this.$refs.tracker_input.focus();
			},
			//标签页切换
			handleClick(tab, event) {
				// console.log(tab)
				// 指定图表的配置项和数据
				let data = this.tableData;
				let config = this.config;
				let x = config.operator;
				let xdata = {};
				for (let itemx of x) {
					for (let valuex of data) {
						if (valuex.operator == itemx) {
							if (!xdata[valuex.operator]) {
								xdata[valuex.operator] = [];
							}
							xdata[valuex.operator].push(valuex)
						}
					}
				}
				let result = [];
				for (let xkey in xdata) {
					console.log(xkey)
					let tmp = {
						value: xdata[xkey].length,
						name: xkey
					}
					result.push(tmp);
				}

				// var option = {
				// 	title: {
				// 		text: `总任务：${data.length}`
				// 	},
				// 	tooltip: {},
				// 	legend: {
				// 		data: ['数量']
				// 	},
				// 	xAxis: {
				// 		data: x
				// 	},
				// 	yAxis: {
				// 		minInterval:1
				// 	},
				// 	series: [{
				// 		name: '改机数量',
				// 		type: 'bar',
				// 		data: result
				// 	}]
				// };

				var option = {
					title: {
						text: `总任务：${data.length}`
					},
					tooltip: {
						trigger: 'item' // 触发类型为数据项
					},
					series: [{
						type: 'pie',
						data: result
					}]
				}

				// 使用刚指定的配置项和数据显示图表。
				this.myChart.setOption(option);
			},

			handleDelete(index, row) {
				this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					axios.post("rmMission", {
						"id": row.id,
						"express_num": row.express_num
					}).then((res) => {
						if (res.ret == 0) {
							this.tableData.splice(index, 1);
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

	.row-bg {
		padding: 10px 0;
	}
</style>