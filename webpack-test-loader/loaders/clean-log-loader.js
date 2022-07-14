module.exports = function (content) {
  // 清除文件内容中的console.log(xxx)
  return content.replace(/console\.log\(.*);?/g, "");
};
