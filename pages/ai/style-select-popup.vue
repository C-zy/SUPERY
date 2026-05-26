<template>
  <uni-popup ref="popup" type="bottom" :mask-click="true" @change="onPopupChange">
    <view class="style-popup">
      <view class="style-popup-header">
        <view class="style-popup-title">选择风格</view>
        <view class="style-popup-close" @click="close">✕</view>
      </view>
      <scroll-view class="style-popup-scroll" scroll-y>
        <view class="style-popup-list">
          <view
            class="style-popup-item"
            :class="[
              { active: selectedIndex === index },
              showAnimate ? 'animate__animated animate__fadeIn' : ''
            ]"
            :style="{ animationDelay: showAnimate ? (index * 0.06) + 's' : '0s' }"
            v-for="(item, index) in styleOptions"
            :key="index"
            @click="selectStyle(index)"
          >
            <image :src="item.image" mode="aspectFill" class="style-popup-item-img" />
            <view class="style-popup-item-name">{{ item.name }}</view>
          </view>
        </view>
      </scroll-view>
      <view class="style-popup-footer"></view>
    </view>
  </uni-popup>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";

export default {
  name: "StyleSelectPopup",
  components: {
    uniPopup,
  },
  props: {
    // 风格选项数组
    styleOptions: {
      type: Array,
      default: () => [],
    },
    // 当前选中的索引
    selectedIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showAnimate: false,
      animateTimer: null,
    };
  },
  methods: {
    open() {
      this.showAnimate = false;
      this.$refs.popup.open();
      this.$nextTick(() => {
        clearTimeout(this.animateTimer);
        this.animateTimer = setTimeout(() => {
          this.showAnimate = true;
        }, 100);
      });
    },
    close() {
      uni.vibrateShort();
      this.showAnimate = false;
      this.$refs.popup.close();
    },
    selectStyle(index) {
      this.$emit("select", index);
      this.close();
    },
    // 弹窗状态改变
    onPopupChange(e) {
      this.$emit("change", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.style-popup {
  background-color: #fff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 40rpx 30rpx 0;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
}

.style-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
  flex-shrink: 0;
}

.style-popup-title {
  font-size: 36rpx;
  // font-weight: bold;
  color: rgb(12, 104, 188);
}

.style-popup-close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
  line-height: 1;
}

.style-popup-scroll {
  flex: 1;
  max-height: 55vh;
  overflow-y: auto;
}

.style-popup-list {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 20rpx;
  box-sizing: border-box;
}

.style-popup-item {
  width: calc((100% - 32rpx) / 3);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20rpx;
  overflow: hidden;
  border: 3rpx solid transparent;
  background-color: #f9fafb;
  transition: all 0.3s;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}

.style-popup-item:nth-child(3n) {
  margin-right: 0;
}

.style-popup-item.active {
  border-color: rgb(12, 104, 188);
  background-color: rgba(12, 104, 188, 0.05);
}

.style-popup-item-img {
  width: 100%;
  height: 260rpx;
  border-radius: 20rpx 20rpx 0 0;
}

.style-popup-item-name {
  padding: 18rpx 12rpx;
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
}

.style-popup-item.active .style-popup-item-name {
  color: rgb(12, 104, 188);
  font-weight: 600;
}

.style-popup-footer {
  height: calc(constant(safe-area-inset-bottom) + 30rpx);
  height: calc(env(safe-area-inset-bottom) + 30rpx);
  flex-shrink: 0;
}
</style>
