export default {
	created() {
		if (this.type === 'message') {
			// 不显示遮罩
			this.maskShow = false 
			// 获取子组件对象
			this.childrenMsg = null
		}
	},
	methods: {
		customOpen() {
			if (this.childrenMsg && typeof this.childrenMsg.open === 'function') {
				this.childrenMsg.open()
			}
		},
		customClose() {
			if (this.childrenMsg && typeof this.childrenMsg.close === 'function') {
				this.childrenMsg.close()
			}
		}
	}
}
