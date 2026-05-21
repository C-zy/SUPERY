<template>
  <view class="container">
    <view class="title">AI 图片风格转换</view>

    <!-- 图片上传区域 -->
    <view class="uploadArea" @click="chooseImage" v-if="!uploadedImageUrl">
      <view class="uploadIcon">+</view>
      <view class="uploadText">点击上传图片</view>
      <view class="uploadHint">支持 JPG、PNG 格式，最大 4MB</view>
    </view>

    <!-- 原图预览 -->
    <view class="previewBox" v-if="uploadedImageUrl">
      <view class="previewHeader">
        <view class="previewLabel">原图</view>
        <view class="reuploadBtn" @click.stop="chooseImage">重新上传</view>
      </view>
      <image :src="uploadedImageUrl" mode="aspectFit" class="previewImg" />
      <view class="imageInfo" v-if="imageSize">{{ imageSize }}</view>
    </view>

    <!-- 风格选择 -->
    <view class="styleBox" v-if="uploadedImageUrl">
      <view class="styleLabel">选择风格</view>
      <view class="styleList">
        <view
          class="styleItem"
          v-for="(item, index) in styleOptions"
          :key="index"
          :class="{ active: selectedStyle === index }"
          @click="selectedStyle = index"
        >
          {{ item.name }}
        </view>
      </view>
    </view>

    <!-- 自定义提示词 -->
    <view class="promptBox" v-if="uploadedImageUrl">
      <view class="promptLabel">自定义描述（可选）</view>
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
    <view class="btnGroup">
      <view
        class="btnBox"
        hover-class="hover"
        @click="generateImage"
        :class="{ loading: isLoading, disabled: !uploadedImageUrl }"
      >
        {{ isLoading ? "AI 处理中..." : "开始 AI 创作" }}
      </view>
    </view>

    <!-- 加载动画 -->
    <view class="loadingBox" v-if="isLoading">
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
    <view class="resultBox" v-if="resultImageUrl">
      <view class="resultHeader">
        <view class="previewLabel">AI 生成结果</view>
        <view class="saveBtn" @click.stop="saveImage">保存到相册</view>
      </view>
      <image :src="resultImageUrl" mode="widthFix" class="resultImg" />
      <view class="saveHint">长按图片也可保存到相册</view>
    </view>
  </view>
</template>

<script>
import api from "@/api/index.js";

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

// 风格选项配置
const STYLE_OPTIONS = [
  {
    name: "线稿1",
    prompt: `保留机器人模型，去除模型支架、人手与背景，整体替换为 近代复杂手稿 ，设计图纸质感背景，机器人模型的关键结构额外分解展示在一旁，显示复杂的机械结构和一系列公式，整个画面为精致的彩色手绘风格 图片风格为版画，`,
  },
  {
    name: "线稿2",
    prompt: `保留机器人模型，去除模型支架、人手与背景，整体替换为近代复杂手稿，设计图纸质感背景，机器人模型的关键结构额外分解展示在一旁，显示复杂的机械结构和一系列公式，将机器人对称分割，右半边结构换为复杂的透视机械解构线稿，线稿部分要展示内部透视机械细节，整个画面为精致的彩色手绘风格。图片风格为版画。原比例。`,
  },
  {
    name: "旧化",
    prompt: `保留原图高达模型的完整结构、轮廓比例、装甲布局和所有机械细节，不改变任何部件的位置和形状。
将整体材质处理为超现实做旧风格，照片级真实感，8K超高清画质。
金属表面重度生锈（heavy rust），氧化金属（oxidized metal），油漆大面积剥落（peeling paint），露出底层暗灰色金属，表面布满划痕（scratches）、凹痕（dents）、弹孔痕迹（bullet hole marks）。
关节连接处有油污（oil stains）和灰尘堆积（dirt accumulation），装甲边缘磨损明显（edge wear），锈迹从装甲接缝处向下流淌（rust streaks flowing downward from seams）。
局部露出金属原色光泽（exposed bare metal with subtle sheen），展现真实的岁月痕迹和战场旧化效果。
电影级光影（cinematic lighting），HDR高动态范围，锐利对焦（sharp focus），金属反光自然真实（natural metallic reflections），工业复古质感（industrial vintage texture），史诗级战场氛围（epic battlefield atmosphere）。`,
  },
  {
    name:'涂鸦',
    prompt:`杰作，最高画质，速写风格，线稿，动态姿势，机甲，文字颜色为图片颜色相近色，机械细节丰富，笔触锋利，涂鸦式乱线背景，白色背景，文字涂鸦，皇冠符号，星星，箭头，动感氛围，高对比度，粗黑轮廓线，动漫机甲插画，voxcat画风`
  }
];

