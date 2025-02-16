import { Button,    Text} from 'native-base';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  // Text,
  View,
} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome6';

import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {clearErrors} from '../../actions/errorAction';
import {addBookingClass} from '../../actions/subscriptionActions';
const {width, height} = Dimensions.get('window');

import moment from 'moment-timezone';

import I18n from '../../utils/i18n';
moment.tz.setDefault('Asia/Qatar');

import {WebView} from 'react-native-webview';

class Term extends Component {
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

    return (
      <Modal
        visible={this.props.isShowTermUrl}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.handleBack();
        }}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.headerContainer}>
          <Button backgroundColor={"transparent"} onPress={this.handleBack}>
                <View style={styles.backButtonContainer}>
                  <FIcon
                    name="angle-left"
                    style={styles.backButtonIcon}
                  />
                  <Text style={styles.backButtonText}>
                    {I18n.t('back', {locale: lang})}
                  </Text>
                </View>
              </Button>
            <View />
          </View>
          <WebView
            onLoad={() => this.hideSpinner()}
            source={{uri: this.props.url}}
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
  },
  headerContainer: {
    borderBottomWidth: 0,
    width:"100%",
    alignItems:"flex-start",
    backgroundColor:"#ffffff"
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
