// 全部引入core-js
// import "core-js";
// 按需引入
// import "core-js/es/promise";

import count from "./js/count";
import sum from "./js/sum";
// 想要webpack打包资源，必须引入资源
// 因为webpack默认开启tree shaking，只打包引入的资源模块
// 文件内部分被引入则未被引入部分也不会被打包
import "./css/index.css";
import "./css/iconfont.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./stylus/index.styl";

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4, 5));

document.getElementById("btn").onclick = function () {
  // eslint不识别动态导入语法，需要额外追加配置
  // /* webpackChunkName: "math" */ webpack魔法命名
  import(/* webpackChunkName: "math" */ "./js/math").then(({ mul }) => {
    console.log(mul(3, 3));
  });
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("service worker registered: " + registration);
      })
      .catch((err) => {
        console.log("service worker registration failed: " + err);
      });
  });
}
