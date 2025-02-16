import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import splash from 'react-native-bootsplash';
import {check, PERMISSIONS} from 'react-native-permissions';
import {connect} from 'react-redux';

import {currentUser} from '../../actions/authActions';
import {setLanguage, setLatLong} from '../../actions/settingActions';
import setAuthToken from '../../utils/setAuthToken';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

class AuthLoading extends Component {
  constructor(props) {
    super(props);
  }
  _loadData = async () => {
    const lang = await AsyncStorage.getItem('lang');
    const classTabToken = await AsyncStorage.getItem('classTabToken');
    const latitude = await AsyncStorage.getItem('latitude');
    const longitude = await AsyncStorage.getItem('longitude');
    if (latitude && longitude) {
      this.props.setLatLong(latitude, longitude);
    }
    if (lang) {
      this.props.setLanguage(lang);
    }
    if (classTabToken) {
      setAuthToken(classTabToken);
      this.props.currentUser();
    }
    this.props.navigation.navigate(classTabToken ? 'Main' : 'Auth');
  };

  handleLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        await AsyncStorage.setItem(
          'latitude',
          position.coords.latitude.toString(),
        );
        await AsyncStorage.setItem(
          'longitude',
          position.coords.longitude.toString(),
        );

        await this.props.setLatLong(
          position.coords.latitude,
          position.coords.longitude,
        );
        return true;
      },
      () => {},
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.AUTH_LOADING_SCREEN);
    if (Platform.OS === 'ios') {
      await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(async result => {
          if (result === 'denied') {
            await AsyncStorage.removeItem('latitude');
            await AsyncStorage.removeItem('longitude');
          } else if (result === 'granted') {
            await this.handleLocation();
          }
        })
        .catch(() => {});
    } else {
      await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
        async result => {
          if (result === 'denied') {
            await AsyncStorage.removeItem('latitude');
            await AsyncStorage.removeItem('longitude');
          } else if (result === 'granted') {
            await this.handleLocation();
          }
        },
      );
    }

    setTimeout(() => {
      splash.hide({fade: false});
      this._loadData();
    }, 100);
  }
  render() {
    return <View style={styles.container}></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: '#FAA21B',
  },
  lavendorColor: {
    color: '#7a28dc',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  setLanguage,
  currentUser,
  setLatLong,
})(AuthLoading);
