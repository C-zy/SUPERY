//uni.request封装
// import urlConfig from './config.js'
// import getdata from './tenant.js'

const request = {}
const headers = {}
const PORT1 = '/baseinfo'
   
   var _this = this
let responseType ='json'
request.globalRequest = (url, method, data, power) => {
/*     权限判断 因为有的接口请求头可能需要添加的参数不一样，所以这里做了区分
    1 == 不通过access_token校验的接口
    2 == 文件下载接口列表
    3 == 验证码登录 */
        
    switch (power){
        case 1:
            headers['Authorization'] = 'Basic '
            break;
        case 2:
            headers['content-type'] = 'json'
            break;
        case 3:
            responseType = 'arraybuffer'
            break;
        default:
            headers['Authorization'] = `Bearer ${
                this.$store.getters.userInfo
            }`
            headers['TENANT-ID'] = this.$store.getters.userInfo.tenant_id
            break;
    }
    return uni.request({ 
        url: url,
        method,
        data: data,
				header:headers,
        dataType: 'json'
    }).then(res => {
		return res[1]
    }).catch(parmas => {
　　　　　　switch (parmas.code) {
　　　　　　　　case 401:
　　　　　　　　　　uni.clearStorageSync()
　　　　　　　　　　break
　　　　　　　　default:
　　　　　　　　　　uni.showToast({
　　　　　　　　　　　　title: parmas.message,
　　　　　　　　　　　　icon: 'none'
　　　　　　　　　　})
　　　　　　　　　　return Promise.reject()
　　　　　　　　　　break
　　　　　　}

　　})
 }
 export default request