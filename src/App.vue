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
		mounted() {
			// let pusher = new Pusher('90d548917a736f8c6e77', {
			//       cluster: 'mt1'
			//     });
			
			//     let channel = pusher.subscribe('public-notification-new');
			//     channel.bind('new-notification', (e) => {
			//       console.log(e)
			//     });
			// console.log(this.$echo)
			this.$echo.channel('public-notification')
				.listen('.new-notification', (e) => { // 注意事件名前加点号
					// console.log("接收到通知")
					console.log(e)
					// this.$alert(e.message)
				});
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