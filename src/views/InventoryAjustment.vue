<template>
	<div class="about">
		<my-navi activeIndex="7"></my-navi>
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
							<el-dropdown-item command="upc">UPC</el-dropdown-item>
							<el-dropdown-item command="model">Model</el-dropdown-item>
							<el-dropdown-item command="date">Date</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-input v-model="searchParam" v-if="searchKey != 'date'" style="margin:0 10px; width: 50%;"
						@keyup.enter.native="searchRecord"></el-input>

					<el-date-picker v-else style="margin: 0 10px; width: 50%;" v-model="searchParam" type="daterange"
						align="right" unlink-panels range-separator="to" start-placeholder="Start Date"
						end-placeholder="End Date" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>

					<el-button type="primary" @click="searchRecord">
						Search <i class="el-icon-search"></i>
					</el-button>
					<el-button type="primary" style="position: absolute; right: 50px; width: 120px;"
						@click="AddDialogVisible = true">Add</el-button>
				</el-header>
				<el-main style="padding-top: 0 !important;">
					<el-table ref="dataTable" :height="table_max_height" v-loading="loading" :data="tableData" fit
						@row-contextmenu="handleContextMenu">
						<el-table-column label="ID" prop="id" width="80"></el-table-column>
						<el-table-column label="UPC" prop="upc" width="120"></el-table-column>
						<el-table-column label="Model" prop="model" width="300" show-overflow-tooltip></el-table-column>
						<el-table-column label="Adjustment" prop="adjustment" width="120"></el-table-column>
						<el-table-column label="Price" width="200" :formatter="PriceFmt"></el-table-column>
						<el-table-column label="Note" prop="note" show-overflow-tooltip width="200"></el-table-column>
						<el-table-column label="Stores" prop="stores">
							<template slot-scope="scope">
								<el-checkbox-group v-model="scope.row.stores" @change="storeChange(scope.row)">
									<el-checkbox v-for="(item, index) in Seller_Option" :key="index" :label="item">{{item}}</el-checkbox>
								</el-checkbox-group>
							</template>
							
						</el-table-column>
						<!-- <el-table-column label="操作" width="150">
							<template slot-scope="scope">
								<el-button size="mini" type="primary"
									@click="handleEditByTable(scope.$index, scope.row)">
									Edit</el-button>
								<el-button size="mini" type="danger"
									@click="handleDeleteByTable(scope.$index, scope.row)">
									Del</el-button>
							</template>
						</el-table-column> --> 
						<template #empty>
							<div class="custom-empty">
								<p class="empty-text">今日无数据</p>
							</div>
						</template>
					</el-table>
				</el-main>
			</el-container>
		</div>
		<el-dialog title="Add Inventory Adjustment" :visible.sync="AddDialogVisible" width="25%"
			@closed="handleDialogClosed">
			<el-form :rules="rulses" :model="queryData" ref="addform">
				<el-form-item label="UPC:" prop="upc">
					<el-input v-model="queryData.upc"></el-input>
				</el-form-item>
				<el-form-item label="Model:" prop="model">
					<el-input v-model="queryData.model"></el-input>
				</el-form-item>
				<el-form-item label="Adjustment:" prop="adjustment">
					<el-autocomplete style="width: 100%;" v-model="queryData.adjustment"
						:fetch-suggestions="sellerQuerySearch"></el-autocomplete>
				</el-form-item>
				<el-form-item v-if="priceVisiable()" label="Before Price" prop="price_before">
					<el-input v-model="queryData.price_before">
						<template slot="prepend">$</template>
					</el-input>
				</el-form-item>
				<el-form-item v-if="priceVisiable()" label="After Price" prop="price_after">
					<el-input v-model="queryData.price_after">
						<template slot="prepend">$</template>
					</el-input>
				</el-form-item>
				<el-form-item label="Note:" prop="note">
					<el-input v-model="queryData.note"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="AddDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
		<transition name="menu-fade">
			<div v-show="menu.visible" class="custom-context-menu" :style="menuPosition">
				<div class="menu-header">
					<span class="menu-title">操作菜单</span>
					<el-button type="text" icon="el-icon-close" class="close-btn" @click="closeMenu"></el-button>
				</div>

				<!-- <div class="menu-item" @click="handleCopy">
					<i class="el-icon-document-copy"></i>
					<span>复制数据</span>
				</div> -->

				<div class="menu-divider"></div>

				<div class="menu-item" @click="handleEdit">
					<i class="el-icon-edit"></i>
					<span>编辑条目</span>
				</div>

				<div class="menu-item danger" @click="handleDelete">
					<i class="el-icon-delete"></i>
					<span>删除条目</span>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import moment from "moment-timezone";
	import axios from "../js/request.js";
	import { SellerOption } from "../js/defaultRtWarObj.js";
	
	export default {
		data() {
			return {
				//展示表数据
				tableData: [],
				//查询类型
				searchKey: "date",
				//搜索条件
				searchParam: "",
				//页面数据
				table_max_height: window.innerHeight - 220,
				loading: false,
				queryData: {
					upc: "",
					model: "",
					note: "",
					adjustment:"",
					price_before: "",
					price_after: "",
					stores:[]
				},
				AddDialogVisible: false,
				menu: {
					visible: false,
					left: 0,
					top: 0,
					currentRow: null
				},
				Seller_Option:SellerOption,
				rulses: {
					upc: [{
						required: true,
						message: '请填写UPC',
						trigger: 'blur'
					}],
					model: [{
						required: true,
						message: '请填写Model',
						trigger: 'blur'
					}],
					adjustment:[{
						required: true,
						message: '请填写Adjustment',
						trigger: 'blur'
					}]
				}
			};
		},
		computed: {
			menuPosition() {
				return {
					left: this.adjustX(this.menu.left) + "px",
					top: this.adjustY(this.menu.top) + "px"
				};
			}
		},
		mounted() {
			document.addEventListener("click", this.closeMenu);
			// document.addEventListener('contextmenu', this.closeMenu);
		},
		beforeDestroy() {
			document.removeEventListener("click", this.closeMenu);
			// document.removeEventListener('contextmenu', this.closeMenu);
		},

		created() {
			this.getInitData()
		},
		methods: {
			PriceFmt(row, column, cellValue, index) {
				let before = row.price_before
				let after = row.price_after

				return before ? `$${before} -> $${after}` : after
			},
			getInitData() {
				this.loading = true;
				axios
					.get("getAdjustmentsToday")
					.then(e => {
						this.tableData = e.data;
						this.loading = false;
					})
					.catch(e => {
						console.log(e);
						this.loading = false;
					});
			},
			submit() {
				this.$refs.addform.validate((valid) => {
					if(valid){
						axios.post("addAdjustment", this.queryData).then((e) => {
							this.AddDialogVisible = false;
							this.getInitData()
						})
					}
				})
				
			},
			storeChange(row){
				let stores = row.stores
				axios.post("updateStores",{
					id:row.id,
					stores:stores
				}).then((e)=>{
					if(e.ret == 0){
						this.$message({
							type:"success",
							message:"更新成功"
						})
					}
				})
			},
			dateformat(row, column, cellValue, index) {
				if (cellValue && cellValue.includes(" ")) {
					let res = cellValue.split(" ");
					return res[0];
				} else return cellValue;
			},
			searchBtnText(e) {
				var text = "";
				switch (e) {
					case "model":
						text = "Model";
						break;
					case "upc":
						text = "UPC";
						break;
					case "date":
						text = "Date";
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
					.post("searchAdjustments", {
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

			handleEditByTable(index, row) {

			},

			handleDeleteByTable(index, row) {
				this.$confirm("此操作将删除记录, 是否继续?", "警告", {
						confirmButtonText: "删除",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.loading = true;
						axios
							.post("deleteAdjustment", {
								id: row.id
							})
							.then(e => {
								if (e.ret == 0) {
									this.tableData = this.tableData.filter(
										item => item.id != row.id
									);
									this.loading = false;
								}
								this.$message.success("删除成功");
							})
							.catch(e => {
								this.$message(e);
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			sellerQuerySearch(query, cb) {
				let res = []
				let options = ["下架", "调价", "重新上架", "重新上架并调价"];
				for (let item of options) {
					res.push({
						value: item
					});
				}
				cb(res);
			},

			priceVisiable() {
				let adjustment = this.queryData.adjustment
				return adjustment && adjustment.includes("价")
			},
			handleDialogClosed() {
				this.$refs.addform.resetFields();
			},
			handleContextMenu(row, _, event) {
				event.preventDefault();
				this.menu = {
					visible: true,
					left: event.clientX,
					top: event.clientY,
					currentRow: row
				};
			},
			adjustX(x) {
				const menuWidth = 200;
				const windowWidth = document.documentElement.clientWidth;
				return x + menuWidth > windowWidth ? x - menuWidth : x;
			},
			adjustY(y) {
				const menuHeight = 210;
				const windowHeight = document.documentElement.clientHeight;
				return y + menuHeight > windowHeight ? y - menuHeight : y;
			},
			closeMenu() {
				// console.log("关上了")
				this.menu.visible = false;
			},
			handleCopy() {
				navigator.clipboard.writeText(JSON.stringify(this.menu.currentRow));
				this.$message.success("数据已复制");
				this.closeMenu();
			},
			handleEdit() {
				this.closeMenu();
				this.queryData = {
					...this.menu.currentRow
				}
				this.AddDialogVisible = true
			},
			handleDelete() {
				this.$confirm("此操作将删除该退货, 是否继续?", "警告", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let row = this.menu.currentRow;
						this.loading = true;
						axios
							.post("deleteAdjustment", {
								id: row.id
							})
							.then(e => {
								if (e.ret == 0) {
									this.tableData = this.tableData.filter(
										item => item.id != row.id
									);
									this.loading = false;
								}
								this.$message.success("删除成功");
							})
							.catch(e => {
								this.$message(e);
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
				this.closeMenu();
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

	/* 菜单过渡动画 */
	.menu-fade-enter-active,
	.menu-fade-leave-active {
		transition: opacity 0.2s, transform 0.2s;
	}

	.menu-fade-enter,
	.menu-fade-leave-to {
		opacity: 0;
		transform: translateY(-10px);
	}

	/* 菜单容器样式 */
	.custom-context-menu {
		position: fixed;
		width: 200px;
		background: #ffffff;
		border-radius: 8px;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
		user-select: none;
		z-index: 9999;
	}

	/* 菜单头部 */
	.menu-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid #f0f0f0;
	}

	.menu-title {
		font-weight: 600;
		color: #333;
		font-size: 14px;
	}

	.close-btn {
		padding: 0;
		color: #999;

		&:hover {
			color: #666;
		}
	}

	/* 菜单项样式 */
	.menu-item {
		display: flex;
		align-items: center;
		padding: 10px 16px;
		cursor: pointer;
		transition: all 0.2s;
		color: #333;

		&:hover {
			background: #f5f7fa;
		}

		i {
			margin-right: 12px;
			font-size: 16px;
		}

		&.danger {
			color: #f56c6c;

			i {
				color: inherit;
			}

			&:hover {
				background: #fef0f0;
			}
		}

		&.disabled {
			cursor: not-allowed;
			opacity: 0.5;

			&:hover {
				background: none;
			}
		}
	}

	/* 分隔线 */
	.menu-divider {
		height: 1px;
		background: #f0f0f0;
		margin: 6px 0;
	}
</style>