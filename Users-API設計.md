## 概要

| ホスト                 | データ形式 |
| ---------------------- | ---------- |
| http://localhost:8080/ | JSON       |

## ユーザ取得

### パス

`/users`

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
    id: 1,
    name: "名前",
    email: "email@email.com",
    uid: "d12bioartlk",
    family_id: "1",
    phonetic: "ナマエ",
    zipcode: "111-2222",
    prefecture: "東京都",
    city: "渋谷区",
    town: "代々木１−１−１",
    apartment:"サニーハウス1011号室",
    phone_number:"090-1234-1234",
    is_owner: "true",
    is_virtual_user: "false",
  },
  {
    id: 2,
    name: "名前2",
    email: "email2@email.com",
    uid: "aadkjwerblsi",
    family_id: "1",
    phonetic: "ナマエ2",
    zipcode: "555-6666",
    prefecture: "大阪府",
    city: "大阪市中央区",
    town: "本町２−２−２",
    apartment:"ロイヤルハウス本町702号室",
    phone_number:"090-2345-6789",
    is_owner: "false",
    is_virtual_user: "true",
  },
  {
    id: 3,
    name: "名前3",
    email: "email3@email.com",
    uid: "lkspgjkeijfd",
    family_id: "2",
    phonetic: "ナマエ3",
    zipcode: "888-9999",
    prefecture: "鹿児島県",
    city: "鹿児島市",
    town: "山下町３−３３",
    apartment:"",
    phone_number:"090-1234-5678",
    is_owner: "false",
    is_virtual_user: "false",
  },
];
```


## ユーザ登録

### パス

`/users`

### メソッド

- POST
  - JSON(req/res)

### パラメータ

| パラメータ名 | 型     | 内容            |
| ------------ | ------ | --------------- |
| name         | string | 名前            |
| email        | string | メールアドレス  |
| uid          | string | firebase の uid |
| family_id    | number | 初期値は 0      |
| phonetic  　　| string   | 名前フリガナ  |
| zipcode  　　| string   | 郵便番号  |
| prefecture  | string   | 都道府県  |
| city  　　　　| string   | 市区町村  |
| town  　　　　| string   | 町名番地  |
| apartment  　| string   | アパート・マンション名  |
| phone_number  | string   | 電話番号  |
| is_owner  | boolean   | 初期値はfalse  |
| is_virtual_user  | boolean   | 初期値はfalse |


#### リクエストサンプル

```javascript
{
    name: "名前",
    email: "email@email.com",
    uid: "d12bioartlk",
    family_id: "1",
    phonetic: "ナマエ",
    zipcode: "111-2222",
    prefecture: "東京都",
    city: "渋谷区",
    town: "代々木１−１−１",
    apartment:"サニーハウス1011号室",
    phone_number:"090-1234-1234",
    is_owner: "true",
    is_virtual_user: "false",
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
    email: "email@email.com",
    uid: "d12bioartlk",
    family_id: "1",
    phonetic: "ナマエ",
    zipcode: "111-2222",
    prefecture: "東京都",
    city: "渋谷区",
    town: "代々木１−１−１",
    apartment:"サニーハウス1011号室",
    phone_number:"090-1234-1234",
    is_owner: "true",
    is_virtual_user: "false",
  },
];
```
## ユーザ更新

### パス

`/users:id`

### メソッド

- PATCH
  - JSON(req/res)

### パラメータ

| パラメータ名 | 型     | 内容            |
| ------------ | ------ | --------------- |
| name         | string | 名前            |
| email        | string | メールアドレス  |
| uid          | string | firebase の uid |
| family_id    | number | 初期値は 0      |
| phonetic  　　| string   | 名前フリガナ  |
| zipcode  　　| string   | 郵便番号  |
| prefecture  | string   | 都道府県  |
| city  　　　　| string   | 市区町村  |
| town  　　　　| string   | 町名番地  |
| apartment  　| string   | アパート・マンション名  |
| phone_number  | string   | 電話番号  |
| is_owner  | boolean   | 初期値はfalse  |
| is_virtual_user  | boolean   | 初期値はfalse |

#### リクエストサンプル

```javascript
{
    id: 1,
    name: "名前",
    email: "email@email.com",
    uid: "d12bioartlk",
    family_id: "0",
    phonetic: "ナマエ",
    zipcode: "111-2222",
    prefecture: "東京都",
    city: "渋谷区",
    town: "代々木１−１−１",
    apartment:"サニーハウス1011号室",
    phone_number:"090-1234-1234",
    is_owner: "true",
    is_virtual_user: "false",
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
    email: "email@email.com",
    uid: "d12bioartlk",
    family_id: "1",
    phonetic: "ナマエ",
    zipcode: "111-2222",
    prefecture: "東京都",
    city: "渋谷区",
    town: "代々木１−１−１",
    apartment:"サニーハウス1011号室",
    phone_number:"090-1234-1234",
    is_owner: "true",
    is_virtual_user: "false",
  },
];
```

## ユーザ削除

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
