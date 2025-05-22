<template>
  <div class="about" style="text-align: center;">
    <my-navi activeIndex="8"></my-navi>

    <div style="width: 66%; margin: 0 17%;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-container>
            <el-header style="justify-content: space-between;">
              <label>UPC 取</label>
              <label>库存：{{ stores }}</label>
              <label></label>
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
                    <el-button
                      :disabled="load_btn_status.disable"
                      @click="loadUPC"
                      type="primary"
                      >{{ load_btn_status.title }}</el-button
                    >
                  </el-col>
                  <el-col :span="5">
                    <el-button
                      @click="copy_upcs_str"
                      class="copy_upcs"
                      :data-clipboard-text="upcs_load"
                      type="primary"
                      >复制到剪切板</el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </el-footer>
          </el-container>
        </el-col>
        <el-col :span="12">
          <el-container>
            <el-header>UPC 存</el-header>
            <el-main>
              <el-input
                v-model="upcs_save"
                type="textarea"
                :rows="30"
                placeholder="请输入内容"
              >
              </el-input>
            </el-main>
            <el-footer>
              <div>
                <el-row :gutter="10">
                  <el-col :span="4">
                    口令：
                  </el-col>
                  <el-col :span="10">
                    <el-input
                      v-model="pwd"
                      show-password
                      placeholder="请输入口令"
                    ></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-button
                      :disabled="save_btn_status.disable"
                      @click="save_upc"
                      type="primary"
                      >{{ save_btn_status.title }}</el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </el-footer>
          </el-container>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "../js/request.js";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      upcs_save: "",
      upcs_load: "",
      pwd: "",
      qty: 0,
      stores: "",
      save_btn_status: {
        disable: false,
        title: "存入 UPC"
      },
      load_btn_status: {
        disable: false,
        title: "获取 UPC"
      },
      showHeight: window.innerHeight - 220,
	  interval:null
    };
  },
  created() {
    this.loadUPCStores();
    this.interval = setInterval(this.loadUPCStores, 30000);
  },
  beforeDestroy() {
  	clearInterval(this.interval)
  },
  methods: {
    loadUPCStores() {
      axios.get("getupcstore").then(e => {
        this.stores = e.data;
      });
    },
    save_upc() {
      let status = this.save_btn_status;
      let status_ori = { ...status };
      status.disable = true;
      status.title = "存储ing...";
      this.save_btn_status = status;

      let upcArr = this.upcs_save.split(/[(\r\n)\r\n]+/);
      axios
        .post("upload", {
          upcs: upcArr,
          token: this.pwd
        })
        .then(e => {
          if (e.ret != 0) {
            this.$alert(e.msg, "存入失败", {
              confirmButtonText: "确定",
              type: "error"
            });
          } else {
            this.$alert("存入成功", "成功", {
              confirmButtonText: "确定",
              type: "success"
            });
          }
          this.save_btn_status = status_ori;
          this.upcs_save = "";
        })
        .catch(e => {
          this.$message.error("请求出错了");
          this.save_btn_status = status_ori;
        });
    },
    loadUPC() {
      this.upcs_load = "";
      let status = this.load_btn_status;
      let status_ori = { ...status };
      status.disable = true;
      status.title = "获取中...";
      this.load_btn_status = status;
      let count = 5;
      let timer = setInterval(() => {
        status.title = `获取间隔(${count})`;
        this.load_btn_status = status;
        if (count == 0) {
          this.load_btn_status = status_ori;
          clearInterval(timer);
          timer = null;
        }
        count--;
      }, 1000);
      axios
        .get(`getupcs?count=${this.qty}`)
        .then(e => {
          console.log(e);
          if (e.ret != 0) {
            this.$alert(e.msg, "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          } else {
            let upcAry = e.data;
            let upcs_str = "";
            for (var upc of upcAry) {
              console.log(upc);
              upcs_str += upc + "\r\n";
            }
            this.upcs_load = upcs_str;

            this.loadUPCStores();
          }
        })
        .catch(e => {
          this.$message.error("请求出错了");
          this.load_btn_status = status_ori;
        });
    },
    copy_upcs_str() {
      this.check_when_copyed(".copy_upcs");
    },
    check_when_copyed(identify) {
      const clipboard = new Clipboard(identify);
      clipboard.on("success", e => {
        this.$message({
          type: "success",
          message: "已复制到剪切板"
        });
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        this.$message.error("该浏览器不支持复制");
        // 释放内存
        clipboard.destroy();
      });
    }
  }
};
//test
</script>

<style></style>
