import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Container, Form, Item, Input} from 'native-base';
import FIcon from '@react-native-vector-icons/fontawesome';
import {connect} from 'react-redux';
import I18n from '../../utils/i18n';
import HeaderComponent from '../../components/Header';
import {resetValidation} from '../../validation/validation';
import {resetPassword, clearResetPassword} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import normalize from 'react-native-normalize';
import isEmpty from '../../validation/is-empty';
import Loading from '../Loading';
import Toast from 'react-native-toast-notifications';

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
    const errors = this.state.errors;
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
    flex: 2,
    //height: 80,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    //alignItems: 'center',
  },
  titleText: {
    fontSize: normalize(40),
    fontFamily: 'arial',
    fontWeight: 'bold',
  },
  titleTextSmall: {
    marginTop: normalize(5),
    fontSize: normalize(13),
    color: '#8A8A8F',
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
  },
  formContainer: {
    flex: 5,
    justifyContent: 'flex-start',
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
  errorMessage: {
    marginLeft: '10%',
    marginRight: '10%',
    color: 'red',
    fontSize: normalize(12),
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
