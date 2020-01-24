import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
    this.state = {list: [], service: '', billing: '', cycle: '', next:''};
  }

  _onPressAdd = e => {
    const list = [].concat(this.state.list);

    list.push({
      service: this.state.service,
      billing: this.state.billing,
      next: this.state.next,
    });

    console.log(list);

    this.setState({
      list: list,
      service: '',
      billing: '',
      next: ''
    });
    this.refs.addModal.close()
  };

  /* Methods 4 Modal */
  _handleChange = e => {
    this.setState({[e._targetInst.pendingProps.name]: e.nativeEvent.text});
  }

  /* why this does not work? */
  _handleChangeTest = fieldName => {
    // this.refs.'fieldname'.value
    // event.target.value
    console.log(fieldName+ ':'+this.refs[fieldName].value)
    this.setState({fieldName: this.refs[fieldName].value});
  }

  render() {
    var i = 0;
    this.state.list.map(value => i += +value.billing)
    return (
      <View style={{flex: 1}}>
        {/*Header*/}
        <Header style={styles.header} transparent>
          <Left>
            <Button transparent>
              <Icon theme={{iconFamily: 'FontAwesome'}} name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Subsuke</Title>
          </Body>
          <Right />
        </Header>

          <View style={styles.welcomeContainer}>
            <Text>{i}</Text>
          </View>
        {/*
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
        </ScrollView>
        */}
        <FlatList
          style={styles.container}
          keyExtractor={item => item.service+item.billing+item.next}
          data={this.state.list}
          renderItem={({item}) => <SubsucItem {...item} />}
        />
        {/*Button*/}
        <View>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => this.refs.addModal.open()}>
            <Text style={{fontSize: 48, color: 'white'}}>+</Text>
          </TouchableOpacity>
        </View>
        {/*Modal Contents*/}
        <Modal style={styles.modal} position={'bottom'} ref={'addModal'}>
          <View style={{flex: 0.2, alignItems: "center"}}>
            <Icon type="Entypo" name="chevron-down"></Icon>
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
                       name={"billing"}
                       style={{fontSize: 24, margin: 10}}
                       placeholder={"金額を追加"}
                       value={this.state.billing}
                       onChange={this._handleChange} />
              </Item>
              <DatePicker />
              <Container style={styles.actionButtons}>
                <TouchableOpacity style={styles.button} onPress={() => this.refs.addModal.close()}>
                  <Text style={styles.buttonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this._onPressAdd}>
                  <Text style={styles.buttonText}>追加</Text>
                </TouchableOpacity>
              </Container>
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
    height: 600,
    borderTopStartRadius: 10,
  },
  button: {
    flex: 1,
    backgroundColor: 'rgb(93, 43, 136)',
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    height: 50,
    width: 200,
  },
  actionButtons: {
    // in Modal
    flexDirection: 'row',
    marginTop: 20,
  },
});
