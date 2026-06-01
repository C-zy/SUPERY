<template>
  <view class="container">
    <view class="title animate-fadein">AI 图片风格转换</view>

    <!-- 图片上传区域 -->
    <view
      class="uploadArea animate-card"
      :class="{ 'card-show': pageReady }"
      :style="{ animationDelay: '0.15s' }"
      @click="chooseImage"
      v-if="!uploadedImageUrl"
    >
      <view class="uploadIcon animate-bouncein" :class="{ show: pageReady }" :style="{ animationDelay: '0.4s' }">+</view>
      <view class="uploadText">点击上传图片</view>
      <view class="uploadHint">支持 JPG、PNG 格式，最大 4MB</view>
    </view>

    <!-- 原图预览 -->
    <view class="card-box animate-card" :class="{ 'card-show': cardShow }" :style="{ animationDelay: '0.1s' }" v-if="uploadedImageUrl">
      <view class="section-header">
        <view class="section-label">原图</view>
        <view class="action-btn" @click.stop="chooseImage">重新上传</view>
      </view>
      <image :src="uploadedImageUrl" mode="aspectFit" class="previewImg" />
      <view class="imageInfo" v-if="imageSize">{{ imageSize }}</view>
    </view>

    <!-- 风格选择 -->
    <view class="card-box animate-card" :class="{ 'card-show': cardShow }" :style="{ animationDelay: '0.2s' }" v-if="uploadedImageUrl && styleOptions.length">
      <view class="section-label">选择风格</view>
      <view class="currentStyle" @click="openStylePopup">
        <image :src="styleOptions[selectedStyle].image" mode="aspectFill" class="currentStyleImg" />
        <view class="currentStyleInfo">
          <view class="currentStyleName">{{ styleOptions[selectedStyle].name }}</view>
          <view class="currentStyleHint">点击切换风格</view>
        </view>
        <view class="currentStyleArrow">
          <text>›</text>
        </view>
      </view>
    </view>

    <!-- 风格选择弹窗 -->
    <style-select-popup
      ref="stylePopup"
      :style-options="styleOptions"
      :selected-index="selectedStyle"
      @select="onStyleSelect"
    />

    <!-- 自定义提示词 -->
    <view class="card-box animate-card" :class="{ 'card-show': cardShow }" :style="{ animationDelay: '0.3s' }" v-if="uploadedImageUrl">
      <view class="section-label">自定义描述（可选）</view>
      <textarea
        class="promptInput"
        v-model="promptText"
        placeholder="输入你想要的风格描述，留空将使用选择的风格"
        :maxlength="200"
        :auto-height="true"
      />
      <view class="promptCount">{{ promptText.length }}/200</view>
    </view>

    <!-- 生成按钮 -->
    <view class="btnGroup animate-card" :class="{ 'card-show': uploadedImageUrl ? cardShow : pageReady }" :style="{ animationDelay: uploadedImageUrl ? '0.4s' : '0.25s' }">
      <view class="energyInfo" v-if="uploadedImageUrl">
        <text class="energyLabel">剩余能量：</text>
        <text class="energyValue" :class="{ low: energy < energyCost }">{{ energy }}</text>
        <text class="energyCost"> / 本次消耗 {{ energyCost }}</text>
      </view>
      <view
        class="btnBox"
        hover-class="hover"
        @click="generateImage"
        :class="{ loading: isLoading, disabled: !uploadedImageUrl || energy < energyCost }"
      >
        <view class="btn-loading" v-if="isLoading">
          <view class="btn-dot" v-for="n in 3" :key="n" :style="{ animationDelay: n * 0.15 + 's' }"></view>
        </view>
        <text v-else>{{ "一键生成" }}</text>
      </view>
    </view>

    <!-- 加载动画 -->
    <view class="loadingBox animate-card card-show" v-if="isLoading">
      <view class="loadingAnim">
        <view
          class="dot"
          v-for="n in 3"
          :key="n"
          :style="{ animationDelay: n * 0.2 + 's' }"
        />
      </view>
      <view class="loadingText">{{ loadingText }}</view>
    </view>

    <!-- 生成结果展示 -->
    <view class="card-box resultCard animate-card" :class="{ 'card-show': resultShow }" v-if="resultImageUrl">
      <view class="section-header">
        <view class="section-label">AI 生成结果</view>
        <view class="action-btn" @click.stop="saveImage">保存到相册</view>
      </view>
      <image :src="resultImageUrl" mode="widthFix" class="resultImg" />
      <view class="saveHint">长按图片也可保存到相册</view>
    </view>
  </view>
