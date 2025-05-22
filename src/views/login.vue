<template>
	<div class="login-container">
		<div class="login-box">
			<h1 class="login-title">系统登录</h1>

			<el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" size="large"
						clearable />
				</el-form-item>

				<el-form-item prop="password">
					<el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
						size="large" show-password clearable @keyup.enter.native="handleLogin" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" size="large" class="login-btn" @click="handleLogin" :loading="loading">
						立即登录
					</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import axios from "../js/request.js";
	export default {
		data() {
			return {
				loginForm: {
					username: '',
					password: ''
				},
				loginRules: {
					username: [{
							required: true,
							message: '用户名不能为空',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 12,
							message: '长度在3到12个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 18,
							message: '长度在6到18个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			handleLogin() {
				this.$refs.loginFormRef.validate(valid => {
					if (valid) {
						axios.post('login', this.loginForm).then(res => {
							if (res.ret === 0) {
								this.$message({
									message: "登录成功",
									type: "success"
								});
								
								localStorage.setItem('api_token', res.token);
								this.$store.commit("login",res.user)
							} else {
								this.$message({
									message: res.error,
									type: "error"
								});
							}
						}).catch(e=>{
							this.$message({
								message: '请正确输入信息',
								type: "error"
							});
						})
					}
				})
			}
		},

		// const handleLogin = () => {
		// 	loginFormRef.value.validate(valid => {
		// 		if (valid) {
		// 			axios.post('login', loginForm).then(res => {
		// 				if (res.ret === 0) {
		// 					localStorage.setItem('api_token', res.token);
		// 					this.$router.replace({
		// 						// path: path
		// 					})
		// 				} else {
		// 					// ElMessage.error(res.error)
		// 				}
		// 			})
		// 		}
		// 	})
		// }
	}
</script>

<style scoped>
	.login-container {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	}

	.login-box {
		width: 450px;
		padding: 40px;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 12px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.login-title {
		text-align: center;
		color: #303133;
		font-size: 28px;
		margin-bottom: 40px;
		letter-spacing: 2px;
	}

	.login-form {
		:deep(.el-input__wrapper) {
			border-radius: 8px;
			padding: 14px 20px;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		}

		:deep(.el-input__inner) {
			font-size: 16px;
		}

		.el-form-item {
			margin-bottom: 28px;
		}
	}

	.login-btn {
		width: 100%;
		font-size: 16px;
		letter-spacing: 2px;
		border-radius: 8px;
		background: linear-gradient(45deg, #409eff, #79bbff);
		border: none;
		transition: all 0.3s ease;

		&:hover {
			opacity: 0.9;
			transform: translateY(-2px);
		}
	}

	.login-options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		color: #606266;
	}
</style>