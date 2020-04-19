import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions';
import * as SQLite from 'expo-sqlite';

export class LocalNotifications {
  /**
   * Ability to schedule an automatically repeated notification is deprecated on iOS
   * and will be removed in the next SDK release.
   */

  constructor() {
    let existingStatus;
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then( ({status: existing}) => existingStatus = existing );
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      Permissions.askAsync(Permissions.NOTIFICATIONS)
        .then( ({status: satus}) => finalStaus = satus );
    };

    if (finalStatus !== 'granted') {
      alert('通知を送信する権限がありません。通知を許可するには設定から通知の権限を付与してください。');
    };
  }

  startListener = () => {
    Notifications.addListener( notification => {
      const connecion = SQLite.openDatabase('subsuke');
      connecion.transaction(
        tx => {
          tx.executeSql(
            "update subscriptions set year = ?, month = ?, date = ? where rowid = ?",
            [notification.data.year, notification.data.month, notification.data.date, notification.data.rowid],
          );
        },
        () => console.log('[LocalNotification.startListener().callback]transaction failed.'),
        () => console.log('[LocalNotification.startListener().callback]transaction success.')
      );
    });
  }

  static createNotification(title, body, extra={}) {
    /**
     * 通知オブジェクトを返す．
     * 
     * Args:
     *     title(string) : 通知タイトル
     *     body(string) : 通知メッセージ
     *     extra(object) : 通知添付データ
     * Returns:
     *     通知オブジェクト(object)
     * 
     * localNotificarion: {
     *     title(string): 通知タイトル,
     *     body(sring): 通知本文,
     *     data(object): optional 添付データ,
     *     categoryId: opttional,
     *     ios: {
     *         sound(boolean): optional サウンドを鳴らすか,
     *         _displayInForeground(boolean): optional フォアグラウンドで通知を表示するか,
     *     },
     *     android: {
     *         channelId (string): optional, but recommended
     *         icon(string): optional アイコンURL
     *         color(string): optional アイコンカラー
     *         sticky(boolean): optional ユーザーが通知を削除できるか(デフォルト:false)
     *         link(string): optional 通知タップ時に遷移する外部リンク
     *     }
     * }
     */
    return {
      title: title,
      body: body,
      data: extra,
      ios: {
        _displayInForeground : true,
      },
    }
  }

  static sendLocalNotification(obj) {
    /**
     * ローカル通知を送信する．
     * 
     * Args:
     *     obj(object) : 通知オブジェクト(パラメータはLocalNotificaion.createNotification()を参照)
     * 
     * Returns:
     *     notificationId(number) : 通知ID
     */
    let notificationId;
    Notifications.presentLocalNotificationAsync(obj)
      .then( value => notificationId = value )
      .catch();
    return notificationId;
  }

  
  static setScheduling(obj, next, cycle) {
    /**
     * 通知予約関数
     * 
     * Args:
     *     obj(object) : 通知オブジェクト(パラメータはLocalNotificaion.createNotification()を参照)
     *     next(date or number) : 通知予定時間(Date object or Unix epoch time)
     *     repeat(string) : 'minute', 'hour', 'day', 'week', 'month', or 'year'.
     * 
     * Returns:
     *     notificationId(number) : 通知ID
     */
    let notificationId;
    const options = {
      time: next,
    }
    if (cycle === '週') {
      options.repeat = 'week';
    } else if (cycle === '月') {
      options.repeat = 'month';
    } else if (cycle === '年') {
      options.repeat = 'year';
    }
    Notifications.scheduleLocalNotificationAsync(obj, options)
      .then( value => notificationId = value )
      .catch();
    
    return notificationId;
  }

  cancelItemFromScheduling(notificationId) {
    let status;
    Notifications.cancelScheduledNotificationAsync(notificationId)
      .then( () => status = true)
      .catch( () => status = false);
    return status;
  }
}