<template>
	<div style="position: relative;">
		<h2>新增退货</h2>
		<div style="text-align: left; margin:0 5%">
			<el-card>
				<div class="title_card" slot="header">
					<span>Order Information</span>
				</div>
				<el-form inline :model="queryData">
					<el-form-item label="Return Tracking:">
						<el-input v-model="queryData.rt_track"></el-input>
					</el-form-item>
					<el-form-item label="RMA:">
						<el-input v-model="queryData.rma"></el-input>
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
					<el-form-item label="Current Config">
						<el-input style="width: 280px;" v-model="queryData.cur_config"></el-input>
					</el-form-item>
				</el-form>
				<el-form inline :model="queryData">
					<el-form-item style="width: 45%;" label="Condition Notes:">
						<el-input style="width: 250%;" type="textarea" autosize v-model="queryData.cmt"></el-input>
					</el-form-item>
					<el-form-item label="Comments for service:">
						<el-input style="width: 250%;" type="textarea" autosize v-model="queryData.cmt_cs"></el-input>
					</el-form-item>
				</el-form>
				<el-form inline>
					<el-form-item label="Return Reason:">
						<el-input style="width: 250%;" type="textarea" autosize
							v-model="queryData.rt_reason"></el-input>
					</el-form-item>
				</el-form>
				<!-- <el-checkbox-group style="margin-top: 20px; margin-left: 100px; transform: scale(1.2);" @change="checkChange"> -->
				<div style="margin-top: 20px; margin-left: 10%; transform: scale(1.2);">
					<el-checkbox v-model="queryData.is_need_war" @change="needWarrantyChanged">需要质保</el-checkbox>
					<el-checkbox v-model="queryData.is_replaced">被换机</el-checkbox>
					<el-checkbox v-model="queryData.is_junk">垃圾</el-checkbox>
				</div>
					
				<!-- </el-checkbox-group> -->
			</el-card>

			<!-- <el-checkbox style="margin-top: 20px; margin-left: 10px; transform: scale(1.2);"
				v-model="isNeedWarranty">Need Warranty</el-checkbox> -->
			<!-- <el-card v-if="isNeedWarranty" style="margin-top: 20px;">
				<div slot="header">
					<span>质保</span>
				</div>
				<el-form inline :model="queryData">
					<el-form-item label="Warranty Tracking:">
						<el-input v-model="queryData.war_track"></el-input>
					</el-form-item>
					<el-form-item label="Warranty Case:">
						<el-input v-model="queryData.war_case"></el-input>
					</el-form-item>
					<el-form-item label="Warranty Status:">
						<el-select :v-model="queryData.war_sta">
							<el-option label="wait box/label" value="1"></el-option>
							<el-option label="shipped" value="2"></el-option>
							<el-option label="complete" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="Warranty Ship Date:">
						<el-date-picker v-model="queryData.war_ship_date" type="date"></el-date-picker>
					</el-form-item>
					<el-form-item label="Warranty Back Date:">
						<el-date-picker v-model="queryData.war_back_date" type="date"></el-date-picker>
					</el-form-item>
					<el-form-item label="Operator:">
						<el-input v-model="queryData.war_opr"></el-input>
					</el-form-item>
				</el-form>
				<el-form inline :model="queryData">
					<el-form-item label="Warranty Comment:">
						<el-input style="width: 250%;" type="textarea" autosize v-model="queryData.war_cmt"></el-input>
					</el-form-item>
				</el-form>
			</el-card> -->
			<el-card style="margin-top: 20px;">
				<div class="title_card" slot="header">
					<span>Pictures</span>
				</div>
				<el-upload
				  drag
				  action="https://jsonplaceholder.typicode.com/posts/"
				  multiple>
				  <i class="el-icon-upload"></i>
				  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
				</el-upload>
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
						<el-button style="width: 250%;" type="primary" >提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<el-button type="danger" class="cancel_btn" @click="goBack">X</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				brands: ["HP", "LENOVO", "DELL", "ACER", "ASUS", "MSI", "LG", "SAMSUNG", "INTEL"],
				seller: ["ONT", "COU", "VNE", "IVY", "RTC", "HLT", "ROB", "DAS", "ETS", "KLT", "GFA", "WWC", "CHILL_AU"],
				queryData: {},
				isNeedWarranty: true,
				test: []
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
			checkChange(e){
				console.log(e)
			},
			needWarrantyChanged(e){
				
				this.queryData.decision = e?3:null
				
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
	.title_card{
		font-size: 20px;
		font-weight: 700;
	}
</style>