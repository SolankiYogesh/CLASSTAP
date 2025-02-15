import FastImage from '@d11/react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
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
  clearGym,
  getFavorites,
  getGym,
  getGymLocation,
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
import ReadMore from 'react-native-read-more-text'
import Toast from 'react-native-toast-notifications'

import CallIcon from '../../assets/img/call.svg'
import FavoriteGreyIcon from '../../assets/img/favorite-grey.svg'
import FavoriteRedIcon from '../../assets/img/favorite-red.svg'
import MapIcon from '../../assets/img/map.svg'

const {width} = Dimensions.get('window')

export class GymDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowWriteReview: false,
      isShowAbout: false,
      gym: {},
      isLoading: true,
      isDisable: false,
      refreshing: false
    }
  }

  /* static getDerivedStateFromProps(props, state) {
    if (props.navigation.state.params.id == state.gym.id) return null;
    let gym = {...props.home.gym};
    return {
      gym: gym,
    };
  } */

  async componentDidMount() {
    const id = await this.props.navigation.getParam('id')
    const latitude = await AsyncStorage.getItem('latitude')
    const longitude = await AsyncStorage.getItem('longitude')
    let url
    if (latitude && longitude) {
      url = `${API_URI}/gyms/${id}?latitude=${latitude}&longitude=${longitude}`
    } else {
      url = `${API_URI}/gyms/${id}`
    }
    await axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data

          this.setState({gym: data, isLoading: false})
          return true
        }
      })
      .catch(err => {
        this.setState({isLoading: false})
      })

    /*  if (latitude && longitude) {
      this.props.getGymLocation(id);
    } else {
      this.props.getGym(id);
    } */

    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount() {
    //this.setState({gym: {}});
    //this.props.clearGym();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  renderItem = ({item}) => {
    const {
      id,
      name,
      name_ar,
      attachments,
      credits,
      start_time,
      end_time,
      distance,
      class_schedules
    } = item
    ///const {distance} = this.state.gym;

    const {lang} = this.props.setting
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start'
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
    let scheduleDates = []
    class_schedules.map(schedule => {
      if (!isEmpty(schedule.schedule_dates)) {
        schedule.schedule_dates[0].dateTime = `${schedule.schedule_dates[0].date}T${schedule.start_time}`
        schedule.schedule_dates[0].start_time = schedule.start_time
        schedule.schedule_dates[0].end_time = schedule.end_time
        schedule.schedule_dates[0].credits = schedule.credits
        schedule.schedule_dates[0].duration = schedule.duration
        scheduleDates.push(schedule.schedule_dates[0])
      }
    })
    scheduleDates.sort(function (a, b) {
      return new Date(a.dateTime) - new Date(b.dateTime)
    })
    return (
      <TouchableOpacity
        /*  onPress={() =>
          this.props.navigation.navigate('GymClass', {id, back: 'Gym'})
        } */
        onPress={() =>
          this.props.navigation.navigate({
            routeName: 'GymClass',
            params: {
              id: id
            },
            key: `GymDetailClasses_${Math.random() * 10000}`
          })
        }
        style={{
          display: 'flex',
          flexDirection: flexDirection,
          marginTop: normalize(16),
          marginHorizontal: normalize(16)
        }}>
        <View style={{display: 'flex', width: normalize(60)}}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(60),
                height: normalize(60),
                borderRadius: normalize(10)
              }}
              source={{
                uri: image.url,
                priority: FastImage.priority.normal
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image
              resizeMode={'cover'}
              source={image}
              style={{
                width: normalize(60),
                height: normalize(60),
                borderRadius: normalize(10)
              }}
            />
          )}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: flexDirection,
            width: normalize(267),
            marginLeft: normalize(20),
            justifyContent: 'space-between'
          }}>
          <View
            style={
              {
                //width: normalize(200),
                //marginLeft: lang === 'ar' ? 0 : normalize(18),
                //marginRight: lang === 'ar' ? normalize(18) : 0,
              }
            }>
            <View
              style={{
                display: 'flex',
                flexDirection: flexDirection
              }}>
              <View>
                <Text
                  style={{
                    fontSize: normalize(17),
                    fontWeight: '700',
                    textAlign: textAlign
                  }}>
                  {lang === 'ar' ? name_ar : name}
                </Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontSize: normalize(12), color: '#8A8A8F'}}>
                    {`${
                      !isEmpty(scheduleDates) ? scheduleDates[0].duration : 0
                    } ${I18n.t('min', {
                      locale: lang
                    })}`}
                  </Text>
                  {distance ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        marginHorizontal: normalize(8)
                      }}>
                      <Icon
                        type="FontAwesome"
                        name="circle"
                        style={{
                          fontSize: normalize(5),
                          color: '#C8C7CC',
                          textAlign: 'center'
                        }}
                      />
                    </View>
                  ) : null}

                  <Text style={{fontSize: normalize(12), color: '#8A8A8F'}}>
                    {distance
                      ? distance >= 1
                        ? `${distance.toFixed(2)} km`
                        : `${distance.toFixed(3) * 1000} m`
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.classRatingContainer,
                {marginTop: normalize(6), flexDirection: flexDirection}
              ]}>
              <ReviewShow
                rating={item.rating_avg}
                style={{
                  fontSize: normalize(11),
                  paddingRight: normalize(2.75)
                }}
              />
              <View style={{marginLeft: normalize(2)}}>
                <Text style={styles.gymRatingCountText}>
                  ({item.rating_count})
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end'
              //width: normalize(65)
            }}>
            {/* <Text style={{fontSize: normalize(14), color: '#8A8A8F'}}>
              {`${credits} ${I18n.t('credits', {locale: lang})}`}
            </Text> */}
            <Text
              style={{
                fontSize: normalize(14),
                color: '#8A8A8F',
                textAlign: 'center'
              }}>
              {!isEmpty(scheduleDates) && scheduleDates[0].credits > 0
                ? `${!isEmpty(scheduleDates) ? scheduleDates[0].credits : 0} ${
                    !isEmpty(scheduleDates) && scheduleDates[0].credits > 1
                      ? I18n.t('credits', {
                          locale: lang
                        })
                      : I18n.t('credit', {
                          locale: lang
                        })
                  }`
                : I18n.t('free', {
                    locale: lang
                  })}
            </Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate({
                  routeName: 'GymClass',
                  params: {
                    id: id
                  },
                  key: `GymDetailClasses_${Math.random() * 10000}`
                })
              }
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                justifyContent: 'center',
                width: normalize(62),
                height: normalize(27),
                backgroundColor: '#FE9800',
                borderRadius: normalize(14),
                marginTop: normalize(10)
              }}>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: '#FFFFFF'
                }}>
                {I18n.t('book', {locale: lang})}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderItemGym = ({item}) => {
    const {lang} = this.props.setting
    const {id} = this.state.gym
    const {attachments, name, name_ar, distance} = item
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start'
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
            routeName: 'Gym',
            params: {
              id: item.id
            },
            key: `GymDetailRecommendedGym_${Math.random() * 10000}`
          })
        }
        /*         onPress={() =>
          this.props.navigation.navigate({
            routeName: 'Gym',
            params: {
              id: item.id,
              back: 'Gym',
              back_id: id,
            },
            key: `Gym_${item.id}`,
          })
        } */
        //onPress={() => this.props.getGym(item.id)}
        style={{
          width: normalize(204),
          marginRight: normalize(10),
          height: normalize(157),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}]
        }}>
        <View
          style={{
            width: normalize(204),
            height: normalize(134)
            //borderRadius: 10,
          }}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(204),
                height: normalize(134),
                borderRadius: normalize(10)
              }}
              source={{
                uri: image.url,
                priority: FastImage.priority.normal
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image
              resizeMode={'cover'}
              source={image}
              style={{
                width: normalize(204),
                height: normalize(134),
                borderRadius: normalize(10)
              }}
            />
          )}
          {distance ? (
            <View
              style={
                lang === 'ar'
                  ? styles.distanceContainerArabic
                  : styles.distanceContainer
              }>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  left: normalize(10),
                  borderRadius: normalize(14),
                  fontSize: normalize(10),
                  paddingHorizontal: normalize(7),
                  paddingVertical: normalize(2)
                }}>
                <Text style={{fontSize: normalize(10)}}>
                  {distance
                    ? distance >= 1
                      ? `${distance.toFixed(2)} km`
                      : `${distance.toFixed(3) * 1000} m`
                    : ''}
                </Text>
              </View>
            </View>
          ) : null}
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
    const {attachment} = item.user
    const {lang} = this.props.setting
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start'
    let image

    if (!isEmpty(attachment)) {
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
              {image.url ? (
                <FastImage
                  style={{
                    width: normalize(44),
                    height: normalize(44),
                    borderRadius: normalize(22)
                  }}
                  source={{
                    uri: image.url,
                    priority: FastImage.priority.normal
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <Image
                  resizeMode={'cover'}
                  source={image}
                  style={{
                    width: normalize(44),
                    height: normalize(44),
                    borderRadius: normalize(22)
                  }}
                />
              )}
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
                {`${item.user.first_name} ${item.user.last_name}`}
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
      const {id} = this.state.gym
      let addFavoriteData = {
        class: 'Gym',
        foreign_id: id,
        user_id: this.props.auth.user.id
      }
      await axios
        .post(`${API_URI}/favourites`, addFavoriteData)
        .then(async res => {
          if (res.data.error.code) {
          } else {
            const {data} = res.data
            let gym = {...this.state.gym}
            gym.favourite = data
            this.setState({gym, isDisable: false})
            this.props.getFavorites(this.props.auth.user.id)
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
      // this.props.addFavorite(addFavoriteData);
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
      const {id} = this.state.gym.favourite
      await axios
        .delete(`${API_URI}/favourites/${id}`)
        .then(async res => {
          if (res.data.error.code) {
          } else {
            const {data} = res.data
            let gym = {...this.state.gym}
            delete gym.favourite
            this.setState({gym, isDisable: false})
            this.props.getFavorites(this.props.auth.user.id)
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
      //this.props.removeFavorite(id, 'Gym');
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

  handleBack = async () => {
    this.props.navigation.goBack()
    return true
  }

  handleShowAbout = () => {
    this.setState({isShowAbout: true})
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

  diff = (start, end) => {
    start = start.split(':')
    end = end.split(':')
    var startDate = new Date(0, 0, 0, start[0], start[1], start[2], 0)
    var endDate = new Date(0, 0, 0, end[0], end[1], end[2], 0)
    var diff = endDate.getTime() - startDate.getTime()
    var hours = Math.floor(diff / 1000 / 60 / 60)
    diff -= hours * 1000 * 60 * 60
    var minutes = Math.floor(diff / 1000 / 60)
    if (hours > 0) {
      return `${hours}:${minutes} hour`
    } else {
      return `${minutes} min`
    }
  }

  dialCall = () => {
    const {gym_mobile} = this.state.gym
    let phoneNumber = ''

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${gym_mobile}`
    } else {
      phoneNumber = `telprompt:${gym_mobile}`
    }

    Linking.openURL(phoneNumber)
  }

  handleReviews = review => {
    let gym = {...this.state.gym}
    gym.reviews.push(review)
    gym.rating_count = gym.rating_count + 1
    this.setState({gym})
  }

  handleAllReviews = reviews => {
    let gym = {...this.state.gym}
    if (reviews.length < 3) {
      gym.reviews = reviews
    }
    gym.rating_count = gym.rating_count + 1
    this.setState({gym})
  }

  handleRefresh = async () => {
    this.setState({refreshing: true})
    const id = await this.props.navigation.getParam('id')
    const latitude = await AsyncStorage.getItem('latitude')
    const longitude = await AsyncStorage.getItem('longitude')
    let url
    if (latitude && longitude) {
      url = `${API_URI}/gyms/${id}?latitude=${latitude}&longitude=${longitude}`
    } else {
      url = `${API_URI}/gyms/${id}`
    }
    await axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data

          this.setState({gym: data})
          return true
        }
      })
      .catch(err => {})
    setTimeout(() => {
      this.setState({refreshing: false})
    }, 2000)
  }

  render() {
    const {isShowWriteReview, isShowAbout, refreshing} = this.state
    const {lang} = this.props.setting
    //const {isLodaing} = this.props.errors;
    const {isLoading} = this.state
    const {
      id,
      name,
      name_ar,
      description,
      description_ar,
      attachments,
      classes,
      favourite,
      gender,
      reviews,
      rating_count,
      rating_avg,
      lattitude,
      longitute
    } = this.state.gym
    let gyms = [...this.props.home.recommendedGyms]
    gyms = gyms.filter(gym => gym.id !== id)

    let images = []
    if (attachments && attachments.length > 0) {
      images = attachments.map(attachment => {
        let image = `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`
        return image
      })
    }

    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start'

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
                      {I18n.t('backToClass', {locale: lang})}
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
                        key: `GymDetailMap_${Math.random() * 10000}`
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
              <View style={[styles.genderContainer, {alignSelf: alignSelf}]}>
                <Text style={styles.genderContainerText}>
                  {gender ? (lang === 'ar' ? gender.name_ar : gender.name) : ''}
                </Text>
              </View>
              <View style={[styles.titleContainer, {alignSelf: alignSelf}]}>
                <Text
                  style={[styles.titleContainerText, {textAlign: textAlign}]}>
                  {lang === 'ar' ? name_ar : name}
                </Text>
              </View>
              <View>
                <View style={[styles.aboutContainer, {alignSelf: alignSelf}]}>
                  <Text style={styles.aboutContainerText}>
                    {I18n.t('aboutGym', {locale: lang})}
                  </Text>
                </View>
                <View
                  style={[
                    styles.aboutContentContainer,
                    {alignSelf: alignSelf}
                  ]}>
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

                  <View
                    style={{
                      marginTop: normalize(6),
                      borderBottomWidth: 1,
                      borderBottomColor: '#EFEFF4'
                    }}
                  />
                </View>
              </View>

              <View
                style={[styles.classTitleContainer, {alignSelf: alignSelf}]}>
                <Text style={styles.classTitleContainerText}>
                  {`${classes ? classes.length : 0} ${I18n.t('classByThisGym', {
                    locale: lang
                  })}`}
                </Text>
              </View>

              {classes && classes.length > 0 ? (
                <View style={{marginBottom: normalize(10)}}>
                  {classes.map(item => {
                    return this.renderItem({item})
                  })}
                </View>
              ) : (
                <View
                  style={{
                    marginHorizontal: normalize(16)
                  }}>
                  <Text style={{color: '#8f8f8f', fontSize: normalize(16)}}>
                    {I18n.t('noClasses', {
                      locale: lang
                    })}
                  </Text>
                </View>
              )}
              <View
                style={{
                  marginHorizontal: normalize(16),
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
                        class: 'Gym',
                        back: 'Gym',
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
                  {I18n.t('recommendedGymForYou', {locale: lang})}
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
                {gyms.length > 0 ? (
                  <FlatList
                    horizontal={true}
                    style={styles.container}
                    data={gyms}
                    renderItem={this.renderItemGym}
                    keyExtractor={item => item.id.toString()}
                  />
                ) : (
                  <View
                    style={{
                      width: normalize(204),
                      marginRight: normalize(10),
                      height: normalize(157),
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
                      {I18n.t('noRecommendedGyms', {locale: lang})}
                    </Text>
                  </View>
                )}
              </View>
              <WriteReview
                isShowWriteReview={isShowWriteReview}
                handleWriteReview={this.handleWriteReview}
                foreign_id={id}
                class="Gym"
                reviews={reviews}
                handleReviews={this.handleReviews}
              />
            </ScrollView>
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
    alignItems: 'center',
    display: 'flex'
    //flexDirection: 'row',
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
  distanceContainer: {
    bottom: normalize(10),
    left: normalize(10),
    position: 'absolute'
  },
  distanceContainerArabic: {
    bottom: normalize(10),
    position: 'absolute',
    right: normalize(10)
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
  getGym,
  addFavorite,
  removeFavorite,
  getGymLocation,
  clearGym,
  getFavorites
})(GymDetail)
