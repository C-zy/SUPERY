import request from '@/common/request.js'
import urlConfig from '@/common/config.js'

const api = {}
const API_HOST_V2 = urlConfig + '/api/v2'

/**
 * 微信授权登录接口
 * @param {Object} data - 请求参数
 * @param {string} data.code - 微信登录 code
 * @param {Object} [data.userInfo] - 用户信息对象
 * @param {string} [data.userInfo.nickName] - 用户昵称
 * @param {string} [data.userInfo.avatarUrl] - 头像URL
 * @param {number} [data.userInfo.gender] - 性别 0-未知 1-男 2-女
 * @param {string} [data.userInfo.country] - 国家
 * @param {string} [data.userInfo.province] - 省份
 * @param {string} [data.userInfo.city] - 城市
 * @returns {Promise} 返回登录结果，包含 token、expiresAt、isNewUser 和用户信息
 */
api.login = (data) => {
	return request.globalRequest(API_HOST_V2 + '/login', 'POST', data)
}

/**
 * 验证Token有效性接口
 * @returns {Promise} 返回验证结果，包含用户信息
 * @description Token通过请求头 Authorization: Bearer &lt;token&gt; 传递
 */
api.verifyToken = () => {
	return request.globalRequest(API_HOST_V2 + '/token/verify', 'POST')
}

/**
 * 刷新Token接口
 * @returns {Promise} 返回新的token和expiresAt，刷新后旧Token失效
 * @description Token通过请求头 Authorization: Bearer &lt;token&gt; 传递
 */
api.refreshToken = () => {
	return request.globalRequest(API_HOST_V2 + '/token/refresh', 'POST')
}

/**
 * 退出登录接口
 * @returns {Promise} 返回退出结果
 * @description Token通过请求头 Authorization: Bearer &lt;token&gt; 传递
 */
api.logout = () => {
	return request.globalRequest(API_HOST_V2 + '/logout', 'POST')
}

/**
 * 更新用户信息接口
 * @param {Object} data - 请求参数
 * @param {string} [data.nickname] - 新昵称
 * @param {string} [data.avatarUrl] - 新头像URL
 * @param {number} [data.gender] - 性别 0-未知 1-男 2-女
 * @param {string} [data.phone] - 手机号
 * @param {string} [data.country] - 国家
 * @param {string} [data.province] - 省份
 * @param {string} [data.city] - 城市
 * @returns {Promise} 返回更新结果
 * @description Token通过请求头 Authorization: Bearer &lt;token&gt; 传递
 */
api.updateUserInfo = (data) => {
	return request.globalRequest(API_HOST_V2 + '/user/info', 'PUT', data)
}

/**
 * 上传图片接口
 * @param {string} filePath - 图片文件路径
 * @param {Object} formData - 附加表单数据
 * @param {string} formData.image_type - 图片类型（必填），如avatar/product/banner/certificate等
 * @param {string} [formData.description] - 图片描述（可选）
 * @returns {Promise} 返回上传结果，包含图片信息
 * @description Token通过请求头 Authorization: Bearer &lt;token&gt; 传递
 */
api.uploadImage = (filePath, formData) => {
	return request.uploadFile(API_HOST_V2 + '/image/upload', filePath, 'image', formData)
}

/**
 * 获取图片列表接口
 * @param {Object} [data] - 请求参数
 * @param {string} [data.image_type] - 图片类型筛选（可选）
 * @param {number} [data.page] - 页码（可选），默认1
 * @param {number} [data.pageSize] - 每页数量（可选），默认20
 * @returns {Promise} 返回图片列表及分页信息
 * @description Token通过请求头 Authorization: Bearer &lt;token&gt; 传递
 */
api.getImageList = (data) => {
	return request.globalRequest(API_HOST_V2 + '/image/list', 'GET', data)
}

/**
 * 删除图片接口
 * @param {string|number} id - 图片 ID（路径参数）
 * @returns {Promise} 返回删除结果
 * @description Token通过请求头 Authorization: Bearer &lt;token&gt; 传递
 */
