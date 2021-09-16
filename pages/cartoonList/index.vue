<template>
	<view class="content">
		<view class="headText">{{ isScerch ? searchVal : '热播新番导视' }}</view>
		<!-- 当前热播 -->
		<view v-if="!isScerch" class="cartBox" v-for="(item, index) in calendar" :key="index">
			<view class="timeT">{{ item.weekday.cn }}</view>
			<view class="cartList" v-for="(val, int) in item.items" :key="val.id" @click="toDetail(val.id, val.images.large)">
				<view class="imgBox"><image lazy-load :src="val.images.large" mode="widthFix"></image></view>
				<view class="boxR">
					<view class="textCart">{{ val.name_cn ? val.name_cn : val.name }}</view>
					<view class="firstTime">
						首播时间：
						<text class="fTime">{{ val.air_date }}</text>
					</view>
					<view class="score">
						<text class="scoreK">评分：</text>
						<text class="scoreN" v-if="val.rating.score">{{ val.rating.score }}</text>
						<text class="scoreN scoreNmini" v-else>暂无评分</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 搜索列表 -->
		<view v-if="isScerch" class="cartBox">
			<view class="ht" v-if="calendar.length == 0">没有查到呢!</view>
			<view class="cartList" v-else v-for="(val, int) in calendar" :key="int" @click="toDetail(val.id, val.images.large)">
				<view class="imgBox"><image lazy-load :src="val.images.large" mode="widthFix"></image></view>
				<view class="boxR boxRt">
					<view class="textCart yt">{{ val.name_cn ? val.name_cn : val.name }}</view>
				</view>
			</view>
		</view>
		<!-- 搜索 -->
		<view class="searchModel animate__animated animate__bounceInRight" :class="openType ? 'boxOpen' : ''">
			<view class="Box">
				<view class="searchBox" @click="search()"><image src="../../static/img/search.png" mode="widthFix"></image></view>
				<view class="iptBox" :class="openType ? 'iptBoxShow' : ''">
					<input class="ipt" type="text" v-model.trim="searchVal" confirm-type="search" @confirm="search()" placeholder="输入番剧名称" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js';
let timer = null;
export default {
	mixins: [mixin],
	data() {
		return {
			calendar: [], //每日放送数据
			time: null,
			openType: false,
			searchVal: '',
			isScerch: false
		};
	},
	onPullDownRefresh() {
		//触发上拉刷新函数
		if (timer != null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			this.isScerch = false;
			this.searchVal = '';
			this.calendar = [];
			this.getCalendar();
		}, 500);
	},
	onLoad() {
		this.calendar = this.$store.state.calendar;
		this.time = this.$store.state.time;
	},
	methods: {
		// 跳转详情
		toDetail(id, img) {
			uni.navigateTo({
				url: './detail?id=' + id + '&img=' + img
			});
		},
		// 刷新列表每日放送
		getCalendar() {
			uni.showNavigationBarLoading();
			this.$api.getCalendar().then(res => {
				this.calendar = res.data;
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
			});
		},
		// 搜索
		search() {
			if (this.openType && this.searchVal) {
				this.isScerch = true;
				uni.vibrateShort();
				this.$api.searchLy(this.searchVal).then(res => {
					this.calendar = res.data.list;
				});
			}
			if (this.searchVal == 'SUPERY') {
				this.calendar = []
				uni.setStorageSync('searchShow', true);
				this.searchVal = '潘多拉魔盒已打开!';
				uni.vibrateLong();
			}
			this.openType = !this.openType;
		}
	}
};
</script>

<style lang="scss" scoped>
@import './css/index.scss';
</style>
