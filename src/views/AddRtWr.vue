<template>
	<div style="position: relative;">
		<h2>{{ warrantyAccess ? "Edit" : "New Return Entry" }}</h2>
		<div style="text-align: left; margin:0 5%">
			<el-card v-if="!warrantyAccess">
				<div class="title_card" slot="header">
					<span>Auto Fill</span>
					<el-button style="margin-left: 50px;" type="primary" @click="autofill">Click to Fill</el-button>
				</div>
				<el-input type="textarea" v-model="autofillStr" :autosize="{minRows: 6, maxRows: 6}"
					placeholder="Paste return email here"></el-input>
			</el-card>
			<span style="font-size: 20px;">Return ID:
				{{ queryData.rt_id ? queryData.rt_id : "Generate after submit" }}</span>
			<el-form :disabled="isReadOnly" label-position="top" :model="queryData" ref="dataform">
				<div v-loading="loading" element-loading-text="saving..." element-loading-spinner="el-icon-loading">
					<el-card>
						<div class="title_card" slot="header">
							<span>General Information</span>
						</div>
						<el-row>
							<el-col :span="5">
								<el-form-item style="width: 80%;" label="Return Tracking:" prop="rt_track">
									<el-input v-model="queryData.rt_track"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item label="Label Type:" prop="lb_type">
									<el-select v-model="queryData.lb_type">
										<el-option label="Amazon" value="Amazon"></el-option>
										<el-option label="Warehouse" value="Warehouse"></el-option>
										<el-option label="Customer" value="Customer"></el-option>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item style="width: 80%;" label="Order#:" prop="order_id">
									<el-input v-model="queryData.order_id"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="Store:" prop="seller">
									<el-autocomplete v-model="queryData.seller"
										:fetch-suggestions="querySellerSearch"></el-autocomplete>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item style="width: 80%;" label="Operator:" prop="creator">
									<el-input v-model="queryData.creator" placeholder="Mia"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="5">
								<el-form-item label="Returned On:" prop="rt_dt">
									<el-date-picker type="date" :value-format="dateFormat"
										v-model="queryData.rt_dt"></el-date-picker>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item label="Received On:" prop="rec_dt">
									<el-date-picker type="date" :value-format="dateFormat"
										v-model="queryData.rec_dt"></el-date-picker>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item style="width: 80%;" label="LPN:" prop="rt_lpn">
									<el-input v-model="queryData.rt_lpn"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item label="Processed On:">
									<el-date-picker type="date" :value-format="dateFormat" disabled
										:value="defaultDate()"></el-date-picker>
								</el-form-item>
							</el-col>

							<el-col :span="4">
								<el-form-item label="Return Region">
									<el-select v-model="queryData.rt_region">
										<el-option label="US" :value="1"></el-option>
										<el-option label="CA" :value="2"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-card>

					<el-card style="margin-top: 20px;">
						<div class="title_card" slot="header">
							<span>Return Item Details</span>
						</div>

						<el-row>
							<el-col :span="5">
								<el-form-item label="Brand:" prop="brand">
									<el-autocomplete v-model="queryData.brand"
										:fetch-suggestions="queryBrandSearch"></el-autocomplete>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item style="width: 80%;" label="Model:" prop="model">
									<el-input v-model="queryData.model" placeholder=""></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item style="width: 80%;" label="UPC:" prop="upc">
									<el-input v-model="queryData.upc" placeholder=""></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item style="width: 80%;" label="SN:" prop="sn">
									<el-input v-model="queryData.sn" placeholder=""></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="5">
								<el-form-item label="Ori Config:" prop="war_ori_config">
									<el-input style="width: 280px;" v-model="queryData.war_ori_config"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="Current Config:" prop="cur_config">
									<el-input style="width: 280px;" v-model="queryData.cur_config"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="5">
								<el-form-item style="width: 80%;" label="Condition Notes:" prop="rt_cmt">
									<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
										v-model="queryData.rt_cmt"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item style="width: 80%;" label="Comments for service:" prop="rt_cmt_cs">
									<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
										v-model="queryData.rt_cmt_cs"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="5">
								<el-form-item style="width: 80%;" label="Return Reason:" prop="rt_reason">
									<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
										v-model="queryData.rt_reason"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row v-if="!warrantyAccess">
							<el-form-item label="Quantity:" prop="rt_qty">
								<el-input-number v-model="queryData.rt_qty" :min="1"></el-input-number>
							</el-form-item>
						</el-row>

						<el-row style="margin-left: 10%;transform: scale(1.2);">
							<el-col :span="3">
								<el-form-item prop="is_need_war">
									<el-checkbox v-model="queryData.is_need_war" @change="needWarrantyChanged">Need
										Repair</el-checkbox>
								</el-form-item>
							</el-col>

							<el-col :span="3">
								<el-form-item prop="is_fraud">
									<el-checkbox v-model="queryData.is_fraud">Fraud Return</el-checkbox>
								</el-form-item>
							</el-col>

							<el-col :span="3">
								<el-form-item prop="is_junk">
									<el-checkbox v-model="queryData.is_junk">Junk / Parts</el-checkbox>
								</el-form-item>
							</el-col>
						</el-row>
					</el-card>

					<el-card v-if="warrantyAccess" style="margin-top: 20px;">
						<div class="title_card" slot="header">
							<span>Warranty Repair</span>
						</div>

						<el-row>
							<el-col :span="4">
								<el-form-item label="Expire On:" prop="war_expire_dt">
									<el-date-picker :value-format="dateFormat" type="date"
										:disabled="queryData.war_expired"
										v-model="queryData.war_expire_dt"></el-date-picker>
									<el-checkbox style="margin-left: 10px; transform:scale(1.2);"
										:checked="queryData.war_expire_dt === 'expired'"
										@change="warExpireChange">expired</el-checkbox>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item style="width:80%;" label="Warranty Operator:" prop="war_opr">
									<el-input v-model="queryData.war_opr"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="Repair Method:" prop="war_method">
									<el-select v-model="queryData.war_method">
										<el-option label="Factory" value="Factory"></el-option>
										<el-option label="Warehouse" value="Warehouse"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item style="width: 80%;" label="Outbound Tracking:" prop="war_track_out">
									<el-input v-model="queryData.war_track_out"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item style="width: 80%;" label="Inbound Tracking:" prop="war_track_in">
									<el-input v-model="queryData.war_track_in"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="4">
								<el-form-item label="Repair Date:" prop="war_dt">
									<el-date-picker :value-format="dateFormat" type="date"
										v-model="queryData.war_dt"></el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="Case#:" prop="war_case">
									<el-input v-model="queryData.war_case"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="Defects" prop="war_def">
									<el-select v-model="queryData.war_def">
										<el-option v-for="(item, index) in defects" :key="index" :label="item"
											:value="item"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="4">
								<el-form-item label="Warranty Comments:" prop="war_cmt">
									<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
										v-model="queryData.war_cmt"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-card>

					<el-card style="margin-top: 20px;">
						<div class="title_card" slot="header">
							<span>Pictures</span>
							<el-button ref="downloadBtn" style="float: right;" type="text" v-if="warrantyAccess"
								@click="downloadPictures">Download for
								Zip</el-button>
						</div>
						<div style="display: flex;">
							<el-upload ref="upload" list-type="picture" drag multiple :http-request="upload"
								:show-file-list="false">
								<i class="el-icon-upload"></i>
								<div class="el-upload__text">
									Drag files here, or <em>click upload</em>
								</div>
								<div class="el-upload__tip" slot="tip">only JPG or PNG file</div>
							</el-upload>
							<div style="margin-left: 20px; flex: 1;">
								Uploaded：
								<div style="display: flex; flex-wrap: wrap; width: 100%; height: 100%;"
									element-loading-text="上传中..." element-loading-spinner="el-icon-loading"
									element-loading-background="rgba(0, 0, 0, 0.2)" v-loading="upPicLoading">
									<div style="padding: 10px; position: relative;" v-for="(pic, idx) in picslist"
										:key="idx">
										<el-image style="width: 150px; height: 150px" :preview-src-list="[pic.url]"
											:src="pic.url" :fit="fit"></el-image>
										<el-button
											style="width: 20px; height: 20px; font-size: 13px; text-align:center; padding: 0 !important; position: absolute; top:0; right:0;"
											type="danger" icon="el-icon-close" circle
											@click="removePic(pic, index)"></el-button>
									</div>
								</div>
							</div>
						</div>
					</el-card>
				</div>
				<el-card style="margin-top: 20px;">
					<el-row type="flex" justify="space-between">
						<el-col :span="12">
							<el-row>
								<el-col :span="5">
									<el-form-item label="Decision:" prop="decision">
										<el-select placeholder="" v-model="queryData.decision">
											<el-option v-for="(item, index) in decisions" :key="index" :label="item"
												:value="index + 1"></el-option>
										</el-select>
									</el-form-item>
								</el-col>

								<el-col :span="5">
									<el-form-item label="Submit">
										<el-button :loading="loading" :disabled="queryData.decision < 1"
											style="width: 150px;" type="primary"
											@click="submitQueryData">Submit</el-button>
									</el-form-item>
								</el-col>
							</el-row>
						</el-col>
						<el-col v-if="warrantyAccess" :span="4">
							<el-form-item label="Check Out">
								<el-button :disabled="queryData.is_check_out" style="width: 150px;" type="warning"
									@click="checkout">{{
                    queryData.is_check_out ? "Is Checked Out" : "Check Out"
                  }}</el-button>
							</el-form-item>
						</el-col>
						<el-col v-if="warrantyAccess && $store.getters.isAdmin" :span="4">
							<el-form-item label="In Stock">
								<el-button :disabled="!queryData.is_check_out" style="width: 150px;" type="warning"
									@click="instock">{{
						  queryData.is_check_out ? "In Stock" : "Is Instock"
						}}</el-button>
							</el-form-item>
						</el-col>
						<el-col v-if="warrantyAccess" :span="4">
							<el-form-item label="Refund">
								<el-button :disabled="queryData.is_refunded" style="width: 150px;" type="success"
									@click="refund">{{
                    queryData.is_refunded ? "Is Refunded" : "Refund"
                  }}</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
			</el-form>
		</div>
		<el-button type="danger" class="cancel_btn" @click="goBack">X</el-button>
	</div>
