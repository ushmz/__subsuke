# Subsuke アプリ開発 （アーカイブ済み）

静岡大学の学生３人でやっているプロジェクト「SUBSUKE」のアプリ開発のリポジトリ（**アーカイブ済み**）。
開発は[このリポジトリ](https://github.com/ushmz/subsuke)で継続中。


## ディレクトリ構成

``` txt
SUBSUKE
┣ assets
┃   ┣ fonts                     # アプリで表示されるフォントファイル
┃   ┗ images                    # アプリのアイコンの画像が格納されている。割愛。
┃
┣ components                    # アプリ上のUIのパーツ
┃   ┣ _tests_
┃   ┣ AddModal.js               # サブスクをリストに追加するモーダル
┃   ┣ DatePicker.js             # 日付選択に使用するコンポーネント
┃   ┣ NotificationHandler.js    # 通知を受信した際に表示されるコンポーネント(リストの更新等のロジックもここで行う)
┃   ┣ NotificationRegister.js   # 通知機能のアクセス許可を行うコンポーネント．通知トークンの登録も行う．
┃   ┣ StyledText.js             # テーマごとのテキストコンポーネント
┃   ┣ SubscItem.js              # メイン画面のリストアイテム
┃   ┣ Subscription.js           #
┃   ┗ TabBarIcon.js             # タブナビゲーションに表示されているアイコン
┃
┣ constants                     # アプリケーション全体で使用する定数を定義
┃   ┣ Color.js                  # テーマごとの使用色を定義(下記のColors.jsと統合予定)
┃   ┣ Colors.js                 # デフォルトで定義されている色(上記ののColor.jsと統合予定)
┃   ┗ Layout.js                 # パーツレイアウトに関する値
┃
┣ navigation                    # ページ遷移の定義
┃   ┣ AppNavigator.js           # モバイルアプリケーションでのナビゲーションを定義
┃   ┣ AppNavigator.web.js       # ブラウザー(Expo)でのナビゲーションを定義
┃   ┗ MainTabNavigator.js       # 最初に呼び出されるナビゲーター
┃
┣ screens                       # アプリケーションの画面
┃   ┣ HomeScreen.js             # アプリのメインの画面
┃   ┣ LinkScreen.js             # Linkを表示する画面．解約リンクや，分析を表示できたら．
┃   ┗ SettingScreen.js          # 設定画面
┃
┣ Services                      # ロジック部分を切り出して格納
┃   ┣LocalNoificaitons.js       # 通知サーバーを経由しない通知ロジック．iOSではローカル通知のスケジュールAPIが廃止予定なので削除予定．
┃
┣ .gitignore
┣ App.js                        # 起動スクリプト
┣ app.json                      # アプリケーションに関する情報を記載．
┣ babel.config.js
┣ package-lock.json
┗ package.json
```

## ブランチの構成

実験的に行う．変更の可能性大．

- master  
常に最新のコードを反映．
- develop  
リリース予定の機能の開発に用いる．
- hotfix  
リリース後のバグ修正に用いる．
- release  
リリースされたコードを反映していく．
- feature  
新機能の提案，開発に実験的に用いる．
