<template>
	<view class="container">
		<view class="demo" @click="demo()">123</view>
		<!-- <image :src="imgList[0].urls.original" mode=""></image> -->
		<!-- <web-view :src="webView"></web-view> -->
		<!-- <image :src="imgUrl" mode=""></image> -->
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js';
export default {
	mixins: [mixin],
	data() {
		return {
			webView: 'http://192.168.1.82:3000/static/books/202109001/第002卷.pdf',
			imgUrl: '',
			imgList: [],
			bgUrl: uni.getStorageSync('imgPageBg'),
		};
	},
	computed: {},
	onLoad(e) {},
	methods: {
		demo() {
			// let pr = {
			// 	num:10
			// }
			// this.$api.txt(pr).then(res => {
			// 	console.log(res)
			// 	this.imgList = res.data.data
			// });
			uni.getUserProfile({
				desc: 'Wexin',
				success: res => {
					console.log(res)
					let val = {
						name:res.userInfo.nickName,
						img:res.userInfo.avatarUrl,
						login_time:'1231',
						gender:res.userInfo.gender,
						city:res.userInfo.city,
						province:res.userInfo.province
					}
					this.$api.loginwx(val).then(res => {
						console.log(res)
					});
				}
			});
			// switch (uni.getSystemInfoSync().platform) {
			// 	case 'android':
			// 		console.log('运行Android上');
			// 		this.openReport(this.webView);
			// 		break;
			// 	case 'ios':
			// 		console.log('运行iOS上');
			// 		uni.navigateTo({
			// 			url: '../../pages/webView/index'
			// 		});
			// 		break;
			// 	default:
			// 		console.log('运行在开发者工具上');
			// 		break;
			// }
			
		},
		quest(val){
			// uni.request({
			//     url: 'https://supery.work/api/v1/login',
			//     method:'POST',
			//     data:val
			// }).then(res => {
			// 	console.log(res)
			// })
		},
		openReport(url) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			wx.downloadFile({
				url: url,
				success: function(res) {
					console.log(res);
					uni.hideLoading();
					var filePath = res.tempFilePath;
					uni.showLoading({
						title: '正在打开',
						mask: true
					});
					wx.openDocument({
						filePath: filePath,
						fileType: 'pdf',
						success: function(res) {
							console.log(res);
							uni.hideLoading();
							console.log('打开文档成功');
						},
						fail: function(err) {
							uni.hideLoading();
							console.log('fail:' + JSON.stringify(err));
						}
					});
				},
				fail: function(err) {
					uni.hideLoading();
					console.log('fail:' + JSON.stringify(err));
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	// height: 100vh;
}
.demo {
	margin-top: 200rpx;
}
</style>
