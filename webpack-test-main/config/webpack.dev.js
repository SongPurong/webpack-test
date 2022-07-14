const os = require("os");
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const MinCssExtractPlugin = require("mini-css-extract-plugin");

const threads = os.cpus().length; // cpu核数

module.exports = {
  // 入口
  entry: "./src/main.js",
  // 输出
  output: {
    // 开发模式不需要输出
    path: undefined,
    // 入口文件打包输出的文件名
    filename: "static/js/main.js",
    // 打包输出的其他文件名
    chunkFilename: "static/js/[name].chunk.js",
    // 图片、字体等通过type: asset处理资源命名方式
    assetModuleFilename: "static/media/[hash:10][ext][query]",
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        // 每个文件只匹配一个rule
        oneOf: [
          {
            test: /\.css$/, // 只检测.css文件
            use: [
              // 执行顺序：从右到左（从下到上）
              MinCssExtractPlugin.loader, // 将js中css通过创建style标签添加到html中
              "css-loader", // 将css资源编译成commonjs的模块到js中
              "postcss-loader", // css兼容性处理
            ],
          },
          {
            test: /\.less$/,
            // loader: 'xxx', 只能使用一个loader，use: []能使用多个loader
            use: [
              MinCssExtractPlugin.loader,
              "css-loader",
              "postcss-loader",
              "less-loader",
            ],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              MinCssExtractPlugin.loader,
              "css-loader",
              "postcss-loader",
              "sass-loader",
            ],
          },
          {
            test: /\.styl$/,
            use: [
              MinCssExtractPlugin.loader,
              "css-loader",
              "postcss-loader",
              "stylus-loader",
            ],
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                // 小于10kb的图片转base64
                // 优点：减少请求，缺点：体积变大
                maxSize: 10 * 1024,
              },
            },
            // generator: {
            //   // 输出图片名称
            //   // hash：唯一的文件名(:10取前十位)，ext：文件拓展名，query：查询参数
            //   filename: "static/images/[hash:10][ext][query]",
            // },
          },
          {
            test: /\.(ttf|woff2?|map3|map4|avi)$/,
            type: "asset/resource",
            // generator: {
            //   // 输出名称
            //   filename: "static/media/[hash:10][ext][query]",
            // },
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除目录中的文件不处理
            include: path.resolve(__dirname, "../src"), // 只处理src下的文件，二者选其一
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  works: threads, // 进程数量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false, // 关闭缓存压缩
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    // plugin的配置
    new ESLintPlugin({
      // 检查哪些文件
      context: path.resolve(__dirname, "../src"),
      // exclude: "node_modules", // 默认不检查node_modules
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslint-cache"
      ),
      threads, // 开启多进程和进程数量
    }),
    new HtmlPlugin({
      // 模板：以public/index.html文件创建新的html文件
      // 新的html文件特点： 1.结构和原来一致， 2.自动引入打包文件输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MinCssExtractPlugin({
      filename: "static/css/main.css",
      chunkFilename: "static/css/[name].chunk.css",
    }),
  ],
  // 开发服务器：不会输出资源，在内存中编译打包
  devServer: {
    host: "localhost", // 启动服务器域名
    port: 3000, // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    // hot: false, // HMR热模块替换，只更新替换修改的模块，加快打包速度，webpack5默认开启
  },
  // 模式
  mode: "development",
  // 调试模式 sourceMap
  devtool: "cheap-module-source-map",
};
