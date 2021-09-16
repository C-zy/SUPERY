<template>
	<view class="content">
		<!-- 背景图 -->
		<image :src="bgImg" class="bgImg"></image>
		<!-- 顶部 -->
		<scroll-view v-if="date" class="scrollBox" scroll-y="true" @scroll="scrollLy">
			<view class="headImgBox"><image :src="bgImg" mode="widthFix"></image></view>
			<view class="textBox">
				<view class="score">
					<text class="scoreK">评分：</text>
					<text class="scoreN" v-if="date.rating.score">{{ date.rating.score }}</text>
					<text class="scoreN scoreNmini" v-else>暂无评分</text>
				</view>
				<view class="airTime">
					<text class="airTimeK">首播时间：</text>
					<text class="airTimeN">{{ date.air_date }}</text>
				</view>
				<view class="abstract">
					<text>简介：{{ date.summary == '' ? '暂无简介' : date.summary }}</text>
				</view>
			</view>
			<!-- 集数 -->
			<view class="numListBox">
				<view class="numBox" v-for="(item, index) in numList" :key="index" v-if="item.name_cn || item.name">
					第{{ index + 1 }}话: {{ item.name_cn ? item.name_cn : item.name }}
				</view>
			</view>
		</scroll-view>
		<!-- 返回组件 -->
		<view class="toBack" @click="popupShow()" v-if="isPopup" :class="[isPopup ? 'animate__animated animate__bounceInRight delay1' : 'animate__animated animate__fadeOut']">
			<image src="../../static/img/back.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js';
export default {
	mixins: [mixin],
	data() {
		return {
			isPopup: true,
			date: null, //数据
			bgImg: null, //背景图
			numList: []
		};
	},
	onLoad(e) {
		this.getDate(e.id, e.img);
	},
	methods: {
		// 滚动事件
		scrollLy(e) {
			// console.log('111',e.detail.scrollTop)
		},
		//弹出层隐藏
		popupShow() {
			uni.navigateBack({
				url: '-1'
			});
		},
		// 请求数据
		getDate(e, img = null) {
			this.bgImg = img;
			this.$api.getDetail(e).then(res => {
				this.date = res.data;
			});
			this.$api.getsSubject(e).then(res => {
				this.numList = res.data.eps;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../static/css/popupPage.scss';
</style>
