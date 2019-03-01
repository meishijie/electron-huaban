// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var fs = require("fs-extra");
var request = require("superagent");

//
// var desName = "image.png";
// 检查是否有更新的id，就是画板的第一张图片id
var _checkNewId = "";
var _allGroups = [];
// 下载方法
// function download(src, desName) {
//   var writeStream = fs.createWriteStream(desName);
//   var readStream = request(src);
//   readStream.pipe(writeStream);
//   readStream.on("end", function() {
//     console.log("文件下载成功");
//   });
//   readStream.on("error", function() {
//     console.log("错误信息:" + err);
//   });
//   writeStream.on("finish", function() {
//     console.log("文件写入成功");
//     writeStream.end();
//   });
// }

var request = require("request");
var cheerio = require("cheerio");
var Bagpipe = require("bagpipe");

//画板的id
var _board_id = "35083";
// 检查翻页的id
var _maxid = "";
// 每次打开的图片
var _limit = 20;
// 完整拼合的地址
var _url =
  "http://huaban.com/boards/" +
  _board_id +
  "/?max=" +
  _maxid +
  "&limit=" +
  _limit +
  "&wfl=1";
// 所有图片列表
// var imgList = [];

var foldname = "images"; // = _board_id 需要根据画板id赋值 创建对应的文件夹
// 硬盘路径 可以设置
var GPATH = "E:/图片搜藏/huaban";
// 硬盘路径下的文件夹
var _board_id_path = GPATH + "/" + _board_id;
// 对下载的数量进行计数
var _allcount = 0;
// 一共要下载的图片
var _allImagesCount = 0;
var _allComplete = false;
var _updateId = "";
//
//下载区
// __src 图片地址
// __dest 硬盘路径
//
var downloadPic = function(__src, __dest) {
  const req = request.get(__src, { timeout: 7500 });
  req
    .pipe(
      fs.createWriteStream(__dest).on("error", error => {
        console.log("写入文件错误： ", error.message);
      })
    )
    .on("close", function() {
      _allcount++;
      console.log("保存了" + _allcount + "/" + _allImagesCount + "张图片");
      if (_allcount / _allImagesCount == 1) {
        console.log("下载完成了！");
      }
    });
  // request(__src, { timeout: 7500 })
  //   .on("abort", function() {
  //     console.log("'超时退出'" + __src);
  //   })
  //   .on("error", function() {
  //     console.log("下载失败" + __src);
  //   })
  //   .on("end", () => {
  //     console.log(`读取了 ${__src}`);
  //   })
  //   .pipe(
  //     fs.createWriteStream(__dest).on("error", error => {
  //       console.log("写入文件错误： ", error.message);
  //     })
  //   )
  //   .on("close", function() {
  //     _allcount++;
  //     console.log("保存了" + _allcount + "/" + _allImagesCount + "张图片");
  //   });
};

// 同步方法 中断一段时间
function sleep(__ms) {
  return new Promise(resolve => setTimeout(resolve, __ms));
}
// 同步方法 检查创建目录
async function checkAndMakePath(__path) {
  fs.exists(__path, function(exists) {
    if (exists == true) {
      console.log("不用创建");
    } else {
      fs.mkdirSync(__path);
      console.log("创建成功");
    }
  });
  await sleep(100);
}

