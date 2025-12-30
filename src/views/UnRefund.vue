<template>
  <div class="about">
    <my-navi activeIndex="5"></my-navi>
    <div class="" style="">
      <el-container>
        <el-main style="padding-top: 0 !important;">
          <div
            style="padding: 10px 0;text-align: left; display: flex; align-items: center;"
          >
            <div style="margin-left: 20px;">
              <span>Store: </span>
              <el-autocomplete
                style="width: 120px;"
                v-model="filters.seller"
                :fetch-suggestions="sellerQuerySearch"
              ></el-autocomplete>
            </div>
            <div style="margin-left: 20px;">
              <span>Order#: </span>
              <el-input
                style="width: 200px;"
                v-model="filters.order_id"
              ></el-input>
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
            :height="table_max_height"
            v-loading="loading"
            :data="tableData"
            @cell-click="cellClickCopy"
            @row-dblclick="rowClickRead"
            @row-contextmenu="handleContextMenu"
          >
            <el-table-column prop="rt_id" label="ID" width="80">
            </el-table-column>
            <el-table-column
              prop="decision"
              label="Decision"
              width="130"
              :formatter="decisionFmt"
            >
            </el-table-column>
            <el-table-column
              prop="rt_dt"
              label="Returned Date"
              width="120"
              :formatter="dateformat"
            >
            </el-table-column>
            <el-table-column
              prop="rec_dt"
              label="Received On"
              width="105"
              :formatter="dateformat"
            >
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="Processed On"
              width="115"
              :formatter="dateformat"
            >
            </el-table-column>
            <el-table-column
              prop="order_id"
              label="Order#"
              width="170"
              :filter-method="OrderIDfilterMethod"
            >
            </el-table-column>
            <el-table-column
              prop="seller"
              label="Store"
              width="80"
              :filter-method="filterMethod"
            >
            </el-table-column>
            <el-table-column
              prop="rt_track"
              label="Return Tracking"
              width="170"
            >
            </el-table-column>
            <el-table-column prop="model" label="Model" width="400">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.model">
                  <div class="no-wrap">{{ scope.row.model }}</div>
                </el-tooltip>
              </template>
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
              prop="rt_region"
              label="Region"
              width="100"
              :formatter="regionFmt"
            >
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

        <!-- <div class="menu-item" @click="handleCopy">
					<i class="el-icon-document-copy"></i>
					<span>复制数据</span>
				</div> -->

        <div class="menu-divider"></div>

        <div class="menu-item" @click="handleEdit">
          <i class="el-icon-edit"></i>
          <span>编辑条目</span>
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
      table_max_height: window.innerHeight - 150,
      decisionOption: DecisionOption,
      brandOption: BrandOption,
      sellerOption: SellerOption,
      filters: {
        check: [],
        decision: "",
        brand: "",
        seller: "",
        order_id: ""
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
      // let targets = [
      //   "is_check_out",
      //   "is_need_war",
      //   "is_fraud",
      //   "is_junk",
      //   "rt_lpn"
      // ];
      // for (let key of targets) {
      //   if (filterOption.check.indexOf(key) == -1) {
      //     this.activeFilterChange(key, []);
      //   } else
      //     key === "is_check_out"
      //       ? this.activeFilterChange(key, [false])
      //       : this.activeFilterChange(key, [true]);
      // }
      // this.activeFilterChange(
      //   "brand",
      //   filterOption.brand === "" ? [] : [filterOption.brand]
      // );
      // this.activeFilterChange(
      //   "decision",
      //   filterOption.decision === "" ? [] : [filterOption.decision]
      // );
      this.activeFilterChange(
        "seller",
        filterOption.seller === "" ? [] : [filterOption.seller]
      );
      this.activeFilterChange(
        "order_id",
        filterOption.order_id === "" ? [] : [filterOption.order_id]
      );
    },
    clearfilter(key) {
      let filters = {
        check: [],
        decision: "",
        brand: "",
        seller: "",
        order_id: ""
      };
      this.filters = filters;
      this.filter();
      // this.$refs.dataTable.clearFilter();
    },
    getInitData() {
      this.loading = true;
      axios
        .get("getUnRefund")
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
      if (!row.is_refunded) {
        return {
          // backgroundColor: "#f6ffed", // 成功状态背景
          color: "#ff8d22" // 主文字颜色
        };
      }
    },
    //Region格式化
    regionFmt(row, column, cellValue, index) {
      return cellValue == 1 ? "US" : "CA";
    },
    // 通用过滤逻辑
    filterMethod(value, row, column) {
      // if(column.label === "Store"){
      return (
        row[column.property] &&
        row[column.property].replace(/\s/g, "").toLowerCase() ===
          value.replace(/\s/g, "").toLowerCase()
      );
      // }
      // return row[column.property] === value;
    },
    // 订单号过滤所及
    OrderIDfilterMethod(value, row, column) {
      let target = row[column.property];
      return target && target.includes(value);
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
  z-index: 9999;
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
