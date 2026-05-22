<script>
export default {
  onLaunch: function () {
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
/* page { */
  /* background-color: #30475e; */
/* } */
</style>
