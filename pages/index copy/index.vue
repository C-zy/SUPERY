<template>
	<view class="container">
		<!-- 动态盒子 -->
		<view class="dynamicBox" :class="{ dynamicOne: indexPage === 0, dynamicTwo: indexPage === 2 }">
			<!-- 初始状态 -->
			<view class="initial WHs" v-if="indexPage === 1" @click="clickIndex">
				<view class="button">
					次元空间
					<span class="day">{{ userTime }}</span>
				</view>
			</view>
			<!-- 状态one -->
			<view class="stateOne WHs" v-show="indexPage === 0">
				<swiper
					class="swiper WHs"
					@animationfinish="swCalendar"
					:current="todayCalendarNum"
					indicator-dots
					autoplay
					:interval="6000"
					:duration="500"
					circular
				>
					<swiper-item v-for="item in todayCalendar.items" :key="item.id">
						<view class="swiper-item uni-bg-red WHs" @click="toDetail(item.id, item.images.large)">
							<image class="WHs" :src="item.images.large" mode="aspectFill" />
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 状态two -->
			<view class="stateTwo WHs" v-show="indexPage === 2">
				<image
					class="userImg"
					@click="getUserInfo"
					:src="userInfo.avatarUrl || '../../static/img/user/2.svg'"
					mode="aspectFill"
				/>
			</view>
		</view>
		<!-- 主体 -->
		<swiper class="indexSwiper" current="1" @change="swiperChange">
			<!-- 页面1 -->
			<swiper-item>
				<view class="swiper-item swiperLeft">
					<!-- 轮播介绍 -->
					<view class="swiperDetails" :class="indexPage === 0 ? 'animate__animated animate__fadeIn delay2' : 'animate__animated animate__fadeOut'">
						<view class="title" v-if="currentItem.name_cn || currentItem.name">
							{{ currentItem.name_cn || currentItem.name }}
						</view>
						<view class="score">
							<text class="scoreK">评分：</text>
							<text class="scoreN" v-if="currentItem.rating && currentItem.rating.score">{{ currentItem.rating.score }}</text>
							<text class="scoreN scoreNmini" v-else>暂无评分</text>
						</view>
						<view class="airTime">
							<text class="airTimeK">首播时间：</text>
							<text class="airTimeN">{{ currentItem.air_date }}</text>
						</view>
					</view>
					<view class="botBox">
						<view class="leftCardBox">
							<view
								@click="navigateToCard(1)"
								class="cardBox"
								style="background-color: #fff;"
								:class="indexPage === 0 ? 'animate__animated animate__bounceInLeft' : 'animate__animated animate__fadeOut'"
							>
								<view class="bga">
									<view class="bubble" v-for="n in 5" :key="n" :class="'x' + n" />
								</view>
								<view class="boxTextLy" style="color: #30475e;">番剧</view>
								<view class="anmBox">
									<view id="anm">
										<view :id="'t' + (index + 1)" class="tile" v-for="(item, index) in 23" :key="index" />
									</view>
								</view>
							</view>
							<view
								@click="navigateToCard(2)"
								class="cardBox"
								:class="indexPage === 0 ? 'animate__animated animate__bounceInLeft delay1' : 'animate__animated animate__fadeOut'"
							>
								<image src="../../static/img/cy4.png" :style="rotate" class="cyImg" />
								<view class="waveBox">
									<view class="wave">
										<view class="boxTextLy" style="color: #66FFCC; z-index: 4;">次元漫画</view>
									</view>
								</view>
							</view>
						</view>
						<view class="rightCardBox">
							<view
								@click="navigateToCard(4)"
								class="cardBox"
								:class="indexPage === 0 ? 'animate__animated animate__bounceInRight' : 'animate__animated animate__fadeOut'"
							>
								<view class="weatherBox">
									<view class="boxTextLy">次元壁纸</view>
									<view class="night" v-if="!isDaylight">
										<span class="moon" :style="rotateM" />
										<span class="spot1" />
										<span class="spot2" />
										<ul>
											<li v-for="n in 5" :key="n" />
										</ul>
									</view>
									<view class="hot" v-else>
										<span class="sun" :style="rotateM" />
										<span class="sunx" />
									</view>
								</view>
							</view>
							<view
								@click="navigateToCard(5)"
								class="cardBox"
								:class="indexPage === 0 ? 'animate__animated animate__bounceInRight delay1' : 'animate__animated animate__fadeOut'"
							>
								<view class="EVABox" :style="rotateX">
									<view class="eva-warning">
										<p class="eva-warning__message">alert</p>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
			<!-- 页面2 -->
			<swiper-item>
				<view class="swiper-item swiperCont">
					<image :src="bgImg" class="swiperContBg" mode="aspectFill" />
					<view v-if="comicImg" class="comicImgBox" :class="indexPage === 1 ? 'timeBox animate__animated animate__fadeInRight' : 'animate__animated animate__fadeOutLeft'">
						<image @click="setComic" :src="comicImg" mode="widthFix" :style="rotate" class="comicImg" />
					</view>
					<view class="cardBox">
						<view :class="indexPage === 1 ? 'timeBox animate__animated animate__slideInUp' : 'animate__animated animate__fadeOutDown timeBox'">
							{{ time.month }} 月 {{ time.date }} 日 周{{ time.day }}
						</view>
					</view>
				</view>
			</swiper-item>
			<!-- 页面3 -->
			<swiper-item>
				<view class="swiper-item swiperRight">
					<view class="wrapper">
						<view class="cont">
							<view class="h1" @click="getUserInfo">{{ userInfo.userName || 'Hello world!' }}</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js'

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']
const CARD_ROUTES = {
	1: '../cartoonList/index',
	2: '../../pageA/cartoon/index',
	4: '../wallpaper/index'
}

