<template>
	<div class="home">
		<h2>Amazon Listing 辅助工具</h2>
		<div class=""></div>
		<el-row :gutter="0">
			<el-col>
				<div style="text-align: left;">基本配置信息(Title):</div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="3">
				<el-input v-model="pc.manufacture" placeholder="Lenovo">
					<template slot="prepend">品牌</template>
				</el-input>
			</el-col>

			<el-col :span="5">
				<el-input v-model="pc.series" placeholder="IdeaPad3">
					<template slot="prepend">系列</template>
				</el-input>
			</el-col>

			<el-col :span="5">
				<el-input v-model="pc.pctype" placeholder="Home and business laptop">
					<template slot="prepend">机型</template>
				</el-input>
			</el-col>

			<el-col :span="4">
				<el-input v-model="pc.cpu" placeholder="i5 1065G7">
					<template slot="prepend">CPU</template>
				</el-input>
			</el-col>
			<el-col :span="3">
				<el-input v-model="pc.cpu_cores" placeholder="4">
					<template slot="prepend">核心数</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-input v-model="pc.screen_size" placeholder="15">
					<template slot="prepend">显示器尺寸(整数)</template>
				</el-input>
			</el-col>
			
		</el-row>
		<!--------------------- 分割线 -------------------------->
		<el-row :gutter="20">
			<el-col :span="7">
				<el-input v-model="pc.screen" placeholder="15.6' FHD Touch Ips">
					<template slot="prepend">显示器Title</template>
				</el-input>
			</el-col>
			<el-col :span="6">
				<el-input v-model="pc.graphics" placeholder="Intel UHD Graphics">
					<template slot="prepend">显卡</template>
				</el-input>
			</el-col>

			<el-col :span="4">
				<el-input v-model="pc.color">
					<template slot="prepend">颜色</template>
				</el-input>
			</el-col>

			<el-col :span="5">
				<el-input v-model="pc.model">
					<template slot="prepend">Model</template>
				</el-input>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="3" style="text-align: left;">
				<el-select v-model="pc.for_free">
					<el-option label="w/RE Accessories" :value="0"></el-option>
					<el-option label="Ontrend 32G USB" :value="1"></el-option>
					<el-option label="不送" :value="2"></el-option>
				</el-select>
			</el-col>
			<el-col :span="2" style="text-align: left;">
				<el-select v-model="pc.dvd">
					<el-option label="No-DVD" value="No-DVD"></el-option>
					<el-option label="DVD Writer" value="DVD Writer"></el-option>
				</el-select>
			</el-col>
		</el-row>

		<el-row :gutter="0">
			<el-col>
				<div style="text-align: left;">Title附加信息:</div>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="4" v-for="(item,index) in pc.title_addition" :key="index">
				<el-input v-model="pc.title_addition[index]">
					<template slot="prepend">附加{{index+1}}</template>
					<el-button slot="append" type="danger" icon="el-icon-delete" circle
						@click="title_addition_remove(index)"></el-button>
				</el-input>
			</el-col>
			<el-col :span="1" style="text-align: left;">
				<el-button type="primary" @click="title_addition_add()">新增<i class="el-icon-circle-plus"></i>
				</el-button>
			</el-col>
		</el-row>
		
		<el-divider></el-divider>

		<el-row :gutter="0">
			<el-col>
				<div style="text-align: left;">描述语:</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col>
				<el-input v-model="descriptions.cpu_description">
					<template slot="prepend">CPU描述语</template>
				</el-input>
			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<el-input v-model="descriptions.screen_description">
					<template slot="prepend">屏幕描述语</template>
				</el-input>
			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<el-input v-model="descriptions.graphics_description">
					<template slot="prepend">显卡描述语</template>
				</el-input>
			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<el-input v-model="descriptions.size_description">
					<template slot="prepend">尺寸重量描述</template>
				</el-input>
			</el-col>
		</el-row>
		
		<el-row>
			<el-col>
				<el-input v-model="descriptions.connectivity_description">
					<template slot="prepend">Connectivity描述</template>
				</el-input>
			</el-col>
		</el-row>
		
		<el-row>
			<el-col>
				<el-input v-model="descriptions.solt_description">
					<template slot="prepend">插槽接口描述</template>
				</el-input>
			</el-col>
		</el-row>
		
		<el-row>
			<el-col>
				<el-input v-model="descriptions.battery_description">
					<template slot="prepend">电池续航描述</template>
				</el-input>
			</el-col>
		</el-row>
		
		<el-row>
			<el-col>
				<el-input v-model="descriptions.keyboard_description">
					<template slot="prepend">键盘描述</template>
				</el-input>
			</el-col>
		</el-row>
		
		<el-row>
			<el-col>
				<el-input v-model="descriptions.camera_description">
					<template slot="prepend">摄像头描述</template>
				</el-input>
			</el-col>
		</el-row>
		
		<!--------------------- 分割线 -------------------------->
		
		<el-row :gutter="0">
			<el-col>
				<div style="text-align: left;">Base 配置:</div>
			</el-col>
		</el-row>
		
		<el-row :gutter="20">
			<el-col :span="4">
				<el-input v-model="base.ram_size">
					<template slot="prepend">内存</template>
					<template slot="append">GB</template>
				</el-input>
			</el-col>
			
			<el-col :span="6" style="text-align: left;">
				<el-select style="width: 220px;" v-model="base.system">
					<el-option label="Windows10 Home" :value="0"></el-option>
					<el-option label="Windows10 Professional" :value="1"></el-option>
					<el-option label="Windows10 in S model" :value="2"></el-option>
				</el-select>
			</el-col>
		</el-row>
		
		<el-row :gutter="20">
			<el-col :span="1">
				<template>硬盘:</template>
			</el-col>
			<el-col :span="6" v-for="(item,index) in base.disks" :key="index">
				<el-input v-model="base.disks[index].size">
					<el-select v-model="item.type" slot="prepend" placeholder="请选择">
						<el-option label="M.2 SSD" value="M.2 SSD"></el-option>
						<el-option label="HDD" value="HDD"></el-option>
						<el-option label="PCIe SSD" value="PCIe SSD"></el-option>
						<el-option label="NVMe SSD" value="NVMe SSD"></el-option>
						<el-option label="sata SSD" value="sata SSD"></el-option>
					</el-select>
					<el-select style="margin-right: 10px;" v-model="item.unit" slot="append" placeholder="请选择">
						<el-option label="GB" value="GB"></el-option>
						<el-option label="TB" value="TB"></el-option>
					</el-select>
					<el-button slot="append" type="danger" icon="el-icon-delete" circle
						@click="base_disk_remove(index)"></el-button>
				</el-input>
			</el-col>
			<el-col :span="1" style="text-align: left;">
				<el-button type="primary" @click="base_disk_add()">增加硬盘<i class="el-icon-circle-plus"></i>
				</el-button>
			</el-col>
		</el-row>
		<el-divider></el-divider>
		<!--------------------- 分割线 -------------------------->

		<div style="text-align: left; font-size: 25px; font-weight: 500;">Variation:</div>

		<div v-for="(item,index) in variations" :key="index">
			<el-row :gutter="20">
				<el-col :span="4">
					<el-input v-model="variations[index].ram_size">
						<template slot="prepend">内存</template>
						<template slot="append">GB</template>
					</el-input>
				</el-col>
				
				<el-col :span="6" style="text-align: left;">
					<el-select style="width: 220px;" v-model="item.system">
						<el-option label="Windows10 Home" :value="0"></el-option>
						<el-option label="Windows10 Professional" :value="1"></el-option>
						<el-option label="Windows10 in S model" :value="2"></el-option>
					</el-select>
				</el-col>
				
				<el-col style="text-align: left;" :span="3">
					<el-button type="danger" icon="el-icon-delete" circle @click="variation_remove(index)"></el-button>
				</el-col>
				
			</el-row>
			
			<el-row :gutter="20">
				<el-col :span="1">
					<template>硬盘:</template>
				</el-col>
				<el-col :span="6" v-for="(item_disk,idx) in item.disks" :key="idx">
					<el-input v-model="variations[index].disks[idx].size">
						<el-select v-model="item_disk.type" slot="prepend" placeholder="请选择">
							<el-option label="M.2 SSD" value="M.2 SSD"></el-option>
							<el-option label="HDD" value="HDD"></el-option>
							<el-option label="PCIe SSD" value="PCIe SSD"></el-option>
							<el-option label="NVMe SSD" value="NVMe SSD"></el-option>
							<el-option label="sata SSD" value="sata SSD"></el-option>
						</el-select>
						<el-select style="margin-right: 10px;" v-model="item_disk.unit" slot="append" placeholder="请选择">
							<el-option label="GB" value="GB"></el-option>
							<el-option label="TB" value="TB"></el-option>
						</el-select>
						<el-button slot="append" type="danger" icon="el-icon-delete" circle
							@click="variation_disk_remove(index,idx)"></el-button>
					</el-input>
				</el-col>
				<el-col :span="1" style="text-align: left;">
					<el-button type="primary" @click="variation_disk_add(index)">增加硬盘<i class="el-icon-circle-plus"></i>
					</el-button>
				</el-col>
			</el-row>
			<el-divider></el-divider>
		</div>
		<el-button type="primary" @click="variation_add()">新增variation <i class="el-icon-circle-plus"></i></el-button>
		
		<!-------------------------- 分割线 -------------------------->
		
		<div>
			<el-button style="margin-top: 3rem; width: 250px;" type="success" round @click="variation_generate()"> 生成listing </el-button>
		</div>
		<div style="text-align: left; font-size: 20px; font-weight: 500; margin-bottom: 20px;">
			SKU:
			<el-button class="copy_sku" type="primary" plain :data-clipboard-text="sku_copy_str" @click="copy_sku()">复制文本</el-button>
		</div>
		<div>
			<el-row :gutter="20" v-for="(item,index) in skus" :key="index">
				<el-input
					v-model="skus[index]"
					maxlength="40"
					show-word-limit>
					<template slot="prepend">{{index==0?'Base':'variation' + index}}</template>
				</el-input>
			</el-row>
		</div>
		
		<div style="text-align: left; font-size: 20px; font-weight: 500; margin-bottom: 20px;">
			Title:
			<el-button class="copy_title" type="primary" plain :data-clipboard-text="title_copy_str" @click="copy_title()">复制文本</el-button>
		</div>
		<div>
			<el-row :gutter="20" v-for="(item,index) in titles" :key="index">
				<el-input
					v-model="titles[index]"
					maxlength="200"
					show-word-limit>
					<template slot="prepend">{{index==0?'Base':'variation' + index}}</template>
				</el-input>
			</el-row>
		</div>
		
		<div style="text-align: left; font-size: 20px; font-weight: 500; margin-bottom: 20px;">
			Bullet(1,3,4):
		</div>
		<div>
			<el-row :gutter="20">
				<el-input
					v-model="bullet_1">
					<template slot="prepend">Bullet_point1</template>
				</el-input>
			</el-row>
			<el-row :gutter="20">
				<el-input
					v-model="bullet_3">
					<template slot="prepend">Bullet_point3</template>
				</el-input>
			</el-row>
			<el-row :gutter="20">
				<el-input
					v-model="bullet_4">
					<template slot="prepend">Bullet_point4</template>
				</el-input>
			</el-row>
		</div>
		
		<div style="text-align: left; font-size: 20px; font-weight: 500; margin-bottom: 20px;">
			Bullet_2:
			<el-button class="copy_bullet_2" type="primary" plain :data-clipboard-text="bullet_2_copy_str" @click="copy_bullet_2()">复制文本</el-button>
		</div>
		<el-row :gutter="20" v-for="(item,index) in bullet_2" :key="index">
			<el-input
				v-model="bullet_2[index]">
				<template slot="prepend">variation_{{index+1}}</template>
			</el-input>
		</el-row>
		
		<div style="text-align: left; font-size: 20px; font-weight: 500; margin-bottom: 20px;">
			Bullet_5:
						<el-button class="copy_bullet_5" type="primary" plain :data-clipboard-text="bullet_5_copy_str" @click="copy_bullet_5()">复制文本</el-button>
		</div>
		<el-row :gutter="20" v-for="(item,index) in bullet_5" :key="index">
			<el-input
				v-model="bullet_5[index]">
				<template slot="prepend">variation_{{index+1}}</template>
			</el-input>
		</el-row>
		
		
		<div style="text-align: left; font-size: 20px; font-weight: 500; margin-bottom: 20px;">
			HTML_Descriptions:
		</div>
		<el-row :gutter="20" v-for="(item,index) in html_descriptions" :key="index">
			<el-input
				v-model="html_descriptions[index]">
				<template slot="prepend">variation_{{index+1}}</template>
			</el-input>
		</el-row>
	</div>
