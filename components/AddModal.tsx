import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Form, Icon, Input, Item, Label } from 'native-base';

import Modal from 'react-native-modalbox';

export default class AddModal extends Component {
  
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      service: '', 
      price: '', 
      cycle: '月', 
      due: new Date(), 
      isVisible: false
    }
  }

  render() {
    return (
      <Modal style={styles.modal} position={'bottom'} ref={'addModal'}>
        <View style={{flex: 0.2, flexDirection: "row", backgroundColor: 'red'}}>
          <Icon style={{marginTop: 'auto', marginBottom: 'auto', flex:0.1}} type="Entypo" name="cross" onPress={() => this.refs.addModal.close()}></Icon>
          <View style={{flex: 0.8}} >
            <Icon style={{marginLeft: "auto", marginRight: 'auto', flex: 0.6}} type="Entypo" name="chevron-down"></Icon>
          </View>
          <TouchableOpacity style={[styles.button, {flex: 0.1}]} onPress={this._onPressAdd} >
            <Text style={{color: 'white', fontSize: 18, lineHeight: 18}}>追加</Text>
          </TouchableOpacity>
        </View>
  
        <View style={{flex: 2.0}}>
          <Form>
            <Item inlineLabel>
              <Label></Label>
              <Input type="text"
                name={"service"}
                style={{fontSize: 36}}
                placeholder={"サブスク名を追加"}
                value={this.state.service}
                onChange={this._handleChange} />
            </Item>
            <Item inlineLabel>
              <Label><Icon type="MaterialCommunityIcons" name="wallet"></Icon></Label>
                <Input
                  type="number"
                  name={"billing"}
                  style={{fontSize: 24, margin: 10}}
                  placeholder={"金額を追加"}
                  value={this.state.billing}
                  onChange={this._handleChange} />
            </Item>
            <DatePicker />
          </Form>
        </View>
      </Modal>
    )
  }
}
interface Style {
  button: ViewStyle,
  modal: ViewStyle
}

const styles = StyleSheet.create<Style>({
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
  modal: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? 'rgb(20, 5, 30)' : 'rgb(242,242,242)',
    height: '75%',
    borderTopStartRadius: 10,
  }
})