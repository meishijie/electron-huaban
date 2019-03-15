function* countAppleSales () {
  var saleList = [3, 7, 5];
  for (var i = 0; i < saleList.length; i++) {
    yield saleList[i];
  }
}


//异步方法同步写法
function re(_url) {
    return new Promise((resolve, reject) => {
       setTimeout(() => {
           reject(_url)
       }, 3000); 
    });
}

async function go(_url) {
    try {
        let p = await re(_url)
        console.log(p)
    } catch (e) {
        console.log('错误'+e)
    }
    // re.then(
    //     (e)=>{
    //         console.log(e)
    //     }
    // )
}

go('1')