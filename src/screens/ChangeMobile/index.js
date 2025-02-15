import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {Container, Form, Item, Input} from 'native-base';
import {connect} from 'react-redux';
import I18n from '../../utils/i18n';
import HeaderComponent from '../../components/Header';
import {forgotPasswordValidation} from '../../validation/validation';
import {changeMobile} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import isEmpty from '../../validation/is-empty';
import normalize from 'react-native-normalize';
import Loading from '../Loading';
import PhoneIcon from '../../assets/img/phone.svg';
export class ChangeMobile extends Component {
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
    const errors = this.state.errors;
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
  handleChangeMobile = () => {
    const {mobile} = this.state;
    const addUserData = {
      mobile: mobile,
      mobile_code: '+974',
    };
    const {lang} = this.props.setting;
    const {errors, isValid} = forgotPasswordValidation(addUserData, lang);

    if (isValid) {
      this.props.changeMobile(
        addUserData,
        this.props.auth.user.id,
        this.props.navigation,
      );
      this.setState({
        mobile: '',
        errors: {},
      });
    } else {
      this.setState({errors});
    }
  };
  componentDidMount() {
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
                  {I18n.t('changePhoneNumber', {locale: lang})}
                </Text>
                {/*  <Text style={[styles.titleTextSmall, {textAlign: textAlign}]}>
                  {I18n.t('forgotPasswordHelp', {locale: lang})}
                </Text> */}
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
                  onPress={this.handleChangeMobile}
                  style={styles.accountButton}>
                  <Text style={styles.accountButtonText}>
                    {I18n.t('update', {locale: lang})}
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
    flex: 3,
    //height: 80,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    //alignItems: 'center',
  },
  titleText: {
    fontSize: normalize(30),
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
    flex: 6,
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

export default connect(mapStateToProps, {changeMobile, clearErrors})(
  ChangeMobile,
);
