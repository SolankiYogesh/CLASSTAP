import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Content, Item, Input, Container} from 'native-base';
import {Grid, Col} from 'react-native-easy-grid';
import {connect} from 'react-redux';
import I18n from '../../utils/i18n';
import HeaderComponent from '../../components/Header';
import {verifyOtp} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import isEmpty from '../../validation/is-empty';
import normalize from 'react-native-normalize';
import Loading from '../Loading';
import {API_URI} from '../../utils/config';
import axios from 'axios';
import Toast from 'react-native-toast-notifications';
class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {otp: [], timer: 30, errors: {}};
    this.otpTextInput = [];
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

  componentDidMount() {
    this.props.clearErrors();
    //if (this.otpTextInput[0]) {
    this.otpTextInput[0]._root.focus();
    this.interval = setInterval(
      () => this.setState(prevState => ({timer: prevState.timer - 1})),
      1000,
    );
    //}
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
    } else if (this.state.timer === 30) {
      /* this.interval = setInterval(
        () => this.setState(prevState => ({timer: prevState.timer - 1})),
        1000,
      ); */
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.props.clearErrors();
  }

  renderInputs() {
    //alert(this.state.otp.length);
    const inputs = Array(4).fill(0);
    const txt = inputs.map((i, j) => {
      return (
        <Col key={j} style={styles.txtMargin}>
          <Item
            style={{
              borderColor: this.state.otp.length > j ? '#FE9800' : '#C8C7CC',
              borderBottomWidth: this.state.otp.length > j ? 3 : 1,
            }}>
            <Input
              maxLength={1}
              style={[styles.inputRadius]}
              keyboardType="numeric"
              onChangeText={v => this.focusNext(j, v)}
              onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
              ref={ref => (this.otpTextInput[j] = ref)}
            />
          </Item>
        </Col>
      );
    });
    return txt;
  }

  focusPrevious(key, index) {
    if (key === 'Backspace' && index !== 0)
      this.otpTextInput[index - 1]._root.focus();
  }

  focusNext(index, value) {
    if (index < this.otpTextInput.length - 1 && value) {
      this.otpTextInput[index + 1]._root.focus();
    }
    if (index === this.otpTextInput.length - 1) {
      this.otpTextInput[index]._root.blur();
    }
    const otp = this.state.otp;
    otp[index] = value;
    this.setState({otp});
    if (otp.length === 4) {
      const is_forget = this.props.navigation.getParam('is_forget')
        ? true
        : false;
      let verifyOtpData = {
        mobile: this.props.navigation.getParam('mobile'),
        //mobile_code: this.props.navigation.getParam('mobile_code'),
        is_forget,
        otp: parseInt(otp.join('')),
      };
      this.props.verifyOtp(verifyOtpData, this.props.navigation);
      this.setState({otp: [], errors: {}});
      this.otpTextInput = [];
    }
    const {errors} = this.state;
    delete errors.common;
    this.props.clearErrors();
  }

  handleResendOtp = () => {
    const {lang} = this.props.setting;
    this.setState({timer: 30});
    this.interval = setInterval(
      () => this.setState(prevState => ({timer: prevState.timer - 1})),
      1000,
    );
    const userData = {
      mobile: this.props.navigation.getParam('mobile'),
      mobile_code: '+974',
    };
    axios
      .post(`${API_URI}/users/forgot_password`, userData)
      .then(res => {
        if (res.data.error.code) {
          
        } else {
          toast.show(I18n.t('resendOtpSendSuccessfully', {locale: this.props.setting.lang}), {
            type: "success",
            placement: "bottom",
            duration: 2000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      })
      .catch(err => {
        if (err.response.data.error) {
        }
      });
  };

  render() {
    const {timer, errors} = this.state;
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
                  {I18n.t('verifyOtpTitle', {locale: lang})}
                </Text>
                <Text style={[styles.titleTextSmall, {textAlign: textAlign}]}>
                  {I18n.t('verifyOtpTitleSmall', {locale: lang})}
                </Text>
              </View>
              <Grid style={styles.gridPad}>{this.renderInputs()}</Grid>

              <View style={{flex: 4, flexDirection: flexDirection}}>
                {errors.common ? (
                  <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                    {errors.common}
                  </Text>
                ) : null}
              </View>

              <View
                style={[
                  styles.resendContainer,
                  {flexDirection: flexDirection},
                ]}>
                <TouchableOpacity
                  onPress={this.handleResendOtp}
                  disabled={timer > 0 ? true : false}>
                  <Text style={[styles.resendText, {textAlign: textAlign}]}>
                    {I18n.t('resendCode', {locale: lang})}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.timerText, {textAlign: textAlign}]}>
                  {' '}
                  {timer}
                  {I18n.t('s', {locale: lang})}{' '}
                </Text>
              </View>
            </View>
          </Container>
        )}
        <Toast ref={(ref) => global['toast'] = ref} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    flex: 3,
    //justifyContent: 'center',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '5%',
  },
  titleText: {
    fontSize: normalize(40),
    fontWeight: 'bold',
  },
  titleTextSmall: {
    fontSize: normalize(13),
    color: '#8A8A8F',
  },
  gridPad: {flex: 4, marginHorizontal: '10%'},
  txtMargin: {margin: normalize(3)},
  inputRadius: {
    textAlign: 'center',
    fontSize: normalize(40),
    fontWeight: 'bold',
    color: '#FE9800',
    borderColor: '#FE9800',
    padding: 0,
  },
  resendContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: normalize(13),
    color: '#0053FE',
  },
  timerText: {
    fontSize: normalize(13),
    color: '#8A8A8F',
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

export default connect(
  mapStateToProps,
  {verifyOtp, clearErrors},
)(Otp);
