import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import {Button, Icon} from 'native-base';
import React, {Component} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {
  addFavorite,
  clearClass,
  getClass,
  getClasses,
  getClassesLocation,
  getClassLocation,
  getFavorites,
  removeFavorite,
} from '../../actions/homeActions';
import CarouselSlider from '../../components/CarouselSlider';
import {API_URI, IMAGE_URI} from '../../utils/config';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import Loading from '../Loading';
import ReviewShow from '../Review/ReviewShow';
import WriteReview from '../WriteReview';
moment.tz.setDefault('Asia/Qatar');
import axios from 'axios';
import ReadMore from 'react-native-read-more-text';
import Toast from 'react-native-toast-notifications';

import CallIcon from '../../assets/img/call.svg';
import FavoriteGreyIcon from '../../assets/img/favorite-grey.svg';
import FavoriteRedIcon from '../../assets/img/favorite-red.svg';
import MapIcon from '../../assets/img/map.svg';
import ConfirmBooking from '../ConfirmBooking';
import analytics from '@react-native-firebase/analytics';

const {width} = Dimensions.get('window');

import WriteCoachReview from '../WriteCoachReview';
import Const from '../../utils/Const';

export class BookClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowWriteReview: false,
      isShowConfirmBooking: false,
      bookClass: {},
      isLoading: true,
      isDisable: false,
      isCoachReviewRate: false,
    };
  }

  /*  static getDerivedStateFromProps(props, state) {
    if (props.navigation.state.params.id == state.class.id) return null;
    let gymClass = {...props.home.class};
    return {
      class: gymClass,
    };
  } */

  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.BOOK_CLASS_SCREEN);
    const id = await this.props.navigation.getParam('id');
    const isCoachReview = await this.props.navigation.getParam('isCoachReview');
    const latitude = await AsyncStorage.getItem('latitude');
    const longitude = await AsyncStorage.getItem('longitude');
    let url = `${API_URI}/booking_classes/${id}`;
    await axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data;
          let isCoachReviewRate = false;
          if (isCoachReview) {
            isCoachReviewRate = true;
          }

          this.setState({
            bookClass: data,
            isLoading: false,
            isCoachReviewRate,
          });
          //this.checkCoachReview(data.class_schedule.coach_id);
          return true;
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
      });

    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    //this.setState({class: {}});
    //this.props.clearClass();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async () => {
    this.props.navigation.goBack();
    return true;
  };

  handleAddFavorite = async () => {
    const {lang} = this.props.setting;
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t('login', {locale: lang}),
        I18n.t('loginToProceed', {locale: lang}),
        [
          {
            text: I18n.t('no', {locale: lang}),
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: I18n.t('yes', {locale: lang}),
            onPress: () => this.props.navigation.navigate('Login'),
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      this.setState({isDisable: true});
      const {id} = this.state.bookClass.class;
      let addFavoriteData = {
        class: 'Class',
        foreign_id: id,
        user_id: this.props.auth.user.id,
      };
      await axios
        .post(`${API_URI}/favourites`, addFavoriteData)
        .then(async res => {
          if (res.data.error.code) {
          } else {
            const {data} = res.data;

            let bookClass = {...this.state.bookClass};
            bookClass.class.favourite = data;
            const {id} = this.props.auth.user;
            this.setState({bookClass, isDisable: false});
            this.props.getFavorites(id);
            toast.show(
              I18n.t('favoriteAddedSucessfully', {
                locale: this.props.setting.lang,
              }),
              {
                type: 'normal',
                placement: 'bottom',
                duration: 2000,
                offset: 30,
                animationType: 'slide-in',
              },
            );
          }
        })
        .catch(err => {
          /* if (err.response.data.error) {
      
      } */
        });
      //this.props.addFavorite(addFavoriteData);
    }
  };

  handleRemoveFavorite = async () => {
    const {lang} = this.props.setting;
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t('login', {locale: lang}),
        I18n.t('loginToProceed', {locale: lang}),
        [
          {
            text: I18n.t('no', {locale: lang}),
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: I18n.t('yes', {locale: lang}),
            onPress: () => this.props.navigation.navigate('Login'),
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      this.setState({isDisable: true});
      const {id} = this.state.bookClass.class.favourite;
      await axios
        .delete(`${API_URI}/favourites/${id}`)
        .then(async res => {
          if (res.data.error.code) {
          } else {
            const {data} = res.data;
            let bookClass = {...this.state.bookClass};
            delete bookClass.class.favourite;
            const {id} = this.props.auth.user;
            this.setState({bookClass, isDisable: false});
            this.props.getFavorites(id);
            toast.show(
              I18n.t('favoriteRemovedSucessfully', {
                locale: this.props.setting.lang,
              }),
              {
                type: 'normal',
                placement: 'bottom',
                duration: 2000,
                offset: 30,
                animationType: 'slide-in',
              },
            );
          }
        })
        .catch(err => {
          /*  if (err.response.data.error) {
          
        } */
        });
      //this.props.removeFavorite(id, 'Class');
    }
  };

  handleWriteReview = () => {
    const {lang} = this.props.setting;
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t('login', {locale: lang}),
        I18n.t('loginToProceed', {locale: lang}),
        [
          {
            text: I18n.t('no', {locale: lang}),
            onPress: () => console.log('come'),
            style: 'cancel',
          },
          {
            text: I18n.t('yes', {locale: lang}),
            onPress: () => this.props.navigation.navigate('Login'),
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      this.setState({isShowWriteReview: !this.state.isShowWriteReview});
    }
  };

  handleWriteCoachReview = () => {
    this.setState({isCoachReviewRate: false});
  };

  handleConfirmBooking = () => {
    this.setState({isShowConfirmBooking: !this.state.isShowConfirmBooking});
  };

  renderItemGym = ({item}) => {
    const {id} = this.state.bookClass.class;
    const {attachments, name, name_ar} = item;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    let image;

    if (attachments && attachments.length > 0) {
      let primaryAttachment = attachments.find(
        newImage => newImage.is_primary === true,
      );

      if (!isEmpty(primaryAttachment)) {
        image = {
          uri: `${IMAGE_URI}/${primaryAttachment.dir}/${primaryAttachment.file_name}`,
        };
      } else {
        image = {
          uri: `${IMAGE_URI}/${attachments[0].dir}/${attachments[0].file_name}`,
        };
      }
    } else {
      image = require('../../assets/img/no_image_found.png');
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate({
            routeName: 'GymClass',
            params: {
              id: item.id,
              back: 'GymClass',
              back_id: id,
            },
            key: `GymClass_${Math.random() * 10000}`,
          })
        }
        // onPress={() => this.props.navigation.navigate('Gym')}
        style={{
          width: normalize(142),
          marginRight: normalize(10),
          height: normalize(171),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}],
        }}>
        <View
          style={{
            width: normalize(142),
            height: normalize(142),
            //borderRadius: 10,
          }}>
          <Image
            resizeMode={'cover'}
            source={image}
            style={{
              width: normalize(142),
              height: normalize(142),
              borderRadius: normalize(10),
            }}
          />
        </View>
        <View style={{marginTop: normalize(5)}}>
          <Text style={{fontSize: normalize(15), textAlign: textAlign}}>
            {lang === 'ar' ? name_ar : name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderReviewItem = ({item}) => {
    // const {attachment} = item.user;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    let image;

    if (!isEmpty(item.user) && !isEmpty(item.user.attachment)) {
      image = {
        uri: `${IMAGE_URI}/${item.user.attachment.dir}/${item.user.attachment.file_name}`,
      };
    } else {
      image = require('../../assets/img/NoPicture.png');
    }
    return (
      <>
        <View
          style={{
            marginTop: normalize(16),
            marginHorizontal: normalize(16),
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: flexDirection,
            }}>
            <View style={{width: normalize(44)}}>
              <Image
                source={image}
                style={{
                  width: normalize(44),
                  height: normalize(44),
                  borderRadius: normalize(22),
                }}
              />
            </View>
            <View
              style={{
                marginLeft: lang === 'ar' ? 0 : normalize(16),
                marginRight: lang === 'ar' ? normalize(16) : 0,
                width: normalize(267),
                //marginHorizontal: normalize(16),
              }}>
              <Text
                style={{
                  fontSize: normalize(15),
                  fontWeight: '700',
                  textAlign: textAlign,
                }}>
                {!isEmpty(item.user)
                  ? `${item.user.first_name} ${item.user.last_name}`
                  : ''}
              </Text>
              <View
                style={[
                  styles.classRatingContainer,
                  {flexDirection: flexDirection},
                ]}>
                <ReviewShow
                  rating={item.rating}
                  style={{
                    fontSize: normalize(11),
                    paddingRight: normalize(2.75),
                  }}
                />
              </View>

              <Text
                style={{
                  fontSize: normalize(12),
                  textAlign: textAlign,
                }}>
                {item.description}
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: '#8A8A8F',
                  textAlign: textAlign,
                }}>
                {moment(item.createdAt, 'YYYY-MM-DD hh:mm:ss')
                  .startOf('hour')
                  .fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  dialCall = () => {
    const {gym_mobile} = this.state.bookClass.class.gym;
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${gym_mobile}`;
    } else {
      phoneNumber = `telprompt:${gym_mobile}`;
    }

    Linking.openURL(phoneNumber);
  };

  _renderTruncatedFooter = handlePress => {
    const {lang} = this.props.setting;
    return (
      <Text
        style={{
          color: '#0053FE',
          marginTop: 5,
          fontSize: normalize(12),
          fontWeight: 'bold',
        }}
        onPress={handlePress}>
        {I18n.t('readMore', {locale: lang})}
      </Text>
    );
  };

  _renderRevealedFooter = handlePress => {
    const {lang} = this.props.setting;
    return (
      <Text
        style={{
          color: '#0053FE',
          marginTop: 5,
          fontSize: normalize(12),
          fontWeight: 'bold',
        }}
        onPress={handlePress}>
        {I18n.t('showLess', {locale: lang})}
      </Text>
    );
  };

  handleNavigateGymDetail = (e, id) => {
    e.preventDefault();
    this.props.navigation.navigate({
      routeName: 'GymDetail',
      params: {
        id: id,
      },
      key: `GymDetail_${Math.random() * 10000}`,
    });
  };

  handleReviews = review => {
    let bookClass = {...this.state.bookClass};
    bookClass.class.reviews.push(review);
    bookClass.class.rating_count = bookClass.class.rating_count + 1;
    this.setState({bookClass: bookClass});
  };

  handleAllReviews = reviews => {
    let bookClass = {...this.state.bookClass};
    if (reviews.length < 3) {
      bookClass.class.reviews = reviews;
    }
    bookClass.class.rating_count = bookClass.class.rating_count + 1;
    this.setState({bookClass: bookClass});
  };

  render() {
    const {
      isShowWriteReview,
      isShowConfirmBooking,
      isLoading,
      isCoachReviewRate,
    } = this.state;
    let gymClass = {};
    let images = [];
    let gymImage = require('../../assets/img/no_image_found.png');
    let coachImage = require('../../assets/img/no_image_found.png');
    let coach = {};
    if (!isEmpty(this.state.bookClass.class)) {
      gymClass = this.state.bookClass.class;
      if (!isEmpty(this.state.bookClass.class_schedule)) {
        coach = {...this.state.bookClass.class_schedule.coach};
        if (coach && coach.attachment) {
          coachImage = {
            uri: `${IMAGE_URI}/${coach.attachment.dir}/${coach.attachment.file_name}`,
          };
        } else {
          coachImage = require('../../assets/img/no_image_found.png');
        }
      }

      const {
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
        ///coach,
        attachments,
        favourite,
        //reviews,
        gym_id,
        coach_id,
        start_date,
        start_time,
        end_time,
      } = gymClass;
      // let gymImage;
      if (
        gymClass.gym &&
        gymClass.gym.attachments &&
        gymClass.gym.attachments.length > 0
      ) {
        let primaryAttachment = gymClass.gym.attachments.find(
          newImage => newImage.is_primary === true,
        );

        if (!isEmpty(primaryAttachment)) {
          gymImage = {
            uri: `${IMAGE_URI}/${primaryAttachment.dir}/${primaryAttachment.file_name}`,
          };
        } else {
          gymImage = {
            uri: `${IMAGE_URI}/${gymClass.gym.attachments[0].dir}/${gymClass.gym.attachments[0].file_name}`,
          };
        }
      } else {
        gymImage = require('../../assets/img/no_image_found.png');
      }

      if (attachments && attachments.length > 0) {
        images = attachments.map(attachment => {
          let image = `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`;
          return image;
        });
      }
    }
    let classes = [...this.props.home.recommendedClasses];

    classes = classes.filter(gymClas => gymClas.id !== gymClass.id);

    // const {isLodaing} = this.props.errors;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    const {class_schedule_id, class_schedule, schedule_dates_id} =
      this.state.bookClass;
    return (
      <>
        {isLoading ? (
          <Loading />
        ) : !isEmpty(this.state.bookClass) && !isEmpty(gymClass) ? (
          <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <SafeAreaView style={{flex: 0, backgroundColor: '#ffffff'}} />
            <StatusBar /* hidden={true} */ />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{height: normalize(270)}}>
                <CarouselSlider images={images} />
                <View
                  /* style={styles.backButtonContainer} */ style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    top: Platform.OS === 'ios' ? normalize(30) : normalize(0),
                    left: normalize(10),
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
                        color: '#ffffff',
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
                  {flexDirection: flexDirection},
                ]}>
                <View
                  style={[
                    styles.ratingContainer,
                    {flexDirection: flexDirection},
                  ]}>
                  <ReviewShow
                    rating={!isEmpty(gymClass) ? gymClass.rating_avg : 0}
                    style={{
                      fontSize: normalize(18),
                      paddingRight: lang === 'ar' ? 0 : normalize(4),
                      paddingLeft: lang === 'ar' ? normalize(4) : 0,
                    }}
                  />
                  <Text style={styles.ratingCountText}>
                    ({!isEmpty(gymClass) ? gymClass.rating_count : 0})
                  </Text>
                </View>
                <View
                  style={[
                    styles.favMapContainer,
                    {flexDirection: flexDirection},
                  ]}>
                  <TouchableOpacity onPress={this.dialCall}>
                    <CallIcon width={normalize(24)} height={normalize(24)} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate({
                        routeName: 'Map',
                        params: {
                          latitude: this.state.bookClass.class.lattitude,
                          longitude: this.state.bookClass.class.longitute,
                          name:
                            lang === 'ar' ? gymClass.name_ar : gymClass.name,
                        },
                        key: `GymClassMap_${Math.random() * 10000}`,
                      });
                    }}>
                    <MapIcon
                      width={normalize(24)}
                      height={normalize(24)}
                      style={{marginHorizontal: normalize(16)}}
                    />
                  </TouchableOpacity>
                  {isEmpty(gymClass.favourite) ? (
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
                    {gymClass.gender
                      ? lang === 'ar'
                        ? gymClass.gender.name_ar
                        : gymClass.gender.name
                      : ''}
                  </Text>
                </View>
                <View style={[styles.genderContainer, {alignSelf: alignSelf}]}>
                  <Text style={styles.genderContainerText}>
                    {!isEmpty(class_schedule) && class_schedule.is_virtual
                      ? I18n.t('virtual', {locale: lang})
                      : I18n.t('offline', {locale: lang})}
                  </Text>
                </View>
              </View>

              <View style={[styles.titleContainer, {alignSelf: alignSelf}]}>
                <Text
                  style={[styles.titleContainerText, {textAlign: textAlign}]}>
                  {lang === 'ar' ? gymClass.name_ar : gymClass.name}
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
                      {textAlign: textAlign},
                    ]}>
                    {lang === 'ar'
                      ? gymClass.description_ar
                      : gymClass.description}
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
                  borderBottomColor: '#EFEFF4',
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
                  {alignSelf: alignSelf},
                ]}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View
                    style={{
                      marginRight: normalize(5),
                    }}>
                    <Text
                      style={[
                        styles.dateTimeContentContainerText,
                        {textAlign: textAlign},
                      ]}>
                      {moment(
                        this.state.bookClass.schedule_date.date,
                        'YYYY-MM-DD',
                      ).format('dddd, D MMM YYYY')}
                    </Text>
                  </View>

                  <View style={{justifyContent: 'center'}}>
                    <Icon
                      type="FontAwesome"
                      name="circle"
                      style={{
                        fontSize: normalize(5),
                        color: '#C8C7CC',
                        textAlign: 'center',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: normalize(5),
                    }}>
                    <Text
                      style={[
                        styles.dateTimeContentContainerText,
                        {textAlign: textAlign},
                      ]}>
                      {`${moment(
                        this.state.bookClass.schedule_date.start_time,
                        'h:mm:ss',
                      ).format('h:mm a')} - ${moment(
                        this.state.bookClass.schedule_date.end_time,
                        'h:mm:ss',
                      ).format('h:mm a')}`}
                    </Text>
                  </View>
                </View>
                {/*  <Text
                  style={[
                    styles.dateTimeContentContainerText,
                    {textAlign: textAlign},
                  ]}>
                  {moment(start_date, 'YYYY-MM-DD').format('dddd, D MMM YYYY')}
                  {` ${moment(start_time, 'h:mm:ss').format(
                    'h:mm a',
                  )} - ${moment(end_time, 'h:mm:ss').format('h:mm a')}`}
                </Text> */}
              </View>
              <View
                style={{
                  marginHorizontal: normalize(16),
                  marginTop: normalize(8),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4',
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
                  {alignSelf: alignSelf},
                ]}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View
                    style={{
                      marginRight: normalize(5),
                    }}>
                    <Text
                      style={[
                        styles.dateTimeContentContainerText,
                        {textAlign: textAlign},
                      ]}>
                      {this.state.bookClass.class.address}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: normalize(16),
                  marginTop: normalize(8),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4',
                }}
              />

              <View
                style={{
                  height: normalize(92),
                  marginHorizontal: normalize(16),
                  marginTop: normalize(16),
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontWeight: '700',
                    textAlign: textAlign,
                  }}>
                  {I18n.t('gymName', {locale: lang})}
                </Text>
                <TouchableOpacity
                  onPress={e =>
                    this.handleNavigateGymDetail(e, gymClass.gym_id)
                  }
                  /* onPress={() =>
                    this.props.navigation.navigate({
                      routeName: 'GymDetail',
                      params: {
                        id: gym_id,
                      },
                      key: `GymDetail_${Math.random() * 10000}`,
                    })
                  } */
                  style={{
                    marginTop: normalize(8),
                    //marginHorizontal: normalize(16),
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: flexDirection,
                    }}>
                    <View style={{width: normalize(60)}}>
                      <Image
                        source={gymImage}
                        style={{
                          width: normalize(60),
                          height: normalize(60),
                          borderRadius: normalize(10),
                        }}
                      />
                    </View>
                    <View
                      style={{
                        marginLeft: lang === 'ar' ? 0 : normalize(16),
                        marginRight: lang === 'ar' ? normalize(16) : 0,
                        width: normalize(267),
                        //marginHorizontal: normalize(16),
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(15),
                          fontWeight: '700',
                          textAlign: textAlign,
                        }}>
                        {gymClass.gym
                          ? lang === 'ar'
                            ? gymClass.gym.name_ar
                            : gymClass.gym.name
                          : ''}
                      </Text>
                      {gymClass.gym && gymClass.gym.distance ? (
                        <Text
                          style={{
                            fontSize: normalize(12),
                            color: '#8A8A8F',
                            textAlign: textAlign,
                          }}>
                          {gym
                            ? gymClass.gym.distance >= 1
                              ? `${gymClass.gym.distance.toFixed(2)} km`
                              : `${gymClass.gym.distance.toFixed(3) * 1000} m`
                            : ''}
                        </Text>
                      ) : null}

                      <View
                        style={[
                          styles.classRatingContainer,
                          {flexDirection: flexDirection},
                        ]}>
                        <ReviewShow
                          rating={gymClass.gym ? gymClass.gym.rating_avg : 0}
                          style={{
                            fontSize: normalize(11),
                            paddingRight: lang === 'ar' ? 0 : normalize(2.75),
                            paddingLeft: lang === 'ar' ? normalize(2.75) : 0,
                          }}
                        />
                        <View
                          style={{
                            paddingRight: lang === 'ar' ? normalize(3) : 0,
                            paddingLeft: lang === 'ar' ? 0 : normalize(3),
                          }}>
                          <Text style={[styles.gymRatingCountText, ,]}>
                            ({gymClass.gym ? gymClass.gym.rating_count : 0})
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
                  borderBottomColor: '#EFEFF4',
                }}
              />
              {!isEmpty(coach) ? (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate({
                        routeName: 'Coach',
                        params: {
                          id: coach.id,
                        },
                        key: `ClassCoach_${Math.random() * 10000}`,
                      })
                    }
                    style={{
                      height: normalize(92),
                      marginHorizontal: normalize(16),
                      marginTop: normalize(16),
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(14),
                        fontWeight: '700',
                        textAlign: textAlign,
                      }}>
                      {I18n.t('coachName', {locale: lang})}
                    </Text>
                    <View
                      style={{
                        marginTop: normalize(8),
                        //marginHorizontal: normalize(16),
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: flexDirection,
                        }}>
                        <View style={{width: normalize(60)}}>
                          <Image
                            source={coachImage}
                            style={{
                              width: normalize(60),
                              height: normalize(60),
                              borderRadius: normalize(10),
                            }}
                          />
                        </View>
                        <View
                          style={{
                            marginLeft: lang === 'ar' ? 0 : normalize(16),
                            marginRight: lang === 'ar' ? normalize(16) : 0,
                            width: normalize(267),
                            //marginHorizontal: normalize(16),
                          }}>
                          <Text
                            style={{
                              fontSize: normalize(15),
                              fontWeight: '700',
                              textAlign: textAlign,
                            }}>
                            {coach
                              ? `${lang === 'ar' ? coach.name_ar : coach.name}`
                              : ''}
                          </Text>
                          {/*  <Text
                            style={{
                              fontSize: normalize(12),
                              color: '#8A8A8F',
                              textAlign: textAlign,
                            }}>
                            {coach && coach.category
                              ? lang === 'ar'
                                ? coach.category.name_ar
                                : coach.category.name
                              : ''}{' '}
                            {I18n.t('coach', {locale: lang})}
                          </Text> */}
                          <View
                            style={[
                              styles.classRatingContainer,
                              {flexDirection: flexDirection},
                            ]}>
                            <ReviewShow
                              rating={coach ? coach.rating_avg : 0}
                              style={{
                                fontSize: normalize(11),
                                paddingRight:
                                  lang === 'ar' ? 0 : normalize(2.75),
                                paddingLeft:
                                  lang === 'ar' ? normalize(2.75) : 0,
                              }}
                            />
                            <View
                              style={{
                                paddingRight: lang === 'ar' ? normalize(3) : 0,
                                paddingLeft: lang === 'ar' ? 0 : normalize(3),
                              }}>
                              <Text style={styles.gymRatingCountText}>
                                ({coach ? coach.rating_count : 0})
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginHorizontal: normalize(16),
                      marginTop: normalize(8),
                      borderBottomWidth: 1,
                      borderBottomColor: '#EFEFF4',
                    }}
                  />
                </>
              ) : null}

              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  display: 'flex',
                  flex: 1,
                  flexDirection: flexDirection,
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: normalize(20),
                      fontWeight: '700',
                      color: '#22242A',
                    }}>
                    {gymClass.rating_count} {I18n.t('reviews', {locale: lang})}
                  </Text>
                </View>
                {gymClass.reviews && gymClass.reviews.length > 0 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Review', {
                        foreign_id: gymClass.id,
                        class: 'Class',
                        back: 'GymClass',
                        handleReviews: data => this.handleAllReviews(data),
                      })
                    }>
                    <Text
                      style={{
                        marginTop: normalize(7),
                        fontSize: normalize(13),
                        color: '#8A8A8F',
                        justifyContent: 'center',
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
                        justifyContent: 'center',
                      }}>
                      {I18n.t('writeReview', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {gymClass.reviews && gymClass.reviews.length > 0 ? (
                <FlatList
                  style={styles.container}
                  data={gymClass.reviews}
                  renderItem={this.renderReviewItem}
                  keyExtractor={item => item.id.toString()}
                  /* contentContainerStyle={{
                    marginBottom: normalize(10),
                  }} */
                />
              ) : null}
              <View
                style={{
                  marginTop: normalize(6),
                  marginHorizontal: normalize(16),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFF4',
                }}
              />
              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  flexDirection: flexDirection,
                }}>
                <Text style={{fontSize: normalize(20), fontWeight: 'bold'}}>
                  {I18n.t('recommendedClassForYou', {locale: lang})}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: normalize(16),
                  marginVertical: normalize(16),
                  flexDirection: flexDirection,
                }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    width: width,
                    height: normalize(171),
                    //scaleX: -1,
                    transform: [{rotateY: lang === 'ar' ? '180deg' : '0deg'}],
                    //flexDirection: flexDirection,
                  }}>
                  {classes.length > 0 ? (
                    <FlatList
                      horizontal={true}
                      style={styles.container}
                      data={classes}
                      renderItem={this.renderItemGym}
                      keyExtractor={item => item.id.toString()}
                      contentContainerStyle={
                        {
                          /* marginRight:
                      lang === 'ar' ? normalize(-6) : normalize(16),
                    marginLeft: lang === 'ar' ? normalize(16) : 0, */
                        }
                      }
                    />
                  ) : (
                    <View
                      style={{
                        width: normalize(142),
                        marginRight: normalize(10),
                        height: normalize(171),
                        transform: [
                          {rotateY: lang === 'ar' ? '180deg' : '0deg'},
                        ],
                        borderRadius: normalize(10),
                        backgroundColor: '#efefef',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          color: '#8f8f8f',
                          textAlign: 'center',
                        }}>
                        {I18n.t('noRecommendedClasses', {locale: lang})}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
              <WriteReview
                isShowWriteReview={isShowWriteReview}
                handleWriteReview={this.handleWriteReview}
                foreign_id={gymClass.id}
                class="Class"
                reviews={gymClass.reviews}
                handleReviews={this.handleReviews}
              />
              {/* <WriteCoachReview
                isShowWriteReview={isCoachReviewRate}
                handleWriteReview={this.handleWriteCoachReview}
                coach_id={class_schedule.coach_id}
                class_schedule_id={class_schedule_id}
                schedule_dates_id={schedule_dates_id}
              /> */}
            </ScrollView>
          </View>
        ) : null}
        <Toast ref={ref => (global['toast'] = ref)} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  aboutContainer: {
    marginHorizontal: normalize(16),
  },
  aboutContainerText: {
    color: '#22242A',
    fontSize: normalize(14),
    fontWeight: '700',
    marginTop: normalize(12),
  },
  aboutContentContainer: {
    marginHorizontal: normalize(16),
    marginTop: normalize(6),
  },
  aboutContentContainerText: {
    color: '#8A8A8F',
    fontSize: normalize(12),
  },
  classRatingContainer: {
    display: 'flex',
    //flexDirection: 'row',
    alignItems: 'center',
  },
  classStarIcon: {
    color: '#FE9800',
    fontSize: normalize(11),
    paddingRight: normalize(2.75),
  },
  classTitleContainer: {
    marginHorizontal: normalize(16),
    marginTop: normalize(12),
  },
  classTitleContainerText: {
    color: '#22242A',
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  dateTimeContainer: {
    marginHorizontal: normalize(16),
    marginTop: normalize(11),
  },
  dateTimeContainerText: {
    color: '#22242A',
    fontSize: normalize(14),
    fontWeight: '700',
    marginTop: normalize(8),
  },
  dateTimeContentContainer: {
    marginHorizontal: normalize(16),
    marginTop: normalize(6),
  },
  dateTimeContentContainerText: {
    color: '#8A8A8F',
    fontSize: normalize(12),
  },
  favMapContainer: {
    flex: 1,
    display: 'flex',
    //flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  genderContainer: {
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: normalize(10),
    height: normalize(20),
    justifyContent: 'center',
    marginHorizontal: normalize(16),
    marginTop: normalize(11),
    width: normalize(108),
  },
  genderContainerText: {
    color: '#8A8A8F',
    fontSize: normalize(12),
  },
  gymRatingCountText: {
    color: '#8A8A8F',
    fontSize: normalize(12),
  },
  ratingContainer: {
    display: 'flex',
    flex: 2,
    //flexDirection: 'row',
  },
  ratingCountText: {
    color: '#8A8A8F',
    fontSize: normalize(14),
  },
  ratingFavContainer: {
    backgroundColor: '#F9F9F9',
    height: normalize(56),
    display: 'flex',
    //flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
  },
  starIcon: {
    color: '#FE9800',
    fontSize: normalize(18),
    //paddingRight: normalize(4),
  },
  titleContainer: {
    marginHorizontal: normalize(16),
  },
  titleContainerText: {
    color: '#22242A',
    fontSize: normalize(32),
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  home: state.home,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getClass,
  addFavorite,
  removeFavorite,
  getClasses,
  getClassesLocation,
  getClassLocation,
  clearClass,
  getFavorites,
})(BookClass);
