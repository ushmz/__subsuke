import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Left, Right } from 'native-base';
import { Appearance } from 'react-native-appearance';
import { THEME } from '../constants/Color';

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderTopWidth: 1,
    borderTopColor: Appearance.getColorScheme() === 'dark' ? 'rgb(90, 90, 90)' : '#000',
    borderBottomWidth: 1,
    borderBottomColor: Appearance.getColorScheme() === 'dark' ? 'rgb(90, 90, 90)' : '#000',
    flexDirection: 'row'
  },
  text: {
    color: '#333',
    marginLeft: '5%',
  },
  name: {
    marginLeft: '10%',
    fontSize: 20,
  },
  rightIem: {
    marginRight: '10%',
  },
  txtScheme: {
    color: Appearance.getColorScheme() === 'dark' ? THEME.DARK.TEXT : THEME.LIGHT.TEXT,
  }
});

const SubscItem = props => {
  const item = {
    service: props.service,
    price: props.price,
    cycle: props.cycle,
    year: props.year.toString(),
    month: props.month.toString(),
    date: props.date.toString(),
    next: new Date(props.year, props.month, props.date)
  };

  return (
    <View style={[styles.container, styles.txtScheme]} >
      <Left>
        <Text style={[styles.name, styles.txtScheme]}>{item.service}</Text>
      </Left>
      <Right>
        <Text style={[styles.rightIem, styles.txtScheme, {fontSize: 18}]}>{'毎'+item.cycle+' ¥'+item.price}</Text>
        <Text style={[styles.rightIem, styles.txtScheme]}>{'次回：'+item.year+'/'+item.month+'/'+item.date}</Text>
      </Right>
    </View>
  );
};

export default SubscItem;