export default {
  data() {
    return {
      uploadedImageUrl: "", // 上传的图片路径
      resultImageUrl: "", // AI生成的图片路径
      isLoading: false, // 是否加载中
      promptText: "", // 自定义提示词
      loadingText: "AI 正在创作中，请稍候...", // 加载提示文字
      imageSize: "", // 图片大小
      selectedStyle: 0, // 当前选中的风格索引
      styleOptions: STYLE_OPTIONS, // 风格选项
    };
  },
  methods: {
    // 选择图片
    chooseImage() {
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
            this.imageSize = this.formatFileSize(fileSize);
          }

          // 更新状态
          this.uploadedImageUrl = tempFilePath;
          this.resultImageUrl = "";
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
      });
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    },

    // 图片转Base64
    imageToBase64(imagePath) {
      return new Promise((resolve, reject) => {
        const fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: imagePath,
          encoding: "base64",
          success: (res) => {
            resolve("data:image/jpeg;base64," + res.data);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },

    // Base64转图片文件
    base64ToImageFile(base64Data) {
      return new Promise((resolve, reject) => {
        const fs = wx.getFileSystemManager();
        const filePath = `${wx.env.USER_DATA_PATH}/ai_upload_${Date.now()}.png`;
        const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");

        fs.writeFile({
          filePath,
          data: base64Content,
          encoding: "base64",
          success: () => {
            resolve(filePath);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },

    // 调用AI API生成图片
    callApiGenerateImage(base64Image) {
      // 优先使用自定义提示词，否则使用选中的风格
      const finalPrompt = this.promptText.trim() || this.styleOptions[this.selectedStyle].prompt;

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
      try {
        // 上传到服务器（静默，不影响用户体验）
        api.uploadImage(filePath, {
          image_type: 'gundam_ai',
          description: '用户上传图片'
        }).catch(() => {
          console.log("静默上传失败，不影响用户体验");
        });
      } catch (err) {
        console.log("静默上传异常:", err);
      }
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
      // 验证是否上传了图片
      if (!this.uploadedImageUrl) {
        uni.showToast({
          title: "请先上传图片",
          icon: "none",
        });
        return;
      }

      if (this.isLoading) return;

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
        const base64Image = await this.imageToBase64(this.uploadedImageUrl);

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
      if (!this.resultImageUrl) return;

      uni.showLoading({
        title: "保存中...",
        mask: true,
      });

      // 处理Base64格式的图片
      if (this.resultImageUrl.startsWith("data:")) {
        const fs = wx.getFileSystemManager();
        const filePath = `${wx.env.USER_DATA_PATH}/ai_result_${Date.now()}.png`;
        const base64Data = this.resultImageUrl.replace(
          /^data:image\/\w+;base64,/,
          "",
        );

        fs.writeFile({
          filePath,
          data: base64Data,
          encoding: "base64",
          success: () => {
            this.saveToAlbum(filePath);
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({
              title: "保存失败",
              icon: "none",
            });
          },
        });
      } 
      // 处理URL格式的图片
      else {
        uni.downloadFile({
          url: this.resultImageUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              this.saveToAlbum(res.tempFilePath);
            } else {
              uni.hideLoading();
              uni.showToast({
                title: "下载失败",
                icon: "none",
              });
            }
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({
              title: "下载失败",
              icon: "none",
            });
          },
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
            title: "已保存到相册",
            icon: "success",
          });
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({
            title: "保存失败",
            icon: "none",
          });
        },
      });
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
  align-items: center;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 44rpx;
  font-weight: bold;
  color: #30475e;
  margin-bottom: 40rpx;
}

.uploadArea {
  width: 100%;
  height: 400rpx;
  border: 4rpx dashed #d1c145;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  transition: all 0.3s;
}

.uploadIcon {
  font-size: 120rpx;
  color: #d1c145;
  line-height: 1;
  font-weight: 300;
}

.uploadText {
  font-size: 32rpx;
  color: #30475e;
  margin-top: 20rpx;
}

.uploadHint {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.previewBox {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  margin-bottom: 30rpx;
}

.previewHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.previewLabel {
  font-size: 30rpx;
  font-weight: bold;
  color: #30475e;
  padding-left: 10rpx;
  border-left: 6rpx solid #d1c145;
}

.reuploadBtn {
  font-size: 26rpx;
  color: #009933;
  padding: 10rpx 20rpx;
  border: 2rpx solid #009933;
  border-radius: 30rpx;
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

.styleBox {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  margin-bottom: 30rpx;
}

.styleLabel {
  font-size: 30rpx;
  font-weight: bold;
  color: #30475e;
  padding-left: 10rpx;
  border-left: 6rpx solid #d1c145;
  margin-bottom: 20rpx;
}

.styleList {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.styleItem {
  flex: 1;
  min-width: 140rpx;
  height: 70rpx;
  border: 2rpx solid #ddd;
  border-radius: 35rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #666;
  transition: all 0.3s;
  background-color: #f9f9f9;
}

.styleItem.active {
  background: linear-gradient(135deg, #009933, #00b33c);
  color: #fff;
  border-color: #009933;
}

.promptBox {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  margin-bottom: 30rpx;
}

.promptLabel {
  font-size: 30rpx;
  font-weight: bold;
  color: #30475e;
  padding-left: 10rpx;
  border-left: 6rpx solid #d1c145;
  margin-bottom: 20rpx;
}

.promptInput {
  width: 100%;
  min-height: 120rpx;
  max-height: 200rpx;
  padding: 20rpx;
  background-color: #f5f7fa;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #30475e;
  box-sizing: border-box;
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

.btnBox {
  width: 100%;
  height: 90rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #009933, #00b33c);
  border-radius: 45rpx;
  font-size: 34rpx;
  color: #fff;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 8rpx 20rpx rgba(0, 153, 51, 0.3);
}

.btnBox.disabled {
  background: #ccc;
  box-shadow: none;
  pointer-events: none;
}

.btnBox.loading {
  opacity: 0.8;
  pointer-events: none;
}

.hover {
  opacity: 0.85;
  transform: scale(0.98);
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
  gap: 20rpx;
}

.dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: #d1c145;
  animation: bounce 1.4s infinite ease-in-out both;
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

.resultBox {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  margin-top: 30rpx;
}

.resultHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.saveBtn {
  font-size: 26rpx;
  color: #009933;
  padding: 10rpx 20rpx;
  border: 2rpx solid #009933;
  border-radius: 30rpx;
}

.resultImg {
  width: 100%;
  height: auto;
  border-radius: 10rpx;
}

.saveHint {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}
</style>
