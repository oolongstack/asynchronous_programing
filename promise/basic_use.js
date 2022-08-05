const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1");
  }, 1000);
});
const p2 = p1.then(
  (res) => {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(res + "p2");
    //   }, 1000);
    // });
    // return "正确";
    // return 基本值会传递给下一个then的正确的回调
    // 抛出错误或者返回一个失败的promise会跑到下一个then的错误的回调
    // return Promise.reject("错误");
    return {
      then() {
        return res + "thenable";
      },
    };
  },
  (err) => {
    return "错误";
  }
);
// .then(
//   (res) => {
//     console.log(res, "res");
//   },
//   (err) => {
//     console.log(err, "err");
//   }
// );
// 使promise变为失败的方法有两个，抛出错误，返回一个拒绝态的promise
p2.then((res) => {
  console.log(res);
});
