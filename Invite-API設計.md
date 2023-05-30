## 概要

| ホスト                 | データ形式 |
| ---------------------- | ---------- |
| http://localhost:8080/ | JSON       |

## 招待取得

### パス

`/invite`

### メソッド

- GET
  - JSON(req/res)

### レスポンス

#### 成功時

- ステータスコード:200

#### レスポンスサンプル

```javascript
[
  {
    id: "1",
    inviteuser_id: "1",
    inviteduser_id: "2",
    inviteduser_email: "email2@email.com",
  },
  {
    id: "2",
    inviteuser_id: "1",
    inviteduser_id: "3",
    inviteduser_email: "email3@email.com",
  },

];
```


## 招待登録

### パス

`/invite`

### メソッド

- POST
  - JSON(req/res)

### パラメータ

| パラメータ名 | 型     | 内容            |
| ------------ | ------ | --------------- |
| inviteuser_id  | string | 初期値は0  |
| inviteduser_id | string | 初期値は0  |
| inviteduser_email | string | 招待された家族のメールアドレス |

#### リクエストサンプル

```javascript
{
    inviteuser_id: "1",
    inviteduser_id: "2",
    inviteduser_email: "email2@email.com",
}
```

### レスポンス

#### 成功時

- ステータスコード:200

#### レスポンスサンプル

```javascript
[
  {
    id: "1",
    inviteuser_id: "1",
    inviteduser_id: "2",
    inviteduser_email: "email2@email.com",
  },
];
```
## 招待更新

### パス

`/invite:id`

### メソッド

- PATCH
  - JSON(req/res)

### パラメータ

| パラメータ名 | 型     | 内容            |
| ------------ | ------ | --------------- |
| inviteuser_id  | string | 初期値は0  |
| inviteduser_id | string | 初期値は0  |
| inviteduser_email | string | 招待された家族のメールアドレス |

#### リクエストサンプル

```javascript
{
    inviteuser_id: "1",
    inviteduser_id: "3",
    inviteduser_email: "email3@email.com",
  }
```

### レスポンス

#### 成功時

- ステータスコード:200

#### レスポンスサンプル

```javascript
[
  {
    id: "1",
    inviteuser_id: "1",
    inviteduser_id: "3",
    inviteduser_email: "email3@email.com",
  },
];
```

## 招待削除

### パス

`/invite:id`

### メソッド

- PATCH
  - JSON(req/res)

### パラメータ

| パラメータ名 | 型     | 内容 |
| ------------ | ------ | ---- |
| id           | number |      |

#### リクエストサンプル

```javascript
{
    id: 1,
}
```

### レスポンス

#### 成功時

- ステータスコード:200

#### レスポンスサンプル

```javascript
[
  {
    message: true,
  },
];
```
