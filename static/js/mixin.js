import { jrPencil } from '../../static/js/jrPencil.js'

let motionListenerAdded = false

export const mixin = {
	data() {
		return {
			mixinBg: uni.getStorageSync('timColor').bgC,
			bgImg: '../../static/img/bgImg.png',
			bgColor1: '#d1c145',
			bgColor2: '#f9fcfb',
			bgColor3: '#30475e',
			calendar: null,
			comicImg: uni.getStorageSync('comicImg'),
			Pimg: 'https://api.moedog.org/pixiv/interface/PixivProxy.php?url=',
			x: 0,
			y: 0
		}
	},
	computed: {
		rotate() {
			const numX = this.x.toFixed(2) * 4
			const numY = this.y.toFixed(2) * 2
			return `transform: translate(${numX}rpx,${numY}rpx)`
		},
		rotateM() {
			const numX = this.x.toFixed(2) * 2
			const numY = this.y.toFixed(2) * 2
			return `transform: translate(${numX}rpx,${numY}rpx)`
		},
		rotateX() {
			const numX = this.x.toFixed(2) * 3
			return `transform: translateX(${numX}rpx)`
		}
	},
	onLoad() {
		this.initMotion()
		if (!this.comicImg) {
			this.setComic()
		}
	},
	onUnload() {
		this.stopMotion()
	},
	beforeDestroy() {
		this.stopMotion()
	},
	methods: {
		initMotion() {
			if (motionListenerAdded) return
			motionListenerAdded = true
			uni.startDeviceMotionListening({
				interval: 'ui'
			})
			uni.onDeviceMotionChange((result) => {
				const xVal = -(result.gamma).toFixed(2) / 5
				const yVal = -(result.beta - 30).toFixed(2) / 5
				this.x = xVal > 10 ? 10 : (xVal < -10 ? -10 : xVal)
				this.y = yVal > 10 ? 10 : (yVal < -10 ? -10 : yVal)
			})
		},
		stopMotion() {
			motionListenerAdded = false
			uni.stopDeviceMotionListening()
		},
		base64Img(url) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: 'https://supery.work/api/v1/getPixiv1P?val=' + url,
					method: 'GET',
					responseType: 'arraybuffer'
				}).then(img => {
					const base64Img = uni.arrayBufferToBase64(img[1].data)
					resolve('data:image/png;base64,' + base64Img)
				}).catch(err => {
					reject(err)
				})
			})
		},
		setComic() {
			const num = Math.floor(Math.random() * jrPencil.length)
			const url = jrPencil[num]
			uni.setStorageSync('comicImg', url)
			uni.vibrateShort()
			this.comicImg = url
		}
	}
}