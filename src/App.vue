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
</style>