</template>

<script>
	import axios from "axios";
	import COS from "cos-js-sdk-v5";
	import {
		dateFormat
	} from "../js/Dateformat.js";
	import {
		InitQuery,
		DefectsOption,
		BrandOption,
		SellerOption,
		DecisionOption
	} from "../js/defaultRtWarObj.js";
	// import JSZip from "jszip";
	import {
		zip
	} from 'fflate';
	import {
		saveAs
	} from "file-saver";
	import {
		read
	} from "fs";
	export default {
		data() {
			return {
				brands: BrandOption, //["HP", "LENOVO", "DELL", "ACER", "ASUS", "MSI", "LG", "SAMSUNG", "INTEL"],
				seller: SellerOption, //["ONT", "COU", "VNE", "IVY", "RTC", "HLT", "ROB", "DAS", "ETS", "KLT", "GFA", "WWC", "CHILL_AU"],
				defects: DefectsOption,
				decisions: DecisionOption,
				queryData: {},
				isReadOnly: false, //仅查看
				warrantyAccess: false, //是否从warranty进入
				uploadCos: null,
				dateFormat: "yyyy-MM-dd",
				picslist: [],
				upPicLoading: false,
				loading: false,
				autofillStr: ""
			};
		},
		created() {
			this.isReadOnly =
				this.$router.currentRoute.query.readOnly == "yes" ? true : false;
			//判断是新建还是编辑
			let query = this.$router.currentRoute.query.data;
			if (query) {
				this.queryData = {
					...JSON.parse(query)
				};
				this.warrantyAccess = true;
				this.getPics(this.queryData.pic_ids);
			} else {
				this.queryData = {
					...InitQuery
				};
				this.queryData.pic_ids = [];
				this.warrantyAccess = false;
			}

			//在readonly状态下监控键盘
			if (this.isReadOnly) {
				document.addEventListener('keydown', this.handleGlobalEnter)
			}

			this.uploadCos = new COS({
				getAuthorization: async function(options, callback) {
					const data = await axios.get("gettempkeys");
					callback({
						TmpSecretId: data.data.credentials.tmpSecretId,
						TmpSecretKey: data.data.credentials.tmpSecretKey,
						SecurityToken: data.data.credentials.sessionToken,
						// 建议返回服务器时间作为签名的开始时间，避免客户端本地时间偏差过大导致签名错误
						StartTime: data.data.startTime, // 时间戳，单位秒，如：1580000000
						ExpiredTime: data.data.expiredTime, // 时间戳，单位秒，如：1580000000
						ScopeLimit: true // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
					});
				}
			});
		},
		mounted() {
			// 直接操作 DOM 移除禁用属性
			if (this.isReadOnly) {
				this.$nextTick(() => {
					const btn = this.$refs.downloadBtn.$el;
					btn.disabled = false;
					btn.classList.remove('is-disabled');
				});
			}
		},
		beforeDestroy() {
			if (this.isReadOnly) {
				document.removeEventListener('keydown', this.handleGlobalEnter)
			}
		},
		methods: {
			getPics(pic_ids) {
				axios
					.post("getpics", {
						ids: pic_ids
					})
					.then(e => {
						this.picslist = e.data;
						this.upPicLoading = false;
					});
			},
			goBack() {
				this.$router.back();
			},
			querySellerSearch(query, cb) {
				let res = [];
				for (let seller of this.seller) {
					res.push({
						value: seller
					});
				}
				cb(res);
			},
			queryBrandSearch(query, cb) {
				let res = [];
				for (let brand of this.brands) {
					res.push({
						value: brand
					});
				}
				cb(res);
			},
			//上传图片
			async upload(file) {
				this.upPicLoading = true;
				let param = {
					Bucket: "pic-bucket-1317637543",
					Region: "ap-beijing",
					Key: file.file.name,
					Body: file.file
				};
				this.uploadCos
					.uploadFile(param)
					.then(e => {
						let fileLocation = `Https://${e.Location}`;
						let pic = {
							name: file.file.name,
							url: fileLocation
						};
						axios.post("addpic", pic).then(e => {
							let id = e.pic_id;
							this.queryData.pic_ids.push(id);
							this.getPics(this.queryData.pic_ids);
						});
					})
					.catch(error => {
						this.$message(error);
						this.upPicLoading = false;
					});
			},
			removePic(pic, index) {
				this.$confirm("是否要删除图片", "提示", {
					confirmButtonText: "删除",
					cancelButtonText: "取消"
				}).then(e => {
					this.picslist.splice(index, 1);
					this.queryData.pic_ids.splice(index, 1);
				});
			},
			warExpireChange(e) {
				this.queryData.war_expire_dt = e ? "expired" : "";
			},
			needWarrantyChanged(e) {
				this.queryData.decision = e ? 3 : null;
			},
			//出库
			checkout() {
				this.$confirm("点击前请确认此退货已重回库存，已发货，或已废弃", "提示", {
						confirmButtonText: "Check Out",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						axios
							.post("checkout", {
								id: this.queryData.id
							})
							.then(e => {
								this.queryData.is_check_out = true;
								this.$message("checkout successed");
								//自动触发一次提交
								this.submitQueryData();
							});
					})
					.catch(() => {});
			},
			//取消出库
			instock(){
				this.$confirm("点击前请确认此退货需要重置check out状态", "提示", {
						confirmButtonText: "In Stock",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						axios
							.post("stockin", {
								id: this.queryData.id
							})
							.then(e => {
								this.queryData.is_check_out = false;
								this.$message("Instock successed");
								//自动触发一次提交
								this.submitQueryData();
							});
					})
					.catch(() => {});
			},
			//退款
			refund() {
				this.$prompt('请输入扣款比例', '操作确认', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputType: 'number', // 设置为数字输入框
					inputPlaceholder: '请输入扣款比例',
					inputValue: "0", // 默认值
					inputPattern: /^([0-9]|[1-9][0-9]|100)$/, // 验证1-100的正则
					inputValidator: (value) => {
						// 更详细的验证逻辑
						if (value === null || value === '') {
							return '请输入数值';
						}
						const num = parseInt(value);
						if (isNaN(num)) {
							return '请输入有效的整数';
						}
						if (num < 0 || num > 100) {
							return '请输入0到100之间的整数';
						}
						return true; // 验证通过
					},
					inputErrorMessage: '请输入0到100之间的整数',
					customClass: 'custom-prompt', // 自定义样式类
					beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
							// 再次验证输入值
							const value = instance.inputValue;
							const num = parseInt(value);
							if (isNaN(num) || num < 0 || num > 100) {
								this.$message.error('请输入有效的0-100整数');
								return false; // 阻止关闭
							}
							done();
						} else {
							done();
						}
					}
				}).then(({
					value
				}) => {
					const numValue = parseInt(value);
					axios
						.post("refund", {
							id: this.queryData.id,
						})
						.then(e => {
							this.queryData.is_refunded = true;
							this.queryData.refund_rate = value / 100
							this.$message("refund successed");
							//自动触发一次提交
							this.submitQueryData();
						});
				}).catch(() => {
					this.$message.info('操作已取消');
				});

			},
			reset() {
				this.$refs.dataform.resetFields();
			},
			submitQueryData() {
				this.loading = true;
				let data = this.queryData;
				if(this.queryData.decision>5){
					this.queryData.is_need_war = true
				}
				axios
					.post("createReturn", data)
					.then(e => {
						this.loading = false;
						if (!this.warrantyAccess) {
							this.$store.commit("clearTempPageAData"); // 如果是新增退货则清除缓存,重新拉取，保证列表一致性
						} else {
							this.$store.commit("setModifiedData", data)
						}
						this.goBack();
					})
					.catch(e => {
						console.log(e);
						this.loading = false;
					});
			},
			handleGlobalEnter(e) {
				// 1. 判断是否为ESC
				if (e.key == 'Escape') {
					this.goBack()
				}
			},
			defaultDate() {
				let date = this.queryData.created_at;
				let nowDate = dateFormat(new Date());
				return date ? date : nowDate;
			},
			async downloadPictures() {
				if (this.picslist.length === 0) {
					this.$message({
						message: "No photos available",
						type: "error"
					});
					return;
				}

				try {
					// 准备文件数据
					const files = {};

					for (const file of this.picslist) {
						const response = await fetch(file.url);
						if (!response.ok) throw new Error(`HTTP ${response.status}`);

						// 获取ArrayBuffer数据
						const arrayBuffer = await response.arrayBuffer();

						// 转换为Uint8Array
						const uint8Array = new Uint8Array(arrayBuffer);

						// 添加到文件对象
						files[`${this.queryData.rt_id}/${file.name}`] = uint8Array;
					}

					// 创建ZIP（不压缩）
					return new Promise((resolve, reject) => {
						zip(files, {
							level: 0
						}, (err, zipData) => {
							if (err) {
								reject(err);
								return;
							}

							// 创建Blob并下载
							const blob = new Blob([zipData], {
								type: 'application/zip'
							});
							saveAs(blob, `${this.queryData.rt_id}.zip`);
							resolve();
						});
					});
				} catch (error) {
					console.error("打包失败:", error);
					this.$message({
						message: "打包失败: " + error.message,
						type: "error"
					});
					throw error;
				}
			},
			autofill() {
				let content = this.autofillStr
				if (content == "") {
					return
				}
				const patterns = {
					order_id: /Order ID:\s*([A-Z0-9-]+)/,
					asin: /ASIN[\s\S]*?\n([A-Z0-9]{10})/,
					rt_track: /Tracking ID:\s*([A-Z0-9]+)/,
					model: /Sku[\s\S]+?(?:\n[^\n]*){9}\n([^\n]+)/,
					rt_qty: /Return Quantity[\s\S]*?\n(\d+)/,
					rt_dt: /Return Request Date:\s*(\d{4}-\d{2}-\d{2})/,
					reason: /Return Reason[\s\S]+?(?:\n[^\n]*){9}\n([^\n]+)/,
					cmt: /Customer’s Comment[\s\S]+?(?:\n[^\n]*){9}\n([^\n]+)/,
					cur_config: /Sku[\s\S]+?(?:\n[^\n]*){9}\n([^\n]+)/
				};

				const result = {};

				for (const [key, regex] of Object.entries(patterns)) {
					const match = content.match(regex);
					result[key] = match ? match[1].trim() : "";
				}

				result.rt_reason = `${result.reason} ${result.cmt}`;

				if (result.model) {
					let sku_split = result.model.split("-");
					for (let item of sku_split) {
						if (this.brands.includes(item)) {
							result.brand = item
						}
						if (item.length > 2 && this.seller.includes(item.slice(0, 3))) {
							result.seller = item.slice(0, 3)
						}
					}

					//检查有效性
					// let brand = sku_split[1];
					// if(this.brands.includes()){
					// 	result.brand = brand
					// }					
					// let seller = sku_split[0].slice(0,3);
					// if(this.seller.includes(seller)){
					// 	result.seller = seller
					// }
				}

				Object.assign(this.queryData, result);
			}
		}
	};
