<template>
	<div id="app">
		<!-- <div id="nav" style="padding-top: 10px; padding-bottom: 10px;">
      <router-link to="/">Tracking & SN</router-link> |
	  <router-link to="/trackingcheck">CA Tracking Check</router-link> |
	  <router-link to="/UpgradeMission">Upgrade Workbench</router-link>
    </div> -->
		<router-view />
		<!-- <el-row style="font-size: 12px; padding:20px">
		  冀ICP备2021011143号
	</el-row> -->
	</div>
</template>
<script>
	import Pusher from 'pusher-js';
	export default {
		data() {
			return {
				//浏览器通知
				is_allow_notify: false,
				//系统权限
				sys_notify_allow: localStorage.getItem("notify_allow") ?? false
			}
		},
		computed: {
			user() {
				return this.$store.state.userinfo;
			}
		},
		watch: {
			user(newVal, oldVal) {
				if (newVal != oldVal) {
					this.joinChannel()
					console.log("检测到用户ID变更，重新加入新频道")
				}
			}
		},
		mounted() {
			//请求通知权限
			this.requestNotificationPermission()
			if (this.user) {
				this.joinChannel()
				console.log("成功加入频道")
			}
			
			this.$store.dispatch("fetchMessage");
		},
		created() {
			document.title = "WTOD Work Flow"
		},
		methods: {
			joinChannel() {
				this.$echo.channel(`notification.${this.$store.state.userinfo.id}`)
					.listen('.new-notification', (e) => { // 注意事件名前加点号		
						this.showNotification(e.message, e.type, e.path)
						// this.$store.commit("recvNotif",e);
						this.$store.dispatch("fetchMessage");
					});
			},
			requestNotificationPermission() {
				// 检查是否支持通知
				if (!("Notification" in window)) {
					console.log("您的浏览器不支持系统通知")
					alert("您的浏览器不支持系统通知");
					return;
				}

				if (Notification.permission === "granted") {
					this.is_allow_notify = true;
					if (this.sys_notify_allow == false) {
						this.showTestNotification()
					}
				} else if (Notification.permission !== "denied") {
					// 否则请求权限
					Notification.requestPermission().then(permission => {
						if (permission === "granted") {
							this.is_allow_notify = true;
							this.showTestNotification();
						}
						else if (permission === 'denied')
							this.is_allow_notify = false;
					});
				}
				else
					this.is_allow_notify = false;

			},

			showNotification(message, type, path) {
				const notification = new Notification(type, {
					body: message,
					requireInteraction: false, // 需要用户手动关闭，
					icon: "https://cdn.shopify.com/s/files/1/0070/7032/files/oie_1817059EVTExmDY.gif"
				});
				notification.onclick = (event) => {
					event.preventDefault()
					window.focus();
					// 点击通知时跳转到页面
					window.location.href = path;
					notification.close()
				};
				// 成功通知
				if (this.sys_notify_allow == false || this.is_allow_notify == false) {
					this.$iziToast.info({
						title: type,
						message: message,
						onClosing: (setting, toast, by) => {
							if (by === 'drag') {
								this.$router.replace({
									path: path
								})
							}
						},
						onOpened: (setting,toast) =>{
							this.playNotificationSound()
							document.title = "您有新消息"
							window.onfocus=()=>{
								document.title = "WTOD Work Flow"
							}
							
						}
					});
				}
			},
			showTestNotification() {
				const notification = new Notification('测试通知', {
					body: '这是一条测试通知，请手动关闭或点击通知完成验证',
					requireInteraction: true // 需要用户手动关闭
				});
				notification.onclick = () => {
					// this.is_allow_notify = true
					this.sys_notify_allow = true;
					localStorage.setItem("notify_allow", true)
				}
				notification.onclose = () => {
					// this.is_allow_notify = true
					this.sys_notify_allow = true;
					localStorage.setItem("notify_allow", true)
				}
			},
			playNotificationSound() {
				// 创建音频对象，设置声音文件路径
				const audio = new Audio('https://downsc.chinaz.net/Files/DownLoad/sound1/202412/xm3281.wav');
				// 播放声音
				audio.play().catch(e => console.error("声音播放失败:", e));
			}
		}
	}
</script>
<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	#nav {
		padding: 30px;
	}

	#nav a {
		font-weight: bold;
		color: #2c3e50;
	}

	#nav a.router-link-exact-active {
		color: #42b983;
	}

	.no-wrap {
		white-space: nowrap;
		/* 禁止换行 */
		overflow: hidden;
		/* 隐藏溢出内容 */
		text-overflow: ellipsis;
		/* 显示省略号 */
	}

	/* 限制宽度 + 自动换行 */
	.el-tooltip__popper {
		max-width: 200px;
		/* 视口宽度的80% */
		white-space: pre-line !important;
		word-break: break-word;
	}

	/* 无数据居中 */
	.custom-empty {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		padding: 40px 0;
	}

	.empty-text {
		color: #909399;
		font-size: 14px;
	}

	/* 强制覆盖 Element 默认样式 */
	.el-table__empty-block {
		width: 100% !important;
		height: 100% !important;
	}

	.el-table__empty-text {
		position: static !important;
		transform: none !important;
	}
</style>