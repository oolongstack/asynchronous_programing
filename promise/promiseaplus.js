// https://promisesaplus.com/
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

// 该函数专门用来解析then方法成功或失败的回调的返回值类型，并做不同的处理
function resolvePromise(promise2, x, resolve, reject) {
  // console.log(promise2, x, resolve, reject);
  if (promise2 === x)
    return reject(new TypeError("Chaining cycle detected for promise"));
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called = false;
    try {
      // 可能x.then 使用defineProperty定义，且取值时主动报错了
      let then = x.then;
      if (typeof then === "function") {
        // 是一个promise对象,使用该promise的成功或者失败作为下一个then的成功或者失败的值
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            // 处理resolve的值是一个promise的情况
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // 是一个对象或者函数
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // 普通值 直接成功
    resolve(x);
  }
}
class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((cb) => cb());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb());
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // TODO...
        setTimeout(() => {
          try {
            // 拿到then成功的回调的返回值
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            // 如果then成功的回调抛出错误，则抛出错误
            reject(error);
          }
        });
      }

      if (this.status === REJECTED) {
        // TODO...
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      // 同步代码这时候既没成功也没失败，是一个异步的调用
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          // TODO...
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              console.log(1);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          // TODO...
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
    return promise2;
  }
}

// const promise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("9090");
//   }, 1000);
// });

// const p1 = promise.then((res) => {
//   return res + 1;
// });

// p1.then((res) => {
//   console.log(res);
// });

MyPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = MyPromise;
