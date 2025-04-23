<template>
	<div style="position: relative;">
		<h2>新增退货</h2>
		<div style="text-align: left; margin:0 5%">
			<span style="font-size: 20px;">Return ID: {{queryData.rt_id?queryData.rt_id:"提交后生成"}}</span>
			<el-card>
				<div class="title_card" slot="header">
					<span>General Information</span>
				</div>
				<el-form inline :model="queryData">
					<el-form-item label="Return Tracking:">
						<el-input v-model="queryData.rt_track"></el-input>
					</el-form-item>
					<el-form-item label="Label Type:">
						<el-select v-model="queryData.lb_type">
							<el-option label="Amazon" value="Amazon"></el-option>
							<el-option label="Warehouse" value="Warehouse"></el-option>
							<el-option label="Customer" value="Customer"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="Order#:">
						<el-input v-model="queryData.order_id"></el-input>
					</el-form-item>
					<el-form-item label="Store:">
						<el-autocomplete v-model="queryData.seller" :fetch-suggestions="querySearch"></el-autocomplete>
					</el-form-item>
					<el-form-item label="Operator:">
						<el-input v-model="queryData.creator" placeholder="Mia"></el-input>
					</el-form-item>
					<el-form-item label="Returned On:">
						<el-date-picker type="date" :value-format="dateFormat" v-model="queryData.rt_dt"></el-date-picker>
					</el-form-item>
					<el-form-item label="Received On:">
						<el-date-picker type="date" :value-format="dateFormat" v-model="queryData.rec_dt"></el-date-picker>
					</el-form-item>
					<el-form-item label="Processed On:">
						<el-date-picker type="date" :value-format="dateFormat" v-model="queryData.proc_dt"></el-date-picker>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card style="margin-top: 20px;">
				<div class="title_card" slot="header">
					<span>Return Item Details</span>
				</div>
				<el-form inline :model="queryData">
					<el-form-item label="Brand:">
						<el-select placeholder="" v-model="queryData.brand">
							<el-option v-for="(item,index) in brands" :key="index" :label="item"
								:value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="Model:">
						<el-input v-model="queryData.model" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="UPC:">
						<el-input v-model="queryData.upc" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="SN:">
						<el-input v-model="queryData.sn" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="Current Config:">
						<el-input style="width: 280px;" v-model="queryData.cur_config"></el-input>
					</el-form-item>
				</el-form>
				<el-form inline :model="queryData">
					<el-form-item style="width: 45%;" label="Condition Notes:">
						<el-input style="width: 250%;" type="textarea" autosize v-model="queryData.rt_cmt"></el-input>
					</el-form-item>
					<el-form-item label="Comments for service:">
						<el-input style="width: 250%;" type="textarea" autosize
							v-model="queryData.rt_cmt_cs"></el-input>
					</el-form-item>
				</el-form>
				<el-form inline>
					<el-form-item style="width: 45%;" label="Return Reason:">
						<el-input style="width: 250%;" type="textarea" autosize
							v-model="queryData.rt_reason"></el-input>
					</el-form-item>
					<el-form-item label="Quantity:">
						<el-input type="number" v-model="queryData.rt_qty"></el-input><!--  -->
					</el-form-item>
				</el-form>
				<div style="margin-top: 20px; margin-left: 10%; transform: scale(1.2);">
					<el-checkbox v-model="queryData.is_need_war" @change="needWarrantyChanged">Need Repair</el-checkbox>
					<el-checkbox v-model="queryData.is_fraud">Fraud Return</el-checkbox>
					<el-checkbox v-model="queryData.is_junk">Junk / Parts</el-checkbox>
				</div>
			</el-card>

			<el-card v-if="warrantyAccess" style="margin-top: 20px;">
				<div class="title_card" slot="header">
					<span>Warranty Repair</span>
				</div>
				<el-form inline :model="queryData">
					<el-form-item label="Expire On:">
						<el-date-picker :value-format="dateFormat" type="date" :disabled="queryData.war_expired"
							v-model="queryData.war_expire_dt"></el-date-picker>
						<el-checkbox style="margin-left: 10px; transform:scale(1.2);"
							v-model="queryData.war_expired">expired</el-checkbox>
					</el-form-item>
					<el-form-item style="margin-left: 20px;" label="Warranty Operator:">
						<el-input v-model="queryData.war_opr"></el-input>
					</el-form-item>
					<el-form-item label="Repair Method:">
						<el-select v-model="queryData.war_method">
							<el-option label="Factory" value="Factory"></el-option>
							<el-option label="Warehouse" value="Warehouse"></el-option>
						</el-select>
					</el-form-item>
				</el-form>

				<el-form inline :model="queryData">
					<el-form-item label="Outbound Tracking:">
						<el-input v-model="queryData.war_track_out"></el-input>
					</el-form-item>
					<el-form-item label="Inbound Tracking:">
						<el-input v-model="queryData.war_track_in"></el-input>
					</el-form-item>
					<el-form-item label="Date:">
						<el-date-picker :value-format="dateFormat" type="date" v-model="queryData.war_dt"></el-date-picker>
					</el-form-item>
					<el-form-item label="Case#:">
						<el-input v-model="queryData.war_case"></el-input>
					</el-form-item>
				</el-form>
				<el-form inline :model="queryData">
					<el-form-item label="Warranty Comments:">
						<el-input style="width: 250%;" type="textarea" autosize v-model="queryData.war_cmt"></el-input>
					</el-form-item>
				</el-form>
			</el-card>


			<el-card style="margin-top: 20px;">
				<div class="title_card" slot="header">
					<span>Pictures</span>
				</div>
				<el-upload ref="upload" style="width: 50%;" list-type="picture" drag multiple :http-request="upload"
					:on-remove="picRemove">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
				</el-upload>
				<!-- <el-button type="primary" @click="uploadtest">上传</el-button> -->
			</el-card>

			<div style="padding: 40px;">
				<el-form inline :model="queryData">
					<el-form-item label="Decision:">
						<el-select placeholder="" v-model="queryData.decision">
							<el-option label="Sell as new" :value="1"></el-option>
							<el-option label="Used: Good" :value="2"></el-option>
							<el-option label="Repair needed" :value="3"></el-option>
							<el-option label="Junk for parts" :value="4"></el-option>
							<el-option label="Pending Decision" :value="5"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button style="" type="primary" @click="submitQueryData">Submit</el-button>
					</el-form-item>
					<el-form-item style="margin-left: 100px;">
						<el-button style="" type="success" @click="checkout">Check Out</el-button>
						<!-- 点击前请确认此退货已重回库存，已发货，或已废弃 新增 is_checked_out  is_refunded -->
					</el-form-item>
					<el-form-item style="margin-left: 100px;">
						<el-button style="" type="success" @click="refund">Refund</el-button>
						<!-- 点击前请确认此退货已重回库存，已发货，或已废弃 新增 is_checked_out  is_refunded -->
					</el-form-item>
				</el-form>
			</div>
		</div>
		<el-button type="danger" class="cancel_btn" @click="goBack">X</el-button>
	</div>
