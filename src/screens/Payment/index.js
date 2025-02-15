import React, {Component} from 'react';
import {Text, ScrollView} from 'react-native';
import {Container} from 'native-base';
import HeaderComponent from '../../components/Header';

export class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Container style={{flex: 1, backgroundColor: '#ffffff'}}>
        <HeaderComponent navigation={this.props.navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ffffff'}}>
          <Text> Payment </Text>
        </ScrollView>
      </Container>
    );
  }
}

export default Payment;
