import {Body, Button, Header, Icon, Left, Text} from 'native-base';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  // Text,
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

export class Term extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: '',
      visible: true,
    };
  }
  componentDidMount() {
    this.props.clearErrors();
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleBack = () => {
    this.props.handleTermUrl();
  };
  hideSpinner = () => {
    this.setState({visible: false});
  };
  render() {
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';

    const {user} = this.props.auth;
    return (
      <Modal
        visible={this.props.isShowTermUrl}
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
          <WebView
            onLoad={() => this.hideSpinner()}
            source={{uri: this.props.url}}
            // onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          />
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
})(Term);
