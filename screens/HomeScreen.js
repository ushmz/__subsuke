import * as WebBrowser from 'expo-web-browser';
import * as SQLite from 'expo-sqlite';
import React, { Component } from 'react';
import {
  AsyncStorage,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlightBase,
} from 'react-native';

import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Header,
  Icon,
  Input,
  Item,
  Label,
  Left,
  Right,
  Title,
} from 'native-base';

import Modal from 'react-native-modalbox';

import DatePicker from "../components/DatePicker"

import SubsucItem from '../components/SubscItem';

export default class HomeScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {list: {_array: [], length: 0}, service: '', price: '', cycle: '', dueDate:''};
    this.setValue = this.setValue.bind(this);
  }

  _onPressAdd = () => {
    let items = [];

    const additional = {
      'service': this.state.service,
      'price': this.state.price,
      'cycle': this.state.cycle,
      'dueDate': this.state.dueDate
    };
    
    const connection = SQLite.openDatabase('subsuke');
    connection.transaction(
      tx => {
        tx.executeSql(
          "insert into subscription(service, price, cycle, dueDate) values(?,?,?,?);",
          [additional['service'], additional['price'], additional['cycle'], additional['dueDate']],
          (tx, rs) => {
            console.log('[_onPressAdd] insert success');
          },
          (tx, error) => {
            console.log('[_onPressAdd] failed to insert');
            return true;
          }
        );
        tx.executeSql(
          'select rowid, service, price, cycle, dueDate from subscription;',
          null,
          (_, {rows}) => {
            items = rows;
            console.log('[_onPressAdd] success to collect data.');
          },
          () => {console.log('[_onPressAdd] Cannot correct data.')}
        );
      },
      () => {console.log('[_onPressAdd] failed to fetch user list')},
      () => {
        this.setState({
          list: items, 
          service: '', 
          price: '', 
          cycle: '', 
          dueDate: ''
        });
      }
    );
    this.refs.addModal.close();
  }

  _onDelete = (itemId) => {
    const connection = SQLite.openDatabase('subsuke');
    connection.transaction(
      tx => {
        tx.executeSql(
          "delete from subscription where id = ?",
          [itemId],
          () => {console.log('[_onDelete] successed to delete item')},
          () => {console.log('[_onDelete] failed to delete item')}
        );
        tx.executeSql(
          'select rowid, service, price cycle, dueDate from subscription;',
          null,
          (_, {rows}) => {
            items = rows;
            console.log('[_onDelete] success to collect data.');
          },
          () => {console.log('[_onDelete] Cannot correct data.')}
        );
      },
      () => {console.log('[_onDelete] Transaction failed.')},
      () => {console.log('[_omDelete] Transaction success.')}
    )
  } 

  /* Methods 4 Modal */
  _handleChange = e => {
    this.setState({[e._targetInst.pendingProps.name]: e.nativeEvent.text});
  }

  setValue = (stateName, value) => {
    this.setState({[stateName]: value});
  }

  /* why this does not work? */
  _handleChangeTest = fieldName => {
    // this.refs.'fieldname'.value
    // event.target.value
    this.setState({fieldName: this.refs[fieldName].value});
  }

  componentDidMount() {
    let itemList = {};
    console.log("3 : connect to db");
    var proomiseDBSync = function() {
      return new Promise((resolve, reject) => {
        const connection = SQLite.openDatabase('subsuke');
        connection.transaction(
          tx => {
            tx.executeSql(
              "create table if not exists subscription (\
                id integer primary key,\
                service varchar(64) not null,\
                price integer not null,\
                cycle varchar(10) not null,\
                dueDate varchar(64) not null\
              )",
              null,
              () => {console.log('[componentDidMount] Successed to connect DB.')},
              (tx, err) => {
                console.log('[componentDidMount] Failed to connect DB.');
                console.log(err);
              },
            );
          /***************************************************           * delete all items from database.
           */
            tx.executeSql(
              "delete from subscription",
              null,
              () => {console.log('delete success')},
              () => {console.log('delete failed')}
            );
           /**************************************************/
          
           /***************************************************
           */
            tx.executeSql(
              "insert into subscription values(?,?,?,?,?);",
              [0,'hoge', 900, 'month', '10'],
              () => {console.log('insert success')},
              () => {console.log('insert failed')}
            );
           /**************************************************/
            tx.executeSql(
              "select rowid, service, price cycle, dueDate from subscription;",
              null,
              (_, {rows}) => {
                console.log(rows);
                itemList = rows;
              },
              (tx, err) => {
                console.log('[componentDidMount] Failed to collect data.');
                console.log(err);
              }
            );
          },
          () => {
            reject('[componentDidMount] Transaction failed.')
          },
          () => {
            console.log('[componentDidMount] Transaction successed.');
            resolve(itemList);
          }
        );
      })
    };
    console.log(itemList);
    proomiseDBSync().then((itemList) => {
      this.setState({list: itemList});
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const itemList = this.state.list;
    var totalCost = 0;
    
    if ((itemList.length) !== 0 ){
        itemList._array.reduce((acu, current) => {
          totalCost += parseInt(current.price);
        },totalCost);
    }

    let UserFlatlist = () => {
      if (itemList.length !== 0) {
        itemList._array.forEach(
          (item) => {
            console.log(item);
          }
        );
        return (
          <FlatList
            data={itemList._array}
            style={styles.container}
            keyExtractor={item => item.rowid.toString()}
            renderItem={({item}) => <SubsucItem {...item} />}
          />
        )
      } else {
        return <Text>登録済みのサービスはありません</Text>            
      }
    }

    return (
      <View style={{flex: 1}}>
        {/*Header*/}
        <Header style={styles.header} transparent>
          <Body>
            <Title style={{marginLeft: '5%'}}>Subsuke</Title>
          </Body>
        </Header>

          <View style={styles.welcomeContainer}>
            <Text>{totalCost}</Text>
          </View>

        <UserFlatlist/>
        
        {/*Modal Sammon Button*/}
        <View>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => this.refs.addModal.open()}>
            <Text style={{fontSize: 48, color: 'white'}}>+</Text>
          </TouchableOpacity>
        </View>

        {/*Modal Contents*/}
        <Modal style={styles.modal} position={'bottom'} ref={'addModal'}>
          {/* Header */}
          <View style={{flex: 0.2, flexDirection: "row"}}>
            <Icon style={{marginTop: 'auto', marginBottom: 'auto', flex:0.1}} type="Entypo" name="cross" onPress={() => this.refs.addModal.close()}></Icon>
            <View style={{flex: 0.8}} >
              <Icon style={{marginLeft: "auto", marginRight: 'auto', flex: 0.6}} type="Entypo" name="chevron-down"></Icon>
            </View>
            <TouchableOpacity style={[styles.button, {flex: 0.1}]} onPress={this._onPressAdd} >
              <Text style={{color: 'white', fontSize: 18, lineHeight: 18}}>追加</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 2.0}}>
            <Form>
              <Item inlineLabel>
                <Label></Label>
                <Input type="text"
                       name={"service"}
                       style={{fontSize: 36}}
                       placeholder={"サブスク名を追加"}
                       value={this.state.service}
                       onChange={this._handleChange} />
              </Item>
              <Item inlineLabel>
                <Label><Icon type="MaterialCommunityIcons" name="wallet"></Icon></Label>
                <Input type="number"
                       name={"price"}
                       style={{fontSize: 24, margin: 10}}
                       placeholder={"金額を追加"}
                       value={this.state.price}
                       onChange={this._handleChange} />
              </Item>
              <DatePicker setValue={this.setValue}/>
            </Form>
          </View>

        </Modal>
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
  container: {
    flex: 1.0,
    backgroundColor: '#fff',
  },
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
    flex: 0.2,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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
  header: {
    backgroundColor: '#87C8FA',
  },
  circleButton: {
    flex: 1,
    backgroundColor: 'rgb(93, 43, 136)',
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    height: 70,
    width: 70,
    borderRadius: 120,
    left: '80%',
  },

  modal: {
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
});
