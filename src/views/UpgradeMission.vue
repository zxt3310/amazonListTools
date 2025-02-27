<template>
	<div class="about">
		<div style="padding: 10px;">
			<router-link to="/">改机任务列表 |</router-link>
			<router-link to="/"> 统计</router-link>
		</div>

		<div class="" style="">
			<el-row>
				<el-col :span="13">
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
								start-placeholder="开始日期" end-placeholder="结束日期"
								value-format="yyyy-MM-dd HH:mm:ss">
							</el-date-picker>

							<el-button type="primary" @click="searchRecord">
								搜索 <i class="el-icon-search"></i>
							</el-button>
						</el-header>
						<el-container>
							<el-main>
								<el-table :max-height="table_max_height" v-loading="loading" :data="tableData" stripe>
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
				<el-col :span="11">
					<el-row>
						<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
							<el-tab-pane label="操作员" name="first">用户管理</el-tab-pane>
							<el-tab-pane label="品牌" name="second">配置管理</el-tab-pane>
							<el-tab-pane label="SSD" name="third">角色管理</el-tab-pane>
							<el-tab-pane label="UPC" name="fourth">定时任务补偿</el-tab-pane>
						</el-tabs>
					</el-row>
					<el-row>
						123123
					</el-row>
				</el-col>
			</el-row>
			<el-drawer @opened="onOpen" :modal="false" title="新增改机任务" :visible.sync="drawer" :append-to-body="true">
				<div style="padding: 20px;">
					<el-row>
						<el-input v-model="scandata.brand" placeholder="Brand" ref="brand_input"
							@keyup.enter.native="onSubmit"></el-input>
					</el-row>
					<el-row>
						<el-input v-model="scandata.upc" placeholder="UPC" ref="upc_input"
							@keyup.enter.native="onSubmit"></el-input>
					</el-row>
					<el-row>
						<el-input v-model="scandata.capacity1" placeholder="SSD1" ref="capacity1_input"
							@keyup.enter.native="onSubmit"></el-input>
					</el-row>
					<el-row>
						<el-input v-model="scandata.capacity2" placeholder="SSD2" ref="capacity2_input"
							@keyup.enter.native="onSubmit"></el-input>
					</el-row>
					<el-row>
						<el-input v-model="scandata.system" placeholder="System" ref="system_input"
							@keyup.enter.native="onSubmit"></el-input>
					</el-row>

					<el-alert v-if="scanError.show" type="error" :title="scanError.msg" effect="dark" show-icon=""
						:closable="false">
					</el-alert>
					<el-row style="text-align: center; margin-top: 30px;">
						<el-button type="primary" @click="drawer=false">关闭窗口</el-button>
					</el-row>
				</div>

			</el-drawer>
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
				
				//搜索条件
				searchParam: '',
				//页面数据
				table_max_height: window.innerHeight - 220,
				scandata: {
					scan_order: "",
					scan_tracker: "",
					scan_SN: "",
				},
				activeName: 'first'
			}
		},
		created() {
			this.getInitData()
			// moment.tz.setDefault("America/Los_Angeles");
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
			},
			getHistory(cnt) {
				axios.post('gethistory', {
					"days": cnt
				}).then((e) => {
					this.tableData = e.data;
				})
			},
			getDateName(cnt) {
				return moment(new Date().getTime() - cnt * 1000 * 24 * 3600).format('MM-DD')
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
				axios.post('search', {
					"type": this.searchKey,
					"param": this.searchParam
				}).then((res) => {
					this.tableData = res.data;
				})
			},
			onSubmit(e) {
				console.log(e);
			},
			SNEditing() {
				// console.log(this.scandata.scan_SN)
				let SNs = this.scandata.scan_SN.split("\n")
				let flag = "SN_Scan_END_FLAG"
				if (SNs.includes(flag)) {
					SNs.splice(-2, 2)
					console.log(SNs)
					this.scanOrder(SNs.join(", "))
				}
			},
			scanOrder(SN_post) {
				if (this.scandata.scan_tracker.length == 0) {
					return;
				}
				this.$refs.tracker_input.blur();
				let loadingInstance = Loading.service({
					fullscreen: true
				});
				let temp = this.tableData;
				axios.post("scanorder", {
					"order_id": this.scandata.scan_order,
					"express_num": this.scandata.scan_tracker,
					"SN": SN_post
				}).then((res) => {
					if (res.ret == 0) {
						// console.log(res)
						// this.getInitData();
						temp.unshift(res.data);
						this.tableData = temp;
						this.$refs.order_input.clear();
						this.$refs.tracker_input.clear();
						this.$refs.SN_input.clear();
						this.$refs.tracker_input.focus();
						this.scanError = {
							show: false,
							msg: ""
						}
					} else {
						this.scanError = {
							show: true,
							msg: res.msg
						}
						this.$alert(res.msg, `运单：${this.scandata.scan_tracker}`, {
							confirmButtonText: '确定'
						})
						this.$refs.tracker_input.focus();
						this.$refs.tracker_input.select();
					}
					this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
						loadingInstance.close();
					});
				}).catch((e) => {
					console.log(e);
					if (e.statusCode != 200) {
						alert("出错了！");
					}
				});
			},
			onOpen() {
				// this.$refs.tracker_input.focus();
			},
			//标签页切换
			handleClick(tab, event) {
				console.log(tab, event);
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