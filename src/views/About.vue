<template>
  <div class="about">
    <my-navi activeIndex="1"></my-navi>
    <h2>Tracking & SN</h2>
    <div class="" style="">
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
              <el-dropdown-item command="order">订单号</el-dropdown-item>
              <el-dropdown-item command="tracker">运单号</el-dropdown-item>
              <el-dropdown-item command="SN">SN</el-dropdown-item>
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
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>

          <el-button type="primary" @click="searchRecord">
            搜索 <i class="el-icon-search"></i>
          </el-button>
        </el-header>
        <el-container>
          <el-aside width="200px">
            <el-button size="medium" @click="getHistory(0)"
              >今日扫描:{{ history.today }}</el-button
            >
            <el-button size="medium" @click="getHistory(1)"
              >昨日扫描:{{ history.yestoday }}</el-button
            >
            <el-button size="medium" @click="getHistory(2)"
              >{{ getDateName(2) }} 扫描:{{ history.exthird }}
            </el-button>
            <el-button size="medium" @click="getHistory(3)"
              >{{ getDateName(3) }} 扫描:{{ history.exfourth }}
            </el-button>
            <el-button size="medium" @click="getHistory(4)"
              >{{ getDateName(4) }} 扫描:{{ history.exfifth }}
            </el-button>
          </el-aside>
          <el-main>
            <el-table
              :max-height="table_max_height"
              v-loading="loading"
              :data="tableData"
              stripe
            >
              <el-table-column prop="id" label="ID" width="100">
              </el-table-column>
              <el-table-column prop="updated_at" label="扫描时间" width="220">
              </el-table-column>
              <el-table-column prop="order_id" label="订单号" width="120">
              </el-table-column>
              <el-table-column prop="express_num" label="运单号" width="220">
              </el-table-column>
              <el-table-column prop="SN" label="Serial Number" min-width="220">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.SN" placement="top" effect="dark">
                    <div 
                      class="sn-cell" 
                      @click="copySN(scope.row.SN)"
                      style="cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                    >
                      {{ scope.row.SN }}
                    </div>
                  </el-tooltip>
                </template>
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
              <template #empty>
                <div class="custom-empty">
                  <p class="empty-text">今日无数据</p>
                </div>
              </template>
            </el-table>
          </el-main>
          <el-aside width="200px">
            <el-button
              type="primary"
              style="width: 100px;height: 100px;"
              @click="drawer = !drawer"
              >开始扫描
            </el-button>
          </el-aside>
        </el-container>
      </el-container>
      <el-drawer
        @opened="onOpen"
        :modal="false"
        title="扫描录入"
        :visible.sync="drawer"
        :append-to-body="true"
      >
        <div style="padding: 20px;">
          <el-row>
            <el-input
              v-model="scandata.scan_order"
              placeholder="订单号"
              ref="order_input"
              @keyup.enter.native="onSubmit"
            ></el-input>
          </el-row>
          <el-row>
            <el-input
              v-model="scandata.scan_tracker"
              placeholder="运单号"
              ref="tracker_input"
              @keyup.enter.native="onSubmit"
            ></el-input>
          </el-row>
          <el-row>
            <el-input
              v-model="scandata.scan_SN"
              placeholder="SN"
              ref="SN_input"
              type="textarea"
              autosize
              @keyup.enter.native="SNEditing"
              :disabled="SnEditProtect"
            ></el-input>
          </el-row>
          <el-row>
            SN结束码：
            <el-image :src="require(`../static/SN_END_FLAG.png`)" />
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
          <el-row style="text-align: center; margin-top: 30px;">
            <el-button type="primary" @click="drawer = false"
              >关闭窗口</el-button
            >
          </el-row>
          <el-row style="margin-top: 30px;">
            注：Tracking扫描完毕会自动激活SN输入框，SN支持多行扫描(可扫描多个SN，中间自动用换行符间隔)，SN扫描完毕后，请扫描结束码触发提交。
          </el-row>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import axios from "../js/request.js";
