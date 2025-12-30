<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-office-building"></i>
          <span>Work Flow</span>
        </template>
        <el-menu-item index="1">Tracking SN管理</el-menu-item>
        <el-menu-item index="2">CA Tracking追踪</el-menu-item>
        <el-menu-item index="3">Upgrade Workbench</el-menu-item>
        <el-menu-item index="4">Return</el-menu-item>
        <el-menu-item index="5">Need Refund</el-menu-item>
        <el-menu-item index="6">Warranty</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-box"></i>
          <span>Material</span>
        </template>
        <el-menu-item index="8">UPC 获取</el-menu-item>
        <el-menu-item index="9">UPC 计算</el-menu-item>
        <el-menu-item index="10">Pro Code</el-menu-item>
        <el-menu-item index="12">AMZ Invoice</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-box"></i>
          <span>Inventory</span>
        </template>
        <el-menu-item index="7">
          <i class="el-icon-sold-out"></i>
          <span>上下架指令发布</span>
        </el-menu-item>
        <el-menu-item index="13">
          <i class="el-icon-sold-out"></i>
          <span>库存修改文件导出</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="4" v-if="$store.getters.isSuperAdmin">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>Setting</span>
        </template>
        <el-menu-item index="11">
          <i class="el-icon-s-custom"></i>
          <span>User Manage</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-s-tools"></i>
          <span>Tools</span>
        </template>
        <el-menu-item index="14">
          <i class="el-icon-guide"></i>
          <span>Ca Trans Helper</span>
        </el-menu-item>
        <el-menu-item index="15">
          <i class="el-icon-guide"></i>
          <span>US to CA Check-in</span>
        </el-menu-item>
        <el-menu-item index="16">
          <i class="el-icon-picture-outline"></i>
          <span>AI图片生成</span>
        </el-menu-item>
      </el-submenu>

      <div
        style="position: absolute; right: 80px; top: 50%; transform: translateY(-50%);"
      >
        <el-badge :value="dots == 0 ? null : dots" class="badge-item">
          <el-popover
            placement="bottom-end"
            trigger="hover"
            width="500"
            :popper-options="{
              modifiers: [{ name: 'preventOverflow', enabled: true }]
            }"
          >
            <div class="notification-container">
              <div class="notification-header">
                <span style="font-weight: bold;">消息通知</span>
                <el-button
                  size="mini"
                  type="text"
                  @click="markAllAsRead"
                  v-if="dots > 0"
                >
                  全部标记为已读
                </el-button>
              </div>
              <div class="notification-content">
                <el-table
                  :data="safeNotifications"
                  stripe
                  :show-header="false"
                  @row-click="notify_click"
                  :max-height="
                    Math.min(400, Math.max(200, safeNotifications.length * 80))
                  "
                  style="border: none;"
                  highlight-current-row
                >
                  <el-table-column
                    prop="type"
                    width="100px"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="message"
                    width="280px"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column width="100px">
                    <template slot-scope="scope">
                      <div style="display: flex; align-items: center;">
                        <el-badge
                          is-dot
                          :hidden="scope.row?.is_read"
                          style="margin-right: 10px;"
                        ></el-badge>
                        <div style="display: flex; gap: 5px;">
                          <el-button
                            size="mini"
                            v-if="!scope.row?.is_read"
                            @click.stop="handleReaded(scope.$index, scope.row)"
                            type="primary"
                            plain
                          >
                            已读
                          </el-button>
                          <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click.stop="handleDelete(scope.$index, scope.row)"
                            style="color: #f56c6c;"
                          ></el-button>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-if="safeNotifications.length === 0"
                  class="empty-notification"
                >
                  暂无消息通知
                </div>
              </div>
            </div>
            <el-button
              slot="reference"
              style="font-size: 20px; color: white;"
              type="text"
              icon="el-icon-message-solid"
              @click.stop
            ></el-button>
          </el-popover>
        </el-badge>
      </div>

      <div
        style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%);"
      >
        <el-button
          style="font-size: 20px; color: white;"
          type="text"
          @click="show = true"
          icon="el-icon-s-operation"
        ></el-button>
      </div>
    </el-menu>
    <el-drawer
      :visible.sync="show"
      :append-to-body="true"
      :modal-append-to-body="true"
      size="13%"
    >
      <div slot="title">
        {{ user ? user.name : "未登录" }}
      </div>
      <el-divider></el-divider>
      <div></div>
      <div style="text-align: center;">
        <el-button @click="logout">Logout</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from "../js/request.js";
