<template>
	<div style="padding: 20px;display: inline-block;">
		<div class="" style="padding: 20px;">
			<div class="">
				<el-radio-group v-model="area" @change="reloadTemple">
					<el-radio-button label="加拿大"></el-radio-button>
					<el-radio-button label="澳大利亚"></el-radio-button>
				</el-radio-group>
			</div>
			<div class="" style="margin-top: 20px;">
				<el-radio-group v-model="list_type" @change="reloadTemple">
					<el-radio-button label="Traditional_laptop"></el-radio-button>
					<el-radio-button label="All-in-one"></el-radio-button>
					<el-radio-button label="Minis"></el-radio-button>
					<el-radio-button label="Towers"></el-radio-button>
				</el-radio-group>
			</div>
			<div class="" style="margin-top: 20px;">
				<el-row :gutter="10">
					<el-col :span="8">
						目标价格 = (美元价格 + 
					</el-col>
					<el-col :span="3">
						<el-input v-model="addition_price" size="mini"></el-input>
					</el-col>
					<el-col :span="2">
						) x
					</el-col>
					<el-col :span="3">
						<el-input v-model="rate" size="mini"></el-input>
					</el-col>
				</el-row>
				<!-- 自动计算价格：目标价格 = (美元价格 + 
				<el-input v-model="addition_price" size="mini"></el-input>
				) * 
				<el-input v-model="rate" size="mini"></el-input> -->
			</div>
		</div>

		<el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/"
			:before-upload="uploadBefore">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
		</el-upload>
		<div>{{filename}}</div>
		<el-button style="margin-top: 100px;" @click="convertToCA">转换并下载</el-button>
	</div>
</template>

<script>
	import * as XLSX from "xlsx";
	import {
		Loading,
		Switch
	} from 'element-ui';
	// import fs from 'fs-extra';
	var loading;
	export default {
		data() {
			return {
				area: "加拿大",
				list_type: "Traditional_laptop",
				filename: "",
				originList: {},
				targetList: {},
				//加价
				addition_price:100,
				//汇率比
				rate:1.3
			}
		},
		created() {
			this.readWorkbookFromRemoteFile('/CA/TraditionalLaptops.xlsm', (e) => {
				var worksheet = e.Sheets['Template'];
				this.targetList = XLSX.utils.sheet_to_json(worksheet, {
					range: 2,
					defval: ""
				});
				console.log(this.targetList)
			});
		},
		methods: {
			//根据选项获取
			getTempleFilePath() {
				let directory = "";
				let filename = "";
				switch (this.area) {
					case "加拿大":
						directory = "CA";
						break;
					case "澳大利亚":
						directory = "AU";
						break;
					default:
						directory = "CA";
						break;
				}
				switch (this.list_type) {
					case "Traditional_laptop":
						filename = "TraditionalLaptops.xlsm";
						break;
					case "All-in-one":
						filename = "All-in-Ones.xlsm";
						break;
					case "Minis":
						filename = "Minis.xlsm";
						break;
					case "Towers":
						filename = "Towers.xlsm";
						break;
					default:
						filename = "TraditionalLaptops.xlsm";
						break;
				}
				console.log(`/${directory}/${filename}`);
				return `/${directory}/${filename}`;
			},
			reloadTemple() {
				let path = this.getTempleFilePath();
				this.readWorkbookFromRemoteFile(path, (e) => {
					var worksheet = e.Sheets['Template'];
					this.targetList = XLSX.utils.sheet_to_json(worksheet, {
						range: 2,
						defval: ""
					});
					console.log(this.targetList)
				});
				if(this.area == "澳大利亚"){
					this.addition_price = 0;
					this.rate = 1.6;
				}else{
					this.addition_price = 100;
					this.rate = 1.3;
				}
			},
			// 读取本地excel文件
			// 从网络上读取某个excel文件，url必须同域，否则报错
			readWorkbookFromRemoteFile: function(url, callback) {
				var xhr = new XMLHttpRequest();
				xhr.open('get', url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function(e) {
					if (xhr.status == 200) {
						var data = new Uint8Array(xhr.response)
						var workbook = XLSX.read(data, {
							type: 'array'
						});
						if (callback) callback(workbook);
					}
				};
				xhr.send();
			},
			uploadBefore(file) {
				loading = Loading.service({
					fullscreen: true
				});
				this.loadBeforeExcel(file);
				return false;
			},
			loadBeforeExcel(file) {
				this.filename = file.name;
				let reader = new FileReader();
				reader.onload = (e) => {
					let data = e.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'
					});
					let template = workbook.Sheets["Template"];
					this.originList = XLSX.utils.sheet_to_json(template, {
						range: 2,
						defval: ""
					});
					console.log(this.originList);
					loading.close();
				}
				reader.readAsBinaryString(file);
			},
			convertToCA() {
				var obj = [];
				for (let row of this.originList) {
					let new_row = {};
					for (let key in this.targetList[0]) {
						if(key == "standard_price"){
							new_row[key] = (parseFloat(row[key]) + parseFloat(this.addition_price)) * parseFloat(this.rate);
						}else{
							new_row[key] = row[key];
						}
					}
					obj.push(new_row);
				}
				// console.log(obj);
				this.exec(obj);
			},
			exec(target) {
				var newbook = XLSX.utils.book_new();
				let sheet1 = XLSX.utils.json_to_sheet(target);
				let new_filename = this.getFileName(this.filename);
				XLSX.utils.book_append_sheet(newbook, sheet1, "Template");
				XLSX.writeFile(newbook, new_filename);
			},
			getFileName(name) {
				let ary = name.split(".");
				let name_front = ary[0];
				this.area == "加拿大"?name_front += "_Ca":name_front += "_AU";
				return name_front + "." + ary[1];
			}
		}
	}
</script>

<style>
</style>
