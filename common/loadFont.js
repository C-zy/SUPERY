import urlConfig from '@/common/config.js'

export const FONT_FAMILY = 'AaJiJiaHei'
const FONT_FILE = '/static/font/AaJiJiaHei-2.ttf'
const FONT_CACHE_PATH_KEY = 'font_cache_path_AaJiJiaHei'

/** 真机仅支持 HTTPS，开发环境 http 时回退到线上域名 */
function getFontHttpsUrl() {
  let host = (urlConfig || '').replace(/\/$/, '')
  if (!host.startsWith('https://')) {
    host = 'http://192.168.200.1:80'
  }
  return `${host}${FONT_FILE}`
}

function loadFontFace(source) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.loadFontFace({
      family: FONT_FAMILY,
      source,
      global: true,
      scopes: ['webview'],
      success: resolve,
      fail: reject
    })
    // #endif
    // #ifndef MP-WEIXIN
    resolve()
    // #endif
  })
}

function readFileAsDataUrl(filePath) {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager()
    fs.readFile({
      filePath,
      encoding: 'base64',
      success: (res) => {
        resolve(`url("data:font/ttf;base64,${res.data}")`)
      },
      fail: reject
    })
  })
}

function downloadAndCacheFont() {
  const url = getFontHttpsUrl()
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      success: async (res) => {
        if (res.statusCode !== 200 || !res.tempFilePath) {
          reject(new Error(`字体下载失败: ${res.statusCode}`))
          return
        }
        try {
          const fs = wx.getFileSystemManager()
          const saveRes = await new Promise((resSave, rejSave) => {
            fs.saveFile({
              tempFilePath: res.tempFilePath,
              success: resSave,
              fail: rejSave
            })
          })
          uni.setStorageSync(FONT_CACHE_PATH_KEY, saveRes.savedFilePath)
          const source = await readFileAsDataUrl(saveRes.savedFilePath)
          await loadFontFace(source)
          resolve()
        } catch (e) {
          reject(e)
        }
      },
      fail: reject
    })
  })
}

/**
 * 加载自定义字体（微信小程序真机需 HTTPS + wx.loadFontFace）
 * 优先使用本地缓存，避免重复下载
 */
export function loadAppFont() {
  // #ifdef MP-WEIXIN
  const cachedPath = uni.getStorageSync(FONT_CACHE_PATH_KEY)
  if (cachedPath) {
    return readFileAsDataUrl(cachedPath)
      .then((source) => loadFontFace(source))
      .catch(() => {
        uni.removeStorageSync(FONT_CACHE_PATH_KEY)
        return downloadAndCacheFont()
      })
  }
  return downloadAndCacheFont()
  // #endif
  // #ifndef MP-WEIXIN
  return Promise.resolve()
  // #endif
}
