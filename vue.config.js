module.exports = {
  transpileDependencies: [
    "sockjs-client", // 添加问题报告中涉及的所有依赖
    "pusher-js", // 添加 pusher-js
    "laravel-echo" // 添加 laravel-echo
  ],

  // 可选：提高源映射质量以更好地调试
  configureWebpack: {
    devtool: "source-map"
  }
};
