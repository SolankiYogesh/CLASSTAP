import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {
  Header,
  Icon,
  Left,
  Button,
  Body,
  // Title,
  //Right,
  Text,
} from 'native-base';
import {connect} from 'react-redux';
import I18n from '../../utils/i18n';
import normalize from 'react-native-normalize';
import {clearErrors} from '../../actions/errorAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isEmpty from '../../validation/is-empty';

const HeaderComponent = props => {
  const handleBack = async () => {
    props.clearErrors();
    if (!isEmpty(props.back)) {
      const classTabToken = await AsyncStorage.getItem('classTabToken');
      if (classTabToken) {
        props.navigation.navigate(props.back);
      } else {
        props.navigation.navigate('Auth');
      }
    } else {
      props.navigation.goBack();
    }
  };
  const {lang} = props.setting;
  return (
    <Header style={styles.headerContainer}>
      <Left>
        <Button transparent onPress={handleBack}>
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
  );
};

const styles = StyleSheet.create({
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
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {clearErrors})(HeaderComponent);
