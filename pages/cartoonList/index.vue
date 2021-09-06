<template>
	<view class="content">
		<view class="headText" @click="demo()">
			热播新番导视
		</view>
		<view class="cartBox" v-for="(item,index) in calendar" :key='index'>
			<view class="timeT">{{item.weekday.cn}}</view>
			<view class="cartList" v-for="(val,int) in item.items" :key='val.id' @click="toDetail(val.id,val.images.large)">
				<image lazy-load :src="val.images.large" mode="widthFix"></image>
				<view class="boxR">
					<view class="textCart">{{val.name_cn?val.name_cn:val.name}}</view>
					<view class="firstTime">
						首播时间：
						<text class="fTime">{{val.air_date}}</text>
					</view>
					<view class="score">
						<text class="scoreK">评分：</text>
						<text class="scoreN" v-if="val.rating.score">{{val.rating.score}}</text>
						<text class="scoreN scoreNmini" v-else>暂无评分</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mixin} from '../../static/js/mixin.js'
	export default {
		mixins:[mixin],
		data() {
			return {
				calendar:null,//每日放送数据
				time:null
			}
		},
		onLoad() {
			this.calendar=this.$store.state.calendar
			this.time=this.$store.state.time
			console.log(this.time)
		},
		methods: {
			// 跳转详情
			toDetail(id,img){
				uni.navigateTo({
					url:'./detail?id='+id+'&img='+img
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "./css/index.scss"
</style>
