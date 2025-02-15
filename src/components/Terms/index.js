import React, {Component} from 'react';
import {
  // Text,
  View,
  Modal,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import normalize from 'react-native-normalize';
import {
  Icon,
  Item,
  Picker,
  Header,
  Left,
  Button,
  Body,
  // Title,
  //Right,
  Text,
} from 'native-base';
import {clearErrors} from '../../actions/errorAction';
import {addBookingClass} from '../../actions/subscriptionActions';
import isEmpty from '../../validation/is-empty';
import {IMAGE_URI, API_URI} from '../../utils/config';
import axios from 'axios';
const {width, height} = Dimensions.get('window');

import I18n from '../../utils/i18n';
import moment from 'moment-timezone';
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
        <SafeAreaView style={[styles.modalContent]}>
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
  modalContent: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
  },
  backButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  backButtonIcon: {
    fontSize: normalize(18),
    color: '#22242A',
    fontWeight: 'bold',
  },
  backButtonText: {
    fontSize: normalize(12),
    color: '#22242A',

    top: Platform.OS === 'ios' ? normalize(3) : normalize(3.3),
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
