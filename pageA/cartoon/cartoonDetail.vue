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
		let data = JSON.parse(uni.getStorageSync('pageData'));
		this.date = data
		this.bgImg = data.img
		this.getDate()
	},
	methods: {
		//弹出层隐藏
		popupShow() {
			uni.navigateBack({
				url: '-1'
			});
		},
		// 获取漫画详情
		getDate() {
			let par = {
				id:this.date.id
			}
			this.$api.getCartoonDetail(par).then(res => {
				this.numList = res.data;
			});
		},
		// 打开文件
		openPDF(e){
			// uni.setStorageSync('webView', e);
			// switch (uni.getSystemInfoSync().platform) {
			// 	case 'android':
			// 		console.log('运行Android上');
			// 		this.openReport(e);
			// 		break;
			// 	case 'ios':
			// 		console.log('运行iOS上');
			// 		uni.navigateTo({
			// 			url: '../webView/index'
			// 		});
			// 		break;
			// 	default:
			// 		console.log('运行在开发者工具上');
			// 		uni.navigateTo({
			// 			url: '../webView/index'
			// 		});
			// 		break;
			// }
		},
		openReport(url) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			wx.downloadFile({
				url: url,
				success: function(res) {
					console.log(res);
					uni.hideLoading();
					var filePath = res.tempFilePath;
					uni.showLoading({
						title: '正在打开',
						mask: true
					});
					wx.openDocument({
						filePath: filePath,
						fileType: 'pdf',
						success: function(res) {
							console.log(res);
							uni.hideLoading();
							console.log('打开文档成功');
						},
						fail: function(err) {
							uni.hideLoading();
							console.log('fail:' + JSON.stringify(err));
						}
					});
				},
				fail: function(err) {
					uni.hideLoading();
					console.log('fail:' + JSON.stringify(err));
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../static/css/popupPage.scss';
</style>
