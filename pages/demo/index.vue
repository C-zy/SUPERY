<template>
	<view class="container">
		<view class="searchModel" :class="openType ? 'boxOpen':''">
			<view class="Box">
				<view class="searchBox" @click="demo()">
					<image src="../../static/img/search.png" mode="widthFix"></image>
				</view>
				<view class="iptBox" :class="openType ? 'iptBoxShow': ''">
					<input class="ipt" type="text" v-model.trim="searchVal" placeholder='输入老婆名称' />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js';
export default {
	mixins: [mixin],
	data() {
		return {
			openType:false,
			searchVal:'',
		};
	},
	computed: {},
	onLoad(e) {},
	methods: {
		demo() {
			if(this.openType && this.searchVal){
				this.searchVal = ''
			}
			this.openType = !this.openType;
		},
	}
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	.searchModel{
		width: 100%;
		position: fixed;
		width: 100%;
		bottom: 100rpx;
		transition: .4s;
		.Box{
			height: 100rpx;
			position: relative;
			.searchBox{
				width: 100rpx;
				height: 100rpx;
				box-sizing: border-box;
				background-color: #30475e;
				opacity: .8;
				border-radius: 50rpx;
				position: absolute;
				right: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				z-index: 3;
				image{
					width: 50rpx;
					height: 50rpx;
				}
			}
			.iptBox{
				width: 100rpx;
				height: 100rpx;
				box-sizing: border-box;
				background-color: #30475e;
				opacity: .8;
				border-radius: 50rpx;
				z-index: 2;
				transition: .4s;
				overflow: hidden;
				position: absolute;
				right: 60rpx;
				opacity: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 40rpx;
				.ipt{
					width: 100%;
					color: #fff;
				}
			}
			.iptBoxShow{
				opacity: .8;
				width: 68%;
				right: 26%;
			}
		}
	}
	.boxOpen{
		bottom: 80%;
	}
}
</style>
