<template>
	<view class="container">
		<view class="" @click="demo()">123</view>
		<div class="eva-warning"><p class="eva-warning__message">alert</p></div>
	</view>
</template>

<script>
import { mixin } from '../../static/js/mixin.js';
export default {
	mixins: [mixin],
	data() {
		return {
			strArr: []
		};
	},
	computed: {},
	onLoad(e) {},
	methods: {
		demo() {}
	}
};
</script>

<style lang="scss" scoped>
.container {
	// height: 100vh;
}
$border: dotted 10rpx black;
.eva-warning {
	width: 300rpx;
	margin-top: 10%;
	background-color: red;
	overflow: hidden;
	box-shadow: 0 0 10px black;
	opacity: 0.75;
	transform: rotate(-45deg);

	&:before,
	&:after {
		float: left;
		clear: both;
		content: ' ';
		width: 100%;
		background-color: red;
		box-shadow: 0 0 0 1px black;
	}

	&:before {
		border-top: $border;
		transform: skew(-50deg);
		padding-bottom: 1px;
	}

	&:after {
		border-bottom: $border;
		transform: skew(50deg);
		padding-top: 1px;
	}
}

.eva-warning__message {
	margin: 0;
	padding: 0;
	text-align: center;
	text-transform: uppercase;
	font-weight: bold;
	font-family: Arial, Helvetica;
	font-size: 25rpx;
	animation: blink 2s infinite;
}

@keyframes blink {
	25% {
		color: transparent;
		background-color: red;
	}
	50% {
		background-color: black;
	}
}
</style>
