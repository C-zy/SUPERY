<template>
	<!-- 壁纸详情 -->
	<view class="container">
		<image :src="bgUrl" class="bgImg"></image>
		<image v-if="loadImg" src="../../static/img/loading.gif" mode="widthFix" class="loadI"></image>
		<image class="imgCont" :src="Pimg + imgData.singleImg" mode="widthFix" @click="setModel()" @load="imageLoad()"></image>
		<!-- 底部弹框 -->
		<view class="bottomBox" :class="show ? 'boxHid' : 'boxShow'">
			<view class="cont">
				<view class="name">@ {{ imgData.title }}</view>
				<view class="tagBox">
					<view class="tag" v-for="(item, index) in imgData.tags" :key="index" v-if="index < 4">#{{ item.name }}</view>
				</view>
				<view class="btnBox">
					<view class="btn" :class="btnType ? 'btnM' : 'btnL'" @click="download()">
						<image v-if="btnType" src="../../static/img/yes.png" mode="widthFix" class="btnImg animate__animated animate__flipInY"></image>
						<image v-else src="../../static/img/download.png" mode="widthFix" class="btnImg animate__animated animate__flipInY"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js';
export default {
	mixins: [mixin],
	data() {
		return {
			bgUrl: uni.getStorageSync('imgPageBg'),
			imgData: null,
			cache: null,
			loadImg: true,
			show: false,
			btnType: false,
			openSettingBtnHidden: true //是否授权
		};
	},
	onLoad(e) {
		let data = JSON.parse(uni.getStorageSync('pageData'));
		this.cache = data;
		this.getSingleImg();
	},
	methods: {
		// 图片设置
		getSingleImg() {
			let obj = this.cache;
			let singleImg = obj.image_urls.large;
			if (obj.meta_pages.length > 0) {
				singleImg = obj.meta_pages[0].image_urls.original;
			} else {
				singleImg = obj.meta_single_page.original_image_url;
			}
			obj.singleImg = singleImg;
			this.imgData = obj;
		},
		imageLoad() {
			this.loadImg = false;
		},
		setModel() {
			this.show = !this.show;
		},
		// 下载
		download() {
			if (!this.btnType) {
				uni.showLoading({
					title: '下载中',
					mask: true
				});
				this.base64Img(this.imgData.singleImg).then(res => {
					this.ewmImg = res;
					uni.hideLoading();
					this.saveEwm();
				});
			}
		},
		saveEwm() {
			let that = this;
			//获取相册授权
			uni.getSetting({
				success(res) {
					if (!res.authSetting['scope.writePhotosAlbum']) {
						uni.authorize({
							scope: 'scope.writePhotosAlbum',
							success() {
								//这里是用户同意授权后的回调
								that.saveBase64Img();
							},
							fail() {
								//这里是用户拒绝授权后的回调
								that.openSettingBtnHidden = false;
							}
						});
					} else {
						//用户已经授权过了
						that.saveBase64Img();
					}
				}
			});
		},
		saveBase64Img() {
			let that = this;
			let name = Date.parse(new Date());
			let base64 = this.ewmImg.replace(/^data:image\/\w+;base64,/, ''); //去掉data:image/png;base64,
			let filePath = wx.env.USER_DATA_PATH + '/' + name + '.png';
			uni.showLoading({
				title: '保存中',
				mask: true
			});
			uni.getFileSystemManager().writeFile({
				filePath: filePath, //创建一个临时文件名
				data: base64, //写入的文本或二进制数据
				encoding: 'base64', //写入当前文件的字符编码
				success: res => {
					uni.saveImageToPhotosAlbum({
						filePath: filePath,
						success: function(res2) {
							uni.hideLoading();
							uni.showToast({
								title: '保存成功',
								icon: 'none',
								duration: 2000
							});
							that.btnType = true;
							uni.vibrateShort();
						},
						fail: function(err) {
							uni.hideLoading();
						}
					});
				},
				fail: err => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style>
page {
	background-color: #30475e;
}
</style>
<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	.bgImg {
		width: 120%;
		height: 120%;
		filter: blur(15px);
		position: fixed;
		// position: absolute;
		top: -10%;
		right: -10%;
		z-index: -1;
	}
	.loadI {
		width: 100vw;
		position: fixed;
		top: 40%;
		left: 0;
		z-index: -1;
	}
	.imgCont {
		width: 100%;
		height: auto;
	}
}
.bottomBox {
	transition: 0.5s;
	position: fixed;
	width: 100%;
	height: 400rpx;
	background-color: rgba($color: #000, $alpha: 0.4);
	border-radius: 20rpx 20rpx 0 0;
	padding: 40rpx;
	box-sizing: border-box;
	color: #fff;
	.cont {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.name {
		font-size: 38rpx;
	}
	.tagBox {
		width: 100%;
		margin-top: 20rpx;
		.tag {
			font-size: 28rpx;
			display: inline-block;
			padding: 6rpx 10rpx;
			background-color: rgba($color: #30475e, $alpha: 0.6);
			margin: 10rpx;
			border-radius: 4rpx;
			opacity: 0.8;
		}
	}
	.btnBox {
		width: 100%;
		position: absolute;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn {
			transition: 0.3s;
			height: 100rpx;
			border-radius: 50rpx;
			background-color: #1296db;
			display: flex;
			justify-content: center;
			align-items: center;
			.btnImg {
				width: 60rpx;
				height: 60rpx;
				transition: 0.4s;
			}
		}
		.btnM {
			width: 100rpx;
		}
		.btnL {
			width: 400rpx;
		}
	}
}
.boxShow {
	bottom: -400rpx;
}
.boxHid {
	bottom: 0;
}
</style>
