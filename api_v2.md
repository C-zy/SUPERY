# 小程序V2系统 API文档

## 目录
- [用户认证接口](#用户认证接口)
  - [微信授权登录](#微信授权登录)
  - [Token验证](#token验证)
  - [Token刷新](#token刷新)
  - [退出登录](#退出登录)
- [用户信息接口](#用户信息接口)
  - [更新用户信息](#更新用户信息)
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
| code | string | 是 | 微信登录code |
| userInfo | object | 否 | 用户信息对象 |
| userInfo.nickName | string | 否 | 昵称 |
| userInfo.avatarUrl | string | 否 | 头像URL |
| userInfo.gender | number | 否 | 性别 0-未知 1-男 2-女 |
| userInfo.country | string | 否 | 国家 |
| userInfo.province | string | 否 | 省份 |
| userInfo.city | string | 否 | 城市 |

**请求示例：**
```json
{
  "code": "081xxx",
  "userInfo": {
    "nickName": "微信用户",
    "avatarUrl": "https://xxx",
    "gender": 1
  }
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
      "gender": 1
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
  "msg": "Token有效",
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

## 图片接口

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
