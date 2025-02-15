import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment-timezone'
import {Button, Icon} from 'native-base'
import React, {Component} from 'react'
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import normalize from 'react-native-normalize'
import {connect} from 'react-redux'

import {
  addFavorite,
  clearClass,
  getClass,
  getClasses,
  getClassesLocation,
  getClassLocation,
  getFavorites,
  removeFavorite
} from '../../actions/homeActions'
import CarouselSlider from '../../components/CarouselSlider'
import {API_URI, IMAGE_URI} from '../../utils/config'
import I18n from '../../utils/i18n'
import isEmpty from '../../validation/is-empty'
import Loading from '../Loading'
import ReviewShow from '../Review/ReviewShow'
import WriteReview from '../WriteReview'
moment.tz.setDefault('Asia/Qatar')
import axios from 'axios'
import ReadMore from 'react-native-read-more-text'
import Toast from 'react-native-toast-notifications'

import {getSubscriptions} from '../../actions/subscriptionActions'
import CallIcon from '../../assets/img/call.svg'
import FavoriteGreyIcon from '../../assets/img/favorite-grey.svg'
import FavoriteRedIcon from '../../assets/img/favorite-red.svg'
import MapIcon from '../../assets/img/map.svg'
import ClassSuccess from '../../components/ClassSuccess'
import ConfirmBooking from '../ConfirmBooking'

const {width} = Dimensions.get('window')

