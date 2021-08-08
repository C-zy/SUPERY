<template>
	<web-view :src="webView"></web-view>
</template>

<script>
	import {mixin} from '../../static/js/mixin.js'
	export default {
		mixins:[mixin],
		data() {
			return {
				webView:'https://aidn.jp/mikutap/'
			}
		},
		onLoad(e) {
		},
		methods: {
		}
	}
</script>