</template>

<script>
	import Clipboard from "clipboard"
	export default {
		name: "Home",
		data() {
			return {
				pc: {
					manufacture: "",
					series: "",
					pctype: "",
					graphics: "",
					cpu: "",
					cpu_cores:"",
					screen_size:"",
					screen: "",
					color: "",
					model: "",
					for_free: 0, //0 RE3  1 USB 2 不送
					title_addition: [],
					dvd:"No-DVD"
				},
				descriptions: {
					cpu_description: "",
					screen_description: "",
					graphics_description: "",
					connectivity_description: "",
					solt_description: "",
					size_description: "",
					battery_description:"",
					keyboard_description:"",
					camera_description:""
				},
				base:{
					ram_size:"",
					system:0,
					disks:[]
				},
				variations: [],
				//sku
				skus:[],
				//title
				titles:[],
				//customization
				customization:[],
				//size
				size_names:[],
				//bullet
				bullet_1:"",
				bullet_2:[],
				bullet_3:"",
				bullet_4:"",
				bullet_5:[],
				
				//descriptions
				html_descriptions:[],
				
				//复制文本
				sku_copy_str:"",
				title_copy_str:"",
				bullet_2_copy_str:""
			}
		},
		methods: {
			title_addition_add() {
				this.pc.title_addition.push("");
			},
			title_addition_remove(index) {
				this.pc.title_addition.splice(index, 1);
			},
			base_disk_add(){
				this.base.disks.push({
					size:"",
					type:"M.2 SSD",
					unit:"GB"
				});
			},
			base_disk_remove(index){
				this.base.disks.splice(index,1);
			},
			//variation 硬盘
			//index 上级索引
			variation_disk_remove(index,idx){
				var vari = this.variations[index];
				vari.disks.splice(idx,1);
			},
			variation_disk_add(index){
				var vari = this.variations[index];
				vari.disks.push({
					size:"",
					type:"M.2 SSD",
					unit:"GB"
				});
			},
			variation_remove(index){
				this.variations.splice(index,1);
			},
			variation_add(){
				this.variations.push({
					ram_size:"",
					system:0,
					disks:[]
				});
			},
			
			data_reset(){
				this.skus = [];
				this.titles = [];
				this.customization = [];
				//size
				this.size_names = [];
				//bullet
				this.bullet_1 = "";
				this.bullet_2 = [];
				this.bullet_3 = "";
				this.bullet_4 = "";
				this.bullet_5 = [];
				//descriptions
				this.html_descriptions = [];
				//复制文本
				this.sku_copy_str = "";
				this.title_copy_str = "";
				this.bullet_2_copy_str = "";
			},
			get_cur_year(){
				var now = new Date();
				return now.getFullYear();
			},
			get_system_str(obj){
				let system_str = ";"
				switch (obj.system){
					case 1:
						system_str = "Windows 10 Pro";
						break;
					case 2: 
						system_str = "Windows 10 in S mode";
						break;
					default:
						system_str = "Windows 10 Home";
						break;
				}
				return system_str;
			},
			//生成
			variation_generate(){
				//重置
				this.data_reset();
				//复制对象
				let pc = this.pc;
				let base = this.base;
				let descriptions = this.descriptions;
				
				//系统字符串
				let system_str = this.get_system_str(pc);
				
				//附件
				let free_bullet_str = "";
				let description_head = "";
				let description_free = "";
				switch (pc.for_free){
					case 1:
						free_bullet_str = "free Ontrend 32GB USB Drive (authorized seller only)";
						description_head = "<p><strong>Disclaimer: We sell computers with customized configurations. If the computer has modifications different than the base model, the&nbsp;factory box is opened to install the upgrades to achieve the specifications as advertised. The modified product is professionally tested and resealed.</strong></p>";
						description_free = "<p><strong>Free&nbsp;Ontrend 32GB USB Drive included, authorized seller only</strong></p>";
						break;
					case 2:
						break;
					default:
						free_bullet_str = "free Rock eDigital Acessories: 1xHDMI cable, 1xUSB Extension cord, 1xMousepad, authorized sellers ONLY";
						description_head = "<p><strong>Rock eDigital&nbsp;sells computers with upgraded configurations. If the computer has modifications (listed above), then the manufacturer box is opened for it to be tested and inspected and to install the upgrades to achieve the specifications as advertised.</strong></p>";
						description_free = "<p><strong>Free Rock eDigital accessories:</strong><br />1xHDMI cable, 1xUSB Extension cord, 1xMousepad</p>"
						break;
				}
				
				//处理base
				//base_sku
				let base_sku = `${pc.manufacture.toLocaleUpperCase()}-${pc.screen_size}-${pc.model}-PARENT`;
				this.skus.push(base_sku);
				
				//base_title
				let base_disk_title_str = "";
				let base_title_addition_str = "";
				
				for(let disk of base.disks){
					base_disk_title_str += ` ${disk.size}${disk.unit} ${disk.type}`;
				}
				for(let additon of pc.title_addition){
					base_title_addition_str += ` ${additon}`;
				}
				let base_title = `${this.get_cur_year()} ${pc.manufacture} ${pc.series} ${pc.screen} ${pc.pctype} ${pc.cpu} ${pc.cpu_cores} Cores ${pc.graphics} ${base.ram_size}GB RAM DDR4${base_disk_title_str}${base_title_addition_str} ${system_str}`
				this.titles.push(base_title);
				
				for(let vari of this.variations){
					system_str = this.get_system_str(vari);
					console.log(vari);
					let disk_sku_str = "";
					let disk_title_str = "";
					for(let disk of vari.disks){
						disk_sku_str += "-" + disk.size + disk.unit;
						disk_title_str += ` ${disk.size}${disk.unit} ${disk.type}`;
					}
					//SKU 和 Title
					let var_sku = `${pc.manufacture}-${pc.screen_size}-${pc.model}-${vari.ram_size}GB${disk_sku_str}${vari.system==0?"":"-W10P"}-${pc.for_free==0?"RE3":"USB"}`;
					let var_title = `${this.get_cur_year()} ${pc.manufacture} ${pc.series} ${pc.screen} ${pc.pctype} ${pc.cpu} ${pc.cpu_cores} Cores ${pc.graphics} ${vari.ram_size}GB RAM DDR4${disk_title_str}${base_title_addition_str} ${system_str} ${pc.for_free == 0?"w/ RE Accessories":"w/ Ontrend 32GB USB Drive"}`
					this.skus.push(var_sku);
					this.titles.push(var_title);
					
					//计算
					let bass_ram = parseInt(base.ram_size);
					let vari_ram = parseInt(vari.ram_size);
					let base_disk_size = parseInt(base.disks[0].size);
					let vari_disk = vari.disks[0];
					let vari_disk_size = parseInt(vari_disk.size);
					let isUpgrade = vari_ram > bass_ram || vari_disk_size > base_disk_size || (vari_disk_size == 1 && vari_disk.type.indexOf("SSD") != -1);
					
					let bullet_2 = `【Customization】${isUpgrade?'Upgrade to ':""}${vari_ram}GB DDR4 SDRAM, ${disk_title_str}, ${pc.dvd}`;
					this.bullet_2.push(bullet_2);
					
					let bullet_5_head = pc.for_free==0?(vari.system != 1?"【Rock eDigital Bundle】":"【Rock eDigital Enhancement】"):(vari.system != 1?"【For Home】":"【For Business】");
					let bullet_5 = `${bullet_5_head}${vari.system != 1?"":"Upgrade to "}${system_str}, ${descriptions.battery_description}, ${descriptions.size_description}, ${pc.color}, ${free_bullet_str}`;
					this.bullet_5.push(bullet_5);
					
					//Description
					
					let html = `${description_head}<p>&nbsp;</p> 
					<p><strong>PC Series:</strong><br />${pc.manufacture} ${pc.series} ${pc.pctype}</p> 
					<p><strong>Display:</strong><br />${descriptions.screen_description}</p> 
					<p><strong>Processor:</strong><br />${descriptions.cpu_description}</p>
					<p><strong>Memory:</strong><br />${vari_ram > bass_ram?'<strong>Upgrade to&nbsp;</strong>':''}${vari_ram}GB DDR4</p>
					<p><strong>Storage:</strong><br />${(vari_disk_size > base_disk_size) || (vari.disks.length > base.disks.length) || (vari_disk_size == 1 && vari_disk.type.indexOf("SSD") != -1)?'<strong>Upgrade to</strong>':''}${disk_title_str}</p>
					<p><strong>Graphics:</strong><br />${descriptions.graphics_description}</p>
					<p><strong>Communications:</strong><br />${descriptions.connectivity_description}</p>
					<p><strong>Keyboard:</strong><br />${descriptions.keyboard_description}</p>
					<p><strong>Camera:</strong><br />${descriptions.camera_description}</p>
					<p><strong>Operating system:</strong><br />${vari.system != 1?'':'<strong>Upgrade to&nbsp;</strong>'}${system_str}</p>
					<p><strong>Ports &amp; Slots:</strong><br />${descriptions.solt_description}</p>
					<p><strong>Additional Information:</strong><br />Dimensions:${descriptions.size_description}</p>
					${description_free}`;
					
					this.html_descriptions.push(html);
				}
				
				//bullet 1-5
				
				this.bullet_1 = `【Powerful Performance with ${pc.cpu} ${parseInt(pc.cpu_cores)>=4?'Quand':"Dual"} Core】${descriptions.cpu_description}`;
				this.bullet_3 = `【Display and Graphics】${descriptions.screen_description},${descriptions.graphics_description}`;
				this.bullet_4 = `【Connectivity】${descriptions.connectivity_description},${descriptions.solt_description}`;
				
			},
			//复制skus
			copy_sku(){
				let skus = this.skus;
				let copy_str = "";
				for(let sku of skus){
					copy_str += sku + "\n";
				}
				this.sku_copy_str = copy_str;
				this.check_when_copyed(".copy_sku");
			},
			copy_title(){
				let titles = this.titles;
				let copy_str = "";
				for(let title of titles){
					copy_str += title + "\n";
				}
				this.title_copy_str = copy_str;
				this.check_when_copyed(".copy_title");
			},
			copy_bullet_2(){
				let bullet2 = this.bullet_2;
				let copy_str = "";
				for(let str of bullet2){
					copy_str += str + "\n";
				}
				this.bullet_2_copy_str = copy_str;
				this.check_when_copyed(".copy_bullet_2");
			},
			copy_bullet_5(){
				let bullet5 = this.bullet_5;
				let copy_str = "";
				for(let str of bullet5){
					copy_str += str + "\n";
				}
				this.bullet_5_copy_str = copy_str;
				this.check_when_copyed(".copy_bullet_5");
			},
			check_when_copyed(identify){
				const clipboard = new Clipboard(identify);
				clipboard.on("success", (e) => {
					this.$message({
						type:"success",
						message:'已复制到剪切板'
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
	};
</script>

<style>
	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.el-select .el-input {
		min-width: 105px;
	}
</style>
