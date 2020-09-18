import { Platform, StyleSheet } from "react-native";
import { Appearance } from 'react-native-appearance';
import { theme } from "../constants/ColorSets";

export const styles = StyleSheet.create({
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
    color: Appearance.getColorScheme() === 'dark' ? theme.subsuke.text : theme.light.text,
  },
  bgScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? theme.subsuke.darker : 'rgb(242,242,242)',
  },
  uiScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#000' : '#fff'
  },
  header: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(80, 20, 120)' : 'rgb(175, 82, 222)'
  },
  flatlist: {
    flex: 1.0,
    backgroundColor: Appearance.getColorScheme() === 'dark' ? theme.subsuke.darker : '#fff',
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
  modal: {},
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

export const settingScreenStyles = StyleSheet.create({
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
    backgroundColor: Appearance.getColorScheme() === 'dark' ? theme.subsuke.yetDarker : theme.light.yetDarker,
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
    backgroundColor: Appearance.getColorScheme() === 'dark' ? theme.subsuke.darker : theme.light.darker,
  },
  uiScheme: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#000' : '#fff'
  },
  header: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(80, 20, 120)' : 'rgb(175, 82, 222)'
  },
});