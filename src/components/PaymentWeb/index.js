import {Body, Button, Header, Icon, Left, Text} from 'native-base';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {clearErrors} from '../../actions/errorAction';
import {addBookingClass} from '../../actions/subscriptionActions';
const {width, height} = Dimensions.get('window');

import moment from 'moment-timezone';

import I18n from '../../utils/i18n';
moment.tz.setDefault('Asia/Qatar');

import {WebView} from 'react-native-webview';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const.js';

export class PaymentWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: '',
      visible: true,
    };
  }
  componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.PAYMENT_WEB_SCREEN);
    this.props.clearErrors();
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }
  _onNavigationStateChange(webViewState) {
    const res = webViewState.url.includes('backToMerchant');
    const cancel = webViewState.url.includes('cancelOperation');
    const error = webViewState.url.includes('cancelOperation');

    if (res) {
      this.props.handlePaymentWeb('success');
    } else if (cancel) {
      this.props.handlePaymentWeb();
    } else if (error) {
      this.props.handlePaymentWeb('failed');
    }
  }

  handleBack = () => {
    this.props.handlePaymentWeb();
  };

  hideSpinner = () => {
    this.setState({visible: false});
  };

  render() {
    const {lang} = this.props.setting;
    const {
      access_code,
      amount,
      command,
      currency,
      customer_email,
      customer_ip,
      language,
      merchant_identifier,
      merchant_reference,
      signature,
      token_name,
    } = this.props.data;

    const INJECTED_JAVASCRIPT = `(function() {
      Array.from(document.getElementsByTagName('input')).forEach((item) => {
        if(item.name == "merchant_reference") {
            item.value = '${merchant_reference}';
        }
        if(item.name == "access_code") {
          item.value = '${access_code}';
        }
        if(item.name == "amount") {
          item.value = '${amount}';
        }
        if(item.name == "command") {
          item.value = '${command}';
        }
        if(item.name == "customer_email") {
          item.value = '${customer_email}';
        }
        if(item.name == "currency") {
          item.value = '${currency}';
        }
        if(item.name == "customer_ip") {
          item.value = '${customer_ip}';
        }
        if(item.name == "language") {
          item.value = '${language}';
        }
        if(item.name == "merchant_identifier") {
          item.value = '${merchant_identifier}';
        }
        if(item.name == "signature") {
          item.value = '${signature}';
        }
        if(item.name == "token_name") {
          item.value = '${token_name}';
        }
      })
    })();`;

    return (
      <Modal
        visible={this.props.isShowPaymentWeb}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.handleBack();
        }}>
        <SafeAreaView style={styles.modalContent}>
          <Header style={styles.headerContainer}>
            <Left>
              <Button transparent onPress={this.handleBack}>
                <View style={styles.backButtonContainer}>
                  <Icon
                    type="FontAwesome"
                    name="angle-left"
                    style={styles.backButtonIcon}
                  />
                  <Text style={styles.backButtonText}>
                    {I18n.t('back', {locale: lang})}
                  </Text>
                </View>
              </Button>
            </Left>
            <Body />
          </Header>
          {this.props.data && (
            <WebView
              onLoad={() => this.hideSpinner()}
              // source={Platform.OS === 'android' ? {html: require("./html.js")()} : (required('./test.html'))}
              style={{flex: 1}}
              source={{html: require('./html.js')()}}
              onNavigationStateChange={this._onNavigationStateChange.bind(this)}
              injectedJavaScript={INJECTED_JAVASCRIPT}
              mixedContentMode={'always'}
              javaScriptEnabled={true}
              onMessage={event => {
                console.log('event: ', event);
              }}
            />
          )}
          {this.state.visible && (
            <ActivityIndicator
              style={{position: 'absolute', top: height / 2, left: width / 2}}
              size="large"
            />
          )}
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  backButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButtonIcon: {
    color: '#22242A',
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  backButtonText: {
    color: '#22242A',
    fontSize: normalize(12),
    top: Platform.OS === 'ios' ? normalize(3) : normalize(3.3),
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
  },
  modalContent: {
    flex: 1,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  clearErrors,
  addBookingClass,
})(PaymentWeb);
