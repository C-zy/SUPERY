<template>
<view class="page-root">
	<view class="container" :class="{ 'font-ready': fontReady }" catchtouchmove>
		<!-- 顶部图片 -->
		 <view class="headImgWrap animate-fade" :class="{ 'show': pageReady }" :style="parallax.head">
			<image class="headImg" src="https://img.cdn1.vip/i/6a13fb4fa76ab_1779694415.webp" mode="widthFix"></image>
		 </view>
		 <!-- 底部内容 -->
		 <view class="bottom-content">
			<view class="oneBox animate-card" :class="{ 'card-show': pageReady }" :style="{ animationDelay: '0.1s' }" @click="handleUseAi">
				<view class="itemText">{{ isAuditMode ? '我的备忘录' : 'GUNDAM创作' }}</view>
				<view class="itemImg" :style="parallax.a">
					<image src="https://img.cdn1.vip/i/6a150652cb1e7_1779762770.webp" mode="widthFix" class="aiImg"></image>
				</view>
			</view>
			<view class="bottomBox">
				<view class="bottomBoxItem animate-card" :class="{ 'card-show': pageReady }" :style="{ animationDelay: '0.2s' }" @click="handleRecord">
					<view class="itemText">我的记录</view>
					<view class="itemImg" :style="parallax.b">
						<image src="https://img.cdn1.vip/i/6a150cf89b0c5_1779764472.webp" mode="widthFix" class="recordImg" style="top: 10rpx;"></image>
					</view>
				</view>
				<view class="bottomBoxItem animate-card" :class="{ 'card-show': pageReady }" :style="{ animationDelay: '0.3s' }" @click="handleFeedback">
					<view class="itemText">用户反馈</view>
					<view class="itemImg" :style="parallax.c">
						<image src="https://img.cdn1.vip/i/6a140d1090ef8_1779698960.webp" mode="widthFix" class="recordImg"></image>
					</view>
				</view>
			</view>
			<!-- 登录按钮 -->
		<view class="loginBtn animate-card" :class="{ 'card-show': pageReady }" :style="{ animationDelay: '0.4s' }" @click="handleLoginClick" hover-class="loginBtnHover">
			<view class="iconBox" :style="parallax.d">
				<image src="https://img.cdn1.vip/i/6a14169e81915_1779701406.webp" mode="widthFix" class="loginImg"></image>
			</view>
			<view class="loginText">
				{{ userInfo ? (userInfo.nickname || '驾驶员') : '驾驶员' }}
			</view>
		</view>
	 </view>
	<!-- 修改用户名弹窗 -->
	<view class="popup-mask" v-if="showNicknamePopup" @click="closeNicknamePopup" catchtouchmove>
		<view class="popup-box animate-popup" :class="{ 'popup-keyboard': keyboardShow }" v-if="showNicknamePopup" @click.stop>
			<view class="popup-title">修改昵称</view>
			<input
				class="nickname-input"
				v-model="newNickname"
				placeholder="请输入新昵称"
				maxlength="12"
				:focus="showNicknamePopup"
				confirm-type="done"
				@keyboardheightchange="onKeyboardChange"
			/>
			<view class="popup-btns">
				<view class="popup-btn cancel-btn" @click="closeNicknamePopup">取消</view>
				<view class="popup-btn confirm-btn" @click="confirmNickname">确认</view>
			</view>
		</view>
	</view>
</view>
</view>
</template>

<script>
import api from '@/api/index.js'
import { loadAppFont, FONT_FAMILY } from '@/common/loadFont.js'

