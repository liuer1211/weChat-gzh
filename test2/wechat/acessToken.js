/*
// 获取acessToken
   特点：  1.唯一性
           2.有效性2小时
           3.接口权限 2000次
    https请求方式: GET
    https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    正常返回：{"access_token":"ACCESS_TOKEN","expires_in":7200}
    失败：{ errcode: 40013,errmsg: 'invalid appid rid: 5f3be1bf-3506e52e-4207c7e6' }
    错误时微信会返回错误码等信息，JSON数据包示例如下（该示例为AppID无效错误）:

    思路：
        读取本地（readAccessToken）
          - 本地有文件
            - 判断是否过期(isValidAccessToken)
                 - 过期了
                    - 重新获取access_token(getAccessToken)，保存覆盖之前的文件（保证文件唯一性）(saveAccessToken)
                 - 没有过期
                    - 直接使用
          - 本地没有文件
             - 发送access_token(getAccessToken),保存下来（本地文件），直接使用(saveAccessToken)

*/
// 引入模块
const {appID,appsecret} = require('../config')
// 只需要引入request-promise-native
const rp = require('request-promise-native')

// 定义类，用来获取access_token
class WeChat {
    constructor (){

    }
    /**
     *  用来获取access_token
     * */
    getAccessToken () {
        console.log(appID,appsecret)
        // 定义请求地址
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
        // 发请求
        /*
        * request 库
        * request-promise-native 库,返回值promise对象
        * */
        rp({method: 'GET', url,json: true})
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }
}


// 模拟
const w = new WeChat();
w.getAccessToken()
