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
        <view class="time-notice">
          <view class="notice-icon">⏰</view>
          <view class="notice-text">当前记录仅显示 24 小时内的文件，超出时间将自动清除，请尽快保存至本地</view>
        </view>
        <view v-if="imageList.length === 0" class="empty-state">
          暂无记录
        </view>
        <view v-else class="image-list">
          <view 
            v-for="(item, index) in imageList" 
            :key="item.id" 
            class="image-item animate__animated animate__fadeInUp"
            :style="{ animationDelay: (index * 0.1) + 's' }"
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
        class="footer-item animate__animated animate__fadeInUp" 
        :class="btnAnimation"
        @click="handleBtnClick"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <view class="footer-item-text">返回</view>
      </view>
    </view>
    <canvas 
      canvas-id="shareCanvas" 
      class="share-canvas"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    />
    <!-- 分享海报预览 -->
    <view v-if="showSharePreview" class="share-preview-mask" @click="closeSharePreview">
      <view class="share-preview-box" @click.stop>
        <view class="share-preview-title">分享海报</view>
        <scroll-view scroll-y class="share-preview-scroll">
          <image
            v-if="sharePreviewPath"
            :src="sharePreviewPath"
            mode="widthFix"
            class="share-preview-img"
            show-menu-by-longpress
          />
        </scroll-view>
        <view class="share-preview-actions">
          <view class="share-action-btn" @click="saveSharePreview">保存图片</view>
          <view class="share-action-btn primary" @click="shareToFriend">发送给朋友</view>
          <view class="share-action-btn primary" @click="shareToTimeline">分享到朋友圈</view>
        </view>
        <view class="share-preview-close" @click="closeSharePreview">关闭</view>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/api/index.js";