export default {
	data() {
		return {
			isLoading: false,
			userInfo: null,
			fontReady: false,
			x: 0,
			y: 0,
			targetX: 0,
			targetY: 0,
			lerpFactor: 0.12,
			motionTimer: null,
			motionListenerAdded: false,
			showNicknamePopup: false,
			newNickname: '',
			pageReady: false,
			keyboardShow: false,
			isAuditMode: false
		}
	},
	computed: {
		parallax() {
			const calc = (mx, my) => {
				const nx = this.x.toFixed(2) * mx
				const ny = this.y.toFixed(2) * my
				return `transform: translate(${nx}rpx, ${ny}rpx)`
			}
			return {
				head: calc(5, 4),
				a: calc(2.5, 2),
				b: calc(-1.5, 1.8),
				c: calc(1.8, -1.3),
				d: calc(1.2, 1.2)
			}
		}
	},
	onLoad() {
		this.checkLoginStatus()
		this.initFont()
		this.initMotion()
		this.checkAuditStatus()
		setTimeout(() => {
			this.pageReady = true
		}, 100)
	},
	onUnload() {
		this.stopMotion()
	},
	methods: {
		checkLogin() {
			if (!this.userInfo) {
				this.handleLogin()
				return false
			}
			return true
		},
		handleRecord() {
			if (!this.checkLogin()) return
			uni.vibrateShort()
			uni.navigateTo({
				url: '/pages/aiImgList/index'
			})
		},
		handleFeedback() {
			if (!this.checkLogin()) return
			uni.vibrateShort()
			uni.navigateTo({
				url: '/pages/feedback/index'
			})
		},
		initFont() {
			loadAppFont()
				.then(() => { this.fontReady = true })
				.catch((err) => console.error('页面字体加载失败', err))
		},
		clearSession() {
			uni.removeStorageSync('token')
			uni.removeStorageSync('userInfo')
			this.userInfo = null
		},
		initMotion() {
			if (this.motionListenerAdded) return
			this.motionListenerAdded = true
			uni.startDeviceMotionListening({
				interval: 'ui'
			})
			uni.onDeviceMotionChange((result) => {
				const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
				this.targetX = clamp(-result.gamma.toFixed(2) / 3, -15, 15)
				this.targetY = clamp(-(result.beta - 30).toFixed(2) / 3, -15, 15)
			})
			this.motionTimer = setInterval(() => {
				this.x += (this.targetX - this.x) * this.lerpFactor
				this.y += (this.targetY - this.y) * this.lerpFactor
			}, 16)
		},
		stopMotion() {
			this.motionListenerAdded = false
			uni.stopDeviceMotionListening()
			if (this.motionTimer) {
				clearInterval(this.motionTimer)
				this.motionTimer = null
			}
		},
		handleUseAi() {
			if (!this.checkLogin()) return
			uni.vibrateShort()
			if (this.isAuditMode) {
				uni.navigateTo({
					url: '/pages/review/index'
				})
			} else {
				uni.navigateTo({
					url: '/pages/ai/index'
				})
			}
		},
		handleLoginClick() {
			uni.vibrateShort()
			if (this.userInfo) {
				this.newNickname = this.userInfo.nickname || ''
				this.showNicknamePopup = true
			} else {
				this.handleLogin()
			}
		},
		closeNicknamePopup() {
			uni.vibrateShort()
			this.showNicknamePopup = false
			this.newNickname = ''
			this.keyboardShow = false
		},
		onKeyboardChange(e) {
			this.keyboardShow = e.detail.height > 0
		},
		async confirmNickname() {
			if (!this.newNickname.trim()) {
				uni.showToast({ title: '昵称不能为空', icon: 'none' })
				return
			}
			try {
				const res = await api.updateUserInfo({ nickname: this.newNickname.trim() })
				const updatedUser = { ...this.userInfo, nickname: this.newNickname.trim() }
				this.userInfo = updatedUser
				uni.setStorageSync('userInfo', updatedUser)
				uni.vibrateShort()
				uni.showToast({ title: '修改成功', icon: 'success' })
				this.closeNicknamePopup()
			} catch (e) {
				uni.showToast({ title: '修改失败，请重试', icon: 'none' })
			}
		},
		checkLoginStatus() {
			const token = uni.getStorageSync('token')
			const userInfo = uni.getStorageSync('userInfo')
			if (token && userInfo) {
				this.userInfo = userInfo
				this.verifyToken()
			}
		},

		async verifyToken() {
			try {
				const res = await api.verifyToken()
				if (res.data) {
					this.userInfo = res.data
					uni.setStorageSync('userInfo', res.data)
				}
			} catch (e) {
				this.clearSession()
			}
		},

		async checkAuditStatus() {
			try {
				const res = await api.getAuditStatus()
				if (res.data) {
					this.isAuditMode = res.data.isOpen || false
				}
			} catch (e) {
				console.log('获取审核模式状态失败', e)
			}
		},

		handleLogin() {
			if (this.isLoading) return
			this.isLoading = true

			wx.login({
				success: (loginRes) => {
					if (loginRes.code) {
						this.getUserProfile(loginRes.code)
					} else {
						this.isLoading = false
						uni.showToast({
							title: '获取登录凭证失败',
							icon: 'none'
						})
					}
				},
				fail: () => {
					this.isLoading = false
					uni.showToast({
						title: '登录失败',
						icon: 'none'
					})
				}
			})
		},

		getUserProfile(code) {
			wx.getUserProfile({
				desc: '用于完善用户资料',
				success: (profileRes) => {
					this.doLogin(code, profileRes.userInfo)
				},
				fail: () => {
					this.doLogin(code, null)
				}
			})
		},

		async doLogin(code, userInfo) {
			try {
				const res = await api.login({
					code,
					userInfo
				})

				if (res.data && res.data.token) {
					uni.setStorageSync('token', res.data.token)
					uni.setStorageSync('userInfo', res.data.user)
					this.userInfo = res.data.user
					uni.vibrateShort()

					uni.showToast({
						title: res.data.isNewUser ? '注册成功' : '登录成功',
						icon: 'success'
					})
				}
			} catch (e) {
				console.log('登录失败', e)
			} finally {
				this.isLoading = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page-root {
	width: 100%;
	height: 100vh;
	overflow: hidden;
	position: relative;
}
.container {
	width: 100%;
	height: 100vh;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 30rpx 40rpx;
	box-sizing: border-box;
	font-family: sans-serif;
	position: relative;
	overflow: hidden;
}

.animate-fade {
	opacity: 0;
}

.animate-fade.show {
	animation: fadeIn 0.6s ease forwards;
}

.headImgWrap {
	width: 100%;
	position: relative;
	top: -50rpx;
	z-index: 1;
	will-change: transform;
}

.headImg {
	width: 100%;
	height: auto;
	display: block;
}

.bottom-content {
	width: 100%;
	height: 60%;
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 2;
	background-image: url('@/static/img/bgb.png');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	box-sizing: border-box;
	padding: 180rpx 20rpx;
	overflow-x: hidden;
}
.oneBox{
	width: 100%;
	height: 320rpx;
	background-image: url('@/static/img/mbox.png');
	background-size: 100% 100%;
	background-position: center;
	background-repeat: no-repeat;
	display: flex;
	padding: 60rpx 0 0 60rpx;
	box-sizing: border-box;
	align-items: center;
	justify-content: space-around;
	transition: transform 0.3s, opacity 0.3s, box-shadow 0.3s;
	box-shadow: 0 6rpx 20rpx rgba(12, 104, 188, 0.08);
	&:active {
		transform: scale(0.97);
		opacity: 0.9;
		box-shadow: 0 2rpx 8rpx rgba(12, 104, 188, 0.04);
	}
	.itemText{
		font-size: 50rpx;
		white-space: nowrap;
	}
	.aiImg{
		width: 400rpx;
		height: auto;
		position: relative;
		top: 0rpx;
		left: 70rpx;
		transform: rotate(30deg);
	}
}
.bottomBox{
	width: 100%;
	margin-top: 50rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.bottomBoxItem{
	width: 48%;
	height: 200rpx;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-around;
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx;
	transition: all 0.3s;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	&:active {
		transform: scale(0.96);
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.03);
	}
}
.loginBtn{
	width: 100%;
	height: 100rpx;
	margin-top: 50rpx;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 0 100rpx;
	border-radius: 100rpx;
	transition: all 0.3s;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	.loginImg{
		width: 140rpx;
		height: auto;
		position: relative;
		top: 0rpx;
		left: -50rpx;
	}
	.loginText{
		font-size: 30rpx;
		color: rgb(12, 104, 188);
	}
}
.loginBtnHover {
	opacity: 0.85;
	transform: scale(0.97);
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}
.popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: maskFadeIn 0.25s ease forwards;
}

@keyframes maskFadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}
.popup-box {
	width: 600rpx;
	background-color: #fff;
	border-radius: 24rpx;
	padding: 50rpx 40rpx;
	box-sizing: border-box;
	transition: transform 0.3s ease;
}
.popup-keyboard {
	transform: translateY(-15vh);
}
.animate-popup {
	animation: popupScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes popupScale {
	from {
		opacity: 0;
		transform: scale(0.85);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}
.popup-title {
	font-size: 34rpx;
	color: #333;
	text-align: center;
	margin-bottom: 40rpx;
}
.nickname-input {
	width: 100%;
	height: 88rpx;
	background-color: #f5f7fa;
	border-radius: 12rpx;
	padding: 0 24rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	color: #333;
	border: 2rpx solid transparent;
	transition: border-color 0.3s;
	margin-bottom: 30rpx;
}
.nickname-input:focus {
	border-color: rgba(12, 104, 188, 0.4);
}
.popup-btns {
	display: flex;
	justify-content: space-between;
}
.popup-btn {
	width: 48%;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	transition: all 0.3s;
}
.popup-btn:active {
	transform: scale(0.96);
}
.cancel-btn {
	background-color: #f5f7fa;
	color: #666;
}
.confirm-btn {
	background: linear-gradient(135deg, rgb(12, 104, 188), rgb(20, 120, 200));
	color: #fff;
	box-shadow: 0 6rpx 16rpx rgba(12, 104, 188, 0.3);
}
.itemImg,
.iconBox {
	will-change: transform;
}
.itemText{
	font-size: 30rpx;
	color: rgb(12, 104, 188);
}
.recordImg{
	width: 180rpx;
	height: auto;
	position: relative;
	bottom: 20rpx;
	left: 20rpx;
}
</style>