export default {
  name: "MyNavi",
  data() {
    return {
      show: false,
      user: this.$store.state.userinfo,
      countOfNotification: null
      // activeIndex: '1',
    };
  },
  props: {
    activeIndex: {
      type: String,
      default: "2"
    }
  },
  computed: {
    notifications() {
      // 确保返回的是数组，防止null值
      return this.$store &&
        this.$store.state &&
        Array.isArray(this.$store.state.notifications)
        ? this.$store.state.notifications
        : [];
    },
    safeNotifications() {
      // 确保每个通知项都是有效的对象
      return this.notifications.filter(item => {
        return item && typeof item === "object";
      });
    },
    dots() {
      // 使用已经过滤过的安全通知数据
      let items = this.safeNotifications;
      // 确保filter函数安全执行
      let unreads = items.filter(item => {
        return item && typeof item === "object" && item.is_read === false;
      });
      return unreads.length;
    }
  },
  // watch:{
  // 	notifications(newValue,oldValue){
  // 		if(oldValue != newValue){
  // 			this.countOfNotification = newValue.length
  // 		}
  // 	}
  // },
  methods: {
    handleSelect(key, keyPath) {
      // 增强安全检查
      if (
        !key ||
        typeof key !== "string" ||
        !this.$router ||
        !this.$router.history ||
        !this.$router.history.current
      ) {
        return;
      }
      let curPath = this.$router.history.current.path || "";
      let routerPath = [
        "/",
        "/trackingcheck",
        "/UpgradeMission",
        "/Return",
        "/unrefund",
        "/Warranty",
        "/inventory-adjustment",
        "/UPC",
        "/CaculateUPC",
        "/procode",
        "/user",
        "/invoice",
        "/inventory-modify-output",
        "/ca-trans-helper",
        "/us-to-ca-checkin",
        "/img-generate-ai"
      ];

      // 确保索引有效
      const index = parseInt(key) - 1;
      if (isNaN(index) || index < 0 || index >= routerPath.length) {
        return;
      }

      if (curPath === routerPath[index]) {
        return;
      }

      this.$router.replace({
        path: routerPath[index]
      });
    },
    notify_click(row, column, event) {
      // 增强row检查
      if (!row || typeof row !== "object") {
        return;
      }
      // 点击消息时自动标记为已读
      if (row.is_read === false) {
        this.handleReaded(null, row);
      }
      // 延迟跳转，确保已读状态更新
      setTimeout(() => {
        if (this.$router) {
          this.$router.replace({
            path: row.path || "/"
          });
        }
      }, 300);
    },
    logout() {
      this.$store.commit("logout");
    },
    handleReaded(index, row) {
      // 添加row是否存在的检查
      if (!row || !row.id) {
        return;
      }
      axios
        .post("readMessage", {
          id: row.id
        })
        .then(e => {
          if (e && e.ret == 0 && this.$store) {
            this.$store.dispatch("fetchMessage");
          }
        })
        .catch(error => {
          console.error("标记已读失败:", error);
        });
    },
    handleDelete(index, row) {
      // 添加row是否存在的检查
      if (!row || !row.id) {
        return;
      }
      // 确认删除
      if (this.$confirm) {
        this.$confirm("确定要删除这条消息吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            axios
              .post("delMessage", {
                id: row.id
              })
              .then(e => {
                if (e && e.ret == 0) {
                  if (this.$store) {
                    this.$store.dispatch("fetchMessage");
                  }
                  if (this.$message) {
                    this.$message.success("删除成功");
                  }
                } else if (this.$message) {
                  this.$message.error("删除失败");
                }
              })
              .catch(error => {
                console.error("删除消息失败:", error);
                if (this.$message) {
                  this.$message.error("删除失败");
                }
              });
          })
          .catch(() => {
            // 用户取消删除
          });
      }
    },
    markAllAsRead() {
      // 增强安全检查，确保filter和map操作安全执行
      const unreadIds = this.notifications
        .filter(
          item =>
            item &&
            typeof item === "object" &&
            item.is_read === false &&
            item.id
        )
        .map(item => item.id);

      if (unreadIds.length > 0 && this.$store) {
        axios
          .post("readAllMessages", {
            ids: unreadIds
          })
          .then(e => {
            if (e && e.ret == 0) {
              this.$store.dispatch("fetchMessage");
              if (this.$message) {
                this.$message.success("全部标记为已读");
              }
            }
          })
          .catch(error => {
            console.error("标记已读失败:", error);
          });
      }
    }
  }
};
</script>

<style>
.badge-item {
  /* margin-top: 20px !important;
	  margin-right: 40px !important; */
}

.notification-container {
  position: relative;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 10px;
  border-bottom: 1px solid #ebeef5;
}

.notification-content {
  max-height: 400px;
  overflow: hidden;
}

.empty-notification {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

/* 优化表格滚动条样式 */
.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 确保表格行高一致 */
.el-table .el-table__row {
  height: 60px;
}

/* 未读消息样式强调 */
.el-table
  .el-table__row:not(.el-table__row--striped):not(.el-table__row--highlight):not([class*="current-row"]) {
  background-color: #fafafa;
}

.el-table .el-table__row--striped {
  background-color: #f5f7fa;
}

/* 防止弹出框超出视口 */
.el-popover {
  max-width: 90vw !important;
  max-height: 70vh !important;
  overflow: hidden;
}
</style>
