# 小程序V2系统 API文档

## 目录
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
- 老用户登录时会自动检查并恢复能量（如果能量低于 60 且当天未恢复过）
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
- 用户登录或调用能量相关接口时也会触发能量检查

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

**功能说明：** 获取当前用户的能量信息，调用时会自动检查并恢复当日能量（如果能量低于60）

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

**功能说明：** 消耗用户能量，调用前会自动检查并恢复当日能量

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

### 图片信息更新

**接口地址：** `PUT /api/v2/image/:id`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**路径参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 图片ID |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| image_type | string | 否 | 图片类型 |
| description | string | 否 | 图片描述 |

**响应示例：**
```json
{
  "err": 0,
  "msg": "更新成功"
}
```

---

## AI图片接口

### 保存AI图片

**接口地址：** `POST /api/v2/ai/image/save`

**请求头：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Bearer Token |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| image_url | string | 是 | 图片URL |
| image_type | string | 是 | 图片类型 |
| description | string | 否 | 图片描述 |

**请求示例：**
```json
{
  "image_url": "https://example.com/image.jpg",
  "image_type": "avatar",
  "description": "AI生成的头像"
}
```

**响应示例：**
```json
{
  "err": 0,
  "msg": "保存成功",
  "data": {
    "id": 1,
    "image_type": "avatar",
    "image_url": "https://example.com/image.jpg"
  }
}
```

---

### 查询AI图片列表

**接口地址：** `GET /api/v2/ai/image/list`

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

**功能说明：**
- 只返回24小时内创建的AI图片
- 超过24小时的图片不会出现在列表中

**请求示例：**
```
GET /api/v2/ai/image/list?image_type=avatar&page=1&pageSize=10
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
        "image_type": "avatar",
        "image_url": "https://example.com/image.jpg",
        "description": "AI生成的头像",
        "created_at": "2024-01-01T00:00:00.000Z"
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

**接口地址：** `DELETE /api/v2/ai/image/:id`

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
