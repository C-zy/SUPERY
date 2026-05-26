<script>
import { loadAppFont } from '@/common/loadFont.js'

export default {
  onLaunch: function () {
    loadAppFont()
      .then(() => console.log('字体加载成功'))
      .catch((err) => console.error('字体加载失败', err));
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  methods: {
    getTime() {
      const hour = new Date().getHours()
      const isDay = hour >= 7 && hour <= 19
      const timColor = {
        bgC: isDay ? 'background-color: #839b97' : 'background-color: #222831'
      }
      uni.setStorageSync('timColor', timColor)
    }
  }
}
</script>

<style>
@import url("./static/css/animate.min.css");
@import url("./static/css/shared-animations.scss");

page,
view,
text,
navigator,
input,
textarea {
  font-family: 'AaJiJiaHei';
}
</style>
