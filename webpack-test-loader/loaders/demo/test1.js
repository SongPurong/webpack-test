// 同步loader
// module.exports = function (content) {
//   return content;
// };

module.exports = function (content, map, meta) {
  console.log("test1");
  /*
    第一个参数，err代表是否有错误
    第二个参数，content代表内容
    第三个参数，sourceMap继续传递sourceMap
    第四个参数，meta给下一个loader传递参数处理
  */
  this.callback(null, content, map, meta);
};
