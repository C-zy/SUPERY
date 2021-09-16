<template>
	<view class="container">
		<!-- 动态盒子 -->
		<view class="dynamicBox" :class="[indexPage == 0 ? 'dynamicOne' : '', indexPage == 2 ? 'dynamicTwo' : '']">
			<!-- 初始状态 -->
			<view class="initial WHs" v-if="indexPage == 1" @click="clickIndex()">
				<view class="button">
					次元空间
					<span class="day">{{ userTime }}</span>
				</view>
			</view>
			<!-- 状态one -->
			<view class="stateOne WHs" v-if="indexPage == 0">
				<swiper
					class="swiper WHs"
					@animationfinish="swCalendar"
					:current="tadyCalendarNum"
					:indicator-dots="false"
					:autoplay="true"
					:interval="6000"
					:duration="500"
					:circular="true"
				>
					<swiper-item v-for="(item, index) in tadyCalendar.items" :key="index">
						<view class="swiper-item uni-bg-red WHs" @click="toDetil(item.id, item.images.large)"><image class="WHs" :src="item.images.large" mode=""></image></view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 状态two -->
			<view class="stateTwo WHs" v-if="indexPage == 2"><image class="userImg" :src="userInfo.avatarUrl ? userInfo.avatarUrl : '../../static/img/user/2.svg'" mode=""></image></view>
		</view>
		<!-- 主体 -->
		<swiper class="indexSwiper" current="1" @change="swiperChange">
			<!-- 页面1 -->
			<swiper-item>
				<view class="swiper-item swiperLeft">
					<!-- 轮播介绍 -->
					<view class="swiperDetails" :class="[indexPage == 0 ? 'animate__animated animate__fadeIn delay2' : 'animate__animated animate__fadeOut']">
						<view class="title" v-if="tadyCalendar.items[tadyCalendarNum].name_cn || tadyCalendar.items[tadyCalendarNum].name">
							{{ tadyCalendar.items[tadyCalendarNum].name_cn ? tadyCalendar.items[tadyCalendarNum].name_cn : tadyCalendar.items[tadyCalendarNum].name }}
						</view>
						<view class="score">
							<text class="scoreK">评分：</text>
							<text class="scoreN" v-if="tadyCalendar.items[tadyCalendarNum].rating.score">{{ tadyCalendar.items[tadyCalendarNum].rating.score }}</text>
							<text class="scoreN scoreNmini" v-else>暂无评分</text>
						</view>
						<view class="airTime">
							<text class="airTimeK">首播时间：</text>
							<text class="airTimeN">{{ tadyCalendar.items[tadyCalendarNum].air_date }}</text>
						</view>
					</view>
					<view class="botBox">
						<view class="leftCardBox">
							<view
								@click="isCardBgly(1)"
								class="cardBox"
								style="background-color: #fff;"
								:class="[indexPage == 0 ? 'animate__animated animate__bounceInLeft' : 'animate__animated animate__fadeOut']"
							>
								<!-- 
								BGAimation -->
								<view class="bga"><view class="bubble" v-for="index in 5" :key="index" :class="'x' + index"></view></view>
								<view class="boxTextLy" style="color: #30475e;">番剧</view>
								<view class="anmBox">
									<view id="anm"><view :id="'t' + (index + 1)" class="tile" v-for="(item, index) in 23" :key="index"></view></view>
								</view>
							</view>
							<view @click="isCardBgly(2)" class="cardBox" :class="[indexPage == 0 ? 'animate__animated animate__bounceInLeft delay1' : 'animate__animated animate__fadeOut']">
								<image src="../../static/img/cy4.png" :style="rotate" class="cyImg"></image>
								<view class="waveBox">
									<view class="wave"><view class="boxTextLy" style="color: #66FFCC; z-index: 4;">初音</view></view>
								</view>
							</view>
							<view @click="isCardBgly(3)" class="cardBox" :class="[indexPage == 0 ? 'animate__animated animate__bounceInLeft delay2' : 'animate__animated animate__fadeOut']">
								<!-- <view class="boxText">次元图片</view> -->
							</view>
						</view>
						<view class="rightCardBox">
							<view @click="isCardBgly(4)" class="cardBox" :class="[indexPage == 0 ? 'animate__animated animate__bounceInRight' : 'animate__animated animate__fadeOut']">
								<!-- 夜晚 -->
								<view class="weatherBox">
									<view class="boxTextLy">次元壁纸</view>
									<view class="night" v-if="!isDaylight">
										<span class="moon" :style="rotateM"></span>
										<span class="spot1"></span>
										<span class="spot2"></span>
										<ul>
											<li></li>
											<li></li>
											<li></li>
											<li></li>
											<li></li>
										</ul>
									</view>
									<!-- 白天 -->
									<view class="hot" v-else>
										<span class="sun" :style="rotateM"></span>
										<span class="sunx"></span>
									</view>
								</view>
							</view>
							<view
								@click="isCardBgly(5)"
								class="cardBox"
								:class="[indexPage == 0 ? 'animate__animated animate__bounceInRight delay1' : 'animate__animated animate__fadeOut']"
							></view>
							<view
								@click="isCardBgly(6)"
								class="cardBox"
								:class="[indexPage == 0 ? 'animate__animated animate__bounceInRight delay2' : 'animate__animated animate__fadeOut']"
							></view>
						</view>
					</view>
				</view>
			</swiper-item>
			<!-- 页面2 -->
			<swiper-item>
				<view class="swiper-item swiperCont">
					<image :src="bgImg" class="swiperContBg" mode=""></image>
					<!-- 底部组件框 -->
					<view class="cardBox">
						<view @click="txt" :class="indexPage == 1 ? 'timeBox animate__animated animate__slideInUp' : 'animate__animated animate__fadeOutDown timeBox'">
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
							<view class="h1" @click="getUserInfo()">{{ userInfo.userName ? userInfo.userName : 'Hello world!' }}</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js';
