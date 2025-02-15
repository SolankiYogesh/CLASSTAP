import moment from 'moment-timezone'
import {Body, Card, CardItem, Icon, Text} from 'native-base'
import React, {Component} from 'react'
import {
  Alert,
  BackHandler,
  Dimensions,
  ImageBackground,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import normalize from 'react-native-normalize'
import {connect} from 'react-redux'

import {currentUser, logoutUser, updateUser} from '../../actions/authActions'
import {API_URI, IMAGE_URI} from '../../utils/config'
import I18n from '../../utils/i18n'
import isEmpty from '../../validation/is-empty'
import Loading from '../Loading'
moment.tz.setDefault('Asia/Qatar')
import axios from 'axios'
import Toast from 'react-native-toast-notifications'

import {
  addUserSubscription,
  getSubscriptions,
  getSubscriptionsRefresh
} from '../../actions/subscriptionActions'
import AccountIcon from '../../assets/img/account_box.svg'
// Svg Icons
import CalendarIcon from '../../assets/img/calendar.svg'
import ContactIcon from '../../assets/img/contact.svg'
import LogoutIcon from '../../assets/img/exit_to_app.svg'
import FitnessIcon from '../../assets/img/fitness_center.svg'
import PaymentIcon from '../../assets/img/payment.svg'
import SettingIcon from '../../assets/img/settings.svg'
import PaymentSuccess from '../../components/PaymentSuccess'
import PaymentWeb from '../../components/PaymentWeb'

const {width} = Dimensions.get('window')
const {height} = Dimensions.get('window')

export class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowPaymentWeb: false,
      url: '',
      isShowPaymentSuccess: false,
      title: '',
      isShowRenew: false,
      isLoading: false,
      refreshing: false,
      isShowCancel: false
    }
  }

  async componentDidMount() {
    /*  if (isEmpty(this.props.auth.user)) {
      this.props.navigation.navigate('Login');
    } */
    this.props.getSubscriptions()
    const {user} = this.props.auth
    if (user.subscription_validity) {
      let GivenDate = await user.subscription_validity
      date = GivenDate.split(' ')
      let CurrentDate = new Date().getTime()
      GivenDate = new Date(date[0]).getTime()
      if (GivenDate < CurrentDate) {
        this.setState({isShowRenew: true, isShowCancel: false})
      } else {
        this.setState({isShowRenew: false, isShowCancel: true})
      }
    }
    // BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.focusListener = this.props.navigation.addListener('willFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.handleBack)
    })

    this.focusListener1 = this.props.navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
    })
    this.focusListener2 = this.props.navigation.addListener(
      'didFocus',
      async () => {
        const {user} = this.props.auth
        if (user.subscription_validity) {
          let GivenDate = await user.subscription_validity
          date = GivenDate.split(' ')
          let CurrentDate = new Date().getTime()
          GivenDate = new Date(date[0]).getTime()
          if (GivenDate < CurrentDate) {
            this.setState({isShowRenew: true, isShowCancel: false})
          } else {
            this.setState({isShowRenew: false, isShowCancel: true})
          }
        }
        // do something
        const {lang} = this.props.setting
        if (isEmpty(this.props.auth.user)) {
          Alert.alert(
            I18n.t('login', {locale: lang}),
            I18n.t('loginToProceed', {locale: lang}),
            [
              {
                text: I18n.t('no', {locale: lang}),
                onPress: () => this.props.navigation.navigate('Home'),
                style: 'cancel'
              },
              {
                text: I18n.t('yes', {locale: lang}),
                onPress: () => this.props.navigation.navigate('Login')
              }
            ],
            {
              cancelable: false
            },
          )
        }
      },
    )
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const {user} = nextProps.auth
    if (user.subscription_validity) {
      let GivenDate = await user.subscription_validity
      date = GivenDate.split(' ')
      let CurrentDate = new Date().getTime()
      GivenDate = new Date(date[0]).getTime()
      if (GivenDate < CurrentDate) {
        this.setState({isShowRenew: true, isShowCancel: false})
      } else {
        this.setState({isShowRenew: false, isShowCancel: true})
      }
    }
  }

  handleBack = async back => {
    this.props.navigation.navigate('Home')
    return true
  }

  componentWillUnmount() {
    this.focusListener.remove()
    this.focusListener1.remove()
    this.focusListener2.remove()
  }

  handleChoosePlanBooking = async e => {
    e.preventDefault()
    const {subscriptions} = this.props.subscription
    const {lang} = this.props.setting
    const {user} = this.props.auth
    const subscription = subscriptions.find(
      subc => subc.id === user.subscription_id,
    )
    this.setState({isLoading: true})
    if (!isEmpty(user.subscription_id)) {
      addData = {
        user_id: user.id,
        language: lang,
        subscription_id: user.subscription_id
      }

      axios
        .post(`${API_URI}/user_subscriptions`, addData)
        .then(res => {
          if (res.data.error.code) {
          } else {
            const {data, payment_url} = res.data

            this.setState({
              isShowPaymentWeb: true,
              url: payment_url,
              data: data,
              title: lang === 'ar' ? subscription.name_ar : subscription.name,
              isLoading: false
            })
          }
        })
        .catch(err => {
          if (err.response.data.error) {
            this.setState({isLoading: false})
          }
        })
      this.props.addUserSubscription(addData, this.props.navigation)
    } else {
      this.setState({isLoading: false})
    }
  }

  handlePaymentWeb = async (status = '') => {
    const {lang} = this.props.setting
    if (status === 'success') {
      this.setState({
        isShowPaymentWeb: false,
        isLoading: true
      })

      this.setState({
        isShowPaymentSuccess: !this.state.isShowPaymentSuccess,
        isLoading: false
      })
    } else if (status === 'failed') {
      toast.show(I18n.t('paymentFailed', {locale: lang}), {
        type: 'danger',
        placement: 'bottom',
        duration: 2000,
        offset: 30,
        animationType: 'slide-in'
      })
      this.setState({
        isShowPaymentWeb: false,
        count: this.state.count + 1
      })
    } else {
      this.setState({
        isShowPaymentWeb: false,
        count: this.state.count + 1,
        isLoading: false
      })
    }

    setTimeout(() => {
      this.setState({
        isShowPaymentWeb: false,
        count: this.state.count + 1,
        isLoading: false,
        isShowPaymentSuccess: false
      })
    }, 5000)
  }

  handlePaymentSuccess = () => {
    this.setState({
      isShowPaymentSuccess: !this.state.isShowPaymentSuccess
    })
  }

  handleRefresh = async () => {
    await this.props.currentUser()
    this.setState({refreshing: true})
    this.props.getSubscriptionsRefresh()
    const {user} = this.props.auth
    if (user.subscription_validity) {
      let GivenDate = await user.subscription_validity
      date = GivenDate.split(' ')
      let CurrentDate = new Date().getTime()
      GivenDate = new Date(date[0]).getTime()
      if (GivenDate < CurrentDate) {
        this.setState({isShowRenew: true, isShowCancel: false})
      } else {
        this.setState({isShowRenew: false, isShowCancel: true})
      }
    }
    setTimeout(() => {
      this.setState({refreshing: false})
    }, 2000)
  }

  handleCancelPlanBooking = () => {
    const {lang} = this.props.setting

    Alert.alert(
      I18n.t('message', {locale: lang}),
      I18n.t('cancelMembership', {locale: lang}),
      [
        {
          text: I18n.t('no', {locale: lang}),
          onPress: () => console.log('come'),
          style: 'cancel'
        },
        {
          text: I18n.t('yes', {locale: lang}),
          onPress: () => this.handleCancelMembership()
        }
      ],
      {
        cancelable: false
      },
    )
  }

  handleCancelMembership = () => {
    const {user} = this.props.auth
    const addData = {
      is_subscribed: 0
    }
    this.props.updateUser(addData, user.id)
  }

  render() {
    const {
      isShowPaymentWeb,
      url,
      data,
      isShowPaymentSuccess,
      title,
      isShowRenew,
      isLoading,
      refreshing,
      isShowCancel
    } = this.state
    const {lang} = this.props.setting
    const {user} = this.props.auth
    const image = user.attachment
      ? {
          uri: `${IMAGE_URI}/${user.attachment.dir}/${
            user.attachment.file_name
          }`
        }
      : require('../../assets/img/avatar1.png')
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const {isLodaing} = this.props.errors
    return (
      <>
        {isLodaing || isLoading ? (
          <Loading />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: '#ffffff'
            }}>
            <SafeAreaView style={{flex: 0, backgroundColor: '#FFFFFF'}} />
            <StatusBar /* hidden={true} */ />
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.handleRefresh}
                />
              }>
              <ImageBackground
                source={image}
                style={styles.welcomeImage}
                resizeMode="cover">
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                  }}>
                  {isShowRenew ? (
                    <TouchableOpacity
                      onPress={e => this.handleChoosePlanBooking(e)}
                      style={[
                        styles.renewButton,
                        {
                          alignSelf: lang === 'ar' ? 'flex-start' : 'flex-end',
                          marginTop:
                            Platform.OS === 'ios'
                              ? normalize(20)
                              : normalize(20)
                        }
                      ]}>
                      <Text style={{color: '#ffffff', fontSize: normalize(18)}}>
                        {I18n.t('renew', {locale: lang})}
                      </Text>
                    </TouchableOpacity>
                  ) : user && user.is_subscribed && isShowCancel ? (
                    <TouchableOpacity
                      onPress={e => this.handleCancelPlanBooking(e)}
                      style={[
                        styles.renewButton,
                        {
                          alignSelf: lang === 'ar' ? 'flex-start' : 'flex-end',
                          marginTop:
                            Platform.OS === 'ios'
                              ? normalize(45)
                              : normalize(20)
                        }
                      ]}>
                      <Text style={{color: '#ffffff', fontSize: normalize(18)}}>
                        {I18n.t('cancel', {locale: lang})}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      //marginTop: normalize(128),
                      marginHorizontal: normalize(17),
                      marginVertical: normalize(60)
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: normalize(40),
                          fontWeight: 'bold',
                          color: '#ffffff',
                          textAlign: textAlign
                        }}>
                        {`${user.first_name || ''} ${user.last_name || ''}`}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.subscribtionContainer,
                        {flexDirection: flexDirection}
                      ]}>
                      <View>
                        <Text
                          style={[
                            styles.subscribtionValue,
                            {textAlign: textAlign}
                          ]}>
                          {user.credits_balance ? user.credits_balance : 0}
                        </Text>
                        <Text style={styles.subscribtionTitle}>
                          {I18n.t('credits', {locale: lang})}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.subscribtionValue,
                            {textAlign: textAlign}
                          ]}>
                          {user.subscription
                            ? lang === 'ar'
                              ? user.subscription.name_ar
                              : user.subscription.name
                            : I18n.t('free', {locale: lang})}
                        </Text>
                        <Text style={styles.subscribtionTitle}>
                          {I18n.t('membership', {locale: lang})}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.subscribtionValue,
                            {textAlign: textAlign}
                          ]}>
                          {user.subscription_validity
                            ? moment(
                                user.subscription_validity,
                                'YYYY-MM-DD',
                              ).format('D MMM YYYY')
                            : null}
                          {/* 6 Jan 2020 */}
                        </Text>
                        <Text style={styles.subscribtionTitle}>
                          {user.subscription_validity
                            ? I18n.t('renewDate', {locale: lang})
                            : null}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
              <View
                style={{
                  marginTop: normalize(-25),
                  marginHorizontal: '5%'
                }}>
                <Card style={styles.cardContainer}>
                  <CardItem
                    bordered
                    style={[styles.cardItemContainer, styles.cardItemStart]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('MySchedule')
                      }>
                      <Body
                        style={[
                          styles.cardItemBody,
                          {flexDirection: flexDirection}
                        ]}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            alignItems: 'center',
                            width: '80%'
                          }}>
                          <CalendarIcon
                            width={normalize(24)}
                            height={normalize(24)}
                            style={styles.cardItemIcon}
                          />

                          <Text style={styles.cardItemText}>
                            {I18n.t('mySchedule', {locale: lang})}
                          </Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            justifyContent: 'flex-end',
                            width: '20%'
                          }}>
                          <Icon
                            type="FontAwesome"
                            name={lang === 'ar' ? 'angle-left' : 'angle-right'}
                            style={{
                              fontSize: normalize(24),
                              color: '#CFCFCF'
                            }}
                          />
                        </View>
                      </Body>
                    </TouchableOpacity>
                  </CardItem>
                  <CardItem
                    bordered
                    style={[styles.cardItemContainer, styles.cardItemEnd]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Membership')
                      }>
                      <Body
                        style={[
                          styles.cardItemBody,
                          {flexDirection: flexDirection}
                        ]}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            alignItems: 'center',
                            width: '80%'
                          }}>
                          <FitnessIcon
                            width={normalize(24)}
                            height={normalize(24)}
                            style={styles.cardItemIcon}
                          />

                          <Text style={styles.cardItemText}>
                            {I18n.t('membership', {locale: lang})}
                          </Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            justifyContent: 'flex-end',
                            width: '20%'
                          }}>
                          <Icon
                            type="FontAwesome"
                            name={lang === 'ar' ? 'angle-left' : 'angle-right'}
                            style={{
                              fontSize: normalize(24),
                              color: '#CFCFCF'
                            }}
                          />
                        </View>
                      </Body>
                    </TouchableOpacity>
                  </CardItem>
                </Card>
              </View>
              <View style={{marginHorizontal: '5%'}}>
                <Card
                  style={[styles.cardContainer, {marginTop: normalize(20)}]}>
                  <CardItem
                    bordered
                    style={[styles.cardItemContainer, styles.cardItemStart]}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Account')}>
                      <Body
                        style={[
                          styles.cardItemBody,
                          {flexDirection: flexDirection}
                        ]}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            alignItems: 'center',
                            width: '80%'
                          }}>
                          <AccountIcon
                            width={normalize(24)}
                            height={normalize(24)}
                            style={styles.cardItemIcon}
                          />

                          <Text style={styles.cardItemText}>
                            {I18n.t('account', {locale: lang})}
                          </Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            justifyContent: 'flex-end',
                            width: '20%'
                          }}>
                          <Icon
                            type="FontAwesome"
                            name={lang === 'ar' ? 'angle-left' : 'angle-right'}
                            style={{
                              fontSize: normalize(24),
                              color: '#CFCFCF'
                            }}
                          />
                        </View>
                      </Body>
                    </TouchableOpacity>
                  </CardItem>
                  <CardItem bordered style={styles.cardItemContainer}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Setting')}>
                      <Body
                        style={[
                          styles.cardItemBody,
                          {flexDirection: flexDirection}
                        ]}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            alignItems: 'center',
                            width: '80%'
                          }}>
                          <SettingIcon
                            width={normalize(24)}
                            height={normalize(24)}
                            style={styles.cardItemIcon}
                          />

                          <Text style={styles.cardItemText}>
                            {I18n.t('settings', {locale: lang})}
                          </Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            justifyContent: 'flex-end',
                            width: '20%'
                          }}>
                          <Icon
                            type="FontAwesome"
                            name={lang === 'ar' ? 'angle-left' : 'angle-right'}
                            style={{
                              fontSize: normalize(24),
                              color: '#CFCFCF'
                            }}
                          />
                        </View>
                      </Body>
                    </TouchableOpacity>
                  </CardItem>
                  <CardItem bordered style={styles.cardItemContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('ContactUs')
                      }>
                      <Body
                        style={[
                          styles.cardItemBody,
                          {flexDirection: flexDirection}
                        ]}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            alignItems: 'center',
                            width: '80%'
                          }}>
                          <ContactIcon
                            width={normalize(24)}
                            height={normalize(24)}
                            style={styles.cardItemIcon}
                          />

                          <Text style={styles.cardItemText}>
                            {I18n.t('contactus', {locale: lang})}
                          </Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: flexDirection,
                            justifyContent: 'flex-end',
                            width: '20%'
                          }}>
                          <Icon
                            type="FontAwesome"
                            name={lang === 'ar' ? 'angle-left' : 'angle-right'}
                            style={{
                              fontSize: normalize(24),
                              color: '#CFCFCF'
                            }}
                          />
                        </View>
                      </Body>
                    </TouchableOpacity>
                  </CardItem>
                  <CardItem
                    bordered
                    style={[styles.cardItemContainer, styles.cardItemEnd]}>
                    <TouchableOpacity
                      style={{flexDirection: flexDirection}}
                      onPress={() =>
                        this.props.logoutUser(this.props.navigation)
                      }>
                      <Body
                        style={[
                          styles.cardItemBody,
                          {flexDirection: flexDirection}
                        ]}>
                        <LogoutIcon
                          width={normalize(24)}
                          height={normalize(24)}
                          style={styles.cardItemIcon}
                        />
                        <Text
                          style={[
                            styles.cardItemText,
                            {
                              flexDirection: flexDirection
                            }
                          ]}>
                          {I18n.t('logout', {locale: lang})}
                        </Text>
                      </Body>
                    </TouchableOpacity>
                  </CardItem>
                </Card>
              </View>
            </ScrollView>

            {this.state.data &&
              this.state.data.access_code &&
              isShowPaymentWeb && (
                <PaymentWeb
                  isShowPaymentWeb={isShowPaymentWeb}
                  handlePaymentWeb={this.handlePaymentWeb}
                  navigation={this.props.navigation}
                  url={url}
                  data={data}
                  language={lang}
                />
              )}

            <PaymentSuccess
              isShowPaymentSuccess={isShowPaymentSuccess}
              handlePaymentSuccess={this.handlePaymentSuccess}
              text={I18n.t('successful', {locale: lang})}
              shortText={`${I18n.t('youHaveSuccessfullySubscribedTo', {
                locale: lang
              })} ${title}`}
              buttonText={I18n.t('showMeSchedule', {locale: lang})}
              MoveScreenName={'Profile'}
              navigation={this.props.navigation}
            />
          </View>
        )}
        <Toast ref={ref => (global['toast'] = ref)} />
      </>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(10)
    /*     shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: normalize(1),
    },
    shadowOpacity: normalize(0.3),
    shadowRadius: normalize(4.65),

    elevation: normalize(1), */
  },
  cardItemBody: {
    display: 'flex',
    //flexDirection: 'row',
    // flexDirection: 'row-reverse',
    alignItems: 'center'
    //paddingVertical: normalize(13),
  },
  cardItemContainer: {
    height: normalize(60),
    marginHorizontal: normalize(15)
  },
  cardItemEnd: {
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10)
  },
  cardItemIcon: {
    height: normalize(24),
    width: normalize(24)
    //paddingVertical: 17,
  },
  cardItemStart: {
    borderTopLeftRadius: normalize(10),
    borderTopRightRadius: normalize(10)
  },
  cardItemText: {
    //padding: 17,
    fontSize: normalize(12),
    marginHorizontal: normalize(15)
  },
  imageContainer: {
    //flex: 2,
    alignItems: 'stretch'
    //height: 250,
  },
  renewButton: {
    alignItems: 'center',
    backgroundColor: '#FE9800',
    borderRadius: normalize(10),
    fontSize: normalize(10),
    height: normalize(30),
    justifyContent: 'center',
    marginHorizontal: normalize(10),
    width: normalize(80)
  },
  subscribtionContainer: {
    display: 'flex',
    //flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(20)
  },
  subscribtionTitle: {
    color: '#ffffff',
    fontSize: normalize(12)
  },
  subscribtionValue: {
    color: '#FE9800',
    fontSize: normalize(18.66),
    fontWeight: 'bold'
  },
  welcomeImage: {
    //flex: 1,
    //height: normalize(height * 0.4),
    height: normalize(333),
    width: width
  }
})

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  subscription: state.subscription,
  errors: state.errors
})

export default connect(mapStateToProps, {
  logoutUser,
  getSubscriptions,
  addUserSubscription,
  currentUser,
  getSubscriptionsRefresh,
  updateUser
})(Profile)
