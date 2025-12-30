<template>
  <div>
    <my-navi activeIndex="11"></my-navi>
    <div>
      <h3>Amazon Invoice Generator</h3>
      <el-form>
        <el-form-item label="#Order">
          <el-input v-model="formData.order"></el-input>
        </el-form-item>
        <el-form-item label="Order Date">
          <el-input v-model="formData.order_date"></el-input>
        </el-form-item>
        <el-form-item label="Title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="Price before tax">
          <el-input v-model="formData.price"></el-input>
        </el-form-item>
        <el-form-item label="Tax">
          <el-input v-model="formData.tax"></el-input>
        </el-form-item>
        <el-form-item label="Store Name">
          <el-input v-model="formData.store"></el-input>
        </el-form-item>
        <el-form-item label="Shipping Address">
          <el-input
            type="textarea"
            autosize
            v-model="formData.ship_addr"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="exportWord">Output Invoice</el-button>
    </div>
  </div>
</template>

<script>
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
export default {
  data() {
    return {
      formData: {
        order: "",
        order_date: "",
        title: "",
        price: 0,
        qty: "",
        tax: 0,
        ship_addr: "",
        store: ""
      }
    };
  },
  methods: {
    generateMultiple4DigitNumbers(count) {
      const numbers = [];
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * 9000) + 1000);
      }
      return numbers;
    },
    async exportWord() {
      try {
        // 1. 加载模板文件（假设模板放在public目录）
        const response = await fetch("/order-document.docx");
        const arrayBuffer = await response.arrayBuffer();

        // 2. 解压文档
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true
        });

        // 3. 替换占位符
        doc.setData({
          order: this.formData.order,
          order_date: this.formData.order_date,
          title: this.formData.title,
          price: `$${this.formData.price}`,
          tax: `$${this.formData.tax}`,
          total: `$${parseFloat(this.formData.price) +
            parseFloat(this.formData.tax)}`,
          cre_card: this.generateMultiple4DigitNumbers(1),
          ship_addr: this.formData.ship_addr,
          qty: 1,
          store: this.formData.store
        });

        // 4. 渲染文档
        doc.render();

        // 5. 生成Blob并导出
        const out = doc.getZip().generate({
          type: "blob"
        });
        saveAs(out, `invoce.docx`);
      } catch (error) {
        console.error("导出失败:", error);
        alert(`导出失败: ${error.message}`);
      }
    }
  }
};
</script>

<style></style>