export class GymClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowWriteReview: false,
      isShowConfirmBooking: false,
      class: {},
      isLoading: true,
      isDisable: false,
      date: '',
      start_time: '',
      end_time: '',
      class_schedule_id: '',
      schedule_date_id: '',
      credits: 0,
      coaches: [],
      isShowClassSuccess: false,
      is_virtual: false,
      refreshing: false,
      showModal: false
    }
  }

  /*  static getDerivedStateFromProps(props, state) {
    if (props.navigation.state.params.id == state.class.id) return null;
    let gymClass = {...props.home.class};
    return {
      class: gymClass,
    };
  } */

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.handleRefresh()
    })
    const id = await this.props.navigation.getParam('id')
    const date = await this.props.navigation.getParam('date')
    const start_time = await this.props.navigation.getParam('start_time')
    const end_time = await this.props.navigation.getParam('end_time')
    const category_id = await this.props.navigation.getParam('category_id')
    const category_type_id =
      await this.props.navigation.getParam('category_type_id')
    const creditRangeHigh =
      await this.props.navigation.getParam('creditRangeHigh')
    const creditRangeLow =
      await this.props.navigation.getParam('creditRangeLow')
    const gender_id = await this.props.navigation.getParam('gender_id')
    const latitude = await AsyncStorage.getItem('latitude')
    const longitude = await AsyncStorage.getItem('longitude')
    let url
    if (latitude && longitude) {
      url = `${API_URI}/classes/${id}?latitude=${latitude}&longitude=${longitude}`
    } else {
      url = `${API_URI}/classes/${id}`
    }

    let filter
    let whereFilter = ''
    let inClass = ''
    let inClassCategory = ''
    if (!isEmpty(gender_id)) {
      inClass = `"inClass":{"is_active": 1,"gender_id":{"$in":[${gender_id}]} }`
    }

    if (
      !isEmpty(date) &&
      !isEmpty(start_time) &&
      !isEmpty(end_time) &&
      !isEmpty(category_type_id) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}],"is_virtual":{"$in":[${category_type_id}]}},"inScheduleDates": { "date": "${date}" }`
    } else if (
      !isEmpty(date) &&
      !isEmpty(start_time) &&
      !isEmpty(end_time) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}]},"inScheduleDates": { "date": "${date}" }`
    } else if (!isEmpty(date) && !isEmpty(start_time) && !isEmpty(end_time)) {
      whereFilter = `"inClassSchedule": {"$and":[{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},"inScheduleDates":{"date":"${date}"}`
    } else if (
      !isEmpty(category_type_id) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule":{"credits":{"$between":[${creditRangeLow},${creditRangeHigh}]},"is_virtual":{"$in":[${category_type_id}]}}`
    } else if (!isEmpty(date)) {
      whereFilter = `"inScheduleDates":{"date":"${date}"}`
    }

    if (!isEmpty(category_id)) {
      inClassCategory = `"inClassCategory": {"category_id": {"$in":[${category_id}]}}`
    }

    if (
      !isEmpty(inClass) &&
      !isEmpty(inClassCategory) &&
      !isEmpty(whereFilter)
    ) {
      filter = `{${inClass},${whereFilter},${inClassCategory}}`
    } else if (!isEmpty(inClass) && !isEmpty(whereFilter)) {
      filter = `{${inClass},${whereFilter}}`
    } else if (!isEmpty(inClassCategory) && !isEmpty(whereFilter)) {
      filter = `{"inClass":{"is_active": 1},${whereFilter},${inClassCategory}}`
    } else if (!isEmpty(whereFilter)) {
      filter = `{"inClass":{"is_active": 1},${whereFilter}}`
    } else {
      filter = `{"inClass":{"is_active": 1}}`
    }

    if (url.indexOf('?') > 0) {
      url = `${url}&filter=${filter}`
    } else {
      url = `${url}?filter=${filter}`
    }

    await axios
      .get(url)
      .then(async res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data
          data.class_schedules = await data.class_schedules.sort((a, b) =>
            a.start_time < b.start_time
              ? -1
              : a.start_time > b.start_time
                ? 1
                : 0,
          )
          let class_schedule_id
          let schedule_date_id
          let class_start_time
          let class_end_time
          let class_date
          let credits
          let coaches
          let is_virtual
          if (!isEmpty(date)) {
            class_date = date
            class_schedule_id = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].id
              : ''
            class_start_time = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].start_time
              : ''
            class_end_time = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].end_time
              : ''
            schedule_date_id =
              !isEmpty(data.class_schedules) &&
              !isEmpty(data.class_schedules[0].schedule_dates)
                ? data.class_schedules[0].schedule_dates[0].id
                : ''
            credits = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].credits
              : 0
            coaches = !isEmpty(data.class_schedules)
              ? [data.class_schedules[0].coach]
              : []
            is_virtual = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].is_virtual
              : false
          } else {
            let scheduleDates = []
            await data.class_schedules.map(schedule => {
              if (!isEmpty(schedule.schedule_dates)) {
                schedule.schedule_dates[0].dateTime = `${schedule.schedule_dates[0].date}T${schedule.start_time}`
                schedule.schedule_dates[0].start_time = schedule.start_time
                schedule.schedule_dates[0].end_time = schedule.end_time
                schedule.schedule_dates[0].credits = schedule.credits
                schedule.schedule_dates[0].coach = schedule.coach
                schedule.schedule_dates[0].is_virtual = schedule.is_virtual
                scheduleDates.push(schedule.schedule_dates[0])
              }
              return schedule
            })
            scheduleDates = await scheduleDates.sort(function (a, b) {
              let aa = new Date(a.dateTime).getTime()
              let bb = new Date(b.dateTime).getTime()
              // (await new Date(a.dateTime)) - (await new Date(b.dateTime))
              return aa - bb
            })
            class_date = !isEmpty(scheduleDates) ? scheduleDates[0].date : ''
            class_schedule_id = !isEmpty(scheduleDates)
              ? scheduleDates[0].class_schedule_id
              : ''
            class_start_time = !isEmpty(scheduleDates)
              ? scheduleDates[0].start_time
              : ''
            class_end_time = !isEmpty(scheduleDates)
              ? scheduleDates[0].end_time
              : ''
            schedule_date_id = !isEmpty(scheduleDates)
              ? scheduleDates[0].id
              : ''
            credits = !isEmpty(scheduleDates) ? scheduleDates[0].credits : 0
            coaches = !isEmpty(scheduleDates) ? [scheduleDates[0].coach] : []
            is_virtual = !isEmpty(scheduleDates)
              ? scheduleDates[0].is_virtual
              : false
          }

          this.setState({
            class: data,
            isLoading: false,
            date: class_date,
            start_time: class_start_time,
            end_time: class_end_time,
            class_schedule_id,
            schedule_date_id,
            credits,
            coaches,
            is_virtual
          })
          return true
        }
      })
      .catch(err => {
        this.setState({isLoading: false})
      })

    /*      if (latitude && longitude) {
      this.props.getClassLocation(id);
      //this.props.getClassesLocation();
    } else {
      this.props.getClass(id);
      //this.props.getClasses();
    }*/
    this.props.getSubscriptions()
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  /*   async componentDidMount() {
    const id = await this.props.navigation.getParam('id');
    const latitude = await AsyncStorage.getItem('latitude');
    const longitude = await AsyncStorage.getItem('longitude');

    if (latitude && longitude) {
      this.props.getClassLocation(id);
      //this.props.getClassesLocation();
    } else {
      this.props.getClass(id);
      //this.props.getClasses();
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  } */

  componentWillUnmount() {
    this.focusListener.remove()
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = async () => {
    this.props.navigation.goBack()
    return true
  }

  handleAddFavorite = async () => {
    const {lang} = this.props.setting
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t('login', {locale: lang}),
        I18n.t('loginToProceed', {locale: lang}),
        [
          {
            text: I18n.t('no', {locale: lang}),
            onPress: () => console.log('cancel'),
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
    } else {
      this.setState({isDisable: true})
      const {id} = this.state.class
      let addFavoriteData = {
        class: 'Class',
        foreign_id: id,
        user_id: this.props.auth.user.id
      }
      await axios
        .post(`${API_URI}/favourites`, addFavoriteData)
        .then(async res => {
          if (res.data.error.code) {
          } else {
            const {data} = res.data
            let gymClass = {...this.state.class}
            gymClass.favourite = data
            const {id} = this.props.auth.user
            this.setState({class: gymClass, isDisable: false})
            this.props.getFavorites(id)
            toast.show(
              I18n.t('favoriteAddedSucessfully', {
                locale: this.props.setting.lang
              }),
              {
                type: 'normal',
                placement: 'bottom',
                duration: 2000,
                offset: 30,
                animationType: 'slide-in'
              },
            )
          }
        })
        .catch(err => {
          /* if (err.response.data.error) {
      
      } */
        })
      //this.props.addFavorite(addFavoriteData);
    }
  }

  handleRemoveFavorite = async () => {
    const {lang} = this.props.setting
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t('login', {locale: lang}),
        I18n.t('loginToProceed', {locale: lang}),
        [
          {
            text: I18n.t('no', {locale: lang}),
            onPress: () => console.log('cancel'),
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
    } else {
      this.setState({isDisable: true})
      const {id} = this.state.class.favourite
      await axios
        .delete(`${API_URI}/favourites/${id}`)
        .then(async res => {
          if (res.data.error.code) {
          } else {
            const {data} = res.data
            let gymClass = {...this.state.class}
            delete gymClass.favourite
            const {id} = this.props.auth.user
            this.setState({class: gymClass, isDisable: false})
            this.props.getFavorites(id)
            toast.show(
              I18n.t('favoriteRemovedSucessfully', {
                locale: this.props.setting.lang
              }),
              {
                type: 'normal',
                placement: 'bottom',
                duration: 2000,
                offset: 30,
                animationType: 'slide-in'
              },
            )
          }
        })
        .catch(err => {
          /*  if (err.response.data.error) {
          
        } */
        })
      //this.props.removeFavorite(id, 'Class');
    }
  }

  handleWriteReview = () => {
    const {lang} = this.props.setting
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t('login', {locale: lang}),
        I18n.t('loginToProceed', {locale: lang}),
        [
          {
            text: I18n.t('no', {locale: lang}),
            onPress: () => console.log('come'),
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
    } else {
      this.setState({isShowWriteReview: !this.state.isShowWriteReview})
    }
  }

  handleConfirmBooking = () => {
    this.setState({isShowConfirmBooking: !this.state.isShowConfirmBooking})
  }

  renderItemGym = ({item}) => {
    const {id} = this.state.class
    const {attachments, name, name_ar} = item
    const {lang} = this.props.setting
    const textAlign = lang === 'ar' ? 'right' : 'left'
    let image

    if (attachments && attachments.length > 0) {
      let primaryAttachment = attachments.find(
        newImage => newImage.is_primary === true,
      )

      if (!isEmpty(primaryAttachment)) {
        image = {
          uri: `${IMAGE_URI}/${primaryAttachment.dir}/${primaryAttachment.file_name}`
        }
      } else {
        image = {
          uri: `${IMAGE_URI}/${attachments[0].dir}/${attachments[0].file_name}`
        }
      }
    } else {
      image = require('../../assets/img/no_image_found.png')
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate({
            routeName: 'GymClass',
            params: {
              id: item.id,
              back: 'GymClass',
              back_id: id
            },
            key: `GymClass_${Math.random() * 10000}`
          })
        }
        // onPress={() => this.props.navigation.navigate('Gym')}
        style={{
          width: normalize(142),
          marginRight: normalize(10),
          height: normalize(171),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}]
        }}>
        <View
          style={{
            width: normalize(142),
            height: normalize(142)
            //borderRadius: 10,
          }}>
          <Image
            resizeMode={'cover'}
            source={image}
            style={{
              width: normalize(142),
              height: normalize(142),
              borderRadius: normalize(10)
            }}
          />
        </View>
        <View style={{marginTop: normalize(5)}}>
          <Text style={{fontSize: normalize(15), textAlign: textAlign}}>
            {lang === 'ar' ? name_ar : name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderReviewItem = ({item}) => {
    const {lang} = this.props.setting
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start'
    let image

    if (!isEmpty(item.user) && !isEmpty(item.user.attachment)) {
      const {attachment} = item.user
      image = {
        uri: `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`
      }
    } else {
      image = require('../../assets/img/NoPicture.png')
    }
    return (
      <>
        <View
          style={{
            marginTop: normalize(16),
            marginHorizontal: normalize(16)
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: flexDirection
            }}>
            <View style={{width: normalize(44)}}>
              <Image
                source={image}
                style={{
                  width: normalize(44),
                  height: normalize(44),
                  borderRadius: normalize(22)
                }}
              />
            </View>
            <View
              style={{
                marginLeft: lang === 'ar' ? 0 : normalize(16),
                marginRight: lang === 'ar' ? normalize(16) : 0,
                width: normalize(267)
                //marginHorizontal: normalize(16),
              }}>
              <Text
                style={{
                  fontSize: normalize(15),
                  fontWeight: '700',
                  textAlign: textAlign
                }}>
                {!isEmpty(item.user)
                  ? `${item.user.first_name} ${item.user.last_name}`
                  : ''}
              </Text>
              <View
                style={[
                  styles.classRatingContainer,
                  {flexDirection: flexDirection}
                ]}>
                <ReviewShow
                  rating={item.rating}
                  style={{
                    fontSize: normalize(11),
                    paddingRight: normalize(2.75)
                  }}
                />
              </View>

              <Text
                style={{
                  fontSize: normalize(12),
                  textAlign: textAlign
                }}>
                {item.description}
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: '#8A8A8F',
                  textAlign: textAlign
                }}>
                {moment(item.createdAt, 'YYYY-MM-DD hh:mm:ss')
                  .startOf('hour')
                  .fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </>
    )
  }

  dialCall = () => {
    const {gym_mobile} = this.state.class.gym
    let phoneNumber = ''

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${gym_mobile}`
    } else {
      phoneNumber = `telprompt:${gym_mobile}`
    }

    Linking.openURL(phoneNumber)
  }

  _renderTruncatedFooter = handlePress => {
    const {lang} = this.props.setting
    return (
      <Text
        style={{
          color: '#0053FE',
          marginTop: 5,
          fontSize: normalize(12),
          fontWeight: 'bold'
        }}
        onPress={handlePress}>
        {I18n.t('readMore', {locale: lang})}
      </Text>
    )
  }

  _renderRevealedFooter = handlePress => {
    const {lang} = this.props.setting
    return (
      <Text
        style={{
          color: '#0053FE',
          marginTop: 5,
          fontSize: normalize(12),
          fontWeight: 'bold'
        }}
        onPress={handlePress}>
        {I18n.t('showLess', {locale: lang})}
      </Text>
    )
  }

  handleNavigateGymDetail = (e, id) => {
    e.preventDefault()
    this.props.navigation.navigate({
      routeName: 'GymDetail',
      params: {
        id: id
      },
      key: `GymDetail_${Math.random() * 10000}`
    })
  }

  handleReviews = review => {
    let gymClass = {...this.state.class}
    gymClass.reviews.push(review)
    gymClass.rating_count = gymClass.rating_count + 1
    this.setState({class: gymClass})
  }

  handleAllReviews = reviews => {
    let gymClass = {...this.state.class}
    if (reviews.length < 3) {
      gymClass.reviews = reviews
    }
    gymClass.rating_count = gymClass.rating_count + 1
    this.setState({class: gymClass})
  }

  renderCoach = class_coach => {
    const {lang} = this.props.setting
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start'
    const {id, attachment, name, name_ar, category, rating_avg, rating_count} =
      class_coach
    let coachImage
    if (attachment) {
      coachImage = {
        uri: `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`
      }
    } else {
      coachImage = require('../../assets/img/no_image_found.png')
    }
    return (
      <TouchableOpacity
        key={id}
        onPress={e => {
          e.preventDefault()
          this.props.navigation.navigate({
            routeName: 'Coach',
            params: {
              id: id
            },
            key: `ClassCoach_${Math.random() * 10000}`
          })
        }}
        style={{
          marginTop: normalize(8)
          //marginHorizontal: normalize(16),
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: flexDirection
          }}>
          <View style={{width: normalize(60)}}>
            <Image
              source={coachImage}
              style={{
                width: normalize(60),
                height: normalize(60),
                borderRadius: normalize(10)
              }}
            />
          </View>
          <View
            style={{
              marginLeft: lang === 'ar' ? 0 : normalize(16),
              marginRight: lang === 'ar' ? normalize(16) : 0,
              width: normalize(267)
              //marginHorizontal: normalize(16),
            }}>
            <Text
              style={{
                fontSize: normalize(15),
                fontWeight: '700',
                textAlign: textAlign
              }}>
              {`${lang === 'ar' ? name_ar : name}`}
            </Text>
            <View
              style={[
                styles.classRatingContainer,
                {flexDirection: flexDirection}
              ]}>
              <ReviewShow
                rating={rating_avg}
                style={{
                  fontSize: normalize(11),
                  paddingRight: lang === 'ar' ? 0 : normalize(2.75),
                  paddingLeft: lang === 'ar' ? normalize(2.75) : 0
                }}
              />
              <View
                style={{
                  paddingRight: lang === 'ar' ? normalize(3) : 0,
                  paddingLeft: lang === 'ar' ? 0 : normalize(3)
                }}>
                <Text style={styles.gymRatingCountText}>({rating_count})</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  handleClassSuccess = () => {
    this.setState({isShowClassSuccess: !this.state.isShowClassSuccess})
  }

  handleClassSuccessConfirm = () => {
    this.setState({isShowClassSuccess: true})
  }

  handleRefresh = async () => {
    this.setState({refreshing: true})
    const id = await this.props.navigation.getParam('id')
    const date = await this.props.navigation.getParam('date')
    const start_time = await this.props.navigation.getParam('start_time')
    const end_time = await this.props.navigation.getParam('end_time')
    const category_id = await this.props.navigation.getParam('category_id')
    const category_type_id =
      await this.props.navigation.getParam('category_type_id')
    const creditRangeHigh =
      await this.props.navigation.getParam('creditRangeHigh')
    const creditRangeLow =
      await this.props.navigation.getParam('creditRangeLow')
    const gender_id = await this.props.navigation.getParam('gender_id')
    const latitude = await AsyncStorage.getItem('latitude')
    const longitude = await AsyncStorage.getItem('longitude')
    let url
    if (latitude && longitude) {
      url = `${API_URI}/classes/${id}?latitude=${latitude}&longitude=${longitude}`
    } else {
      url = `${API_URI}/classes/${id}`
    }

    let filter
    let whereFilter = ''
    let inClass = ''
    let inClassCategory = ''
    if (!isEmpty(gender_id)) {
      inClass = `"inClass":{"is_active": 1,"gender_id":{"$in":[${gender_id}]} }`
    }

    if (
      !isEmpty(date) &&
      !isEmpty(start_time) &&
      !isEmpty(end_time) &&
      !isEmpty(category_type_id) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}],"is_virtual":{"$in":[${category_type_id}]}},"inScheduleDates": { "date": "${date}" }`
    } else if (
      !isEmpty(date) &&
      !isEmpty(start_time) &&
      !isEmpty(end_time) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}]},"inScheduleDates": { "date": "${date}" }`
    } else if (!isEmpty(date) && !isEmpty(start_time) && !isEmpty(end_time)) {
      whereFilter = `"inClassSchedule": {"$and":[{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},"inScheduleDates":{"date":"${date}"}`
    } else if (
      !isEmpty(category_type_id) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule":{"credits":{"$between":[${creditRangeLow},${creditRangeHigh}]},"is_virtual":{"$in":[${category_type_id}]}}`
    } else if (!isEmpty(date)) {
      whereFilter = `"inScheduleDates":{"date":"${date}"}`
    }

    if (!isEmpty(category_id)) {
      inClassCategory = `"inClassCategory": {"category_id": {"$in":[${category_id}]}}`
    }

    if (
      !isEmpty(inClass) &&
      !isEmpty(inClassCategory) &&
      !isEmpty(whereFilter)
    ) {
      filter = `{${inClass},${whereFilter},${inClassCategory}}`
    } else if (!isEmpty(inClass) && !isEmpty(whereFilter)) {
      filter = `{${inClass},${whereFilter}}`
    } else if (!isEmpty(inClassCategory) && !isEmpty(whereFilter)) {
      filter = `{"inClass":{"is_active": 1},${whereFilter},${inClassCategory}}`
    } else if (!isEmpty(whereFilter)) {
      filter = `{"inClass":{"is_active": 1},${whereFilter}}`
    } else {
      filter = `{"inClass":{"is_active": 1}}`
    }

    if (url.indexOf('?') > 0) {
      url = `${url}&filter=${filter}`
    } else {
      url = `${url}?filter=${filter}`
    }
    await axios
      .get(url)
      .then(async res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data
          data.class_schedules = await data.class_schedules.sort((a, b) =>
            a.start_time < b.start_time
              ? -1
              : a.start_time > b.start_time
                ? 1
                : 0,
          )
          let class_schedule_id
          let schedule_date_id
          let class_start_time
          let class_end_time
          let class_date
          let credits
          let coaches
          let is_virtual
          if (!isEmpty(date)) {
            class_date = date
            class_schedule_id = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].id
              : ''
            class_start_time = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].start_time
              : ''
            class_end_time = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].end_time
              : ''
            schedule_date_id =
              !isEmpty(data.class_schedules) &&
              !isEmpty(data.class_schedules[0].schedule_dates)
                ? data.class_schedules[0].schedule_dates[0].id
                : ''
            credits = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].credits
              : 0
            coaches = !isEmpty(data.class_schedules)
              ? [data.class_schedules[0].coach]
              : []
            is_virtual = !isEmpty(data.class_schedules)
              ? data.class_schedules[0].is_virtual
              : false
          } else {
            let scheduleDates = []
            await data.class_schedules.map(schedule => {
              if (!isEmpty(schedule.schedule_dates)) {
                schedule.schedule_dates[0].dateTime = `${schedule.schedule_dates[0].date}T${schedule.start_time}`
                schedule.schedule_dates[0].start_time = schedule.start_time
                schedule.schedule_dates[0].end_time = schedule.end_time
                schedule.schedule_dates[0].credits = schedule.credits
                schedule.schedule_dates[0].coach = schedule.coach
                schedule.schedule_dates[0].is_virtual = schedule.is_virtual
                scheduleDates.push(schedule.schedule_dates[0])
              }
              return schedule
            })
            scheduleDates = await scheduleDates.sort(function (a, b) {
              let aa = new Date(a.dateTime).getTime()
              let bb = new Date(b.dateTime).getTime()
              // (await new Date(a.dateTime)) - (await new Date(b.dateTime))
              return aa - bb
            })
            class_date = !isEmpty(scheduleDates) ? scheduleDates[0].date : ''
            class_schedule_id = !isEmpty(scheduleDates)
              ? scheduleDates[0].class_schedule_id
              : ''
            class_start_time = !isEmpty(scheduleDates)
              ? scheduleDates[0].start_time
              : ''
            class_end_time = !isEmpty(scheduleDates)
              ? scheduleDates[0].end_time
              : ''
            schedule_date_id = !isEmpty(scheduleDates)
              ? scheduleDates[0].id
              : ''
            credits = !isEmpty(scheduleDates) ? scheduleDates[0].credits : 0
            coaches = !isEmpty(scheduleDates) ? [scheduleDates[0].coach] : []
            is_virtual = !isEmpty(scheduleDates)
              ? scheduleDates[0].is_virtual
              : false
          }

          this.setState({
            class: data,
            date: class_date,
            start_time: class_start_time,
            end_time: class_end_time,
            class_schedule_id,
            schedule_date_id,
            credits,
            coaches,
            is_virtual
          })
          return true
        }
      })
      .catch(err => {
        console.warn('err = ', err)
      })

    this.props.getSubscriptions()
    setTimeout(() => {
      this.setState({refreshing: false})
    }, 2000)
  }

  render() {
    const {
      isShowWriteReview,
      isShowConfirmBooking,
      isLoading,
      isShowClassSuccess,
      is_virtual,
      refreshing
    } = this.state
    let {
      id,
      name,
      name_ar,
      description,
      description_ar,
      gender,
      credits,
      rating_count,
      rating_avg,
      gym,
      coach,
      attachments,
      favourite,
      reviews,
      gym_id,
      coach_id,
      start_date,
      end_date,
      start_time,
      end_time,
      class_schedules,
      address,
      lattitude,
      longitute
    } = this.state.class

    let class_coaches = []

    let filteredClassSchedules = []
    if (!isEmpty(class_schedules)) {
      class_coaches = class_schedules.map(schedule => {
        return schedule.coach
      })
      jsonObject = class_coaches.map(JSON.stringify)

      uniqueSet = new Set(jsonObject)
      uniqueArray = Array.from(uniqueSet).map(JSON.parse)
      class_coaches = uniqueArray
      class_schedules = class_schedules.sort((a, b) =>
        a.start_time < b.start_time ? -1 : a.start_time > b.start_time ? 1 : 0,
      )
      filteredClassSchedules = class_schedules.filter(scheduleItem => {
        let tmpRes = false
        scheduleItem.schedule_dates.map(scheduleDateItem => {
          if (scheduleDateItem.date === this.state.date) {
            tmpRes = true
          }
        })
        return tmpRes
      })
    }
    let gymImage
    if (gym && gym.attachments && gym.attachments.length > 0) {
      let primaryAttachment = gym.attachments.find(
        newImage => newImage.is_primary === true,
      )

      if (!isEmpty(primaryAttachment)) {
        gymImage = {
          uri: `${IMAGE_URI}/${primaryAttachment.dir}/${primaryAttachment.file_name}`
        }
      } else {
        gymImage = {
          uri: `${IMAGE_URI}/${gym.attachments[0].dir}/${gym.attachments[0].file_name}`
        }
      }
    } else {
      gymImage = require('../../assets/img/no_image_found.png')
    }

    let classes = [...this.props.home.recommendedClasses]
    classes = classes.filter(gymClass => gymClass.id !== id)

    // const {isLodaing} = this.props.errors;
    const {lang} = this.props.setting
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start'

    let images = []
    if (attachments && attachments.length > 0) {
      images = attachments.map(attachment => {
        let image = `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`
        return image
      })
    }
    let title = lang === 'ar' ? name_ar : name
    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <SafeAreaView style={{flex: 0, backgroundColor: '#ffffff'}} />
            <StatusBar /* hidden={true} */ />
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.handleRefresh}
                />
              }>
              <View style={{height: normalize(270)}}>
                <CarouselSlider images={images} />
                <View
                  /* style={styles.backButtonContainer} */ style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    top: Platform.OS === 'ios' ? normalize(0) : normalize(0),
                    left: normalize(10)
                  }}>
                  <Button transparent onPress={this.handleBack}>
                    <Icon
                      type="FontAwesome"
                      name="angle-left"
                      style={{fontSize: normalize(18), color: '#ffffff'}}
                      //style={styles.backButtonIcon}
                    />
                    <Text
                      /* style={styles.backButtonText} */ style={{
                        color: '#ffffff'
                        // left: normalize(1),
                      }}>
                      {I18n.t('back', {locale: lang})}
                    </Text>
                  </Button>
                </View>
              </View>
              <View
                style={[
                  styles.ratingFavContainer,
                  {flexDirection: flexDirection}
                ]}>
                <View
                  style={[
                    styles.ratingContainer,
                    {flexDirection: flexDirection}
                  ]}>
                  <ReviewShow
                    rating={rating_avg}
                    style={{
                      fontSize: normalize(18),
                      paddingRight: lang === 'ar' ? 0 : normalize(4),
                      paddingLeft: lang === 'ar' ? normalize(4) : 0
                    }}
                  />
                  <Text style={styles.ratingCountText}>({rating_count})</Text>
                </View>
                <View
                  style={[
                    styles.favMapContainer,
                    {flexDirection: flexDirection}
                  ]}>
                  <TouchableOpacity onPress={this.dialCall}>
                    <CallIcon width={normalize(24)} height={normalize(24)} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate({
                        routeName: 'Map',
                        params: {
                          latitude: lattitude,
                          longitude: longitute,
                          name: lang === 'ar' ? name_ar : name
                        },
                        key: `GymClassMap_${Math.random() * 10000}`
                      })
                    }}>
                    <MapIcon
                      width={normalize(24)}
                      height={normalize(24)}
                      style={{marginHorizontal: normalize(16)}}
                    />
                  </TouchableOpacity>
                  {isEmpty(favourite) ? (
                    <TouchableOpacity
                      onPress={this.handleAddFavorite}
                      disabled={this.state.isDisable}>
                      <FavoriteGreyIcon
                        width={normalize(24)}
                        height={normalize(24)}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={this.handleRemoveFavorite}
                      disabled={this.state.isDisable}>
                      <FavoriteRedIcon
                        width={normalize(24)}
                        height={normalize(24)}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={{flexDirection: flexDirection}}>
                <View style={[styles.genderContainer, {alignSelf: alignSelf}]}>
                  <Text style={styles.genderContainerText}>
                    {gender
                      ? lang === 'ar'
                        ? gender.name_ar
                        : gender.name
                      : ''}
                  </Text>
                </View>
                <View style={[styles.genderContainer, {alignSelf: alignSelf}]}>
                  <Text style={styles.genderContainerText}>
                    {is_virtual
                      ? I18n.t('virtual', {locale: lang})
                      : I18n.t('offline', {locale: lang})}
                  </Text>
                </View>
              </View>

              <View style={[styles.titleContainer, {alignSelf: alignSelf}]}>
                <Text
                  style={[styles.titleContainerText, {textAlign: textAlign}]}>
                  {lang === 'ar' ? name_ar : name}
                </Text>
              </View>
              <View style={[styles.aboutContainer, {alignSelf: alignSelf}]}>
                <Text style={styles.aboutContainerText}>
                  {I18n.t('aboutClass', {locale: lang})}
                </Text>
              </View>
              <View
                style={[styles.aboutContentContainer, {alignSelf: alignSelf}]}>
                <ReadMore
                  numberOfLines={3}
                  renderTruncatedFooter={this._renderTruncatedFooter}
                  renderRevealedFooter={this._renderRevealedFooter}
                  onReady={this._handleTextReady}>
                  <Text
                    style={[
                      styles.aboutContentContainerText,
                      {textAlign: textAlign}
                    ]}>
                    {lang === 'ar' ? description_ar : description}
                  </Text>
                </ReadMore>
                {/*  <Text
                  style={[
                    styles.aboutContentContainerText,
                    {textAlign: textAlign},
                  ]}>
                  {lang === 'ar' ? description_ar : description}
                </Text> */}
              </View>
              <View
                style={{
                  marginHorizontal: normalize(16),
                  marginTop: normalize(8),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4'
                }}
              />
              <View style={[styles.dateTimeContainer, {alignSelf: alignSelf}]}>
                <Text style={styles.dateTimeContainerText}>
                  {I18n.t('timeDate', {locale: lang})}
                </Text>
              </View>

              <View
                style={[
                  styles.dateTimeContentContainer,
                  {alignSelf: alignSelf}
                ]}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  <View style={{marginRight: normalize(6)}}>
                    <Text
                      style={[
                        styles.dateTimeContentContainerText,
                        {textAlign: textAlign}
                      ]}>
                      {`${
                        !isEmpty(this.state.date)
                          ? moment(this.state.date, 'YYYY-MM-DD').format(
                              'dddd, D MMM YYYY',
                            )
                          : I18n.t('noDateAvailable', {locale: lang})
                      }`}
                    </Text>
                  </View>
                  {!isEmpty(this.state.date) ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 25
                      }}>
                      <View style={{justifyContent: 'center'}}>
                        <Icon
                          type="FontAwesome"
                          name="circle"
                          style={{
                            fontSize: normalize(6),
                            color: '#C8C7CC',
                            textAlign: 'center'
                          }}
                        />
                      </View>
                      <View
                        style={{
                          marginLeft: normalize(6)
                        }}>
                        <Text
                          style={[
                            styles.dateTimeContentContainerText,
                            {textAlign: textAlign}
                          ]}>
                          {!isEmpty(this.state.start_time)
                            ? `${moment(
                                this.state.start_time,
                                'h:mm:ss',
                              ).format('h:mm a')} - ${moment(
                                this.state.end_time,
                                'h:mm:ss',
                              ).format('h:mm a')}`
                            : null}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>

                {class_schedules.length > 1 && (
                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      backgroundColor: '#FE9800',
                      width: normalize(110),
                      height: normalize(30),
                      backgroundColor: '#FE9800',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: normalize(24)
                    }}
                    onPress={() => {
                      this.setState({showModal: true})
                    }}>
                    <Text style={{color: 'white'}}>More sessions</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View
                style={{
                  marginHorizontal: normalize(16),
                  marginTop: normalize(8),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4'
                }}
              />

              <View style={[styles.dateTimeContainer, {alignSelf: alignSelf}]}>
                <Text style={styles.dateTimeContainerText}>
                  {I18n.t('location', {locale: lang})}
                </Text>
              </View>
              <View
                style={[
                  styles.dateTimeContentContainer,
                  {alignSelf: alignSelf}
                ]}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View
                    style={{
                      marginRight: normalize(5)
                    }}>
                    <Text
                      style={[
                        styles.dateTimeContentContainerText,
                        {textAlign: textAlign}
                      ]}>
                      {address}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: normalize(16),
                  marginTop: normalize(8),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4'
                }}
              />

              <View
                style={{
                  height: normalize(92),
                  marginHorizontal: normalize(16),
                  marginTop: normalize(16)
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontWeight: '700',
                    textAlign: textAlign
                  }}>
                  {I18n.t('gymName', {locale: lang})}
                </Text>
                <TouchableOpacity
                  onPress={e => this.handleNavigateGymDetail(e, gym_id)}
                  style={{
                    marginTop: normalize(8)
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: flexDirection
                    }}>
                    <View style={{width: normalize(60)}}>
                      <Image
                        source={gymImage}
                        style={{
                          width: normalize(60),
                          height: normalize(60),
                          borderRadius: normalize(10)
                        }}
                      />
                    </View>
                    <View
                      style={{
                        marginLeft: lang === 'ar' ? 0 : normalize(16),
                        marginRight: lang === 'ar' ? normalize(16) : 0,
                        width: normalize(267)
                        //marginHorizontal: normalize(16),
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(15),
                          fontWeight: '700',
                          textAlign: textAlign
                        }}>
                        {gym ? (lang === 'ar' ? gym.name_ar : gym.name) : ''}
                      </Text>
                      {gym && gym.distance ? (
                        <Text
                          style={{
                            fontSize: normalize(12),
                            color: '#8A8A8F',
                            textAlign: textAlign
                          }}>
                          {gym
                            ? gym.distance >= 1
                              ? `${gym.distance.toFixed(2)} km`
                              : `${gym.distance.toFixed(3) * 1000} m`
                            : ''}
                        </Text>
                      ) : null}

                      <View
                        style={[
                          styles.classRatingContainer,
                          {flexDirection: flexDirection}
                        ]}>
                        <ReviewShow
                          rating={gym ? gym.rating_avg : 0}
                          style={{
                            fontSize: normalize(11),
                            paddingRight: lang === 'ar' ? 0 : normalize(2.75),
                            paddingLeft: lang === 'ar' ? normalize(2.75) : 0
                          }}
                        />
                        <View
                          style={{
                            paddingRight: lang === 'ar' ? normalize(3) : 0,
                            paddingLeft: lang === 'ar' ? 0 : normalize(3)
                          }}>
                          <Text style={[styles.gymRatingCountText, ,]}>
                            ({gym ? gym.rating_count : 0})
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginHorizontal: normalize(16),
                  marginTop: normalize(8),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4'
                }}
              />
              <View
                style={{
                  // height: normalize(92),
                  marginHorizontal: normalize(16),
                  marginTop: normalize(16)
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontWeight: '700',
                    textAlign: textAlign
                  }}>
                  {I18n.t('coachName', {locale: lang})}
                </Text>
                {!isEmpty(this.state.coaches)
                  ? this.state.coaches.map((class_coach, index) =>
                      this.renderCoach(class_coach),
                    )
                  : null}
              </View>

              <View
                style={{
                  marginHorizontal: normalize(16),
                  marginTop: normalize(8),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4'
                }}
              />

              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  display: 'flex',
                  flex: 1,
                  flexDirection: flexDirection,
                  justifyContent: 'space-between'
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: normalize(20),
                      fontWeight: '700',
                      color: '#22242A'
                    }}>
                    {rating_count} {I18n.t('reviews', {locale: lang})}
                  </Text>
                </View>
                {reviews && reviews.length > 0 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Review', {
                        foreign_id: id,
                        class: 'Class',
                        back: 'GymClass',
                        handleReviews: data => this.handleAllReviews(data)
                      })
                    }>
                    <Text
                      style={{
                        marginTop: normalize(7),
                        fontSize: normalize(13),
                        color: '#8A8A8F',
                        justifyContent: 'center'
                      }}>
                      {I18n.t('readAll', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={this.handleWriteReview}>
                    <Text
                      style={{
                        marginTop: normalize(7),
                        fontSize: normalize(13),
                        color: '#0053FE',
                        justifyContent: 'center'
                      }}>
                      {I18n.t('writeReview', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {reviews && reviews.length > 0 ? (
                <View style={{marginBottom: normalize(10)}}>
                  {reviews.map(item => {
                    return this.renderReviewItem({item})
                  })}
                </View>
              ) : null}
              <View
                style={{
                  marginTop: normalize(6),
                  marginHorizontal: normalize(16),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4'
                }}
              />
              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  flexDirection: flexDirection
                }}>
                <Text style={{fontSize: normalize(20), fontWeight: 'bold'}}>
                  {I18n.t('recommendedClassForYou', {locale: lang})}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: normalize(16),
                  width: width,
                  height: normalize(171),
                  transform: [{rotateY: lang === 'ar' ? '180deg' : '0deg'}],
                  paddingLeft: normalize(16),
                  flexDirection: flexDirection
                }}>
                {classes.length > 0 ? (
                  <FlatList
                    horizontal={true}
                    style={styles.container}
                    data={classes}
                    renderItem={this.renderItemGym}
                    keyExtractor={item => item.id.toString()}
                  />
                ) : (
                  <View
                    style={{
                      width: normalize(142),
                      marginRight: normalize(10),
                      height: normalize(171),
                      transform: [{rotateY: lang === 'ar' ? '180deg' : '0deg'}],
                      borderRadius: normalize(10),
                      backgroundColor: '#efefef',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(16),
                        color: '#8f8f8f',
                        textAlign: 'center'
                      }}>
                      {I18n.t('noRecommendedClasses', {locale: lang})}
                    </Text>
                  </View>
                )}
              </View>
              <WriteReview
                isShowWriteReview={isShowWriteReview}
                handleWriteReview={this.handleWriteReview}
                foreign_id={id}
                class="Class"
                reviews={reviews}
                handleReviews={this.handleReviews}
              />
              <View style={{marginTop: normalize(50)}} />
            </ScrollView>
            {!isEmpty(this.state.class) && !isEmpty(this.state.date) ? (
              <>
                <TouchableOpacity
                  onPress={this.handleConfirmBooking}
                  style={{
                    position: 'absolute',
                    bottom: normalize(15),
                    marginHorizontal: normalize(32),
                    width: normalize(310),
                    height: normalize(48),
                    backgroundColor: '#FE9800',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: normalize(24)
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: normalize(16),
                      fontWeight: 'bold'
                    }}>
                    {this.state.credits > 0
                      ? `${I18n.t('bookClass', {
                          locale: lang
                        })} (${this.state.credits} ${I18n.t('credits', {
                          locale: lang
                        })})`
                      : `${I18n.t('bookClass', {
                          locale: lang
                        })} (${I18n.t('free', {
                          locale: lang
                        })})`}
                  </Text>
                </TouchableOpacity>
                <ConfirmBooking
                  isShowConfirmBooking={isShowConfirmBooking}
                  handleConfirmBooking={this.handleConfirmBooking}
                  onRefresh={this.handleRefresh}
                  data={this.state.class}
                  navigation={this.props.navigation}
                  date={this.state.date}
                  start_time={this.state.start_time}
                  end_time={this.state.end_time}
                  class_schedule_id={this.state.class_schedule_id}
                  schedule_date_id={this.state.schedule_date_id}
                  credits={this.state.credits}
                  handleClassSuccessConfirm={this.handleClassSuccessConfirm}
                />
                <ClassSuccess
                  isShowClassSuccess={isShowClassSuccess}
                  handleClassSuccess={this.handleClassSuccess}
                  text={I18n.t('successful', {locale: lang})}
                  shortText={`${I18n.t('youHaveSuccessfullyBooked', {
                    locale: lang
                  })} ${title}`}
                  buttonText={I18n.t('continue', {locale: lang})}
                  MoveScreenName={'Home'}
                  navigation={this.props.navigation}
                />
              </>
            ) : null}

            {this.state.showModal && (
              <Modal
                visible={this.state.showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                  // this.props.handleConfirmBooking();
                }}>
                <View style={{flex: 1, backgroundColor: 'white'}}>
                  <Text style={{paddingLeft: 20, paddingTop: 50, fontSize: 20}}>
                    Select session time
                  </Text>
                  <FlatList
                    style={{paddingTop: 20}}
                    scrollEnabled={false}
                    data={filteredClassSchedules}
                    renderItem={item => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            let val
                            item.item.schedule_dates.forEach(value => {
                              const date = moment(value.date).format(
                                'YYYY-MM-DD',
                              )
                              const today = moment().format('YYYY-MM-DD')

                              if (this.state.date === value.date) {
                                val = value
                              }
                            })

                            this.setState({
                              isLoading: false,
                              start_time: item.item.start_time,
                              end_time: item.item.end_time,
                              coaches: [item.item.coach],
                              showModal: false,
                              credits: item.item.credits,
                              schedule_date_id: val.id,
                              class_schedule_id: val.class_schedule_id
                            })
                          }}
                          style={[
                            styles.dateTimeContentContainer,
                            {alignSelf: alignSelf}
                          ]}>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}>
                            <View style={{marginRight: normalize(6)}}>
                              <Text
                                style={[
                                  styles.dateTimeContentContainerText,
                                  {textAlign: textAlign}
                                ]}>
                                {`${
                                  !isEmpty(this.state.date)
                                    ? moment(
                                        this.state.date,
                                        'YYYY-MM-DD',
                                      ).format('dddd, D MMM YYYY')
                                    : I18n.t('noDateAvailable', {
                                        locale: lang
                                      })
                                }`}
                              </Text>
                            </View>
                            {!isEmpty(this.state.date) ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: 25
                                }}>
                                <View style={{justifyContent: 'center'}}>
                                  <Icon
                                    type="FontAwesome"
                                    name="circle"
                                    style={{
                                      fontSize: normalize(6),
                                      color: '#C8C7CC',
                                      textAlign: 'center'
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    marginLeft: normalize(6)
                                  }}>
                                  <Text
                                    style={[
                                      styles.dateTimeContentContainerText,
                                      {textAlign: textAlign}
                                    ]}>
                                    {!isEmpty(item.item.start_time)
                                      ? `${moment(
                                          item.item.start_time,
                                          'h:mm:ss',
                                        ).format('h:mm a')} - ${moment(
                                          item.item.end_time,
                                          'h:mm:ss',
                                        ).format('h:mm a')}`
                                      : null}
                                  </Text>
                                </View>
                              </View>
                            ) : null}
                          </View>
                        </TouchableOpacity>
                      )
                    }}
                  />
                </View>
              </Modal>
            )}
          </View>
        )}
        <Toast ref={ref => (global['toast'] = ref)} />
      </>
    )
  }
}

