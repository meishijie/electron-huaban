var async = require("async");
var request = require("request");
var fs = require("fs");
/*
同步的方法读取一个链接
*/

i_headers = {
    "User-Agent": "Mozilla/5.0 (WINdows NT 6.1; rv:2.0.1)Gecko/20100101 Firefox/4.0.1",
    // Connection: "keep-alive",
    Host: "huaban.com",
    Accept: "application/json",
    timeout: 7500
};
async function getHtml(__src) {
    return new Promise((resolve, reject) => {
        const req = request.get(__src, i_headers, (err, res, body) => {
            try {
                if (!err && res.statusCode === 200) {
                    resolve(body);
                    // reject(res.statusCode);
                }
            } catch (err) {
                reject(err);
            }
        });
    });
}

async function myget(__src) {
    try {
        let re = await getHtml(__src);
        return re;
        console.log(re);
    } catch (error) {
        console.log(error);
    }
}

const iconv = require("iconv-lite");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const wait = (ms, url, cb) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`wait ${ms}ms  ${url}`);
            cb(url + "结束");
            resolve();
        }, ms);
    });
// var cmdStr = "D:\\下载\\aria2\\aria2c -o j.jpg -d downloads https://hbimg.b0.upaiyun.com/5a776d6452c68cbb2b0add52d2006e358712f208a5451-M4ZlHg_fw658 ";

async function cmdrun(__url, cb) {
    return new Promise((resolve, reject) => {
        exec(__url, {
            encoding: "buffer"
        }, function (err, stdout, stderr) {
            if (err) {
                console.log("stderr:", iconv.decode(stderr, "cp936"));
                reject();
            } else {
                // clearTimeout(tt);
                // console.log(__url+'下载完毕');
                cb(__url);
                resolve();
                // console.log(stdout);
            }
        });
    });
}

async function mydown(__url, cb) {
    await cmdrun(__url, cb);
}


const Aria2 = require("aria2");
/**
 * 使用aria2下载图片
 * @param {*} __arr 图片数组地址
 * @param {*} __sp 每批次同时下载数量
 * @param {*} __fold 下载到哪个文件夹
 * @param {*} __callback 下载完回调
 */
let options = {
    host: 'localhost',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc'
}

const aria2 = new Aria2([options]);
var temparr = [];
var a = 0;
var _callback;
aria2.open()
        .then(() => console.log("open"))
        .catch(err => console.log("error", err));
aria2.on("onDownloadComplete", (params) => {
    a ++;
    console.log('a:', a)
    _callback()
    if (a == temparr.length){
        console.log('结束');
        // aria2.close();
        return
    }
})
async function aria2All(__arr, __sp, __fold, __callback) {
    temparr = [];
    a = 0;
    _callback = __callback
    
    if (__arr == undefined || __arr.length == 0 || __sp == undefined) return;
    
    for (var j = 0; j < Math.ceil(__arr.length / __sp); j++) {
        // temparr = [];
        for (var i = __sp * j; i < __sp * j + __sp; i++) {
            console.log('ok');

            if (__arr[i] != undefined) {                
                temparr.push(["addUri", ["http://img.hb.aicdn.com/" + __arr[i][1]],
                    {
                        dir: __fold,
                        out: __arr[i][1] + "." + __arr[i][2]
                    }
                ]);
            }            
        }
    }
    
    const results = await aria2.multicall(temparr);
    console.log(results)
}

// aria2.on("onDownloadComplete", (params) => {
//     a ++;
//     console.log('a:', a)
//     __callback(aria2)
//     if (a == temparr.length){
//         console.log('结束');
//         return
//     }
// })

async function gogo(__arr) {
    new Promise((resolve, reject) => {

    });

}


/**
 * 数组分批次下载
 * todo: 可能存在传输数据超时的问题
 */
var request = require("request");

async function go(__item, __dest, __fold, __callback) {
    return new Promise((resolve, reject) => {
        let req;
        try {
            let tempuri = "http://img.hb.aicdn.com/" + __item;
            let tempdest = __fold + "/" + __item + "." + __dest;
            let writeStream = fs.createWriteStream(tempdest, {
                autoClose: true
            });

            // request(tempuri,i_headers,function (error, response, body) {
            //     if (!error & response.statusCode == 200) {
            //         console.log(__item+'下载完成，开始保存到硬盘！') // 请求成功的处理逻辑
            //     }else{
            //         reject();
            //         console.log(error);
            //     }
            // }).pipe(writeStream)

            req = request(tempuri, i_headers, function (error, response, body) {
                if (!error) {
                    if (response.statusCode) {
                        if (response.statusCode == 200) {
                            clearTimeout(t);
                            console.log(__item + "下载完成，开始保存到硬盘！"); // 请求成功的处理逻辑
                        }
                    } else {
                        req.abort();
                        req.destroy();
                        clearTimeout(t);
                        resolve();
                        __callback('error');
                        //reject 会引起整体过程不前进
                        //   reject();
                        console.log(__item + "下载出错！"); // 请求成功的处理逻辑
                    }

                } else {
                    req.abort();
                    req.destroy();
                    clearTimeout(t);
                    resolve();
                    __callback('error');
                    //reject 会引起整体过程不前进
                    //   reject();
                    console.log(error);
                }
            });

            req.on("end", function (response) {
                req.abort();
                req.destroy();
                clearTimeout(t);
                console.log("读取图片成功");
                writeStream.end();
            });
            req.on("error", function (error) {
                req.abort();
                req.destroy();
                clearTimeout(t);
                console.log(error);
                //reject 会引起整体过程不前进
                resolve();
                __callback('error');
                writeStream.end();
            });
            req.pipe(writeStream);
            writeStream.on("finish", function () {
                req.abort();
                req.destroy();
                clearTimeout(t);
                __callback(__item);
                resolve();
                console.log(__item + "文件写入成功");
            });
        } catch (error) {
            console.log(error);
            req.abort();
            req.destroy();
            clearTimeout(t);
            resolve();
            //reject 会引起整体过程不前进
            // reject(error);
        }
        let t = setTimeout(() => {
            console.log("超时错误" + __item);
            req.abort();
            req.destroy();
            clearTimeout(t);
            resolve("超时");
            __callback('error');
            //reject 会引起整体过程不前进
            // reject('超时');
        }, 20000);
    });
}

// 批量执行数组
/**
 * @param {[item1,item2],[item1,item2]} __arr  2 维数组
 * @param {Number} __sp 每份分割数
 */
async function batchArr(__arr, __sp, __fold, __callback) {
    console.log(__arr, __sp);
    if (__arr == undefined || __arr.length == 0 || __sp == undefined) return;
    for (var j = 0; j < Math.ceil(__arr.length / __sp); j++) {
        let temparr = [];
        for (var i = __sp * j; i < __sp * j + __sp; i++) {
            if (__arr[i] == undefined) return;
            // __arr[i][0] 图片地址   __arr[i][1]硬盘存放地址
            console.log(__arr[i][1], __arr[i][2], __fold);
            temparr.push(go(__arr[i][1], __arr[i][2], __fold, __callback));
        }
        await Promise.all(temparr);
        console.log("一批完成");
    }
}

module.exports.aria2All = aria2All;
module.exports.batchArr = batchArr;
module.exports.mydown = cmdrun;
module.exports.myget = myget;