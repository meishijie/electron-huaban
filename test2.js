const axios = require("axios");
var arr = [
    "https://github.com/1",
    "https://github.com/2",
    "https://github.com/3",
    "https://github.com/",
    "https://github.com/"
];

async function get(item) {
    return new Promise((resolve, reject) => {
        axios
            .get(item)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                console.log(error);
                reject();
            });
    });
}

// const fetch = require("node-fetch");
// async function getTitle(url) {
//     let response = await fetch(url);
//     let html = await response.text();
//     return html;
// }

// let vv;

// async function go(e) {
//     vv = await getTitle(e);
//     console.log(vv);
// }
// go("http://www.baidu.com/");

// const EventEmitter = require("events");

// const myEmitter = new EventEmitter();
// myEmitter.on('event', (a, b) => {
//     setImmediate(() => {
//         console.log(a, b);
//     });
// });
// myEmitter.emit('event', 'a', 'b');

var a = [1, 2, 3]
a[0] = 2
var c = [...a]
c[0] = 4
console.log(a)
let p = get("http://www.baidu.com")
p.then((res) => {
    console.log('====================================');
    console.log(res.data);
    console.log('====================================');
})