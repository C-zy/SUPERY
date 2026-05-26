<template>
  <view class="container" :class="{ submitted: isSubmitted }">
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-inner">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="title">意见反馈</view>
        <view class="back-btn placeholder"></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content" v-if="!isSubmitted">
      <!-- 反馈内容卡片 -->
      <view class="card-box animate-card" :class="{ 'card-show': showCard }" :style="{ animationDelay: '0.1s' }">
        <view class="section-label">反馈内容</view>
        <textarea
          class="feedbackTextarea"
          v-model="content"
          placeholder="请详细描述您遇到的问题或建议，或者想要新增的一些功能，我们会认真对待每一条反馈..."
          :maxlength="500"
          :auto-height="true"
        />
        <view class="charCount" :class="{ 'limit-warn': content.length >= 480 }">
          {{ content.length }}/500
        </view>
      </view>

      <!-- 图片上传卡片 -->
      <view class="card-box animate-card" :class="{ 'card-show': showCard }" :style="{ animationDelay: '0.2s' }">
        <view class="section-label">添加图片（可选）</view>
        <view class="image-grid">
          <!-- 已选图片列表 -->
          <view
            class="image-item"
            v-for="(img, index) in imageList"
            :key="index"
            :class="{ 'image-item-show': img.show }"
          >
            <image :src="img.path" mode="aspectFill" class="image-preview" @click="previewImage(index)" />
            <view class="image-remove" @click.stop="removeImage(index)">
              <text class="remove-icon">×</text>
            </view>
          </view>
          <!-- 添加图片按钮 -->
          <view
            class="image-add"
            v-if="imageList.length < 5"
            @click="chooseImage"
            :class="{ 'add-bounce': addBounce }"
          >
            <text class="add-icon">+</text>
            <text class="add-text">{{ imageList.length }}/5</text>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="btnGroup animate-card" :class="{ 'card-show': showCard }" :style="{ animationDelay: '0.3s' }">
        <view
          class="btnBox"
          hover-class="hover"
          @click="submitFeedback"
          :class="{ loading: isSubmitting, disabled: !canSubmit }"
        >
          <view class="btn-loading" v-if="isSubmitting">
            <view class="btn-dot" v-for="n in 3" :key="n" :style="{ animationDelay: n * 0.15 + 's' }"></view>
          </view>
          <text v-else>提交反馈</text>
        </view>
      </view>
    </view>

    <!-- 提交成功页面 -->
    <view class="success-page" v-if="isSubmitted">
      <view class="success-icon-wrap animate-success">
        <view class="success-circle"></view>
        <view class="success-check"></view>
      </view>
      <view class="success-title animate-fadeup" :style="{ animationDelay: '0.3s' }">感谢您的反馈</view>
      <view class="success-desc animate-fadeup" :style="{ animationDelay: '0.5s' }">我们会认真处理您的每一条意见</view>
      <view class="success-btn animate-fadeup" :style="{ animationDelay: '0.7s' }" @click="resetForm">
        <text>继续反馈</text>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/api/index.js";

const MAX_IMAGES = 5;

