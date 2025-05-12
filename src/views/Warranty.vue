<template>
  <div class="about">
    <my-navi activeIndex="5"></my-navi>
    <!-- <h2>Return & Warranty</h2> -->
    <div class="" style="">
      <el-container>
        <el-header style="position: relative;">
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
              <el-dropdown-item command="rt_id">ReturnID</el-dropdown-item>
              <el-dropdown-item command="order">Oder#</el-dropdown-item>
              <el-dropdown-item command="upc">UPC</el-dropdown-item>
              <el-dropdown-item command="model">Model</el-dropdown-item>
              <el-dropdown-item command="tracker">Tracking</el-dropdown-item>
              <el-dropdown-item command="SN">SN</el-dropdown-item>
              <el-dropdown-item command="date">Date</el-dropdown-item>
              <el-dropdown-item command="fraud">Fraud</el-dropdown-item>
              <el-dropdown-item command="junk">Junk</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-input
            v-model="searchParam"
            v-if="searchKey != 'date'"
            style="margin:0 10px; width: 70%;"
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
          <!-- <el-button type="primary" style="position: absolute; right: 50px;"
						@click="directToAdd">新增退货</el-button> -->
        </el-header>
        <el-container>
          <el-main style="padding-top: 0 !important;">
            <div
              style="padding: 10px 0;text-align: left; display: flex; align-items: center;"
            >
              <div style="margin-left: 20px;">
                <span>Store:</span>
                <el-autocomplete
                  style="width: 120px;"
                  v-model="filters.seller"
                  :fetch-suggestions="sellerQuerySearch"
                ></el-autocomplete>
              </div>
              <div
                style="margin-left: 20px;display: flex; align-items: center;"
              >
                <span>Operator:</span>
                <el-input
                  style="width: 120px;"
                  v-model="filters.operator"
                ></el-input>
              </div>
              <div style="margin-left: 20px;">
                <span>Method:</span>
                <el-select v-model="filters.repairMethod">
                  <el-option label="Factory" value="Factory"></el-option>
                  <el-option label="Warehouse" value="Warehouse"></el-option>
                </el-select>
              </div>
              <div style="margin-left: 20px;">
                <span>Defects:</span>
                <el-select v-model="filters.defects">
                  <el-option
                    v-for="(option, index) in defectsOption"
                    :key="index"
                    :label="option"
                    :value="option"
                  ></el-option>
                </el-select>
              </div>

              <div style="margin-left: 20px;">
                <el-button type="primary" @click="filter">Filter</el-button>
              </div>
              <div style="margin-left: 20px;">
                <el-button type="primary" @click="clearfilter">Clear</el-button>
              </div>
            </div>
            <el-table
              ref="dataTable"
              @cell-click="cellClickCopy"
              @row-dblclick="rowClickRead"
              :height="table_max_height"
              v-loading="loading"
              :data="tableData"
              :row-style="markRefundedRows"
            >
              <el-table-column prop="rt_id" label="ID" width="100">
              </el-table-column>
              <!-- <el-table-column prop="decision" label="Decision" width="110" :formatter="decisionFmt">
							</el-table-column> -->
              <!-- <el-table-column prop="rec_dt" label="Received On" width="110" :formatter="dateformat">
							</el-table-column> -->
              <el-table-column
                prop="created_at"
                label="Processed On"
                width="120"
                :formatter="dateformat"
              >
              </el-table-column>
              <el-table-column prop="brand" label="Brand" width="90">
              </el-table-column>
              <el-table-column prop="model" label="Model" width="200">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.model">
                    <div class="no-wrap">{{ scope.row.model }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="upc" label="UPC" width="115">
              </el-table-column>
              <el-table-column prop="sn" label="SN" width="160">
              </el-table-column>

              <!-- <el-table-column prop="rt_track" label="Return Tracking" width="170">
							</el-table-column> -->
              <el-table-column
                prop="war_ori_config"
                label="Origin Config"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="cur_config"
                label="Current Config"
                width="180"
              >
              </el-table-column>
              <!-- <el-table-column prop="lb_type" label="Label Type" width="100">
							</el-table-column> -->
              <!-- <el-table-column prop="order_id" label="Order#" width="170">
							</el-table-column> -->
              <el-table-column
                prop="seller"
                label="Store"
                width="90"
                :filter-method="filterMethod"
              >
              </el-table-column>
              <!-- el-table-column prop="creator" label="Operator" width="90">
							</el-table-column> -->
              <!-- <el-table-column prop="rt_dt" label="Returned Date" width="120" :formatter="dateformat">
							</el-table-column> -->

              <!-- <el-table-column prop="rt_cmt" label="Condition Notes:" width="200">
							</el-table-column> -->
              <!-- <el-table-column prop="rt_cmt_cs" label="Comments for service" width="200">
							</el-table-column> -->
              <!-- <el-table-column prop="rt_reason" label="Return Reason" width="200">
							</el-table-column> -->
              <el-table-column
                prop="war_expire_dt"
                label="Expire On"
                width="100"
                :formatter="dateformat"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="war_opr"
                label="Warranty Operator"
                width="160"
                :filter-method="filterMethod"
              >
              </el-table-column>
              <el-table-column
                prop="war_method"
                label="Repair Method"
                width="140"
                :filter-method="filterMethod"
              >
              </el-table-column>
              <el-table-column
                prop="war_track_out"
                label="Outbound Tracking"
                width="170"
              >
              </el-table-column>
              <el-table-column
                prop="war_track_in"
                label="Inbound Tracking"
                width="170"
              >
              </el-table-column>
              <el-table-column
                prop="war_dt"
                label="Repair Date"
                width="100"
                :formatter="dateformat"
              >
              </el-table-column>
              <el-table-column prop="war_case" label="Case#" width="150">
              </el-table-column>
              <el-table-column
                prop="war_def"
                label="Defects"
                width="180"
                :filter-method="filterMethod"
              >
              </el-table-column>
              <el-table-column
                prop="war_cmt"
                label="Warranty Comments"
                width="200"
              >
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.war_cmt">
                    <div class="no-wrap">{{ scope.row.war_cmt }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)"
                  >
                    Edit</el-button
                  >
                  <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
										Del</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import axios from "../js/request.js";
import { DefectsOption, SellerOption } from "../js/defaultRtWarObj.js";

export default {
  data() {
    return {
      //展示表数据
      tableData: [],
      //查询类型
      searchKey: "order",
      //搜索条件
      searchParam: "",
      //页面数据
      table_max_height: window.innerHeight - 220,
      //加载
      loading: false,
      defectsOption: DefectsOption,
      sellerOption: SellerOption,
      filters: {
        seller: "",
        operator: "",
        repairMethod: "",
        defects: ""
      }
    };
  },
  created() {
    // 当且仅当从B页面返回时恢复数据
    if (
      this.$store.state.previousRoute?.name === "addreturn" &&
      this.$store.state.tempPageAData
    ) {
      Object.assign(this.$data, this.$store.state.tempPageAData);
      this.$store.commit("clearTempPageAData"); // 恢复后立即清除缓存
    } else {
      this.getInitData();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "addreturn") {
      this.$store.commit("setTempPageAData", this.$data);
    }
    next();
  },
  mounted() {
    //回退后筛选保持数据
    this.filter();
  },
  methods: {
    activeFilterChange(prop, value) {
      const table = this.$refs.dataTable;
      let columnIndex = table.columns.findIndex(
        column => column.property == prop
      );
      let column = table.columns[columnIndex];
      column.filteredValue = [...value];
      table.store.commit("filterChange", {
        column,
        values: column.filteredValue,
        silent: true
      });
    },
    filter() {
      let filterOption = this.filters;
      this.activeFilterChange(
        "seller",
        filterOption.seller === "" ? [] : [filterOption.seller]
      );
      this.activeFilterChange(
        "war_opr",
        filterOption.operator === "" ? [] : [filterOption.operator]
      );
      this.activeFilterChange(
        "war_method",
        filterOption.repairMethod === "" ? [] : [filterOption.repairMethod]
      );
      this.activeFilterChange(
        "war_def",
        filterOption.defects === "" ? [] : [filterOption.defects]
      );
    },
    clearfilter(key) {
      let filters = {
        seller: "",
        operator: "",
        repairMethod: "",
        defects: ""
      };
      this.filters = filters;
      this.filter();
      // this.$refs.dataTable.clearFilter();
    },
    getInitData() {
      this.loading = true;
      axios
        .get("getWarranty")
        .then(e => {
          this.tableData = e.data;
          this.loading = false;
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    dateformat(row, column, cellValue, index) {
      if (cellValue && cellValue.includes(" ")) {
        let res = cellValue.split(" ");
        return res[0];
      } else return cellValue;
    },
    decisionFmt(row, column, cellValue, index) {
      if (cellValue) {
        let ori = [
          "Sell as new",
          "Used: Good",
          "Repair needed",
          "Junk for parts",
          "Pending Decision"
        ];
        return ori[parseInt(cellValue)];
      } else {
        return "";
      }
    },
    sellerQuerySearch(query, cb) {
      let res = [];
      for (let seller of this.sellerOption) {
        res.push({
          value: seller
        });
      }
      cb(res);
    },
    searchBtnText(e) {
      var text = "";
      switch (e) {
        case "rt_id":
          text = "ReturnID";
          break;
        case "order":
          text = "Order#";
          break;
        case "model":
          text = "Model";
          break;
        case "upc":
          text = "UPC";
          break;
        case "tracker":
          text = "Tracking";
          break;
        case "SN":
          text = "SN";
          break;
        case "date":
          text = "Date";
          break;
        case "fraud":
          text = "Fraud";
          this.searchParam = "点击搜索全部 Fraud";
          break;
        case "junk":
          text = "Junk";
          this.searchParam = "点击搜索全部 Junk for parts";
          break;
      }
      return text;
    },
    searchRecord() {
      if (this.searchParam.length == 0) {
        return;
      }
      this.loading = true;
      axios
        .post("searchreturn", {
          type: this.searchKey,
          param: this.searchParam,
          category: "warranty"
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

    handleEdit(index, row) {
      this.$router.push({
        path: "/addreturn",
        query: {
          readOnly: "no",
          data: JSON.stringify(row)
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将删除该运单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //导航到创建页
    directToAdd() {},

    //标记已退款的行
    markRefundedRows({ row, index }) {
      if (row.is_refunded) {
        return {
          // backgroundColor: "#f6ffed", // 成功状态背景
          color: "#ff8d22", // 主文字颜色
          // borderBottom: "2px solid #b7eb8f" // 底部边框
        };
      }
    },

    //点击行 阅览
    rowClickRead(row, column, event) {
      this.$router.push({
        path: "/addreturn",
        query: {
          readOnly: "yes",
          data: JSON.stringify(row)
        }
      });
    },

    //单元格点击复制
    cellClickCopy(row, column, cell, event) {
      let cellText = cell.textContent || cell.innerText;
      if (column.property && cellText.length) {
        navigator.clipboard.writeText(cellText).then(e => {
          this.$message({
            type: "success",
            message: "已复制到剪切板"
          });
        });
      }
    },
    filterMethod(value, row, column) {
      return row[column.property] === value;
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
</style>
