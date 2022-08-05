const fs = require("fs");
const path = require("path");

// 异步读取文件内容
fs.readFile(
  path.resolve(__dirname, "files/1.txt"),
  "utf-8",
  function (err, data) {
    if (err) return err;
    console.log(data);
  }
);

const readFile = promisify(fs.readFile);
// 将node api promise化
function promisify(nodeFn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      nodeFn(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
}

readFile(path.resolve(__dirname, "files/2.txt"), "utf-8").then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);

// 将模块所有函数转为promise
Object.keys(fs).forEach((fn) => {
  if (typeof fn === "function") {
    fs[fn] = promisify(fs[fn]);
  }
});
