# Omusubi

離れて暮らす家族とのコミュニケーションを作るおかずの定期便サービスのアプリです

（テーマ）食事で家族をむすぶ

（アプリ制作背景）
日々の忙しい生活の中で離れて暮らす家族への連絡が疎かになっている。
忙しさの解消と家族とのコミュニケーションを手軽にしたい

（アプリでできること）

- おかずの定期便で家事の効率化
- 離れて暮らす家族の分も注文できる（離れていても同じ食事を共有）

## Omusubi のスクリーンショット

デプロイしたアプリを[AWS ECS](https://omusubi.mse-stage.com/)で確認できます

![image](https://github.com/Ai1029/Omusubi/blob/main/images/desktop.png?raw=true)
<img src="https://github.com/Ai1029/Omusubi/blob/main/images/smartphone.png?raw=true" width="50%">

- [Omusubi](#omusubi)
  - [Omusubi のスクリーンショット](#omusubi-のスクリーンショット)
  - [機能・ページ遷移図](#機能ページ遷移図)
    - [ユーザに関する機能](#ユーザに関する機能)
    - [おかず購入に関する機能](#おかず購入に関する機能)
    - [工夫した点](#工夫した点)
  - [設計](#設計)
  - [環境構成](#環境構成)
  - [環境構築](#環境構築)
  - [確認方法](#確認方法)
  - [使用技術](#使用技術)
  - [追加したい機能](#追加したい機能)
    - [定期便の機能充実](#定期便の機能充実)
    - [LLM でおかずのおすすめ機能](#llm-でおかずのおすすめ機能)
    - [家族を招待する機能](#家族を招待する機能)
    - [家族内で食事風景の共有ができる機能](#家族内で食事風景の共有ができる機能)

## 機能・ページ遷移図

### ユーザに関する機能

- ユーザーアカウントの作成と認証機能：ユーザーがアカウントを作成し、ログインしてアプリを利用できる。（登録していないユーザーはおかずの閲覧可能）
- グループ機能：登録ユーザーが別のユーザー（家族）を登録することができる。
- プロフィール管理機能：ユーザーが自分のプロフィール情報を編集・更新できる。

### おかず購入に関する機能

- おかずを定期購入できる
- 購入履歴機能：ユーザーが購入したおかずの履歴を見ることができる。

![image](https://github.com/Ai1029/Omusubi/blob/main/images/function.png?raw=true)
![image](https://github.com/Ai1029/Omusubi/blob/main/images/page.png?raw=true)

### 工夫した点

Notion と Figma を活用し、チーム内でデータを共有。

シンプルで直感的なインターフェース: ユーザーが製品を簡単に操作できるように、直感的なメニューとアイコンを使用し、余分な手順や複雑な操作を排除。

一貫性のあるデザイン: 統一された配色、フォント、アイコン、およびレイアウトを使用して、ユーザーが異なる画面や機能間で一貫したデザインを感じることができます。

モバイルフレンドリー: モバイルデバイス上での操作を考慮し、タッチ操作に適した大きなボタンやジェスチャーを導入します。また、画面サイズに応じてコンテンツが最適に表示されるようにします。

レスポンシブデザイン: デスクトップ、タブレット、スマートフォンなど、さまざまなデバイスで製品が適切に表示されるように、レスポンシブデザインを採用します。

パフォーマンスと速度: 快適なユーザーエクスペリエンスを提供するために、製品の応答性とパフォーマンスを最適化します。ページの読み込み時間を短縮し、スムーズな操作を実現します。

## 設計

- [ユーザー API 設計](https://github.com/Ai1029/Omusubi/blob/main/Users-API%E8%A8%AD%E8%A8%88.md)
- [家族 API 設計](https://github.com/Ai1029/Omusubi/blob/main/Family-API%E8%A8%AD%E8%A8%88.md)
- [招待 API 設計](https://github.com/Ai1029/Omusubi/blob/main/Invite-API%E8%A8%AD%E8%A8%88.md)
- [承認 API 設計](https://github.com/Ai1029/Omusubi/blob/main/Approve-API%E8%A8%AD%E8%A8%88.md)
- ER 図

![image](https://github.com/Ai1029/Omusubi/blob/main/ER%E5%9B%B3%E7%A2%BA%E5%AE%9A.png?raw=true)

## 環境構成

| 項目         | 内容                  | ポート |
| ------------ | --------------------- | ------ |
| データベース | MySQL                 | 3306   |
| API サーバ   | Go                    | 8080   |
| └ ORM        | Prisma                |        |
| フロント     | NEXT.js（TypeScript） | 3000   |

![image](https://github.com/Ai1029/Omusubi/blob/main/images/enviroment.png?raw=true)

## 環境構築

このアプリをクローンして実行するには、コンピュータに Git と Node.js がインストールされている必要があります。

**ダウンロードとインストールの手順**

1. このリポジトリを git clone します。

```bash
$ git clone https://github.com/Ai1029/Omusubi.git
```

2. Omusubi に入ります

```bash
$ cd Omusubi
```

3. Omusubi ディレクトリの直下に`.env` ファイルを作成

```
DB_ROOT_HOST=db
DB_NAME=omusubi
DB_USER=（ユーザー名を入れてください）
DB_PASS=（パスワードを入れてください）
TZ=Asia/Tokyo
```

4. Firebase でプロジェクトを作成します。Firebase Authentication の認証機能を有効にします。メールとパスワードの認証を設定します。

5. front ディレクトリの中の firebase ディレクトリの中の firebase.ts ファイルに apiKey などが`.env`ファイルで設定できるようになっています。front ディレクトリの直下に`.env`ファイルを作成して、先ほど作成した Firebase のプロジェクト設定から設定情報をコピーして`.env`ファイルに貼り付けてください。

6. 5 で作成した`.env`ファイルの Firebase の設定情報の下に以下の内容を追記します。

```
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL_SSR=http://server:3001
NEXT_PUBLIC_APP_SITE_URL=http://localhost:3000
```

7. AWS で S3 のバケットを作成します。

8. 4 で作成した Firebase プロジェクトの設定のサービスアカウントから秘密鍵を生成します。
   秘密鍵を api ディレクトリの直下に置きます。（.gitignore にファイル名を追加してください。）

9. api ディレクトリの直下に`.env`ファイルを作成します。
   DATABASE_URL のユーザー名とパスワードの部分は、先ほど MyPortfolio ディレクトリの直下に作成した`.env`ファイルのユーザー名とパスワードに修正します。
   AWS は アクセスキー、シークレットキー、リージョンとともに、6 で作成した AWS のバケット名を入れてください。
   GOOGLE_APPLICATION_CREDENTIALS には 7 で server ディレクトリの直下に置いた Firebase で作成した json ファイルの名前を入れます。

```
DATABASE_URL="mysql://ユーザー名:パスワード@portfolio_db:3306/portfolio"

AWS_ACCESS_KEY_ID=アクセスキー
AWS_SECRET_ACCESS_KEY=シークレットキー
AWS_REGION=リージョン
AWS_BUCKET_NAME=バケット名

export GOOGLE_APPLICATION_CREDENTIALS="/usr/src/server/7でserverディレクトリの直下に置いたFirebaseで作成したjsonファイル名
```

9. front ディレクトリで依存関係をインストールします

```bash
$ cd front
$ npm install
```

10. 以下のコマンドで Docker のコンテナを立ち上げます

```bash
$ docker compose up -d
```

## 確認方法

http://localhost:3000 をブラウザで開き、表示を確認します。

## 使用技術

- Next.js 13.4.3 ※フロントエンド
- TypeScript 5.0.4
- tailwind css 3.3.2
- Firebase 9.22.0 　※認証
- GO 1.20.4 ※バックエンド
- ECS（Fargate）
- ECR
- RDS（MySQL 8.0.23
  ）
- S3 　※画像の保管

## 追加したい機能

### 定期便の機能充実

- [ ] キャンセル、定期便の期間を変更
- [ ] 苦手な食材、メニューを除外できる

### LLM でおかずのおすすめ機能

- [ ] おすすめ機能で購入者の好みに合わせたおかずをリコメンド

### 家族を招待する機能

- [ ] 購入者が家族を招待し、家族自身も TOP 画面から次回送られてくるプランを確認できる

### 家族内で食事風景の共有ができる機能

- [ ] 食事風景の写真を共有できるページを作成
      また写真の投稿に対して、コメントを書き込むことができる
