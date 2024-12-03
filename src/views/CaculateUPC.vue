<template>
	<div class="about_">
		<div clase="contain_">
			<el-row :gutter="20">
				<!-- <el-col :span="12"> -->
					<el-container style="height: 800px;">
						<el-header style="justify-content: space-between;">
							<label>UPC 计算</label>
							<el-dropdown split-button type="primary" @command="BrandSelect">
							  {{Brand}}
							  <el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="(item, index) in Brand_option" :key="index" :command="item">{{item}}</el-dropdown-item>
							  </el-dropdown-menu>
							</el-dropdown>
							<!-- <label></label-->
							<!-- <div style="width: 180px;">
								<el-input placeholder="口令(正式环境取消)" v-model="pwd"></el-input>
							</div> -->
							
						</el-header>
						<el-main>
							<el-input readonly v-model="upcs_load" type="textarea" :rows="30">
							</el-input>
						</el-main>
						<el-footer>
							<div>
								<el-row :gutter="20">
									<el-col :span="4">
										数量：
									</el-col>
									<el-col :span="4">
										<el-input v-model="qty"></el-input>
									</el-col>
									<el-col :span="5">
										<el-button :disabled="load_btn_status.disable" @click="loadUPC" type="primary">{{load_btn_status.title}}</el-button>
									</el-col>
									<el-col :span="5">
										<el-button @click="copy_upcs_str" class="copy_upcs"
											:data-clipboard-text="upcs_load" type="primary">复制到剪切板</el-button>
									</el-col>
								</el-row>
							</div>

						</el-footer>
					</el-container>
				<!-- </el-col> -->
				
			</el-row>
		</div>
	</div>
</template>

<script>
	import axios from '../js/request.js';
	import Clipboard from "clipboard";
	export default {
		data() {
			return {
				upcs_save: "",
				upcs_load: "",
				pwd: "",
				qty: 0,
				stores: "",
				save_btn_status:{
					disable:false,
					title:"存入 UPC"
				},
				load_btn_status:{
					disable:false,
					title:"获取 UPC"
				},
				Brand:"选择品牌",
				Brand_option:[
					"HP","LENOVO"
					// ,"DELL","MSI","ASUS","ACER","LG","INTEL","SAMSUNG"
				]
			}
		},
		methods: {			
			BrandSelect(res){
				this.Brand = res;
			},
			loadUPC() {
				if(this.Brand == "选择品牌"){
					alert("选择品牌")
					return;
				}
				if(this.qty == 0){
					alert("填写数量")
					return;
				}
				// if(this.pwd != "123Ranknow!"){
				// 	alert("口令错误")
				// 	return;
				// }
				this.upcs_load = "";
				let status = this.load_btn_status;
				let status_ori = {...status};
				status.disable = true;
				status.title = "获取中...";
				this.load_btn_status = status;
				let count = 5;
				let timer = setInterval(()=>{
					status.title = `获取间隔(${count})`;
					this.load_btn_status = status;
					if(count == 0){
						this.load_btn_status = status_ori;
						clearInterval(timer);
						timer = null;
					}
					count--;
				},1000);
				axios.post()
				axios.post("caculateupc",{
					"qty":this.qty,
					"brand":this.Brand
				}).then((e) => {
					if (e.ret != 0) {
						this.$alert(e.msg, '提示', {
							confirmButtonText: '确定',
							type: 'error'
						});
					} else {
						let upcAry = e.upcs;
						let upcs_str = "";
						for (var upc of upcAry) {
							console.log(upc)
							upcs_str += upc + "\r\n"
						}
						this.upcs_load = upcs_str;
						// console.log(upcs_str)
					}
				}).catch((e)=>{
					this.$message.error("请求出错了");
					this.load_btn_status = status_ori;
				})
			},
			copy_upcs_str() {
				this.check_when_copyed(".copy_upcs")
			},
			check_when_copyed(identify) {
				const clipboard = new Clipboard(identify);
				clipboard.on("success", (e) => {
					this.$message({
						type: "success",
						message: '已复制到剪切板'
					});
					// 释放内存
					clipboard.destroy();
				});
				clipboard.on("error", e => {
					// 不支持复制
					this.$message.error('该浏览器不支持复制');
					// 释放内存
					clipboard.destroy();
				});
			}
		}
	}
</script>

<style>
	.about_{
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}
	.contain_ {
		/* display: inline-block; */
		width: 50%;
	}
</style>