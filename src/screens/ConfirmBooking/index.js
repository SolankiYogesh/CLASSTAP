import React, {Component} from 'react';
import {
  Text,
  View,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {connect} from 'react-redux';
import normalize from 'react-native-normalize';
import {clearErrors} from '../../actions/errorAction';
import {
  addBookingClass,
  getWhatsOnToday,
  getUpcomingClasses,
  getCompletedClasses,
} from '../../actions/subscriptionActions';
import {currentUser} from '../../actions/authActions';
import isEmpty from '../../validation/is-empty';
import {IMAGE_URI, API_URI} from '../../utils/config';
import axios from 'axios';
const {height} = Dimensions.get('window');

import I18n from '../../utils/i18n';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Qatar');
import PaymentWeb from '../../components/PaymentWeb';
import Toast from 'react-native-toast-notifications';
export class ConfirmBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session_id: 0,
      credits: 0,
      errors: '',
      isFullClass: false,
      selectedDates: {},
      selectedScheduleIds: [],
      totalCredits: 0,
      isShowPaymentWeb: false,
      onPress: false,
    };
  }
  UpdateRating(key) {
    this.setState({rating: key});
  }

  buyMoreCredits = (needsCredits, userCredits) => {
    const {lang} = this.props.setting;

    const addData = {
      credits: needsCredits - userCredits,
      class_schedule_id: this.state.session_id,
    };

    axios
      .post(`${API_URI}/payments/buy_credits`, addData)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data, payment_url} = res.data;
          this.setState({
            isShowPaymentWeb: true,
            data: data,
            url: payment_url,
            title: '',
            isLoading: false,
          });
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          this.setState({
            isLoading: false,
          });
        }
        if (err.response.data.error.message === 'Subscription expired') {
          Alert.alert(
            I18n.t('updateSubscription', {locale: lang}),
            '',
            [
              {
                text: I18n.t('no', {locale: lang}),
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: I18n.t('yes', {locale: lang}),
                onPress: () => this.props.navigation.navigate('Membership'),
              },
            ],
            {
              cancelable: false,
            },
          );
        }
      });
  };

  handlePaymentWeb = async (status = '') => {
    const {lang} = this.props.setting;
    if (status === 'success') {
      this.setState({
        isShowPaymentWeb: false,
        isLoading: true,
      });

      setTimeout(async () => {
        this.props.onRefresh();
        await this.props.currentUser();
      }, 1000);

      setTimeout(() => {
        this.handleBooking();
      }, 2000);

      this.setState(
        {
          isShowPaymentSuccess: !this.state.isShowPaymentSuccess,
          isLoading: false,
        },
        () => {
          this.props.handleClassSuccessConfirm();
        },
      );
    } else if (status === 'failed') {
      toast.show(I18n.t('paymentFailed', {locale: this.props.setting.lang}), {
        type: 'danger',
        placement: 'bottom',
        duration: 2000,
        offset: 30,
        animationType: 'slide-in',
      });
      this.setState({
        isShowPaymentWeb: false,
        count: this.state.count + 1,
      });
    } else {
      this.setState({
        isShowPaymentWeb: false,
        count: this.state.count + 1,
        isLoading: false,
      });
    }

    setTimeout(() => {
      this.setState({
        isShowPaymentWeb: false,
        count: this.state.count + 1,
        isLoading: false,
        isShowPaymentSuccess: false,
      });
    }, 2500);
  };

  handleBooking = () => {
    this.setState(() => ({onPress: true}));
    const {lang} = this.props.setting;
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t('login', {locale: lang}),
        I18n.t('loginToProceed', {locale: lang}),
        [
          {
            text: I18n.t('no', {locale: lang}),
            onPress: () => this.setState(() => ({onPress: false})),
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
      const {session_id, totalCredits, selectedScheduleIds} = this.state;

      const {credits} = this.props;

      if (session_id) {
        if (selectedScheduleIds.length > 0) {
          this.setState({errors: ''});
          const {user} = this.props.auth;
          const {id, gym_id} = this.props.data;

          if (
            user.is_subscribed ||
            credits === 0 ||
            user.credits_balance >= 0
          ) {
            if (user.credits_balance >= credits) {
              const addData = {
                user_id: user.id,
                class_id: id,
                credits: credits,
                class_schedule_id: session_id,
                gym_id: gym_id,
                schedule_dates_id: selectedScheduleIds,
                class_start_time: this.props.start_time,
              };

              axios
                .post(`${API_URI}/booking_classes`, addData)
                .then(res => {
                  if (res.data.error.code) {
                    this.setState({errors: res.data.error.message});
                  } else {
                    const {data} = res.data;

                    this.props.handleConfirmBooking();

                    this.props.getWhatsOnToday(user.id);
                    this.props.currentUser();
                    this.setState({
                      session_id: 0,
                      credits: 0,
                      errors: '',
                      selectedDates: {},
                      selectedScheduleIds: [],
                    });
                    //this.props.navigation.navigate('Profile');
                    this.props.handleClassSuccessConfirm();
                    this.setState({onPress: false});
                  }
                })
                .catch(err => {
                  if (err.response.data.error) {
                    if (
                      err.response.data.error.message ===
                      'Your subscription validity is over'
                    ) {
                      Alert.alert(
                        I18n.t('message', {locale: lang}),
                        I18n.t('youCurrentlyDoNotHaveAMembership', {
                          locale: lang,
                        }),
                        [
                          {
                            text: I18n.t('no', {locale: lang}),
                            onPress: () => console.log('cancel'),
                            style: 'cancel',
                          },
                          {
                            text: I18n.t('yes', {locale: lang}),
                            onPress: () => {
                              this.props.handleConfirmBooking();
                              this.props.navigation.navigate('Membership', {
                                type: 'new',
                                class_id: id,
                                credits: credits,
                                class_schedule_id: session_id,
                                schedule_dates_id: selectedScheduleIds,
                                subscription_id: user.subscription_id,
                              });
                            },
                          },
                        ],
                        {
                          cancelable: false,
                        },
                      );
                      this.setState({onPress: false});
                    } else {
                      this.setState({onPress: false});
                      this.setState({
                        errors: err.response.data.error.message,
                      });
                    }
                  }
                });
            } else {
              Alert.alert(
                I18n.t('message', {locale: lang}),
                I18n.t('yourCreditsLow', {locale: lang}),
                [
                  {
                    text: I18n.t('no', {locale: lang}),
                    onPress: () => {
                      this.setState(() => ({onPress: false}));
                    },
                    style: 'cancel',
                  },
                  {
                    text: I18n.t('yes', {locale: lang}),
                    onPress: () => {
                      this.setState(() => ({onPress: false}));
                      this.props.handleConfirmBooking();
                      this.buyMoreCredits(credits, user.credits_balance);
                      // this.props.navigation.navigate('Membership', {
                      //   class_id: id,
                      //   credits: credits,
                      //   class_schedule_id: session_id,
                      //   schedule_dates_id: selectedScheduleIds,
                      //   subscription_id: user.subscription_id,
                      // });
                    },
                  },
                ],
                {
                  cancelable: false,
                },
              );
            }
          } else {
            this.props.handleConfirmBooking();
            this.props.navigation.navigate('Membership', {
              type: 'new',
              back: 'GymClass',
              back_id: id,
              class_id: id,
              credits: credits,
              class_schedule_id: session_id,
              schedule_dates_id: selectedScheduleIds,
              subscription_id: user.subscription_id,
            });
          }
        } else {
          this.setState({errors: I18n.t('selectDate', {locale: lang})});
          this.setState({onPress: false});
        }
      } else {
        this.setState({errors: I18n.t('selectSession', {locale: lang})});
        this.setState({onPress: false});
      }
    }
  };

  handleChangeText = (name, value) => {
    const errors = this.state.errors;

    if (errors[name]) {
      delete errors[name];

      //delete errors.common;
    }

    delete errors.common;
    this.props.clearErrors();
  };

  checkIfClassSchedulePresent = () => {
    const classesArr = [
      ...this.props.subscription.upcomingClasses,
      ...this.props.subscription.completedClasses,
    ];

    classesArr.forEach(classItem => {
      if (classItem.schedule_date.id === this.props.schedule_date_id) {
        this.setState(() => ({
          errors: I18n.t('alreadyBookedError', {
            locale: this.props.setting.lang,
            dateString: classItem.schedule_date.date,
          }),
        }));
      }
    });
  };

  componentDidMount() {
    this.checkIfClassSchedulePresent();
    getUpcomingClasses();
    getCompletedClasses();
    this.props.clearErrors();
    const {class_schedule_id, schedule_date_id, credits} = this.props;
    let selectedScheduleIds = [];
    selectedScheduleIds.push(schedule_date_id);
    this.setState({
      session_id: class_schedule_id,
      selectedScheduleIds: selectedScheduleIds,
      credits,
    });
    this.focusListener2 = this.props.navigation.addListener('didFocus', () => {
      let selectedScheduleIds = [];
      selectedScheduleIds.push(schedule_date_id);
      this.setState({
        session_id: class_schedule_id,
        selectedScheduleIds: selectedScheduleIds,
        credits,
      });
    });
  }

  componentDidUpdate = prevProps => {
    if (
      this.props.subscription.completedClasses?.length !==
        prevProps.subscription.completedClasses?.length ||
      this.props.subscription.upcomingClasses?.length !==
        prevProps.subscription.upcomingClasses?.length
    ) {
      this.checkIfClassSchedulePresent();
    }
    if (
      this.props.schedule_date_id !== prevProps.schedule_date_id ||
      this.props.class_schedule_id !== prevProps.class_schedule_id
    ) {
      getUpcomingClasses();
      getCompletedClasses();
      this.props.clearErrors();
      this.setState({errors: ''});
      const {class_schedule_id, schedule_date_id, credits} = this.props;
      let selectedScheduleIds = [];
      selectedScheduleIds.push(schedule_date_id);

      this.setState({
        session_id: class_schedule_id,
        selectedScheduleIds: selectedScheduleIds,
        credits,
      });
      this.focusListener2 = this.props.navigation.addListener(
        'didFocus',
        () => {
          let selectedScheduleIds = [];
          selectedScheduleIds.push(schedule_date_id);
          this.setState({
            session_id: class_schedule_id,
            selectedScheduleIds: selectedScheduleIds,
            credits,
          });
        },
      );
    }
  };

  componentWillUnmount() {
    this.props.clearErrors();
    this.focusListener2.remove();
  }
  handleSelectSession = id => {
    let selectedDates = {...this.state.selectedDates};
    const class_schedules = [...this.props.data.class_schedules];
    let schedule = class_schedules.find(
      class_schedule => class_schedule.id === id,
    );

    const {start_date, end_date} = this.props.data;
    let today = new Date().getTime();
    let todayTime = moment(today).format('YYYY-MM-DD');
    let todayTimestamp = new Date(todayTime).getTime();
    let startTime = new Date(start_date).getTime(),
      endTime = new Date(end_date).getTime();

    for (loopTime = startTime; loopTime <= endTime; loopTime += 86400000) {
      var loopDay = new Date(loopTime);
      let scheduleDate = schedule.schedule_dates.filter(
        schedule_date =>
          new Date(schedule_date.date).getTime() === loopDay.getTime(),
      );
      let eDate = moment(loopTime).format('YYYY-MM-DD');
      if (!isEmpty(scheduleDate)) {
        if (todayTimestamp > loopTime) {
          selectedDates[eDate.toString()] = {
            disabled: true,
            disableTouchEvent: true,
          };
        } else {
          delete selectedDates[eDate.toString()];
        }
      } else {
        selectedDates[eDate.toString()] = {
          disabled: true,
          disableTouchEvent: true,
        };
      }
    }
    this.setState({
      session_id: id,
      credits: schedule ? schedule.credits : 0,
      errors: '',
      selectedDates,
    });
  };

  handleIsFullClass = () => {
    let selectedScheduleIds = [];
    const selectedDates = {...this.state.selectedDates};
    const class_schedules = [...this.props.data.class_schedules];
    let schedule = class_schedules.find(
      class_schedule => class_schedule.id === this.state.session_id,
    );
    if (!this.state.isFullClass) {
      schedule.schedule_dates.map(schedule_date => {
        if (selectedDates[schedule_date.date]) {
          delete selectedDates[schedule_date.date];
        }
        selectedScheduleIds.push(schedule_date.id);
      });
    } else {
      schedule.schedule_dates.map(schedule_date => {
        if (selectedDates[schedule_date.date]) {
          delete selectedDates[schedule_date.date];
        }
      });
    }
    const totalCredits = selectedScheduleIds.length * this.state.credits;
    this.setState({
      isFullClass: !this.state.isFullClass,
      selectedDates,
      totalCredits,
      selectedScheduleIds,
      errors: '',
    });
  };
  handleSelectDay = dateData => {
    const class_schedules = [...this.props.data.class_schedules];
    let schedule = class_schedules.find(
      class_schedule => class_schedule.id === this.state.session_id,
    );
    let scheduleDate = schedule.schedule_dates.find(
      schedule_date => schedule_date.date === dateData.dateString,
    );
    let selectedDates = {...this.state.selectedDates};
    let selectedScheduleIds = [...this.state.selectedScheduleIds];
    if (!isEmpty(selectedDates[dateData.dateString])) {
      if (!selectedDates[dateData.dateString].disabled) {
        delete selectedDates[dateData.dateString];
        if (!isEmpty(scheduleDate)) {
          selectedScheduleIds = selectedScheduleIds.filter(
            id => id !== scheduleDate.id,
          );
        }
      }
    } else {
      if (!isEmpty(scheduleDate)) {
        selectedScheduleIds = [scheduleDate.id];
        //selectedScheduleIds.push(scheduleDate.id);
      }
      selectedDates = {};
      //let selectedDates = {...this.state.selectedDates};
      const class_schedules = [...this.props.data.class_schedules];
      let schedule = class_schedules.find(
        class_schedule => class_schedule.id === this.state.session_id,
      );
      const {start_date, end_date} = this.props.data;
      let today = new Date().getTime();
      let todayTime = moment(today).format('YYYY-MM-DD');
      let todayTimestamp = new Date(todayTime).getTime();
      let startTime = new Date(start_date).getTime(),
        endTime = new Date(end_date).getTime();
      for (loopTime = startTime; loopTime <= endTime; loopTime += 86400000) {
        var loopDay = new Date(loopTime);
        let scheduleDate = schedule.schedule_dates.filter(
          schedule_date =>
            new Date(schedule_date.date).getTime() === loopDay.getTime(),
        );
        let eDate = moment(loopTime).format('YYYY-MM-DD');
        if (!isEmpty(scheduleDate)) {
          if (todayTimestamp > loopTime) {
            selectedDates[eDate.toString()] = {
              disabled: true,
              disableTouchEvent: true,
            };
          } else {
            delete selectedDates[eDate.toString()];
          }
        } else {
          selectedDates[eDate.toString()] = {
            disabled: true,
            disableTouchEvent: true,
          };
        }
      }

      selectedDates[dateData.dateString] = {
        selected: true,
        selectedColor: 'green',
      };
    }

    const totalCredits = selectedScheduleIds.length * this.state.credits;

    this.setState({
      selectedDates,
      selectedScheduleIds,
      totalCredits,
      errors: '',
    });
  };
  render() {
    const {
      isFullClass,
      selectedDates,
      selectedScheduleIds,
      session_id,
      totalCredits,
    } = this.state;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    let {
      id,
      name,
      name_ar,
      credits,
      gym,
      attachments,
      start_date,
      end_date,
      start_time,
      end_time,
      class_schedules,
    } = this.props.data;
    class_schedules = class_schedules.sort((a, b) =>
      a.start_time < b.start_time ? -1 : a.start_time > b.start_time ? 1 : 0,
    );

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
    const {user} = this.props.auth;
    return (
      <>
        <Modal
          visible={this.props.isShowConfirmBooking}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            this.props.handleConfirmBooking();
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.handleConfirmBooking();
            }}
            style={{
              height: height - normalize(460),
              backgroundColor: 'rgba(34, 36, 42, 0.2)',
            }}
          />
          <View style={[styles.modalContent]}>
            <View style={{alignItems: 'center'}}>
              <View style={{marginTop: normalize(6), alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: normalize(24),
                    fontWeight: 'bold',
                    color: '#FE9800',
                  }}>
                  {!isEmpty(user.credits_balance) ? user.credits_balance : 0}
                </Text>
                <Text
                  style={{
                    fontSize: normalize(16),
                    color: '#FE9800',
                  }}>
                  {I18n.t('availableCredits', {locale: lang})}
                </Text>
              </View>
              <View style={{marginTop: normalize(10)}}>
                {image.url ? (
                  <FastImage
                    style={{
                      width: normalize(94),
                      height: normalize(94),
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
                      width: normalize(94),
                      height: normalize(94),
                      borderRadius: normalize(10),
                    }}
                  />
                )}
              </View>
              <View style={{marginTop: normalize(6)}}>
                <Text style={{fontSize: normalize(20), fontWeight: 'bold'}}>
                  {!isEmpty(name) ? (lang === 'ar' ? name_ar : name) : ''}
                </Text>
              </View>

              <View style={{marginTop: normalize(4)}}>
                <Text style={{fontSize: normalize(14), color: '#8A8A8F'}}>
                  {!isEmpty(gym.name)
                    ? lang === 'ar'
                      ? gym.name_ar
                      : gym.name
                    : ''}
                </Text>
              </View>
              <View style={{marginTop: normalize(16)}}>
                <Text style={{fontSize: normalize(16)}}>
                  {`${moment(this.props.date, 'YYYY-MM-DD').format(
                    'D MMM YYYY',
                  )}`}
                </Text>
              </View>
              <View>
                <Text style={{fontSize: normalize(16)}}>
                  {`${moment(this.props.start_time, 'h:mm:ss').format(
                    'h:mm A',
                  )} - ${moment(this.props.end_time, 'h:mm:ss').format(
                    'h:mm A',
                  )}`}
                </Text>
              </View>

              {this.state.errors ? (
                <Text style={{fontSize: normalize(12), color: 'red'}}>
                  {this.state.errors}
                </Text>
              ) : null}

              <View style={{marginTop: normalize(16), alignItems: 'center'}}>
                {!isEmpty(this.props.credits) && this.props.credits > 0 ? (
                  <>
                    <Text
                      style={{
                        fontSize: normalize(24),
                        fontWeight: 'bold',
                        color: '#0053FE',
                      }}>
                      {!isEmpty(this.props.credits) ? this.props.credits : 0}
                    </Text>
                    <Text
                      style={{
                        fontSize: normalize(16),
                        color: '#0053FE',
                      }}>
                      {I18n.t('credits', {locale: lang})}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={{
                      fontSize: normalize(24),
                      fontWeight: 'bold',
                      color: '#0053FE',
                    }}>
                    {I18n.t('free', {locale: lang})}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                disabled={this.state.onPress || this.state.errors}
                onPress={this.handleBooking}
                style={{
                  marginTop: normalize(16),
                  marginHorizontal: normalize(32),
                  width: normalize(310),
                  height: normalize(48),
                  backgroundColor: '#FE9800',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: normalize(24),
                  marginBottom: normalize(50),
                  opacity: this.state.onPress || this.state.errors ? 0.1 : 1,
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: normalize(16),
                    fontWeight: 'bold',
                  }}>
                  {I18n.t('confirmMyReservation', {locale: lang})}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Toast ref={ref => (global['toast'] = ref)} />
        {this.state.data &&
          this.state.data.access_code &&
          this.state.isShowPaymentWeb && (
            <PaymentWeb
              isShowPaymentWeb={this.state.isShowPaymentWeb}
              handlePaymentWeb={this.handlePaymentWeb}
              navigation={this.props.navigation}
              url={this.state.url}
              data={this.state.data}
              language={lang}
            />
          )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    fontSize: normalize(12),
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: normalize(460),
    backgroundColor: '#ffffff',
    //justifyContent: 'center',
    alignItems: 'center',
  },
  pickerAndroid: {
    //marginVertical: normalize(20),
    //marginLeft: normalize(94),
    //marginRight: normalize(94),
    height: normalize(30),
    width: normalize(225),
    borderBottomWidth: 0,
    backgroundColor: '#cfcfcf',
  },
  pickerIos: {
    marginLeft: normalize(80),
    marginRight: normalize(80),
    //width: normalize(225),
    borderBottomWidth: 0,
    backgroundColor: '#cfcfcf',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
  subscription: state.subscription,
});

export default connect(mapStateToProps, {
  clearErrors,
  addBookingClass,
  getWhatsOnToday,
  currentUser,
  getCompletedClasses,
  getUpcomingClasses,
})(ConfirmBooking);