</template>

<script>
	import axios from "axios";
	import COS from "cos-js-sdk-v5";
	export default {
		data() {
			return {
				brands: ["HP", "LENOVO", "DELL", "ACER", "ASUS", "MSI", "LG", "SAMSUNG", "INTEL"],
				seller: ["ONT", "COU", "VNE", "IVY", "RTC", "HLT", "ROB", "DAS", "ETS", "KLT", "GFA", "WWC", "CHILL_AU"],
				// queryData: {},
				warrantyAccess: true, //是否从warranty进入
				fileList: [],
				uploadCos: null,
				dateFormat:"yyyy-MM-dd",
				queryData: {
					brand: "LENOVO",
					creator: "XT",
					cur_config: "fa312312312",
					decision: 3,
					is_need_war: true,
					lb_type: "Warehouse",
					model: "f123123",
					order_id: "fasdf123123",
					proc_dt: "2025-04-22T16:00:00.000Z",
					rec_dt: "2025-04-29T16:00:00.000Z",
					rt_cmt: "asdasdasdasdasdasd",
					rt_cmt_cs: "asdasdasdasdasdasd",
					rt_dt: "2025-04-16T16:00:00.000Z",
					rt_qty: "2",
					rt_reason: "asdasdasdasdasd",
					rt_track: "123123",
					seller: "VNE",
					sn: "asdfasdfasdf",
					upc: "r12312312",
				}
			}
		},
		created() {
			this.uploadCos = new COS({
				
			})
			let query = this.$router.currentRoute.query
			//是否从warranty进入编辑
			if (Object.keys(query).length !== 0) {
				this.warrantyAccess = query.warrantyAccess
				this.queryData = query.data
			}

		},
		methods: {
			goBack() {
				this.$router.back();
			},
			querySearch(query, cb) {
				let res = []
				for (let seller of this.seller) {
					res.push({
						value: seller
					})
				}
				cb(res)
			},
			picRemove(file) {
				let filename = file.name
				let temp = this.fileList
				this.fileList = temp.filter(item => item.name !== filename);
			},
			upload(file) {
				let param = {
					Bucket: "pic-bucket-1317637543",
					Region: "ap-beijing",
					Key: file.file.name,
					Body: file.file
				}
				this.uploadCos.uploadFile(param).then((e) => {
					console.log(e)
					let filename = e.Key
					let fileLocation = `Https://${e.Location}`
					this.fileList.push({
						name: filename,
						url: fileLocation
					})
				})

			},
			uploadtest() {
				console.log(this.fileList)
			},
			needWarrantyChanged(e) {
				this.queryData.decision = e ? 3 : null
			},
			//出库
			checkout() {
				this.$confirm("点击前请确认此退货已重回库存，已发货，或已废弃", '提示', {
					confirmButtonText: "Check Out",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {

				}).catch(() => {

				})
			},
			//退款
			refund() {
				this.$confirm("点击前请确认此退货已退款", '提示', {
					confirmButtonText: "Refunded",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {

				}).catch(() => {

				})
			},
			submitQueryData() {
				let data = this.queryData;
				axios.post("createReturn", data).then((e) => {
					console.log(e)
				}).catch((e) => {
					console.log(e)
				})
			}
		}
	}
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
</style>