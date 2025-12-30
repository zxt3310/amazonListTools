<template>
  <div class="about">
    <my-navi activeIndex="6"></my-navi>
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
              <el-dropdown-item command="rt_id">Return ID</el-dropdown-item>
              <el-dropdown-item command="order">Oder#</el-dropdown-item>
              <el-dropdown-item command="upc">UPC</el-dropdown-item>
              <el-dropdown-item command="model">Model</el-dropdown-item>
              <el-dropdown-item command="tracker"
                >Return Tracking</el-dropdown-item
              >
              <el-dropdown-item command="SN">SN</el-dropdown-item>
              <el-dropdown-item command="date">Process Date</el-dropdown-item>
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
        </el-header>
        <el-main style="padding-top: 0 !important;">
          <div
            style="padding: 10px 0;text-align: left; display: flex; align-items: center;"
          >
            <div>
              <el-checkbox v-model="filters.is_check_out" border
                >In Stock</el-checkbox
              >
            </div>
            <div style="margin-left: 20px;">
              <span>Store:</span>
              <el-autocomplete
                style="width: 120px;"
                v-model="filters.seller"
                :fetch-suggestions="sellerQuerySearch"
              ></el-autocomplete>
            </div>
            <div style="margin-left: 20px;display: flex; align-items: center;">
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
            @row-contextmenu="handleContextMenu"
            :height="table_max_height"
            v-loading="loading"
            :data="tableData"
            :cell-style="cellStyleHandler"
          >
            <el-table-column prop="rt_id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="brand" label="Brand" width="90">
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
            <el-table-column
              prop="war_expire_dt"
              label="Expire On"
              width="100"
              :formatter="dateformat"
            >
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
            <el-table-column
              prop="seller"
              label="Store"
              width="90"
              :filter-method="filterMethod"
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
              prop="created_at"
              label="Processed On"
              width="120"
              :formatter="dateformat"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="is_check_out"
              label="Checked Out"
              width="120"
              :filters="[
                { text: 'Yes', value: true },
                { text: 'No', value: false }
              ]"
              :filter-method="filterMethod"
              :filtered-value="[false]"
            >
              <template slot-scope="scope">
                <el-checkbox
                  style="transform: scale(1.3);"
                  :value="scope.row.is_check_out"
                  disabled
                ></el-checkbox>
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
              </template>
            </el-table-column>
            <template #empty>
              <div class="custom-empty">
                <p class="empty-text">暂无数据</p>
              </div>
            </template>
          </el-table>
        </el-main>
      </el-container>
    </div>
    <transition name="menu-fade">
      <div
        v-show="menu.visible"
        class="custom-context-menu"
        :style="menuPosition"
      >
        <div class="menu-header">
          <span class="menu-title">操作菜单</span>
          <el-button
            type="text"
            icon="el-icon-close"
            class="close-btn"
            @click="closeMenu"
          ></el-button>
        </div>
        <div class="menu-divider"></div>

        <div class="menu-item" @click="handleEditByMenu">
          <i class="el-icon-edit"></i>
          <span>编辑条目</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from "moment-timezone";
import axios from "../js/request.js";
import { DefectsOption, SellerOption } from "../js/defaultRtWarObj.js";
import { calculateDayDifference } from "../js/Dateformat.js";
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
        is_check_out: true,
        seller: "",
        operator: "",
        repairMethod: "",
        defects: ""
      },
      menu: {
        visible: false,
        left: 0,
        top: 0,
        currentRow: null
      },
      selectedRowIndex: null
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
  computed: {
    menuPosition() {
      return {
        left: this.adjustX(this.menu.left) + "px",
        top: this.adjustY(this.menu.top) + "px"
      };
    }
  },
  mounted() {
    document.addEventListener("click", this.closeMenu);
    // document.addEventListener('contextmenu', this.closeMenu);

    //回退后筛选保持数据
    this.filter();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeMenu);
    // document.removeEventListener('contextmenu', this.closeMenu);
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
        "is_check_out",
        filterOption.is_check_out ? [false] : []
      );
      this.activeFilterChange(
        "seller",
        filterOption.seller === ""
          ? []
          : [filterOption.seller == "无店铺" ? null : filterOption.seller]
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
          text = "Return ID";
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
          text = "Return Tracking";
          break;
        case "SN":
          text = "SN";
          break;
        case "date":
          text = "Process Date";
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
      if (!row.is_refunded) {
        return {
          // backgroundColor: "#f6ffed", // 成功状态背景
          color: "#ff8d22" // 主文字颜色
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
    },
    handleContextMenu(row, _, event) {
      event.preventDefault();
      this.menu = {
        visible: true,
        left: event.clientX,
        top: event.clientY,
        currentRow: row
      };
    },
    adjustX(x) {
      const menuWidth = 200;
      const windowWidth = document.documentElement.clientWidth;
      return x + menuWidth > windowWidth ? x - menuWidth : x;
    },
    adjustY(y) {
      const menuHeight = 210;
      const windowHeight = document.documentElement.clientHeight;
      return y + menuHeight > windowHeight ? y - menuHeight : y;
    },
    closeMenu() {
      // console.log("关上了")
      this.menu.visible = false;
    },
    handleEditByMenu() {
      this.closeMenu();
      this.$router.push({
        path: "/addreturn",
        query: {
          data: JSON.stringify(this.menu.currentRow)
        }
      });
    },
    cellStyleHandler(item) {
      if (item.column.label === "Expire On") {
        let expire = item.row.war_expire_dt;
        if (expire === null) {
          return;
        }
        if (expire === "expired" || calculateDayDifference(expire) <= 0) {
          return {
            color: "red"
          };
        }
        if (calculateDayDifference(expire) < 30) {
          return {
            color: "orange"
          };
        }
        return {
          color: "green"
        };
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
</style>