const styles = StyleSheet.create({
  aboutContainer: {
    marginHorizontal: normalize(16)
  },
  aboutContainerText: {
    color: '#22242A',
    fontSize: normalize(14),
    fontWeight: '700',
    marginTop: normalize(12)
  },
  aboutContentContainer: {
    marginHorizontal: normalize(16),
    marginTop: normalize(6)
  },
  aboutContentContainerText: {
    color: '#8A8A8F',
    fontSize: normalize(12)
  },
  classRatingContainer: {
    display: 'flex',
    //flexDirection: 'row',
    alignItems: 'center'
  },
  classStarIcon: {
    color: '#FE9800',
    fontSize: normalize(11),
    paddingRight: normalize(2.75)
  },
  classTitleContainer: {
    marginHorizontal: normalize(16),
    marginTop: normalize(12)
  },
  classTitleContainerText: {
    color: '#22242A',
    fontSize: normalize(20),
    fontWeight: 'bold'
  },
  container: {
    flex: 1
  },
  dateTimeContainer: {
    marginHorizontal: normalize(16),
    marginTop: normalize(11)
  },
  dateTimeContainerText: {
    color: '#22242A',
    fontSize: normalize(14),
    fontWeight: '700',
    marginTop: normalize(8)
  },
  dateTimeContentContainer: {
    marginHorizontal: normalize(16),
    marginTop: normalize(6)
  },
  dateTimeContentContainerText: {
    color: '#8A8A8F',
    fontSize: normalize(12)
  },
  favMapContainer: {
    flex: 1,
    display: 'flex',
    //flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  genderContainer: {
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: normalize(10),
    height: normalize(20),
    justifyContent: 'center',
    marginHorizontal: normalize(16),
    marginTop: normalize(11),
    width: normalize(108)
  },
  genderContainerText: {
    color: '#8A8A8F',
    fontSize: normalize(12)
  },
  gymRatingCountText: {
    color: '#8A8A8F',
    fontSize: normalize(12)
  },
  ratingContainer: {
    display: 'flex',
    flex: 2
    //flexDirection: 'row',
  },
  ratingCountText: {
    color: '#8A8A8F',
    fontSize: normalize(14)
  },
  ratingFavContainer: {
    backgroundColor: '#F9F9F9',
    height: normalize(56),
    display: 'flex',
    //flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16)
  },
  starIcon: {
    color: '#FE9800',
    fontSize: normalize(18)
    //paddingRight: normalize(4),
  },
  titleContainer: {
    marginHorizontal: normalize(16)
  },
  titleContainerText: {
    color: '#22242A',
    fontSize: normalize(32),
    fontWeight: 'bold'
  }
})

const mapStateToProps = state => ({
  auth: state.auth,
  home: state.home,
  setting: state.setting,
  errors: state.errors
})

export default connect(mapStateToProps, {
  getClass,
  addFavorite,
  removeFavorite,
  getClasses,
  getClassesLocation,
  getClassLocation,
  clearClass,
  getFavorites,
  getSubscriptions
})(GymClass)
