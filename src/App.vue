<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Listing</router-link> |
      <router-link to="/about">Tools</router-link> |
	  <router-link to="/CAConvert">CAConvert</router-link>
    </div>
    <router-view />
	<el-row style="font-size: 12px; padding:20px">
		  冀ICP备2021011143号
	</el-row>
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
</style>
