import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, StyleSheet, View} from 'react-native';
import { Body, Header, Left, Right, Text, Title } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Touchable from 'react-native-platform-touchable';
import { Appearance } from 'react-native-appearance';

export default function LinksScreen() {
  return (    
    <View style={{flex: 1}}> 
      {/* Add iosBarStyle={styles.iosBar} or something*/}
      <Header style={styles.header} transparent={true}>
        <Left />
        <Body>
          <Title style={[styles.txtScheme]}>Links</Title>
        </Body>
        <Right />          
      </Header>
      <ScrollView style={[styles.container, styles.bgScheme]}>
        <Text style={[styles.txtScheme, styles.titleText]}>Links</Text>
        <Touchable
          style={styles.link}
          background={Touchable.Ripple('#000', false)}
          onPress={()=>{WebBrowser.openBrowserAsync('')}}>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Icon
                  name={'emoticon-wink-outline'}
                  color={Appearance.getColorScheme() === 'dark' ? '#fff' : '#000'}
                  size={22} />
                </View>
              <View style={{marginLeft: 9}}>
                <Text style={[styles.txtScheme, styles.linkText]}>{'Sorry! I\'m coding. Coming soon!'}</Text>
              </View>  
            </View>
        </Touchable>
      </ScrollView>
    </View>
  );
}

LinksScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  txtScheme: {
    color: Appearance.getColorScheme() === 'dark' ? 'rgb(200, 200, 200)' : '#000',
  },
  bgScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(20, 5, 30)' : 'rgb(242,242,242)',
  },
  uiScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#000' : '#fff'
  },
  header: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(80, 20, 120)' : 'rgb(175, 82, 222)'
  },
  iosBar: {
    color: Appearance.getColorScheme()==='dark'?'#fff':'#000'
  },
  titleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
    //position: 'absolute'  TODO
  },
  link: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(20, 5, 30)' : 'rgb(242,242,242)',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#656565',
  },
  linkText: {
    fontSize: 15,
    marginTop: 1
  }
});
