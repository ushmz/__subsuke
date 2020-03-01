# Subsuke アプリ開発

静岡大学の学生３人でやっているプロジェクト「SUBSUKE」のアプリ開発のリポジトリ。

## 開発環境 (2020/3/1時点)
- Mac
- [expo](https://qiita.com/atomyah/items/21a8f35b2783015d77f7)
- [React Native](https://qiita.com/YutamaKotaro/items/dd7846c6db15e2307daa)
- node.js

## ディレクトリ構成
```
SUBSUKE
┣ _tests_ #テストするときにここにを使う
┣ .expo
┣ .expo_-shared
┣ assets
┃   ┣ fonts
┃   ┗ images                    #アプリのアイコンの画像が格納されている。割愛。
┃
┣ components                    #アプリ上のUIのパーツ　ほぼ清水さんの自作or改変
┃   ┣ _tests_
┃   ┣ AddModal.js
┃   ┣ DatePicker.js
┃   ┣ NotificationHandler.js
┃   ┣ NotificationRegister.js
┃   ┣ StyledText.js             #デフォルトで存在
┃   ┣ SubscItem.js
┃   ┣ Subscription.js
┃   ┗ TabBarIcon.js             #デフォルトで存在
┃
┣ constants
┃   ┣ Colors.js
┃   ┗ Layout.js     
┃
┣ navigation
┃   ┣ AppNavigator.js
┃   ┣ AppNavigator.web.js
┃   ┗ MainTabNavigator.js 
┃
┣ node_modules                  #使用しているパッケージが格納。大量
┣ screens
┃   ┣ HomeScreen.js             #アプリのメインの画面
┃   ┣ LinkScreen.js
┃   ┗ SettingScreen.js 
┃
┣ .gitignore
┣ App.js
┣ app.json
┣ babel.config.js
┣ package-lock.json
┣ package.json
```
