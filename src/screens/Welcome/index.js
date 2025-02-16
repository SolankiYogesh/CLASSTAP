import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import React, {useEffect} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import FIcon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';

import {socialLoginUser} from '../../actions/authActions';
import {
  clearErrors,
  clearLoading,
  clearSocialErrors,
} from '../../actions/errorAction';
import {setLatLong} from '../../actions/settingActions';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import Loading from '../Loading';
import analytics from '@react-native-firebase/analytics';

const Welcome = props => {
  useEffect(() => {
    analytics().logEvent(Const.ANALYTICS_EVENT.WELCOME);
  }, []);

  useEffect(() => {
    const {lang} = props.setting;

    if (!isEmpty(props.errors.socialError)) {
      Alert.alert(
        I18n.t('loginFailed', {locale: lang}),
        props.errors.socialError,
        [
          {
            text: I18n.t('ok', {locale: lang}),
            onPress: () => props.clearSocialErrors(),
          },
        ],
        {cancelable: false},
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.setting, props.errors]);

  const handleLocation = async () => {
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

        await props.setLatLong(
          position.coords.latitude,
          position.coords.longitude,
        );
        return true;
      },
      () => {
        //Alert.alert(JSON.stringify(error));
      },
      {
        enableHighAccuracy: /* Platform.OS === 'ios' ? true : */ false,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  useEffect(() => {
    const load = async () => {
      if (Platform.OS === 'ios') {
        await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          .then(async result => {
            if (result === 'denied') {
              await request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(
                async result => {
                  if (result === 'granted') {
                    await handleLocation();
                  }
                },
              );
            } else if (result === 'granted') {
              await handleLocation();
            }
          })
          .catch(() => {
            // …
          });
      } else {
        await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          .then(async result => {
            if (result === 'denied') {
              await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
                async result => {
                  if (result === 'granted') {
                    await handleLocation();
                  }
                },
              );
            } else if (result === 'granted') {
              //alert(result);
              await handleLocation();
            }
          })
          .catch(error => {
            // …
          });
      }
    };
    load();
  }, []);

  useEffect(() => {
    const focusListener = props.navigation.addListener('didFocus', () => {
      props.clearLoading();
    });
    BackHandler.addEventListener('hardwareBackPress', handleBack);

    return () => {
      focusListener.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      props.clearErrors();
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, []);

  const handleGuestAccount = () => {
    props.navigation.navigate('Main');
  };

  const handleBack = () => {
    const {lang} = props.setting;
    Alert.alert(
      I18n.t('exit', {locale: lang}),
      I18n.t('areYouExitApp', {locale: lang}),
      [
        {
          text: I18n.t('no', {locale: lang}),
          onPress: () => console.log('come'),
          style: 'cancel',
        },
        {
          text: I18n.t('yes', {locale: lang}),
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {cancelable: false},
    );

    return true;
  };

  const handleFacebookLogin = async () => {
    LoginManager.logOut();
    LoginManager.setLoginBehavior('browser');
    /* if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    } */
    let data = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_gender',
    ]).then(async function (result) {
      if (result.isCancelled) {
        return false;
      } else {
        let accessToken = await AccessToken.getCurrentAccessToken().then(
          async data => {
            const {accessToken} = data;

            return accessToken;
          },
        );

        let addUserData = await initUser(accessToken);

        async function initUser(token) {
          let userData = await fetch(
            'https://graph.facebook.com/me?fields=email,first_name,last_name,name&access_token=' +
              token,
          )
            .then(response => response.json())
            .then(json => {
              const addUserData = {
                first_name: json.first_name,
                last_name: json.last_name,
                email: json.email,
                is_notification: true,
                is_social_login: true,
                social_login_id: json.id,
                token: token,
              };
              return addUserData;
            })
            .catch(() => {
              reject('ERROR GETTING DATA FROM FACEBOOK');
              return false;
            });
          return userData;
        }
        return addUserData;
      }
    });
    if (data) {
      props.socialLoginUser(data, props.navigation);
    }
  };

  const onAppleButtonPress = async () => {
    return appleAuth
      .performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      })
      .then(appleAuthRequestResponse => {
        let {email, fullName, identityToken, user} = appleAuthRequestResponse;
        const addUserData = {
          first_name: fullName.givenName || '',
          last_name: fullName.familyName || '',
          email: email || '',
          is_notification: true,
          is_social_login: true,
          social_login_id: user,
          token: identityToken,
        };

        props.socialLoginUser(addUserData, props.navigation);
      });
  };

  const flexDirection = props.setting.lang === 'ar' ? 'row-reverse' : 'row';
  const textAlign = props.setting.lang === 'ar' ? 'right' : 'left';

  return (
    <>
      {props.errors.isLodaing ? (
        <Loading />
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}> CLASSTAP </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/img/Group_5602x.png')}
              style={{resizeMode: 'cover', width: '100%', height: '100%'}}
            />
          </View>
          <View style={styles.contentContainer}>
            <Text style={[styles.contentTitle, {textAlign: textAlign}]}>
              {I18n.t('welcomeTitle', {locale: props.setting.lang})}
            </Text>
            <Text style={[styles.contentSmallTitle, {textAlign: textAlign}]}>
              {I18n.t('welcomeTitleSmall', {locale: props.setting.lang})}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Signup')}
              style={styles.accountButton}>
              <Text style={styles.accountButtonText}>
                {I18n.t('createAccountButton', {locale: props.setting.lang})}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFacebookLogin}
              style={[styles.facebookButton, {flexDirection: flexDirection}]}>
              <FIcon name="facebook" size={18} color="#3578E5" />
              <Text style={styles.facebookButtonText}>
                {I18n.t('signUpFacebook', {locale: props.setting.lang})}
              </Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && parseFloat(Platform.Version) >= 13 ? (
              <TouchableOpacity
                onPress={onAppleButtonPress}
                style={[styles.appleButton, {flexDirection: flexDirection}]}>
                <FIcon name="apple" size={18} color="#000000" />
                <Text style={styles.appleButtonText}>
                  {I18n.t('continueWithApple', {locale: props.setting.lang})}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={handleGuestAccount}
              style={styles.guestAccount}>
              <Text style={styles.guestAccountText}>
                {I18n.t('continueGuest', {locale: props.setting.lang})}
              </Text>
            </TouchableOpacity>
            <View
              style={[styles.alreadyAccount, {flexDirection: flexDirection}]}>
              <Text style={styles.alreadyAccountText}>
                {I18n.t('alreadyAccount', {locale: props.setting.lang})}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Login')}>
                <Text style={styles.alreadyAccountTextLogin}>
                  {I18n.t('logIn', {locale: props.setting.lang})}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

import styles from './styles';
import Const from '../../utils/Const';

const mapStateToProps = state => ({
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  socialLoginUser,
  clearErrors,
  clearSocialErrors,
  clearLoading,
  setLatLong,
})(Welcome);
