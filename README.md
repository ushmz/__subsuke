# Subsuke アプリ開発

静岡大学の学生３人でやっているプロジェクト「SUBSUKE」のアプリ開発のリポジトリ。

## Warning

JavascriptからTypescriptに書き換え中です。動作確認したい場合、ローカルで実行したい場合、新たな機能開発を行いたい場合は別のブランチを利用してください。

## ディレクトリ構成 & TODO

``` txt
SUBSUKE
┣ assets
┃   ┣ fonts                     # アプリで表示されるフォントファイル
┃   ┗ images                    # アプリのアイコンの画像が格納されている。割愛。
┃
┣ components                    # アプリ上のUIのパーツ
┃   ┣ _tests_
┃   ┣ AddModal.js => AddModal.tsx                           # サブスクをリストに追加するモーダル
┃   ┣ DatePicker.js => DatePicker.tsx                       # 日付選択に使用するコンポーネント
┃   ┣ NotificationHandler.js => NotificationHandler.tsx     # 通知を受信した際に表示されるコンポーネント(リストの更新等のロジックもここで行う)
┃   ┣ NotificationRegister.js => NotificationRegister.tsx   # 通知機能のアクセス許可を行うコンポーネント．通知トークンの登録も行う．
┃   ┣ StyledText.js => StyledText.tsx                       # テーマごとのテキストコンポーネント
┃   ┣ SubscItem.js => SubscItem.tsx                         # メイン画面のリストアイテム
┃   ┗ TabBarIcon.js => TabBarIcon.tsx                       # タブナビゲーションに表示されているアイコン
┃
┣ constants          # アプリケーション全体で使用する定数を定義
┃   ┣ ColorSets.ts   # テーマごとの使用色を定義
┃   ┣ Layout.js      # パーツレイアウトに関する数値
┃   ┗ Consts.js      # その他の定数はここ
┃
┣ navigation                                       # ページ遷移の定義
┃   ┣ AppNavigator.js => AppNavigator.ts           # モバイルアプリケーションでのナビゲーションを定義
┃   ┣ AppNavigator.web.js => AppNavigator.web.ts   # ブラウザー(Expo)でのナビゲーションを定義
┃   ┗ MainTabNavigator.js => MainTabNavigator.ts   # 最初に呼び出されるナビゲーター
┃
┣ screens                                     # アプリケーションの画面
┃   ┣ HomeScreen.js => HomeScreen.tsx         # アプリのメインの画面
┃   ┣ LinkScreen.js => LinkScreen.tsx         # Linkを表示する画面．解約リンクや，分析を表示できたら．
┃   ┗ SettingScreen.js => SettingScreen.tsx   # 設定画面
┃
┣ Services                                  # ロジック部分を切り出して格納
┃   ┣ LocalNoificaitons.js                  # 通知サーバーを経由しない通知ロジック．iOSではローカル通知のスケジュールAPIが廃止予定なので削除予定．
┃   ┣ NotificationServerRepository.js       # 通知サーバーにリクエストを送信するメソッド 
┃   ┣ SQLRepository.js => SQLRepository.ts  # データベース関連のメソッド
┃   ┗ totalCost.js => totalCost.ts          # メイン画面で使用するメソッド(他の細かなメソッドもまとめる予定)
┃
┣ .gitignore
┣ App.js                        # 起動スクリプト
┣ app.json                      # アプリケーションに関する情報を記載．
┣ babel.config.js
┣ package-lock.json
┣ package.json
┗ tsconfig.json
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
