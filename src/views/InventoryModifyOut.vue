<template>
	<div class="about">
		<my-navi activeIndex="13"></my-navi>
		<el-container>
			<el-header>
				<el-upload :on-change="loadFile" :before-upload="fileCheck" :show-file-list='false' accept=".txt">
					<el-button slot="trigger" size="small" type="primary">上传库存报告</el-button>
					<el-label style="margin-left:10px;">{{filename}}</el-label>
				</el-upload>
				<el-input style="width: 70%; margin-left:10px" v-model="searchTerm"
					@keypress.enter.native="performSearch"></el-input>
				<el-button style="margin-left: 20px; width: 5%;" type="primary" @click="performSearch">搜索</el-button>
			</el-header>
			<el-main>
				<el-row type="flex" justify="space-around">
					<el-col :span="11">
						<el-row type="flex" justify="space-between" style="padding-bottom: 20px;">
							<div>
								<el-button @click="clearSerchresult">清空</el-button>
								<el-button style="margin-left: 10px;" @click="outOfStock()">下架</el-button>
								<el-button style="margin-left: 10px;" @click="outOfStock(1)">保留1</el-button>
								<el-input v-model="priceFlow" type="number" style="width: 30%; margin-left: 10px;"
									placeholder="价格浮动" @keypress.enter.native="priceFlowAction"></el-input>
								<el-button :disabled="priceFlowDisable" type="primary"
									@click="priceFlowAction">调价</el-button>
							</div>
							<div>
								<el-button style="margin-left: 10px;" @click="pushToResult">加入结果队列>></el-button>
							</div>
						</el-row>
						<el-row>
							<el-table :data="serchData">
								<el-table-column prop="sku" label="SKU"></el-table-column>
								<el-table-column prop="price" label="价格" width="200"></el-table-column>
								<el-table-column label="数量" width="200">
									<template slot-scope="scope">
										<el-input v-model="scope.row.quantity"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="150">
									<template slot-scope="scope">
										<el-button size="mini" type="danger"
											@click="searchDataDeleteHandle(scope.$index, scope.row)">
											删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-row>
					</el-col>
					<el-col :span="11">
						<el-row type="flex" justify="space-between" style="padding-bottom: 20px;">
							<el-button @click="pushBack">撤回到上一次</el-button>
							<el-button type="primary" @click="outPutText">导出TXT</el-button>
						</el-row>
						<el-row>
							<el-table :data="finalData" :row-style="markDistrict">
								<el-table-column prop="sku" label="SKU"></el-table-column>
								<el-table-column prop="price" label="价格" width="200"></el-table-column>
								<el-table-column prop="quantity" label="数量" width="200"></el-table-column>
								<el-table-column label="操作" width="150">
									<template slot-scope="scope">
										<el-button size="mini" type="danger"
											@click="finalDataDeleteHandle(scope.$index, scope.row)">
											删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-row>
					</el-col>
				</el-row>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	// import axios from 'axios';
	export default {
		data() {
			return {
				fileContent: null,
				searchTerm: "",
				serchData: [],
				tempData: [],
				finalData: [],
				priceFlow: "",
				priceFlowDisable: false,
				filename: "",
				//分区flag
				districtFlag:0
			}
		},
		methods: {
			loadFile(file) {
				const isText = file.type === 'text/plain' || file.name.endsWith('.txt');
				if (!isText) return;
				this.filename = file.raw.name
				this.readFileContent(file)
			},
			fileCheck(file) {
				const isText = file.type === 'text/plain' || file.name.endsWith('.txt');
				if (!isText) {
					this.$message.error('只能上传文本文件 (.txt)');
				}
				return false;
			},
			readFileContent(file) {
				const reader = new FileReader();

				reader.onload = (e) => {
					this.fileContent = e.target.result;
					this.$message.success('文件内容已加载');
				};

				reader.onerror = () => {
					this.$message.error('文件读取失败');
				};
				reader.readAsText(file.raw);
			},
			parseLine(line) {
				const parts = line.split('\t');
				// 确保有三部分数据
				if (parts.length < 3) return null;
				const sku = parts[0].trim();
				const pricePart = parts[2].trim();
				const quantityPart = parts[3].trim();
				// 转换价格（支持整数和小数）
				let price;
				// 尝试转换为浮点数
				price = parseFloat(pricePart);
				// 如果转换失败，尝试移除逗号后再转换
				if (isNaN(price)) {
					const cleanedPrice = pricePart.replace(/,/g, '');
					price = parseFloat(cleanedPrice);
				}
				if (isNaN(price)) {
					console.warn(`价格格式不符合预期: ${pricePart}`);
					return null;
				}
				// 转换数量
				const quantity = parseInt(quantityPart, 10);
				if (isNaN(quantity)) {
					console.warn(`数量格式不符合预期: ${quantityPart}`);
					return null;
				}
				return {
					sku,
					quantity,
					price,
					rawLine: line.trim()
				}; /*  */
			},
			performSearch() {
				if (!this.fileContent || !this.searchTerm) {
					this.$message({
						duration: 5000,
						type: "error",
						message: "未加载库存报告或未填写搜索词",
						customClass: 'big-font-size'
					})
					return;
				}

				const results = [];
				const lines = this.fileContent.split('\n');

				lines.forEach((line) => {
					let sku = line.split("\t")[0]
					if (sku.toLowerCase().includes(this.searchTerm.toLowerCase())) {
						const parsed = this.parseLine(line);
						if (parsed) results.push(parsed);
					}
				});
				this.serchData = results;
				this.priceFlowDisable = false;
			},
			clearSerchresult() {
				this.serchData = [];
				this.tempData = [];
				this.priceFlow = "";
				this.priceFlowDisable = false;
			},
			outOfStock(qty = 0) {
				let newAry = [];
				this.serchData.forEach(item => {
					let temp = {
						...item
					};
					temp.quantity = qty;
					newAry.push(temp);
				})
				this.serchData = newAry;
			},
			priceFlowAction() {
				if (this.priceFlow == "") return;
				this.priceFlowDisable = true;
				let newAry = [];
				this.serchData.forEach(item => {
					let temp = {
						...item
					};
					temp.price = parseFloat(temp.price) + parseFloat(this.priceFlow)
					newAry.push(temp);
				})
				this.serchData = newAry;
			},
			pushBack() {
				if(this.finalData.length != this.tempData.length){
					this.districtFlag -= 1;
				}
				this.finalData = [...this.tempData]
			},
			pushToResult() {
				this.tempData = [...this.finalData];
				this.serchData.forEach(item => {
					let temp = {...item}
					temp.flag = parseInt(this.districtFlag.toString());
					this.finalData.push(temp);
				})
				this.districtFlag +=1;
				this.clearSerchresult();
			},
			outPutText() {
				if (this.finalData.length == 0) return;
				let context =
					"sku\tprice\tminimum-seller-allowed-price\tmaximum-seller-allowed-price\tquantity\thandling-time\tfulfillment-channel\n";
				this.finalData.forEach(item => {
					let sku_str = item.sku + "\t";
					let price_str = item.price + "\t";
					let minprice_str = (parseFloat(item.price) / 2).toString() + "\t";
					let maxprice_str = (parseFloat(item.price) + 1000).toString() + "\t";
					let qty_str = item.quantity + "\t";
					let block_str = "\t\t\n"
					context += sku_str + price_str + minprice_str + maxprice_str + qty_str + block_str
				})
				const blob = new Blob([context], {
					type: 'text/plain'
				});
				// 创建下载URL
				const url = URL.createObjectURL(blob);
				// 创建虚拟下载链接
				const link = document.createElement('a');
				link.href = url;
				link.download = "下架调价.txt";
				link.style.display = 'none';

				// 添加到DOM
				document.body.appendChild(link);

				// 触发下载
				link.click();
			},
			searchDataDeleteHandle(index, row){
				this.serchData.splice(index,1);
			},
			finalDataDeleteHandle(index, row){
				this.finalData.splice(index,1);
				if(this.finalData.length == this.tempData.length){
					this.districtFlag -= 1;
				}
			},
			markDistrict({
				row,index
			}){
				let style = {};
				if(row.flag % 2 ==0){
					style.backgroundColor = "white"
				}else{
					style.backgroundColor = "#dddddd"
				}
				return style;
			}
		}
	}
</script>

<style>
	.big-font-size {
		font-size: 30px !important;
	}
</style>