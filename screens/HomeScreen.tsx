import * as WebBrowser from 'expo-web-browser';
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
  Toast,
} from 'native-base';

import { Appearance } from 'react-native-appearance';

// Not founnd @types
// lack of dependency
import DateTimePickerModal from "react-native-modal-datetime-picker";
//Not found @types
import Swipeout from 'react-native-swipeout';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modalbox';
import Swiper from 'react-native-swiper';

import NotificationHandler from '../components/NotificationHandler';
import registerForPushNotificationsAsync from '../components/NotificationRegister'
import SubsucItem from '../components/SubscItem';
import { THEME } from '../constants/Colors';
import totalCost from '../services/totalCost';
import {
  createDBIfNotExistAsync, 
  selectAllAsync, 
  insertItemAsync, 
  deleteItemByRowidAsync 
} from '../services/SQLRepository';
import { registNotification, deleteNotification } from '../services/NotificationServerRepository';

// import for type
import {SQLResultSetRowList} from 'expo-sqlite';

interface UserItem extends SQLResultSetRowList {
  service: string,
  price: string,
  cycle: string,
  due: Date
}

class UserItemList implements SQLResultSetRowList {
  
  private itemList: Array<UserItem>;
  length: number;
  
  constructor(rs?: SQLResultSetRowList) {
    this.itemList = new Array<UserItem>();
    this.length = this.itemList.length;
    if(rs) {
      this.convert(rs);
    }
  }

  item = (index: number) => {
    return this.itemList[index]
  }

  convert = (rs: SQLResultSetRowList) => {
    for(let i = 0; i < rs.length; i++) {
      this.itemList.push(rs.item(i));
    }
  }

  addItem = (item: UserItem) => {
    this.itemList.push(item);
    this.length = this.itemList.length;
  }
}

interface HomeScreenProps {
}

interface HomescreenState {
  list?: SQLResultSetRowList,
  service?: string,
  price?: string,
  cycle?: string,
  due?: Date,
  isVisible?: Boolean,
  token?: string
}

interface AdditionalTempState {
  list?: SQLResultSetRowList,
  service?: string,
  price?: string,
  cycle?: string,
  year?: number,
  month?: number,
  date?: number,
  due?: Date,
  isVisible?: Boolean,
  token?: string
}

export default class HomeScreen extends React.Component<HomeScreenProps, HomescreenState> {
  
  constructor(props: HomeScreenProps) {
    super(props);
    this.state = {list: new UserItemList(), service: '', price: '', cycle: '月', due: new Date(), isVisible: false, token: ''};
    this.setValue = this.setValue.bind(this);
    this.PUSH_ENDPOINT = 'https://subsuke-notification-server.herokuapp.com/notification';
    this.theme = props.screenProps.theme;
    //this.theme = Appearance.getColorScheme();
    this.handler = new NotificationHandler();
  }

  componentDidMount() {
    /**
     * コンポーネントがマウントされたときに呼び出される．初期化として以下の3点を行う．
     *   - データベースへの接続，(なければ作成)
     *   - データベースの内容をアイテムリスト(State)に反映
     *   - プッシュトークンの登録．(TODO:アプリ起動時に移動)
     */
    console.log('/*--------------------------*/');
    console.log('start DBSync...');

    createDBIfNotExistAsync()
    .then( (_: any) => selectAllAsync() )
    .then( (resolved: any) => {
      this.setState({list: resolved});
      console.log('sync complete.');
    });

    registerForPushNotificationsAsync().then((token: string) => {
      if (token===undefined) {token = 'thisissimulator'};
      this.setState({token: token});
    }).catch((error: Error) => {
      console.log(error);
      this.setState({token: 'thisissimulator'});
    });  
  }

  _onPressAdd = () => {
    /**
     * リストへのアイテム追加時に呼び出される関数
     * 入力フォームの内容をデータベースに登録，通知サーバーに登録
     * 追加した内容でStateを更新，入力フォームの内容をリセット
     */
    if (this.state.service === '' || this.state.price === '' || this.state.cycle === '' || this.state.due === undefined) {
      Toast.show({
        text: '未入力の項目があります。',
        buttonText: 'OK',
        type: 'warning',
        textStyle: {color: THEME.DARK.TEXT},
        style: {backgroundColor: 'rgb(65,65,65)'}
      });
      return;
    }

    const additional: AdditionalTempState = {
      token: this.state.token,
      service: this.state.service,
      price: this.state.price,
      cycle: this.state.cycle,
      year: this.state.due.getFullYear(),
      month: this.state.due.getMonth()+1,
      date: this.state.due.getDate(),
      due: this.state.due
    };

    insertItemAsync(additional)
    .then( insertId => registNotification(additional, insertId) )
    .then( _ => selectAllAsync() )
    .then( resolved => {
      this.setState({
        list: resolved, 
        service: '', 
        price: '', 
        cycle: '月',
        due: new Date()
      });  
    });
    this.refs.addModal.close();
  }

