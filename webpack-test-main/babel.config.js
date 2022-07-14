// babel 主要将ES6语法编写的代码转化为向后兼容的js语法，以便旧版本的浏览器能够预览

module.exports = {
  // 智能预设，能够编译ES6语法
  // @babel/preset-env 官方语法预设
  // @babel/preset-react react jsx语法预设
  // @babel/preset-typescript ts语法预设
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // 按需加载，自动引入
        corejs: 3,
      },
    ],
  ],
};
