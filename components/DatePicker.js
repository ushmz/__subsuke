import React, { useState } from "react";
import { Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Icon, Item, Label } from "native-base";

const DatePicker = () => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selected, setSelected] = useState(new Date())

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    setSelected(date)
  };

  const formatDate = () => {
      return selected.getFullYear() + "年 " + (selected.getMonth()+1) + "月 " + selected.getDate() + "日"
  }

  return (
    <View>
      <Item inlineLabel>
        <Label><Icon type="MaterialCommunityIcons" name="calendar"></Icon></Label>
        <Button transparent onPress={showDatePicker}>
            <Text style={{fontSize: 18, margin: 20}} >{formatDate()}</Text>
        </Button>
        <DateTimePickerModal
            cancelTextIOS={"キャンセル"}
            confirmTextIOS={"OK"}
            headerTextIOS={"日付を選択"}
            isVisible={isDatePickerVisible}
            isDarkModeEnabled={false}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            locale="ja"
        />
      </Item>
    </View>
  );
};

export default DatePicker;