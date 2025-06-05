<template>
	<div class="about">
		<my-navi activeIndex="10"></my-navi>
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
							<el-dropdown-item command="code">Code</el-dropdown-item>
							<el-dropdown-item command="sn">SN</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-input v-model="searchParam" style="margin:0 10px; width: 50%;" clearable
						@keyup.enter.native="searchRecord"></el-input>
					<el-button type="primary" @click="searchRecord">
						Search <i class="el-icon-search"></i>
					</el-button>
					<el-button type="primary" style="position: absolute; right: 50px; width: 120px;"
						@click="AddDialogVisible = true">Add</el-button>
				</el-header>
				<el-main style="padding-top: 0 !important;">
					<el-table ref="dataTable" :height="table_max_height" v-loading="loading" :data="tableData" fit
						@row-contextmenu="handleContextMenu" row-class-name="table_text">
						<el-table-column label="ID" prop="id" width="80"></el-table-column>
						<el-table-column label="Code" prop="code" width="400"></el-table-column>
						<el-table-column label="SN" :formatter="SnsFmt"></el-table-column>

						<el-table-column label="操作" width="150">
							<template slot-scope="scope">
								<el-button type="primary" @click="handleEditByTable(scope.$index, scope.row)">
									注册SN</el-button>
								<!-- <el-button size="mini" type="danger"
									@click="handleDeleteByTable(scope.$index, scope.row)">
									Del</el-button> -->
							</template>
						</el-table-column>
						<template #empty>
							<div class="custom-empty">
								<p class="empty-text">暂无数据</p>
							</div>
						</template>
					</el-table>
				</el-main>
			</el-container>
		</div>
		<el-dialog title="Add Codes" :visible.sync="AddDialogVisible" width="30%" @closed="handleDialogClosed">
			<el-input v-model="codes" type="textarea" :autosize="{ minRows: 10, maxRows: 20}"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="AddDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit" :loading="addCodeBtnDisable">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog :title="RegistCode.code" :visible.sync="RegistDialogShow" width="30%" @closed="RegistDialogClosed">
			<el-input v-model="registSN"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="RegistDialogShow = false">取 消</el-button>
				<el-button type="primary" @click="registSNtoCode" :loading="registBtnDisable">确 定</el-button>
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
					<span>注册SN</span>
				</div>

				<div v-if="$store.getters.isAdmin" class="menu-item danger" @click="handleDelete">
					<i class="el-icon-delete"></i>
					<span>删除Code</span>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import axios from "../js/request.js";

	export default {
		data() {
			return {
				//展示表数据
				tableData: [],
				//查询类型
				searchKey: "sn",
				//搜索条件
				searchParam: "",
				//页面数据
				table_max_height: window.innerHeight - 150,
				loading: false,
				queryData: {
					upc: "",
					model: "",
					note: "",
					adjustment: "",
					price_before: "",
					price_after: "",
					stores: []
				},
				AddDialogVisible: false,
				menu: {
					visible: false,
					left: 0,
					top: 0,
					currentRow: null
				},
				codes: "",
				addCodeBtnDisable: false,
				RegistDialogShow: false,
				RegistCode: "",
				registSN: "",
				registBtnDisable: false
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
			SnsFmt(row, column, cellValue, index) {
				let sns = row.sns
				let sns_str = ""
				for (let sn of sns) {
					sns_str += `<${sn}>   `
				}
				return sns_str
			},
			getInitData() {
				this.loading = true;
				axios
					.get("getActiveCodes")
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
				this.addCodeBtnDisable = true;
				let code_ary = this.codes.split(/[(\r\n)\r\n]+/)
				axios.post("batchAddCode", code_ary).then((e) => {
					this.getInitData()
					this.addCodeBtnDisable = false;
					this.AddDialogVisible = false;
				}).catch((e) => {
					this.$message({
						message: e.message,
						type: "error"
					})
					this.addCodeBtnDisable = false;
					this.AddDialogVisible = false;
				})
			},
			registSNtoCode() {
				this.registBtnDisable = true;
				axios.post("addsn", {
					id: this.RegistCode.id,
					sn: this.registSN
				}).then((e) => {
					if (e.ret == 0) {
						this.RegistCode.sns = e.sns
					} else
						this.$message(e.message)
					this.registBtnDisable = false;
					this.RegistDialogShow = false;
				}).catch((e) => {
					this.$message({
						message: e.message,
						type: "error"
					})
					this.registBtnDisable = false;
					this.RegistDialogShow = false;
				})
			},
			searchBtnText(e) {
				var text = "";
				switch (e) {
					case "code":
						text = "Code";
						break;
					case "sn":
						text = "SN";
						break;
				}
				return text;
			},
			searchRecord() {
				// if (this.searchParam.length == 0) {
				// 	return;
				// }
				this.loading = true;
				axios
					.post("searchCodes", {
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
				this.RegistCode = row
				this.RegistDialogShow = true
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
							.post("deleteCode", {
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
								this.$message(e.message);
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},

			handleDialogClosed() {
				this.codes = "";
			},
			RegistDialogClosed() {
				this.RegistCode = ""
				this.registSN = ""
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
				this.RegistCode = this.menu.currentRow
				this.RegistDialogShow = true
				this.closeMenu();
			},
			handleDelete() {
				this.$confirm("此操作将删除该Code, 是否继续?", "警告", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let row = this.menu.currentRow;
						this.loading = true;
						axios
							.post("deleteCode", {
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
								this.$message(e.message);
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

	.table_text {
		font-size: 16px !important;
	}
</style>