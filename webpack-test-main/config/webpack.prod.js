const os = require("os");
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const MinCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadPlugin = require("@vue/preload-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const threads = os.cpus().length; // cpu核数

module.exports = {
  // 入口
  entry: "./src/main.js",
  // 输出
  output: {
    // 所有文件的输出路径
    // __dirname nodejs的变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, "../dist"), // 绝对路径
    // 入口文件打包输出的文件名
    filename: "static/js/[name].[contenthash:10].js",
    // 打包输出的其他文件名
    chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
    // 图片、字体等通过type: asset处理资源命名方式
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    // 自动清空上次打包的内容
    // 原理：在打包前，将path整个目录内容清空，再进行打包
    clean: true,
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
              "postcss-loader",
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
      filename: "static/css/name.[contenthash:10].css",
      chunkFilename: "static/css/[name].chunk.[contenthash:10].css",
    }),
    new PreloadPlugin({
      rel: "preload",
      as: "script",
    }),
    new WorkboxPlugin.GenerateSW({
      // 帮助快速启用ServiceWorkers
      // 不允许遗留任何“旧的”ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  optimization: {
    // 压缩的操作
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserPlugin({
        parallel: threads, // 开启多进程和进程数量
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 代码分割配置
    splitChunks: {
      chunks: "all",
      // 其他都用默认配置
    },
    // 提取runtime文件
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  // 模式
  mode: "production",
  // 调试模式
  devtool: "source-map",
};
