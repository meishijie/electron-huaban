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

module.exports.myget = myget;
// get("https://www.baidu.com/").then((body)=>{
//     console.log(body)
// })
