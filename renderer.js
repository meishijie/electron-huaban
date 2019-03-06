var fs = require("fs-extra");
// var request = require("superagent");
// 检查是否有更新的id，就是画板的第一张图片id
var _checkNewId = "";
var _allGroups = [];
var request = require("request");
var cheerio = require("cheerio");
var Bagpipe = require("bagpipe");

//画板的id
var _board_id = "";
// 检查翻页的id
var _maxid = "";
// 每次请求打开的图片
var _limit = 100;
// 同时下载的数量
var _downLoadMutiCout = 30;
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
// 硬盘路径 可以设置  /Users/meishijie/Documents/GitHub/electron-huaban  E:/图片搜藏/huaban
// var GPATH = "/Users/meishijie/Documents/GitHub/electron-huaban/huaban";
var GPATH = "";
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
  i_headers = {
    "User-Agent":
      "Mozilla/5.0 (WINdows NT 6.1; rv:2.0.1)Gecko/20100101 Firefox/4.0.1",
    Connection: "keep-alive",
    Host: "huaban.com",
    Accept: "application/json",
    timeout: "7500"
  };
  const req = request.get(__src, i_headers);
  req
    .pipe(
      fs.createWriteStream(__dest).on("error", error => {
        console.log("写入文件错误： ", error.message);
      })
    )
    .on("close", function() {
      _allcount++;
      document.getElementById("selectedItem").innerHTML += `${__src}下载完成！`;
      let tempdiv = document.getElementById("jindu");
      tempdiv.innerHTML = `${_allcount}/${_allImagesCount}`;
      tempdiv.style.width = (_allcount / _allImagesCount) * 100 + "%";
      // 下载完成显示
      if (_allImagesCount - _allcount == 0) {
        tempdiv.style.width = (_allcount / _allImagesCount) * 100 + "%";
        selectDirBtn.disabled = false;
        begin.disabled = false;
        $("#loading").css("visibility", "hidden");
        $("#ale").html("<strong>下载完成 ！！！</strong>");
        $("#ale").css("visibility", "visible"); //元素显示
      }
    });
};

function checkAndMakePath(__path) {
  fs.exists(__path, function(exists) {
    if (exists == true) {
      // console.log("不用创建");
    } else {
      fs.mkdirSync(__path);
      // console.log("创建成功");
    }
  });
}

