<template>
	<view class="container">
		<!-- 动态盒子 -->
		<view class="dynamicBox" :class="[indexPage==0?'dynamicOne':'',indexPage==2?'dynamicTwo':'']">
			<!-- 初始状态 -->
			<view class="initial WHs" v-if="indexPage==1">
				我的设置
			</view>
			<!-- 状态one -->
			<view class="stateOne WHs" v-if="indexPage==0">
				<swiper class="swiper WHs" @animationfinish='swCalendar' :current='tadyCalendarNum' :indicator-dots="false" :autoplay="true" :interval="6000" :duration="500" :circular='true'>
					<swiper-item v-for="(item,index) in tadyCalendar.items" :key='index'>
						<view class="swiper-item uni-bg-red WHs" @click="toDetil(item)">
							<image class="WHs" :src="item.images.large" mode=""></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 状态two -->
			<view class="stateTwo WHs" v-if="indexPage==2">
				<image class="userImg" src="../../static/img/user/2.svg" mode=""></image>
			</view>
		</view>
		<!-- 主体 -->
		<swiper class="indexSwiper" current="1" @change="swiperChange">
			<!-- 页面1 -->
			<swiper-item>
				<view class="swiper-item swiperLeft">
					<!-- 轮播介绍 -->
					<view class="swiperDetails" :class="[indexPage==0?'animate__animated animate__fadeIn delay2':'animate__animated animate__fadeOut']">
						<view class="title">
							{{tadyCalendar.items[tadyCalendarNum].name_cn?tadyCalendar.items[tadyCalendarNum].name_cn:tadyCalendar.items[tadyCalendarNum].name}}
						</view>
						<view class="score">
							<text class="scoreK">评分：</text>
							<text class="scoreN" v-if="tadyCalendar.items[tadyCalendarNum].rating.score">{{tadyCalendar.items[tadyCalendarNum].rating.score}}</text>
							<text class="scoreN scoreNmini" v-else>暂无评分</text>
						</view>
						<view class="airTime">
							<text class="airTimeK">首播时间：</text>
							<text class="airTimeN">{{tadyCalendar.items[tadyCalendarNum].air_date}}</text>
						</view>
					</view>
					<!-- :class="indexPage==0?'animate__animated animate__bounceInLeft':'animate__animated animate__fadeOut'" -->
					 <view class="leftCardBox" >
					 	<view @click="isCardBgly(1)" class="cardBox" :class="[indexPage==0?'animate__animated animate__bounceInLeft':'animate__animated animate__fadeOut']">
							
						</view>
					 	<view @click="isCardBgly(2)" class="cardBox" :class="[indexPage==0?'animate__animated animate__bounceInLeft delay1':'animate__animated animate__fadeOut']"></view>
					 	<view @click="isCardBgly(3)" class="cardBox" :class="[indexPage==0?'animate__animated animate__bounceInLeft delay2':'animate__animated animate__fadeOut']"></view>
					 </view>
					 <view class="rightCardBox">
					 	<view @click="isCardBgly(4)" class="cardBox" :class="[indexPage==0?'animate__animated animate__bounceInRight':'animate__animated animate__fadeOut']"></view>
					 	<view @click="isCardBgly(5)" class="cardBox" :class="[indexPage==0?'animate__animated animate__bounceInRight delay1':'animate__animated animate__fadeOut']"></view>
					 	<view @click="isCardBgly(6)" class="cardBox" :class="[indexPage==0?'animate__animated animate__bounceInRight delay2':'animate__animated animate__fadeOut']"></view>
					 </view>
				</view>
			</swiper-item>
			<!-- 页面2 -->
			<swiper-item>
				<view class="swiper-item swiperCont">
					<image src="../../static/img/bgImg.png" class="swiperContBg" mode=""></image>
					<!-- 底部组件框 -->
					<view class="cardBox">
						<view @click="txt" :class="indexPage==1?'timeBox animate__animated animate__slideInUp':'animate__animated animate__fadeOutDown timeBox'">
							{{time.month}} 月 {{time.date}} 日 周{{time.day}}
						</view>
					</view>
				</view>
			</swiper-item>
			<!-- 页面1 -->
			<swiper-item>
				<view class="swiper-item swiperRight">
					
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {mixin} from '../../static/js/mixin.js'
	import popupPage from '../components/popupPage.vue'
	export default {
		mixins:[mixin], 
		components:{
		},
		data() {
			return {
				indexPage:1,//当前页面
				calendar:null,//每日放送数据
				tadyCalendar:null,//今日数据
				tadyCalendarNum:0,//今日数据下标
				time:{
					month:new Date().getMonth()+1,
					date:new Date().getDate(),
					day:new Date().getDay(),
					id:null
				}
			}
		},
		onLoad() {
			this.getTime()
			this.getCalendar()
		},
		methods: {
			txt(){
				console.log(this.tadyCalendar)
				// this.$api.txt().then(res => {
				//    console.log(res,'成功') 
				// })
			},
			// 跳转详情
			toDetil(e){
				console.log(e.id)
				this.$api.getsSubject(e.id).then(res => {
				   console.log(res,'成功') 
				})
			},
			//今日数据下标改变
			swCalendar(e){
				this.tadyCalendarNum=e.detail.current
			},
			//获取每日放送
			getCalendar(){
				this.$api.getCalendar().then(res => {
				   console.log(res,'成功')
				   this.calendar=res.data
				   let isTime=this.time.id
				   console.log(this.calendar,isTime)
				   for(let i=0;i<this.calendar.length;i++){
				   	if(this.calendar[i].weekday.id==isTime){
				   		this.tadyCalendar=this.calendar[i]
				   	}
				   }
				})
			},
			//选中卡片
			isCardBgly(e){
				console.log(e,'选中的卡片')
			},
			// 轮播图切换
			swiperChange(e){
				this.indexPage=e.detail.current
				this.isCardBg=null
			},
			//获取当前时间
			 getTime(){
				let time=new Date()
				let day=time.getDay()
				let date={
					month:time.getMonth()+1,
					date:time.getDate(),
					id:day,
					day:day==1?'一':day==2?'二':day==3?'三':day==4?'四':day==5?'五':day==6?'六':'日'
				}
				this.time=date
			 },
		}
	}
</script>

<style lang="scss" scoped>
	@import "./css/index.scss"
</style>