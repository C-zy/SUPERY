/**
 * 图片工具模块 - 提供图片保存、Base64转换等公共方法
 */

/**
 * 本地图片转Base64 Data URI
 * @param {string} imagePath 本地图片路径
 * @returns {Promise<string>} Base64格式的Data URI
 */
export function imageToBase64(imagePath) {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager()
    fs.readFile({
      filePath: imagePath,
      encoding: 'base64',
      success: (res) => {
        resolve('data:image/jpeg;base64,' + res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 下载文件到本地临时路径（支持URL和Base64）
 * @param {string} url 文件URL或Base64 Data URI
 * @param {string} prefix 临时文件前缀
 * @returns {Promise<string|null>} 本地临时文件路径
 */
export function downloadFile(url, prefix = 'temp') {
  return new Promise((resolve) => {
    if (url.startsWith('data:')) {
      const fs = wx.getFileSystemManager()
      const filePath = `${wx.env.USER_DATA_PATH}/${prefix}_${Date.now()}.png`
      const base64Data = url.replace(/^data:image\/\w+;base64,/, '')
      fs.writeFile({
        filePath,
        data: base64Data,
        encoding: 'base64',
        success: () => resolve(filePath),
        fail: () => resolve(null)
      })
    } else {
      uni.downloadFile({
        url,
        success: (res) => {
          resolve(res.statusCode === 200 ? res.tempFilePath : null)
        },
        fail: () => resolve(null)
      })
    }
  })
}

/**
 * 保存文件到系统相册
 * @param {string} filePath 本地文件路径
 * @returns {Promise<void>}
 */
function saveToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        uni.hideLoading()
        uni.showToast({ title: '已保存到相册', icon: 'success' })
        resolve()
      },
      fail: (err) => {
        uni.hideLoading()
        uni.showToast({ title: '保存失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

/**
 * 保存图片到相册（自动处理Base64和URL两种格式）
 * @param {string} imageUrl 图片URL或Base64 Data URI
 * @returns {Promise<void>}
 */
export async function saveImageToAlbum(imageUrl) {
  if (!imageUrl) return

  uni.showLoading({ title: '保存中...', mask: true })

  try {
    const filePath = await downloadFile(imageUrl, 'save')
    if (!filePath) {
      uni.hideLoading()
      uni.showToast({ title: '下载失败', icon: 'none' })
      return
    }
    await saveToAlbum(filePath)
  } catch {
    uni.hideLoading()
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}