</script>

<style>
	.el-form-item__label {
		font-size: 18px !important;
		/* 修改字体大小 */
		font-weight: 600 !important;
	}

	.cancel_btn {
		position: absolute;
		padding: 0 !important;
		text-align: center;
		left: 5%;
		top: 0;
		width: 40px;
		height: 40px;
	}

	.title_card {
		font-size: 20px;
		font-weight: 700;
	}

	.el-checkbox__label {
		font-weight: 700 !important;
		/* 400=正常，700=加粗 */
	}

	/* 覆盖所有禁用状态下的文字颜色 */
	.el-form-item.is-disabled .el-form-item__label,
	.el-input.is-disabled .el-input__inner,
	.el-textarea.is-disabled .el-textarea__inner,
	.el-select.is-disabled .el-select__tags-text {
		color: #000000 !important;
		/* 自定义颜色 */
	}

	/* 单选框/复选框禁用状态 */
	.el-radio.is-disabled .el-radio__label,
	.el-checkbox.is-disabled.is-checked .el-checkbox__inner::after,
	.el-checkbox.is-disabled .el-checkbox__label {
		color: #000000 !important;
		border-color: #000000 !important;
	}

	.custom-prompt .el-message-box {
		width: 250px !important;
	}

	/* 在输入框右侧添加百分号 */
	.custom-prompt .el-message-box__input {
		position: relative;
		display: inline-block;
	}

	.custom-prompt .el-message-box__input::after {
		content: '%';
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		color: #606266;
		font-size: 14px;
		pointer-events: none;
	}

	/* 调整输入框内边距，避免文字被覆盖 */
	.custom-prompt .el-input__inner {
		padding-right: 30px !important;
	}

	.custom-prompt .el-input {
		width: 200px !important;
	}
</style>