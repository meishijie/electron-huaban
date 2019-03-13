var async = require('async');
var request = require("request");

/*
同步的方法读取一个链接
*/

i_headers = {
    "User-Agent":
      "Mozilla/5.0 (WINdows NT 6.1; rv:2.0.1)Gecko/20100101 Firefox/4.0.1",
    // Connection: "keep-alive",
    Host: "huaban.com",
    Accept: "application/json",
    timeout: 10000
  };
async function getHtml(__src){
    return new Promise((resolve, reject) => {
        const req = request.get(__src,i_headers,(err, res, body)=>{
            try {
                if (!err && res.statusCode === 200) {
                    resolve(body)
                    // reject(res.statusCode);
                }
           }catch(err){
                reject(err);
           } 
            
        });
        
    });
}

async function myget(__src){
    try {
        let re = await getHtml(__src)
        return re
        console.log(re)
    } catch (error) {
        console.log(error)
    }
}



var exec = require('child_process').exec;
const iconv = require('iconv-lite');
// var cmdStr = "D:\\下载\\aria2\\aria2c -o j.jpg -d downloads https://hbimg.b0.upaiyun.com/5a776d6452c68cbb2b0add52d2006e358712f208a5451-M4ZlHg_fw658 "; 

async function cmdrun(__url,cb) {
    return new Promise((resolve, reject) => {
        // var tt = setTimeout(() => {
        //     exec("exit");
        //     console.log('5秒了');
        //     reject();
        // }, 5000);
        exec(__url,  { encoding: 'buffer' },function(err,stdout,stderr){
            if(err) {
                console.log('stderr:', iconv.decode(stderr, 'cp936'));
                reject();
            } else {
                // clearTimeout(tt);
                cb();
                resolve();
                // console.log(stdout);
            }
        });
        
    });
}

async function mydown(__url,cb) {
    await cmdrun(__url,cb)
}

module.exports.mydown = mydown;
module.exports.myget = myget;
// get("https://www.baidu.com/").then((body)=>{
//     console.log(body)
// })
