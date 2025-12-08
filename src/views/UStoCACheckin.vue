<template>
  <div class="container">
    <MyNavi activeIndex="15"></MyNavi>
    <div class="main-content">
      <h2>US to CA Check-in</h2>
      
      <!-- 上传库存文件区域 -->
      <div class="upload-section">
        <el-upload
          :on-change="loadInventoryFile"
          :before-upload="fileCheck"
          :show-file-list="false"
          accept=".xlsx, .csv, .xlsm, .xls"
        >
          <el-button slot="trigger" size="small" type="primary">
            加载楼兰 Inventory Summary 表
          </el-button>
          <el-label style="margin-left: 10px;">
            最后更新时间：{{ updated_at }}
          </el-label>
        </el-upload>
      </div>
      
      <!-- 扫描区域 -->
      <div class="scan-section">
        <el-input
          v-model="scanInput"
          placeholder="扫描UPC条形码..."
          clearable
          @keyup.enter.native="handleScan"
          ref="scanInput"
        >
          <el-button slot="append" icon="el-icon-check" @click="handleScan"></el-button>
        </el-input>
      </div>
      
      <!-- 数据展示表格 -->
      <div class="table-section">
        <div style="margin-bottom: 10px;">
          <el-button type="primary" @click="copyToClipboard">复制所有数据到剪贴板</el-button>
        </div>
        <el-table
          :data="scanData"
          style="width: 100%"
          :row-class-name="highlightRow"
        >
          <el-table-column prop="upc" label="UPC" width="180"></el-table-column>
          <el-table-column prop="qty" label="Qty" width="150">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.qty"
                :min="1"
                @change="handleQtyChange(scope.row)"
                style="width: 100%"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="Avg $Price" width="150"></el-table-column>
          <el-table-column prop="productName" label="Product Name"></el-table-column>
          <el-table-column prop="model" label="Model" width="200"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="removeRow(scope.$index, scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import MyNavi from '../components/Navi.vue';
import * as XLSX from "xlsx";
import { dateFormat } from "../js/Dateformat";

