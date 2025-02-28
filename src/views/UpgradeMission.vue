<template>
  <div class="about">
    <div style="padding: 10px;">
      <router-link to="/">改机任务列表 |</router-link>
      <router-link to="/"> 统计</router-link>
    </div>

    <div class="" style="">
      <el-row>
        <el-col :span="13">
          <el-container>
            <el-header>
              <el-dropdown
                @command="
                  e => {
                    searchKey = e;
                    searchParam = '';
                  }
                "
              >
                <el-button type="primary">
                  {{ searchBtnText(searchKey)
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="date">日期</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-input
                v-model="searchParam"
                v-if="searchKey != 'date'"
                style="margin:0 10px;"
                @keyup.enter.native="searchRecord"
              ></el-input>

              <el-date-picker
                v-else
                style="margin: 0 10px; width: 50%;"
                v-model="searchParam"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>

              <el-button type="primary" @click="searchRecord">
                搜索 <i class="el-icon-search"></i>
              </el-button>
            </el-header>
            <el-container v-loading="loading">
              <el-main>
                <el-table
                  :height="table_max_height"
                  v-loading="loading"
                  :data="tableData"
                  stripe
                >
                  <el-table-column prop="id" label="ID" width="100">
                  </el-table-column>
                  <el-table-column prop="operator" label="操作员" width="80">
                  </el-table-column>
                  <el-table-column prop="brand" label="品牌" width="100">
                  </el-table-column>
                  <el-table-column prop="upc" label="UPC" width="120">
                  </el-table-column>
                  <el-table-column :formatter="ssdFmt" label="SSD" width="100">
                  </el-table-column>
                  <el-table-column prop="system" label="系统" width="120">
                  </el-table-column>
                  <el-table-column
                    prop="updated_at"
                    label="创建时间"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                      >
                        删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
              <el-aside width="120px">
                <el-button
                  type="primary"
                  style="width: 100px;height: 100px;"
                  @click="drawer = !drawer"
                  >新增任务
                </el-button>
              </el-aside>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="11">
          <el-row>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="操作员" name="operator"></el-tab-pane>
              <el-tab-pane label="品牌" name="brand"></el-tab-pane>
              <el-tab-pane label="SSD" name="ssd"></el-tab-pane>
              <el-tab-pane label="UPC" name="upc"></el-tab-pane>
            </el-tabs>
            <div ref="chart" style="width: 100%; height: 500px;"></div>
          </el-row>
          <el-row>
            <div style="width: 100%; height: 100%; background-color: aqua;">
              adsfasdf
            </div>
          </el-row>
        </el-col>
      </el-row>
      <el-drawer
        @opened="onOpen"
        :modal="false"
        title="新增改机任务"
        :visible.sync="drawer"
        :append-to-body="true"
      >
        <div style="padding: 20px;">
          <el-row class="row-bg">
            <el-select
              style="width: 100%;"
              v-model="missionData.brand"
              placeholder="请选择品牌"
            >
              <el-option
                v-for="(item, index) in config.brand"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-row>
          <el-row class="row-bg">
            <el-input
              v-model="missionData.upc"
              placeholder="请输入UPC"
            ></el-input>
          </el-row>
          <el-row class="row-bg">
            <el-select
              style="width: 100%;"
              v-model="missionData.capacity1"
              placeholder="请选择SSD1"
            >
              <el-option
                v-for="(item, index) in config.ssd"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-row>
          <el-row class="row-bg">
            <el-select
              style="width: 100%;"
              v-model="missionData.capacity2"
              placeholder="请选择SSD2"
            >
              <el-option
                v-for="(item, index) in config.ssd"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-row>
          <el-row class="row-bg">
            <el-select
              style="width: 100%;"
              v-model="missionData.system"
              placeholder="请选择系统"
            >
              <el-option
                v-for="(item, index) in config.system"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-row>
          <el-row class="row-bg">
            <el-select
              style="width: 100%;"
              v-model="missionData.operator"
              placeholder="请选择操作员"
            >
              <el-option
                v-for="(item, index) in config.operator"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-row>

          <el-alert
            v-if="scanError.show"
            type="error"
            :title="scanError.msg"
            effect="dark"
            show-icon=""
            :closable="false"
          >
          </el-alert>
          <el-row style="text-align: center;margin-top: 30px;">
            <el-button style="width: 50%;" type="primary" @click="SubmitMission"
              >提交</el-button
            >
          </el-row>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import moment from "moment-timezone";
// import axios from 'axios'
import axios from "../js/request.js";
import axiosEx from "axios";
import { Switch } from "element-ui";
export default {
  data() {
    return {
      drawer: false,
      //展示表数据
      tableData: [],
      //查询类型
      searchKey: "date",
      //时间快捷选项
      scanError: {
        show: false,
        msg: ""
      },
      loading: false,
      //搜索条件
      searchParam: "",
      //页面数据
      table_max_height: window.innerHeight - 220,
      missionData: {},
      activeName: "operator",
      config: {
        brand: [],
        ssd: [],
        operator: [],
        system: []
      },
      myChart: null
    };
  },
  created() {
    this.getInitData();
  },

  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(this.$refs.chart);
    window.addEventListener("resize", this.resizeChart);
  },

  watch: {
    tableData(newValue, oldValue) {
      // console.log(this.activeName);
      this.handleClick();
    }
  },
  methods: {
    ssdFmt(row, column, cellValue, index) {
      let ssd1 = this.tableData[index].capacity1;
      let ssd2 = this.tableData[index].capacity2;
      return `${ssd1} ${ssd2 ? "+ " + ssd2 : ""}`;
    },
    getInitData() {
      axios.get("getMissionsToday").then(e => {
        this.tableData = e.data;
      });
      axios.get("getConfig").then(e => {
        let temp = this.config;
        let result = e.data;
        for (let key in temp) {
          temp[key] = result[key].split(",");
        }
        this.confg = temp;
      });
    },
    searchBtnText(e) {
      var text = "";
      switch (e) {
        case "order":
          text = "订单号";
          break;
        case "tracker":
          text = "运单号";
          break;
        case "date":
          text = "日期";
          break;
      }
      return text;
    },
    searchRecord(e) {
      if (this.searchParam.length == 0) {
        return;
      }
      this.loading = true;
      axios
        .post("searchMissions", {
          type: this.searchKey,
          param: this.searchParam
        })
        .then(res => {
          this.tableData = res.data;
          this.loading = false;
        })
        .catch(e => {
          console.log(e);
          if (e.statusCode != 200) {
            alert("出错了！");
            this.loading = false;
          }
        });
    },
    onSubmit(e) {
      console.log(e);
    },
    SubmitMission() {
      let data = this.missionData;
      this.loading = true;
      axios
        .post("addMission", data)
        .then(res => {
          this.getInitData();
          this.loading = false;
          this.missionData = {};
        })
        .catch(e => {
          console.log(e);
          if (e.statusCode != 200) {
            alert("出错了！");
            this.loading = false;
          }
        });
    },
    //抽屉打开时回调
    onOpen() {
      // this.$refs.tracker_input.focus();
    },
    //标签页切换
    handleClick(tab, event) {
      switch (this.activeName) {
        case "operator":
          this.chartWithOperator();
          break;
        case "brand":
          this.chartWithBrand();
          break;
        case "ssd":
          this.chartWithSSD();
          break;
        case "upc":
          this.chartWithUPC();
          break;
        default:
          this.chartWithOperator();
          break;
      }
    },
    handleDelete(index, row) {
      this.$confirm("此操作将删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post("rmMission", {
              id: row.id,
              express_num: row.express_num
            })
            .then(res => {
              if (res.ret == 0) {
                this.tableData.splice(index, 1);
              } else {
                alert(res.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //配置图标数据函数
    chartWithOperator() {
      // 指定图表的配置项和数据
      let data = this.tableData;
      let xdata = {};
      for (let value of data) {
        if (!xdata[value.operator]) {
          xdata[value.operator] = 0;
        }
        xdata[value.operator] += 1;
      }
      let result = [];
      for (let key in xdata) {
        result.push({
          value: xdata[key],
          name: key
        });
      }

      var option = {
        title: {
          text: `总数：${data.length}`
        },
        tooltip: {
          trigger: "item" // 触发类型为数据项
        },
        series: [
          {
            type: "pie",
            data: result
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.clear();
      this.myChart.setOption(option);
    },
    chartWithBrand() {
      // 指定图表的配置项和数据
      let data = this.tableData;
      let xdata = {};
      for (let value of data) {
        if (!xdata[value.brand]) {
          xdata[value.brand] = 0;
        }
        xdata[value.brand] += 1;
      }
      let x = [];
      let result = [];
      for (let key in xdata) {
        x.push(key);
        result.push(xdata[key]);
      }
      this.setOptionWithCharbar(x, result);
    },
    chartWithSSD() {
      // let data = this.tableData;
      // let config = this.config;
      // let x = config.ssd;
      // let xdata = {};
      // for (let key of x) {
      //   xdata[key] = 0;
      // }
      // for (let key of x) {
      //   for (let value of data) {
      //     if (value.capacity1 == key) {
      //       xdata[key] += 1;
      //     }
      //   }
      //   for (let value of data) {
      //     if (value.capacity2 == key) {
      //       xdata[key] += 1;
      //     }
      //   }
      // }
      // let result = []
      // for (let key in xdata) {
      //   result.push(xdata[key]);
      // }

      let data = this.tableData;
      let xdata = {};
      for (let value of data) {
        if (!xdata[value.capacity1]) {
          xdata[value.capacity1] = 0;
        }
        xdata[value.capacity1] += 1;
        if (value.capacity2) {
          if (!xdata[value.capacity2]) {
            xdata[value.capacity2] = 0;
          }
          xdata[value.capacity2] += 1;
        }
      }
      let x = [];
      let result = [];
      for (let key in xdata) {
        x.push(key);
        result.push(xdata[key]);
      }
      this.setOptionWithCharbar(x, result);
    },
    chartWithUPC() {
      let data = this.tableData;
      let xdata = {};
      for (let value of data) {
        if (!xdata[value.upc]) {
          xdata[value.upc] = 0;
        }
        xdata[value.upc] += 1;
      }
      let result = [];
      for (let key in xdata) {
        result.push({
          value: xdata[key],
          name: key
        });
      }
      var option = {
        title: {
          text: `总数：${data.length}`
        },
        tooltip: {
          trigger: "item" // 触发类型为数据项
        },
        series: [
          {
            type: "pie",
            data: result
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.clear();
      this.myChart.setOption(option);
    },
    setOptionWithCharbar(x, value) {
      var option = {
        tooltip: {},
        legend: {
          data: []
        },
        xAxis: {
          data: x
        },
        yAxis: {
          minInterval: 1
        },
        series: [
          {
            name: "",
            type: "bar",
            data: value
          }
        ]
      };
      this.myChart.clear();
      this.myChart.setOption(option);
    },
    resizeChart() {
      if (this.myChart) {
        this.myChart.resize();
      }
    }
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  align-items: center;
  padding: 0 3rem;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.row-bg {
  padding: 10px 0;
}
</style>
