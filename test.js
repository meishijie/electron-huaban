const axios = require('axios');
var arr = ['https://github.com/1', 'https://github.com/2', 'https://github.com/3', 'https://github.com/', 'https://github.com/']


async function get(item) {
    return new Promise((resolve, reject) => {
        axios.get(item)
            .then(function (response) {
                console.log(item)
                resolve()
            })
            .catch(function (error) {
                console.log(error)
                reject()
            });
    });
}

let proarr = []
arr.map(item => {
    proarr.push(get(item))
})


Promise.all([proarr])
console.log('一批完成')

// (async () => {
//     for (let i = 0; i < arr.length; i++) {
//         const element = arr[i];
//         await get(element)
//     }
// })();