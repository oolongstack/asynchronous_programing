// 生成器函数  函数执行返回一个迭代器对象

// function* gen() {
//   yield 1;
//   yield 2;
//   yield 3;
// }
// const iterator = gen();
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());

//  什么是迭代器，就是一个具有next方法的对象

let likedArray = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4,
  // [Symbol.iterator]() {
  //   let index = 0;
  //   return {
  //     next: () => {
  //       if (index < this.length) {
  //         return {
  //           value: this[index++],
  //           done: false,
  //         };
  //       } else {
  //         return {
  //           value: undefined,
  //           done: true,
  //         };
  //       }
  //     },
  //   };
  // },
  *[Symbol.iterator]() {
    let index = 0;
    while (index < this.length) {
      yield this[index++];
    }
  },
};

const arr = [...likedArray];
console.log(arr);

for (const val of likedArray) {
  console.log(val);
}
