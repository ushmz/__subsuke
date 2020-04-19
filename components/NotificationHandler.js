import { Component } from "react";
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from './NotificationRegister';
import * as SQLite from 'expo-sqlite';


export default class NotificationHandler {

  constructor () {
    this.notificationSubscription = Notifications.addListener(this._handleNotification);
  };

  _handleNotification = notification => {
    this.updateNextDueDate(notification);

    if (notification.origin === 'selected') {
      // バックグラウンドで起動中に通知がタップされたとき
    } else if (notification.origin === 'received') {
      // アプリ起動中に通知を受け取ったとき
      // iOSではアプリがフォアグラウンドにあると通知欄にプッシュ通知は表示されない
      // 自前の通知バーを出す?
    }
  };

  updateNextDueDate(notification) {
    let data = notification.data;
    console.log(data);
    const connection = SQLite.openDatabase('subsuke');
    connection.transaction(
      tx => {
        tx.executeSql(
          'update subscriptions set year = ?, month = ?, date = ? where rowid = ?',
          [data.year, data.month, data.date, data.rowid],
          (tx) => console.log('[NotificationHandler.updateNextDueDate()] success to update'),
          (tx, err) => {console.log('[NotificationHandler.updateNextDueDate()]\n'+err)}  
        );
      },
      (err) => console.log(err),
      () =>console.log('success')
    );
    console.log('updated')
  }
}