## 概要

| ホスト                 | データ形式 |
| ---------------------- | ---------- |
| http://localhost:8080/ | JSON       |

## 家族グループ取得

### パス

`/family`

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
    name: "家族1",
    owneruser_id: "1",
  },
  {
    id: "2",
    name: "家族2",
    owneruser_id: "2",
  },

];
```


## 家族グループ登録

### パス

`/family`

### メソッド

- POST
  - JSON(req/res)

### パラメータ

| パラメータ名 | 型     | 内容            |
| ------------ | ------ | --------------- |
| name         | string | 家族グループの名前 |
| owneruser_id | string | 初期値は0        |


#### リクエストサンプル

```javascript
{
    name: "名前",
    owneruser_id: "1",
}
```

### レスポンス

#### 成功時

- ステータスコード:200

#### レスポンスサンプル

```javascript
[
  {
    id: 1,
    name: "名前",
    owneruser_id: "1",
  },
];
```
## 家族グループ更新

### パス

`/users:id`

### メソッド

- PATCH
  - JSON(req/res)

### パラメータ

| パラメータ名 | 型     | 内容            |
| ------------ | ------ | --------------- |
| name         | string | 家族グループの名前 |
| owneruser_id | string | 初期値は0        |

#### リクエストサンプル

```javascript
{
    name: "名前",
    owneruser_id: "1",
  }
```

### レスポンス

#### 成功時

- ステータスコード:200

#### レスポンスサンプル

```javascript
[
  {
    id: 1,
    name: "名前",
    owneruser_id: "1",
  },
];
```

## 家族グループ削除

### パス

`/users:id`

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
