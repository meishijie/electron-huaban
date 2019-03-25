const Aria2 = require("aria2");

let options = {
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: '',
  path: '/jsonrpc'
}

const aria2 = new Aria2([options]);

const batch = [
  ["addUri", ["https://www.baidu.com/"], {
    dir: "./test/",
    out: "p.js"
  }],
  ["addUri", ["https://www.baidu.com/"], {
    dir: "./test/",
    out: "p.js"
  }],
  ["addUri", ["https://www.baidu.com/"], {
    dir: "./test/",
    out: "p.js"
  }],
  ["addUri", ["https://www.baidu.com/"], {
    dir: "./test/",
    out: "p.js"
  }],
  ["addUri", ["https://www.baidu.com/"], {
    dir: "./test/",
    out: "p.js"
  }],
  ["addUri", ["https://www.baidu.com/"], {
    dir: "./test/",
    out: "p.js"
  }],
  ["addUri", ["https://www.baidu.com/"], {
    dir: "./test/",
    out: "p.js"
  }],
  ["addUri", ["https://www.baidu.com/"], {
    dir: "./test/",
    out: "p.js"
  }],

]
aria2
  .open()
  .then(() => console.log("open"))
  .catch(err => console.log("error", err));
aria2.batch(batch);
aria2.on("onDownloadComplete", (params) => {
  console.log('aria2', params)
})