  _onDelete = (rowid: number) => {
    /**
     * アプリでのリスト上のリストのアイテムの削除時に呼び出される関数．
     * データベースから削除，通知サーバーから削除
     * 削除された内容でStateを更新，入力フォームの内容をリセット
     */
    deleteItemByRowidAsync(rowid)
    .then(  _ => deleteNotification(rowid, this.state.token) )
    .then(  _ => selectAllAsync() )
    .then( resolved => {
      this.setState({
        list: resolved, 
        service: '', 
        price: '', 
        cycle: '月', 
        due: new Date()
      });
    });
  }

  _onUpdated = () => {
    selectAllAsync().then( resolved => {
      this.setState({
        list: resolved, 
        service: '', 
        price: '', 
        cycle: '月', 
        due: new Date()
      });
    })
  }

  setValue = (stateName: string, value: any) => {
    /**
     * フォームの内容の変更時に呼び出される．
     * 第1引数の名前のstateの値を第2引数の値で更新する．
     */
    this.setState({[stateName]: value});
  };

  handleConfirm = (date: Date) => {
    this.setState({isVisible: false});
    this.setState({due: date});
  };

  formatDate = (due: Date|undefined) => {
    /**
     * TODO : Null handling
     * State(due)のデータオブジェクトを日本語表記にフォーマットする．
     */
    if (due){
      return due.getFullYear() + "年 " + (due.getMonth()+1) + "月 " + (due.getDate()+1) + "日";
    } else {
      return undefined;
    }
  }

  getMinimumDate() {
    let minimumDate = new Date();
    minimumDate.setDate(minimumDate.getDate()+1);
    return minimumDate;
  }

