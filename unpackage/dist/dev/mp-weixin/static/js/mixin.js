// 全局调用文件，打开小程序时执行，获取后台设置的全局参数在需要的页面进行引用
export const mixin={
    data() {
        return {
			mixinBg:uni.getStorageSync('timColor').bgC,//#222831
        }
    },
    methods: {
		
	}
}