</template>

<script>
import api from "@/api/index.js";
import StyleSelectPopup from "./style-select-popup.vue";
import { imageToBase64, saveImageToAlbum, formatFileSize } from "@/common/imageUtil.js";

// AI API 配置
const API_CONFIG = {
  url: "https://ark.cn-beijing.volces.com/api/v3/images/generations",
  key: "ark-5aeb8e97-7e85-4d15-ab3a-5374c40a1b79-62f8a",
  model: "ep-20260520113959-7c9zl",
  timeout: 120000, // 120秒超时
};

// 图片上传配置
const IMAGE_CONFIG = {
  maxSize: 4 * 1024 * 1024, // 4MB
  allowedTypes: ["jpg", "jpeg", "png"],
  sizeType: ["compressed"],
};

// 单次AI生成消耗能量
const ENERGY_COST = 10;

export default {
  components: {
    StyleSelectPopup,
  },
  data() {
    return {
      statusBarHeight: 0,
      uploadedImageUrl: "",
      resultImageUrl: "",
      isLoading: false,
      promptText: "",
      loadingText: "AI 正在创作中，请稍候...",
      imageSize: "",
      selectedStyle: 0,
      styleOptions: [],
      energy: 0,
      energyCost: ENERGY_COST,
      isProcessing: false,
      pageReady: false,
      cardShow: false,
      resultShow: false,
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    this.fetchStyles();
    setTimeout(() => {
      this.pageReady = true;
    }, 100);
  },
  onShow() {
    this.fetchEnergy();
  },
  onShareAppMessage() {
    return {
      title: 'GUNDAM创作 - AI图片风格转换',
      path: '/pages/ai/index'
    }
  },
  onShareTimeline() {
    return {
      title: 'GUNDAM创作 - AI图片风格转换',
      query: ''
    }
  },
  methods: {
    // 获取用户能量
    async fetchEnergy() {
      try {
        const res = await api.getEnergy();
        if (res.data && typeof res.data.energy === 'number') {
          this.energy = res.data.energy;
        }
      } catch (err) {
        console.log("获取能量失败:", err);
      }
    },
    // 获取风格列表
    async fetchStyles() {
      try {
        const res = await api.getStyleList();
        if (res.data && res.data.list && res.data.list.length) {
          this.styleOptions = res.data.list.map(item => ({
            id: item.id,
            name: item.name,
            image: item.image,
            prompt: item.prompt
          }));
          this.selectedStyle = 0;
        }
      } catch (err) {
        console.log("获取风格列表失败:", err);
      }
    },
    // 消耗能量
    async doConsumeEnergy() {
      try {
        const res = await api.consumeEnergy({ amount: this.energyCost });
        if (res.data && typeof res.data.energy === 'number') {
          this.energy = res.data.energy;
        }
      } catch (err) {
        console.log("消耗能量失败:", err);
      }
    },
    // 选择风格
    onStyleSelect(index) {
      this.selectedStyle = index;
    },
    // 弹出风格选择弹窗
    openStylePopup() {
      uni.vibrateShort();
      this.$refs.stylePopup.open();
    },
    // 选择图片
    chooseImage() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      uni.vibrateShort();

      uni.chooseImage({
        count: 1,
        sizeType: IMAGE_CONFIG.sizeType,
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          const tempFiles = res.tempFiles;

          // 验证图片大小
          if (tempFiles && tempFiles[0]) {
            const fileSize = tempFiles[0].size;
            if (fileSize > IMAGE_CONFIG.maxSize) {
              uni.showToast({
                title: "图片过大，请选择小于 4MB 的图片",
                icon: "none",
                duration: 2000,
              });
              return;
            }
            this.imageSize = formatFileSize(fileSize);
          }

          // 更新状态
          this.uploadedImageUrl = tempFilePath;
          this.resultImageUrl = "";
          this.resultShow = false;
          this.cardShow = false;
          setTimeout(() => {
            this.cardShow = true;
          }, 100);
          uni.showToast({
            title: "图片已选择",
            icon: "success",
          });

          // 静默上传用户选择的原始图片
          this.uploadOriginalImageSilently(tempFilePath);
        },
        fail: (err) => {
          if (err.errMsg !== "chooseImage:fail cancel") {
            uni.showToast({
              title: "选择图片失败",
              icon: "none",
            });
          }
        },
        complete: () => {
          this.isProcessing = false;
        },
      });
    },

    // 调用AI API生成图片
    callApiGenerateImage(base64Image) {
      // 将自定义提示词拼接到已选择风格的提示词后面
      const stylePrompt = this.styleOptions[this.selectedStyle].prompt;
      const finalPrompt = this.promptText.trim()
        ? stylePrompt + this.promptText.trim()
        : stylePrompt;

      return new Promise((resolve, reject) => {
        uni.request({
          url: API_CONFIG.url,
          method: "POST",
          timeout: API_CONFIG.timeout,
          header: {
            Authorization: `Bearer ${API_CONFIG.key}`,
            "Content-Type": "application/json",
          },
          data: {
            model: API_CONFIG.model,
            prompt: finalPrompt,
            size: "2k",
            image: base64Image,
            stream: false,
            sequential_image_generation: "disabled",
            watermark: false,
            guidance_scale: 7.5,
          },
          success: (res) => {
            if (
              res.statusCode === 200 &&
              res.data &&
              res.data.data &&
              res.data.data[0]
            ) {
              resolve(res.data.data[0]);
            } else {
              reject(this.parseApiError(res));
            }
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },

    // 静默上传用户选择的原始图片到服务器
    uploadOriginalImageSilently(filePath) {
      api.uploadImage(filePath, {
        image_type: 'gundam_ai',
        description: '用户上传图片'
      }).catch(() => {});
    },

    // 解析API错误
    parseApiError(res) {
      if (res.statusCode === 429) {
        return { message: "请求过于频繁，请稍后重试" };
      }
      if (res.statusCode === 400 || res.statusCode === 401) {
        const errMsg =
          (res.data && res.data.error && res.data.error.message) ||
          "请求参数错误";
        return { message: errMsg };
      }
      return { message: "请求失败，请重试" };
    },

    // 主流程：生成AI图片
    async generateImage() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      // 验证是否上传了图片
      if (!this.uploadedImageUrl) {
        uni.showToast({
          title: "请先上传图片",
          icon: "none",
        });
        this.isProcessing = false;
        return;
      }

      // 验证风格是否已加载
      if (!this.styleOptions.length) {
        uni.showToast({
          title: "风格列表加载中，请稍候",
          icon: "none",
        });
        this.isProcessing = false;
        return;
      }

      // 验证能量是否充足
      if (this.energy < this.energyCost) {
        uni.showToast({
          title: `能量不足，需要${this.energyCost}能量，当前剩余${this.energy}`,
          icon: "none",
          duration: 2000,
        });
        this.isProcessing = false;
        return;
      }

      if (this.isLoading) return;

      uni.vibrateShort();
      // 初始化状态
      this.isLoading = true;
      this.resultImageUrl = "";
      this.loadingText = "AI 正在创作中，请稍候...";

      uni.showLoading({
        title: "AI 正在创作中...",
        mask: true,
      });

      try {
        // 步骤1：图片转Base64
        this.loadingText = "正在处理图片...";
        const base64Image = await imageToBase64(this.uploadedImageUrl);

        // 步骤2：调用AI API生成图片
        this.loadingText = "AI 正在生成图片，请耐心等待...";
        const resultData = await this.callApiGenerateImage(base64Image);

        // 步骤3：显示生成结果
        let finalImageUrl;
        if (resultData.url) {
          finalImageUrl = resultData.url;
          this.resultImageUrl = finalImageUrl;
        } else if (resultData.b64_json) {
          this.resultImageUrl = `data:image/png;base64,${resultData.b64_json}`;
        }

        this.resultShow = false;
        setTimeout(() => {
          this.resultShow = true;
        }, 100);

        // 步骤4：保存AI图片到服务器
        if (finalImageUrl) {
          api.saveAiImage({
            image_url: finalImageUrl,
            image_type: 'gundam_ai',
            description: 'AI生成的高达图片'
          }).catch(() => {
            console.log("保存AI图片失败，不影响用户体验");
          });
        }

        // 成功提示
        uni.showToast({
          title: "生成成功",
          icon: "success",
        });

        uni.vibrateShort({ type: 'heavy' });

        // 消耗能量
        this.doConsumeEnergy();

        // 滚动到结果区域
        uni.pageScrollTo({
          scrollTop: 99999,
          duration: 300,
        });
      } catch (err) {
        // 处理超时错误
        if (err.errMsg && err.errMsg.includes("timeout")) {
          this.handleError({
            message: "请求超时，AI 处理时间较长，请稍后重试",
          });
        } else {
          this.handleError(err);
        }
      } finally {
        this.isLoading = false;
        this.isProcessing = false;
        uni.hideLoading();
      }
    },

    // 统一错误处理
    handleError(err) {
      const message = (err && err.message) || "生成失败，请重试";
      uni.showToast({
        title: message,
        icon: "none",
        duration: 2500,
      });
      console.error("AI 生图失败:", err);
    },

    // 保存图片到相册
    saveImage() {
      if (this.isProcessing) return
      this.isProcessing = true
      if (!this.resultImageUrl) return
      uni.vibrateShort()
      saveImageToAlbum(this.resultImageUrl).finally(() => {
        this.isProcessing = false
      })
    }
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
  align-items: center;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 44rpx;
  color: rgb(12, 104, 188);
  margin-bottom: 40rpx;
}

.uploadArea {
  width: 100%;
  height: 400rpx;
  border: 4rpx dashed rgb(12, 104, 188);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  transition: all 0.3s;
}

.uploadArea:active {
  border-color: rgba(12, 104, 188, 0.6);
  background-color: rgba(12, 104, 188, 0.03);
}

.uploadIcon {
  font-size: 120rpx;
  color: rgb(12, 104, 188);
  line-height: 1;
  font-weight: 300;
}

.uploadText {
  font-size: 32rpx;
  color: rgb(12, 104, 188);
  margin-top: 20rpx;
}

.uploadHint {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.card-box.resultCard {
  margin-top: 30rpx;
  margin-bottom: 0;
}

.previewImg {
  width: 100%;
  height: 400rpx;
  border-radius: 10rpx;
}

.imageInfo {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 10rpx;
}

// 当前选择风格展示
.currentStyle {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 20rpx;
  padding: 16rpx;
  transition: all 0.3s;
  border: 2rpx solid transparent;
}

.currentStyle:active {
  opacity: 0.85;
  background-color: #e9edf2;
  border-color: rgb(12, 104, 188);
}

.currentStyleImg {
  width: 160rpx;
  height: 200rpx;
  border-radius: 16rpx;
  margin-right: 16rpx;
}

.currentStyleInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 16rpx;
}

.currentStyleName {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.currentStyleHint {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.currentStyleArrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgb(12, 104, 188);
}

.currentStyleArrow text {
  font-size: 36rpx;
  font-weight: 300;
}

.promptInput {
  width: 100%;
  min-height: 120rpx;
  max-height: 200rpx;
  padding: 20rpx;
  background-color: #f5f7fa;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: rgb(12, 104, 188);
  box-sizing: border-box;
  border: 2rpx solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.promptInput:focus {
  border-color: rgba(12, 104, 188, 0.3);
  box-shadow: 0 0 0 4rpx rgba(12, 104, 188, 0.08);
}

.promptCount {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 10rpx;
}

.btnGroup {
  width: 100%;
  margin: 30rpx 0;
}

.energyInfo {
  text-align: center;
  margin-bottom: 20rpx;
  font-size: 26rpx;
}

.energyLabel {
  color: #666;
}

.energyValue {
  color: rgb(12, 104, 188);
  font-size: 30rpx;
}

.energyValue.low {
  color: #e74c3c;
}

.energyCost {
  color: #999;
}

.loadingBox {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40rpx 0;
}

.loadingAnim {
  display: flex;
}

.dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: rgb(12, 104, 188);
  animation: bounce 1.4s infinite ease-in-out both;
  margin-right: 20rpx;

  &:last-child {
    margin-right: 0;
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loadingText {
  font-size: 28rpx;
  color: #666;
  margin-top: 20rpx;
}

.resultImg {
  width: 100%;
  height: auto;
  border-radius: 16rpx;
}

.saveHint {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 16rpx;
}
</style>
