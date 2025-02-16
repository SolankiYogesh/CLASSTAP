import {Container, Form, Input, Item} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-notifications';
import FIcon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';

import {clearResetPassword, resetPassword} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import HeaderComponent from '../../components/Header';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import {resetValidation} from '../../validation/validation';
import Loading from '../Loading';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

export class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPassword: '',
      password: '',
      isPasswordSecure: true,
      isConfirmPasswordSecure: true,
      errors: {},
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.auth.isAuthenticated) {
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
    if (props.auth.isResetPassword) {
      // toast.show(I18n.t('PasswordChangedSucessfully', {locale: props.setting.lang}), {
      //   type: "normal",
      //   placement: "bottom",
      //   duration: 2000,
      //   offset: 30,
      //   animationType: "slide-in",
      // });
      props.navigation.navigate('Login');
    }
    return null;
  }

  componentDidUpdate = prevProps => {
    if (!prevProps.auth.isResetPassword && this.props.auth.isResetPassword) {
      toast.show(
        I18n.t('PasswordChangedSucessfully', {
          locale: this.props.setting.lang,
        }),
        {
          type: 'normal',
          placement: 'bottom',
          duration: 2000,
          offset: 30,
          animationType: 'slide-in',
        },
      );
    }
  };
  handleChangeText = (name, value) => {
    const {errors} = this.state;
    if (name === 'password' && errors.isPassword) {
      delete errors.isPassword;
    } else if (name === 'password' && errors.isPassword) {
      delete errors.isPassword;
    }
    if (errors[name]) {
      delete errors[name];

      //delete errors.common;
    }
    //this.props.clearErrors();
    this.setState({[name]: value, errors});
  };
  handleShowPassword = () => {
    this.setState({isPasswordSecure: !this.state.isPasswordSecure});
  };
  handleShowConfirmPassword = () => {
    this.setState({
      isConfirmPasswordSecure: !this.state.isConfirmPasswordSecure,
    });
  };
  handleResetPassword = () => {
    const {confirmPassword, password} = this.state;
    const addUserData = {
      mobile: this.props.navigation.getParam('mobile'),
      password: password,
      confirm_password: confirmPassword,
      otp: this.props.navigation.getParam('otp'),
    };
    const {lang} = this.props.setting;
    const {errors, isValid} = resetValidation(addUserData, lang);
    if (isValid) {
      this.props.resetPassword(addUserData, this.props.navigation);
    } else {
      this.setState({errors});
    }
  };

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearResetPassword();
  }

  componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.RESET_PASSWORD);
    this.props.clearErrors();
  }
  render() {
    const {
      errors,
      password,
      confirmPassword,
      isPasswordSecure,
      isConfirmPasswordSecure,
    } = this.state;
    const {lang} = this.props.setting;
    const {isLodaing} = this.props.errors;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
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
                  {I18n.t('resetPassword', {locale: lang})}
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Form>
                  <View>
                    <Item
                      error={errors.isPassword ? true : false}
                      style={[
                        styles.formInputText,
                        {flexDirection: flexDirection},
                      ]}>
                      <FIcon
                        name={isPasswordSecure ? 'lock' : 'unlock-alt'}
                        size={normalize(18)}
                        style={{
                          flexDirection: flexDirection,
                        }}
                      />
                      <Input
                        placeholderTextColor="#8A8A8F"
                        placeholder={I18n.t('newPassword', {locale: lang})}
                        secureTextEntry={isPasswordSecure}
                        style={
                          lang === 'ar'
                            ? styles.formInputArabic
                            : styles.formInput
                        }
                        onChangeText={val =>
                          this.handleChangeText('password', val)
                        }
                        value={password}
                      />
                      <TouchableOpacity onPress={this.handleShowPassword}>
                        <Text style={{fontSize: normalize(11)}}>
                          {isPasswordSecure
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
                  <View>
                    <Item
                      error={errors.isConfirmPassword ? true : false}
                      style={[
                        styles.formInputText,
                        {flexDirection: flexDirection},
                      ]}>
                      <FIcon
                        name={isConfirmPasswordSecure ? 'lock' : 'unlock-alt'}
                        size={normalize(18)}
                        style={{
                          flexDirection: flexDirection,
                        }}
                      />
                      <Input
                        placeholderTextColor="#8A8A8F"
                        placeholder={I18n.t('confirmPassword', {
                          locale: lang,
                        })}
                        secureTextEntry={isConfirmPasswordSecure}
                        style={
                          lang === 'ar'
                            ? styles.formInputArabic
                            : styles.formInput
                        }
                        onChangeText={val =>
                          this.handleChangeText('confirmPassword', val)
                        }
                        value={confirmPassword}
                      />
                      <TouchableOpacity
                        onPress={this.handleShowConfirmPassword}>
                        <Text style={{fontSize: normalize(11)}}>
                          {isConfirmPasswordSecure
                            ? I18n.t('show', {locale: lang})
                            : I18n.t('hide', {locale: lang})}
                        </Text>
                      </TouchableOpacity>
                    </Item>
                    {errors.confirmPassword ? (
                      <Text
                        style={[styles.errorMessage, {textAlign: textAlign}]}>
                        {errors.confirmPassword}
                      </Text>
                    ) : null}
                  </View>
                </Form>
                {errors.common ? (
                  <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                    {errors.common}
                  </Text>
                ) : null}
                <TouchableOpacity
                  onPress={this.handleResetPassword}
                  style={styles.accountButton}>
                  <Text style={styles.accountButtonText}>
                    {I18n.t('reset', {locale: lang})}
                  </Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#FE9800',
    borderRadius: normalize(23),
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(45),
    marginVertical: normalize(15),
  },
  accountButtonText: {
    color: '#ffffff',
    fontSize: normalize(15),
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
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
  formContainer: {
    flex: 5,
    justifyContent: 'flex-start',
  },
  formInput: {
    fontSize: normalize(14),
    marginLeft: normalize(5),
  },
  formInputArabic: {
    flexDirection: 'row',
    fontSize: normalize(14),
    marginLeft: normalize(5),
    textAlign: 'right',
  },
  formInputText: {
    //flex: 1,
    marginLeft: '10%',
    marginRight: '10%',
    marginVertical: '2%',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
  },
  titleContainer: {
    flex: 2,
    //height: 80,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    //alignItems: 'center',
  },
  titleText: {
    fontFamily: 'arial',
    fontSize: normalize(40),
    fontWeight: 'bold',
  },
  titleTextSmall: {
    color: '#8A8A8F',
    fontSize: normalize(13),
    marginTop: normalize(5),
  },
  welcomeText: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeTextSmall: {
    color: '#000000',
    fontSize: normalize(12),
    marginTop: normalize(5),
    textAlign: 'center',
  },
  welcomeUserContainer: {
    alignItems: 'center',
    flex: 5,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  resetPassword,
  clearErrors,
  clearResetPassword,
})(ResetPassword);
