const Aria2 = require("aria2");

let options = {
    host: 'localhost',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc'
  }

const aria2 = new Aria2([options]);
aria2
  .open()
  .then(() => console.log("open"))
  .catch(err => console.log("error", err));
aria2.call("addUri",["https://www.baidu.com/"],{ dir: "./",out:"p.js" })
aria2.on("onDownloadComplete", (params) => {
  console.log('aria2', params)
  aria2.close()
})