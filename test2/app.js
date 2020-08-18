// 引入express模块
const express = require('express');
// 引入auth模块
const auth = require('./wechat/auth')
// 创建APP应用
const app = express();

// 验证服务起的有效性
app.use(auth())

//监听端口号
app.listen(3000, () => console.log('服务器3000启动成功！'))
