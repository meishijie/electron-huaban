var request = require("request");

async function go(__item) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // __cb(__item);
            request(__item,{},function (error, response, body) {
                if (!error & response.statusCode == 200) {
                    resolve()
                    console.log(__item+'下载完成') // 请求成功的处理逻辑
                }else{
                    console.log(error);
                    
                }
            })                    
            
        }, 3000); 
     });
}

// 批量执行数组
async function batchArr(__arr,__sp){
    if(__arr == undefined || __arr.length == 0 || __sp == undefined) return;
    for(var j = 0;j<Math.ceil(__arr.length/__sp);j++){
        let temparr= [];
        for(var i=__sp*j;i<__sp*j+__sp;i++){
            if(__arr[i]==undefined) return
            temparr.push(go(__arr[i]))
        }
        await Promise.all(temparr)
        // console.log('一批完成');
    }
    // await Promise.all([go(3000), go(1000), go(2000)])
    // 依次打印：wait 1000ms wait 2000ms wait 3000ms
}
/**
 * arr = ['http://www.baidu.com','http://www.baidu.com','http://www.baidu.com','http://www.baidu.com','http://www.baidu.com','http://www.baidu.com','http://www.baidu.com',]
 *  sp = 4
 * batchArr(arr,sp)
 */