export default {
  data() {
    return {
      statusBarHeight: 0,
      content: "",
      imageList: [],
      isSubmitting: false,
      isSubmitted: false,
      showCard: false,
      addBounce: false,
      submitDebounceTimer: null,
    };
  },
  computed: {
    canSubmit() {
      return this.content.trim().length > 0 && !this.isSubmitting;
    },
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    setTimeout(() => {
      this.showCard = true;
    }, 100);
  },
  methods: {
    getTodayKey() {
      const now = new Date();
      return `feedback_count_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    },
    getTodaySubmitCount() {
      const key = this.getTodayKey();
      return uni.getStorageSync(key) || 0;
    },
    incrementSubmitCount() {
      const key = this.getTodayKey();
      const count = this.getTodaySubmitCount() + 1;
      uni.setStorageSync(key, count);
      return count;
    },
    canSubmitToday() {
      return this.getTodaySubmitCount() < 3;
    },
    goBack() {
      uni.vibrateShort();
      uni.navigateBack({ delta: 1 });
    },

    chooseImage() {
      const remain = MAX_IMAGES - this.imageList.length;
      if (remain <= 0) return;

      uni.chooseImage({
        count: remain,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          res.tempFilePaths.forEach((path) => {
            this.imageList.push({ path, show: false });
            const idx = this.imageList.length - 1;
            setTimeout(() => {
              if (this.imageList[idx]) {
                this.imageList[idx].show = true;
              }
            }, 50);
          });
          uni.vibrateShort();
          this.triggerAddBounce();
        },
      });
    },

    previewImage(index) {
      const urls = this.imageList.map((img) => img.path);
      uni.previewImage({
        current: index,
        urls,
      });
    },

    removeImage(index) {
      uni.vibrateShort();
      this.imageList.splice(index, 1);
    },

    triggerAddBounce() {
      this.addBounce = true;
      setTimeout(() => {
        this.addBounce = false;
      }, 400);
    },

    async submitFeedback() {
      if (this.submitDebounceTimer) return;
      if (!this.canSubmit) return;
      if (!this.canSubmitToday()) {
        uni.showToast({ title: "今日提交次数已用完，请明天再来", icon: "none" });
        return;
      }

      this.submitDebounceTimer = setTimeout(() => {
        this.submitDebounceTimer = null;
      }, 2000);
      this.isSubmitting = true;

      try {
        let imageUrls = [];

        if (this.imageList.length > 0) {
          uni.showLoading({ title: "上传图片中...", mask: true });
          for (let i = 0; i < this.imageList.length; i++) {
            const res = await api.uploadImage(this.imageList[i].path, {
              image_type: "feedback",
              description: "反馈图片",
            });
            if (res.data && res.data.image_url) {
              imageUrls.push(res.data.image_url);
            }
          }
          uni.hideLoading();
          uni.showLoading({ title: "提交中...", mask: true });
        } else {
          uni.showLoading({ title: "提交中...", mask: true });
        }

        await api.submitFeedback({
          content: this.content.trim(),
          images: imageUrls.length > 0 ? imageUrls : undefined,
        });

        this.incrementSubmitCount();
        uni.hideLoading();
        this.isSubmitted = true;
        uni.vibrateShort();
      } catch (err) {
        uni.hideLoading();
        console.error("提交反馈失败:", err);
        if (this.submitDebounceTimer) {
          clearTimeout(this.submitDebounceTimer);
          this.submitDebounceTimer = null;
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      uni.vibrateShort();
      this.content = "";
      this.imageList = [];
      this.isSubmitted = false;
      this.showCard = false;
      setTimeout(() => {
        this.showCard = true;
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, rgb(12, 104, 188), rgb(20, 130, 210));
  flex-shrink: 0;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.placeholder {
    visibility: hidden;
  }
}

.back-icon {
  font-size: 52rpx;
  color: #fff;
  font-weight: 300;
  line-height: 1;
}

.title {
  font-size: 36rpx;
  color: #ffffff;
  text-align: center;
}

.content {
  flex: 1;
  padding: 30rpx 30rpx 60rpx;
}

.card-box {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-sizing: border-box;
  margin-bottom: 30rpx;
  opacity: 0;
  transform: translateY(40rpx);
}

.feedbackTextarea {
  width: 100%;
  min-height: 240rpx;
  padding: 24rpx;
  background-color: #f5f7fa;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  line-height: 1.6;
  border: 2rpx solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: rgba(12, 104, 188, 0.3);
    box-shadow: 0 0 0 4rpx rgba(12, 104, 188, 0.08);
  }
}

.charCount {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 10rpx;
  transition: color 0.3s;

  &.limit-warn {
    color: #e74c3c;
  }
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
  opacity: 0;
  transform: scale(0.8);
}

.image-item-show {
  animation: imagePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes imagePop {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.image-preview {
  width: 100%;
  height: 100%;
}

.image-remove {
  position: absolute;
  top: 0;
  right: 0;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 16rpx 0 16rpx;
  transition: background 0.2s;

  &:active {
    background: rgba(231, 76, 60, 0.8);
  }
}

.remove-icon {
  font-size: 32rpx;
  color: #fff;
  line-height: 1;
}

.image-add {
  width: 200rpx;
  height: 200rpx;
  border: 4rpx dashed rgba(12, 104, 188, 0.4);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(12, 104, 188, 0.03);
  transition: all 0.3s;

  &:active {
    background-color: rgba(12, 104, 188, 0.08);
    border-color: rgb(12, 104, 188);
  }
}

.add-bounce {
  animation: addBounceAnim 0.4s ease;
}

@keyframes addBounceAnim {
  0% { transform: scale(1); }
  30% { transform: scale(0.9); }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.add-icon {
  font-size: 72rpx;
  color: rgb(12, 104, 188);
  line-height: 1;
  font-weight: 300;
}

.add-text {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.btnGroup {
  width: 100%;
  margin-top: 10rpx;
  opacity: 0;
  transform: translateY(40rpx);
}

.success-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 40rpx;
}

.success-icon-wrap {
  width: 160rpx;
  height: 160rpx;
  position: relative;
  margin-bottom: 50rpx;
}

.success-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgb(12, 104, 188), rgb(20, 130, 210));
  position: absolute;
  top: 0;
  left: 0;
  animation: circleScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes circleScale {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.success-check {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50rpx;
  height: 80rpx;
  border-right: 8rpx solid #fff;
  border-bottom: 8rpx solid #fff;
  transform: translate(-60%, -55%) rotate(40deg);
  opacity: 0;
  animation: checkDraw 0.35s 0.35s ease forwards;
}

@keyframes checkDraw {
  0% { opacity: 0; height: 0; }
  100% { opacity: 1; height: 80rpx; }
}

.success-title {
  font-size: 40rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.success-desc {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 60rpx;
}

.animate-fadeup {
  opacity: 0;
  transform: translateY(30rpx);
  animation: fadeUp 0.5s ease forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-btn {
  width: 280rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid rgb(12, 104, 188);
  border-radius: 40rpx;
  color: rgb(12, 104, 188);
  font-size: 30rpx;
  transition: all 0.3s;

  &:active {
    background-color: rgb(12, 104, 188);
    color: #fff;
  }
}
</style>
