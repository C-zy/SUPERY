<template>
	<view class="container">
		123
	</view>
</template>

<script>
	import {mixin} from '../../static/js/mixin.js'
	export default {
		mixins:[mixin], 
		data() {
			return {
			}
		},
		onLoad() {
		},
		methods: {
			toDetil(e){
				console.log(e.id)
				this.$api.getsSubject(e.id).then(res => {
				   console.log(res,'成功') 
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		height: 100rpx;
		background-color: #d1c145;
	}
</style>