// 接口配置
import request from '@/common/request.js'
// import { formatGetUri } from '@/common/util.js'

const api = {}
const PORT = 'https://supery.work/api/v1/'
const PORT1 = 'https://api.bgm.tv'
const PORT2 = 'https://api.moedog.org/pixiv/v2/' //图片接口Pixiv
const PORT3 = 'https://api.lolicon.app/setu/v2' //图片接口Pixiv
//接口文档： https://api.moedog.org/pixiv/v1.html
// 随机图文档：https://api.lolicon.app/#/setu
const PORT_Img = 'https://api.moedog.org/pixiv/interface/PixivProxy.php?url=' //图片解析

//使用方式：
// let params={
// 	host:'www.baidu.com'
// }
// this.$api.txt(params).then(res => {
//    // 获得数据 
//    console.log(res,'成功') 
// })


// POST请求方式模板
// api.register = params => request.globalRequest(`${PORT1}/mobile/signUp`, 'POST', params, 1)
// GET请求方式模板
// api.register = params => request.globalRequest(`${PORT1}/mobile/signUp${formatGetUri(params)}`, 'GET',{}, 1)
// 测试
api.txt = params => request.globalRequest(`http://192.168.1.82:3000/api/V1/demo`,'GET',params, 1)
// 登录
api.loginwx = params => request.globalRequest(`${PORT}/login`, 'POST', params, 1)
// 每日放送
api.getCalendar = params => request.globalRequest(`${PORT}calendar`, 'GET',{}, 1)
//获取详情数据
api.getDetail = params => request.globalRequest(`${PORT}calendarDetail?id=${params}`, 'GET',{}, 1)
//获取章节数据
api.getsSubject = params => request.globalRequest(`${PORT}calendarEp?id=${params}`, 'GET',{}, 1)
// 搜索番剧
api.searchLy = params => request.globalRequest(`${PORT}calendarSearch?val=${params}`, 'GET',{}, 1)
// Pixiv图片/解析
api.PixivImg = params => request.globalRequest(`${PORT_Img}${params}`, 'GET',{}, 3)
api.Pixiv1 = params => request.globalRequest(`${PORT}getPixiv1`,'GET',params, 1)
//Pixiv图片
api.Pixiv2 = params => request.globalRequest(`${PORT3}?r18=1&num=20`,'GET',{}, 2)
// 获取漫画列表
api.getCartoon = params => request.globalRequest(`${PORT}getCartoon`,'GET',params, 1)
// 获取漫画详情
api.getCartoonDetail = params => request.globalRequest(`${PORT}getFile`,'GET',params, 1)

export default api
