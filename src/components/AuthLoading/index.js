import React, {Component} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {currentUser} from '../../actions/authActions';
import {setLanguage, setLatLong} from '../../actions/settingActions';
import setAuthToken from '../../utils/setAuthToken';
import {check, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import SplashScreen from 'react-native-splash-screen';

class AuthLoading extends Component {
  constructor(props) {
    super(props);
  }
  _loadData = async () => {
    const lang = await AsyncStorage.getItem('lang');
    const isLanguage = await AsyncStorage.getItem('isLanguage');
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
    this.props.navigation.navigate(
      classTabToken ? 'Main' : 'Auth', //isLanguage === '1' ? 'Auth' : 'Language',
    );

    // this.props.navigation.navigate(classTabToken ? 'Main' : 'Auth');
  };

  handleLocation = async () => {
    await Geolocation.getCurrentPosition(
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
        //this.setState({position: {longitude: position.longitude, latitude: position.latitude}});
      },
      error => {
        //Alert.alert(JSON.stringify(error));
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  async componentDidMount() {
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
        .catch(error => {
          // …
        });
    } else {
      await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(async result => {
          if (result === 'denied') {
            await AsyncStorage.removeItem('latitude');
            await AsyncStorage.removeItem('longitude');
          } else if (result === 'granted') {
            await this.handleLocation();
          }
        })
        .catch(error => {
          // …
        });
    }

    setTimeout(() => {
      SplashScreen.hide();
      this._loadData();
    }, 100);
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <Image
          source={require('../../assets/img/logo.png')}
          style={{
            width: normalize(134.3),
            height: normalize(117.2),
            //resizeMode: 'contain',
          }}
        />
        <StatusBar barStyle="default" /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