//
// 下载所有图片
//
function downall(__imgList) {
  // imgList =  [[pin_id,图片地址,文件格式]]
  var bagpipe = new Bagpipe(_downLoadMutiCout, { timeout: 7500 });
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
        document.getElementById("selectedItem").innerHTML =
          "没有需要更新的内容！";
        $("#loading").css("visibility", "hidden");
        selectDirBtn.disabled = false;
        begin.disabled = false;
        return;
      } else {
        // 有更新内容 需要限制更新的maxid
        // 需要限制读取的图片到 update.txt记录的id号
        console.log(
          `有最新加入的图片，需要更新.目标id为：${_updateId}，最新id为：${__checkNewId}`
        );
        document.getElementById(
          "selectedItem"
        ).innerHTML = `有最新加入的图片，需要更新.目标id为：${_updateId}，最新id为：${__checkNewId}`;
        loopGetAllImages();
        fs.writeFileSync(_board_id_path + "/update.txt", __checkNewId);
      }
      // var bytesRead = fs.readFileSync(_board_id_path + "/update.txt");
      // console.log(bytesRead);
    } else {
      // console.log("创建文件");
      fs.writeFileSync(_board_id_path + "/update.txt", __checkNewId);
      // console.log("创建id完成");
      // 先获取所有图片 定时器模式
      loopGetAllImages();
    }
  });
}
//循环获取所有图片到 _allGroups
function loopGetAllImages() {
  console.log(_allComplete);
  if (_allComplete != false) {
    document.getElementById("selectedItem").innerHTML =
      "读取图片完成！开始下载！";
    $("#begin").html(`开始下载`);
    // 下载图片开始
    if (_allGroups.length > 0) {
      downall(_allGroups);
    } else {
      selectDirBtn.disabled = false;
      begin.disabled = false;
      return;
    }
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
}
// 下载一批图片
function getSomeAddr(__url) {
  i_headers = {
    "User-Agent":
      "Mozilla/5.0 (WINdows NT 6.1; rv:2.0.1)Gecko/20100101 Firefox/4.0.1",
    Connection: "keep-alive",
    Host: "huaban.com",
    Accept: "application/json"
  };
  //获取花瓣的网页代码
  request(__url, i_headers, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      var regExp = /"pin_id":(.*?),.+?"file_id":(.*?),.+?"file":\{.+?"key":(.*?),.+?"type":"image\/(.*?)"/g; //未使用g选项
      // 循环匹配出文字内容
      console.log(body);
      while ((res = regExp.exec(body))) {
        console.log(res);
        // console.log(_updateId);
        if (_updateId != "" && res[1] == _updateId) {
          _allComplete = true;
          // 匹配到和update.txt里的id相同的id号，说明已经读取完更新的图片了
          break;
        }
        var temparray = [];
        temparray.push(res[1], res[3].slice(1, -1), res[4]);
        _allGroups.push(temparray);

        /**
         * TODO: 这里可以设置显示读取的图片数量
         *
         */

        $("#begin").html(`读取图片：(${_allGroups.length})`);
        document.getElementById("selectedItem").innerHTML = `"读取了：${
          _allGroups.length
        }张图片"`;
        // console.log("数据是+++" + temparray);
        // console.log("测试是否出现");
      }
      console.log(_allGroups.length);
      if (_allGroups.length > 0) {
        if (_maxid == _allGroups[_allGroups.length - 1][0]) {
          console.log("到头了，结束");
          _allComplete = true;
        }
        // _maxid设置为最后一个获取的图片id，就可以往下继续刷新页面
        _maxid = _allGroups[_allGroups.length - 1][0];
      } else {
        $("#loading").css("visibility", "hidden");
        $("#ale").html(`<strong>出现错误，删除${_board_id}后重试 ！！！</strong>`);
        $("#ale").css("visibility", "visible"); //元素显示
        selectDirBtn.disabled = false;
        begin.disabled = false;
        return;
        // _allComplete = true;
      }
      _allImagesCount = _allGroups.length;
      loopGetAllImages();
      // var mytimeout = setTimeout(() => {
      //   clearTimeout(mytimeout);
      //   loopGetAllImages();
      // }, 3000);
    }
  });
}
// 主入口函数
function main() {
  _allGroups = [];
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
  // var _limit = 100;
  _url =
    "http://huaban.com/boards/" +
    _board_id +
    "/?max=" +
    _maxid +
    "&limit=" +
    _limit +
    "&wfl=1";

  checkAndMakePath(_board_id_path);
  i_headers = {
    "User-Agent":
      "Mozilla/5.0 (WINdows NT 6.1; rv:2.0.1)Gecko/20100101 Firefox/4.0.1",
    Connection: "keep-alive",
    Host: "huaban.com",
    Accept: "application/json"
  };
  //获取花瓣的网页代码
  request(_url, i_headers, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      var regExp = /"pin_id":(.*?),.+?"file_id":(.*?),.+?"file":\{.+?"key":(.*?),.+?"type":"image\/(.*?)"/g;
      res = regExp.exec(body);
      // console.log(res);
      _checkNewId = res[1];
      // 检测是否有更新

      var mytimeout = setTimeout(() => {
        clearTimeout(mytimeout);
        checkUpdateId(_checkNewId);
      }, 1000);
    }
  });
}

const ipc = require("electron").ipcRenderer;
const selectDirBtn = document.getElementById("select-directory");
const begin = document.getElementById("begin");
const huabanID = document.getElementById("huabanID");

$("#loading").css("visibility", "hidden");

selectDirBtn.addEventListener("click", function(event) {
  ipc.send("open-directory-dialog");
});
begin.addEventListener("click", function(event) {
  _board_id = document.getElementById("huabanID").value;
  if (GPATH != "" && _board_id != "") {
    selectDirBtn.disabled = true;
    begin.disabled = true;
    // console.log($('#ale'));
    $("#loading").css("visibility", "visible");
    $("#ale").css("visibility", "hidden"); //元素隐藏
    // document.getElementById("ale").style.visibility="hidden";
    main();
  } else {
    $("#loading").css("visibility", "hidden");
    $("#ale").html("<strong>先选择目录和画板ID！！！</strong>");
    $("#ale").css("visibility", "visible"); //元素显示
    // document.getElementById("ale").style.visibility="visible";
  }
});
ipc.on("selectedItem", function(event, path) {
  GPATH = path[0];
  console.log(GPATH);
  // selectDirBtn.disabled = true;
  $("#GPATH").html(`${GPATH}`);
  // document.getElementById("GPATH").innerHTML = `${GPATH}`;
});
