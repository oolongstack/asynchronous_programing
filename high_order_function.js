// 高阶函数就是一个 返回值为函数或者参数为函数的函数 如下
function foo(cb) {
  cb();
  return () => {};
}

// 高阶函数解决了什么问题？
function core() {
  console.log("core");
}
// core函数对象添加before属性
Function.prototype.before = function (cb) {
  return () => {
    cb();
    this();
  };
};

const newCore = core.before(function () {
  console.log("core before");
});

newCore();
