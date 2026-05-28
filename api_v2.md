# 小程序V2系统 API文档

## 目录
- [用户端接口](#用户端接口)
  - [用户认证接口](#用户认证接口)
    - [微信授权登录](#微信授权登录)
    - [Token验证](#token验证)
    - [Token刷新](#token刷新)
    - [退出登录](#退出登录)
  - [用户信息接口](#用户信息接口)
    - [更新用户信息](#更新用户信息)
  - [能量接口](#能量接口)
    - [获取能量](#获取能量)
    - [消耗能量](#消耗能量)
    - [增加能量](#增加能量)
  - [分享接口](#分享接口)
    - [获取分享码](#获取分享码)
  - [图片接口](#图片接口)
    - [图片上传](#图片上传)
    - [图片列表](#图片列表)
    - [图片删除](#图片删除)
    - [图片信息更新](#图片信息更新)
  - [AI图片接口](#ai图片接口)
    - [保存AI图片](#保存ai图片)
    - [查询AI图片列表](#查询ai图片列表)
    - [删除AI图片](#删除ai图片)
  - [用户反馈接口](#用户反馈接口)
    - [提交反馈](#提交反馈)
  - [风格选项接口](#风格选项接口)
    - [获取风格列表](#获取风格列表)
    - [获取风格详情](#获取风格详情)
    - [创建个人风格](#创建个人风格)
    - [删除个人风格](#删除个人风格)
    - [获取分享风格](#获取分享风格)
  - [系统配置接口](#系统配置接口)
    - [获取审核模式状态](#获取审核模式状态)
- [管理端接口](#管理端接口)
  - [管理员登录](#管理员登录)
  - [管理员退出](#管理员退出)
  - [用户管理](#用户管理)
    - [获取用户列表](#获取用户列表)
    - [获取用户详情](#获取用户详情)
    - [更新用户信息](#更新用户信息)
    - [禁用/启用用户](#禁用启用用户)
    - [获取用户统计](#获取用户统计)
  - [反馈管理](#反馈管理)
    - [获取反馈列表](#获取反馈列表)
    - [获取反馈详情](#获取反馈详情)
    - [更新反馈状态和回复](#更新反馈状态和回复)
    - [删除反馈](#删除反馈)
    - [获取反馈统计](#获取反馈统计)
  - [图片资源管理](#图片资源管理)
    - [获取图片列表](#获取图片列表)
    - [删除图片](#删除图片)
    - [获取图片统计](#获取图片统计)
  - [AI图片管理](#ai图片管理)
    - [获取AI图片列表](#获取ai图片列表)
    - [删除AI图片](#删除ai图片)
    - [获取AI图片统计](#获取ai图片统计)
  - [风格选项管理](#风格选项管理)
    - [获取风格列表](#获取风格列表-1)
    - [创建风格](#创建风格)
    - [更新风格](#更新风格)
    - [删除风格](#删除风格)
    - [获取风格统计](#获取风格统计)

---

## 用户端接口

> 用户端接口文件：`api/v2/index.js`
> 基础路径：`/api/v2`

---

## 用户认证接口

### 微信授权登录

**接口地址：** `POST /api/v2/login`

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| code | string | 是 | 微信登录 code |
| userInfo | object | 否 | 用户信息对象 |
| userInfo.nickName | string | 否 | 昵称 |
| userInfo.avatarUrl | string | 否 | 头像 URL |
| userInfo.gender | number | 否 | 性别 0-未知 1-男 2-女 |
| userInfo.country | string | 否 | 国家 |
| userInfo.province | string | 否 | 省份 |
| userInfo.city | string | 否 | 城市 |
| inviterId | number | 否 | 分享人ID（新用户注册时绑定） |

**功能说明：** 
- 新用户会自动注册并初始化能量为 60
- 登录成功后会返回当前用户的能量值
- 新用户首次注册时，如果传入 inviterId，会自动绑定分享人
- 分享人ID通过扫描分享码获取（scene 参数中包含分享者 ID）

**请求示例：**
```json
{
  "code": "081xxx",
  "userInfo": {
    "nickName": "微信用户",
    "avatarUrl": "https://xxx",
    "gender": 1
  },
  "inviterId": 123
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "登录成功",
  "data": {
    "token": "xxxxx",
    "expiresAt": "2024-02-01T00:00:00.000Z",
    "isNewUser": false,
    "user": {
      "id": 1,
      "openid": "xxx",
      "nickname": "微信用户",
      "avatar_url": "https://xxx",
      "gender": 1,
      "energy": 60,
      "inviter_id": 123
    }
  }
}
```

---

### Token验证

**接口地址：** `POST /api/v2/token/verify`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**响应示例：**
```json
{
  "err": 0,
  "msg": "Token 有效",
  "data": {
    "userId": 1,
    "openid": "xxx",
    "nickname": "微信用户",
    "avatarUrl": "https://xxx",
    "gender": 1
  }
}
```

---

### 用户信息接口补充说明

**能量自动恢复机制：**
- 系统会在每天凌晨（00:00:00）自动检查所有用户的能量值
- 如果能量低于 60，会自动恢复到 60
- 如果能量高于或等于 60，保持不变
- 每个用户每天只会恢复一次能量
- 能量只能通过凌晨定时任务恢复，其他方式不能恢复

---

### Token刷新

**接口地址：** `POST /api/v2/token/refresh`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**响应示例：**
```json
{
  "err": 0,
  "msg": "Token刷新成功",
  "data": {
    "token": "xxxxx",
    "expiresAt": "2024-02-01T00:00:00.000Z"
  }
}
```

---

### 退出登录

**接口地址：** `POST /api/v2/logout`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**响应示例：**
```json
{
  "err": 0,
  "msg": "退出登录成功"
}
```

---

## 用户信息接口

### 更新用户信息

**接口地址：** `PUT /api/v2/user/info`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 否 | 昵称 |
| avatarUrl | string | 否 | 头像URL |
| gender | number | 否 | 性别 |
| phone | string | 否 | 手机号 |
| country | string | 否 | 国家 |
| province | string | 否 | 省份 |
| city | string | 否 | 城市 |

**响应示例：**
```json
{
  "err": 0,
  "msg": "用户信息更新成功"
}
```

---

## 能量接口

### 获取能量

**接口地址：** `GET /api/v2/energy`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**功能说明：** 获取当前用户的能量信息

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "energy": 60,
    "lastEnergyRefresh": "2026-05-21"
  }
}
```

---

### 消耗能量

**接口地址：** `POST /api/v2/energy/consume`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| amount | number | 是 | 消耗的能量值，必须大于0 |

**功能说明：** 消耗用户能量

**请求示例：**
```json
{
  "amount": 10
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "消耗成功",
  "data": {
    "energy": 50
  }
}
```

**错误响应示例（能量不足）：**
```json
{
  "err": 1,
  "msg": "能量不足"
}
```

---

### 增加能量

**接口地址：** `POST /api/v2/energy/add`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| amount | number | 是 | 增加的能量值，必须大于0 |

**功能说明：** 增加用户能量，没有上限限制

**请求示例：**
```json
{
  "amount": 20
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "增加成功",
  "data": {
    "energy": 80
  }
}
```

---

## 分享接口

### 获取分享码

**接口地址：** `POST /api/v2/share/qrcode`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | string | 否 | 小程序页面路径，默认 "pages/index/index" |
| width | number | 否 | 二维码宽度（像素），默认 430 |

**功能说明：**
- 生成携带当前用户 ID 的小程序分享码
- 分享参数格式：`share_from_{userId}`
- 用户扫描分享码进入小程序时，可以通过 `scene` 参数获取分享者 ID
- 二维码图片会自动保存到服务器，并返回访问 URL
- 支持指定跳转页面和二维码尺寸

**请求示例：**
```json
{
  "page": "pages/activity/detail",
  "width": 430
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "生成成功",
  "data": {
    "shareFrom": 123,
    "page": "pages/activity/detail",
    "scene": "share_from_123",
    "imageUrl": "/img/user/123/2026/05/21/qrcode_20260521_123456_7890.png",
    "width": 430
  }
}
```

**小程序端获取分享参数：**
```javascript
// 在小程序的 onLoad 或 onShow 中获取场景参数
onLoad(options) {
  if (options.scene) {
    const scene = decodeURIComponent(options.scene);
    // scene 格式：share_from_123
    const shareFrom = scene.replace('share_from_', '');
    console.log('分享者 ID:', shareFrom);
    
    // 保存分享人ID到本地存储
    if (shareFrom) {
      wx.setStorageSync('inviterId', parseInt(shareFrom));
    }
  }
}

// 登录时传递分享人ID
async function login() {
  const inviterId = wx.getStorageSync('inviterId');
  
  const res = await wx.request({
    url: 'https://your-domain.com/api/v2/login',
    method: 'POST',
    data: {
      code: loginCode,
      userInfo: userInfo,
      inviterId: inviterId || null // 传递分享人ID
    }
  });
  
  // 登录成功后清除分享人ID（只绑定一次）
  if (res.data.data.isNewUser) {
    wx.removeStorageSync('inviterId');
  }
}
```

---

## 图片接口

### 图片类型说明

图片类型（image_type）可以是以下值：
- `avatar` - 用户头像
- `product` - 商品图片
- `banner` - 横幅广告
- `certificate` - 证书
- `other` - 其他类型

### 图片上传

**接口地址：** `POST /api/v2/image/upload`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**请求参数：** (multipart/form-data)
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| image | file | 是 | 图片文件 |
| image_type | string | 是 | 图片类型 |
| description | string | 否 | 图片描述 |

**响应示例：**
```json
{
  "err": 0,
  "msg": "上传成功",
  "data": {
    "id": 1,
    "image_type": "avatar",
    "image_name": "20240101_1234.jpg",
    "image_url": "/img/user/1/2024/01/01/xxx.jpg",
    "file_size": 1024,
    "mime_type": "image/jpeg",
    "width": 800,
    "height": 600
  }
}
```

**功能说明：**
- 图片会按用户 ID 和日期分类存储：`/img/user/{userId}/{YYYY}/{MM}/{DD}/{filename}`
- 自动生成唯一文件名：`YYYYMMDD_HHmmss_随机数。扩展名`
- 支持所有常见图片格式（JPEG, PNG, GIF, WebP 等）
- 会自动记录图片的宽高信息

---

### 图片列表

**接口地址：** `GET /api/v2/image/list`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| image_type | string | 否 | 图片类型筛选 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "list": [],
    "total": 0,
    "page": 1,
    "pageSize": 20,
    "totalPages": 0
  }
}
```

---

### 图片删除

**接口地址：** `DELETE /api/v2/image/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 图片ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "删除成功"
}
```

**功能说明：**
- 采用软删除机制，仅将数据库中的 status 字段设为 0
- 同时会删除服务器上的物理文件
- 删除后无法恢复，请谨慎操作

---

## 用户反馈接口

### 提交反馈

**接口地址：** `POST /api/v2/feedback`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**请求参数（multipart/form-data）：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 反馈内容 |
| images | file[] | 否 | 反馈图片文件（最多5张） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "反馈提交成功",
  "data": {
    "id": 1,
    "content": "反馈内容描述",
    "images": [
      "/img/feedback/1/2026/05/25/20260525_120000_1234.jpg",
      "/img/feedback/1/2026/05/25/20260525_120000_5678.png"
    ]
  }
}
```

**错误响应示例：**
```json
{
  "err": 1,
  "msg": "反馈内容不能为空"
}
```

**功能说明：**
- 反馈内容不能为空
- 图片为可选参数，最多上传5张
- 图片会按用户ID和日期分类存储：`/img/feedback/{userId}/{YYYY}/{MM}/{DD}/{filename}`
- 图片URL列表以JSON数组形式存储在数据库中

---

## 风格选项接口

### 获取风格列表

**接口地址：** `GET /api/v2/style/list`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（用户Token） |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 风格类型筛选（official-官方 personal-个人，不传则获取所有启用的风格） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "清新风格",
        "image": "https://example.com/style1.jpg",
        "prompt": "清新、自然、明亮的风格",
        "type": "official",
        "userId": null,
        "shareId": null,
        "sortOrder": 100,
        "createdAt": "2026-05-27T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "我的自定义风格",
        "image": "https://example.com/style2.jpg",
        "prompt": "自定义的风格描述",
        "type": "personal",
        "userId": 123,
        "shareId": "a1b2c3d4e5f6...",
        "sortOrder": 0,
        "createdAt": "2026-05-27T11:00:00.000Z"
      }
    ]
  }
}
```

**功能说明：**
- 不传type参数时，返回官方风格和当前用户的个人风格
- 传type=official时，只返回官方风格
- 传type=personal时，只返回当前用户的个人风格
- 结果按sort_order降序、created_at降序排列

---

### 获取风格详情

**接口地址：** `GET /api/v2/style/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（用户Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 风格ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "name": "清新风格",
    "image": "https://example.com/style1.jpg",
    "prompt": "清新、自然、明亮的风格",
    "type": "official",
    "userId": null,
    "shareId": null,
    "sortOrder": 100,
    "createdAt": "2026-05-27T10:00:00.000Z"
  }
}
```

**功能说明：**
- 只能获取官方风格或自己的个人风格

---

### 创建个人风格

**接口地址：** `POST /api/v2/style/create`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（用户Token） |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 风格名称 |
| image | string | 是 | 风格预览图URL |
| prompt | string | 是 | 风格提示词 |

**请求示例：**
```json
{
  "name": "我的自定义风格",
  "image": "https://example.com/style.jpg",
  "prompt": "自定义的风格描述"
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "创建成功",
  "data": {
    "id": 2,
    "name": "我的自定义风格",
    "image": "https://example.com/style.jpg",
    "prompt": "自定义的风格描述",
    "type": "personal",
    "userId": 123,
    "shareId": "a1b2c3d4e5f6..."
  }
}
```

**功能说明：**
- 创建的风格类型为personal，自动关联当前用户
- 自动生成shareId用于分享

---

### 删除个人风格

**接口地址：** `DELETE /api/v2/style/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（用户Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 风格ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "删除成功"
}
```

**功能说明：**
- 只能删除自己的个人风格，不能删除官方风格
- 删除操作为软删除（修改status为0）

---

### 获取分享风格

**接口地址：** `GET /api/v2/style/share/:shareId`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（用户Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shareId | string | 是 | 分享ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "id": 2,
    "name": "我的自定义风格",
    "image": "https://example.com/style.jpg",
    "prompt": "自定义的风格描述",
    "type": "personal",
    "userId": 123,
    "shareId": "a1b2c3d4e5f6...",
    "createdAt": "2026-05-27T11:00:00.000Z"
  }
}
```

**功能说明：**
- 通过分享ID获取他人分享的个人风格
- 分享的风格必须是启用状态

---

## 系统配置接口

### 获取审核模式状态

**接口地址：** `GET /api/v2/audit/status`

**功能说明：** 获取当前系统是否开启审核模式，无需认证即可访问

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "isOpen": false
  }
}
```

**字段说明：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isOpen | boolean | 审核模式是否开启，true-开启 false-关闭 |

---

## 管理端接口

> 管理端接口文件：`api/v2/admin.js`
> 基础路径：`/api/v2/admin`

### 管理员登录

**接口地址：** `POST /api/v2/admin/login`

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 管理员账号 |
| password | string | 是 | 管理员密码 |

**请求示例：**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "登录成功",
  "data": {
    "token": "xxxxx",
    "expiresAt": "2026-05-26T00:00:00.000Z"
  }
}
```

**功能说明：**
- 默认管理员账号：admin / admin123
- Token 有效期为 24 小时

---

### 管理员退出

**接口地址：** `POST /api/v2/admin/logout`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "退出登录成功"
}
```

---

## 用户管理

### 获取用户列表

**接口地址：** `GET /api/v2/admin/user/list`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | number | 否 | 状态筛选（0-禁用 1-正常） |
| keyword | string | 否 | 搜索关键词（匹配昵称或手机号） |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**请求示例：**
```
GET /api/v2/admin/user/list?status=1&keyword=张&page=1&pageSize=10
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "openid": "oXXXXX",
        "nickname": "张三",
        "avatarUrl": "https://xxx",
        "gender": 1,
        "phone": "13800138000",
        "status": 1,
        "energy": 50,
        "loginCount": 10,
        "lastLoginTime": "2026-05-25T10:00:00.000Z",
        "inviterId": null,
        "createdAt": "2026-05-20T10:00:00.000Z",
        "updatedAt": "2026-05-25T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

### 获取用户详情

**接口地址：** `GET /api/v2/admin/user/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 用户ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "openid": "oXXXXX",
    "unionid": "uXXXXX",
    "nickname": "张三",
    "avatarUrl": "https://xxx",
    "gender": 1,
    "phone": "13800138000",
    "status": 1,
    "energy": 50,
    "loginCount": 10,
    "lastLoginTime": "2026-05-25T10:00:00.000Z",
    "inviterId": null,
    "createdAt": "2026-05-20T10:00:00.000Z",
    "updatedAt": "2026-05-25T10:00:00.000Z"
  }
}
```

---

### 更新用户信息

**接口地址：** `PUT /api/v2/admin/user/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 用户ID |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 否 | 昵称 |
| phone | string | 否 | 手机号 |
| energy | number | 否 | 能量值 |

**请求示例：**
```json
{
  "nickname": "新昵称",
  "energy": 100
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "更新成功"
}
```

---

### 禁用/启用用户

**接口地址：** `PUT /api/v2/admin/user/:id/status`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 用户ID |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | number | 是 | 状态（0-禁用 1-正常） |

**请求示例：**
```json
{
  "status": 0
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "已禁用用户"
}
```

---

### 获取用户统计

**接口地址：** `GET /api/v2/admin/user/stats`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "total": 100,
    "active": 90,
    "disabled": 10,
    "avgEnergy": 45,
    "totalLogins": 500,
    "todayNew": 5
  }
}
```

**功能说明：**
- total：用户总数
- active：正常用户数
- disabled：禁用用户数
- avgEnergy：平均能量值
- totalLogins：总登录次数
- todayNew：今日新增用户数

---

## 反馈管理

### 获取反馈列表

**接口地址：** `GET /api/v2/admin/feedback/list`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | number | 否 | 状态筛选（0-已关闭 1-待处理 2-已处理），不传则查询全部 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**请求示例：**
```
GET /api/v2/admin/feedback/list?status=1&page=1&pageSize=10
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 123,
        "nickname": "微信用户",
        "avatarUrl": "https://xxx",
        "content": "反馈内容描述",
        "images": ["/img/feedback/123/2026/05/25/xxx.jpg"],
        "status": 1,
        "reply": null,
        "createdAt": "2026-05-25T10:00:00.000Z",
        "updatedAt": "2026-05-25T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

### 获取反馈详情

**接口地址：** `GET /api/v2/admin/feedback/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 反馈ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "id": 1,
    "userId": 123,
    "nickname": "微信用户",
    "avatarUrl": "https://xxx",
    "content": "反馈内容描述",
    "images": ["/img/feedback/123/2026/05/25/xxx.jpg"],
    "status": 1,
    "reply": null,
    "createdAt": "2026-05-25T10:00:00.000Z",
    "updatedAt": "2026-05-25T10:00:00.000Z"
  }
}
```

---

### 更新反馈状态和回复

**接口地址：** `PUT /api/v2/admin/feedback/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 反馈ID |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | number | 否 | 状态（0-已关闭 1-待处理 2-已处理） |
| reply | string | 否 | 管理员回复内容 |

**请求示例：**
```json
{
  "status": 2,
  "reply": "感谢反馈，问题已修复"
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "更新成功"
}
```

---

### 删除反馈

**接口地址：** `DELETE /api/v2/admin/feedback/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 反馈ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "删除成功"
}
```

**功能说明：**
- 删除操作为物理删除，会直接从数据库中移除反馈记录
- 删除后无法恢复，请谨慎操作

---

### 获取反馈统计

**接口地址：** `GET /api/v2/admin/feedback/stats`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "total": 10,
    "pending": 5,
    "processed": 3,
    "closed": 2
  }
}
```

**功能说明：**
- total：反馈总数
- pending：待处理数量（status=1）
- processed：已处理数量（status=2）
- closed：已关闭数量（status=0）

---

## 图片资源管理

### 获取图片列表

**接口地址：** `GET /api/v2/admin/image/list`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| image_type | string | 否 | 图片类型筛选 |
| status | number | 否 | 状态筛选（0-删除 1-正常） |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**请求示例：**
```
GET /api/v2/admin/image/list?image_type=avatar&status=1&page=1&pageSize=10
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 123,
        "nickname": "张三",
        "avatarUrl": "https://xxx",
        "imageType": "avatar",
        "imageName": "20260525_120000_1234.jpg",
        "imageUrl": "/img/avatar/123/2026/05/25/20260525_120000_1234.jpg",
        "imagePath": "uploads/2026/05/25/20260525_120000_1234.jpg",
        "fileSize": 102400,
        "mimeType": "image/jpeg",
        "width": 800,
        "height": 600,
        "description": "用户头像",
        "status": 1,
        "createdAt": "2026-05-25T10:00:00.000Z",
        "updatedAt": "2026-05-25T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

### 删除图片

**接口地址：** `DELETE /api/v2/admin/image/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 图片ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "删除成功"
}
```

**功能说明：**
- 删除操作会同时删除数据库记录和服务器上的物理文件
- 删除后无法恢复，请谨慎操作

---

### 获取图片统计

**接口地址：** `GET /api/v2/admin/image/stats`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "total": 100,
    "active": 90,
    "deleted": 10,
    "totalSize": 10240000,
    "typeStats": {
      "avatar": 50,
      "product": 30,
      "banner": 10
    }
  }
}
```

**功能说明：**
- total：图片总数
- active：正常图片数
- deleted：已删除图片数
- totalSize：总文件大小（字节）
- typeStats：各类型图片数量

---

## AI图片管理

### 获取AI图片列表

**接口地址：** `GET /api/v2/admin/ai/image/list`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| image_type | string | 否 | 图片类型筛选 |
| status | number | 否 | 状态筛选（0-删除 1-正常） |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**请求示例：**
```
GET /api/v2/admin/ai/image/list?image_type=avatar&status=1&page=1&pageSize=10
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 123,
        "imageType": "avatar",
        "imageUrl": "https://example.com/image.jpg",
        "description": "AI生成的头像",
        "status": 1,
        "createdAt": "2026-05-25T10:00:00.000Z",
        "updatedAt": "2026-05-25T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

### 删除AI图片

**接口地址：** `DELETE /api/v2/admin/ai/image/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | AI图片ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "删除成功"
}
```

---

### 获取AI图片统计

**接口地址：** `GET /api/v2/admin/ai/image/stats`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "total": 50,
    "active": 45,
    "deleted": 5,
    "typeStats": {
      "avatar": 30,
      "product": 15
    }
  }
}
```

**功能说明：**
- total：AI图片总数
- active：正常AI图片数
- deleted：已删除AI图片数
- typeStats：各类型AI图片数量

---

## 风格选项管理

### 获取风格列表

**接口地址：** `GET /api/v2/admin/style/list`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 风格类型筛选（official-官方 personal-个人） |
| status | number | 否 | 状态筛选（0-禁用 1-启用） |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "清新风格",
        "image": "https://example.com/style1.jpg",
        "prompt": "清新、自然、明亮的风格",
        "type": "official",
        "userId": null,
        "shareId": null,
        "status": 1,
        "sortOrder": 100,
        "createdAt": "2026-05-27T10:00:00.000Z",
        "updatedAt": "2026-05-27T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  }
}
```

---

### 创建风格

**接口地址：** `POST /api/v2/admin/style/create`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 风格名称 |
| image | string | 是 | 风格预览图URL |
| prompt | string | 是 | 风格提示词 |
| type | string | 是 | 风格类型（official-官方 personal-个人） |
| userId | number | type=personal时必填 | 创建者用户ID |
| sortOrder | number | 否 | 排序权重，默认0 |

**请求示例：**
```json
{
  "name": "清新风格",
  "image": "https://example.com/style.jpg",
  "prompt": "清新、自然、明亮的风格",
  "type": "official",
  "sortOrder": 100
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "创建成功",
  "data": {
    "id": 1,
    "name": "清新风格",
    "image": "https://example.com/style.jpg",
    "prompt": "清新、自然、明亮的风格",
    "type": "official",
    "userId": null,
    "shareId": null,
    "sortOrder": 100
  }
}
```

**功能说明：**
- 官方风格(user_id为null)和个人风格都可以创建
- 个人风格会自动生成shareId用于分享
- sortOrder值越大排序越靠前

---

### 更新风格

**接口地址：** `PUT /api/v2/admin/style/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 风格ID |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 否 | 风格名称 |
| image | string | 否 | 风格预览图URL |
| prompt | string | 否 | 风格提示词 |
| sortOrder | number | 否 | 排序权重 |
| status | number | 否 | 状态（0-禁用 1-启用） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "更新成功"
}
```

---

### 删除风格

**接口地址：** `DELETE /api/v2/admin/style/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 风格ID |

**响应示例：**
```json
{
  "err": 0,
  "msg": "删除成功"
}
```

**功能说明：**
- 管理端删除为物理删除，直接删除数据库记录

---

### 获取风格统计

**接口地址：** `GET /api/v2/admin/style/stats`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token（管理员Token） |

**响应示例：**
```json
{
  "err": 0,
  "msg": "获取成功",
  "data": {
    "total": 50,
    "active": 45,
    "disabled": 5,
    "official": 30,
    "personal": 20
  }
}
```

**功能说明：**
- total：风格总数
- active：启用状态数量
- disabled：禁用状态数量
- official：官方风格数量
- personal：个人风格数量
