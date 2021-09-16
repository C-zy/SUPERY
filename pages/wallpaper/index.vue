<template>
	<!-- 壁纸主页 -->
	<view class="container">
		<!-- 主体 -->
		<view class="wallpaperBox">
			<view class="imgBox" v-for="(item, index) in dataList" :key="index">
				<image :src="Pimg + item.image_urls.medium" mode="aspectFill" @click="toDetail(item)" class="img" :class="item.tags[0].name == 'R-18' ? 'filterLy' : ''"></image>
				<view class="tagBox">
					<view class="tag" v-if="item.title">@{{ item.title }}</view>
					<view class="tag" v-if="item.tags[0].name">#{{ item.tags[0].name }}</view>
				</view>
			</view>
		</view>
		<!-- 搜索 -->
		<view v-if="searchShow" class="searchModel animate__animated animate__bounceInRight" :class="openType ? 'boxOpen' : ''">
			<view class="Box">
				<view class="searchBox" @click="search()"><image src="../../static/img/search.png" mode="widthFix"></image></view>
				<view class="iptBox" :class="openType ? 'iptBoxShow' : ''">
					<input class="ipt" type="text" v-model.trim="searchVal" confirm-type="search" @confirm="search()" placeholder="输入老婆名称" placeholder-style="fontSize=28rpx" />
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
			dataList: [],
			parame: {
				type: 'rank',
				page: 1
			},
			openType: false,
			searchVal: '',
			searchShow: uni.getStorageSync('searchShow')
		};
	},
	onPullDownRefresh() {
		//触发上拉刷新函数
		if (timer != null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			this.parame = {
				type: 'rank',
				page: 1
			};
			this.dataList = [];
			this.getImgList();
		}, 500);
	},
	onReachBottom() {
		//监听页面触底函数
		if (timer != null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			this.parame.page++;
			this.getImgList();
		}, 500);
	},
	onLoad(e) {
		uni.startPullDownRefresh();
	},
	methods: {
		// 获取数据
		getImgList() {
			uni.showNavigationBarLoading(); //导航栏显示加载动画
			let parame = this.parame;
			this.$api.Pixiv1(parame).then(res => {
				this.dataList = [...this.dataList, ...res.data.illusts];
				uni.hideNavigationBarLoading(); //导航栏停止加载动画
				uni.stopPullDownRefresh();
			});
		},
		// 跳转详情
		toDetail(e) {
			this.base64Img(e.image_urls.medium).then(res => {
				uni.setStorageSync('imgPageBg', res);
				uni.setStorageSync('pageData', JSON.stringify(e));
				uni.navigateTo({
					url: `./detail`
				});
			});
		},
		// 搜索
		search() {
			if (this.openType && this.searchVal) {
				this.parame = {
					page: 1,
					type: 'search',
					per_page: 12,
					word: this.searchVal
				};
				this.searchVal = '';
				this.dataList = [];
				this.getImgList();
				uni.vibrateShort();
			}
			this.openType = !this.openType;
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
	.wallpaperBox {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding: 0 20rpx;
		box-sizing: border-box;
		.imgBox {
			width: 48%;
			height: 500rpx;
			border-radius: 10rpx;
			margin: 10rpx 1%;
			background-color: rgba($color: #777, $alpha: 0.5);
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			.tagBox {
				position: absolute;
				bottom: 0rpx;
				width: 100%;
				.tag {
					color: #fff;
					font-size: 26rpx;
					display: inline-block;
					padding: 4rpx 6rpx;
					background-color: rgba($color: #30475e, $alpha: 0.6);
					margin: 10rpx;
					border-radius: 2px;
					max-width: 38%;
					opacity: 0.8;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
	}
}
// 搜索
.searchModel {
	width: 100%;
	position: fixed;
	width: 100%;
	bottom: 100rpx;
	transition: 0.4s;
	.Box {
		height: 100rpx;
		position: relative;
		.searchBox {
			width: 100rpx;
			height: 100rpx;
			box-sizing: border-box;
			background-color: #30475e;
			opacity: 0.8;
			border-radius: 50rpx;
			position: absolute;
			right: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 3;
			image {
				width: 50rpx;
				height: 50rpx;
			}
		}
		.iptBox {
			width: 100rpx;
			height: 100rpx;
			box-sizing: border-box;
			background-color: #30475e;
			border-radius: 50rpx;
			z-index: 2;
			transition: 0.4s;
			overflow: hidden;
			position: absolute;
			right: 60rpx;
			opacity: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 40rpx;
			.ipt {
				width: 100%;
				color: #fff;
			}
		}
		.iptBoxShow {
			opacity: 0.9;
			width: 68%;
			right: 26%;
		}
	}
}
.boxOpen {
	bottom: 60%;
}
.filterLy {
	filter: blur(8px);
}
</style>
