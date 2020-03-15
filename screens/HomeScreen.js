import * as WebBrowser from 'expo-web-browser';
import * as SQLite from 'expo-sqlite';
import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Body,
  Button,
  Form,
  Header,
  Item,
  Label,
  Left,
  Right,
  Picker,
  Title,
} from 'native-base';

import { Appearance } from 'react-native-appearance';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modalbox';
import Swipeout from 'react-native-swipeout';
import Swiper from 'react-native-swiper';

import registerForPushNotificationsAsync from '../components/NotificationRegister'
import SubsucItem from '../components/SubscItem';

export default class HomeScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {list: {_array: [], length: 0}, service: '', price: '', cycle: '', due: new Date(), isVisible: false, token: ''};
    this.setValue = this.setValue.bind(this);
    this.PUSH_ENDPOINT = 'https://subsuke-notification-server.herokuapp.com/notification';
    this.scheme = Appearance.getColorScheme();
  }

  componentDidMount() {
    /**
     * コンポーネントがマウントされたときに呼び出される．初期化として以下の3点を行う．
     *   - データベースへの接続，(なければ作成)
     *   - データベースの内容をアイテムリスト(State)に反映
     *   - プッシュトークンの登録．(TODO:アプリ起動時に移動)
     */
    let itemList = {};
    console.log('start DBSync...');
    var proomiseDBSync = function() {
      return new Promise((resolve, reject) => {        
        const connection = SQLite.openDatabase('subsuke');
        connection.transaction(tx => {
          /**************************************************
           * drop table
           *
          tx.executeSql(
            "drop table subscription",
            null,
            (tx, {rows}) => {
              console.log('[componentDidMount] Successed to drop table.');
            },
            (tx, err) => {
              console.log('[componentDidMount] Failed to drop table.');
              console.log(err);
              return true;
            },
          );
          /*************************************************: */
            tx.executeSql(
              "create table if not exists subscription (\
                service varchar(64) not null,\
                price int not null,\
                cycle varchar(10) not null,\
                due int not null\
              )",
              null,
              (tx, {rows}) => {
                console.log('[componentDidMount] Successed to connect DB.');
              },
              (tx, err) => {
                console.log('[componentDidMount] Failed to connect DB.');
                console.log(err);
                return true;
              },
            );
          /***************************************************
           * delete all items from database.
           *
            tx.executeSql(
              "delete from subscription",
              null,
              (tx, {rows}) => {console.log('delete success');},
              (tx, error) => {
                console.log('delete failed');
                return true;
              }
            );
          /**************************************************/
          
          /***************************************************
           *
            tx.executeSql(
              "insert into subscription(service, price, cycle, due) values(?,?,?,?);",
              ['dummy', 900, 'month', 10],
              (tx, {rows}) => {console.log('insert success');},
              (tx, error) => {
                console.log('insert failed');
                console.log(error);
                return true;
              }
            );
          /**************************************************/
            tx.executeSql(
              "select rowid, service, price, cycle, due from subscription;",
              null,
              (_, {rows}) => {
                itemList = rows;
              },
              (tx, err) => {
                console.log('[componentDidMount] Failed to collect data.');
                console.log(err);
                return true;
              }
            );
          },
          () => {
            reject('[componentDidMount] Transaction failed.');
            reject({_array: [], length: 0});
          },
          () => {
            console.log('[componentDidMount] Transaction successed.');
            resolve(itemList);
          }
        );
      })
    };

    proomiseDBSync().then((itemList) => {
      this.setState({list: itemList});
      console.log('sync complete.');
    }).catch((error) => {
      console.log(error);
    });

    registerForPushNotificationsAsync().then((token) => {
      this.setState({token: token});
    }).catch((error) => {
      console.log(error);
    });
  }

  _onPressAdd = () => {
    /**
     * リストへのアイテム追加時に呼び出される関数
     * 入力フォームの内容をデータベースに登録，通知サーバーに登録
     * 追加した内容でStateを更新，入力フォームの内容をリセット
     */

     let rowid;
    let items = {};

    const additional = {
      'service': this.state.service,
      'price': this.state.price,
      'cycle': this.state.cycle,
      'due': this.handleDuedate(this.state.due)
    };

    const connection = SQLite.openDatabase('subsuke');
    connection.transaction(
      tx => {
        tx.executeSql(
          "insert into subscription(service, price, cycle, due) values(?,?,?,?);",
          [additional['service'], additional['price'], additional['cycle'], additional['due']],
          (tx, resultset) => {
            // Args : (tx, {rows})
            rowid = resultset['insertId'];
            console.log('[_onPressAdd] insert success (insert ID : ' + rowid+')');
          },
          (tx, error) => {
            console.log('[_onPressAdd] failed to insert');
            console.log(error);
            return true;
          }
        );
        tx.executeSql(
          'select rowid, service, price, cycle, due from subscription;',
          null,
          (_, {rows}) => {
            items = rows;
            console.log('[_onPressAdd] success to collect data.');
          },
          (tx, error) => {
            console.log('[_onPressAdd] Cannot correct data.');
            console.log(error);
            return true;
          }
        );
      },
      () => {console.log('[_onPressAdd] failed to fetch user item')},
      () => {

        let resp = fetch(this.PUSH_ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: {
              value: this.state.token,
            },
            user: {
              username: 'rabhareit',
            },
            notification: {
              message: 'もうすぐ'+this.state.service+'のお支払日です．',
              cycle: this.state.cycle,
              date: this.state.due,
              rowid: rowid,
            },
          }),
        });

        this.setState({
          list: items, 
          service: '', 
          price: '', 
          cycle: '', 
          due: new Date()
        });
      }
    );
    this.refs.addModal.close();
  }

  _onDelete = (rowid) => {
    /**
     * アプリでのリスト上のリストのアイテムの削除時に呼び出される関数．
     * データベースから削除，通知サーバーから削除
     * 削除された内容でStateを更新，入力フォームの内容をリセット
     */

    let items = {};
    const connection = SQLite.openDatabase('subsuke');
    connection.transaction(
      tx => {
        tx.executeSql(
          "delete from subscription where rowid = ?",
          [rowid],
          (tx, {rows}) => {
            console.log('[_onDelete] successed to delete item');
          },
          (tx, error) => {
            console.log('[_onDelete] failed to delete item');
            return true;
          }
        );
        tx.executeSql(
          'select rowid, service, price, cycle, due from subscription;',
          null,
          (_, {rows}) => {
            items = rows;
            console.log('[_onDelete] success to collect data.');
          },
          (tx, error) => {
            console.log('[_onDelete] Cannot correct data.');
            console.log(error);
            return true;
          }
        );
      },
      () => {console.log('[_onDelete] Transaction failed.');},
      () => {
        console.log('[_omDelete] Transaction success.');
        
        fetch(this.PUSH_ENDPOINT+'/'+rowid+':'+this.state.token, {
          method: 'DELETE',
        });

        this.setState({
          list: items, 
          service: '', 
          price: '', 
          cycle: '', 
          due: new Date()
        });
      }
    )
  } 

  setValue = (stateName, value) => {
    /**
     * フォームの内容の変更時に呼び出される．
     * 第1引数の名前のstateの値を第2引数の値で更新する．
     */
    this.setState({[stateName]: value});
  };

  handleDuedate = (input) => {
    /**
     * execute in _onPressAdd()
     * this use the value of state[cycle]
     * 
     * 必要ない可能性があるので要検討
     */
    let duedate = '';
    if (this.state.cycle === '週') {
      duedate = input.getDay();
    } else if (this.state.cycle === '月') {
      duedate = input.getDate();
    } else if (this.state.cycle === '年') {
      duedate = (input.getMonth()+1)*100 + input.getDate();
    }
    //this.setState({due: duedate});
    return duedate;
  };

  handleConfirm = date => {
    this.setState({isVisible: false});
    this.setState({due: date});
  };

  formatDate = () => {
    /**
     * State(due)のデータオブジェクトを日本語表記にフォーマットする．
     */
    return this.state.due.getFullYear() + "年 " + (this.state.due.getMonth()+1) + "月 " + this.state.due.getDate() + "日"
  }

  render() {
    /**
     * レンダー関数
     */
    const itemList = this.state.list;
    var totalWeeklyCost = 0;
    var totalMonthlyCost = 0;
    var totalYearlyCost = 0;
    
    if ((itemList.length) !== 0 ){
        itemList._array.forEach((current) => {
          if (current.cycle === '週') {
            totalWeeklyCost += parseInt(current.price);
            totalMonthlyCost += parseInt(current.price)*4;
            totalYearlyCost += parseInt(current.price)*4*12;
          } else if (current.cycle === '月') {
            totalWeeklyCost += parseInt(current.price)/4;
            totalMonthlyCost += parseInt(current.price);
            totalYearlyCost += parseInt(current.price)*12;
          } else if (current.cycle === '年') {
            totalWeeklyCost += parseInt(current.price)/12/4;
            totalMonthlyCost += parseInt(current.price)/12;
            totalYearlyCost += parseInt(current.price);
          }
          //totalCost += parseInt(current.price);
        });
    }

    let UserFlatlist = () => {
      if (itemList.length !== 0) {
        return (
          <FlatList
            data={itemList._array}
            style={styles.flatlist}
            keyExtractor={item => item.rowid.toString()}
            renderItem={({item}) => {
              const swipeBtn = [{
                text: '削除',
                backgroundColor: 'red',
                underlayColor: 'rgba(0,0,0,1)',
                onPress: () => {this._onDelete(item.rowid.toString())},
              }];
              return (
                <Swipeout right={swipeBtn} autoClose={true} backgroundColor='transparent'>
                  <SubsucItem {...item} />
                </Swipeout>
              );
            }}
          />
        )
      } else {
        return <Text style={{textAlign: 'center'}, styles.txtScheme}>登録済みのサービスはありません</Text>            
      }
    }

    return (
      <View style={this.scheme==='dark' ? {backgroundColor: 'rgb(65,65,65)', flex: 1} : {flex: 1} }>
        {/*Header 181 124 252 or 98 0 238*/}
        <Header style={{backgroundColor: this.scheme==='dark'?'rgb(188, 135, 255)':'rgb(181, 124, 252)'}} transparent>
          <Body>
            <Title style={styles.txtScheme}>Subsuke</Title>
          </Body>
        </Header>

          <View style={styles.welcomeContainer}>
            <Swiper style={styles.wrapper} showsButtons={true}>
              <View style={styles.slide}>
                <Text style={styles.txtScheme}>{'週あたり  ¥' + totalWeeklyCost}</Text>
              </View>
              <View style={styles.slide}>
                <Text style={styles.txtScheme}>{'月あたり  ¥' + totalMonthlyCost}</Text>
              </View>
              <View style={styles.slide}>
                <Text style={styles.txtScheme}>{'年あたり  ¥' + totalYearlyCost}</Text>
              </View>
            </Swiper>

          </View>

        <UserFlatlist />
        
        {/*Modal Contents*/}
        <Modal style={styles.modal} position={'bottom'} ref={'addModal'}>
          {/* Header */}
          <View style={{flex: 0.2, flexDirection: "row"}}>
            <Icon 
              style={{marginTop: 'auto', marginBottom: 'auto', flex:0.1}} 
              name="close"
              size={32}
              color={this.scheme==='dark'?'#fff':'#000'}
              onPress={() => this.refs.addModal.close()}></Icon>
            <View style={{flex: 0.8}} >
              <Icon
                style={{marginLeft: "auto", marginRight: 'auto', flex: 0.6}}
                name="chevron-down"
                size={32}
                color={this.scheme==='dark'?'#a0a0a0':'#000'}></Icon>
            </View>
            <TouchableOpacity style={[styles.button, {flex: 0.1, marginRight: '1%'}]} onPress={this._onPressAdd} >
              <Text style={{color: 'white', fontSize: 18, textAlign: 'center', marginTop: 15}}>追加</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 2.0}}>
            <Form>
              <Item >
                <Label></Label>
                <TextInput type="text"
                       name={"service"}
                       style={{fontSize: 36}}
                       placeholder={"サブスクを追加"}
                       value={this.state.service}
                       onChange={e => {this.setState({service: e.nativeEvent.text})}} />
              </Item>
              <Item >
                <Label><Icon name="wallet" size={32} color={this.scheme==='dark'?'#fff':'#000'}></Icon></Label>
                <TextInput type="number"
                       keyboardType={Platform.select({ios: "number-pad", android: "numeric"})}
                       name={"price"}
                       style={{fontSize: 24, margin: 10}}
                       placeholder={"金額を追加"}
                       placeholderTextColor={this.scheme==='dark'?'#a0a0a0':'#000'}
                       value={this.state.price}
                       onChange={e => {this.setState({price: e.nativeEvent.text})}} />
              </Item>

              <Item Picker>
                <Label><Icon name="cached" size={32} color={this.scheme==='dark'?'#fff':'#000'}></Icon></Label>
                <Picker 
                  itemStyle={styles.bgScheme}
                  iosHeader={'支払いサイクル'}
                  headerStyle={{backgroundColor: this.scheme==='dark'?'#000':'#fff'}}
                  headerTitleStyle={styles.txtScheme}
                  headerBackButtonText={'戻る'}
                  //headerBackButtonTextStyle={}
                  modalStyle={styles.bgScheme}
                  mdoe={'dropdown'}
                  prompt={'支払いサイクル'} 
                  placeholder={'支払いサイクル'}
                  placeholderStyle={styles.txtScheme}
                  textStyle={{color: this.scheme==='dark'?'#fff':'#000'}}
                  itemTextStyle={{color: this.scheme==='dark'?'#fff':'#000'}}
                  selectedValue={this.state.cycle} 
                  onValueChange={(value) => {this.setState({cycle: value})}}>
                  <Picker.Item label={'毎週'} value={'週'} />
                  <Picker.Item label={'毎月'} value={'月'} />
                  <Picker.Item label={'毎年'} value={'年'} />
                </Picker>
              </Item>

              <View>
                <Item >
                  <Label><Icon name="calendar" size={32} color={this.scheme==='dark'?'#fff':'#000'}></Icon></Label>
                  <View style={{flexDirection:'column', marginTop:5, marginLeft:10}}>
                    <Text style={styles.txtScheme}>次のお支払日</Text>
                    <Button transparent onPress={() => {this.setState({isVisible: true})}}>
                        <Text style={{fontSize: 18}, styles.txtScheme} >
                          {this.formatDate()}
                        </Text>
                    </Button>
                    <DateTimePickerModal
                        cancelTextIOS={"キャンセル"}
                        confirmTextIOS={"OK"}
                        headerTextIOS={"日付を選択"}
                        isVisible={this.state.isVisible}
                        isDarkModeEnabled={this.scheme==='dark'}
                        mode="date"
                        minimumDate={this.state.due}
                        onConfirm={this.handleConfirm}
                        onCancel={() => {this.setState({isVisible: false})}}
                        locale="ja"
                    />
                  </View>
                </Item>
              </View>
            </Form>
          </View>
        </Modal>

        {/*Modal Sammon Button*/}
        <View style={{top: '85%', right: '5%', position: 'absolute'}}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => this.refs.addModal.open()}>
            <Icon name='plus' size={36} color={'white'} style={{top: 10}}></Icon>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    //flex: 0.2,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    height: '20%',
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    flex: 0.2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  
  // user settings
  txtScheme: {
    color: Appearance.getColorScheme() === 'dark'?'#fff':'#000',
  },
  bgScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(65, 65, 65)' : '#ffffff',
  },
  uiScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#000' : '#fff'
  },
  flatlist: {
    flex: 1.0,
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(65,65,65)' : '#fff',
    borderTopWidth: 1,
    borderTopColor: Appearance.getColorScheme() === 'dark' ? 'rgb(90, 90, 90)' : '#000',
  },
  circleButton: {
    backgroundColor: 'rgb(93, 43, 136)',
    alignItems: 'center',
    height: 56,
    width: 56,
    borderRadius: 120,
  },

  modal: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(65,65,65)' : '#fff',
    height: 720,
    borderTopStartRadius: 10,
  },
  button: {
    backgroundColor: 'rgb(93, 43, 136)',
    minHeight: '70%',
    marginTop: 'auto',
    marginBottom: 'auto',
    minWidth: '4%',
    marginLeft: 'auto',
    marginRight: 'auto',    
    borderRadius: 10,
  },
  actionButtons: {
    // in Modal
    flexDirection: 'row',
    marginTop: 20,
  },
  right: {
    width: '10%',
    //alignItems: 'flex-end',
  },
  textInput: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 36,
    marginHorizontal: '10%',
    marginVertical: '10%',
    textAlign: 'center',
  },
  wrapper:{},
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
