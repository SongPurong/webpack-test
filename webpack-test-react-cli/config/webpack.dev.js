const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// 返回处理样式loader的函数
const getStyleLoader = (pre) => {
  return [
    "style-loader",
    "css-loader",
    {
      // 处理css兼容性问题
      // 配合package.json中的brows  erslist来指定兼容到什么程度
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    pre,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:10][ext][query]",
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: getStyleLoader(),
      },
      // 处理less
      {
        test: /\.less$/,
        use: getStyleLoader("less-loader"),
      },
      // 处理sass/scss
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoader("sass-loader"),
      },
      // 处理stylus
      {
        test: /\.styl$/,
        use: getStyleLoader("stylus-loader"),
      },
      // 处理图片
      {
        test: /\.(jpe?g|png|gif|webp|svg)/,
        type: "assets",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb以下转换成base64
          },
        },
      },
      // 处理其他资源
      {
        test: /\.(woff2?|ttf)/,
        type: "asset/resource",
      },
      // 处理js
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          plugins: ["react-refresh/babel"], // 激活js的HMR功能
        },
      },
    ],
  },
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new ReactRefreshWebpackPlugin(), // 激活js的HMR功能
  ],
  mode: "development",
  devtool: "cheap-module-source-map",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  // webpack解析模块加载选项
  resolve: {
    // 自动补全文件拓展名
    extensions: [".jsx", ".js", ".json"],
  },
  devServer: {
    host: "localhost",
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true, // 解决前端路由刷新404问题
  },
};
