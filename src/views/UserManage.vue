<template>
  <div id="app">
    <!-- <my-navi activeIndex="11"></my-navi> -->
    <div class="user-management">
      <!-- 头部区域 -->
      <div class="header-section">
        <div>
          <el-button @click="goback">《 Go Back</el-button>
          <h1>用户管理</h1>
          <!-- <p class="description">管理平台所有用户账户和权限</p> -->
        </div>
        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showCreateDialog"
            size="medium"
          >
            创建用户
          </el-button>
        </div>
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="输入用户名/ID搜索"
              v-model="searchKeyword"
              prefix-icon="el-icon-search"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="statusFilter"
              placeholder="用户类型"
              clearable
              style="width: 100%"
            >
              <el-option label="全部" value="all"></el-option>
              <el-option label="管理员" value="admin"></el-option>
              <el-option label="普通用户" value="normal"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <div class="flex-center">
              <el-button
                type="info"
                plain
                @click="resetSearch"
                style="margin-right: 10px"
              >
                重置
              </el-button>
              <el-button type="primary" @click="searchUsers">
                搜索
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 操作区 -->
      <!-- <div class="table-actions">
				<el-button-group>
					<el-button size="small" :type="selectedRows.length > 0 ? 'warning' : 'info'"
						:disabled="selectedRows.length === 0" @click="batchDelete">
						批量删除
					</el-button>
					<el-button size="small" :type="selectedRows.length > 0 ? 'success' : 'info'"
						:disabled="selectedRows.length === 0" @click="batchGrantAdmin">
						批量设为管理员
					</el-button>
					<el-button size="small" :type="selectedRows.length > 0 ? 'primary' : 'info'"
						:disabled="selectedRows.length === 0" @click="batchRevokeAdmin">
						批量取消管理员
					</el-button>
				</el-button-group>
				<span v-if="selectedRows.length > 0" style="margin-left: 15px">
					已选择 <span class="custom-badge">{{ selectedRows.length }}</span> 个用户
				</span>
			</div> -->

      <!-- 用户表格 -->
      <el-table
        :data="filteredUsers"
        v-loading="loading"
        element-loading-text="加载用户数据中..."
        border
        stripe
        @selection-change="handleSelectionChange"
        style="width: 100%"
        row-key="id"
      >
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->

        <el-table-column prop="id" label="用户ID" sortable width="120">
          <template slot-scope="{ row }">
            <span class="user-id-col">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="用户名" sortable min-width="150">
          <!-- <template slot-scope="{row}">
						<el-button type="text" @click="showUserDetail(row)">
							{{ row.username }}
						</el-button>
					</template> -->
        </el-table-column>

        <el-table-column
          prop="created_at"
          label="注册时间"
          sortable
          width="180"
        >
        </el-table-column>

        <el-table-column
          prop="isAdmin"
          label="管理员权限"
          width="140"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag
              class="status-tag"
              :class="row.is_admin > 0 ? 'normal-user-tag' : 'admin-tag'"
              @click="toggleAdminStatus(row)"
              size="medium"
            >
              {{ row.is_admin ? "管理员" : "普通用户" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="360" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showChangePasswordDialog(scope.row)"
            >
              修改密码
            </el-button>
            <el-button
              size="mini"
              :type="scope.row.is_admin ? 'warning' : 'success'"
              @click="toggleAdminStatus(scope.row)"
            >
              {{ scope.row.is_admin ? "取消管理员" : "授权管理员" }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控制 -->
      <!-- <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="pagination.currentPage" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" background>
				</el-pagination>
			</div> -->
    </div>

    <!-- 创建用户对话框 -->
    <el-dialog
      title="创建新用户"
      :visible.sync="createDialogVisible"
      width="500px"
      @close="resetCreateForm"
    >
      <el-form
        :model="createForm"
        :rules="createRules"
        ref="createFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="createForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="初始密码" prop="password">
          <el-input
            v-model="createForm.password"
            type="password"
            placeholder="请输入初始密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="createForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-switch
            v-model="createForm.is_admin"
            :active-value="1"
            :inactive-value="0"
            active-text="管理员"
            inactive-text="普通用户"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="passwordDialogVisible"
      width="500px"
    >
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-width="120px"
      >
        <el-form-item label="用户名:">
          <span style="font-size: 20px; float: left;">{{
            passwordForm.username
          }}</span>
        </el-form-item>
        <el-form-item label="新密码:" prop="new_password">
          <el-input
            v-model="passwordForm.new_password"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户详情弹窗 -->
    <!-- <el-dialog title="用户详情" :visible.sync="detailDialogVisible" width="600px">
			<div v-if="currentUser" class="user-detail">
				<el-row :gutter="20" class="detail-row">
					<el-col :span="6">用户ID:</el-col>
					<el-col :span="18">{{ currentUser.id }}</el-col>
				</el-row>
				<el-row :gutter="20" class="detail-row">
					<el-col :span="6">用户名:</el-col>
					<el-col :span="18">{{ currentUser.username }}</el-col>
				</el-row>
				<el-row :gutter="20" class="detail-row">
					<el-col :span="6">注册时间:</el-col>
					<el-col :span="18">{{ currentUser.registerTime }}</el-col>
				</el-row>
				<el-row :gutter="20" class="detail-row">
					<el-col :span="6">用户状态:</el-col>
					<el-col :span="18">
						<el-tag :type="currentUser.isAdmin ? 'success' : 'info'" size="medium">
							{{ currentUser.isAdmin ? '管理员用户' : '普通用户' }}
						</el-tag>
					</el-col>
				</el-row>
				<el-row :gutter="20" class="detail-row">
					<el-col :span="6">上次登录:</el-col>
					<el-col :span="18">{{ currentUser.lastLogin || '未记录' }}</el-col>
				</el-row>
				<el-row :gutter="20" class="detail-row">
					<el-col :span="6">登录次数:</el-col>
					<el-col :span="18">{{ currentUser.loginCount || 0 }} 次</el-col>
				</el-row>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
			</span>
		</el-dialog> -->
  </div>
</template>
<script>
import axios from "../js/request.js";
export default {
  data() {
    // 密码验证规则
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能少于6位"));
      } else {
        callback();
      }
    };

    // 确认密码验证规则(注册)
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.createForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 确认密码验证规则(修改密码)
    const validateConfirmNewPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.new_password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      users: [],
      filteredUsers: [],
      loading: false,
      searchKeyword: "",
      statusFilter: "all",
      selectedRows: [],
      createDialogVisible: false,
      passwordDialogVisible: false,
      detailDialogVisible: false,
      currentUser: null,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      // 创建用户表单
      createForm: {
        username: "",
        password: "",
        confirmPassword: "",
        is_admin: false
      },

      // 修改密码表单
      passwordForm: {
        userId: "",
        username: "",
        new_password: "",
        confirmPassword: ""
      },

      // 创建表单验证规则
      createRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 16,
            message: "用户名长度在 3 到 16 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validateConfirmPassword,
            trigger: "blur"
          }
        ]
      },

      // 密码表单验证规则
      passwordRules: {
        new_password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validateConfirmNewPassword,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    // 获取用户数据（模拟）
    fetchUsers() {
      this.loading = true;
      axios.get("getAllUsers").then(e => {
        this.filteredUsers = e.users;
        this.pagination.total = e.users.length;
        this.loading = false;
      });
    },

    // 处理表格选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },

    // 显示创建用户对话框
    showCreateDialog() {
      this.createDialogVisible = true;
    },

    // 重置创建用户表单
    resetCreateForm() {
      this.$refs.createFormRef.resetFields();
    },

    // 创建用户
    createUser() {
      this.$refs.createFormRef.validate(valid => {
        if (valid) {
          // 模拟创建用户操作
          this.loading = true;
          axios.post("register", this.createForm).then(e => {
            if (e.ret == 0) {
              this.fetchUsers();
              this.$message.success("用户创建成功");
              this.createDialogVisible = false;
              this.resetCreateForm();
            } else {
              this.$alert(e.error);
            }
          });
        }
      });
    },

    // 显示修改密码对话框
    showChangePasswordDialog(user) {
      this.passwordForm.userId = user.id;
      this.passwordForm.username = user.name;
      this.passwordDialogVisible = true;

      // 重置表单验证状态
      this.$nextTick(() => {
        if (this.$refs.passwordFormRef) {
          this.$refs.passwordFormRef.resetFields();
        }
      });
    },

    // 修改密码
    changePassword() {
      this.$refs.passwordFormRef.validate(valid => {
        if (valid) {
          // 在实际应用中，这里应该发送API请求修改密码
          this.$message.success("密码修改成功");
          this.passwordDialogVisible = false;
        }
      });
    },

    // 切换管理员状态
    toggleAdminStatus(user) {
      const action = user.is_admin ? "取消管理员权限" : "授予管理员权限";

      this.$confirm(`确认要${action}用户 "${user.name}" 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 在实际应用中，这里应该发送API请求更新权限
          axios.post("authorizeAdmin", { id: user.id }).then(e => {
            if (e.ret == 0) {
              this.$message.success(e.message);
            } else this.$message.error(e.error);
            user.is_admin = user.is_admin == 0 ? 1 : 0;
          });
        })
        .catch(() => {});
    },

    // 批量设置管理员
    batchGrantAdmin() {
      if (this.selectedRows.length === 0) return;

      this.$confirm(
        `确定要授予这 ${this.selectedRows.length} 个用户管理员权限吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // 更新权限状态
          this.selectedRows.forEach(user => {
            user.isAdmin = true;
          });

          this.$message.success(
            `已成功为 ${this.selectedRows.length} 个用户授予管理员权限`
          );
          this.selectedRows = [];
        })
        .catch(() => {});
    },

    // 批量取消管理员
    batchRevokeAdmin() {
      if (this.selectedRows.length === 0) return;

      this.$confirm(
        `确定要取消这 ${this.selectedRows.length} 个用户的管理员权限吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // 更新权限状态
          this.selectedRows.forEach(user => {
            user.isAdmin = false;
          });

          this.$message.success(
            `已成功为 ${this.selectedRows.length} 个用户取消管理员权限`
          );
          this.selectedRows = [];
        })
        .catch(() => {});
    },

    // 删除用户
    handleDelete(user) {
      this.$confirm(
        `确认要删除用户 "${user.name}" 吗？此操作不可恢复！`,
        "警告",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "error"
        }
      )
        .then(() => {
          axios.post("removeUser", { id: user.id }).then(e => {
            if (e.ret == 0) {
              const index = this.filteredUsers.findIndex(u => u.id === user.id);
              if (index !== -1) {
                this.filteredUsers.splice(index, 1);
                this.$message.success("用户删除成功");
              }
            } else this.$message.error(e.error);
          });
        })
        .catch(() => {});
    },

    // 批量删除用户
    batchDelete() {
      if (this.selectedRows.length === 0) return;

      this.$confirm(
        `确定要批量删除 ${this.selectedRows.length} 个用户吗？此操作不可恢复！`,
        "警告",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "error"
        }
      )
        .then(() => {
          // 实际应用中应调用API批量删除
          const selectedIds = this.selectedRows.map(user => user.id);
          this.users = this.users.filter(
            user => !selectedIds.includes(user.id)
          );
          this.filteredUsers = [...this.users];

          this.$message.success(
            `已成功删除 ${this.selectedRows.length} 个用户`
          );
          this.selectedRows = [];
          this.pagination.total = this.users.length;
        })
        .catch(() => {});
    },

    // 显示用户详情
    // showUserDetail(user) {
    // 	this.currentUser = {
    // 		...user
    // 	};
    // 	this.detailDialogVisible = true;
    // },

    // 格式化用户ID显示
    // formatUserId(row) {
    // 	return `U${row.id}`;
    // },

    // dataFmt(ow, column, cellValue, index){
    // 	const date = new Date(cellValue)
    // 	const fmtstr = date.toDateString("yyyy-MM-dd")
    // 	return fmtstr
    // },
    searchUsers() {
      this.loading = true;
      axios
        .post("searchUsers", {
          query: this.searchKeyword,
          role: this.statusFilter
        })
        .then(e => {
          this.filteredUsers = e.users;
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    // 重置搜索条件
    resetSearch() {
      this.searchKeyword = "";
      this.statusFilter = "all";
      this.fetchUsers();
    },

    // 分页 - 每页条数变化
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.fetchUsers();
    },

    // 分页 - 当前页码变化
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetchUsers();
    },

    // filteredUsers: {
    // 	get() {
    // 		let result = [...this.users];

    // 		// 根据关键字过滤
    // 		if (this.searchKeyword) {
    // 			const keyword = this.searchKeyword.toLowerCase();
    // 			result = result.filter(user =>
    // 				user.username.toLowerCase().includes(keyword) ||
    // 				user.id.toString().includes(keyword)
    // 			);
    // 		}

    // 		// 根据状态过滤
    // 		if (this.statusFilter) {
    // 			const isAdmin = this.statusFilter === 'admin';
    // 			result = result.filter(user => user.isAdmin === isAdmin);
    // 		}

    // 		// 更新分页总数
    // 		this.pagination.total = result.length;

    // 		// 分页显示
    // 		const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
    // 		const end = start + this.pagination.pageSize;
    // 		return result.slice(start, end);
    // 	},
    // 	set(value) {
    // 		// 保持响应式更新
    // 	}
    // }
    goback() {
      this.$router.replace({
        path: "/"
      });
    }
  },
  computed: {
    // 实际应用中，过滤应该在后端完成，这里为了演示在前端处理
  }
};
</script>

<style>
body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f7fa;
}

.user-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.search-section {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.status-tag {
  cursor: pointer;
}

.admin-tag {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
  border-color: #91d5ff !important;
}

.normal-user-tag {
  background-color: #f6ffed !important;
  color: #52c41a !important;
  border-color: #b7eb8f !important;
}

.table-actions {
  margin-bottom: 20px;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-badge {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 12px;
  background: #f0f2f5;
  margin-left: 5px;
}

.user-id-col {
  font-family: monospace;
  color: #666;
  font-size: 14px;
}
</style>
