// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var fs = require("fs");
var request = require("request");

//
var desName = "image.png";
var allGroups = [];
// 下载方法
function download(src, desName) {
  var writeStream = fs.createWriteStream(desName);
  var readStream = request(src);
  readStream.pipe(writeStream);
  readStream.on("end", function() {
    console.log("文件下载成功");
  });
  readStream.on("error", function() {
    console.log("错误信息:" + err);
  });
  writeStream.on("finish", function() {
    console.log("文件写入成功");
    writeStream.end();
  });
}

//
var request = require("request");
var cheerio = require("cheerio");
var Bagpipe = require("bagpipe");

var board_id = "27788232";
var maxid = "";
var limit = 20;
var url =
  "http://huaban.com/boards/" +
  board_id +
  "/?max=" +
  maxid +
  "&limit=" +
  limit +
  "&wfl=1";
var imgList = [];
var foldname = "images"; // = board_id 需要根据画板id赋值 创建对应的文件夹
var GPATH = "E:/图片搜藏/huaban";
var board_id_path = GPATH + "/" + board_id;
var _allcount = 0;
var _allImagesCount = 0;
//
//下载区
//
var downloadPic = function(src, dest) {
  request(src)
    .on("timeout", function() {
      console.log("请求超时");
    })
    .pipe(fs.createWriteStream(dest))
    .on("close", function() {
      _allcount++;
      console.log("保存了" + _allcount + "/" + _allImagesCount + "张图片");
    });
};
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function checkAndMakePath(path) {
  fs.exists(path, function(exists) {
    if (exists == true) {
      console.log("不用创建");
    } else {
      fs.mkdirSync(path);
      console.log("创建成功");
    }
  });
  await sleep(100);
  console.log("时间到");
}
function downall(imgList) {
  var bagpipe = new Bagpipe(5, { timeout: 300 });
  for (var i = 0; i < imgList.length; i++) {
    // console.log("http://img.hb.aicdn.com/" + imgList[i][1]);
    bagpipe.push(
      downloadPic,
      "http://img.hb.aicdn.com/" + imgList[i][1],
      board_id_path + "/" + imgList[i][1] + "." + imgList[i][2],
      function() {}
    );
  }
}
function main() {
  _allcount = 0;
  //创建画板id的目录
  board_id_path = GPATH + "/" + board_id;
  checkAndMakePath(board_id_path);

  //获取花瓣的网页代码
  request(url, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      var regExp = /"pin_id":(.*?),.+?"file_id":(.*?),.+?"file":\{.+?"key":(.*?),.+?"type":"image\/(.*?)"/g; //未使用g选项
      while ((res = regExp.exec(body))) {
        var temparray = [];
        temparray.push(res[1], res[3].slice(1, -1), res[4]);
        allGroups.push(temparray);
      }
      _allImagesCount = allGroups.length;
      // console.log(allGroups);
      // imgList = [];
      // JSON.parse($('script[id="initData"]').html()).list.forEach(function(item) {
      //   imgList.push(item.img);
      // });
      // console.log(imgList);
      // 开始下载所有图片
      // downall(imgList);
      // var tempAllImg = [];
      // allGroups.map(function(item) {
      //   tempAllImg.push(item[1] + "." + item[2]);
      //   console.log(item[1] + "." + item[2]);
      // });
      downall(allGroups);
    }
  });
}
main();
