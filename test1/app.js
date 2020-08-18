// 引入express模块
const express = require('express');
// 引入sha1
const sha1 = require('sha1');
// 创建APP应用
const app = express();

//定义配置对象
const config = {
    token: 'liuer1211',
    appID: 'wx872e59781193d94e',
    appsecret: '4f48edb38a63b5283bbf158e58defe9b'
}


// 验证服务起的有效性
app.use((req, res, next) => {
    // 微信服务器提交的参数
    // console.log('req-',req.query)
    // { signature: 'a0e85466c12fbf113bb4bdc7c0c58d9054bdd8f3', // 微信加密签名
    //     echostr: '3752465980370714615', // 微信随机字符串
    //     timestamp: '1597672727', // 微信发送的请求时间戳
    //     nonce: '882988362' } // 微信的随机字符串
    // console.log('----------00------------')
    // // 解构赋值
    const {signature, echostr, timestamp, nonce} = req.query
    const {token} = config
    // console.log(signature)
    // // 1.三个参数字典排序组合一起，形成一个数组 可以省略
    const arr = [timestamp, nonce, token]
    const arrSort = arr.sort()
    console.log(arrSort)
    // 2.将数组拼接成字符串，进行sha1加密
    const str = arr.join('');
    console.log(str)
    const sha1Str = sha1(str);
    console.log(sha1Str)
    console.log(signature)
    // 3.加密生成一个signatrue,和微信的比较
    if (sha1Str === signature) {
        res.send(echostr);
    } else {
        res.end('error')
    }


})

//监听端口号
app.listen(3000, () => console.log('服务器3000启动成功！'))