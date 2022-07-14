// raw loader接受到的content是buffer数据
module.exports = function (content) {
  console.log(content);
  return content;
};

module.exports.raw = true;