export default {
	mixins: [mixin],
	components: {},
	data() {
		return {
			isPopup: false, //是否开启弹框
			indexPage: 1, //当前页面
			// calendar:null,//每日放送数据
			tadyCalendar: null, //今日数据
			tadyCalendarNum: 0, //今日数据下标
			time: {
				month: new Date().getMonth() + 1,
				date: new Date().getDate(),
				day: new Date().getDay(),
				id: null
			},
			isCard: 0, //选中的卡片
			userTime: null, //用户已进入时间
			isDaylight: false, //判断白天还是夜晚
			userInfo: null ,//用户信息
			strArr:[],//计算缓存
		};
	},
	onLoad() {
		this.getTime();
		this.getCalendar();
		this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
	},
	methods: {
		txt() {
			console.log(this.time);
			uni.navigateTo({
				url: '../webView/index'
			});
		},
		// 获取用户信息
		getUserInfo() {
			uni.vibrateShort();
			if (!this.userInfo) {
				uni.getUserProfile({
					desc: 'Wexin',
					success: res => {
						let userInfo = {
							userName: this.setUserName(res.userInfo.nickName),
							avatarUrl: res.userInfo.avatarUrl
						};
						uni.setStorageSync('userInfo', JSON.stringify(userInfo));
						this.userInfo = userInfo;
					}
				});
			}
		},
		setUserName(val){
			let str = val.split(' ')
			str.forEach(v => {
				this.setStr(v)
			})
			return this.strArr.join(' ')
		},
		setStr(strL){
			if(strL.length > 4){
				this.strArr.push(strL.slice(0, 4))
				this.setStr(strL.slice(4))
			}else{
				this.strArr.push(strL)
			}
		},
		// 首页标签点击
		clickIndex() {
			uni.vibrateShort();
		},
		//弹出框显示隐藏
		popupShow() {
			this.isPopup = !this.isPopup;
		},
		// 跳转详情
		toDetil(id, img = null) {
			uni.navigateTo({
				url: '../cartoonList/detail?id=' + id + '&img=' + img
			});
		},
		//今日数据下标改变
		swCalendar(e) {
			this.tadyCalendarNum = e.detail.current;
		},
		//获取每日放送
		getCalendar() {
			this.$api.getCalendar().then(res => {
				this.calendar = res.data;
				this.$store.state.calendar = res.data;
				let isTime = this.time.id == 0 ? 7 : this.time.id;
				for (let i = 0; i < this.calendar.length; i++) {
					if (this.calendar[i].weekday.id == isTime) {
						this.tadyCalendar = this.calendar[i];
					}
				}
			});
		},
		//选中卡片
		isCardBgly(e) {
			console.log(e, '选中的卡片');
			this.isCard = e;
			if (e == 1) {
				uni.navigateTo({
					url: '../cartoonList/index'
				});
			} else if (e == 4) {
				uni.navigateTo({
					url: '../wallpaper/index'
				});
			} else if (e == 2) {
				uni.navigateTo({
					url: '../webView/index'
				});
			}
		},
		// 轮播图切换
		swiperChange(e) {
			this.indexPage = e.detail.current;
			this.isCardBg = null;
		},
		//获取当前时间
		getTime() {
			let time = new Date();
			let year = time.getFullYear(); //年
			let month = time.getMonth() + 1; //月
			let r = time.getDate();
			let day = time.getDay();
			let date = {
				month: month,
				date: time.getDate(),
				id: day,
				day: day == 1 ? '一' : day == 2 ? '二' : day == 3 ? '三' : day == 4 ? '四' : day == 5 ? '五' : day == 6 ? '六' : '日'
			};
			this.time = date;
			this.$store.state.time = date;
			let userTime = year + '.' + month + '.' + r;
			if (!uni.getStorageSync('userTime')) {
				uni.setStorageSync('userTime', userTime);
			}
			this.userTime = this.getDaysBetween(uni.getStorageSync('userTime'), userTime);
			if (time.getHours() >= 7 && time.getHours() < 18) {
				this.isDaylight = true;
			} else {
				this.isDaylight = false;
			}
		},
		// 获取时间差
		getDaysBetween(dateString1, dateString2) {
			var startDate = Date.parse(dateString1);
			var endDate = Date.parse(dateString2);
			var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000) + 1;
			return days;
		}
	}
};
</script>

<style lang="scss" scoped>
@import './css/index.scss';
</style>

<style lang="scss" scoped>
@import './css/weather.scss';
</style>
