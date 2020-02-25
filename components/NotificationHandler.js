import { Component } from "react";
import Notifications from 'expo';
import registerForPushNotificationsAsync from './NotificationRegister';


export default class NotificationHandler extends Component {

  constructor () {
    this.state = { notification: {}, };
  };

  componentDidMount() {
    registerForPushNotificationsAsync();
    this.notificationSubscription = Notifications.addListener(this._handleNotification);
  };

  _handleNotification = notification => {
    // do whatever you want to do with the notification
    this.setState({ notification: notification });
    if (notification.origin === 'selected') {
      // バックグラウンドで起動中に通知がタップされたとき
    } else if (notification.origin === 'received') {
      // アプリ起動中に通知を受け取ったとき
      // iOSではアプリがフォアグラウンドにあると通知欄にプッシュ通知は表示されない
      // 自前の通知バーを出す?
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Origin: {this.state.notification.origin}</Text>
        <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
      </View>
    );
  }
}