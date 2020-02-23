import React, { Component } from "react";
import { Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Icon, Item, Label } from "native-base";

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {isVisible: false, selected: new Date()};
  }

  show = () => {
    this.setState({isVisible: true})
  };

  hide = () => {
    this.setState({isVisible: false})
  };

  handleConfirm = date => {
    this.hide();
    this.setState({selected: date,});
    this.props.setValue('dueDate', date);
  };

  formatDate = () => {
      return this.state.selected.getFullYear() + "年 " + (this.state.selected.getMonth()+1) + "月 " + this.state.selected.getDate() + "日"
  }

  render() {
    return (
      <View>
        <Item inlineLabel>
          <Label><Icon type="MaterialCommunityIcons" name="calendar"></Icon></Label>
          <Button transparent onPress={this.show}>
              <Text style={{fontSize: 18, margin: 20}} >
                {this.formatDate()}
              </Text>
          </Button>
          <DateTimePickerModal
              cancelTextIOS={"キャンセル"}
              confirmTextIOS={"OK"}
              headerTextIOS={"日付を選択"}
              isVisible={this.state.isVisible}
              isDarkModeEnabled={false}
              mode="date"
              onConfirm={this.handleConfirm}
              onCancel={this.hide}
              locale="ja"
          />
        </Item>
      </View>
    );
  }
}
