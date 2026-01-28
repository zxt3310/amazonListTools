<template>
  <div class="container">
    <MyNavi activeIndex="17"></MyNavi>
    <div class="main-content">
      <h2>跟卖利润计算器</h2>
      
      <div class="query-section">
        <el-card class="query-card">
          <div slot="header" class="clearfix">
            <span>产品信息查询</span>
          </div>
          <el-form :model="upcForm" label-width="120px">
            <el-form-item label="UPC码">
              <div class="upc-input-wrapper">
                <el-input
                  v-model="upcForm.upc"
                  placeholder="请输入12位UPC码，或14位格式(如：123456789012-3)"
                  style="width: 300px; margin-right: 10px;"
                  maxlength="14"
                  show-word-limit
                ></el-input>
                <el-button
                  type="primary"
                  @click="queryUpc"
                  :loading="queryingUpc"
                  :disabled="!upcForm.upc.trim() || queryingUpc"
                >
                  查询产品信息
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <div class="product-info-section" v-if="productInfo">
        <el-card class="product-card">
          <div slot="header" class="clearfix">
            <span>产品配置信息</span>
          </div>
          
          <div class="key-info-section">
            <el-alert
              title="关键信息"
              type="info"
              :closable="false"
              style="margin-bottom: 20px;"
            >
              <div class="key-info-content">
                <div class="info-item">
                  <span class="info-label">成本价：</span>
                  <span class="info-value">{{ productInfo.cost_price ? '$' + productInfo.cost_price : '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">板载内存：</span>
                  <span class="info-value">{{ productInfo.onboard_memory_size && productInfo.onboard_memory_size > 0 ? productInfo.onboard_memory_size + 'GB' : '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">内存插槽：</span>
                  <span class="info-value">{{ productInfo.onboard_memory_open_slot || 0 }}个</span>
                </div>
                <div class="info-item">
                  <span class="info-label">基础内存：</span>
                  <span class="info-value">{{ productInfo.computer_memory_size && productInfo.computer_memory_size > 0 ? productInfo.computer_memory_size + 'GB' : '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">内存类型：</span>
                  <span class="info-value">{{ productInfo.ram_memory_technology || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">基础硬盘：</span>
                  <span class="info-value">{{ formatStorage(productInfo.hard_disk_size) }}</span>
                </div>
              </div>
            </el-alert>
          </div>
          
          <div class="detailed-info-section">
            <el-row :gutter="20">
              <el-col :span="12">
                <h4 style="margin-bottom: 15px; color: #303133;">处理器与显示</h4>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="处理器型号">
                    {{ productInfo.processor_model_number || '未知' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="屏幕尺寸">
                    {{ productInfo.display_size ? productInfo.display_size + '英寸' : '未知' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="分辨率">
                    {{ productInfo.native_resolution || '未知' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="触摸屏">
                    {{ productInfo.touchscreen ? '支持' : '不支持' }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <el-col :span="12">
                <h4 style="margin-bottom: 15px; color: #303133;">内存与存储</h4>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="板载内存">
                    {{ productInfo.onboard_memory_size && productInfo.onboard_memory_size > 0 ? productInfo.onboard_memory_size + 'GB' : '无' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="内存插槽">
                    {{ productInfo.onboard_memory_open_slot || 0 }}个
                  </el-descriptions-item>
                  <el-descriptions-item label="基础内存">
                    {{ productInfo.computer_memory_size && productInfo.computer_memory_size > 0 ? productInfo.computer_memory_size + 'GB' : '无' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="内存类型">
                    {{ productInfo.ram_memory_technology || '无' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="基础硬盘">
                    {{ formatStorage(productInfo.hard_disk_size) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
            
            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :span="12">
                <h4 style="margin-bottom: 15px; color: #303133;">其他配置</h4>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="WiFi">
                    {{ productInfo.wifi || '无' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="显卡">
                    {{ productInfo.graphics_coprocessor || '无' }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
      
      <div class="config-section" v-if="productInfo">
        <el-card class="config-card">
          <div slot="header" class="clearfix">
            <span>跟卖配置选择</span>
          </div>
          
          <el-form :model="configForm" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card shadow="never" class="config-sub-card">
                  <div slot="header" class="clearfix">
                    <span>内存配置</span>
                    <div style="float: right;">
                      <el-tag size="small" type="info" style="margin-right: 10px;">
                        板载: {{ productInfo.onboard_memory_size && productInfo.onboard_memory_size > 0 ? productInfo.onboard_memory_size + 'GB' : '无' }}
                      </el-tag>
                      <el-tag size="small" type="info">
                        插槽: {{ productInfo.onboard_memory_open_slot || 0 }}个
                      </el-tag>
                    </div>
                  </div>
                  <el-form-item label="基础内存">
                    <span>{{ productInfo.computer_memory_size && productInfo.computer_memory_size > 0 ? productInfo.computer_memory_size + 'GB ' + (productInfo.ram_memory_technology || '') : '无' }}</span>
                  </el-form-item>
                  <el-form-item label="操作方式" v-if="canChangeMemory">
                    <el-radio-group v-model="configForm.memoryAction" :disabled="!canChangeMemory">
                      <el-radio label="add">加装</el-radio>
                      <el-radio label="replace">替换</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="选择配件" v-if="canChangeMemory">
                    <el-select 
                      v-model="configForm.targetMemoryId" 
                      placeholder="请选择内存配件"
                      style="width: 300px;"
                      :disabled="!canChangeMemory"
                    >
                      <el-option
                        v-for="part in memoryParts"
                        :key="part.id || part.part_name"
                        :label="part.part_name"
                        :value="part.id"
                      ></el-option>
                    </el-select>
                    <el-tag type="warning" size="small" v-if="!canChangeMemory" style="margin-left: 10px;">
                      基础内存带LP字样，无法变动
                    </el-tag>
                  </el-form-item>
                  <el-form-item label="回收配件" v-if="canChangeMemory && configForm.memoryAction === 'replace'">
                    <el-select 
                      v-model="configForm.recycleMemoryId" 
                      placeholder="请选择回收的内存配件"
                      style="width: 300px;"
                      :disabled="!canChangeMemory"
                    >
                      <el-option
                        v-for="part in memoryParts"
                        :key="part.id || part.part_name"
                        :label="part.part_name"
                        :value="part.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内存费用">
                    <span class="cost-value">${{ calculateMemoryCost().toFixed(2) }}</span>
                    <span v-if="configForm.memoryAction === 'replace'" class="recover-value">
                      (可回收: ${{ calculateMemoryRecoverValue().toFixed(2) }})
                    </span>
                  </el-form-item>
                </el-card>
              </el-col>
              
              <el-col :span="12">
                <el-card shadow="never" class="config-sub-card">
                  <div slot="header" class="clearfix">
                    <span>硬盘配置</span>
                  </div>
                  <el-form-item label="基础硬盘">
                    <span>{{ formatStorage(productInfo.hard_disk_size) }}</span>
                  </el-form-item>
                  <el-form-item label="操作方式">
                    <el-radio-group v-model="configForm.storageAction">
                      <el-radio label="add">加装</el-radio>
                      <el-radio label="replace">替换</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="选择配件">
                    <el-select 
                      v-model="configForm.targetStorageId" 
                      placeholder="请选择硬盘配件"
                      style="width: 300px;"
                    >
                      <el-option
                        v-for="part in storageParts"
                        :key="part.id || part.part_name"
                        :label="part.part_name"
                        :value="part.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="回收配件" v-if="configForm.storageAction === 'replace'">
                    <el-select 
                      v-model="configForm.recycleStorageId" 
                      placeholder="请选择回收的硬盘配件"
                      style="width: 300px;"
                    >
                      <el-option
                        v-for="part in storageParts"
                        :key="part.id || part.part_name"
                        :label="part.part_name"
                        :value="part.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="硬盘费用">
                    <span class="cost-value">${{ calculateStorageCost().toFixed(2) }}</span>
                    <span v-if="configForm.storageAction === 'replace'" class="recover-value">
                      (可回收: ${{ calculateStorageRecoverValue().toFixed(2) }})
                    </span>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      
      <div class="input-section">
        <el-card class="input-card">
          <div slot="header" class="clearfix">
            <span>利润计算参数</span>
          </div>
          <el-form :model="profitForm" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="跟卖价格">
                  <el-input
                    v-model="profitForm.followPrice"
                    type="number"
                    placeholder="请输入跟卖价格"
                    step="0.01"
                    min="0"
                  >
                    <template slot="append">$</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品成本">
                  <el-input
                    v-model="profitForm.productCost"
                    type="number"
                    placeholder="请输入产品成本"
                    step="0.01"
                    min="0"
                  >
                    <template slot="append">$</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物流费用">
                  <el-input
                    v-model="profitForm.shippingFee"
                    type="number"
                    placeholder="物流费用"
                    step="0.01"
                    min="0"
                  >
                    <template slot="append">$</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item>
              <el-button
                type="primary"
                @click="calculateProfit"
                :disabled="!productInfo"
              >
                计算利润
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <div class="result-section" v-if="showResult">
        <el-card class="result-card">
          <div slot="header" class="clearfix">
            <span>利润计算结果</span>
          </div>
          
          <!-- 利润计算公式 -->
          <div class="result-formula" v-if="profitFormula">
            <div class="formula-label">计算公式：</div>
            <div class="formula-content">
              ${{ profitFormula }}
            </div>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="result-item">
                <div class="result-label">总收入</div>
                <div class="result-value total-income">${{ profitResult.totalIncome.toFixed(2) }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="result-item">
                <div class="result-label">总成本</div>
                <div class="result-value total-cost">${{ profitResult.totalCost.toFixed(2) }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="result-item">
                <div class="result-label">总利润</div>
                <div class="result-value total-profit" :class="profitResult.totalProfit >= 0 ? 'profit-positive' : 'profit-negative'">
                  ${{ profitResult.totalProfit.toFixed(2) }}
                </div>
              </div>
            </el-col>
          </el-row>
          
          <el-divider></el-divider>
          
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="result-item small">
                <div class="result-label">单产品利润</div>
                <div class="result-value unit-profit" :class="profitResult.unitProfit >= 0 ? 'profit-positive' : 'profit-negative'">
                  ${{ profitResult.unitProfit.toFixed(2) }}
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="result-item small">
                <div class="result-label">利润率</div>
                <div class="result-value profit-rate" :class="profitResult.profitRate >= 0 ? 'profit-positive' : 'profit-negative'">
                  {{ profitResult.profitRate.toFixed(2) }}%
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="result-item small">
                <div class="result-label">亚马逊佣金</div>
                <div class="result-value fee-commission">${{ profitResult.commissionFee.toFixed(2) }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="result-item small">
                <div class="result-label">配件净支出</div>
                <div class="result-value net-parts-cost" :class="profitResult.netPartsCost >= 0 ? 'profit-positive' : 'profit-negative'">
                  ${{ profitResult.netPartsCost.toFixed(2) }}
                </div>
              </div>
            </el-col>
          </el-row>
          
          <el-divider></el-divider>
          
          <el-table :data="costDetails" stripe>
            <el-table-column prop="name" label="费用项目" width="180"></el-table-column>
            <el-table-column prop="amount" label="金额" width="120" align="right">
              <template slot-scope="scope">${{ parseFloat(scope.row.amount || 0).toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="description" label="说明"></el-table-column>
          </el-table>
        </el-card>
      </div>
      
      <div class="part-cost-section">
        <el-card class="part-cost-card">
          <div slot="header" class="clearfix">
            <span>配件价格维护</span>
            <el-button
              type="primary"
              size="small"
              style="float: right;"
              @click="openAddPartCostDialog"
            >
              添加配件价格
            </el-button>
          </div>
          
          <div class="part-cost-list-container">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="part-cost-list">
                  <h4 style="margin-bottom: 10px; color: #303133; font-size: 14px;">配件价格列表（左）</h4>
                  <el-table
                    v-loading="fetchingPartCosts"
                    :data="leftPartCosts"
                    stripe
                    border
                    style="width: 100%"
                    @row-dblclick="handlePartCostDoubleClick"
                    max-height="600"
                    empty-text=""
                  >
                    <el-table-column prop="id" label="ID" width="60"></el-table-column>
                    <el-table-column prop="part_name" label="配件名称" width="200"></el-table-column>
                    <el-table-column prop="price" label="价格" width="100" align="right">
                      <template slot-scope="scope">${{ parseFloat(scope.row.price || 0).toFixed(2) }}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          size="mini"
                          @click="openEditPartCostDialog(scope.row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          type="danger"
                          size="mini"
                          @click="deletePartCost(scope.row.id)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                    
                    <template slot="empty">
                      <div class="empty-state small">
                        <i class="el-icon-document-copy" style="font-size: 40px; color: #c0c4cc;"></i>
                        <p style="margin-top: 10px; color: #c0c4cc; font-size: 12px;">暂无数据</p>
                      </div>
                    </template>
                  </el-table>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="part-cost-list">
                  <h4 style="margin-bottom: 10px; color: #303133; font-size: 14px;">配件价格列表（右）</h4>
                  <el-table
                    v-loading="fetchingPartCosts"
                    :data="rightPartCosts"
                    stripe
                    border
                    style="width: 100%"
                    @row-dblclick="handlePartCostDoubleClick"
                    max-height="600"
                    empty-text=""
                  >
                    <el-table-column prop="id" label="ID" width="60"></el-table-column>
                    <el-table-column prop="part_name" label="配件名称" width="200"></el-table-column>
                    <el-table-column prop="price" label="价格" width="100" align="right">
                      <template slot-scope="scope">${{ parseFloat(scope.row.price || 0).toFixed(2) }}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          size="mini"
                          @click="openEditPartCostDialog(scope.row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          type="danger"
                          size="mini"
                          @click="deletePartCost(scope.row.id)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                    
                    <template slot="empty">
                      <div class="empty-state small">
                        <i class="el-icon-document-copy" style="font-size: 40px; color: #c0c4cc;"></i>
                        <p style="margin-top: 10px; color: #c0c4cc; font-size: 12px;">暂无数据</p>
                      </div>
                    </template>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
      
      <el-dialog
        :title="dialogTitle"
        :visible.sync="partCostDialogVisible"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form :model="partCostForm" :rules="partCostRules" ref="partCostFormRef" label-width="120px">
          <el-form-item label="配件名称" prop="part_name">
            <el-input
              v-model="partCostForm.part_name"
              placeholder="请输入配件名称"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="配件价格" prop="price">
            <el-input
              v-model.number="partCostForm.price"
              type="number"
              placeholder="请输入配件价格"
              step="0.01"
              min="0"
            >
              <template slot="append">$</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="partCostDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePartCost">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MyNavi from "../components/Navi.vue";
import axios from "../js/request.js";

export default {
  name: "FollowSellingProfit",
  components: {
    MyNavi
  },
  data() {
    return {
      upcForm: {
        upc: ""
      },
      queryingUpc: false,
      productInfo: null,
      
      configForm: {
        targetMemoryId: null,
        memoryAction: "add",
        recycleMemoryId: null,
        targetStorageId: null,
        storageAction: "add",
        recycleStorageId: null
      },
      
      profitForm: {
        followPrice: 0,
        productCost: 0,
        shippingFee: 30
      },
      
      showResult: false,
      profitResult: {
        totalIncome: 0,
        totalCost: 0,
        totalProfit: 0,
        unitProfit: 0,
        profitRate: 0,
        commissionFee: 0,
        netPartsCost: 0
      },
      profitFormula: '',
      costDetails: [],
      
      partCosts: [],
      fetchingPartCosts: false,
      partCostDialogVisible: false,
      dialogTitle: "",
      partCostForm: {
        id: null,
        part_name: "",
        price: 0
      },
      partCostRules: {
        part_name: [
          { required: true, message: "请输入配件名称", trigger: "blur" },
          { min: 1, max: 100, message: "配件名称长度在 1 到 100 个字符", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入配件价格", trigger: "blur" },
          { type: "number", min: 0, message: "配件价格必须大于等于0", trigger: "blur" }
        ]
      },
      // 合法硬盘规格列表 - 支持纯数字和GB/TB格式
      validStorageSizes: [1, 2, 4, 8, 64, 128, 256, 512, 1000, 2000, 4000, 8000]
    };
  },
  mounted() {
    this.fetchPartCosts();
  },
  computed: {
    leftPartCosts() {
      if (!this.partCosts || this.partCosts.length === 0) {
        return [];
      }
      const midIndex = Math.ceil(this.partCosts.length / 2);
      return this.partCosts.slice(0, midIndex);
    },
    
    rightPartCosts() {
      if (!this.partCosts || this.partCosts.length === 0) {
        return [];
      }
      const midIndex = Math.ceil(this.partCosts.length / 2);
      return this.partCosts.slice(midIndex);
    },
    
    availableMemoryOptions() {
      // 完全从配件列表的part_name中提取内存选项
      const memoryOptions = new Set();
      
      // 遍历配件列表，提取内存相关配件
      if (this.partCosts && this.partCosts.length > 0) {
        this.partCosts.forEach(part => {
          if (part.part_name) {
            // 匹配内存相关配件名称，例如：8GB, 16GB, DDR4 32GB 等
            const memoryMatch = part.part_name.match(/(\d+)GB/i);
            if (memoryMatch) {
              const memorySize = parseInt(memoryMatch[1]);
              memoryOptions.add(memorySize);
            }
          }
        });
      }
      
      // 转换为数组并排序
      return Array.from(memoryOptions).sort((a, b) => a - b);
    },
    
    availableStorageOptions() {
      // 完全从配件列表的part_name中提取硬盘选项
      const storageOptions = new Set();
      const validSizes = this.validStorageSizes;
      
      // 遍历配件列表，提取硬盘相关配件
      if (this.partCosts && this.partCosts.length > 0) {
        this.partCosts.forEach(part => {
          if (part.part_name) {
            // 匹配硬盘相关配件名称，例如：512GB SSD, 1TB NVMe, 2TB HDD 等
            const storageMatch = part.part_name.match(/(\d+(?:\.\d+)?)(TB|GB)/i);
            if (storageMatch) {
              let size = parseFloat(storageMatch[1]);
              const unit = storageMatch[2].toUpperCase();
              
              // 转换为统一的GB单位存储
              if (unit === 'TB') {
                size *= 1000;
              }
              
              // 只添加合法的硬盘规格
              if (validSizes.includes(size)) {
                storageOptions.add(size);
              }
            }
          }
        });
      }
      
      // 转换为数组并排序
      return Array.from(storageOptions).sort((a, b) => a - b);
    },
    
    // 检查是否可以变动内存 - 基础配置的内存带LP字样则无法变动
    canChangeMemory() {
      if (!this.productInfo) return true;
      // 获取基础内存信息
      const baseMemory = this.productInfo.computer_memory_size ? 
        `${this.productInfo.computer_memory_size}GB ${this.productInfo.ram_memory_technology || ''}` : 
        '';
      // 如果包含LP字样则无法变动
      return !baseMemory.toLowerCase().includes('lp');
    },
    
    canAddMemory() {
      if (!this.productInfo) return false;
      const slots = this.productInfo.onboard_memory_open_slot || 0;
      
      // 获取板载内存和基础内存
      const onboardMemory = this.productInfo.onboard_memory_size || 0;
      const baseMemory = this.productInfo.computer_memory_size || 0;
      
      // 如果板载内存>0且基础内存>板载内存，则只能替换不能加装
      if (onboardMemory > 0 && baseMemory > onboardMemory) {
        return false;
      }
      
      return slots > 0 && this.canChangeMemory;
    },
    
    // 内存配件列表 - 只显示与基础配置内存类型匹配的选项
    memoryParts() {
      if (!this.partCosts || this.partCosts.length === 0 || !this.productInfo) return [];
      
      // 获取基础配置的内存类型
      const baseMemoryType = this.productInfo.ram_memory_technology || '';
      const baseMemoryTypeLower = baseMemoryType.toLowerCase();
      
      return this.partCosts.filter(part => {
        if (!part.part_name || !part.part_name.toLowerCase().includes('ddr')) return false;
        
        // 如果有基础内存类型，只显示匹配的内存配件
        if (baseMemoryTypeLower) {
          return part.part_name.toLowerCase().includes(baseMemoryTypeLower);
        }
        
        // 没有基础内存类型时，显示所有DDR内存配件
        return true;
      });
    },
    
    
    
    // 硬盘配件列表 - 不带DDR字样的就是硬盘
    storageParts() {
      if (!this.partCosts || this.partCosts.length === 0) return [];
      
      // 返回所有硬盘相关配件
      return this.partCosts.filter(part => {
        return part.part_name && !part.part_name.toLowerCase().includes('ddr');
      });
    },
    
    // 当前选中的内存配件
    selectedMemoryPart() {
      if (!this.configForm.targetMemoryId) return null;
      return this.partCosts.find(part => part.id === this.configForm.targetMemoryId);
    },
    
    // 当前选中的硬盘配件
    selectedStoragePart() {
      if (!this.configForm.targetStorageId) return null;
      return this.partCosts.find(part => part.id === this.configForm.targetStorageId);
    },
    
    // 当前选中的回收内存配件
    selectedRecycleMemoryPart() {
      if (!this.configForm.recycleMemoryId) return null;
      return this.partCosts.find(part => part.id === this.configForm.recycleMemoryId);
    },
    
    // 当前选中的回收硬盘配件
    selectedRecycleStoragePart() {
      if (!this.configForm.recycleStorageId) return null;
      return this.partCosts.find(part => part.id === this.configForm.recycleStorageId);
    }
  },
  methods: {
    // 获取最接近的合法硬盘规格
    getClosestValidStorage(size) {
      const validSizes = this.validStorageSizes;
      if (!size) return 0;
      
      // 找到最接近的合法规格
      return validSizes.reduce((closest, validSize) => {
        return Math.abs(validSize - size) < Math.abs(closest - size) ? validSize : closest;
      }, validSizes[0]);
    },
    
    // 检查硬盘规格是否合法
    isValidStorage(size) {
      const validSizes = this.validStorageSizes;
      return validSizes.includes(size);
    },
    
    formatStorage(size) {
      if (!size) return '未知';
      
      // 检查是否为合法规格，否则显示警告
      if (!this.isValidStorage(size)) {
        const closest = this.getClosestValidStorage(size);
        return `${this.formatStorageLabel(size)} (建议: ${this.formatStorageLabel(closest)})`;
      }
      
      if (size >= 1000) {
        return (size / 1000).toFixed(1) + ' TB';
      } else {
        return size + ' GB';
      }
    },
    
    formatStorageLabel(size) {
      if (size >= 1000) {
        return (size / 1000).toFixed(1) + ' TB';
      } else {
        return size + ' GB';
      }
    },
    
    getMemoryDiff() {
      if (!this.selectedMemoryPart || !this.productInfo) return 0;
      
      // 从配件名称中提取目标内存容量
      const targetMemoryName = this.selectedMemoryPart.part_name;
      const targetMatch = targetMemoryName.match(/(\d+)GB/i);
      const targetMemory = targetMatch ? parseInt(targetMatch[1]) : 0;
      
      const baseMemory = this.productInfo.computer_memory_size || 0;
      return Math.max(0, targetMemory - baseMemory);
    },
    
    getStorageDiff() {
      if (!this.selectedStoragePart || !this.productInfo) return 0;
      
      // 从配件名称中提取目标硬盘容量
      const targetStorageName = this.selectedStoragePart.part_name;
      const targetMatch = targetStorageName.match(/(\d+(?:\.\d+)?)(TB|GB)/i);
      let targetStorage = 0;
      if (targetMatch) {
        targetStorage = parseFloat(targetMatch[1]);
        const unit = targetMatch[2].toUpperCase();
        if (unit === 'TB') {
          targetStorage *= 1000;
        }
      }
      
      const baseStorage = this.productInfo.hard_disk_size || 0;
      return Math.max(0, targetStorage - baseStorage);
    },
    
    findPartPrice(partName) {
      // 防御性编程：如果 partName 为 undefined 或 null，直接返回 0
      if (!partName) return 0;
      
      const part = this.partCosts.find(p => 
        p.part_name && p.part_name.toLowerCase().includes(partName.toLowerCase())
      );
      return part ? part.price : 0;
    },
    
    calculateMemoryCost() {
      if (!this.selectedMemoryPart || !this.productInfo) return 0;
      
      // selectedMemoryPart 是完整的配件对象
      return this.selectedMemoryPart.price || 0;
    },
    
    calculateMemoryRecoverValue() {
      if (!this.selectedMemoryPart || !this.productInfo) return 0;
      
      const memoryAction = this.configForm.memoryAction;
      if (memoryAction === "add") return 0;
      
      // 使用用户选择的回收配件价格
      return this.selectedRecycleMemoryPart ? this.selectedRecycleMemoryPart.price : 0;
    },
    
    calculateStorageCost() {
      if (!this.selectedStoragePart || !this.productInfo) return 0;
      
      // selectedStoragePart 是完整的配件对象
      return this.selectedStoragePart.price || 0;
    },
    
    calculateStorageRecoverValue() {
      if (!this.selectedStoragePart || !this.productInfo) return 0;
      
      const storageAction = this.configForm.storageAction;
      if (storageAction === "add") return 0;
      
      // 使用用户选择的回收配件价格
      return this.selectedRecycleStoragePart ? this.selectedRecycleStoragePart.price : 0;
    },
    
    async queryUpc() {
      const upcRegex = /^\d{12}$|^\d{12}-\d$/;
      if (!upcRegex.test(this.upcForm.upc.trim())) {
        this.$message.error("请输入有效的12位UPC码，或14位格式(如：123456789012-3)");
        return;
      }
      
      this.queryingUpc = true;
      
      try {
        const upc = this.upcForm.upc.trim();
        const response = await axios.get(
          `https://dev.admin.amz.luyantech.com/api/upc/${upc}`
        );
        
        if (response.code === 0 && response.data) {
          // 处理产品信息，特别是硬盘大小
          const productData = { ...response.data };
          
          // 如果 hard_disk_size 小于 64，那么一定是 TB 而不是 GB
          if (productData.hard_disk_size && typeof productData.hard_disk_size === 'number' && productData.hard_disk_size < 64) {
            // 转换为 GB 存储（1 TB = 1000 GB）
            productData.hard_disk_size *= 1000;
          }
          
          this.productInfo = productData;
          
          if (productData.cost_price) {
            this.profitForm.productCost = productData.cost_price;
          }
          
          // 清空配置，让用户手动选择配件
          this.configForm.targetMemoryId = null;
          this.configForm.targetStorageId = null;
          this.configForm.recycleMemoryId = null;
          this.configForm.recycleStorageId = null;
          this.configForm.memoryAction = this.canAddMemory ? "add" : "replace";
          this.configForm.storageAction = "add";
          
          // 自动选择与基础配置硬盘容量相关的回收配件
          if (productData.hard_disk_size) {
            const baseStorageSize = productData.hard_disk_size;
            
            // 尝试不同的匹配方式
            let matchingStoragePart = null;
            
            // 方式1：直接匹配容量数值（GB）和常见单位
            const sizeInGB = baseStorageSize;
            const sizeInTB = baseStorageSize / 1000;
            
            // 查找匹配的硬盘回收配件
            matchingStoragePart = this.storageParts.find(part => {
              if (!part.part_name) return false;
              const partNameLower = part.part_name.toLowerCase();
              
              // 匹配不同格式：1000GB, 1TB, 1.0TB等
              return partNameLower.includes(`${sizeInGB}gb`) || 
                     partNameLower.includes(`${sizeInTB}tb`) ||
                     partNameLower.includes(`${Math.floor(sizeInTB)}tb`);
            });
            
            // 方式2：如果没有找到，尝试匹配近似容量（±10%范围内）
            if (!matchingStoragePart) {
              matchingStoragePart = this.storageParts.find(part => {
                if (!part.part_name) return false;
                const sizeMatch = part.part_name.match(/(\d+(?:\.\d+)?)(TB|GB)/i);
                if (!sizeMatch) return false;
                
                let partSize = parseFloat(sizeMatch[1]);
                const partUnit = sizeMatch[2].toUpperCase();
                
                // 转换为GB单位
                if (partUnit === 'TB') {
                  partSize *= 1000;
                }
                
                // 匹配近似容量（±10%）
                const diff = Math.abs(partSize - sizeInGB);
                return diff <= sizeInGB * 0.1;
              });
            }
            
            if (matchingStoragePart) {
              this.configForm.recycleStorageId = matchingStoragePart.id;
            }
          }
          
          this.$message.success("产品信息查询成功");
        } else {
          this.productInfo = null;
          this.$message.error("查询失败：" + (response.message || "未知错误"));
        }
      } catch (error) {
        console.error("UPC查询错误:", error);
        this.productInfo = null;
        this.$message.error("查询失败，请检查网络连接或UPC码是否正确");
      } finally {
        this.queryingUpc = false;
      }
    },
    
    calculateProfit() {
      if (!this.profitForm.followPrice || !this.profitForm.productCost) {
        this.$message.warning("请填写必要的计算参数");
        return;
      }
      
      const followPrice = parseFloat(this.profitForm.followPrice) || 0;
      const productCost = parseFloat(this.profitForm.productCost) || 0;
      const shippingFee = parseFloat(this.profitForm.shippingFee) || 0;
      
      const commissionFee = followPrice * 0.08;
      const totalIncome = followPrice * 0.92;
      
      const memoryCost = this.calculateMemoryCost();
      const memoryRecover = this.calculateMemoryRecoverValue();
      const storageCost = this.calculateStorageCost();
      const storageRecover = this.calculateStorageRecoverValue();
      
      const partsCost = memoryCost + storageCost;
      const partsRecover = memoryRecover + storageRecover;
      const netPartsCost = partsCost - partsRecover;
      
      // 修正：totalIncome 已经是扣除佣金后的收入，所以总成本中不应再包含佣金
      const totalCost = productCost + shippingFee + netPartsCost;
      const totalProfit = totalIncome - totalCost;
      const unitProfit = totalProfit;
      const profitRate = followPrice > 0 ? (totalProfit / followPrice) * 100 : 0;
      
      // 生成利润计算公式（修正：移除重复的佣金扣除，分别列出内存和硬盘的配件花销和回收）
      let formula = '';
      formula += `${followPrice.toFixed(2)} x 0.92`; // 跟卖价格 x 0.92（已扣除8%佣金）
      formula += ` - ${productCost.toFixed(2)}`; // - 产品成本
      formula += ` - ${shippingFee.toFixed(2)}`; // - 运费
      
      // 分别列出内存成本
      if (memoryCost > 0) {
        formula += ` - ${memoryCost.toFixed(2)}`; // - 内存成本
      }
      
      // 分别列出硬盘成本
      if (storageCost > 0) {
        formula += ` - ${storageCost.toFixed(2)}`; // - 硬盘成本
      }
      
      // 分别列出内存回收价值
      if (memoryRecover > 0) {
        formula += ` + ${memoryRecover.toFixed(2)}`; // + 内存回收价值
      }
      
      // 分别列出硬盘回收价值
      if (storageRecover > 0) {
        formula += ` + ${storageRecover.toFixed(2)}`; // + 硬盘回收价值
      }
      
      formula += ` = ${totalProfit.toFixed(2)}`; // = 总利润
      
      this.profitFormula = formula;
      
      this.profitResult = {
        totalIncome,
        totalCost,
        totalProfit,
        unitProfit,
        profitRate,
        commissionFee,
        netPartsCost
      };
      
      this.costDetails = [
        {
          name: "产品成本",
          amount: productCost,
          description: `基础产品采购成本: $${productCost.toFixed(2)}`
        },
        {
          name: "物流费用",
          amount: shippingFee,
          description: `物流费用: $${shippingFee.toFixed(2)}`
        },
        {
          name: "亚马逊佣金",
          amount: commissionFee,
          description: `佣金(8%): $${commissionFee.toFixed(2)}`
        },
        {
          name: "内存配件费用",
          amount: memoryCost,
          description: `内存费用: $${memoryCost.toFixed(2)}`
        },
        {
          name: "内存回收价值",
          amount: -memoryRecover,
          description: `内存回收: -$${memoryRecover.toFixed(2)}`
        },
        {
          name: "硬盘配件费用",
          amount: storageCost,
          description: `硬盘费用: $${storageCost.toFixed(2)}`
        },
        {
          name: "硬盘回收价值",
          amount: -storageRecover,
          description: `硬盘回收: -$${storageRecover.toFixed(2)}`
        },
        {
          name: "配件净支出",
          amount: netPartsCost,
          description: `配件净支出: $${netPartsCost.toFixed(2)}`
        },
        {
          name: "单产品总成本",
          amount: totalCost,
          description: `总成本(含配件): $${totalCost.toFixed(2)}`
        }
      ];
      
      this.showResult = true;
    },
    
    resetForm() {
      this.profitForm = {
        followPrice: 0,
        productCost: this.productInfo?.cost_price || 0,
        shippingFee: 30
      };
      this.showResult = false;
      this.profitResult = {
        totalIncome: 0,
        totalCost: 0,
        totalProfit: 0,
        unitProfit: 0,
        profitRate: 0,
        commissionFee: 0,
        netPartsCost: 0
      };
      this.profitFormula = '';
      this.costDetails = [];
    },
    
    async fetchPartCosts() {
      this.fetchingPartCosts = true;
      try {
        const response = await axios.get('/part-costs');
        
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && Array.isArray(response.data)) {
          data = response.data;
        } else if (response && response.data && typeof response.data === 'object') {
          if (response.data.data && Array.isArray(response.data.data)) {
            data = response.data.data;
          } else {
            data = Object.values(response.data);
          }
        }
        
        this.partCosts = data.map(item => ({
          ...item,
          price: parseFloat(item.price) || 0
        }));
        
        this.$message.success(`配件价格加载成功，共 ${this.partCosts.length} 条记录`);
      } catch (error) {
        console.error('获取配件价格失败:', error);
        const errorMsg = error.response?.data?.message || error.message || '请检查网络连接';
        this.$message.error(`获取配件价格失败: ${errorMsg}`);
        this.partCosts = [];
      } finally {
        this.fetchingPartCosts = false;
      }
    },
    
    openAddPartCostDialog() {
      this.dialogTitle = '添加配件价格';
      this.partCostForm = {
        id: null,
        part_name: '',
        price: 0
      };
      this.partCostDialogVisible = true;
    },
    
    openEditPartCostDialog(row) {
      this.dialogTitle = '编辑配件价格';
      this.partCostForm = { ...row };
      this.partCostDialogVisible = true;
    },
    
    handlePartCostDoubleClick(row) {
      this.openEditPartCostDialog(row);
    },
    
    async savePartCost() {
      this.$refs.partCostFormRef.validate(async (valid) => {
        if (valid) {
          try {
            if (this.partCostForm.id) {
              await axios.put(`/part-costs/${this.partCostForm.id}`, {
                price: this.partCostForm.price
              });
              const index = this.partCosts.findIndex(item => item.id === this.partCostForm.id);
              if (index !== -1) {
                this.partCosts[index].price = this.partCostForm.price;
                this.partCosts[index].updated_at = new Date().toISOString();
              }
              this.$message.success('配件价格更新成功');
            } else {
              const response = await axios.post('/part-costs', {
                part_name: this.partCostForm.part_name,
                price: this.partCostForm.price
              });
              this.partCosts.push(response.data);
              this.$message.success('配件价格添加成功');
            }
            
            this.partCostDialogVisible = false;
          } catch (error) {
            console.error('保存配件价格失败:', error);
            this.$message.error('保存配件价格失败，请检查网络连接');
          }
        } else {
          return false;
        }
      });
    },
    
    async deletePartCost(id) {
      this.$confirm('确定要删除该配件价格吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await axios.delete(`/part-costs/${id}`);
          this.partCosts = this.partCosts.filter(item => item.id !== id);
          this.$message.success('配件价格删除成功');
        } catch (error) {
          console.error('删除配件价格失败:', error);
          this.$message.error('删除配件价格失败，请检查网络连接');
        }
      }).catch(() => {
      });
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow: auto;
}

h2 {
  color: #303133;
  margin-bottom: 20px;
  text-align: center;
}

.query-section {
  margin-bottom: 20px;
}

.query-card {
  margin-bottom: 20px;
}

.upc-input-wrapper {
  display: flex;
  align-items: center;
}

.product-info-section {
  margin-bottom: 20px;
}

.product-card {
  margin-bottom: 20px;
}

.key-info-section {
  margin-bottom: 20px;
}

.key-info-content {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding: 5px 0;
  overflow-x: auto;
}

.info-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin: 0;
  padding: 0;
}

.info-label {
  font-weight: bold;
  color: #303133;
  margin-right: 5px;
}

.info-value {
  color: #606266;
  font-size: 16px;
}

.detailed-info-section h4 {
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.config-section {
  margin-bottom: 20px;
}

.config-card {
  margin-bottom: 20px;
}

.config-sub-card {
  margin-bottom: 10px;
}

.cost-value {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.recover-value {
  font-size: 12px;
  color: #67c23a;
  margin-left: 10px;
}

.input-section {
  margin-bottom: 20px;
}

.input-card {
  margin-bottom: 20px;
}

.result-section {
  margin-top: 20px;
}

.result-card {
  margin-bottom: 20px;
}

.result-item {
  text-align: center;
  padding: 20px;
  background-color: #f0f2f5;
  border-radius: 4px;
  margin-bottom: 15px;
}

.result-item.small {
  padding: 15px;
}

.result-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.result-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.result-item.small .result-value {
  font-size: 20px;
}

.total-income {
  color: #67c23a;
}

.total-cost {
  color: #e6a23c;
}

.profit-positive {
  color: #67c23a;
}

.profit-negative {
  color: #f56c6c;
}

.fee-commission {
  color: #909399;
}

.part-cost-section {
  margin-top: 20px;
}

.part-cost-card {
  margin-bottom: 20px;
}

.part-cost-list-container {
  margin: 10px 0;
}

.part-cost-list {
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-state.small {
  padding: 30px 20px;
}

.empty-state.small i {
  font-size: 40px !important;
}

.empty-state.small p {
  margin-top: 10px !important;
  font-size: 12px !important;
}

.el-table__body {
  min-height: 50px;
}

.part-cost-card .el-card__body {
  padding: 15px;
}

.part-cost-list .el-table {
  margin: 0;
}

.part-cost-list .el-table th {
  padding: 10px 0;
}

.part-cost-list .el-table td {
  padding: 8px 0;
}

.part-cost-list .el-table__header-wrapper .el-table__header th {
  text-align: center;
}

.part-cost-list .el-table__body-wrapper {
  max-height: 600px;
  overflow-y: auto;
}

.el-table-column--selection,
.el-table-column--index,
.el-table-column--expand {
  display: none !important;
}

.el-table-column--selection .cell,
.el-table-column--index .cell,
.el-table-column--expand .cell {
  display: none !important;
}

.dialog-footer {
  text-align: right;
}

@media (max-width: 768px) {
  .el-row {
    flex-direction: column;
  }
  
  .el-col {
    width: 100% !important;
    margin-bottom: 20px;
  }
  
  .upc-input-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .upc-input-wrapper .el-input {
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 10px;
  }
  
  .key-info-section .el-row {
    flex-direction: column;
  }
  
  .key-info-section .el-col {
    width: 100% !important;
    margin-bottom: 10px;
  }
  
  .part-cost-section .el-row {
    flex-direction: column;
  }
  
  .part-cost-section .el-col {
    width: 100% !important;
    margin-bottom: 20px;
  }
  
  .part-cost-section .el-table-column--fixed {
    display: none !important;
  }
  
  .part-cost-section .el-table__header-wrapper .el-table__header th,
  .part-cost-section .el-table__body-wrapper .el-table__body td {
    padding: 6px 0;
    font-size: 12px;
  }
  
  /* 利润计算公式样式 */
  .result-formula {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    border-left: 4px solid #409eff;
  }
  
  .formula-label {
    font-weight: bold;
    color: #606266;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .formula-content {
    font-family: 'Courier New', Courier, monospace;
    font-size: 16px;
    color: #303133;
    line-height: 1.5;
    word-break: break-all;
  }
}
</style>