export default {
	mixins: [mixin],
	data() {
		return {
			indexPage: 1,
			todayCalendar: { items: [] },
			todayCalendarNum: 0,
			time: {
				month: new Date().getMonth() + 1,
				date: new Date().getDate(),
				day: new Date().getDay(),
				id: null
			},
			userTime: null,
			isDaylight: false,
			userInfo: {},
			newTime: ''
		}
	},
	computed: {
		currentItem() {
			return this.todayCalendar.items[this.todayCalendarNum] || {}
		}
	},
	onLoad() {
		this.initTime()
		this.getCalendar()
		this.initUserInfo()
	},
	methods: {
		initUserInfo() {
			try {
				const stored = uni.getStorageSync('userInfo')
				this.userInfo = stored ? JSON.parse(stored) : {}
			} catch (e) {
				this.userInfo = {}
			}
		},

		getUserInfo() {
			uni.vibrateShort()
			if (this.userInfo.userName) return

			uni.getUserProfile({
				desc: 'SUPERY',
				success: (res) => {
					const { nickName, avatarUrl, gender, city, province } = res.userInfo
					const userInfo = {
						userName: this.formatUserName(nickName),
						avatarUrl
					}
					uni.setStorageSync('userInfo', JSON.stringify(userInfo))
					this.userInfo = userInfo

					this.$api.loginwx({
						name: nickName,
						img: avatarUrl,
						login_time: this.newTime,
						gender,
						city,
						province
					}).catch(() => {})
				}
			})
		},

		formatUserName(name) {
			return name.split(' ').map(part => {
				if (part.length <= 4) return part
				return part.match(/.{1,4}/g).join(' ')
			}).join(' ')
		},

		clickIndex() {
			uni.vibrateShort()
		},

		toDetail(id, img) {
			uni.navigateTo({
				url: `../cartoonList/detail?id=${id}&img=${img}`
			})
		},

		swCalendar(e) {
			this.todayCalendarNum = e.detail.current
		},

		getCalendar() {
			this.$api.getCalendar().then(res => {
				const calendar = res.data
				this.$store.state.calendar = calendar
				const dayId = this.time.id === 0 ? 7 : this.time.id
				const today = calendar.find(item => item.weekday.id === dayId)
				if (today) {
					this.todayCalendar = today
				}
			}).catch(() => {})
		},

		navigateToCard(type) {
			uni.vibrateShort()
			const url = CARD_ROUTES[type]
			if (url) {
				uni.navigateTo({ url })
			}
		},

		swiperChange(e) {
			this.indexPage = e.detail.current
		},

		initTime() {
			const now = new Date()
			const year = now.getFullYear()
			const month = now.getMonth() + 1
			const date = now.getDate()
			const day = now.getDay()

			this.time = {
				month,
				date,
				day: WEEK_DAYS[day],
				id: day
			}
			this.$store.state.time = this.time

			this.newTime = `${year}/${month}/${date}`

			if (!uni.getStorageSync('userTime')) {
				uni.setStorageSync('userTime', this.newTime)
			}

			this.userTime = this.getDaysDiff(uni.getStorageSync('userTime'), this.newTime)
			this.isDaylight = now.getHours() >= 7 && now.getHours() < 18
		},

		getDaysDiff(start, end) {
			const diff = new Date(end) - new Date(start)
			return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
		}
	}
}
</script>

<style lang="scss" scoped>
	@import './css/index.scss';
	@import './css/weather.scss';
</style>
