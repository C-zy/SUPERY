<script>
	import {mixin} from './static/js/mixin.js'
	export default {
		mixins:[mixin],
		onLaunch: function() {
			console.log('App Launch')
			this.getTime()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:  {
			getTime(){
				let tim=new Date().getHours()
				let timColor={
					bgC:''
				}
				if(tim>='7' && tim<='19'){
					timColor.bgC='background-color: #839b97'
				}else{
					timColor.bgC='background-color: #222831'
				}
				console.log('获取当前时间',tim)
				uni.setStorageSync('timColor', timColor);
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./static/css/animate.min.css");
	.page{
		background-color: #30475e;
	}
</style>
