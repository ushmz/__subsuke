import React, { Component } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Body, Button, Header, Left, Right, Title, View, Label, } from "native-base";
import { Appearance } from 'react-native-appearance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import StyledText from "../components/StyledText";
import Color from "../constants/Color";
import { updateItemAsync } from "../services/SQLRepository";


export default class DetailScreen extends Component {

  constructor(props) {
    super(props);
    this.state = this.props.navigation.state.params.params;
    this.actions = this.props.navigation.actions;
    this.theme = this.props.screenProps.theme;
  }

  setValue = (stateName, value) => {
    /**
     * フォームの内容の変更時に呼び出される．
     * 第1引数の名前のstateの値を第2引数の値で更新する．
     */
    this.setState({[stateName]: value});
  };

  reflectChanges = () => {
    updateItemAsync(this.state)
    .then( () => this.props.navigation.goBack())
    .then( () => this.props.navigation.state.params.onUpdated());
  };
  
  render() {
    return(
      <View style={[{flex: 1}, styles.bgScheme]}> 
        <Header style={styles.header} transparent={true} iosBarStyle={Appearance.getColorScheme()==='dark'?'#fff':'#000'}>
          <Left>
            <Button transparent onPress={ () => this.props.navigation.goBack() } >
              <Icon name="chevron-left" size={28} color={Color[this.theme].TEXT} />
              <StyledText theme={this.theme}>Back</StyledText>
            </Button>
          </Left>
          <Body>
            <Title style={[styles.txtScheme]}>Details</Title>
          </Body>
          <Right>
            <Button transparent onPress={ () => this.reflectChanges() } >
              <StyledText theme={this.theme}>save</StyledText>
            </Button>
          </Right>
        </Header>
        <View>
          <View style={styles.each}>
            <Label><StyledText style={styles.label} theme={this.theme}>サービス</StyledText></Label>
            <TextInput style={[styles.textInput,{alignSelf: 'center'}]} value={`${this.state.service}`} onChange={ e => this.setState({service: e.nativeEvent.text})} />
          </View>
          <View style={styles.each}>
            <Label><StyledText style={styles.label} theme={this.theme}>金額</StyledText></Label>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <TextInput style={[styles.textInput, {width: '25%'}]}
                         value={`${this.state.cycle}`}
                         onChange={ e => this.setState({cycle: e.nativeEvent.text})}
                        />
              <TextInput type="number"
                         keyboardType={Platform.select({ios: "number-pad", android: "numeric"})}
                         style={[styles.textInput, {width: '50%'}]}
                         value={`${this.state.price}`}
                         onChange={ e => this.setState({price: e.nativeEvent.text})}
                        />
            </View>
          </View>
          <View style={styles.each}>
            <Label><StyledText style={styles.label} theme={this.theme}>次回お支払日</StyledText></Label>
            <StyledText theme={this.theme}>{`${this.state.year}年${this.state.month}月${this.state.date}日`}</StyledText>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtScheme: {
    color: Appearance.getColorScheme() === 'dark' ? 'rgb(200, 200, 200)' : '#000',
  },
  bgScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(20, 5, 30)' : 'rgb(242,242,242)',
  },
  uiScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#000' : '#fff',
  },
  header: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(80, 20, 120)' : 'rgb(175, 82, 222)',
  },
  titleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
    //position: 'absolute'  TODO
  },
  textInput: {
    borderColor: Appearance.getColorScheme() === 'light' ? '#000' : 'rgb(200, 200, 200)',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 32,
    textAlign: 'center',
    width: '75%'
  },
  label: {
    fontSize: 20,
  },
  each: {
    margin: 20
  }
})