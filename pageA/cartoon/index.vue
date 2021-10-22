<template>
	<view class="content">
		<view class="cartBox">
			<view class="cartList" v-for="(item,index) in cartoonList" :key='index' @click="toDetail(item)">
				<view class="imgBox"><image lazy-load :src="item.img" mode="widthFix"></image></view>
				<view class="boxR">
					<view class="textCart">{{item.name}}</view>
					<view class="firstTime">
						状态：
						<text class="fTime" :class="item.state=='连载中'?'':'col-1'">{{item.state}}</text>
					</view>
					<view class="firstTime">
						语言：
						<text :class="item.language=='中文'?'fTime':'col-2'">{{item.language}}</text>
					</view>
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
			img:'https://supery.work/static/img/booksCover/202109002.png',
			cartoonList:[],
		};
	},
	onPullDownRefresh() {
		//触发上拉刷新函数
		if (timer != null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			this.getCartoonList()
		}, 500);
	},
	onLoad() {
		this.getCartoonList()
	},
	methods: {
		// 获取漫画列表
		getCartoonList(){
			uni.showNavigationBarLoading();
			this.$api.getCartoon().then(res => {
				this.cartoonList = res.data
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
			});
		},
		// 跳转详情
		toDetail(val) {
			uni.setStorageSync('pageData', JSON.stringify(val));
			uni.navigateTo({
				url: './cartoonDetail'
			});
		},
	}
};
</script>

<style>
page {
	background-color: #30475e;
}
</style>
<style lang="scss" scoped>
@import './css/index.scss';
</style>