  render() {
    /**
     * レンダー関数
     */
    const itemList = this.state.list;
    let totals = totalCost(itemList);


    let UserFlatlist = () => {
      if (!itemList) {
        /**
         * Would like to insert image...
         */
        //return <StyledText style={{textAlign: 'center', fontSize: 18, marginTop: 10}} theme={'SUBSUKE'}>登録済みのサービスはありません</StyledText>
        return <Text style={[{textAlign: 'center', fontSize: 18, marginTop: 10}, styles.txtScheme]}>登録済みのサービスはありません</Text>            
      } else {
        if (itemList.length !== 0) {
          return (
            <FlatList
              data={itemList?.item}
              style={[styles.flatlist, styles.bgScheme]}
              keyExtractor={item => item.rowid.toString()}
              renderItem={({item}) => {
                const swipeBtn = [{
                  text: '削除',
                  backgroundColor: 'red',
                  underlayColor: 'rgba(0,0,0,1)',
                  onPress: () => {this._onDelete(item.rowid.toString())},
                }];
                return (
                  <View>
                    <Swipeout right={swipeBtn} autoClose={true} backgroundColor='transparent'>
                      <TouchableOpacity
                          onPress={ () => {
                            this.props.navigation.navigate('Detail', {token: this.state.token, params: item, onUpdated: this._onUpdated})}
                          }>
                        <SubsucItem {...item} />
                      </TouchableOpacity>
                    </Swipeout>
                  </View>
                );
              }}
            />
          )
        }
      }

    return (
      <View style={[styles.bgScheme, {flex: 1}]}>
        {/*Header 181 124 252 or 98 0 238*/}
        <Header style={styles.header} transparent={true} iosBarStyle={this.theme==='dark'?'#fff':'#000'}>
          <Left />
          <Body>
            <Title style={{color: THEME[this.theme].TEXT}}>Subsuke</Title>
          </Body>
          <Right />
          
        </Header>

        <View style={{height: '20%'}}>
          <Swiper containerStyle={styles.swiper} index={1} showsButtons={true} dotColor={Appearance.getColorScheme() === 'dark' ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)'}>
            <View style={styles.slide}>
              <Text style={[styles.txtScheme, styles.totalCost]}>{'週あたり  ¥' + totals.weekly}</Text>
            </View>
            <View style={styles.slide}>
              <Text style={[styles.txtScheme, styles.totalCost]}>{'月あたり  ¥' + totals.monthly}</Text>
            </View>
            <View style={styles.slide}>
              <Text style={[styles.txtScheme, styles.totalCost]}>{'年あたり  ¥' + totals.yearly}</Text>
            </View>
          </Swiper>
        </View>

        <UserFlatlist />
        
        {/*Modal Contents*/}
        <Modal style={styles.modal} position={'bottom'}  ref={'addModal'}>
          {/* Header */}
          <View style={{flex: 0.2, flexDirection: "row"}}>
            <Icon 
              style={{marginTop: 'auto', marginBottom: 'auto', flex:0.1}} 
              name="close"
              size={32}
              color={Appearance.getColorScheme()==='dark'?THEME.SUBSUKE.TEXT:THEME.LIGHT.TEXT}
              onPress={() => this.refs.addModal.close()}></Icon>
            <View style={{flex: 0.8}} >
              <Icon
                style={{marginLeft: "auto", marginRight: 'auto', flex: 0.6}}
                name="chevron-down"
                size={32}
                color={Appearance.getColorScheme()==='dark'?THEME.SUBSUKE.TEXT:THEME.LIGHT.TEXT}></Icon>
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
                       style={[{fontSize: 36}, styles.txtScheme]}
                       placeholder={"サブスクを追加"}
                       value={this.state.service}
                       onChange={e => {this.setState({service: e.nativeEvent.text})}} />
              </Item>
              <Item >
                <Label><Icon name="wallet" size={32} color={Appearance.getColorScheme()==='dark'?THEME.SUBSUKE.TEXT:THEME.LIGHT.TEXT}></Icon></Label>
                <TextInput 
                       type="number"
                       keyboardType={Platform.select({ios: "number-pad", android: "numeric"})}
                       name={"price"}
                       style={[{width: '80%',fontSize: 24, margin: 10}, styles.txtScheme]}
                       placeholder={"金額を追加"}
                       placeholderTextColor={THEME.SUBSUKE.TEXT}
                       value={this.state.price}
                       onChange={e => {this.setState({price: e.nativeEvent.text})}} />
              </Item>

              <Item Picker>
                <Label><Icon name="cached" size={32} color={Appearance.getColorScheme()==='dark'?THEME.SUBSUKE.TEXT:THEME.LIGHT.TEXT}></Icon></Label>
                <Picker 
                  itemStyle={styles.bgScheme}
                  iosHeader={'支払いサイクル'}
                  headerStyle={styles.header}
                  headerTitleStyle={styles.txtScheme}
                  headerBackButtonText={'戻る'}
                  //headerBackButtonTextStyle={}
                  modalStyle={styles.bgScheme}
                  mode={'dropdown'}
                  prompt={'支払いサイクル'} 
                  placeholder={'支払いサイクル'}
                  placeholderStyle={styles.txtScheme}
                  textStyle={styles.txtScheme}
                  itemTextStyle={styles.txtScheme}
                  selectedValue={this.state.cycle} 
                  onValueChange={(value) => {this.setState({cycle: value})}}>
                  <Picker.Item label={'毎週'} value={'週'} />
                  <Picker.Item label={'毎月'} value={'月'} />
                  <Picker.Item label={'毎年'} value={'年'} />
                </Picker>
              </Item>

              <View>
                <Item >
                  <Label><Icon name="calendar" size={32} color={Appearance.getColorScheme()==='dark'?THEME.SUBSUKE.TEXT:THEME.LIGHT.TEXT}></Icon></Label>
                  <View style={{flexDirection:'column', marginTop:5, marginLeft:10}}>
                    <Text style={styles.txtScheme}>次のお支払日</Text>
                    <Button transparent onPress={() => {this.setState({isVisible: true})}}>
                        <Text style={styles.txtScheme} >
                          {this.formatDate(this.state.due)}
                        </Text>
                    </Button>
                    <DateTimePickerModal
                        cancelTextIOS={"キャンセル"}
                        confirmTextIOS={"OK"}
                        headerTextIOS={"日付を選択"}
                        isVisible={this.state.isVisible}
                        isDarkModeEnabled={Appearance.getColorScheme()==='dark'}
                        mode="date"
                        minimumDate={this.getMinimumDate()}
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
            onPress={() => {
              this.refs.addModal.open();
              this.setState({
                service: '', 
                price: '', 
                cycle: '月', 
                due: new Date()
              });
            }}>
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
    //marginTop: 10,
    //marginBottom: 20,
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
    color: Appearance.getColorScheme() === 'dark' ? THEME.SUBSUKE.TEXT : THEME.LIGHT.TEXT,
  },
  bgScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? THEME.SUBSUKE.DARKER : 'rgb(242,242,242)',
  },
  uiScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#000' : '#fff'
  },
  header: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(80, 20, 120)' : 'rgb(175, 82, 222)'
  },
  flatlist: {
    flex: 1.0,
    backgroundColor: Appearance.getColorScheme() === 'dark' ? THEME.SUBSUKE.DARKER : '#fff',
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
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiper: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(10, 2, 15)' : 'rgb(232,232,232)'
  },
  _swiper: {
    //backgroundColor: THEME[DefaultPreference.get('theme')].YETDARKER,
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
  totalCost: {
    fontSize: 32,
    marginTop: 30,
  },
  wrapper: {
  },
});
