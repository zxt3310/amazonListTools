<template>
  <div class="about">
    <my-navi activeIndex="4"></my-navi>
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
              <el-dropdown-item command="brand">Brand</el-dropdown-item>
              <el-dropdown-item command="order">Oder#</el-dropdown-item>
              <el-dropdown-item command="upc">UPC</el-dropdown-item>
              <el-dropdown-item command="model">Model</el-dropdown-item>
              <el-dropdown-item command="tracker"
                >Return Tracking</el-dropdown-item
              >
              <el-dropdown-item command="SN">SN</el-dropdown-item>
              <el-dropdown-item command="date">Process Date</el-dropdown-item>
              <el-dropdown-item command="repair">Repair</el-dropdown-item>
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
            range-separator="to"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>

          <el-button type="primary" @click="searchRecord">
            Search <i class="el-icon-search"></i>
          </el-button>
          <el-button
            type="primary"
            style="position: absolute; right: 50px;"
            @click="directToAdd"
            >Create Return</el-button
          >
        </el-header>
        <el-main style="padding-top: 0 !important;">
          <div
            style="padding: 10px 0;text-align: left; display: flex; align-items: center;"
          >
            <el-checkbox-group v-model="filters.check">
              <el-checkbox border label="is_check_out">In Stock</el-checkbox>
              <el-checkbox border label="is_need_war">Repair</el-checkbox>
              <el-checkbox border label="is_fraud">Fraud</el-checkbox>
              <el-checkbox border label="is_junk">Junk</el-checkbox>
              <el-checkbox border label="rt_lpn">FBA</el-checkbox>
            </el-checkbox-group>
            <div style="margin-left: 20px;">
              <span>Decision:</span>
              <el-select style=" width: 160px;" v-model="filters.decision">
                <el-option
                  v-for="(item, index) in decisionOption"
                  :key="index"
                  :label="item"
                  :value="index + 1"
                ></el-option>
              </el-select>
            </div>
            <div style="margin-left: 20px;">
              <span>Store:</span>
              <el-autocomplete
                style="width: 120px;"
                v-model="filters.seller"
                :fetch-suggestions="sellerQuerySearch"
              ></el-autocomplete>
            </div>
            <div style="margin-left: 20px;">
              <span>Brand:</span>
              <el-autocomplete
                style="width: 120px;"
                v-model="filters.brand"
                :fetch-suggestions="brandQuerySearch"
              ></el-autocomplete>
            </div>

            <div style="margin-left: 20px;">
              <el-button type="primary" @click="filter">Filter</el-button>
            </div>
            <div style="margin-left: 20px;">
              <el-button type="primary" @click="clearfilter">Clear</el-button>
            </div>
            <div style="margin-left: auto; margin-right: 20px; display: flex; align-items: center;">
              <el-tag type="info" style="margin-right: 10px;">
                Residual Units: {{ residualStats.count }}
              </el-tag>
              <el-tag type="success">
                Total Residual: ${{ residualStats.total_value ? residualStats.total_value : '0.00' }}
              </el-tag>
            </div>
          </div>

          <el-table
            ref="dataTable"
            :height="table_max_height"
            v-loading="loading"
            :data="tableData"
            @cell-click="cellClickCopy"
            @row-dblclick="rowClickRead"
            @row-contextmenu="handleContextMenu"
            :row-style="markRefundedRows"
          >
            <el-table-column prop="rt_id" label="ID" width="100">
            </el-table-column>
            <el-table-column
              prop="decision"
              label="Decision"
              width="130"
              :formatter="decisionFmt"
              :filter-method="filterMethod"
            >
            </el-table-column>
            <el-table-column
              prop="rec_dt"
              label="Received On"
              width="110"
              :formatter="dateformat"
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
              prop="refund_rate"
              label="Refund"
              width="80"
              :formatter="rateformat"
            >
            </el-table-column>
            <el-table-column
              prop="rt_residual"
              label="Residual"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="brand"
              label="Brand"
              width="100"
              :filter-method="filterMethod"
            >
            </el-table-column>
            <el-table-column prop="model" label="Model" width="400">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.model">
                  <div class="no-wrap">{{ scope.row.model }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="upc" label="UPC" width="115">
            </el-table-column>
            <el-table-column
              align="center"
              prop="is_need_war"
              label="Repair"
              width="100"
              :filters="[{ text: 'Yes', value: true }]"
              :filter-method="filterMethod"
            >
              <template slot-scope="scope">
                <el-checkbox
                  style="transform: scale(1.3);"
                  :value="scope.row.is_need_war"
                  disabled
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="rt_track"
              label="Return Tracking"
              width="170"
            >
            </el-table-column>
            <el-table-column
              prop="war_ori_config"
              label="Ori Config"
              width="180"
            >
            </el-table-column>
            <!-- <el-table-column prop="lb_type" label="Label Type" width="100">
              </el-table-column> -->
            <el-table-column prop="order_id" label="Order#" width="170">
            </el-table-column>
            <el-table-column
              prop="rt_dt"
              label="Returned Date"
              width="120"
              :formatter="dateformat"
            >
            </el-table-column>
            <el-table-column
              prop="seller"
              label="Store"
              width="100"
              :filter-method="filterMethod"
            >
            </el-table-column>
            <el-table-column prop="creator" label="Operator" width="90">
            </el-table-column>
            <el-table-column prop="sn" label="SN" width="160">
            </el-table-column>
            <el-table-column
              prop="cur_config"
              label="Current Config"
              width="160"
            >
            </el-table-column>

            <el-table-column prop="rt_cmt" label="Condition Notes:" width="200">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.rt_cmt">
                  <div class="no-wrap">{{ scope.row.rt_cmt }}</div>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column
              prop="rt_cmt_cs"
              label="Comments for service"
              width="200"
            >
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.rt_cmt_cs">
                  <div class="no-wrap">{{ scope.row.rt_cmt_cs }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="rt_reason" label="Return Reason" width="200">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.rt_reason">
                  <div class="no-wrap">{{ scope.row.rt_reason }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="is_fraud"
              label="Fraud"
              width="80"
              :filters="[{ text: 'Yes', value: true }]"
              :filter-method="filterMethod"
            >
              <template slot-scope="scope">
                <el-checkbox
                  style="transform: scale(1.3);"
                  :value="scope.row.is_fraud"
                  disabled
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="is_junk"
              label="Junk"
              width="80"
              :filters="[{ text: 'Yes', value: true }]"
              :filter-method="filterMethod"
            >
              <template slot-scope="scope">
                <el-checkbox
                  style="transform: scale(1.3);"
                  :value="scope.row.is_junk"
                  disabled
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="is_refund"
              label="Refunded"
              width="90"
            >
              <template slot-scope="scope">
                <el-checkbox
                  style="transform: scale(1.3);"
                  :value="scope.row.is_refunded"
                  disabled
                ></el-checkbox>
              </template>
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
            <el-table-column
              prop="rt_region"
              label="Region"
              width="100"
              :formatter="regionFmt"
            >
            </el-table-column>
            <el-table-column
              prop="rt_lpn"
              label="LPN"
              width="100"
              :filter-method="fbaFilter"
            >
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.rt_lpn">
                  <div class="no-wrap">{{ scope.row.rt_lpn }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEditByTable(scope.$index, scope.row)"
                >
                  Edit</el-button
                >
                <el-button
                  v-if="$store.getters.isAdmin"
                  size="mini"
                  type="danger"
                  @click="handleDeleteByTable(scope.$index, scope.row)"
                >
                  Del</el-button
                >
              </template>
            </el-table-column>
            <template #empty>
              <div class="custom-empty">
                <p class="empty-text">暂无数据</p>
              </div>
            </template>
          </el-table>
          <el-pagination
            v-if="searchParam == ''"
            background
            @current-change="handleCurrentChange"
            @size-change="handleCurrentChange"
            :page-size.sync="page.persize"
            :page-sizes="[100, 250, 500, 1000]"
            :current-page.sync="page.cur"
            layout="prev, pager, next, jumper, sizes"
            :total="page.total"
          >
          </el-pagination>
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

        <!-- <div class="menu-item" @click="handleCopy">
					<i class="el-icon-document-copy"></i>
					<span>复制数据</span>
				</div> -->

        <div class="menu-divider"></div>

        <div class="menu-item" @click="handleEdit">
          <i class="el-icon-edit"></i>
          <span>编辑条目</span>
        </div>

        <div class="menu-item">
          <i class="el-icon-collection-tag"></i>
          <span>标记条目</span>
          <el-color-picker
            style="margin-left: 10px;"
            size="small"
            v-model="color"
            color-format="hex"
            :predefine="predefineColors"
            @change="handleTag"
          />
        </div>

        <div
          v-if="$store.getters.isAdmin"
          class="menu-item danger"
          @click="handleDelete"
        >
          <i class="el-icon-delete"></i>
          <span>删除条目</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from "moment-timezone";
import axios from "../js/request.js";
import {
  DecisionOption,
  BrandOption,
  SellerOption
} from "../js/defaultRtWarObj.js";

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
      decisionOption: DecisionOption,
      brandOption: BrandOption,
      sellerOption: SellerOption,
      filters: {
        check: ["is_check_out"],
        decision: "",
        brand: "",
        seller: ""
      },
      loading: false,
      page: {
        cur: 1,
        total: 0,
        persize: 100
      },
      menu: {
        visible: false,
        left: 0,
        top: 0,
        currentRow: null
      },
      color: "#90ee90",
      predefineColors: [
        "#FFFFFF",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff"
      ],
      // 残值统计
      residualStats: {
        count: 0,
        total_value: 0
      }
    };
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
    // 获取残值统计数据
    this.getResidualStats();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeMenu);
    // document.removeEventListener('contextmenu', this.closeMenu);
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
      let targets = [
        "is_check_out",
        "is_need_war",
        "is_fraud",
        "is_junk",
        "rt_lpn"
      ];
      for (let key of targets) {
        if (filterOption.check.indexOf(key) == -1) {
          this.activeFilterChange(key, []);
        } else
          key === "is_check_out"
            ? this.activeFilterChange(key, [false])
            : this.activeFilterChange(key, [true]);
      }
      this.activeFilterChange(
        "brand",
        filterOption.brand === "" ? [] : [filterOption.brand]
      );
      this.activeFilterChange(
        "decision",
        filterOption.decision === "" ? [] : [filterOption.decision]
      );
      this.activeFilterChange(
        "seller",
        filterOption.seller === "" ? [] : [filterOption.seller]
      );
      // 筛选后重新获取残值统计数据
      this.getResidualStats();
    },
    clearfilter(key) {
      let filters = {
        check: ["is_check_out"],
        decision: "",
        brand: "",
        seller: ""
      };
      this.filters = filters;
      this.filter();
      // this.$refs.dataTable.clearFilter();
    },
    getInitData() {
      this.loading = true;
      axios
        .get("getReturn")
        .then(e => {
          this.tableData = e.data;
          this.loading = false;
          this.page.total = e.total;
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    handleCurrentChange(curpage) {
      this.loading = true;
      axios
        .get(`getReturn?page=${this.page.cur}&per_page=${this.page.persize}`)
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
        let ori = this.decisionOption;
        return ori[parseInt(cellValue) - 1];
      } else {
        return "";
      }
    },
    rateformat(ow, column, cellValue, index) {
      if (cellValue) {
        return (cellValue * 100).toString() + "%";
      } else {
        return "";
      }
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
        case "brand":
          text = "Brand";
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
        case "repair":
          text = "Repair";
          this.searchParam = "点击搜索全部 need repaired";
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

    handleEditByTable(index, row) {
      this.$router.push({
        path: "/addreturn",
        query: {
          data: JSON.stringify(row)
        }
      });
    },

    handleDeleteByTable(index, row) {
      this.$confirm("此操作将删除该退货, 是否继续?", "警告", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          axios
            .post("removeReturn", {
              id: row.id
            })
            .then(e => {
              if (e.ret == 0) {
                this.tableData = this.tableData.filter(
                  item => item.id != row.id
                );
                this.loading = false;
              }
            })
            .catch(e => {
              this.$message(e);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //导航到创建页
    directToAdd() {
      this.$router
        .push({
          readOnly: "no",
          path: "/addreturn"
        })
        .catch(err => {
          console.log(err);
        });
    },

    brandQuerySearch(query, cb) {
      let res = [];
      for (let brand of this.brandOption) {
        res.push({
          value: brand
        });
      }
      cb(res);
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
    //单元格点击事件
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
    //标记已退款的行
    markRefundedRows({ row, index }) {
      let style = {};
      let tags = row.tags;
      for (let item of tags) {
        if (this.$store.state.userinfo.id == item.user_id) {
          style.backgroundColor = item.color;
          break;
        }
      }
      if (!row.is_refunded && !row.rt_lpn) {
        style.color = "#ff8d22";
      }
      return style;
    },
    //Region格式化
    regionFmt(row, column, cellValue, index) {
      return cellValue == 1 ? "US" : "CA";
    },
    // 获取残值统计数据
    getResidualStats() {
      axios
        .get("get-return-residual-stats")
        .then(e => {
          if (e.ret == 0) {
            this.residualStats = e.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 过滤逻辑
    filterMethod(value, row, column) {
      if (column.label === "Store") {
        return (
          row[column.property] &&
          row[column.property].replace(/\s/g, "").toLowerCase() ===
            value.replace(/\s/g, "").toLowerCase()
        );
      }

      return row[column.property] === value;
    },

    fbaFilter(value, row, column) {
      if (value) {
        return row[column.property] != null;
      }
      return true;
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
    handleCopy() {
      navigator.clipboard.writeText(JSON.stringify(this.menu.currentRow));
      this.$message.success("数据已复制");
      this.closeMenu();
    },
    handleEdit() {
      this.closeMenu();
      this.$router.push({
        path: "/addreturn",
        query: {
          data: JSON.stringify(this.menu.currentRow)
        }
      });
    },
    handleTag(e) {
      let row = this.menu.currentRow;
      axios
        .post("tagColor", {
          id: row.id,
          color: this.color
        })
        .then(e => {
          row.tags = e.data;
        });
    },
    handleDelete() {
      this.$confirm("此操作将删除该退货, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let row = this.menu.currentRow;
          this.loading = true;
          axios
            .post("removeReturn", {
              id: row.id
            })
            .then(e => {
              if (e.ret == 0) {
                this.tableData = this.tableData.filter(
                  item => item.id != row.id
                );
                this.loading = false;
              }
              this.$message.success("删除成功");
            })
            .catch(e => {
              this.$message(e);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      this.closeMenu();
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

/* 菜单过渡动画 */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.menu-fade-enter,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 菜单容器样式 */
.custom-context-menu {
  position: fixed;
  width: 200px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  user-select: none;
  z-index: 999 !important;
}

/* 菜单头部 */
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.menu-title {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.close-btn {
  padding: 0;
  color: #999;

  &:hover {
    color: #666;
  }
}

/* 菜单项样式 */
.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;

  &:hover {
    background: #f5f7fa;
  }

  i {
    margin-right: 12px;
    font-size: 16px;
  }

  &.danger {
    color: #f56c6c;

    i {
      color: inherit;
    }

    &:hover {
      background: #fef0f0;
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;

    &:hover {
      background: none;
    }
  }
}

/* 分隔线 */
.menu-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 6px 0;
}
</style>