// 下载所有图片
function downall(__imgList) {
  // imgList =  [[pin_id,图片地址,文件格式]]
  var bagpipe = new Bagpipe(10, { timeout: 7500 });
  for (var i = 0; i < __imgList.length; i++) {
    bagpipe.push(
      downloadPic,
      "http://img.hb.aicdn.com/" + __imgList[i][1],
      _board_id_path + "/" + __imgList[i][1] + "." + __imgList[i][2],
      function() {
        // console.log("保存了" + _allcount + "/" + _allImagesCount + "张图片");
      }
    );
  }
}
// 新建和读取文档的第一张图id
function checkUpdateId(__checkNewId) {
  //同步方法 判断是否有txt
  // 如果有就检测是否和参数相等，相等就是没有更新，直接跳出
  // 如果不相等就直接写入这个id
  fs.exists(_board_id_path + "/update.txt", function(exists) {
    if (exists == true) {
      _updateId = fs.readFileSync(_board_id_path + "/update.txt", "utf8");
      if (_updateId == __checkNewId) {
        console.log(
          "没有需要更新的内容。保存的id为：" + _updateId + "/" + __checkNewId
        );
        return;
      } else {
        // 有更新内容 需要限制更新的maxid
        // 需要限制读取的图片到 update.txt记录的id号
        console.log(
          `有最新加入的图片，需要更新.目标id为：${_updateId}，最新id为：${__checkNewId}`
        );
        loopGetAllImages();
        fs.writeFileSync(_board_id_path + "/update.txt", __checkNewId);
      }

      // var bytesRead = fs.readFileSync(_board_id_path + "/update.txt");
      // console.log(bytesRead);
    } else {
      console.log("创建文件");
      fs.writeFileSync(_board_id_path + "/update.txt", __checkNewId);
      console.log("创建id完成");
      // 先获取所有图片 定时器模式
      setInterval(loopGetAllImages, 1500);
      // loopGetAllImages();
    }
  });
}
//循环获取所有图片到 _allGroups
function loopGetAllImages() {
  console.log(_allComplete);
<<<<<<< HEAD
  if (_allComplete != false) {
    console.log("读取图片完成！开始下载！");
    // 下载图片开始
    downall(_allGroups);
    return;
  } else {
    // 根据_allComplete 判断是否要循环
    _url =
      "http://huaban.com/boards/" +
      _board_id +
      "/?max=" +
      _maxid +
      "&limit=" +
      _limit +
      "&wfl=1";
    getSomeAddr(_url);
  }
=======
  // 根据_allComplete 判断是否要循环
>>>>>>> parent of c0a598c... 1
}
// 下载一批图片
function downLoadSome(__url) {
  //获取花瓣的网页代码
  request(__url, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      var regExp = /"pin_id":(.*?),.+?"file_id":(.*?),.+?"file":\{.+?"key":(.*?),.+?"type":"image\/(.*?)"/g; //未使用g选项
      // 循环匹配出文字内容
      while ((res = regExp.exec(body))) {
<<<<<<< HEAD
        if (res[1] == _updateId) {
          console.log("====================================");
          console.log("已经到更新的id了");
          console.log(res[1]);
          console.log(_updateId);
          console.log("====================================");
          _allComplete = true;
          // 匹配到和update.txt里的id相同的id号，说明已经读取完更新的图片了
          break;
        }
        if (_allComplete == true) {
          return;
        }
        var temparray = [];
        temparray.push(res[1], res[3].slice(1, -1), res[4]);
        _allGroups.push(temparray);
        console.log("数据是+++" + temparray);
        console.log("测试是否出现");
      }
      if (_maxid == _allGroups[_allGroups.length - 1][0]) {
        console.log("到头了，结束");
        _allComplete = true;
        // return;
=======
        console.log(res.length);
        var temparray = [];
        temparray.push(res[1], res[3].slice(1, -1), res[4]);
        _allGroups.push(temparray);
>>>>>>> parent of c0a598c... 1
      }
      // _maxid设置为最后一个获取的图片id，就可以往下继续刷新页面
      _maxid = _allGroups[_allGroups.length - 1];
      _allImagesCount = _allGroups.length;
<<<<<<< HEAD
      console.log("翻页的id是：" + _maxid);
      console.log("翻页的图片是：" + _allGroups[_allGroups.length - 1][1]);
      console.log("链接是：" + _url);
      console.log(_allGroups);
      // 循环检测所有链接
      loopGetAllImages();
=======
      console.log(_maxid);
      console.log(_allGroups);
>>>>>>> parent of c0a598c... 1
      // downall(_allGroups);
    }
  });
}
// 主入口函数
function main() {
  _updateId = "";
  _allComplete = false;
  _checkNewId = "";
  _allcount = 0;
  _allImagesCount = 0;
  //创建画板id的目录
  _board_id_path = GPATH + "/" + _board_id;
  // 检查翻页的id
  var _maxid = "";
  // 每次打开的图片
  var _limit = 20;
  _url =
    "http://huaban.com/boards/" +
    _board_id +
    "/?max=" +
    _maxid +
    "&limit=" +
    _limit +
    "&wfl=1";

  checkAndMakePath(_board_id_path);
  //获取花瓣的网页代码
  request(_url, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      var regExp = /"pin_id":(.*?),.+?"file_id":(.*?),.+?"file":\{.+?"key":(.*?),.+?"type":"image\/(.*?)"/g;
      res = regExp.exec(body);
      // console.log(res[1]);
      _checkNewId = res[1];
      // 检测是否有更新
      checkUpdateId(_checkNewId);
    }
  });

  // //获取花瓣的网页代码
  // request(_url, function(err, res, body) {
  //   if (!err && res.statusCode === 200) {
  //     var regExp = /"pin_id":(.*?),.+?"file_id":(.*?),.+?"file":\{.+?"key":(.*?),.+?"type":"image\/(.*?)"/g; //未使用g选项
  //     // 循环匹配出文字内容
  //     while ((res = regExp.exec(body))) {
  //       var temparray = [];
  //       temparray.push(res[1], res[3].slice(1, -1), res[4]);
  //       _allGroups.push(temparray);
  //     }
  //     _allImagesCount = _allGroups.length;

  //     // console.log(_allGroups);
  //     // imgList = [];
  //     // JSON.parse($('script[id="initData"]').html()).list.forEach(function(item) {
  //     //   imgList.push(item.img);
  //     // });
  //     // console.log(imgList);
  //     // 开始下载所有图片
  //     // downall(imgList);
  //     // var tempAllImg = [];
  //     // _allGroups.map(function(item) {
  //     //   tempAllImg.push(item[1] + "." + item[2]);
  //     //   console.log(item[1] + "." + item[2]);
  //     // });

  //     // _allGroups   [[pin_id,图片地址,文件格式]]
  //     downall(_allGroups);
  //   }
  // });

  //
}
main();
