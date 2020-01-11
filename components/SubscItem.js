import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

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
  },
  text: {
    color: '#333',
  },
});

const SubscItem = props => {
  const item = props;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{item.service}</Text>
      <Text style={styles.text}>{item.charge}</Text>
      <Text style={styles.text}>{item.next}</Text>
    </View>
  );
};

export default SubscItem;
