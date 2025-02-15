import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  Body,
  Button,
  Header,
  Icon,
  Left,
  // Title,
  //Right,
  Text
} from 'native-base'
import React from 'react'
import {Platform,StyleSheet, View} from 'react-native'
import normalize from 'react-native-normalize'
import {connect} from 'react-redux'

import {clearErrors} from '../../actions/errorAction'
import I18n from '../../utils/i18n'
import isEmpty from '../../validation/is-empty'

const HeaderComponent = props => {
  const handleBack = async () => {
    props.clearErrors()
    if (!isEmpty(props.back)) {
      const classTabToken = await AsyncStorage.getItem('classTabToken')
      if (classTabToken) {
        props.navigation.navigate(props.back)
      } else {
        props.navigation.navigate('Auth')
      }
    } else {
      props.navigation.goBack()
    }
  }
  const {lang} = props.setting
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
  )
}

const styles = StyleSheet.create({
  backButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  backButtonIcon: {
    color: '#22242A',
    fontSize: normalize(18),
    fontWeight: 'bold'
  },
  backButtonText: {
    color: '#22242A',
    fontSize: normalize(12),

    top: Platform.OS === 'ios' ? normalize(3) : normalize(3.3)
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0
  }
})

const mapStateToProps = state => ({
  setting: state.setting,
  errors: state.errors
})

export default connect(mapStateToProps, {clearErrors})(HeaderComponent)
