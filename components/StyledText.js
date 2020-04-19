import React from 'react';
import { Text } from 'react-native';
import COLORS from '../constants/Color';

export default function StyledText(props) {
  if (props.theme === 'LIGHT') {
    return <Text {...props} style={[props.style, {color: COLORS.LIGHT.TEXT}]} />
  } else if (props.theme === 'DARK') {
    return <Text {...props} style={[props.style, {color: COLORS.DARK.TEXT}]} />
  } else if (props.theme === 'SUBSUKE') {
    return <Text {...props} style={[props.style, {color:COLORS.SUBSUKE.TEXT}]} />
  }
}
