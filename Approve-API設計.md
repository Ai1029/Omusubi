## 概要

| ホスト                 | データ形式 |
| ---------------------- | ---------- |
| http://localhost:8080/ | JSON       |

## 承認取得

### パス

`/approve`

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
    approveuser_id: "1",
    approveduser_id: "2",
    created_at: "2023-5-29",
  },
  {
    id: "2",
    approveuser_id: "1",
    approveduser_id: "3",
    created_at: "2023-5-29",
  },

];
```


## 承認登録

### パス

`/approve`

### メソッド

- POST
  - JSON(req/res)

### パラメータ

| パラメータ名 | 型     | 内容            |
| ------------ | ------ | --------------- |
| approveuser_id  | string | 初期値は0  |
| approveduser_id | string | 初期値は0  |


#### リクエストサンプル

```javascript
{
    approveuser_id: "1",
    approveduser_id: "2",
    
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
    approveuser_id: "1",
    approveduser_id: "2",
    created_at: "2023-5-29",
  },
];
```


