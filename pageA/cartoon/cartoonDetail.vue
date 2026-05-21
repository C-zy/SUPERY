<template>
	<view class="content">
		<!-- 背景图 -->
		<image :src="bgImg" class="bgImg"></image>
		<!-- 顶部 -->
		<scroll-view v-if="date" class="scrollBox" scroll-y="true">
			<view class="headImgBox"><image :src="bgImg" mode="widthFix"></image></view>
			<view class="textBox">
				<view class="score">
					<text class="scoreK" style="font-weight: bold;">{{date.name}}</text>
				</view>
				<view class="airTime">
					<text class="airTimeK">作者：</text>
					<text class="airTimeN">{{ date.author }}</text>
				</view>
				<view class="airTime">
					<text class="airTimeK">地区：</text>
					<text class="airTimeN">{{ date.region }}</text>
				</view>
				<view class="airTime">
					<text class="airTimeK">语言：</text>
					<text class="airTimeN">{{ date.language }}</text>
				</view>
				<view class="airTime">
					<text class="airTimeK">状态：</text>
					<text class="airTimeN">{{ date.state }}</text>
				</view>
				<view class="abstract">
					<text>简介：{{ date.remarks == '' ? '暂无简介' : date.remarks }}</text>
				</view>
			</view>
			<!-- 集数 -->
			<view class="numListBox">
				<view class="numBox" v-for="(item, index) in numList" :key="index" @click="openPDF(item.path)">
					{{ item.name }}
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
import { mixin } from '../../static/js/mixin.js'

export default {
	mixins: [mixin],
	data() {
		return {
			isPopup: true,
			date: null,
			bgImg: null,
			numList: []
		}
	},
	onLoad() {
		const data = JSON.parse(uni.getStorageSync('pageData'))
		this.date = data
		this.bgImg = data.img
		this.getDate()
	},
	methods: {
		popupShow() {
			uni.navigateBack({
				url: '-1'
			})
		},
		getDate() {
			this.$api.getCartoonDetail({ id: this.date.id }).then(res => {
				this.numList = res.data
			}).catch(() => {})
		},
		openPDF() {}
	}
}
</script>

<style lang="scss" scoped>
@import '../../static/css/popupPage.scss';
</style>
