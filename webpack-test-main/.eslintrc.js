// eslint 检查代码格式

module.exports = {
  // 解析选项
  parserOptions: {
    ecmaVersion: 6, // ES语法规则版本 es6
    sourceType: "module", // ES模块化 es module
    // ecmaFeatures: { // ES其他特性
    //  jsx: true // 如果是React项目，就需要开启jsx语法
    // }
  },
  // 具体检查规则，详见Eslint规则文档
  rules: {
    "no-var": 2, // 不能使用var定义变量 0关闭，1警告，2报错
  },
  // 继承其他规则
  // eslint:recommended Eslint官方规则
  // plugin:vue/essential Vue Cli官方规则
  // react-app React Cli官方规则
  extends: ["eslint:recommended"],
  // ... 其他规则
  env: {
    node: true, // 启用node中的全局变量
    browser: true, // 启用浏览器中的全局变量
  },
  plugins: ["import"], // 解决动态导入语法
};
