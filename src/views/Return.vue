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
							<el-dropdown-item command="order">Oder#</el-dropdown-item>
							<el-dropdown-item command="tracker">Tracking</el-dropdown-item>
							<el-dropdown-item command="SN">SN</el-dropdown-item>
							<el-dropdown-item command="date">Date</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-input v-model="searchParam" v-if="searchKey != 'date'" style="margin:0 10px; width: 70%;"
						@keyup.enter.native="searchRecord"></el-input>

					<el-date-picker v-else style="margin: 0 10px; width: 50%;" v-model="searchParam" type="daterange"
						align="right" unlink-panels range-separator="to" start-placeholder="Start Date" end-placeholder="End Date"
						value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>

					<el-button type="primary" @click="searchRecord">
						Search <i class="el-icon-search"></i>
					</el-button>
					<el-button type="primary" style="position: absolute; right: 50px;" @click="directToAdd">Create
						Return</el-button>
				</el-header>
				<el-container>
					<el-main style="padding-top: 0 !important;">
						<div style="padding: 10px 0;text-align: left; display: flex; align-items: center;">
							<el-checkbox-group v-model="filters.check">
								<el-checkbox border label="is_check_out">In Stock</el-checkbox>
								<el-checkbox border label="is_need_war">Repair</el-checkbox>
								<el-checkbox border label="is_fraud">Fraud</el-checkbox>
								<el-checkbox border label="is_junk">Junk</el-checkbox>
							</el-checkbox-group>
							<div style="margin-left: 20px;">
								<span>Decision:</span>
								<el-select style=" width: 160px;" v-model="filters.decision">
									<el-option v-for="(item,index) in decisionOption" :key="index" :label="item"
										:value="index+1"></el-option>
								</el-select>
							</div>
							<div style="margin-left: 20px;">
								<span>Store:</span>
								<el-autocomplete style="width: 120px;" v-model="filters.seller"
									:fetch-suggestions="sellerQuerySearch"></el-autocomplete>
							</div>
							<div style="margin-left: 20px;">
								<span>Brand:</span>
								<el-autocomplete style="width: 120px;" v-model="filters.brand"
									:fetch-suggestions="brandQuerySearch"></el-autocomplete>
							</div>

							<div style="margin-left: 20px;">
								<el-button type="primary" @click="filter">Filter</el-button>
							</div>
							<div style="margin-left: 20px;">
								<el-button type="primary" @click="clearfilter">Clear</el-button>
							</div>
						</div>

						<el-table ref="dataTable" :height="table_max_height" v-loading="loading" :data="tableData"
							@cell-click="cellClickCopy">
							<el-table-column prop="rt_id" label="ID" width="100">
							</el-table-column>
							<el-table-column prop="decision" label="Decision" width="120" :formatter="decisionFmt"
								:filter-method="filterMethod">
							</el-table-column>
							<el-table-column prop="rec_dt" label="Received On" width="110" :formatter="dateformat">
							</el-table-column>
							<el-table-column prop="created_at" label="Processed On" width="111" :formatter="dateformat">
							</el-table-column>
							<el-table-column prop="brand" label="Brand" width="90" :filter-method="filterMethod">
							</el-table-column>
							<el-table-column prop="model" label="Model" width="180">
							</el-table-column>
							<el-table-column prop="upc" label="UPC" width="115">
							</el-table-column>
							<el-table-column align="center" prop="is_need_war" label="Repair" width="100"
								:filters="[{text:'Yes',value:true}]" :filter-method="filterMethod">
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
							<el-table-column prop="rt_dt" label="Returned Date" width="120" :formatter="dateformat">
							</el-table-column>
							<el-table-column prop="seller" label="Store" width="90" :filter-method="filterMethod">
							</el-table-column>
							<el-table-column prop="creator" label="Operator" width="90">
							</el-table-column>
							<el-table-column prop="sn" label="SN" width="160">
							</el-table-column>
							<el-table-column prop="cur_config" label="Current Config" width="160">
							</el-table-column>
							<el-table-column prop="rt_cmt" label="Condition Notes:" width="200">
								<template slot-scope="scope">
									<el-tooltip :content="scope.row.rt_cmt">
										<div class="no-wrap">{{ scope.row.rt_cmt }}</div>
									</el-tooltip>
								</template>
							</el-table-column>
							<el-table-column prop="rt_cmt_cs" label="Comments for service" width="200">
								<template slot-scope="scope">
									<el-tooltip :content="scope.row.rt_cmt">
										<div class="no-wrap">{{ scope.row.rt_cmt }}</div>
									</el-tooltip>
								</template>
							</el-table-column>
							<el-table-column prop="rt_reason" label="Return Reason" width="200">
								<template slot-scope="scope">
									<el-tooltip :content="scope.row.rt_reason">
										<div class="no-wrap">{{ scope.row.rt_reason }}</div>
									</el-tooltip>
								</template>
							</el-table-column>
							<el-table-column align="center" prop="is_fraud" label="Fraud" width="80"
								:filters="[{text:'Yes',value:true}]" :filter-method="filterMethod">
								<template slot-scope="scope">
									<el-checkbox style="transform: scale(1.3);" :value="scope.row.is_fraud"
										disabled></el-checkbox>
								</template>
							</el-table-column>
							<el-table-column align="center" prop="is_junk" label="Junk" width="80"
								:filters="[{text:'Yes',value:true}]" :filter-method="filterMethod">
								<template slot-scope="scope">
									<el-checkbox style="transform: scale(1.3);" :value="scope.row.is_junk"
										disabled></el-checkbox>
								</template>
							</el-table-column>
							<el-table-column align="center" prop="is_refund" label="Refunded" width="90">
								<template slot-scope="scope">
									<el-checkbox style="transform: scale(1.3);" :value="scope.row.is_refund"
										disabled></el-checkbox>
								</template>
							</el-table-column>
							<el-table-column align="center" prop="is_check_out" label="Checked Out" width="120"
								:filters="[{text:'Yes',value:true},{text:'No',value:false}]" :filter-method="filterMethod" :filtered-value="[false]">
								<template slot-scope="scope">
									<el-checkbox style="transform: scale(1.3);" :value="scope.row.is_check_out"
										disabled></el-checkbox>
								</template>
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
	import {
		DecisionOption,
		BrandOption,
		SellerOption
	} from "../js/defaultRtWarObj.js";

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
				decisionOption: DecisionOption,
				brandOption: BrandOption,
				sellerOption: SellerOption,
				filters: {
					check: ['is_check_out'],
					decision: "",
					brand: "",
					seller: ""
				},
				loading:false
			};
		},
		created() {
			this.getInitData();
		},
		mounted() {},
		methods: {
			activeFilterChange(prop, value) {
				const table = this.$refs.dataTable;
				let columnIndex = table.columns.findIndex(column => column.property == prop)
				let column = table.columns[columnIndex]
				column.filteredValue = [...value]
				table.store.commit('filterChange', {
					column,
					values: column.filteredValue,
					silent: true
				})
			},
			filter() {
				let filterOption = this.filters
				let targets = ['is_check_out', 'is_need_war', 'is_fraud', 'is_junk']
				for (let key of targets) {
					if (filterOption.check.indexOf(key) == -1) {
						this.activeFilterChange(key, [])
					} else
						key==="is_check_out" ? this.activeFilterChange(key, [false]) : this.activeFilterChange(key, [true]);
				}
				this.activeFilterChange("brand", filterOption.brand === '' ? [] : [filterOption.brand]);
				this.activeFilterChange("decision", filterOption.decision === '' ? [] : [filterOption.decision]);
				this.activeFilterChange("seller", filterOption.seller === '' ? [] : [filterOption.seller]);
			},
			clearfilter(key) {
				let filters = {
					check: ['is_check_out'],
					decision: "",
					brand: "",
					seller: ""
				}
				this.filters = filters;
				this.filter()
				// this.$refs.dataTable.clearFilter();
			},
			getInitData() {
				this.loading = true;
				axios.get("getReturn").then((e) => {
					this.tableData = e.data;
					this.loading = false;
				}).catch((e) => {
					console.log(e)
					this.loading = false;
				})
			},
			dateformat(row, column, cellValue, index) {
				let res = cellValue.split(' ')
				return res[0]
			},
			decisionFmt(row, column, cellValue, index) {
				if (cellValue) {
					let ori = this.decisionOption
					return ori[parseInt(cellValue) - 1]
				} else {
					return ""
				}
			},
			searchBtnText(e) {
				var text = "";
				switch (e) {
					case "order":
						text = "Order#";
						break;
					case "tracker":
						text = "Tracking";
						break;
					case "SN":
						text = "SN";
						break;
					case "date":
						text = "Date";
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
				this.$confirm("此操作将删除该退货, 是否继续?", "提示", {
						confirmButtonText: "删除",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.loading = true
						axios.post("removeReturn",{
							id:row.id
						}).then((e)=>{
							if(e.ret == 0){
								this.tableData = this.tableData.filter((item)=> item.id != row.id)
								this.loading = false
							}
						}).catch((e)=>{
							this.$message(e)
						})
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

			brandQuerySearch(query, cb) {
				let res = []
				for (let brand of this.brandOption) {
					res.push({
						value: brand
					})
				}
				cb(res)
			},

			sellerQuerySearch(query, cb) {
				let res = []
				for (let seller of this.sellerOption) {
					res.push({
						value: seller
					})
				}
				cb(res)
			},
			//单元格点击事件
			cellClickCopy(row, column, cell, event) {
				let cellText = cell.textContent || cell.innerText;
				if (column.property && cellText.length) {
					navigator.clipboard.writeText(cellText).then((e) => {
						this.$message({
							type: "success",
							message: '已复制到剪切板'
						});
					})
				}
			},
			// 过滤逻辑
			filterMethod(value, row, column) {
				return row[column.property] === value;
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