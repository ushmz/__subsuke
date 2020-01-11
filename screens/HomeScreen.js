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


import { MonoText } from '../components/StyledText';

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {list: [], service: '', charge: '', cycle: '', next:''}
  }

  _onPressAdd = e => {
    const list = [].concat(this.state.list);

    list.push({
      service: this.state.service,
      charge: this.state.charge,
      next: this.state.next,
    });

    console.log(list);

    this.setState({
      list: list,
      service: '',
      charge: '',
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
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>
        {/*
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
        </ScrollView>
        */}
        <FlatList
          style={styles.container}
          keyExtractor={item => item.service+item.charge+item.next}
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
          <Header style={styles.modalTitle} noShadow>
            <Body>
              <Text>サブスクリプションを追加</Text>
            </Body>
            <Right>
              <Button hasText transparent>
                <Text>cancel</Text>
              </Button>
            </Right>
          </Header>
            <Form>
              <Item fixedLabel>
                <Label>Subscription Name</Label>
                <Input type="text" name={"service"} value={this.state.service} onChange={this._handleChange} />
              </Item>
              <Item fixedLabel>
                <Label>Charge</Label>
                <Input type="text" name={"charge"} value={this.state.charge} onChange={this._handleChange} />
              </Item>
              <Item fixedLabel>
                <Label>Next Payment</Label>
                <Input type="text" name="next" value={this.state.next} onChange={this._handleChange} />
              </Item>
              <Container style={styles.actionButtons}>
                <TouchableOpacity style={styles.button} onPress={() => this.refs.addModal.close()}>
                  <Text style={styles.buttonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this._onPressAdd}>
                  <Text style={styles.buttonText}>追加</Text>
                </TouchableOpacity>
              </Container>
            </Form>
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
  },
  modalTitle: {
    backgroundColor: 'transparent',
    alignItems: 'center',
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
