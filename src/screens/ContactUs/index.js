import axios from 'axios';
import {Container, Form, Input, Item, Textarea} from 'native-base';
import React, {Component} from 'react';
import {
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-notifications';
import {connect} from 'react-redux';

import {registerUser} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import MailIcon from '../../assets/img/mail.svg';
import PhoneIcon from '../../assets/img/phone.svg';
import UserIcon from '../../assets/img/user.svg';
import HeaderComponent from '../../components/Header';
import {API_URI} from '../../utils/config';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import {contactValidation} from '../../validation/validation';
import Loading from '../Loading';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

export class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: `${props.auth.user.first_name} ${props.auth.user.last_name}`,
      email: props.auth.user.email,
      mobile: props.auth.user.mobile,
      message: '',
      errors: {},
      isEnablrdScroll: false,
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

  handleChangeText = (name, value) => {
    const {errors} = this.state;
    if (name === 'name' && errors.isName) {
      delete errors.isName;
    } else if (name === 'email' && errors.isEmail) {
      delete errors.isEmail;
    } else if (name === 'mobile' && errors.isMobile) {
      delete errors.isMobile;
    } else if (name === 'message' && errors.isMessage) {
      delete errors.isMessage;
    }
    if (errors[name]) {
      delete errors[name];

      //delete errors.common;
    }
    delete errors.common;
    this.props.clearErrors();
    this.setState({[name]: value, errors});
  };
  handleCreateContact = async () => {
    const {name, mobile, email, message} = this.state;
    const addUserData = {
      name: name,
      mobile: mobile,
      mobile_number: mobile,
      mobile_code: '+974',
      email: email,
      message: message,
      user_id: this.props.auth.user.id,
    };
    const {lang} = this.props.setting;
    const {errors, isValid} = contactValidation(addUserData, lang);

    if (isValid) {
      await axios
        .post(`${API_URI}/contact_us`, addUserData)
        .then(async res => {
          if (res.data.error.code) {
          } else {
            const {data} = res.data;
            toast.show(
              I18n.t('sendSucessfully', {locale: this.props.setting.lang}),
              {
                type: 'success',
                placement: 'bottom',
                duration: 2000,
                offset: 30,
                animationType: 'slide-in',
              },
            );
            this.setState({
              message: '',
              errors: {},
              isEnablrdScroll: false,
            });
          }
        })
        .catch(err => {
          /* if (err.response.data.error) {
        } */
        });
      // this.props.registerUser(addUserData, this.props.navigation);
    } else {
      this.setState({errors});
    }
  };
  handleMoveLogin = () => {
    this.setState({
      message: '',
      errors: {},
      isEnablrdScroll: false,
    });
    this.props.clearErrors();
    this.props.navigation.navigate('Login');
  };

  componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.CONTACT_US_SCREEN);
    this.props.clearErrors();
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async () => {
    this.props.navigation.goBack();
    return true;
  };

  render() {
    const {lang} = this.props.setting;
    const {name, email, mobile, message, errors, isEnablrdScroll} = this.state;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const {isLodaing} = this.props.errors;
    return (
      <>
        {isLodaing ? (
          <Loading />
        ) : (
          <Container>
            <HeaderComponent navigation={this.props.navigation} />
            <View style={styles.contentContainer}>
              <View style={styles.titleContainer}>
                <Text style={[styles.titleText, {textAlign: textAlign}]}>
                  {I18n.t('contactus', {locale: lang})}
                </Text>
              </View>
              <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardShouldPersistTaps={'handled'}
                enableResetScrollToCoords={false}
                scrollEnabled={isEnablrdScroll}
                enableAutomaticScroll={isEnablrdScroll}>
                <View style={styles.formContainer}>
                  <Form>
                    <View style={{display: 'flex'}}>
                      <Item
                        error={errors.isName ? true : false}
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}>
                        <UserIcon
                          width={normalize(20)}
                          height={normalize(20)}
                        />
                        {/*  <FIcon name="envelope" size={18} /> */}
                        <Input
                          //disabled
                          placeholderTextColor="#8A8A8F"
                          placeholder={I18n.t('name', {locale: lang})}
                          style={
                            lang === 'ar'
                              ? styles.formInputArabic
                              : styles.formInput
                          }
                          onChangeText={val =>
                            this.handleChangeText('name', val)
                          }
                          value={name}
                          returnKeyLabel="Done"
                          returnKeyType="done"
                          onSubmitEditing={Keyboard.dismiss}
                        />
                      </Item>
                      {errors.name ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.name}
                        </Text>
                      ) : null}
                    </View>

                    <View style={{display: 'flex'}}>
                      <Item
                        error={errors.isEmail ? true : false}
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}>
                        <MailIcon
                          width={normalize(20)}
                          height={normalize(20)}
                        />
                        {/*  <FIcon name="envelope" size={18} /> */}
                        <Input
                          // disabled
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
                      </Item>
                      {errors.email ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.email}
                        </Text>
                      ) : null}
                    </View>
                    <View style={{display: 'flex'}}>
                      <Item
                        error={errors.isMobile ? true : false}
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}>
                        {/*  <FIcon name="phone" size={18} /> */}
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
                          //disabled
                          placeholderTextColor="#8A8A8F"
                          minLength={8}
                          maxLength={8}
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
                    <View style={{display: 'flex'}}>
                      <Textarea
                        style={[
                          styles.formInputText,
                          {flexDirection: flexDirection},
                        ]}
                        rowSpan={5}
                        bordered
                        placeholderTextColor="#8A8A8F"
                        placeholder={I18n.t('message', {locale: lang})}
                        //borderColor="#cfcfcf"
                        onChangeText={val =>
                          this.handleChangeText('message', val)
                        }
                        value={message}
                        returnKeyLabel="Done"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                      {errors.message ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.message}
                        </Text>
                      ) : null}
                    </View>
                  </Form>
                </View>
                {errors.common ? (
                  <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                    {errors.common}
                  </Text>
                ) : null}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={this.handleCreateContact}
                    style={styles.accountButton}>
                    <Text style={styles.accountButtonText}>
                      {I18n.t('send', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </Container>
        )}
        <Toast ref={ref => (global['toast'] = ref)} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  accountButton: {
    height: normalize(46),
    backgroundColor: '#FE9800',
    marginHorizontal: normalize(45),
    borderRadius: normalize(23),
    justifyContent: 'center',
    //marginVertical: 10,
    marginBottom: normalize(9),
  },
  accountButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  alreadyAccount: {
    flex: 1,
    //flexDirection: 'row',
    alignSelf: 'center',
  },
  alreadyAccountText: {
    // textAlign: 'center',
    fontSize: normalize(13),
    flexDirection: 'column',
    alignSelf: 'flex-end',
    bottom: normalize(20),
  },
  buttonContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    marginVertical: normalize(20),
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'space-between',
  },
  errorMessage: {
    color: 'red',
    fontSize: normalize(12),
    marginLeft: '10%',
    marginRight: '10%',
  },
  facebookButton: {
    borderColor: '#0053FE',
    borderRadius: normalize(23),
    borderWidth: 1,
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(45),
    //marginVertical: 10,
  },

  facebookButtonText: {
    color: '#0053FE',
    textAlign: 'center',
  },
  formContainer: {
    flex: 10,
    justifyContent: 'space-evenly',
  },
  formInput: {
    fontSize: normalize(13),
    marginLeft: normalize(5),
  },
  formInputArabic: {
    flexDirection: 'row',
    fontSize: normalize(13),
    marginLeft: normalize(5),
    textAlign: 'right',
  },
  formInputText: {
    //flex: 1,
    marginLeft: '10%',
    marginRight: '10%',
    marginVertical: normalize(5),
    //direction: 'rtl',
    //flexDirection: 'row-reverse',
  },
  guestAccount: {
    marginLeft: normalize(20),
    marginRight: normalize(20),
    //marginVertical: 20,
  },
  guestAccountText: {
    //textAlign: 'center',
    fontSize: normalize(12),
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
  },

  loginText: {
    fontSize: normalize(13),
    fontWeight: 'bold',
  },
  loginTextButton: {
    alignSelf: 'flex-end',
    bottom: normalize(20),
    flexDirection: 'column',
  },
  notificationContainer: {
    display: 'flex',
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '2%',
  },
  sendControlContainerOuter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    //height: 80,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
  },
  titleText: {
    fontFamily: 'arial',
    fontSize: normalize(34),
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {registerUser, clearErrors})(ContactUs);