import axiosEx from "axios";
import { Loading } from "element-ui";
export default {
  data() {
    return {
      drawer: false,
      //展示表数据
      tableData: [],
      //查询类型
      searchKey: "order",
      //时间快捷选项
      scanError: {
        show: false,
        msg: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              end.setHours(0, 0, 0, 0);
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              start.setHours(0, 0, 0, 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              end.setHours(0, 0, 0, 0);
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              start.setHours(0, 0, 0, 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              end.setHours(0, 0, 0, 0);
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              start.setHours(0, 0, 0, 0);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      //搜索条件
      searchParam: "",
      //页面数据
      table_max_height: window.innerHeight - 220,
      history: {
        today: 0,
        yestoday: 0,
        exthird: 0,
        exfourth: 0,
        exfifth: 0
      },
      scandata: {
        scan_order: "",
        scan_tracker: "",
        scan_SN: ""
      },
      //SN扫描保护
      SnEditProtect: false
    };
  },
  created() {
    this.getInitData();
    // moment.tz.setDefault("America/Los_Angeles");
  },
  methods: {
    getInitData() {
      axios.get("getpage").then(e => {
        this.tableData = e.data.orders;
        this.history = e.data.history;
      });
    },
    getHistory(cnt) {
      axios
        .post("gethistory", {
          days: cnt
        })
        .then(e => {
          this.tableData = e.data;
        });
    },
    getDateName(cnt) {
      return moment(new Date().getTime() - cnt * 1000 * 24 * 3600).format(
        "MM-DD"
      );
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
        case "SN":
          text = "SN";
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
      axios
        .post("search", {
          type: this.searchKey,
          param: this.searchParam
        })
        .then(res => {
          this.tableData = res.data;
        });
    },
    onSubmit(e) {
      // console.log(e);
      this.$refs.SN_input.focus();
    },
    SNEditing() {
      // console.log(this.scandata.scan_SN)
      this.SnEditProtect = true;
      let SNs = this.scandata.scan_SN.split("\n");
      let flag = "SN_Scan_END_FLAG";
      if (SNs.includes(flag)) {
        SNs.splice(-2, 2);
        console.log(SNs);
        this.scanOrder(SNs.join(", "));
      } else {
        this.SnEditProtect = false;
      }
    },
    scanOrder(SN_post) {
      if (this.scandata.scan_tracker.length == 0) {
        this.SnEditProtect = false;
        return;
      }
      this.$refs.tracker_input.blur();
      let loadingInstance = Loading.service({
        fullscreen: true
      });
      let temp = this.tableData;
      axios
        .post("scanorder", {
          order_id: this.scandata.scan_order,
          express_num: this.scandata.scan_tracker,
          SN: SN_post
        })
        .then(res => {
          if (res.ret == 0) {
            // console.log(res)
            // this.getInitData();
            temp.unshift(res.data);
            this.SnEditProtect = false;
            this.tableData = temp;
            this.$refs.order_input.clear();
            this.$refs.tracker_input.clear();
            this.$refs.SN_input.clear();
            this.$refs.tracker_input.focus();
            this.scanError = {
              show: false,
              msg: ""
            };
          } else {
            this.scanError = {
              show: true,
              msg: res.msg
            };
            this.$alert(res.msg, `运单：${this.scandata.scan_tracker}`, {
              confirmButtonText: "确定"
            });
            this.$refs.tracker_input.focus();
            this.$refs.tracker_input.select();
            this.SnEditProtect = false;
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        })
        .catch(e => {
          console.log(e);
          if (e.statusCode != 200) {
            alert("出错了！");
          }
        });
    },
    onOpen() {
      this.$refs.tracker_input.focus();
    },
    handleDelete(index, row) {
      this.$confirm("此操作将删除该运单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post("removeorder", {
              id: row.id,
              express_num: row.express_num
            })
            .then(res => {
              if (res.ret == 0) {
                this.getInitData();
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
    copySN(sn) {
      navigator.clipboard.writeText(sn).then(() => {
        this.$message({
          type: "success",
          message: "SN 已复制到剪贴板"
        });
      }).catch(err => {
        console.error("复制失败:", err);
        this.$message({
          type: "error",
          message: "复制失败，请手动复制"
        });
      });
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
