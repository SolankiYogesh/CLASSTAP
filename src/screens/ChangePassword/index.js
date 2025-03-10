import {Container, Form, Input, Item} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';

import {registerUser} from '../../actions/authActions';
import HeaderComponent from '../../components/Header';
import I18n from '../../utils/i18n';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlreadyLogin: true,
      mobile: '',
      password: '',
      isSecure: true,
      errors: {},
    };
  }
  handleChangeText = (name, value) => {
    const {errors} = this.state;
    if (name === 'mobile' && errors.isMobile) {
      delete errors.isMobile;
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
    this.setState({isSecure: !this.state.isSecure});
  };
  handleCreateAccount = () => {};
  render() {
    const {isAlreadyLogin, errors, mobile, password, isSecure} = this.state;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    return (
      <Container>
        <HeaderComponent navigation={this.props.navigation} />
        <View style={styles.contentContainer}>
          {isAlreadyLogin ? (
            <View style={styles.welcomeUserContainer}>
              <View></View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.welcomeText}>
                  {I18n.t('welcomeBack', {locale: lang})}
                </Text>
                <Text style={styles.welcomeText}>Khaled Abderlrahman</Text>
                <Text style={styles.welcomeTextSmall}>
                  {I18n.t('logBack', {locale: lang})}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                {I18n.t('newApp', {locale: lang})}
              </Text>
              <Text style={styles.titleText}>
                {I18n.t('loginToYourAccount', {locale: lang})}
              </Text>
            </View>
          )}

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
                    name={isSecure ? 'lock' : 'unlock-alt'}
                    size={18}
                    style={{
                      flexDirection: flexDirection,
                    }}
                  />
                  <Input
                    placeholder={I18n.t('password', {locale: lang})}
                    secureTextEntry={isSecure}
                    style={
                      lang === 'ar' ? styles.formInputArabic : styles.formInput
                    }
                    onChangeText={val => this.handleChangeText('password', val)}
                    value={password}
                  />
                  <TouchableOpacity onPress={this.handleShowPassword}>
                    <Text>
                      {isSecure
                        ? I18n.t('show', {locale: lang})
                        : I18n.t('hide', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                </Item>
                {errors.password ? (
                  <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                    {errors.password}
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
                  <FIcon
                    name={isSecure ? 'lock' : 'unlock-alt'}
                    size={18}
                    style={{
                      flexDirection: flexDirection,
                    }}
                  />
                  <Input
                    placeholder={I18n.t('password', {locale: lang})}
                    secureTextEntry={isSecure}
                    style={
                      lang === 'ar' ? styles.formInputArabic : styles.formInput
                    }
                    onChangeText={val => this.handleChangeText('password', val)}
                    value={password}
                  />
                  <TouchableOpacity onPress={this.handleShowPassword}>
                    <Text>
                      {isSecure
                        ? I18n.t('show', {locale: lang})
                        : I18n.t('hide', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                </Item>
                {errors.password ? (
                  <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                    {errors.password}
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
                  <FIcon
                    name={isSecure ? 'lock' : 'unlock-alt'}
                    size={18}
                    style={{
                      flexDirection: flexDirection,
                    }}
                  />
                  <Input
                    placeholder={I18n.t('password', {locale: lang})}
                    secureTextEntry={isSecure}
                    style={
                      lang === 'ar' ? styles.formInputArabic : styles.formInput
                    }
                    onChangeText={val => this.handleChangeText('password', val)}
                    value={password}
                  />
                  <TouchableOpacity onPress={this.handleShowPassword}>
                    <Text>
                      {isSecure
                        ? I18n.t('show', {locale: lang})
                        : I18n.t('hide', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                </Item>
                {errors.password ? (
                  <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>
            </Form>
            <TouchableOpacity
              onPress={this.handleCreateAccount}
              style={styles.accountButton}>
              <Text style={styles.accountButtonText}>
                {I18n.t('logIn', {locale: lang})}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleCreateAccount}
              style={styles.forgotPasswordAccount}>
              <Text style={styles.forgotPasswordAccountText}>
                {I18n.t('forgotPassword', {locale: lang})}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.alreadyAccount}>
              <Text style={styles.alreadyAccountText}>
                {I18n.t('dontHaveAnAccount', {locale: lang})}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Signup')}>
                <Text style={styles.signUpText}>
                  {I18n.t('signup', {locale: lang})}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  accountButton: {
    backgroundColor: '#FE9800',
    borderRadius: 23,
    height: 46,
    justifyContent: 'center',
    marginHorizontal: 45,
    marginVertical: 15,
  },
  accountButtonText: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
  },
  alreadyAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  alreadyAccountText: {
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
    flex: 1,
    justifyContent: 'space-between',
  },
  forgotPasswordAccount: {
    marginVertical: '1%',
  },
  forgotPasswordAccountText: {
    fontSize: 13,
    textAlign: 'center',
  },
  formContainer: {
    flex: 5,
    justifyContent: 'flex-start',
  },
  formInput: {
    marginLeft: 5,
  },
  formInputArabic: {
    flexDirection: 'row',
    marginLeft: 5,
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
  signUpText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    //height: 80,
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    //alignItems: 'center',
  },
  titleText: {
    fontFamily: 'arial',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  welcomeTextSmall: {
    color: '#000000',
    fontSize: 12,
    marginTop: 5,
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

export default connect(mapStateToProps, {registerUser})(Login);
