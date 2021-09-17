// 全局调用文件，打开小程序时执行，获取后台设置的全局参数在需要的页面进行引用
import {jrPencil} from '../../static/js/jrPencil.js';
export const mixin={
    data() {
        return {
					mixinBg:uni.getStorageSync('timColor').bgC,//#222831
					// 图片
					bgImg:'../../static/img/bgImg.png',
					// 颜色
					bgColor1:'#d1c145',
					bgColor2:'#f9fcfb',
					bgColor3:'#30475e',
					// 数据
					calendar:null,
					comicImg:uni.getStorageSync('comicImg'),//首页插画
					Pimg:'https://api.moedog.org/pixiv/interface/PixivProxy.php?url=',
					x:0,
					y:0,
        }
    },
		computed:{
			rotate(){
				let numX = this.x.toFixed(2)*4;
				let numY = this.y.toFixed(2)*2;
				return "transform: translate("+numX+"rpx,"+numY+"rpx)"
			},
			rotateM(){
				let numX = this.x.toFixed(2)*2;
				let numY = this.y.toFixed(2)*2;
				return "transform: translate("+numX+"rpx,"+numY+"rpx)"
			},
			rotateX(){
				let numX = this.x.toFixed(2)*3;
				return "transform: translateX("+numX+"rpx)"
			},
		},
		onLoad(e) {
			this.move()
			if(!this.comicImg){
				this.setComic()
			}
		},
    methods: {
			// 全局同态效果
			move(){
				uni.startDeviceMotionListening({
					interval: 'ui',
				});
				uni.onDeviceMotionChange((result) => {
					var xVal = -(result.gamma).toFixed(2)/5;
					var yVal = -(result.beta - 30).toFixed(2)/5;
					this.x = xVal > 10 ? 10 : (xVal < -10 ? -10 : xVal)
					this.y = yVal > 10 ? 10 : (yVal < -10 ? -10 : yVal)
				})
			},
			// base64图片转换
			base64Img(url){
				return new Promise(resolve => {
					uni.request({
					    url: 'https://api.moedog.org/pixiv/interface/PixivProxy.php?url='+url,
					    method:'GET',
							responseType : 'arraybuffer'
					}).then(img => {
						let base64_Img = uni.arrayBufferToBase64(img[1].data)
						resolve('data:image/png;base64,' + base64_Img)
					})
				})
			},
			// 角色切换
			setComic(){
				let num = Math.floor(Math.random() * jrPencil.length)
				let url = jrPencil[num]
				uni.setStorageSync('comicImg', url);
				uni.vibrateShort();
				this.comicImg = url
			}
		}
}