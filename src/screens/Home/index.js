import FastImage from '@d11/react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import React, {PureComponent} from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {
  getCategories,
  getGyms,
  getGymsLocation,
  getGymsRefresh,
  getRecommendedClasses,
  getRecommendedGyms,
  getTodayClasses,
} from '../../actions/homeActions';
import {getWhatsOnToday} from '../../actions/subscriptionActions';
import CheckCircleIcon from '../../assets/img/check_circle_active.svg';
import ClockIcon from '../../assets/img/clock.svg';
import {API_URI, IMAGE_URI} from '../../utils/config';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import Loading from '../Loading';
moment.tz.setDefault('Asia/Qatar');
import notifee from '@notifee/react-native';
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {check, PERMISSIONS} from 'react-native-permissions';

import {updateUserDeviceToken} from '../../actions/authActions';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

class Home extends PureComponent {
  constructor(props) {
    console.log('props', props);
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      isLoading: false,
      refreshing: false,
    };
    this.lastNotificationId = 0;
  }

  componentDidUpdate(props) {
    if (!props?.errors?.isLoading) {
      return {
        isLoading: false,
      };
    } else {
      return {
        isLoading: true,
      };
    }
  }

  handleLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        await AsyncStorage.setItem('latitude', latitude);
        await AsyncStorage.setItem('longitude', longitude);

        await this.props.setLatLong(
          position.coords.latitude,
          position.coords.longitude,
        );
        return true;
      },
      () => {},
      {
        enableHighAccuracy: /* Platform.OS === 'ios' ? true : */ false,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.HOME_SCREEN);
    notifee.cancelAllNotifications();

    messaging().onMessage(async foregroundNotification => {
      if (this.lastNotificationId !== foregroundNotification.messageId) {
        this.lastNotificationId = foregroundNotification.messageId;

        notifee.displayNotification({
          ...foregroundNotification,
          id: 'localNotificationHandler',
          channelId: 'default-channel-id',
          smallIcon: 'ic_launcher',
        });
        notifee.cancelAllNotifications();
      }
    });

    // if (!checkingFirebaseConnection) {
    messaging()
      .getToken()
      .then(async token => {
        // console.log(token, "token");
        const user_id = await AsyncStorage.getItem('user_id');
        AsyncStorage.setItem('push_token', token);
        const userData = {
          device_token: token,
          device_type: Platform.OS,
        };
        if (user_id) {
          axios
            .put(`${API_URI}/users/${user_id}`, userData)
            .then(res => {
              if (res.data.error.code) {
              } else {
                const {data} = res.data;
                console.log(data);
              }
            })
            .catch(err => {
              if (err.response.data.error) {
              }
            });
        }
      });
    // }

    messaging().onNotificationOpenedApp(notification => {
      console.log(notification);
    });

    messaging()
      .getInitialNotification()
      .then(notification => {
        console.log(notification);
      });

    if (Platform.OS === 'ios') {
      await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(async result => {
          if (result === 'granted') {
            await this.handleLocation();
          } else {
            await AsyncStorage.removeItem('latitude');
            await AsyncStorage.removeItem('longitude');
          }
        })
        .catch(() => {
          // …
        });
    } else {
      await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(async result => {
          if (result === 'granted') {
            await this.handleLocation();
          } else {
            await AsyncStorage.removeItem('latitude');
            await AsyncStorage.removeItem('longitude');
          }
        })
        .catch(() => {
          // …
        });
    }
    const latitude = await AsyncStorage.getItem('latitude');
    const longitude = await AsyncStorage.getItem('longitude');
    let user_id = await AsyncStorage.getItem('user_id');

    if (latitude && longitude) {
      this.setState({latitude, longitude});
    } else {
      this.props.getGyms();
    }

    if (
      !this.props.home.categories.length ||
      !this.props.home.recommendedGyms.length
    ) {
      this.props.getTodayClasses();
      this.props.getGyms();
      this.props.getRecommendedGyms();
      this.props.getRecommendedClasses();
      this.props.getCategories();
    }

    if (user_id) {
      this.props.getWhatsOnToday(parseInt(user_id));
    }

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.back = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBack,
      );
    });

    this.focusListener1 = this.props.navigation.addListener('blur', () => {
      if (this.back?.remove) {
        this.back?.remove();
      }
    });

    this.focusListener2 = this.props.navigation.addListener(
      'focus',
      async () => {
        let user_id = await AsyncStorage.getItem('user_id');
        this.props.getGymsRefresh();
        this.props.getTodayClasses();
        this.props.getRecommendedGyms();
        this.props.getRecommendedClasses();
        this.props.getCategories();
        // await this.handleLocation();
        if (user_id) {
          this.props.getWhatsOnToday(parseInt(user_id));
        }
      },
    );
  }

  handleBack = () => {
    const lang = this.props?.setting?.lang;
    Alert.alert(
      I18n.t('exit', {locale: lang}),
      I18n.t('areYouExitApp', {locale: lang}),
      [
        {
          text: I18n.t('no', {locale: lang}),
          onPress: () => console.log('come'),
          style: 'cancel',
        },
        {
          text: I18n.t('yes', {locale: lang}),
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );

    return true;
  };

  handleNavigateTodayClass = (e, id) => {
    e.preventDefault();
    let date = new Date();
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    this.props.navigation.navigate({
      routeName: 'GymClass',
      params: {
        id: id,
        date: dateString,
      },
      key: `TodayClass_${Math.random() * 10000}`,
    });
  };
  renderItem = ({item}) => {
    const {class_schedules, attachments, name_ar, name, id, distance} = item;

    let upcoming = [];
    class_schedules.forEach(schedule => {
      upcoming.push({id: schedule.id, start_time: schedule.start_time});
    });
    upcoming.sort(function (a, b) {
      return (
        new Date('1970/01/01 ' + a.start_time) -
        new Date('1970/01/01 ' + b.start_time)
      );
    });
    let image;

    const lang = this.props?.setting?.lang;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    let className = lang === 'ar' ? name_ar : name;
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
        onPress={e => this.handleNavigateTodayClass(e, id)}
        style={{
          width: normalize(342),
          height: normalize(170),
          marginRight: normalize(10),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}],
        }}>
        {image.url ? (
          <FastImage
            style={{
              width: normalize(342),
              height: normalize(170),
              borderRadius: normalize(10),
            }}
            source={{
              uri: image.url,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image
            resizeMode={'cover'}
            source={image}
            style={{
              width: normalize(342),
              height: normalize(170),
              borderRadius: normalize(10),
            }}
          />
        )}
        <View
          style={[
            {position: 'absolute', bottom: 10},
            lang === 'ar' ? styles.moveRight : styles.moveLeft,
          ]}>
          <View
            style={{
              display: 'flex',
              flexDirection: flexDirection,
              bottom: normalize(5),
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: normalize(24),
                textAlign: textAlign,
              }}>
              {className}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: flexDirection,
              // bottom: normalize(10),
            }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: normalize(14),
                fontSize: normalize(10),
                paddingHorizontal: normalize(7),
                paddingVertical: normalize(2),
              }}>
              <Text>
                {/* {class_schedules
                  ? moment(class_schedules[0].start_time, 'h:mm:ss').format(
                      'h:mm A',
                    )
                  : ''} */}

                {moment(upcoming[0].start_time, 'h:mm:ss').format('h:mm A')}
              </Text>
            </View>
            {distance ? (
              <View
                style={{
                  backgroundColor: '#ffffff',
                  left: normalize(10),
                  borderRadius: normalize(14),
                  fontSize: normalize(10),
                  paddingHorizontal: normalize(7),
                  paddingVertical: normalize(2),
                }}>
                <Text>
                  {distance >= 1
                    ? `${distance.toFixed(2)} km`
                    : `${distance.toFixed(3) * 1000} m`}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  handleNavigateNearestGym = (e, id) => {
    e.preventDefault();
    this.props.navigation.navigate({
      routeName: 'Gym',
      params: {
        id: id,
      },
      key: `GymNearest_${Math.random() * 10000}`,
    });
  };

  renderItemGym = ({item}) => {
    const lang = this.props?.setting?.lang;
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const {id, name, name_ar, attachments, distance} = item;
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
        onPress={e => this.handleNavigateNearestGym(e, id)}
        style={{
          width: normalize(234),
          marginRight: normalize(10),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}],
          height: normalize(155),
        }}>
        <View
          style={{
            width: normalize(234),
            height: normalize(128),
            display: 'flex',
          }}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(234),
                height: normalize(128),
                borderRadius: normalize(10),
              }}
              source={{
                uri: image.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image
              resizeMode={'cover'}
              source={image}
              style={{
                width: normalize(234),
                height: normalize(128),
                borderRadius: normalize(10),
              }}
            />
          )}
          {distance ? (
            <View
              style={[
                {position: 'absolute', bottom: normalize(10)},
                lang === 'ar' ? styles.moveRight : styles.moveLeft,
              ]}>
              <View
                style={{
                  backgroundColor: '#ffffff',

                  borderRadius: normalize(14),
                  fontSize: normalize(10),
                  paddingHorizontal: normalize(7),
                  paddingVertical: normalize(2),
                }}>
                <Text>
                  {distance >= 1
                    ? `${distance.toFixed(2)} km`
                    : `${distance.toFixed(3) * 1000} m`}
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
    );
  };

  handleNavigateCategoryClass = (e, id, categoryName) => {
    e.preventDefault();
    this.props.navigation.navigate('CategoryClass', {
      id: id,
      categoryName: categoryName,
    });
  };
  renderItemCategory = ({item}) => {
    const {name, name_ar, attachment, id} = item;
    const lang = this.props?.setting?.lang;
    const textAlign = lang === 'ar' ? 'right' : 'left';
    let image;
    if (attachment) {
      image = {
        uri: `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`,
      };
    } else {
      image = require('../../assets/img/no_image_found.png');
    }

    let categoryName = lang === 'ar' ? name_ar : name;

    return (
      <TouchableOpacity
        onPress={e => this.handleNavigateCategoryClass(e, id, categoryName)}
        style={{
          width: normalize(118),
          marginRight: normalize(10),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}],
          height: normalize(186),
        }}>
        {image.url ? (
          <FastImage
            style={{
              width: normalize(117),
              height: normalize(118),
              borderRadius: normalize(10),
            }}
            source={{
              uri: image.url,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image
            resizeMode={'cover'}
            source={image}
            style={{
              width: normalize(117),
              height: normalize(118),
              borderRadius: normalize(10),
            }}
          />
        )}
        <View style={{marginTop: normalize(5)}}>
          <Text
            style={{
              fontSize: normalize(15),
              textAlign: textAlign,
            }}>
            {lang === 'ar' ? name_ar : name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  handleRefresh = async () => {
    this.setState({refreshing: true});
    let user_id = await AsyncStorage.getItem('user_id');

    this.props.getTodayClasses();
    this.props.getGymsRefresh();
    this.props.getRecommendedGyms();
    this.props.getRecommendedClasses();
    this.props.getCategories();
    if (user_id) {
      this.props.getWhatsOnToday(parseInt(user_id));
    }

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
  };
  render() {
    const {isLoading, refreshing} = this.state;
    const lang = this.props?.setting?.lang;
    const {categories, nearestGyms, todayClasses} = this.props.home;
    const {upcomingClassCount, completedClassCount} = this.props.subscription;
    let newGyms = nearestGyms;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';

    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.handleRefresh}
                />
              }>
              <View
                style={{
                  marginHorizontal: normalize(16),
                  justifyContent: 'center',
                  marginTop: normalize(16),
                }}>
                <Text
                  style={{
                    fontSize: normalize(30),
                    fontWeight: 'bold',
                    alignSelf: alignSelf,
                  }}>
                  {I18n.t('welcomeToClasstap', {locale: lang})}
                </Text>
              </View>
              {!isEmpty(this.props.auth.user) ? (
                <View
                  style={[
                    styles.eventContainer,
                    {flexDirection: flexDirection},
                  ]}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Upcoming')}
                    style={[
                      styles.eventButtonContainer,
                      {flexDirection: flexDirection},
                    ]}>
                    <ClockIcon width={normalize(18)} height={normalize(18)} />
                    <Text style={styles.eventButtonText}>
                      {upcomingClassCount} {I18n.t('upcoming', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Completed')}
                    style={[
                      styles.eventButtonContainer,
                      {flexDirection: flexDirection},
                    ]}>
                    <CheckCircleIcon
                      width={normalize(18)}
                      height={normalize(18)}
                    />
                    <Text style={styles.eventButtonText}>
                      {completedClassCount}{' '}
                      {I18n.t('completed', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {/* Start What on today  */}

              <View
                style={{
                  marginTop: normalize(15),
                  height: normalize(195),
                }}>
                <View
                  style={{
                    marginHorizontal: normalize(16),
                    marginBottom: normalize(12),
                    height: normalize(24),
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(20),
                      fontWeight: 'bold',
                      textAlign: textAlign,
                    }}>
                    {I18n.t('whatOnToday', {locale: lang})}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: flexDirection,
                    marginLeft: normalize(16),
                  }}>
                  {todayClasses.length > 0 ? (
                    <FlatList
                      horizontal={true}
                      style={styles.container}
                      data={todayClasses}
                      renderItem={this.renderItem}
                      keyExtractor={item => item.id.toString()}
                    />
                  ) : (
                    <View
                      style={{
                        width: normalize(342),
                        height: normalize(170),
                        marginRight: normalize(10),
                        transform: [
                          {rotateY: lang === 'ar' ? '180deg' : '0deg'},
                        ],
                        borderRadius: normalize(10),
                        backgroundColor: '#efefef',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: normalize(20), color: '#8f8f8f'}}>
                        {I18n.t('noClassesOnToday', {locale: lang})}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* End What on today  */}

              {/* Start where nearest gym  */}
              <View
                style={{
                  marginTop: normalize(15),
                  height: normalize(186),
                }}>
                <View
                  style={{
                    marginHorizontal: normalize(16),
                    marginBottom: normalize(12),
                    height: normalize(24),
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(20),
                      fontWeight: 'bold',
                      textAlign: textAlign,
                    }}>
                    {I18n.t('WhereNearestGym', {locale: lang})}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: flexDirection,
                    marginLeft: normalize(16),
                  }}>
                  {newGyms.length > 0 ? (
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      style={styles.container}
                      data={newGyms}
                      renderItem={this.renderItemGym}
                      keyExtractor={item => item.id.toString()}
                    />
                  ) : (
                    <View
                      style={{
                        width: normalize(234),
                        marginRight: normalize(10),
                        transform: [
                          {rotateY: lang === 'ar' ? '180deg' : '0deg'},
                        ],
                        height: normalize(150),
                        borderRadius: normalize(10),
                        backgroundColor: '#efefef',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: normalize(20), color: '#8f8f8f'}}>
                        {I18n.t('noNearestGyms', {locale: lang})}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* End where nearest gym  */}

              {/* Start top category  */}

              <View
                style={{
                  marginTop: normalize(15),
                  height: normalize(186),
                  marginBottom: normalize(15),
                }}>
                <View
                  style={{
                    marginBottom: normalize(12),
                    height: normalize(24),
                    marginHorizontal: normalize(16),
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(20),
                      fontWeight: 'bold',
                      textAlign: textAlign,
                    }}>
                    {I18n.t('topCategory', {locale: lang})}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: flexDirection,
                    marginLeft: normalize(16),
                  }}>
                  {categories.length > 0 ? (
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      style={styles.container}
                      data={categories}
                      renderItem={this.renderItemCategory}
                      keyExtractor={item => item.id.toString()}
                    />
                  ) : (
                    <View
                      style={{
                        width: normalize(118),
                        marginRight: normalize(10),
                        transform: [
                          {rotateY: lang === 'ar' ? '180deg' : '0deg'},
                        ],
                        height: normalize(186),
                        borderRadius: normalize(10),
                        backgroundColor: '#efefef',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: normalize(15), color: '#8f8f8f'}}>
                        {I18n.t('noCategories', {locale: lang})}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {/* End top category  */}
              <View
                style={{
                  marginTop: normalize(35),
                }}
              />
            </ScrollView>
          </SafeAreaView>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventButtonContainer: {
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: normalize(14),
    display: 'flex',
    flexDirection: 'row',
    height: normalize(27),
    justifyContent: 'center',
    width: normalize(164),
  },
  eventButtonText: {
    color: '#22242A',
    fontSize: normalize(13),
    marginHorizontal: normalize(6),
  },
  eventContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: normalize(16),
    marginTop: normalize(12),
  },
  moveLeft: {
    left: normalize(10),
  },
  moveRight: {
    right: normalize(10),
  },
});

const mapStateToProps = state => {
  console.log('state', state);
  return {
    auth: state.auth,
    home: state.home,
    setting: state.setting,
    subscription: state.subscription,
    errors: state.errors,
  };
};

export default connect(mapStateToProps, {
  getGyms,
  getCategories,
  getGymsLocation,
  getRecommendedGyms,
  getRecommendedClasses,
  getWhatsOnToday,
  updateUserDeviceToken,
  getTodayClasses,
  getGymsRefresh,
})(Home);
