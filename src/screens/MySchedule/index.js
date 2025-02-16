import FastImage from '@d11/react-native-fast-image';
import axios from 'axios';
import moment from 'moment-timezone';
import {Container} from 'native-base';
import React, {Component} from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {currentUser} from '../../actions/authActions';
import {
  getUpcomingClasses,
  getWhatsOnToday,
} from '../../actions/subscriptionActions';
import HeaderComponent from '../../components/Header';
import {API_URI, IMAGE_URI} from '../../utils/config';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import Loading from '../Loading';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';
moment.tz.setDefault('Asia/Qatar');

export class MySchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myScheduleClasses: [],
      isLoading: true,
    };
  }

  handleData = async () => {
    const {id} = await this.props.auth.user;
    let url = `${API_URI}/my_schedule?filter={"where": {"user_id": ${id},"is_cancel":false}}`;
    await axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data;

          this.setState({myScheduleClasses: data, isLoading: false});
          return true;
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
      });
  };

  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.MY_SCHEDULE_SCREEN);
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.handleData();
    });

    handleData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async () => {
    this.props.navigation.goBack();
    return true;
  };

  /* componentDidMount() {
    this.props.getUpcomingClasses();
  } */

  handleCancelClass = async (e, id, item) => {
    e.preventDefault();
    const {lang} = this.props.setting;
    const {schedule_date, class_schedule} = item;

    const refundParams = {
      refundTime: '',
      refundPercents: '',
    };

    await axios
      .get(`${API_URI}/settings`)
      .then(data => {
        const percent = data.data.data.find(
          item => item.type === 'refund_percent',
        );
        const time = data.data.data.find(item => item.type === 'refund_time');

        refundParams.refundTime = time.value;
        refundParams.refundPercents = percent.value;
      })
      .catch(err => {
        console.log(err);
      });

    let classDate = `${schedule_date.date}T${schedule_date.start_time}`;
    classDate = new Date(classDate).getTime();
    let date = moment().utcOffset('+03:00').format('YYYY-MM-DD[T]HH:mm:ss');
    let currentTime = new Date(date).getTime();
    let remainTimestamp = classDate - currentTime;
    let hours = (remainTimestamp / 1000 / 60 / 60).toString();

    let message;
    if (hours <= 0.5) {
      message = I18n.t('cancelledClassesWithin1Hour', {locale: lang});
    } else {
      message = I18n.t('areYouSureWantToCancelThisClass', {locale: lang});
    }

    message = message
      .replace('X', `${refundParams.refundTime}`)
      .replace('Y', `${refundParams.refundPercents}`);

    Alert.alert(
      I18n.t('cancel', {locale: lang}),
      message,
      [
        {
          text: I18n.t('no', {locale: lang}),
          onPress: () => console.log('come'),
          style: 'cancel',
        },
        {
          text: I18n.t('yes', {locale: lang}),
          onPress: async () => {
            let url = `${API_URI}/booking_classes/${id}`;
            let updateData = {
              is_cancel: 1,
              hours: hours,
            };
            await axios
              .put(url, updateData)
              .then(res => {
                if (res.data.error.code) {
                } else {
                  const {data} = res.data;
                  this.props.getWhatsOnToday(this.props.auth.user.id);
                  this.props.currentUser();
                  let myScheduleClasses = [...this.state.myScheduleClasses];
                  myScheduleClasses = myScheduleClasses.filter(
                    bookClass => bookClass.id !== id,
                  );
                  this.setState({myScheduleClasses});
                  return true;
                }
              })
              .catch(err => {
                // this.setState({isLoading: false});
              });
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  handleNavigateMyScheduleClass = (e, id) => {
    e.preventDefault();
    this.props.navigation.navigate({
      routeName: 'BookClass',
      params: {
        id: id,
      },
      key: `MyScheduleClass_${Math.random() * 10000}`,
    });
  };

  renderItem = ({item}) => {
    const {id, class: gymClass, class_schedule, schedule_date} = item;
    const {name, name_ar, gym, start_date, start_time, attachments} = gymClass;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
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
        onPress={e => this.handleNavigateMyScheduleClass(e, id)}
        style={{
          flex: 1,
          flexDirection: flexDirection,
          marginBottom: normalize(16),
        }}>
        <View style={{display: 'flex', width: normalize(60)}}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(60),
                height: normalize(60),
                borderRadius: normalize(10),
              }}
              source={{
                uri: image.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <Image
              //resizeMode={'stretch'}
              source={image}
              style={{
                width: normalize(60),
                height: normalize(60),
                borderRadius: normalize(10),
              }}
            />
          )}
        </View>

        <View
          style={{
            display: 'flex',
            //flexDirection: 'row',
            width: normalize(190),
            marginHorizontal: normalize(20),
            //justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: normalize(17),
              fontWeight: '700',
              textAlign: textAlign,
            }}>
            {lang === 'ar' ? name_ar : name}
          </Text>
          <Text
            style={{
              fontSize: normalize(12),
              color: '#8A8A8F',
              textAlign: textAlign,
            }}>
            {lang === 'ar' ? gym.name_ar : gym.name}
          </Text>
          <Text
            style={{
              fontSize: normalize(13),
              color: '#8A8A8F',
              textAlign: textAlign,
            }}>
            {`${moment(schedule_date.date, 'YYYY-MM-DD').calendar(null, {
              sameDay: '[Today]',
              nextDay: '[Tomorrow]',
              nextWeek: 'dddd',
              lastDay: '[Yesterday]',
              //lastWeek: '[Last] dddd',
              sameElse: 'DD MMM YYYY',
            })} ${moment(schedule_date.start_time, 'h:mm:ss').format(
              'h:mm A',
            )} - ${class_schedule.duration} min`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={e => this.handleCancelClass(e, id, item)}
          style={{
            flex: 1,
            //width: normalize(73),
            height: normalize(32),
            borderWidth: 1,
            borderColor: '#CFCFCF',
            borderRadius: normalize(4),
            justifyContent: 'center',
            alignItems: 'center',
            //marginRight: Platform.OS === 'ios' ? normalize(4) : 0,
            //marginLeft: Platform.OS === 'ios' ? normalize(4) : 0,
          }}>
          <Text style={{fontSize: normalize(14), color: '#8A8A8F'}}>
            {I18n.t('cancel', {
              locale: lang,
            })}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  render() {
    const {lang} = this.props.setting;
    const {myScheduleClasses, isLoading} = this.state;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <Container style={{flex: 1, backgroundColor: '#ffffff'}}>
            <HeaderComponent navigation={this.props.navigation} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{backgroundColor: '#ffffff'}}>
              <View
                style={{
                  height: normalize(50),
                  marginHorizontal: normalize(16),
                  justifyContent: 'center',
                  //flexDirection: flexDirection,
                }}>
                <Text
                  style={{
                    fontSize: normalize(40),
                    fontWeight: 'bold',
                    alignSelf: alignSelf,
                  }}>
                  {`${I18n.t('mySchedule', {
                    locale: lang,
                  })}`}
                </Text>
              </View>

              <View
                style={{
                  marginTop: normalize(24),
                  marginHorizontal: normalize(16),
                }}>
                {myScheduleClasses.length > 0 ? (
                  <FlatList
                    style={styles.container}
                    data={myScheduleClasses}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                  />
                ) : (
                  <View>
                    <Text
                      style={{
                        color: '#8f8f8f',
                        fontSize: normalize(16),
                        textAlign: textAlign,
                      }}>
                      {I18n.t('noScheduledClasses', {locale: lang})}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </Container>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: normalize(16),
    marginTop: normalize(12),
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  subscription: state.subscription,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getUpcomingClasses,
  getWhatsOnToday,
  currentUser,
})(MySchedule);
