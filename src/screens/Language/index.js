import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {CheckBox, ListItem, Text} from 'native-base';
import React, {Component} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import RNRestart from 'react-native-restart';
import {connect} from 'react-redux';

import {setLanguage, setLatLong} from '../../actions/settingActions';
import I18n from '../../utils/i18n';

export class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectLanguage: 'en',
    };
  }

  handleLocation = async () => {
    // const longitude = "-13,319555899560948";
    // const latitude = "48,53078958536025";

    // await AsyncStorage.setItem(
    //   'latitude',
    //   latitude,
    // );
    // await AsyncStorage.setItem(
    //   'longitude',
    //   longitude,
    // );

    // await this.props.setLatLong(
    //   latitude,
    //   longitude,
    // )

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
        //this.setState({position: {longitude: position.longitude, latitude: position.latitude}});
      },
      error => {
        //Alert.alert(JSON.stringify(error));
      },
      {
        enableHighAccuracy: /* Platform.OS === 'ios' ? true : */ false,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(async result => {
          if (result === 'denied') {
            await request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(
              async result => {
                if (result === 'granted') {
                  await this.handleLocation();
                }
              },
            );
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
            await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
              async result => {
                if (result === 'granted') {
                  await this.handleLocation();
                }
              },
            );
          } else if (result === 'granted') {
            //alert(result);
            await this.handleLocation();
          }
        })
        .catch(error => {
          // …
        });
    }
  }

  handleSelectLanguage = val => {
    this.setState({selectLanguage: val});
  };
  handleSelectLanguageStore = async () => {
    const {selectLanguage} = this.state;
    await AsyncStorage.setItem('lang', selectLanguage, async () => {
      await AsyncStorage.setItem('isLanguage', '1');
      await this.props.setLanguage(selectLanguage);

      setTimeout(() => RNRestart.Restart(), 100);
      this.props.navigation.navigate('Auth');
    });
  };
  render() {
    const {lang} = this.props.setting;
    const {selectLanguage} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}> CLASSTAP </Text>
        </View>
        <ListItem
          onPress={() => this.handleSelectLanguage('en')}
          style={{marginLeft: normalize(25), marginRight: normalize(25)}}>
          <CheckBox
            color={'#FE9800'}
            checked={selectLanguage === 'en' ? true : false}
            value={'en'}
            onPress={() => this.handleSelectLanguage('en')}
            style={{
              width: normalize(25),
              height: normalize(25),
              //left: normalize(2),
              borderRadius: 0,
              borderWidth: 2,
            }}
          />

          <Text style={{marginLeft: normalize(10), fontSize: normalize(14)}}>
            English
          </Text>
        </ListItem>
        <ListItem
          onPress={() => this.handleSelectLanguage('ar')}
          style={{marginLeft: normalize(25), marginRight: normalize(25)}}>
          <CheckBox
            color={'#FE9800'}
            checked={selectLanguage === 'ar' ? true : false}
            value={'ar'}
            onPress={() => this.handleSelectLanguage('ar')}
            style={{
              width: normalize(25),
              height: normalize(25),
              //left: normalize(2),
              borderRadius: 0,
              borderWidth: 2,
            }}
          />

          <Text style={{marginLeft: normalize(10), fontSize: normalize(14)}}>
            العربية‎
          </Text>
        </ListItem>
        <TouchableOpacity
          onPress={this.handleSelectLanguageStore}
          style={styles.languageButton}>
          <Text style={styles.languageButtonText}>
            {I18n.t('selectLanguage', {locale: lang})}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    //marginLeft: normalize(16),
    //marginRight: normalize(25),
  },
  errorMessage: {
    color: 'red',
    fontSize: normalize(12),
    marginLeft: '10%',
    marginRight: '10%',
  },
  languageButton: {
    backgroundColor: '#FE9800',
    borderRadius: normalize(23),
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(45),
    marginVertical: normalize(20),
    //marginVertical: 10,
  },
  languageButtonText: {
    color: '#ffffff',
    fontSize: normalize(15),
    textAlign: 'center',
  },
  titleContainer: {
    //flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    fontSize: normalize(30),
    letterSpacing: normalize(4.74),
  },
});

const mapStateToProps = state => ({
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {setLanguage, setLatLong})(Language);