import urlConfig from "@/common/config.js";

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
      btnAnimation: '',
      shareQrcodeUrl: '',
      currentShareItem: null,
      canvasWidth: 300,
      canvasHeight: 300,
      showSharePreview: false,
      sharePreviewPath: ''
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
            this.shareImage(item);
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
    shareImage(item) {
      this.currentShareItem = item;
      uni.showLoading({ title: '正在生成分享图...', mask: true });

      api.getShareQrcode({ page: 'pages/index/index', width: 200 })
        .then(async (res) => {
          if (res.err !== 0 || !res.data || !res.data.imageUrl) {
            uni.hideLoading();
            return uni.showToast({ title: '获取分享码失败', icon: 'none' });
          }

          this.shareQrcodeUrl = res.data.imageUrl;
          const host = urlConfig;
          const qrcodeUrl = this.shareQrcodeUrl.startsWith('http')
            ? this.shareQrcodeUrl
            : host + this.shareQrcodeUrl;

          const [imgRes, qrRes] = await Promise.all([
            this.downloadFile(item.image_url),
            this.downloadFile(qrcodeUrl)
          ]);

          uni.hideLoading();
          if (!imgRes || !qrRes) {
            return uni.showToast({ title: '图片下载失败', icon: 'none' });
          }

          const compositePath = await this.composeShareImage(imgRes, qrRes);
          if (!compositePath) {
            return uni.showToast({ title: '合成图片失败', icon: 'none' });
          }

          this.sharePreviewPath = compositePath;
          this.showSharePreview = true;
        })
        .catch(() => {
          uni.hideLoading();
          uni.showToast({ title: '获取分享码失败', icon: 'none' });
        });
    },
    downloadFile(url) {
      return new Promise((resolve) => {
        if (url.startsWith('data:')) {
          const fs = wx.getFileSystemManager();
          const filePath = `${wx.env.USER_DATA_PATH}/share_${Date.now()}.png`;
          const base64Data = url.replace(/^data:image\/\w+;base64,/, '');
          fs.writeFile({
            filePath,
            data: base64Data,
            encoding: 'base64',
            success: () => resolve(filePath),
            fail: () => resolve(null)
          });
        } else {
          uni.downloadFile({
            url,
            success: (res) => {
              resolve(res.statusCode === 200 ? res.tempFilePath : null);
            },
            fail: () => resolve(null)
          });
        }
      });
    },
    composeShareImage(imgPath, qrPath) {
      const MAX_SIDE = 1200;
      return new Promise((resolve) => {
        const sys = uni.getSystemInfoSync();
        const dpr = sys.pixelRatio || 2;

        uni.getImageInfo({
          src: imgPath,
          success: (imgInfo) => {
            let w = imgInfo.width;
            let h = imgInfo.height;
            if (w > MAX_SIDE || h > MAX_SIDE) {
              const scale = Math.min(MAX_SIDE / w, MAX_SIDE / h);
              w = Math.floor(w * scale);
              h = Math.floor(h * scale);
            }

            this.canvasWidth = w;
            this.canvasHeight = h;

            this.$nextTick(() => {
              setTimeout(() => {
                const ctx = uni.createCanvasContext('shareCanvas', this);

                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(imgPath, 0, 0, w, h);

                const qrSize = Math.min(w, h) * 0.25;
                const padding = 20;
                const x = w - qrSize - padding;
                const y = h - qrSize - padding;

                ctx.setFillStyle('#ffffff');
                ctx.fillRect(x - 10, y - 10, qrSize + 20, qrSize + 20);
                ctx.drawImage(qrPath, x, y, qrSize, qrSize);

                ctx.draw(false, () => {
                  setTimeout(() => {
                    uni.canvasToTempFilePath({
                      canvasId: 'shareCanvas',
                      x: 0,
                      y: 0,
                      width: w,
                      height: h,
                      destWidth: w * dpr,
                      destHeight: h * dpr,
                      fileType: 'png',
                      quality: 1,
                      success: (res) => resolve(res.tempFilePath),
                      fail: (err) => {
                        console.error('canvasToTempFilePath fail:', err);
                        resolve(null);
                      }
                    }, this);
                  }, 300);
                });
              }, 200);
            });
          },
          fail: (err) => {
            console.error('getImageInfo fail:', err);
            resolve(null);
          }
        });
      });
    },
    closeSharePreview() {
      this.showSharePreview = false;
      this.sharePreviewPath = '';
    },
    saveSharePreview() {
      if (!this.sharePreviewPath) return;
      this.saveToAlbum(this.sharePreviewPath);
    },
    shareToFriend() {
      this.shareImageByWeixin(this.sharePreviewPath, 'friend');
    },
    shareToTimeline() {
      this.shareImageByWeixin(this.sharePreviewPath, 'timeline');
    },
    shareImageByWeixin(filePath, target) {
      if (!filePath) {
        uni.showToast({ title: '分享图不存在', icon: 'none' });
        return;
      }
      // #ifdef MP-WEIXIN
      const hint = target === 'timeline' ? '请选择「分享到朋友圈」' : '请选择「发送给朋友」';
      this.openWeixinShareMenu(filePath, hint);
      // #endif
      // #ifdef APP-PLUS
      const scene = target === 'timeline' ? 'WXSceneTimeline' : 'WXSceneSession';
      uni.share({
        provider: 'weixin',
        type: 2,
        imageUrl: filePath,
        scene,
        success: () => {
          uni.showToast({ title: '分享成功', icon: 'success' });
        },
        fail: () => {
          uni.showToast({ title: '分享失败，请保存后手动分享', icon: 'none' });
        }
      });
      // #endif
      // #ifndef MP-WEIXIN || APP-PLUS
      uni.previewImage({
        urls: [filePath],
        current: filePath,
        success: () => {
          uni.showToast({ title: '长按图片可保存分享', icon: 'none' });
        }
      });
      // #endif
    },
    openWeixinShareMenu(filePath, hint) {
      // #ifdef MP-WEIXIN
      if (wx.showShareImageMenu) {
        wx.showShareImageMenu({
          path: filePath,
          success: () => {
            if (hint) {
              uni.showToast({ title: hint, icon: 'none', duration: 2500 });
            }
          },
          fail: (err) => {
            console.error('showShareImageMenu fail:', err);
            uni.previewImage({ urls: [filePath], current: filePath });
            uni.showToast({ title: '请长按图片保存后分享', icon: 'none' });
          }
        });
      } else {
        uni.previewImage({ urls: [filePath], current: filePath });
        uni.showToast({ title: '请长按图片保存后分享', icon: 'none' });
      }
      // #endif
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

.time-notice {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 24rpx;
  background-color: #fff3e0;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  border-left: 6rpx solid #ff9800;
}

.notice-icon {
  font-size: 32rpx;
  flex-shrink: 0;
  line-height: 1.4;
  margin-right: 16rpx;
}

.notice-text {
  flex: 1;
  font-size: 24rpx;
  color: #e65100;
  line-height: 1.6;
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

.share-canvas {
  position: fixed;
  left: -9999px;
  top: 0;
  pointer-events: none;
}

.share-preview-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  box-sizing: border-box;
}

.share-preview-box {
  width: 100%;
  max-width: 640rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-sizing: border-box;
}

.share-preview-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24rpx;
  color: #333;
}

.share-preview-scroll {
  max-height: 50vh;
}

.share-preview-img {
  width: 100%;
  border-radius: 12rpx;
  display: block;
}

.share-preview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 28rpx;
}

.share-action-btn {
  flex: 1;
  min-width: 28%;
  text-align: center;
  padding: 20rpx 12rpx;
  font-size: 26rpx;
  color: #1e88e5;
  background: #e3f2fd;
  border-radius: 40rpx;
}

.share-action-btn.primary {
  color: #fff;
  background: #1e88e5;
}

.share-preview-close {
  text-align: center;
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #999;
}
</style>
