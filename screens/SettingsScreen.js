import React, {Component} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import { Appearance } from 'react-native-appearance';
import { Header, Body, Left, Right, Title } from 'native-base';

import { THEME } from '../constants/Color';

export default function SettingsScreen() {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return (
    <View style={{flex: 1}}>
      <Header style={[styles.header]} transparent={true} iosBarStyle={Appearance.getColorScheme()==='dark'?'#fff':'#000'}>
        <Left />
        <Body>
          <Title style={[styles.txtScheme]}>Settings</Title>
        </Body>
        <Right />          
      </Header>
      <ConfigView />
    </View>
  );
}

SettingsScreen.navigationOptions = {
  title: 'Setting',
};


class ConfigView extends Component {
  render() {

    const sections = [
      { data: [{ value: 'beta' }], title: 'version' },
      { data: [{ value: 'Yusuke Shimizu' }], title: 'Auther' },
      { data: [{ value: '@rabhareit' }], title: 'Github' },
      { data: [{ value: 'subsuke.app@gmail.com' }], title: 'Contact' },
    ];

    return (
          <SectionList
            style={[styles.container, styles.bgScheme]}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            stickySectionHeadersEnabled={true}
            keyExtractor={(item, index) => index}
            //ListHeaderComponent={ListHeader}
            sections={sections}
          />
    );
  }

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} />;
  };
  
  _renderItem = ({ item }) => {
    if (item.type === 'color') {
      return <SectionContent>{item.value && <Color value={item.value} />}</SectionContent>;
    } else {
      return (
        <SectionContent>
          <Text style={[styles.sectionContentText, styles.txtScheme]}>{item.value}</Text>
        </SectionContent>
      );
    }
  };
};

const SectionHeader = ({ title }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={[styles.sectionHeaderText, styles.txtScheme]}>{title}</Text>
    </View>
  );
};

const SectionContent = props => {
  return <View style={styles.sectionContentContainer}>{props.children}</View>;
};

const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl = 'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';
  }

  return <Image source={{ uri: iconUrl }} style={{ width: 64, height: 64 }} resizeMode="cover" />;
};

const Color = ({ value }) => {
  if (!value) {
    return <View />;
  } else {
    return (
      <View style={styles.colorContainer}>
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <View style={styles.colorTextContainer}>
          <Text style={styles.sectionContentText}>{value}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2,
  },
  sectionHeaderContainer: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? THEME.SUBSUKE.YETDARKER : THEME.LIGHT.YETDARKER,
    paddingVertical: 8,
    paddingHorizontal: 15,
    //borderWidth: StyleSheet.hairlineWidth,
    //borderColor: '#ededed',
  },
  sectionHeaderText: {
    fontSize: 14,
    color: 'white',
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  sectionContentText: {
    color: '#808080',
    fontSize: 14,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 17,
    height: 17,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  colorTextContainer: {
    flex: 1,
  },
  txtScheme: {
    color: Appearance.getColorScheme() === 'dark' ? 'rgb(200, 200, 200)' : '#000',
  },
  bgScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? THEME.SUBSUKE.DARKER : THEME.LIGHT.DARKER,
  },
  uiScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#000' : '#fff'
  },
  header: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(80, 20, 120)' : 'rgb(175, 82, 222)'
  },
});