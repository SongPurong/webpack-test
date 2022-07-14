/*
  loader就是一个函数
  当webpack解析对应文件的时候，就会调用对应的loader去处理
  loader接受到文件内容作为参数，返回处理后的内容出去
    content 文件内容
    map sourceMap
    meta 别的loader传递的数据
*/

module.exports = function (content, map, meta) {
  console.log("content: ", content);
  return content;
};
