import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Left, Right } from 'native-base';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffa500',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    minHeight: 50,
    borderRadius: 10,
    flexDirection: 'row'
  },
  text: {
    color: '#333',
  },
  name: {
    textAlign: 'left',
  },
  billing: {
    textAlign: 'right',
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
        <Text style={styles.billing}>{item.billing}</Text>
      </Right>
    </View>
  );
};

export default SubscItem;
