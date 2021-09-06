<template>
	<view class="container">
		<image class="img" 
		:style="rotate"
		src="../../static/img/bgImg.png"></image>
		<view class="demo">
			{{x}}
		</view>
	</view>
</template>

<script>
	import {mixin} from '../../static/js/mixin.js'
	export default {
		mixins:[mixin],
		data() {
			return {
				// x:0,
				// y:0,
			}
		},
		computed:{
			// rotate(){
			// 	let num = this.x.toFixed(2)*4
			// 	return "transform: translateX("+num+"rpx)"
			// }
		},
		onLoad(e) {
			// this.move()
		},
		methods: {
			// move(){
			// 	uni.startDeviceMotionListening({
			// 		interval: 'ui',
			// 	});
			// 	uni.onDeviceMotionChange((result) => {
			// 		var xVal = -(result.gamma).toFixed(2)/5;
			// 		var yVal = -(result.beta - 30).toFixed(2)/5;
			// 		this.x = xVal > 10 ? 10 : (xVal < -10 ? -10 : xVal)
			// 		this.y = yVal > 10 ? 10 : (yVal < -10 ? -10 : yVal)
			// 	})
			// }
		}
	}
</script>

<style lang="scss" scoped>
.container{
	width: 100%;
	height: 100vh;
	display:flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
// 	perspective: 500px;
}
.img{
	height: 700rpx;
	width: 500rpx;
	margin: 40rpx auto;
	// position: relative;
	box-shadow: 0rpx 0rpx 20rpx #000000;
}
.demo{
	position:absolute;
	top: 30px;
	left: 0px;
}
</style>