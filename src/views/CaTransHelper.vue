<template>
	<div class="about">
		<my-navi activeIndex="14"></my-navi>
		<el-container>
			<el-header>
				<el-upload :on-change="loadFile" :before-upload="fileCheck" :show-file-list='false'
					accept=".xlsx, .xls, .csv">
					<el-button slot="trigger" size="small" type="primary">加载楼兰库存表</el-button>
					<el-label style="margin-left:10px;">最后更新时间：{{updated_at}}</el-label>
				</el-upload>
			</el-header>
			<el-main>
				<el-row type="flex" justify="start">
					<el-upload :on-change="loadFile" :before-upload="fileCheck" :show-file-list='false'
						accept=".xlsx, .xls, .csv">
						<el-button slot="trigger" size="small" type="primary">加载check out表</el-button>
					</el-upload>
				</el-row>
				<el-row>
					<el-table>

					</el-table>
				</el-row>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import * as XLSX from "xlsx";
	import {
		dateFormat
	} from "../js/Dateformat";
	export default {
		data() {
			return {
				updated_at: localStorage.getItem("LOULAN_INVENTORY") ? JSON.parse(localStorage.getItem("LOULAN_INVENTORY"))
					.updated_at : "暂未上传",
				//存储楼兰库存字典
				jsonData: localStorage.getItem("LOULAN_INVENTORY") ? JSON.parse(localStorage.getItem("LOULAN_INVENTORY"))
					.data : null,
				formData: null
			}
		},
		mounted() {
			console.log(this.jsonData)
		},
		methods: {
			fileCheck(file) {
				const extension = file.name.split('.').pop().toLowerCase();
				const validTypes = [
					'application/vnd.ms-excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'application/vnd.ms-excel.sheet.macroEnabled.12',
					'text/csv'
				];
				const isText = validTypes.includes(file.type) || ['xls', 'xlsx', 'csv'].includes(extension);;
				if (!isText) {
					this.$message.error('只能上传Excel文件');
				}
				return false;
			},
			loadFile(file) {
				const extension = file.name.split('.').pop().toLowerCase();
				const validTypes = [
					'application/vnd.ms-excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'application/vnd.ms-excel.sheet.macroEnabled.12',
					'text/csv'
				];
				const isText = validTypes.includes(file.type) || ['xls', 'xlsx', 'csv'].includes(extension);;
				if (!isText) return;
				this.filename = file.raw.name
				this.readFileContent(file)
			},
			readFileContent(file) {
				const reader = new FileReader();

				reader.onload = (e) => {
					const data = new Uint8Array(e.target.result);
					this.processExcelData(data, file.raw.name);
				};
				reader.onerror = () => {
					this.$message.error('文件读取失败，请重试');
				};
				reader.readAsArrayBuffer(file.raw);
			},
			processExcelData(data, filename) {
				try {
					// 读取Excel工作簿
					let workbook = XLSX.read(data, {
						type: 'array'
					});

					// 获取所有工作表名称
					let sheets = workbook.SheetNames;
					let selectedSheet = sheets[0];
					// 处理第一个工作表
					this.processSelectedSheet(workbook, selectedSheet, filename);
				} catch (error) {
					console.error('Excel处理错误:', error);
					alert('Excel文件处理失败，请确保文件格式正确');
				}
			},
			processSelectedSheet(workbook, selectedSheet, filename) {
				// if (!this.workbook || !this.selectedSheet) return;

				// 获取工作表
				const worksheet = workbook.Sheets[selectedSheet];

				// 将工作表转换为JSON
				const jsonData = XLSX.utils.sheet_to_json(worksheet, {
					header: 1
				});
				let json_data = XLSX.utils.sheet_to_json(worksheet);

				if (filename.includes("Inventory")) {
					let json_obj = {}
					for (let item of json_data) {
						let upc = item.Barcode
						let name = item["Product Name"]
						let model = item.Model
						json_obj[upc] = {
							name: name,
							model: model
						}
					}

					let data = {
						data: json_obj,
						updated_at: dateFormat(new Date())
					}
					this.updated_at = data.updated_at
					this.jsonData = json_obj
					localStorage.setItem("LOULAN_INVENTORY", JSON.stringify(data))
					this.$message.success("更新成功")
				}

				if (filename.includes("Check Out")) {
					console.log(json_data)
					const data = json_data.filter((e) => {
						let value = e["3PL Memo"]
						if (!value) {
							return false
						}
						return value.toUpperCase().includes(" 701-") || value.toUpperCase().includes(" 702-") ||
							value.toUpperCase().includes("BBY") || value.toUpperCase().includes("CHILL AU") ||
							value.toUpperCase().includes("ONT_AU")
					})
					let obj = {}
					for (let item of data) {
						let upc = item.UPC
						let qty = item.Qty
						if (!obj[upc]) {
							obj[upc] = 0
						}
						obj[upc] += qty
					}
					console.log(obj)
					let array = []
					for (let key in obj) {
						let infoObj = this.jsonData[key]
						let item = {
							UPC: key,
							ItemName: infoObj?infoObj.name:"无有效库存，请移步至楼兰查询",
							Model: infoObj?infoObj.model:"",
							Qty: obj[key]
						}
						array.push(item)
					}
					array.sort((a,b)=>{
						return b.Qty - a.Qty
					})
					console.log(array)
				}
			},
		}
	}
</script>

<style>
</style>