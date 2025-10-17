<template>
  <div class="about">
    <my-navi activeIndex="14"></my-navi>
    <el-container>
      <el-header>
        <el-upload
          :on-change="loadFile"
          :before-upload="fileCheck"
          :show-file-list="false"
          accept=".xlsx, .xls, .csv"
        >
          <el-button slot="trigger" size="small" type="primary"
            >加载楼兰 Inventory Summary 表</el-button
          >
          <el-label style="margin-left:10px;"
            >最后更新时间：{{ updated_at }}</el-label
          >
          <el-tag style="margin-left: 20px; color: darkblue;"
            >库存表会保存在本地，无需频繁加载，但请积极更新楼兰库存，保证正确获取
            Model 和 Product Name</el-tag
          >
        </el-upload>
      </el-header>
      <el-main>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="12">
            <el-row type="flex" justify="start">
              <el-upload
                :on-change="loadFile"
                :before-upload="fileCheck"
                :show-file-list="false"
                accept=".xlsx, .xls, .csv"
              >
                <el-button slot="trigger" type="primary"
                  >加载楼兰 Check Out Package 表</el-button
                >
              </el-upload>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="end">
              <el-button type="primary" @click="exporCaExcel"
                >导出Excel结果</el-button
              >
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-table :data="tableData">
            <el-table-column label="UPC" prop="UPC" width="180px" />
            <el-table-column label="Qty" prop="Qty" width="50px" />
            <el-table-column label="Model" prop="Model" width="250px" />
			<el-table-column label="Avg Cost" prop="Price" width="100px"/>
            <el-table-column label="Product Name" prop="ItemName" />
          </el-table>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { dateFormat } from "../js/Dateformat";
export default {
  data() {
    return {
      updated_at: localStorage.getItem("LOULAN_INVENTORY")
        ? JSON.parse(localStorage.getItem("LOULAN_INVENTORY")).updated_at
        : "暂未上传",
      //存储楼兰库存字典
      jsonData: localStorage.getItem("LOULAN_INVENTORY")
        ? JSON.parse(localStorage.getItem("LOULAN_INVENTORY")).data
        : null,
      tableData: null
    };
  },
  mounted() {},
  methods: {
    fileCheck(file) {
      const extension = file.name
        .split(".")
        .pop()
        .toLowerCase();
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "text/csv"
      ];
      const isText =
        validTypes.includes(file.type) ||
        ["xls", "xlsx", "csv"].includes(extension);
      if (!isText) {
        this.$message.error("只能上传Excel文件");
      }
      return false;
    },
    loadFile(file) {
      const extension = file.name
        .split(".")
        .pop()
        .toLowerCase();
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "text/csv"
      ];
      const isText =
        validTypes.includes(file.type) ||
        ["xls", "xlsx", "csv"].includes(extension);
      if (!isText) return;
      this.filename = file.raw.name;
      this.readFileContent(file);
    },
    readFileContent(file) {
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
    processExcelData(data, filename) {
      try {
        // 读取Excel工作簿
        let workbook = XLSX.read(data, {
          type: "array"
        });

        // 获取所有工作表名称
        let sheets = workbook.SheetNames;
        let selectedSheet = sheets[0];
        // 处理第一个工作表
        this.processSelectedSheet(workbook, selectedSheet, filename);
      } catch (error) {
        console.error("Excel处理错误:", error);
        alert("Excel文件处理失败，请确保文件格式正确");
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
        let json_obj = {};
        for (let item of json_data) {
          let upc = item.Barcode;
          let name = item["Product Name"];
          let model = item.Model;
		  let price = item["Avg $Price"]
          json_obj[upc] = {
            name: name,
            model: model,
			price: price
          };
        }

        let data = {
          data: json_obj,
          updated_at: dateFormat(new Date())
        };
        this.updated_at = data.updated_at;
        this.jsonData = json_obj;
        localStorage.setItem("LOULAN_INVENTORY", JSON.stringify(data));
        this.$message.success("更新成功");
      }

      if (filename.includes("Check Out")) {
        const data = json_data.filter(e => {
          let value = e["3PL Memo"];
          if (!value) {
            return false;
          }
          return (
            value.toUpperCase().includes(" 701-") ||
            value.toUpperCase().includes("：701-") ||
            value.toUpperCase().includes(" 702-") ||
            value.toUpperCase().includes("：702-") ||
            value.toUpperCase().includes("BBY") ||
            value.toUpperCase().includes("CHILL AU") ||
            value.toUpperCase().includes("ONT_AU")
          );
        });
        let obj = {};
        for (let item of data) {
          let upc = item.UPC;
          let qty = item.Qty;
          if (!obj[upc]) {
            obj[upc] = 0;
          }
          obj[upc] += qty;
        }
        let array = [];
        for (let key in obj) {
          let infoObj = this.jsonData[key];
          let item = {
            UPC: key,
            ItemName: infoObj
              ? infoObj.name
              : "无有效库存(没货了)，请移步至楼兰查询 Out of stock",
            Model: infoObj ? infoObj.model : "",
			Price: infoObj ? infoObj.price : "",
            Qty: obj[key]
          };
          array.push(item);
        }
        array.sort((a, b) => {
          return b.Qty - a.Qty;
        });
        this.tableData = array;
      }
    },
    exporCaExcel() {
      let data = this.tableData;
      let exportData = ["UPC", "Qty", "Model" , "Avg Cost", "Product Name"];
      let exportAry = [exportData];
      for (let item of data) {
        exportAry.push([item.UPC, item.Qty, item.Model, item.Price, item.ItemName]);
      }
      const wb = XLSX.utils.book_new();
      // 创建工作表
      const ws = XLSX.utils.aoa_to_sheet(exportAry);

      // 获取工作表的范围
      const range = {
        s: { r: 0, c: 0 },
        e: { r: data.length, c: 5 }
      };

      // 设置表头样式（例如：蓝色背景）
      ws["!rows"] = ws["!rows"] || [];
      ws["!cols"] = ws["!cols"] || [];
      ws["!rows"][0] = { hpt: 20, hpx: 20 }; // 设置表头行高
      ws["!cols"][0] = { wch: 20 };
      ws["!cols"][1] = { wch: 10 };
      ws["!cols"][2] = { wch: 25 };
	  ws["!cols"][3] = { wch: 10 };
      ws["!cols"][4] = { wch: 200 };

      // 设置斑马线背景色（例如：奇偶行不同颜色）
      for (let R = range.s.r; R <= range.e.r; ++R) {
        let cell_address = { c: range.s.c, r: R };
        let cell_ref = XLSX.utils.encode_cell(cell_address);
        if (R % 2 === 0) {
          // 偶数行，例如斑马线中的白色行
          ws[cell_ref].s = {
            fgColor: { rgb: "FFFFFFFF", auto: true }
          }; // 设置白色背景
        } else {
          // 奇数行，例如斑马线中的灰色行
          ws[cell_ref].s = { fgColor: { rgb: "FF7AB5C9" } }; // 设置浅灰色背景
        }
      }

      // // 设置表头颜色（例如：第一行蓝色背景）
      // ws["A1"].s = { fill: { fgColor: { rgb: "FF0000FF" } } }; // 设置第一列第一行为蓝色背景
      // ws["B1"].s = { fill: { fgColor: { rgb: "FF0000FF" } } }; // 设置第二列第一行为蓝色背景
      // 可以继续为其他表头单元格设置样式...
      console.log(ws);
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      // 导出文件
      XLSX.writeFile(wb, `CaTrans_${dateFormat(new Date())}.xlsx`);
    }
  }
};
</script>

<style></style>
