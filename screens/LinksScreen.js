import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, StyleSheet, View} from 'react-native';
import { Body, Header, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Touchable from 'react-native-platform-touchable';
import { Appearance } from 'react-native-appearance';

export default function LinksScreen() {
  return (    
    <View style={{flex: 1}}> 
      <Header style={styles.header} transparent>
        <Body>
          <Text style={styles.txtScheme}>Links</Text>
        </Body>
      </Header>
      <ScrollView style={styles.container}>
        <LinksView iconName={'emoticon-wink-outline'} title={'Sorry! I\'m coding. Coming soon!'} link={'hoge'}/>
      </ScrollView>
    </View>
  );
}

LinksScreen.navigationOptions = {
  title: 'Links',
};

let LinksView = (props) => {
  return (
    <View>
      <Text style={[styles.txtScheme, styles.titleText]}>Links</Text>
      <Touchable
        style={styles.link}
        background={Touchable.Ripple('#000', false)}
        onPress={()=>{WebBrowser.openBrowserAsync(props.link)}}>
          <View style={{flexDirection: 'row'}}>
            <View>
              {props.iconName !== 'undifined'
                ? <Icon
                    name={props.iconName}
                    color={Appearance.getColorScheme() === 'dark' ? '#fff' : '#000'}
                    size={22} />
                : <Image
                    source={(props.image)}
                    resizeMode="contain"
                    fadeDuration={0}
                    style={{ width: 20, height: 20, marginTop: 1 }} />
              }
            </View>
            <View style={{marginLeft: 9}}>
              <Text style={[styles.txtScheme, styles.linkText]}>{props.title}</Text>
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
    backgroundColor: Appearance.getColorScheme()==='dark'?'rgb(65,65,65)':'#fff',
  },
  txtScheme: {
    color: Appearance.getColorScheme() === 'dark'?'#fff':'#000',
  },
  bgScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(65, 65, 65)' : '#ffffff',
  },
  uiScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#000' : '#fff'
  },
  header: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(188, 135, 255)' : 'rgb(98,0,238)',
  },
  titleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
    //position: 'absolute'  TODO
  },
  link: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(65, 65, 65)' : '#fff',
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
