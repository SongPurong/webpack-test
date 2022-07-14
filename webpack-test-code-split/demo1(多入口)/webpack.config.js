const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // entry: "./src/main.js" // 只有一个入口，单入口
  entry: {
    // 有多个入口文件，多入口
    app: "./src/app.js",
    main: "./src/main.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", // webpack的命名方式，[name]以文件名自己命名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.relative(__dirname, "public/index.html"),
    }),
  ],
  mode: "production",
};
