import { Component } from "react";
import Modal from 'react-native-modalbox';
import { View } from "native-base";


export default class Subscription extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Modal position={'bottom'} ref={'about'}>
        {/* Header */}
        <View>
        <Header>
          <Left>
            <Button transparent>
              <Icon type="Entypo" name="cross" onPress={() => this.refs.about.close()}></Icon>
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon type="Entypo" name="edit"></Icon>
            </Button>
            <Button transparent>
              <Icon name='more' />
            </Button>
          </Right>
        </Header>
        </View>
        <View>
          <Text></Text>
        </View>
      </Modal>
    );
  }
}