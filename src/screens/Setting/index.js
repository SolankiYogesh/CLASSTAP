import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {Container} from 'native-base';
import React, {Component} from 'react';
import {
  AppState,
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {check, PERMISSIONS} from 'react-native-permissions';
import RNRestart from 'react-native-restart';
import {connect} from 'react-redux';

import {currentUser} from '../../actions/authActions';
import {setLanguage} from '../../actions/settingActions';
import HeaderComponent from '../../components/Header';
import {API_URI} from '../../utils/config';
import I18n from '../../utils/i18n';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

export class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: props.setting.lang,
      isNotification: '',
      isLocation: false,
      isNewsletter: false,
      isInitial: true,
    };
  }

  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.SETTING_SCREEN);
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.setState({
      isNotification: this.props.auth.user.is_notification,
      isNewsletter: this.props.auth.user.is_newsletter,
    });
    if (Platform.OS === 'ios') {
      await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(async result => {
          if (result === 'denied' || result === 'blocked') {
            this.setState({isLocation: false});
          } else if (result === 'granted') {
            this.setState({isLocation: true});
          }
        })
        .catch(error => {
          // Alert.alert(JSON.stringify(error));
          // …
        });
    } else {
      await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(async result => {
          if (result === 'denied') {
            this.setState({isLocation: false});
          } else if (result === 'granted') {
            this.setState({isLocation: true});
          }
        })
        .catch(error => {
          // …
        });
    }
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  handleAppStateChange = async () => {
    if (!this.state.isInitial) {
      if (Platform.OS === 'ios') {
        await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          .then(async result => {
            if (result === 'denied' || result === 'blocked') {
              await AsyncStorage.removeItem('latitude');
              await AsyncStorage.removeItem('longitude');
              this.setState({isLocation: false});
            } else if (result === 'granted') {
              await this.handleLocation();
              RNRestart.Restart();
              this.setState({isLocation: true});
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
              this.setState({isLocation: false});
            } else if (result === 'granted') {
              await this.handleLocation();
              RNRestart.Restart();
              this.setState({isLocation: true});
            }
          })
          .catch(error => {
            // …
          });
      }
    }
    this.setState({isInitial: false});
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleBack = async () => {
    this.props.navigation.goBack();
    return true;
  };

  handleSelectLanguage = async value => {
    await AsyncStorage.setItem('lang', value, async () => {
      this.setState({
        selectedLanguage: value,
      });
      await this.props.setLanguage(value);

      RNRestart.Restart();
    });
  };
  handleIsNotification = () => {
    const userData = {
      is_notification: !this.state.isNotification,
    };

    const {id} = this.props.auth.user;
    this.setState({isNotification: !this.state.isNotification});
    axios
      .put(`${API_URI}/users/${id}`, userData)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data;
          this.props.currentUser();
        }
      })
      .catch(err => {
        if (err.response.data.error) {
        }
      });
  };

  handleIsNewsletter = () => {
    const userData = {
      is_newsletter: !this.state.isNewsletter,
    };

    const {id} = this.props.auth.user;
    this.setState({isNewsletter: !this.state.isNewsletter});
    axios
      .put(`${API_URI}/users/${id}`, userData)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data;
          this.props.currentUser();
        }
      })
      .catch(err => {
        if (err.response.data.error) {
        }
      });
  };

  handleLocatonEnable = async () => {
    Linking.openSettings();
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
        this.setState({isLocation: true});
        return true;
      },
      error => {
        //Alert.alert(JSON.stringify(error));
      },
      {
        enableHighAccuracy: /* Platform.OS === 'ios' ? true : */ false,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };
  render() {
    const {isNotification, isLocation, isNewsletter} = this.state;

    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';

    return (
      <Container style={{flex: 1, backgroundColor: '#ffffff'}}>
        <HeaderComponent navigation={this.props.navigation} back={'Profile'} />
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          {/* <View
            style={{
              marginHorizontal: normalize(16),
              marginBottom: normalize(16),
            }}>
            <Item
              picker
              style={{
                flexDirection: flexDirection,
                borderBottomWidth: 0,
              }}>
              <Label style={{color: '#8A8A8F'}}>
                {I18n.t('language', {locale: lang})}
              </Label>

              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{
                  width: undefined,
                }}
                ///textStyle={{flexDirection: 'row-reverse'}}
                placeholder="Select Language"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectedLanguage}
                onValueChange={this.handleSelectLanguage}>
                <Picker.Item label="English" value="en" />
                <Picker.Item label="العربية" value="ar" />
              </Picker>
            </Item>
          </View> */}

          <View
            style={[
              styles.notificationContainer,
              {
                flexDirection: flexDirection,
              },
            ]}>
            <View>
              <Text
                style={{
                  fontSize: normalize(19),
                  color: '#8A8A8F',
                  textAlign: textAlign,
                }}>
                {I18n.t('notification', {locale: lang})}
              </Text>
            </View>
            <View style={{position: 'absolute', right: 0}}>
              <Switch
                style={{
                  //transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                  // display: 'flex',
                  /// alignSelf: 'flex-end',

                  borderColor: '#FE9800',
                }}
                onValueChange={this.handleIsNotification}
                value={isNotification}
                trackColor={{true: '#FE9800', false: '#cfcfcf'}}
                //trackColor={{true: '#FE9800', false: '#f5f6fc'}}
                thumbColor="#fff"
                ios_backgroundColor="#cfcfcf"
                //thumbColor="#FE9800"
              />
            </View>
          </View>
          <View
            style={[
              styles.notificationContainer,
              {
                flexDirection: flexDirection,
                marginTop: normalize(30),
              },
            ]}>
            <View>
              <Text
                style={{
                  fontSize: normalize(19),
                  color: '#8A8A8F',
                  textAlign: textAlign,
                }}>
                {I18n.t('location', {locale: lang})}
              </Text>
            </View>
            <View style={{position: 'absolute', right: 0}}>
              <Switch
                style={{
                  //transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                  // display: 'flex',
                  /// alignSelf: 'flex-end',

                  borderColor: '#FE9800',
                }}
                onValueChange={this.handleLocatonEnable}
                value={isLocation}
                trackColor={{true: '#FE9800', false: '#cfcfcf'}}
                //trackColor={{true: '#FE9800', false: '#f5f6fc'}}
                thumbColor="#fff"
                ios_backgroundColor="#cfcfcf"
                //thumbColor="#FE9800"
              />
            </View>
          </View>
          {/* Start News Letter */}
          <View
            style={[
              styles.notificationContainer,
              {
                flexDirection: flexDirection,
                marginTop: normalize(30),
              },
            ]}>
            <View>
              <Text
                style={{
                  fontSize: normalize(19),
                  color: '#8A8A8F',
                  textAlign: textAlign,
                }}>
                {I18n.t('receiveUpdatesNewsletters', {locale: lang})}
              </Text>
            </View>
            <View style={{position: 'absolute', right: 0}}>
              <Switch
                style={{
                  //transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                  // display: 'flex',
                  /// alignSelf: 'flex-end',

                  borderColor: '#FE9800',
                }}
                onValueChange={this.handleIsNewsletter}
                value={isNewsletter}
                trackColor={{true: '#FE9800', false: '#cfcfcf'}}
                //trackColor={{true: '#FE9800', false: '#f5f6fc'}}
                thumbColor="#fff"
                ios_backgroundColor="#cfcfcf"
                //thumbColor="#FE9800"
              />
            </View>
          </View>
          {/* End News Letter */}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  notificationContainer: {
    display: 'flex',
    marginHorizontal: normalize(16),
  },
});
const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {setLanguage, currentUser})(Setting);
