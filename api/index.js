// 接口配置
import request from '@/common/request.js'
// import { formatGetUri } from '@/common/util.js'

const api = {}
const PORT1 = 'https://api.bgm.tv'
//${PORT1}----请求头部公共地址
//${formatGetUri(params)}-----请求参数，GET请求时使用，会自动转换格式

//使用方式：
// let params={
// 	host:'www.baidu.com'
// }
// this.$api.txt(params).then(res => {
//    // 获得数据 
//    console.log(res,'成功') 
// })


// POST请求方式模板
api.register = params => request.globalRequest(`${PORT1}/mobile/signUp`, 'POST', params, 1)
// GET请求方式模板
api.register = params => request.globalRequest(`${PORT1}/mobile/signUp${formatGetUri(params)}`, 'GET',{}, 1)
// 测试
api.txt = params => request.globalRequest(`${PORT1}/components/schemas/SubjectBase`, 'POST', params, 1)
// 每日放送
api.getCalendar = params => request.globalRequest(`${PORT1}/calendar`, 'GET',{}, 1)
//获取详情数据
api.getsSubject = params => request.globalRequest(`${PORT1}//subject/${params}/ep`, 'GET',{}, 1)

export default api
