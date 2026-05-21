const request = {}
const headers = {}

request.globalRequest = (url, method, data, power) => {
	const config = {
		url,
		method,
		data,
		header: {},
		dataType: 'json'
	}

	switch (power) {
		case 1:
			config.header['Authorization'] = 'Basic '
			break
		case 2:
			config.header['content-type'] = 'application/json'
			break
		case 3:
			config.responseType = 'arraybuffer'
			break
		default:
			break
	}

	const token = uni.getStorageSync('token')
	if (token) {
		config.header['Authorization'] = 'Bearer ' + token
	}

	return new Promise((resolve, reject) => {
		uni.request({
			...config,
			success: (res) => {
				const response = res.data
				if (response.err === 0) {
					resolve(response)
				} else {
					if (response.msg && response.msg.includes('Token')) {
						uni.clearStorageSync()
						uni.showToast({
							title: '请重新登录',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: response.msg || '请求失败',
							icon: 'none'
						})
					}
					reject(response)
				}
			},
			fail: (err) => {
				const code = (err && err.statusCode) || 0
				if (code === 401) {
					uni.clearStorageSync()
					uni.showToast({
						title: '请重新登录',
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: (err && err.errMsg) || '网络错误',
						icon: 'none'
					})
				}
				reject(err)
			}
		})
	})
}

request.uploadFile = (url, filePath, name, formData) => {
	return new Promise((resolve, reject) => {
		const header = {}
		const token = uni.getStorageSync('token')
		if (token) {
			header['Authorization'] = 'Bearer ' + token
		}

		uni.uploadFile({
			url,
			filePath,
			name,
			header,
			formData,
			success: (res) => {
				const data = JSON.parse(res.data)
				if (data.err === 0) {
					resolve(data)
				} else {
					uni.showToast({
						title: data.msg || '上传失败',
						icon: 'none'
					})
					reject(data)
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

export default request
