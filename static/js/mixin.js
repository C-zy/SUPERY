// 全局调用文件，打开小程序时执行，获取后台设置的全局参数在需要的页面进行引用
export const mixin={
    data() {
        return {
			mixinBg:uni.getStorageSync('timColor').bgC,//#222831
			// 图片
			// bgImg:'https://mmbiz.qpic.cn/mmbiz_png/1vTZx1SXKg5dMQMuP25MchlHFG7JCtGHVhbMD5e9n5ug1kFzYfMLN1gOgcfD3VpHxcucqONYNjWjP2TRR0icqmw/0?wx_fmt=png',
			bgImg:'../../static/img/bgImg.png',
			// 颜色
			bgColor1:'#d1c145',
			bgColor2:'#f9fcfb',
			bgColor3:'#30475e',
			// 数据
			calendar:null,
			// 插画
			ikon1:'https://mmbiz.qpic.cn/mmbiz_png/1vTZx1SXKg6ibZvJ3Hy6mibwb9cmxMAVgjG8RfjohRnChQa5Lkiby4WFGDTwTQkr897oUpib34GOqerYiawGcXJAxCA/0?wx_fmt=png',
			ikon2:'https://mmbiz.qpic.cn/mmbiz_png/1vTZx1SXKg6ibZvJ3Hy6mibwb9cmxMAVgjCgTUvu0RIYdL96ncbC7B7tSIWmXmUNtY53mJicHZDxEVcY6TILte9pQ/0?wx_fmt=png',
			ikon3:'https://mmbiz.qlogo.cn/mmbiz_png/1vTZx1SXKg6ibZvJ3Hy6mibwb9cmxMAVgj6ibBGE9kibXBTppVicVgKprOniaAFCO9EYazXqZrvKL1glyCpha70RIzbg/0?wx_fmt=png',
			ikon4:'https://mmbiz.qpic.cn/mmbiz_png/1vTZx1SXKg6ibZvJ3Hy6mibwb9cmxMAVgjwUulrSFg8xVpbQriaJJVqC9qia0rAaVsibWEaMSPrrs7TblnKKyp8JLqw/0?wx_fmt=png',
			ikon5:'https://mmbiz.qpic.cn/mmbiz_png/1vTZx1SXKg6ibZvJ3Hy6mibwb9cmxMAVgjrwbbDGiblj2vyLMgv5e75vfY9ODiaoqMcBdFr7oQD6rstFPo1qeCicKPQ/0?wx_fmt=png',
			ikon6:'https://mmbiz.qpic.cn/mmbiz_png/1vTZx1SXKg6ibZvJ3Hy6mibwb9cmxMAVgj6b9wUGlLYvuXAMujXibu7voLSQ4dDYsndOnMkygMrKDLcyjty1kLWuQ/0?wx_fmt=png',
			ikon7:'',
			ikon8:'',
			ikon9:'',
        }
    },
    methods: {
		
	}
}