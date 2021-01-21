//全局环境配置
let url_config = ""

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    url_config = 'https://test.soeasy666.com'
}else{
    // 生产环境
    url_config = 'https://test.soeasy666.com'
}

export default url_config