import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import {Checkbox, FormControl, Input} from 'native-base';
import React, {Component} from 'react';
import {
  BackHandler,
  Keyboard,
  Platform,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import normalize from 'react-native-normalize';
import FIcon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';

import {registerUser, socialLoginUser} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import LockIcon from '../../assets/img/lock.svg';
import MailIcon from '../../assets/img/mail.svg';
import PhoneIcon from '../../assets/img/phone.svg';
import UserIcon from '../../assets/img/user.svg';
import HeaderComponent from '../../components/Header';
import Term from '../../components/Terms';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import {registerValidation} from '../../validation/validation';
import Loading from '../Loading';
import styles from './styles';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      isNotification: true,
      isTerm: false,
      isSecure: true,
      errors: {},
      isEnablrdScroll: false,
      isShowTermUrl: false,
      is_newsletter: true,
    };
  }

  componentDidUpdate(props, state) {
    if (props.auth.isAuthenticated) {
      //props.history.push("/dashboard");
    }

    if (!isEmpty(props.errors.error)) {
      if (props.errors.error === 'Phone number already exist!') {
        return {
          errors: {
            isMobile: true,
            mobile: I18n.t('phoneNumberAlreadyExist', {
              locale: props.setting.lang,
            }),
          },
        };
      } else if (props.errors.error === 'Email already exist!') {
        return {
          errors: {
            isEmail: true,
            email: I18n.t('emailAlreadyExist', {
              locale: props.setting.lang,
            }),
          },
        };
      } else {
        return {
          errors: {common: props.errors.error},
        };
      }
    } else {
      if (state.errors.common) {
        delete state.errors.common;
      }
    }
    return null;
  }

  handleChangeText = (name, value) => {
    const {errors} = this.state;
    if (name === 'firstName' && errors.isFirstName) {
      delete errors.isFirstName;
    } else if (name === 'lastName' && errors.isLastName) {
      delete errors.isLastName;
    } else if (name === 'email' && errors.isEmail) {
      delete errors.isEmail;
    } else if (name === 'mobile' && errors.isMobile) {
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
  handleIsNotification = () => {
    this.setState({is_newsletter: !this.state.is_newsletter});
  };
  handleIsTerm = () => {
    this.setState({isTerm: !this.state.isTerm});
  };
  handleShowPassword = () => {
    this.setState({isSecure: !this.state.isSecure});
  };

  handleTerms = () => {};
  handleMoveLogin = () => {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      isNotification: true,
      isTerm: false,
      isSecure: true,
      errors: {},
      isEnablrdScroll: false,
    });
    this.props.clearErrors();
    this.props.navigation.navigate('Login');
  };

  onKeyboarDidShow = () => {
    this.setState({isEnablrdScroll: true});
  };

  onKeyboardWillHide = () => {
    this.setState({isEnablrdScroll: false});
  };

  componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.SIGN_UP);
    this.props.clearErrors();
    this.back = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack,
    );
  }

  componentWillUnmount() {
    this.props.clearErrors();
    if (this.back) {
      this.back?.remove();
    }
  }

  handleBack = async back => {
    this.props.navigation.goBack();
    return true;
  };

  handleTermUrl = () => {
    this.setState({
      isShowTermUrl: !this.state.isShowTermUrl,
    });
  };

  handlePasswordVal = e => {
    const {lang} = this.props.setting;
    let errors = {...this.state.errors};
    if (this.state.password.length < 6) {
      errors.password = I18n.t('PasswordMustMinimumCharacters', {locale: lang});
    } else {
      delete errors.password;
    }
    this.setState({errors});
  };

  handleCreateAccount = () => {
    const {
      firstName,
      lastName,
      mobile,
      email,
      password,
      isNotification,
      isTerm,
      is_newsletter,
    } = this.state;
    const addUserData = {
      first_name: firstName,
      last_name: lastName,
      mobile: mobile,
      mobile_number: mobile,
      mobile_code: '+974',
      email: email,
      password: password,
      is_notification: isNotification,
      is_newsletter: is_newsletter,
      is_term: isTerm,
    };
    const {lang} = this.props.setting;
    const {errors, isValid} = registerValidation(addUserData, lang);

    if (isValid) {
      this.props.registerUser(addUserData, this.props.navigation);
    } else {
      this.setState({errors});
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

  handleFacebookLogin = async () => {
    LoginManager.logOut();

    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('browser');
    }
    let data = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_gender',
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
                console.log('json', json);
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

  render() {
    const {lang} = this.props.setting;
    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      isNotification,
      isSecure,
      isTerm,
      errors,
      isEnablrdScroll,
      isShowTermUrl,
      is_newsletter,
    } = this.state;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';

    console.log(this.props);

    const {isLodaing} = this.props.errors;
    return (
      <>
        {isLodaing ? (
          <Loading />
        ) : (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
            }}>
            <HeaderComponent navigation={this.props.navigation} />
            <View style={styles.contentContainer}>
              <View style={styles.titleContainer}>
                <Text style={[styles.titleText, {textAlign: textAlign}]}>
                  {I18n.t('newApp', {locale: lang})}
                </Text>
                <Text style={[styles.titleText, {textAlign: textAlign}]}>
                  {I18n.t('letCreateYourLogin', {locale: lang})}
                </Text>
              </View>
              <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardShouldPersistTaps={'handled'}
                enableResetScrollToCoords={false}
                scrollEnabled={isEnablrdScroll}
                enableAutomaticScroll={isEnablrdScroll}>
                <View style={styles.formContainer}>
                  <FormControl
                    style={{
                      rowGap: normalize(10),
                    }}>
                    <View
                      style={{
                        flexDirection: flexDirection,
                      }}>
                      <View style={{flex: 1}}>
                        <View
                          style={{
                            flex: 1,
                            marginLeft: normalize(40),
                            flexDirection: flexDirection,
                          }}>
                          <Input
                            variant="underlined"
                            width={'100%'}
                            InputLeftElement={
                              <UserIcon
                                width={normalize(20)}
                                height={normalize(20)}
                              />
                            }
                            placeholderTextColor="#8A8A8F"
                            placeholder={I18n.t('firstName', {locale: lang})}
                            style={{
                              fontSize: normalize(13),
                              marginLeft: 5,
                              flexDirection: 'row',
                              textAlign: textAlign,
                            }}
                            onChangeText={val =>
                              this.handleChangeText('firstName', val)
                            }
                            value={firstName}
                            returnKeyLabel="Done"
                            returnKeyType="done"
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </View>
                        {errors.firstName ? (
                          <Text
                            style={[
                              styles.errorMessage,
                              {textAlign: textAlign},
                            ]}>
                            {errors.firstName}
                          </Text>
                        ) : null}
                      </View>
                      <View style={{flex: 1}}>
                        <View
                          error={errors.isLastName ? true : false}
                          style={{
                            flex: 1,
                            marginRight: normalize(40),
                            marginLeft: '7%',
                            flexDirection: flexDirection,
                          }}>
                          <Input
                            variant="underlined"
                            width={'100%'}
                            placeholderTextColor="#8A8A8F"
                            placeholder={I18n.t('lastName', {locale: lang})}
                            style={{
                              fontSize: normalize(13),
                              flexDirection: 'row',
                              textAlign: textAlign,
                            }}
                            onChangeText={val =>
                              this.handleChangeText('lastName', val)
                            }
                            value={lastName}
                            returnKeyLabel="Done"
                            returnKeyType="done"
                            onSubmitEditing={Keyboard.dismiss}
                          />
                        </View>
                        {errors.lastName ? (
                          <Text
                            style={[
                              styles.errorMessage,
                              {textAlign: textAlign},
                            ]}>
                            {errors.lastName}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={{display: 'flex'}}>
                      <View
                        error={errors.isEmail ? true : false}
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}>
                        <Input
                          InputLeftElement={
                            <MailIcon
                              width={normalize(20)}
                              height={normalize(20)}
                            />
                          }
                          variant="underlined"
                          width={'100%'}
                          autoCapitalize="none"
                          placeholderTextColor="#8A8A8F"
                          placeholder={I18n.t('email', {locale: lang})}
                          style={
                            lang === 'ar'
                              ? styles.formInputArabic
                              : styles.formInput
                          }
                          onChangeText={val =>
                            this.handleChangeText('email', val)
                          }
                          value={email}
                          returnKeyLabel="Done"
                          returnKeyType="done"
                          onSubmitEditing={Keyboard.dismiss}
                        />
                      </View>
                      {errors.email ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.email}
                        </Text>
                      ) : null}
                    </View>
                    <View style={{display: 'flex'}}>
                      <View
                        error={errors.isMobile ? true : false}
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}>
                        <Input
                          variant="underlined"
                          width={'100%'}
                          InputLeftElement={
                            <PhoneIcon
                              width={normalize(20)}
                              height={normalize(20)}
                              style={{
                                transform: [
                                  {rotate: lang === 'ar' ? '270deg' : '0deg'},
                                ],
                              }}
                            />
                          }
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
                      </View>
                      {errors.mobile ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.mobile}
                        </Text>
                      ) : null}
                    </View>
                    <View style={{display: 'flex'}}>
                      <View
                        error={errors.isPassword ? true : false}
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}>
                        <Input
                          InputLeftElement={
                            <LockIcon
                              width={normalize(20)}
                              height={normalize(20)}
                            />
                          }
                          variant="underlined"
                          width={'100%'}
                          onEndEditing={val => this.handlePasswordVal(val)}
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
                          InputRightElement={
                            <TouchableOpacity onPress={this.handleShowPassword}>
                              <Text
                                style={{
                                  fontSize: normalize(11),
                                  color: '#666666',
                                }}>
                                {isSecure
                                  ? I18n.t('show', {locale: lang})
                                  : I18n.t('hide', {locale: lang})}
                              </Text>
                            </TouchableOpacity>
                          }
                          onSubmitEditing={Keyboard.dismiss}
                        />
                      </View>
                      {errors.password ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.password}
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={[
                        styles.notificationContainer,
                        {
                          flexDirection: flexDirection,
                        },
                      ]}>
                      <View>
                        <Switch
                          style={{
                            display: 'flex',
                            alignSelf: 'flex-start',
                            borderColor: '#FE9800',
                            left:
                              Platform.OS === 'ios'
                                ? 0
                                : lang === 'ar'
                                  ? normalize(8)
                                  : normalize(-8),
                          }}
                          onValueChange={this.handleIsNotification}
                          value={is_newsletter}
                          trackColor={{true: '#FE9800', false: '#cfcfcf'}}
                          //trackColor={{true: '#FE9800', false: '#f5f6fc'}}
                          thumbColor="#fff"
                          ios_backgroundColor="#cfcfcf"
                          //thumbColor="#FE9800"
                        />
                      </View>
                      <View
                        style={{
                          marginLeft:
                            Platform.OS === 'ios'
                              ? normalize(10)
                              : normalize(2),
                          marginRight: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: normalize(12),
                            textAlign: textAlign,
                          }}>
                          {I18n.t('receiveUpdates', {locale: lang})}
                        </Text>
                        <Text
                          style={{
                            fontSize: normalize(12),
                            textAlign: textAlign,
                          }}>
                          {I18n.t('latestEvents', {locale: lang})}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: '4%',
                        marginLeft: normalize(40),
                        marginRight: normalize(40),
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: flexDirection,
                          alignItems: 'center',
                          marginBottom: normalize(10),
                        }}>
                        <Checkbox
                          isChecked={isTerm}
                          colorScheme={'primary'}
                          borderColor={'#FE9800'}
                          onPress={this.handleIsTerm}
                          style={{
                            width: normalize(25),
                            height: normalize(25),
                            borderRadius: 0,
                            borderWidth: 2,
                          }}
                        />
                        <TouchableOpacity
                          onPress={this.handleTermUrl}
                          style={styles.guestAccount}>
                          <Text style={styles.guestAccountText}>
                            {I18n.t('terms', {locale: lang})}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {errors.isTerm ? (
                      <Text
                        style={[styles.errorMessage, {textAlign: textAlign}]}>
                        {errors.isTerm}
                      </Text>
                    ) : null}
                  </FormControl>
                </View>
                {errors.common ? (
                  <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                    {errors.common}
                  </Text>
                ) : null}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={this.handleCreateAccount}
                    style={styles.accountButton}>
                    <Text style={styles.accountButtonText}>
                      {I18n.t('signUp', {locale: lang})}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.handleFacebookLogin}
                    style={styles.facebookButton}>
                    <Text style={styles.facebookButtonText}>
                      {I18n.t('signUpFacebook', {locale: lang})}
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
              <View
                style={[styles.alreadyAccount, {flexDirection: flexDirection}]}>
                <Text style={styles.alreadyAccountText}>
                  {I18n.t('alreadyAccount', {locale: lang})}{' '}
                </Text>
                <TouchableOpacity
                  onPress={this.handleMoveLogin}
                  style={styles.loginTextButton}>
                  <Text style={styles.loginText}>
                    {I18n.t('logIn', {locale: lang})}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Term
              isShowTermUrl={isShowTermUrl}
              handleTermUrl={this.handleTermUrl}
              navigation={this.props.navigation}
              url={'https://www.classtap.com/terms'}
            />
          </SafeAreaView>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  registerUser,
  clearErrors,
  socialLoginUser,
})(Signup);
