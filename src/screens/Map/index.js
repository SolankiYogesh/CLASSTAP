import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Container, Form, Item, Input, Card} from 'native-base';
import HeaderComponent from '../../components/Header';
import Loading from '../Loading';
import {IMAGE_URI, API_URI} from '../../utils/config';
import isEmpty from '../../validation/is-empty';
//import axios from 'axios';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';

export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const latitude = this.props.navigation.getParam('latitude');
    const longitude = this.props.navigation.getParam('longitude');
    const name = this.props.navigation.getParam('name');
    let initialPosition = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    };
    return (
      <Container style={{flex: 1, backgroundColor: '#ffffff'}}>
        <HeaderComponent navigation={this.props.navigation} />
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            ref={map => (this._map = map)}
            showsUserLocation={true}
            style={styles.map}
            initialRegion={initialPosition}>
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              title={name}>
              <Callout>
                <Text>{name}</Text>
              </Callout>
            </Marker>
          </MapView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
