import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
  BackHandler,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';

import {Container, Form, Item, Input} from 'native-base';
import FIcon from '@react-native-vector-icons/fontawesome';
import {connect} from 'react-redux';
import I18n from '../../utils/i18n';
import HeaderComponent from '../../components/Header';
import {loginValidation} from '../../validation/validation';
import {loginUser, getUser} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import normalize from 'react-native-normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isEmpty from '../../validation/is-empty';
import Loading from '../Loading';
import {IMAGE_URI} from '../../utils/config';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {socialLoginUser} from '../../actions/authActions';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';

import PhoneIcon from '../../assets/img/phone.svg';
import LockIcon from '../../assets/img/lock.svg';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlreadyLogin: false,
      mobile: '',
      password: '',
      isSecure: true,
      errors: {},
      isEnablrdScroll: false,
      isLoading: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.auth.isAuthenticated) {
      //props.history.push("/dashboard");
    }

    if (!isEmpty(props.errors.error)) {
      return {
        errors: {common: props.errors.error},
      };
    } else {
      if (state.errors.common) {
        delete state.errors.common;
      }
    }
    return null;
  }
  async componentDidMount() {
    this.props.clearErrors();
    const user_id = await AsyncStorage.getItem('pre_user_id');
    if (user_id) {
      this.props.getUser(user_id);
    }

    this.setState({isAlreadyLogin: user_id ? true : false, isLoading: false});
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  onKeyboarDidShow = () => {
    this.setState({isEnablrdScroll: true});
  };

  onKeyboardWillHide = () => {
    this.setState({isEnablrdScroll: false});
  };

  componentWillUnmount() {
    this.props.clearErrors();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async back => {
    this.props.navigation.goBack();
    return true;
  };

  handleChangeText = (name, value) => {
    const errors = this.state.errors;
    if (name === 'mobile' && errors.isMobile) {
      delete errors.isMobile;
    } else if (name === 'password' && errors.isPassword) {
      delete errors.isPassword;
    }
    if (errors[name]) {
      delete errors[name];

      //delete errors.common;
    }
    delete errors.common;
    this.props.clearErrors();
    this.setState({[name]: value, errors});
  };
  handleShowPassword = () => {
    this.setState({isSecure: !this.state.isSecure});
  };
  handleLoginAccount = () => {
    const {mobile, password} = this.state;
    const addUserData = {
      mobile,
      password,
    };
    const {lang} = this.props.setting;
    const {errors, isValid} = loginValidation(addUserData, lang);

    if (isValid) {
      this.props.loginUser(addUserData, this.props.navigation);
    } else {
      this.setState({errors});
    }
  };

  handleMoveSignUp = () => {
    this.setState({
      isAlreadyLogin: false,
      mobile: '',
      password: '',
      isSecure: true,
      errors: {},
      isEnablrdScroll: false,
    });
    this.props.clearErrors();
    this.props.navigation.navigate('Signup');
  };

  handleMoveForgot = () => {
    this.setState({
      isAlreadyLogin: false,
      mobile: '',
      password: '',
      isSecure: true,
      errors: {},
      isEnablrdScroll: false,
    });
    this.props.clearErrors();
    this.props.navigation.navigate('ForgotPassword');
  };

  handleFacebookLogin = async () => {
    LoginManager.logOut();

    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('browser');
    }
    let data = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]).then(
      async function (result) {
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
                //Alert.alert(json.email.toString());

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
      },
      function (error) {},
    );
    if (data) {
      this.props.socialLoginUser(data, this.props.navigation);
    }
  };

  onAppleButtonPress = async () => {
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
        this.props.socialLoginUser(addUserData, this.props.navigation);
      });
  };

  render() {
    console.log(this.props.navigation, 'this.props.navigation');

    const {
      isAlreadyLogin,
      errors,
      mobile,
      password,
      isSecure,
      isEnablrdScroll,
      isLoading,
    } = this.state;

    const {lang} = this.props.setting;
    const {preUser: user} = this.props.auth;
    const {isLodaing} = this.props.errors;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const image = user.attachment
      ? {
          uri: `${IMAGE_URI}/${user.attachment.dir}/${user.attachment.file_name}`,
        }
      : require('../../assets/img/avatar1.png');
    // const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <Container>
            <HeaderComponent navigation={this.props.navigation} />

            <View style={styles.contentContainer}>
              <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardShouldPersistTaps={'handled'}
                enableResetScrollToCoords={false}
                scrollEnabled={isEnablrdScroll}
                enableAutomaticScroll={isEnablrdScroll}>
                {isAlreadyLogin ? (
                  <View style={styles.welcomeUserContainer}>
                    <View>
                      {image.url ? (
                        <FastImage
                          style={{
                            width: normalize(100),
                            height: normalize(100),
                            borderRadius: normalize(50),
                          }}
                          source={{
                            uri: image.url,
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ) : (
                        <Image
                          source={image}
                          style={{
                            width: normalize(100),
                            height: normalize(100),
                            borderRadius: normalize(50),
                          }}
                        />
                      )}
                    </View>

                    <View style={{marginVertical: normalize(10)}}>
                      <Text style={styles.welcomeText}>
                        {I18n.t('welcomeBack', {locale: lang})}
                      </Text>
                      <Text style={styles.welcomeText}>{`${
                        user.first_name || ''
                      } ${user.last_name || ''}`}</Text>
                      <Text style={styles.welcomeTextSmall}>
                        {I18n.t('logBack', {locale: lang})}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.titleContainer]}>
                    <Text style={[styles.titleText, {textAlign: textAlign}]}>
                      {I18n.t('newApp', {locale: lang})}
                    </Text>
                    <Text style={[styles.titleText, {textAlign: textAlign}]}>
                      {I18n.t('loginToYourAccount', {locale: lang})}
                    </Text>
                  </View>
                )}

                <View style={styles.formContainer}>
                  <Form>
                    <View>
                      <Item
                        error={errors.isMobile ? true : false}
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}>
                        {/* <FIcon name="phone" size={18} /> */}
                        <PhoneIcon
                          width={normalize(20)}
                          height={normalize(20)}
                          style={{
                            transform: [
                              {rotate: lang === 'ar' ? '270deg' : '0deg'},
                            ],
                          }}
                        />
                        <Input
                          placeholderTextColor="#8A8A8F"
                          minLength={8}
                          maxLength={13}
                          placeholder={I18n.t('phoneNumber', {locale: lang})}
                          style={
                            lang === 'ar'
                              ? styles.formInputArabic
                              : styles.formInput
                          }
                          onChangeText={val =>
                            this.handleChangeText('mobile', val)
                          }
                          value={mobile}
                          keyboardType="numeric"
                          returnKeyLabel="Done"
                          returnKeyType="done"
                          onSubmitEditing={Keyboard.dismiss}
                        />
                      </Item>
                      {errors.mobile ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.mobile}
                        </Text>
                      ) : null}
                    </View>
                    <View>
                      <Item
                        error={errors.isPassword ? true : false}
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}>
                        {/* <FIcon
                        name={isSecure ? 'lock' : 'unlock-alt'}
                        size={18}
                        style={{
                          flexDirection: flexDirection,
                        }}
                      /> */}
                        <LockIcon
                          width={normalize(20)}
                          height={normalize(20)}
                        />
                        <Input
                          placeholderTextColor="#8A8A8F"
                          placeholder={I18n.t('password', {locale: lang})}
                          secureTextEntry={isSecure}
                          style={
                            lang === 'ar'
                              ? styles.formInputArabic
                              : styles.formInput
                          }
                          onChangeText={val =>
                            this.handleChangeText('password', val)
                          }
                          value={password}
                          returnKeyLabel="Done"
                          returnKeyType="done"
                          onSubmitEditing={Keyboard.dismiss}
                        />
                        <TouchableOpacity onPress={this.handleShowPassword}>
                          <Text style={{fontSize: normalize(11)}}>
                            {isSecure
                              ? I18n.t('show', {locale: lang})
                              : I18n.t('hide', {locale: lang})}
                          </Text>
                        </TouchableOpacity>
                      </Item>
                      {errors.password ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.password}
                        </Text>
                      ) : null}
                    </View>
                  </Form>
                  {errors.common ? (
                    <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                      {typeof errors.common === 'string' ? errors.common : ''}
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    onPress={this.handleLoginAccount}
                    style={styles.accountButton}>
                    <Text style={styles.accountButtonText}>
                      {I18n.t('logIn', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.handleMoveForgot}
                    style={styles.forgotPasswordAccount}>
                    <Text style={styles.forgotPasswordAccountText}>
                      {I18n.t('forgotPassword', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.handleFacebookLogin}
                    style={styles.facebookButton}>
                    <Text style={styles.facebookButtonText}>
                      {I18n.t('logInFacebook', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                  {Platform.OS === 'ios' &&
                  parseFloat(Platform.Version) >= 13 ? (
                    <TouchableOpacity
                      onPress={this.onAppleButtonPress}
                      style={[
                        styles.appleButton,
                        {flexDirection: flexDirection},
                      ]}>
                      <FIcon name="apple" size={18} color="#000000" />
                      <Text style={styles.appleButtonText}>
                        {I18n.t('continueWithApple', {locale: lang})}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </KeyboardAwareScrollView>
              <View style={styles.buttonContainer}>
                <View
                  style={[
                    styles.alreadyAccount,
                    {flexDirection: flexDirection},
                  ]}>
                  <Text style={styles.alreadyAccountText}>
                    {I18n.t('dontHaveAnAccount', {locale: lang})}{' '}
                  </Text>
                  <TouchableOpacity onPress={this.handleMoveSignUp}>
                    <Text style={styles.signUpText}>
                      {I18n.t('SignUp', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Container>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
  },
  titleContainer: {
    flex: 1,
    //height: 80,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    //alignItems: 'center',
    marginBottom: normalize(35),
  },
  titleText: {
    fontSize: normalize(20),
    fontFamily: 'arial',
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeTextSmall: {
    fontSize: normalize(12),
    color: '#000000',
    textAlign: 'center',
    marginTop: normalize(5),
  },
  welcomeUserContainer: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    marginBottom: normalize(35),
  },
  formContainer: {
    flex: 6,
    justifyContent: 'space-evenly',
  },
  formInput: {
    marginLeft: normalize(5),
    fontSize: normalize(14),
  },
  formInputArabic: {
    marginLeft: normalize(5),
    flexDirection: 'row',
    textAlign: 'right',
    fontSize: normalize(14),
  },
  formInputText: {
    //flex: 1,
    marginLeft: '10%',
    marginRight: '10%',
    marginVertical: '2%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  accountButton: {
    height: normalize(46),
    backgroundColor: '#FE9800',
    marginHorizontal: normalize(45),
    borderRadius: normalize(23),
    justifyContent: 'center',
    marginVertical: normalize(15),
  },
  accountButtonText: {
    fontSize: normalize(15),
    textAlign: 'center',
    color: '#ffffff',
  },
  forgotPasswordAccount: {
    //marginVertical: '1%',
  },
  forgotPasswordAccountText: {
    textAlign: 'center',
    fontSize: normalize(13),
  },
  alreadyAccount: {
    justifyContent: 'center',
    //flexDirection: 'row',
  },

  alreadyAccountText: {
    textAlign: 'center',
    fontSize: normalize(13),
  },
  signUpText: {
    fontWeight: 'bold',
    fontSize: normalize(13),
  },
  errorMessage: {
    marginLeft: '10%',
    marginRight: '10%',
    color: 'red',
    fontSize: normalize(12),
  },
  facebookButton: {
    height: normalize(46),
    marginHorizontal: normalize(45),
    borderRadius: normalize(23),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0053FE',
    marginTop: 16,
  },
  facebookButtonText: {
    textAlign: 'center',
    color: '#0053FE',
  },
  appleButton: {
    marginTop: normalize(10),
    height: normalize(46),
    marginHorizontal: normalize(45),
    borderRadius: normalize(23),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
  },
  appleButtonText: {
    textAlign: 'center',
    color: '#000000',
    //fontSize: normalize(15),
    marginHorizontal: normalize(10),
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  loginUser,
  clearErrors,
  getUser,
  socialLoginUser,
})(Login);
