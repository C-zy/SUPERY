<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="title">记录</view>
    </view>
    <scroll-view 
      class="content-wrapper" 
      scroll-y 
      @scrolltolower="loadMore"
      :lower-threshold="100"
    >
      <view class="content">
        <view v-if="imageList.length === 0" class="empty-state">
          暂无记录
        </view>
        <view v-else class="image-list">
          <view 
            v-for="(item, index) in imageList" 
            :key="item.id" 
            class="image-item"
          >
            <image 
              :src="item.image_url" 
              class="item-image" 
              mode="aspectFit"
              lazy-load
              @longpress="showActionSheet(item)"
            />
            <view class="item-time">{{ formatTime(item.created_at) }}</view>
          </view>
        </view>
        <view v-if="loading" class="loading-more">
          加载中...
        </view>
        <view v-if="noMore" class="no-more">
          没有更多了
        </view>
      </view>
    </scroll-view>
    <view class="footer" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view 
        class="footer-item" 
        :class="btnAnimation"
        @click="handleBtnClick"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <view class="footer-item-text">返回</view>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/api/index.js";

export default {
  data() {
    return {
      statusBarHeight: 0,
      safeAreaBottom: 0,
      imageList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      noMore: false,
      btnAnimation: ''
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    if (systemInfo.safeAreaInsets) {
      this.safeAreaBottom = systemInfo.safeAreaInsets.bottom || 0;
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.loading || this.noMore) return;
      
      this.loading = true;
      try {
        const res = await api.getAiImageList({
          image_type: 'gundam_ai',
          page: this.page,
          pageSize: this.pageSize
        });
        
        if (res.data && res.data.list) {
          if (this.page === 1) {
            this.imageList = res.data.list;
          } else {
            this.imageList = [...this.imageList, ...res.data.list];
          }
          this.total = res.data.total || 0;
          
          if (this.imageList.length >= this.total) {
            this.noMore = true;
          }
        }
      } catch (err) {
        console.error('加载失败:', err);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      if (!this.noMore && !this.loading) {
        this.page++;
        this.loadData();
      }
    },
    formatTime(timeStr) {
      if (!timeStr) return '';
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    handleBtnClick() {
      this.btnAnimation = 'animate__animated animate__rubberBand';
      setTimeout(() => {
        this.btnAnimation = '';
        uni.vibrateShort();
        uni.navigateBack();
      }, 500);
    },
    handleTouchStart() {
      this.btnAnimation = 'animate__animated animate__rubberBand';
    },
    handleTouchEnd() {
      this.btnAnimation = '';
    },
    showActionSheet(item) {
      uni.showActionSheet({
        itemList: ['保存图片', '分享'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.saveImage(item.image_url);
          } else if (res.tapIndex === 1) {
            this.shareImage(item.image_url);
          }
        }
      });
    },
    saveImage(imageUrl) {
      if (!imageUrl) return;

      uni.showLoading({
        title: '保存中...',
        mask: true
      });

      // 处理Base64格式的图片
      if (imageUrl.startsWith('data:')) {
        const fs = wx.getFileSystemManager();
        const filePath = `${wx.env.USER_DATA_PATH}/ai_result_${Date.now()}.png`;
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');

        fs.writeFile({
          filePath,
          data: base64Data,
          encoding: 'base64',
          success: () => {
            this.saveToAlbum(filePath);
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        });
      } 
      // 处理URL格式的图片
      else {
        uni.downloadFile({
          url: imageUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              this.saveToAlbum(res.tempFilePath);
            } else {
              uni.hideLoading();
              uni.showToast({
                title: '下载失败',
                icon: 'none'
              });
            }
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({
              title: '下载失败',
              icon: 'none'
            });
          }
        });
      }
    },
    // 保存到相册
    saveToAlbum(filePath) {
      uni.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          uni.hideLoading();
          uni.showToast({
            title: '已保存到相册',
            icon: 'success'
          });
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          });
        }
      });
    },
    shareImage(imageUrl) {
      // 分享功能，这里可以根据实际需求实现
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: rgb(12, 104, 188);
  display: flex;
  flex-direction: column;
}

.header {
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.content-wrapper {
  // flex: 1;
  padding: 20rpx 30rpx;
  height: 80vh;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 50rpx;
  width: 94%;
  margin: 0 auto;
  margin-top: 20rpx;
}

.content {
  width: 100%;
  min-height: 80vh;
  padding: 30rpx;
  box-sizing: border-box;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.image-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.image-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.item-image {
  width: 100%;
  min-height: 300rpx;
  max-height: 600rpx;
  border-radius: 20rpx;
  background-color: #f5f5f5;
}

.item-time {
  font-size: 24rpx;
  color: #999;
  text-align: center;
}

.loading-more,
.no-more {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 26rpx;
}

.footer {
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.footer-item {
  width: 100%;
  height: 80rpx;
  background-color: #ffffff;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-item-text {
  font-size: 30rpx;
  font-weight: bold;
  color: #1e88e5;
}
</style>
