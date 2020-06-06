import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, StyleSheet, View, ImageSourcePropType} from 'react-native';
import { Body, Header, Image, Left, Right, Text, Title } from 'native-base';
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
        <LinksView iconName={'emoticon-wink-outline'} title={'Sorry! I\'m coding. Coming soon!'} link={'hoge'}/>
      </ScrollView>
    </View>
  );
}

LinksScreen.navigationOptions = {
  title: 'Links',
};

let LinksView = (title: string, link: string, icon?: string | ImageSourcePropType): JSX.Element => {
  /*
  if (typeof icon === "string"){
    let imageElem = <Icon
                      name={icon}
                      color={Appearance.getColorScheme() === 'dark' ? '#fff' : '#000'}
                      size={22} />
  } else if (typeof icon === 'ImageSourcePropType' {
    <Image
      source={icon}
      resizeMode="contain"
      fadeDuration={0}
      style={{ width: 20, height: 20, marginTop: 1 }} />
  }
  */
  return (
    <View>
      <Text style={[styles.txtScheme, styles.titleText]}>Links</Text>
      <Touchable
        style={styles.link}
        background={Touchable.Ripple('#000', false)}
        onPress={()=>{WebBrowser.openBrowserAsync(link)}}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Icon
                name={icon}
                color={Appearance.getColorScheme() === 'dark' ? '#fff' : '#000'}
                size={22} />
              </View>
            <View style={{marginLeft: 9}}>
              <Text style={[styles.txtScheme, styles.linkText]}>{title}</Text>
            </View>  
          </View>
      </Touchable>
    </View>
  );
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
