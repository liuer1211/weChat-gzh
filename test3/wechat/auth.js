// 验证服务器有效性模块
// 引入sha1
const sha1 = require('sha1');
// 引入模块
const config = require('../config');
module.exports = () => {
    // 中间件函数
    return (req, res, next) => {
        // 微信服务器提交的参数
        // 解构赋值
        const {signature, echostr, timestamp, nonce} = req.query
        const {token} = config
        // 1.三个参数字典排序组合一起，形成一个数组 可以省略
        const arr = [timestamp, nonce, token]
        const arrSort = arr.sort()
        // 2.将数组拼接成字符串，进行sha1加密
        const str = arr.join('');
        const sha1Str = sha1(str);
        // 3.加密生成一个signatrue,和微信的比较
        if (sha1Str === signature) {
            res.send(echostr);
        } else {
            res.end('error')
        }
    }
}
