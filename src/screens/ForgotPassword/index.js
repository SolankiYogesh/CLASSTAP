import {Container, Form, Input, Item} from 'native-base';
import React, {Component} from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {forgotPassword} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import PhoneIcon from '../../assets/img/phone.svg';
import HeaderComponent from '../../components/Header';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import {forgotPasswordValidation} from '../../validation/validation';
import Loading from '../Loading';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

export class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      errors: {},
    };
  }

  static getDerivedStateFromProps(props, state) {
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
    if (name === 'mobile' && errors.isMobile) {
      delete errors.isMobile;
    }
    if (errors[name]) {
      delete errors[name];

      //delete errors.common;
    }
    delete errors.common;
    this.props.clearErrors();
    this.setState({[name]: value, errors});
  };
  handleForgotPassword = () => {
    const {mobile} = this.state;
    const addUserData = {
      mobile: mobile,
      mobile_code: '+974',
    };
    const {lang} = this.props.setting;
    const {errors, isValid} = forgotPasswordValidation(addUserData, lang);

    if (isValid) {
      this.props.forgotPassword(addUserData, this.props.navigation);
      this.setState({
        mobile: '',
        errors: {},
      });
    } else {
      this.setState({errors});
    }
  };
  componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.FORGOT_PASSWORD);
    this.props.clearErrors();
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }
  componentWillUnmount() {
    this.props.clearErrors();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }
  handleBack = async back => {
    this.props.navigation.goBack();
    return true;
  };
  render() {
    const {errors, mobile} = this.state;
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
                  {I18n.t('ForgotPassword', {locale: lang})}
                </Text>
                <Text style={[styles.titleTextSmall, {textAlign: textAlign}]}>
                  {I18n.t('forgotPasswordHelp', {locale: lang})}
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Form>
                  <View>
                    <Item
                      error={errors.isMobile ? true : false}
                      style={[
                        styles.formInputText,
                        {flexDirection: flexDirection},
                      ]}>
                      <PhoneIcon
                        width={normalize(20)}
                        height={normalize(20)}
                        style={{
                          transform: [
                            {rotate: lang === 'ar' ? '270deg' : '0deg'},
                          ],
                        }}
                      />
                      {/* <FIcon name="phone" size={18} /> */}
                      <Input
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
                      />
                    </Item>
                    {errors.mobile ? (
                      <Text
                        style={[styles.errorMessage, {textAlign: textAlign}]}>
                        {errors.mobile}
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
                  onPress={this.handleForgotPassword}
                  style={styles.accountButton}>
                  <Text style={styles.accountButtonText}>
                    {I18n.t('send', {locale: lang})}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Container>
        )}
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
    flex: 6,
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
    flex: 4,
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

export default connect(mapStateToProps, {forgotPassword, clearErrors})(
  ForgotPassword,
);
