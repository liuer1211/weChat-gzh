/*
// 获取acessToken
   特点：  1.唯一性
           2.有效性2小时
           3.接口权限 2000次
    https请求方式: GET
    https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    正常返回：{ access_token:
                '36_A7Z1pTvT6Nq8WT_XmMWyRnWghGxCdbLlYFBOnih30tDP2nuwYhWiolxrNvPoJrwt0NvyjB9YrIRBTVir5EVBLd3-umPerGUrTWeXlJ2C3BXJwLQd2_k4ztAbZFlN1u1LyKmSCuEHsnor3lNqPZAgAIAJTU',
                expires_in: 7200 }
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
// const {appID,appsecret} = require('../config')
const config = {
    token: 'liuer1211',
    appID: 'wx872e59781193d94e',
    appsecret: '4f48edb38a63b5283bbf158e58defe9b'
}
// 引入fs模块
const {writeFile, readFile} = require('fs')


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
        // 定义请求地址
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appID}&secret=${config.appsecret}`
        // 发请求
        /*
        * request 库
        * request-promise-native 库,返回值promise对象
        * */
        return new Promise((resolve, reject) => {
            rp({method: 'GET', url,json: true})
                .then(res => {
                    console.log(res)
                    /*{ access_token:
                    '36_A7Z1pTvT6Nq8WT_XmMWyRnWghGxCdbLlYFBOnih30tDP2nuwYhWiolxrNvPoJrwt0NvyjB9YrIRBTVir5EVBLd3-umPerGUrTWeXlJ2C3BXJwLQd2_k4ztAbZFlN1u1LyKmSCuEHsnor3lNqPZAgAIAJTU',
                    expires_in: 7200 }
                    */
                    // 设置access_token的过期问题
                    res.expires_in = Date.now() + (res.expires_in - 300) * 1000
                    // 这里return 是 .then的返回；想要变成getAccessToken方法的返回，new一个promise
                    // 将promise对象改成成功的状态
                    resolve(res)
                })
                .catch(err => {
                    console.log(err)
                    // 失败
                    reject('getAccessToken方法异常',err)
                })
        })
    }
    /**
     *  用来保存access_token
     * */
    saveAccessToken(accessToken) {
        // 将对象转换成json字符串
        accessToken = Json.stringify(accessToken)
        // 将assecc_token保存一个文件// 不能直接保存[object,object]，要转换json
        return new Promise((resolve, reject) => {
            writeFile('./accessToken.tst',accessToken, err =>{
                if(!err) {
                    console.log('文件保存成功')
                    resolve();
                }else {
                    reject('saveAccessToken方法出了问题，' + err)
                }
            })
        })

    }
    /**
     *  用来读取access_token
     * */
    readAccessToken() {
        // 将assecc_token保存一个文件// 不能直接读取字符串，要转换成json对象
        return new Promise((resolve, reject) => {
            writeFile('./accessToken.tst', (err,data) =>{
                if(!err) {
                    console.log('文件保存成功')
                    // 转换成json对象
                    data = JSON.parse(data);
                    resolve(data);
                }else {
                    reject('saveAccessToken方法出了问题，' + err)
                }
            })
        })

    }
    /**
     * 判断access_token是否有效
     * */
    isValidAccessToken(data) {
        // 检测数据是否有效
        if (!data && !data.access_token && !data.expires_in){
            // 代表access_token过期
           return false;
        }
        // 检测是否过期
        // if (data.expires_in<Date.now()){
        //     // 过期了
        //     return false;
        // }else {
        //     // 没有过期
        //     return true;
        // }
        return data.expires_in > Date.now(); // 简写
    }
    /**
     * 用来获取一个没有过期的access_token
     * @return {Promise<any>} access_token
     * */
    fetchAccessToken() {
        if (this.assecc_token && this.expires_in && this.isValidAccessToken(this)){
            // 说明保存过的access_token是有效的，直接使用
            return Promise.resolve({
                access_token: this.assecc_token,
                expires_in: this.expires_in
            })
        }
        // 是fetchAccessToken最终的返回值
        return this.readAccessToken()
            .then(async res=>{
                // 本地有文件
                // 判断是否过期
                if(this.isValidAccessToken(res)){
                    // 有效的
                    // resolve(res)
                    return Promise.resolve(res)
                } else {
                    // 过期了
                    // 发请求获取assecc_token
                    const res= await this.getAccessToken()
                    // 保存下来（本地文件）
                    await this.saveAccessToken(res)
                    // 将请求回来的access_token返回出去
                    // resolve(res)
                    return Promise.resolve(res)
                }
            })
            .catch(async err=>{
                // 本地没有文件
                // 发请求获取assecc_token
                const res= await this.getAccessToken()
                // 保存下来（本地文件）
                await this.saveAccessToken(res)
                // 将请求回来的access_token返回出去
                // resolve(res)
                return Promise.resolve(res)
            })
            .then(res=>{
                // 只考虑称
                // 将access_token挂在到this上
                this.assecc_token= res.access_token;
                this.expires_in= res.expires_in
                // 返回res包装了一层promise对象（此对象为成功状态）
                // 是readAccessToken最终的返回值
                return Promise.resolve(res)
            })
    }
}


// 模拟
const w = new WeChat();


