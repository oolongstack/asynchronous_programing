const fs = require("fs").promises;
const path = require("path");
function* readFile() {
  const file1 = yield fs.readFile(
    path.resolve(process.cwd(), "files/1.txt"),
    "utf-8"
  );
  const file2 = yield fs.readFile(path.resolve(process.cwd(), file1), "utf-8");

  return file2;
}

const read = readFile();
const { value, done } = read.next();
if (!done) {
  value.then((data) => {
    const { value, done } = read.next(data);
    if (!done) {
      value.then((data) => {
        console.log(data);
      });
    }
  });
}

// fs.readFile(path.resolve(process.cwd(), "files/1.txt"), "utf-8").then(
//   (data) => {
//     console.log(data);
//     fs.readFile(path.resolve(process.cwd(), data), "utf-8").then((data) => {
//       console.log(data);
//     });
//   }
// );
function co(gen) {
  const iterator = gen();
  return new Promise((resolve, reject) => {
    function next(data) {
      const { value, done } = iterator.next(data);
      if (!done) {
        value.then(
          (res) => {
            next(res);
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        resolve(value);
      }
    }
    next();
  });
}
co(readFile).then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);
