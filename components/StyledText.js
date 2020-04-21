import React from 'react';
import { Text } from 'react-native';
import { THEME } from '../constants/Color';

export default function StyledText(props) {
  if (props.theme === 'LIGHT') {
    return <Text {...props} style={[props.style, {color: THEME.LIGHT.TEXT}]} />
  } else if (props.theme === 'DARK') {
    return <Text {...props} style={[props.style, {color: THEME.DARK.TEXT}]} />
  } else if (props.theme === 'SUBSUKE') {
    return <Text {...props} style={[props.style, {color: THEME.SUBSUKE.TEXT}]} />
  }
}
