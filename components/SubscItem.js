import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Left, Right } from 'native-base';

const styles = StyleSheet.create({
  container: {
    height: 64,
    //borderTopWidth: 1,
    borderBottomWidth: 1,
    //borderTopColor: 'black',
    borderBottomColor: 'black',
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
  billing: {
    marginRight: '10%',
  },
});

const SubscItem = props => {
  const item = props;

  return (
    <View style={styles.container}>
      <Left>
        <Text style={styles.name}>{item.service}</Text>
      </Left>
      <Right>
        <Text style={styles.billing}>{'¥ '+item.price}</Text>
      </Right>
    </View>
  );
};

export default SubscItem;
