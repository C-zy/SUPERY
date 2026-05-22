<template>
	<view class="container">
		<view class="login-section">
			<view class="user-info" v-if="userInfo">
				<image class="avatar" :src="userInfo.avatar_url" mode="aspectFill"></image>
				<view class="user-name">{{ userInfo.nickname }}</view>
				<view class="logout-btn" @click="handleLogout">退出登录</view>
			</view>
			<view class="login-btn" v-else @click="handleLogin">
				<view class="btn-text">{{ isLoading ? '登录中...' : '微信一键登录' }}</view>
			</view>
		</view>
		<view class="use-ai-btn" @click="handleUseAi" v-if="userInfo">使用AI</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			isLoading: false,
			userInfo: null
		}
	},
	onLoad() {
		this.checkLoginStatus()
	},
	methods: {
		handleUseAi() {
			uni.navigateTo({
				url: '/pages/ai/index'
			})
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
			}
		} catch (e) {
			console.log('Token验证失败', e)
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

					uni.showToast({
						title: res.data.isNewUser ? '注册成功' : '登录成功',
						icon: 'success'
					})
					
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/ai/index'
						})
					}, 1500)
				}
			} catch (e) {
				console.log('登录失败', e)
			} finally {
				this.isLoading = false
			}
		},

		async handleLogout() {
		try {
			await api.logout()
		} catch (e) {
			console.log('退出登录失败', e)
		}

		uni.clearStorageSync()
		this.userInfo = null

		uni.showToast({
			title: '已退出登录',
			icon: 'success'
		})
	}
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	min-height: 100vh;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 30rpx 40rpx;
	box-sizing: border-box;
	gap: 40rpx;
}

.login-section {
	width: 100%;
}

.user-info {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
	background-color: #f5f7fa;
	padding: 20rpx 30rpx;
	border-radius: 50rpx;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	border: 3rpx solid #1e88e5;
}

.user-name {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	flex: 1;
}

.logout-btn {
	font-size: 26rpx;
	color: #ff5252;
	padding: 10rpx 20rpx;
	border: 2rpx solid #ff5252;
	border-radius: 30rpx;
}

.login-btn {
	width: 100%;
	height: 90rpx;
	background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
	border-radius: 45rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 8rpx 20rpx rgba(7, 193, 96, 0.3);
}

.btn-text {
	font-size: 34rpx;
	color: #fff;
	font-weight: bold;
}

.use-ai-btn {
	width: 100%;
	height: 90rpx;
	background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
	border-radius: 45rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 8rpx 20rpx rgba(30, 136, 229, 0.3);
	font-size: 34rpx;
	color: #fff;
	font-weight: bold;
}

</style>