export default {
  name: 'UStoCACheckin',
  components: {
    MyNavi
  },
  data() {
    return {
      // 扫描输入
      scanInput: '',
      // 库存数据
      inventoryData: localStorage.getItem("LOULAN_INVENTORY")
        ? JSON.parse(localStorage.getItem("LOULAN_INVENTORY")).data
        : null,
      // 最后更新时间
      updated_at: localStorage.getItem("LOULAN_INVENTORY")
        ? JSON.parse(localStorage.getItem("LOULAN_INVENTORY")).updated_at
        : "暂未上传",
      // 扫描数据列表
      scanData: [],
      // 高亮行ID
      highlightedRow: null,
      // 高亮计时器
      highlightTimer: null
    };
  },
  mounted() {
    // 自动聚焦到扫描输入框
    this.$refs.scanInput.focus();
  },
  methods: {
    // 文件检查
    fileCheck(file) {
      const extension = file.name.split(".").pop().toLowerCase();
      const validTypes = ["xls", "xlsx", "csv", "xlsm"];
      if (!validTypes.includes(extension)) {
        this.$message.error("只能上传Excel文件");
        return false;
      }
      return true;
    },
    
    // 加载库存文件
    loadInventoryFile(file) {
      const reader = new FileReader();
      reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        this.processExcelData(data, file.raw.name);
      };
      reader.onerror = () => {
        this.$message.error("文件读取失败，请重试");
      };
      reader.readAsArrayBuffer(file.raw);
    },
    
    // 处理Excel数据
    processExcelData(data, filename) {
      try {
        // 读取Excel工作簿
        let workbook = XLSX.read(data, { type: "array" });
        
        // 获取第一个工作表
        let sheets = workbook.SheetNames;
        let selectedSheet = sheets[0];
        const worksheet = workbook.Sheets[selectedSheet];
        
        // 转换为JSON
        let json_data = XLSX.utils.sheet_to_json(worksheet);
        
        // 处理库存数据
        let inventoryObj = {};
        for (let item of json_data) {
          let upc = item.Barcode;
          if (upc) {
            inventoryObj[upc] = {
              name: item["Product Name"],
              model: item.Model,
              price: item["Avg $Price"] || 0
            };
          }
        }
        
        // 保存到localStorage
        let savedData = {
          data: inventoryObj,
          updated_at: dateFormat(new Date())
        };
        this.updated_at = savedData.updated_at;
        this.inventoryData = inventoryObj;
        localStorage.setItem("LOULAN_INVENTORY", JSON.stringify(savedData));
        this.$message.success("库存数据更新成功");
        
      } catch (error) {
        console.error("Excel处理错误:", error);
        this.$message.error("Excel文件处理失败，请确保文件格式正确");
      }
    },
    
    // 处理扫描
    handleScan() {
      const upc = this.scanInput.trim();
      if (!upc) return;
      
      // 查找UPC是否已存在
      const existingIndex = this.scanData.findIndex(item => item.upc === upc);
      
      if (existingIndex >= 0) {
        // 已存在，增加数量并更新最新的产品信息
        const inventoryInfo = this.inventoryData && this.inventoryData[upc] ? this.inventoryData[upc] : {};
        // 使用Vue.set或扩展运算符确保响应式更新
        this.scanData.splice(existingIndex, 1, {
          ...this.scanData[existingIndex],
          qty: this.scanData[existingIndex].qty + 1,
          cost: inventoryInfo.price || 0,
          productName: inventoryInfo.name || "未知产品",
          model: inventoryInfo.model || ""
        });
        this.highlightedRow = this.scanData[existingIndex].id;
      } else {
        // 不存在，新增行
        const inventoryInfo = this.inventoryData && this.inventoryData[upc] ? this.inventoryData[upc] : {};
        const newRow = {
          id: Date.now(),
          upc: upc,
          qty: 1,
          cost: inventoryInfo.price || 0,
          productName: inventoryInfo.name || "未知产品",
          model: inventoryInfo.model || ""
        };
        this.scanData.push(newRow);
        this.highlightedRow = newRow.id;
      }
      
      // 高亮行效果
      this.triggerHighlight();
      
      // 清空输入框
      this.scanInput = '';
      // 重新聚焦
      this.$nextTick(() => {
        this.$refs.scanInput.focus();
      });
    },
    
    // 数量变化处理
    handleQtyChange(row) {
      // 查找当前行的索引
      const index = this.scanData.findIndex(item => item.id === row.id);
      if (index >= 0) {
        // 使用splice确保响应式更新
        this.scanData.splice(index, 1, {
          ...this.scanData[index],
          qty: row.qty
        });
        this.highlightedRow = row.id;
        this.triggerHighlight();
      }
    },
    
    // 移除行
    removeRow(index, row) {
      this.scanData.splice(index, 1);
      this.$message.success("行已删除");
    },
    
    // 高亮行逻辑
    triggerHighlight() {
      // 清除之前的计时器
      if (this.highlightTimer) {
        clearTimeout(this.highlightTimer);
      }
      
      // 3秒后移除高亮
      this.highlightTimer = setTimeout(() => {
        this.highlightedRow = null;
      }, 3000);
    },
    
    // 行高亮样式
    highlightRow({ row, rowIndex }) {
      if (row.id === this.highlightedRow) {
        return 'highlight-row';
      }
      return '';
    },
    
    // 复制数据到剪贴板
    copyToClipboard() {
      if (this.scanData.length === 0) {
        this.$message.warning('没有数据可复制');
        return;
      }
      
      // 按格式拼接数据：每一行开头添加两个空列（制表符），然后upc、qty、cost用制表符间隔，每行之间用换行符间隔
      let lines = [];
      this.scanData.forEach(row => {
        lines.push(`\t\t${row.upc}\t${row.qty}\t${row.cost}`);
      });
      
      // 使用join方法连接所有行，确保每一行都有相同的格式
      const clipboardContent = lines.join('\n');
      
      
      // 复制到剪贴板
      navigator.clipboard.writeText(clipboardContent)
        .then(() => {
          this.$message.success('数据已成功复制到剪贴板');
        })
        .catch(err => {
          console.error('复制失败:', err);
          this.$message.error('复制失败，请手动复制');
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

.upload-section {
  margin-bottom: 20px;
}

.scan-section {
  margin-bottom: 20px;
}

.table-section {
  margin-top: 20px;
}

/* 高亮行样式 - 使用深度选择器确保样式能应用到el-table行 */
::v-deep .highlight-row {
  background-color: #e6f7ff !important;
  animation: highlight 2s ease-in-out 2;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(45, 183, 245, 0.5);
}

@keyframes highlight {
  0% {
    background-color: #e6f7ff;
  }
  50% {
    background-color: #91d5ff;
  }
  100% {
    background-color: #e6f7ff;
  }
}
</style>