<template>
	<view class="container">
		<view class="" @click="demo()">123</view>
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js';
export default {
	mixins: [mixin],
	data() {
		return {
			userName:'yangyangyang',
			avatarUrl:'',
			strArr:[]
		};
	},
	computed: {},
	onLoad(e) {
		let str = 'yang yangyang'
	},
	methods: {
		demo() {
			uni.getUserProfile({
			 desc: "登录",
			 success: (res) => {
				 this.userName = res.userInfo.nickName
				 this.avatarUrl = res.userInfo.avatarUrl
				 console.log(res)
			 }
		 })
		},
	}
};
</script>

<style lang="scss" scoped>
.container {
	// height: 100vh;
}
</style>