api.deleteImage = (id) => {
	return request.globalRequest(API_HOST_V2 + '/image/' + id, 'DELETE')
}

/**
 * 更新图片信息接口
 * @param {string|number} id - 图片ID（路径参数）
 * @param {Object} data - 请求参数
 * @param {string} [data.image_type] - 图片类型（可选）
 * @param {string} [data.description] - 图片描述（可选）
 * @returns {Promise} - 返回更新结果
 * @description Token通过请求头Authorization: Bearer <token>传递
 */
api.updateImageInfo = (id, data) => {
	return request.globalRequest(API_HOST_V2 + '/image/' + id, 'PUT', data)
}

/**
 * 保存AI图片接口
 * @param {Object} data - 请求参数
 * @param {string} data.image_url - 图片URL（必填）
 * @param {string} data.image_type - 图片类型（必填）
 * @param {string} [data.description] - 图片描述（可选）
 * @returns {Promise} - 返回保存结果
 * @description Token通过请求头Authorization: Bearer <token>传递
 */
api.saveAiImage = (data) => {
	return request.globalRequest(API_HOST_V2 + '/ai/image/save', 'POST', data)
}

/**
 * 查询AI图片列表接口
 * @param {Object} [data] - 请求参数
 * @param {string} [data.image_type] - 图片类型筛选（可选）
 * @param {number} [data.page] - 页码（可选），默认1
 * @param {number} [data.pageSize] - 每页数量（可选），默认20
 * @returns {Promise} - 返回图片列表及分页信息
 * @description Token通过请求头Authorization: Bearer <token>传递
 */
api.getAiImageList = (data) => {
	return request.globalRequest(API_HOST_V2 + '/ai/image/list', 'GET', data)
}

/**
 * 删除AI图片接口
 * @param {string|number} id - 图片ID（路径参数）
 * @returns {Promise} - 返回删除结果
 * @description Token通过请求头Authorization: Bearer <token>传递
 */
api.deleteAiImage = (id) => {
	return request.globalRequest(API_HOST_V2 + '/ai/image/' + id, 'DELETE')
}

/**
 * 获取用户能量接口
 * @returns {Promise} 返回能量信息，包含 energy 和 lastEnergyRefresh
 * @description Token通过请求头 Authorization: Bearer <token> 传递
 */
api.getEnergy = () => {
	return request.globalRequest(API_HOST_V2 + '/energy', 'GET')
}

/**
 * 消耗用户能量接口
 * @param {Object} data - 请求参数
 * @param {number} data.amount - 消耗的能量值，必须大于0
 * @returns {Promise} 返回消耗结果，包含剩余能量
 * @description Token通过请求头 Authorization: Bearer <token> 传递
 */
api.consumeEnergy = (data) => {
	return request.globalRequest(API_HOST_V2 + '/energy/consume', 'POST', data)
}

/**
 * 获取分享码接口
 * @param {Object} [data] - 请求参数
 * @param {string} [data.page] - 小程序页面路径，默认 "pages/index/index"
 * @param {number} [data.width] - 二维码宽度（像素），默认 430
 * @returns {Promise} 返回分享码信息，包含 shareFrom、scene、imageUrl 等
 * @description Token通过请求头 Authorization: Bearer <token> 传递
 */
api.getShareQrcode = (data) => {
	return request.globalRequest(API_HOST_V2 + '/share/qrcode', 'POST', data)
}

/**
 * 提交用户反馈接口
 * @param {Object} data - 请求参数
 * @param {string} data.content - 反馈内容（必填）
 * @param {string[]} [data.images] - 反馈图片URL数组（可选，最多5张）
 * @returns {Promise} 返回提交结果
 */
api.submitFeedback = (data) => {
	return request.globalRequest(API_HOST_V2 + '/feedback', 'POST', data)
}

export default api
