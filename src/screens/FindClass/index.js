import FastImage from '@d11/react-native-fast-image';
import moment from 'moment-timezone';
import {Icon, Input} from 'native-base';
import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
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
import RangeSlider from 'rn-range-slider';

import {clearErrors} from '../../actions/errorAction';
import {
  getFilterFindClassesNew,
  getFindClasses,
  getPopularGyms,
  getSearchFindClasses,
} from '../../actions/findClassActions';
import FilterIcon from '../../assets/img/filter.svg';
import FilterSearchIcon from '../../assets/img/filter_search.svg';
import MapIcon from '../../assets/img/map.svg';
import CalendarStrip from '../../react-native-slideable-calendar-strip';
import {IMAGE_URI} from '../../utils/config';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import ReviewShow from '../Review/ReviewShow';
moment.tz.setDefault('Asia/Qatar');
import ConfirmBooking from '../ConfirmBooking';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

const {width} = Dimensions.get('window');

class FindClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      selectedDate: new Date(),
      rangeLow: 18000000,
      rangeHigh: 75600000,
      start_time: moment.utc(18000000).format('HH:mm:ss'),
      end_time: moment.utc(75600000).format('HH:mm:ss'),
      class: {},
      isShowConfirmBooking: false,
      category_id: [],
      category_type_id: [],
      creditRangeHigh: '',
      creditRangeLow: '',
      gender_id: [],
      refreshing: false,
    };
  }
  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.FIND_CLASS_SCREEN);
    let {selectedDate, start_time, end_time, search} = this.state;
    let date = selectedDate;

    date = new Date(date);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    this.props.getFindClasses(dateString, start_time, end_time, search);
    this.props.getPopularGyms();
    //this.props.getFindClasses();
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.focusListener2 = this.props.navigation.addListener('focus', () => {
      this.props.getPopularGyms();
      const {
        selectedDate,
        start_time,
        end_time,
        category_id,
        category_type_id,
        creditRangeHigh,
        creditRangeLow,
        gender_id,
      } = this.state;
      let date1 = new Date(selectedDate);
      let date = new Date(date1.getTime() - date1.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      let filter;
      let whereFilter = '';
      let inClass = '';
      let inClassCategory = '';
      if (!isEmpty(gender_id)) {
        inClass = `"inClass":{"is_active": 1,"gender_id":{"$in":[${gender_id}]} }`;
      }

      if (
        !isEmpty(date) &&
        !isEmpty(start_time) &&
        !isEmpty(end_time) &&
        !isEmpty(category_type_id) &&
        !isEmpty(creditRangeLow) &&
        !isEmpty(creditRangeHigh)
      ) {
        whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}],"is_virtual":{"$in":[${category_type_id}]}},"inScheduleDates": { "date": "${date}" }`;
      } else if (
        !isEmpty(date) &&
        !isEmpty(start_time) &&
        !isEmpty(end_time) &&
        !isEmpty(creditRangeLow) &&
        !isEmpty(creditRangeHigh)
      ) {
        whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}]},"inScheduleDates": { "date": "${date}" }`;
      } else if (!isEmpty(date) && !isEmpty(start_time) && !isEmpty(end_time)) {
        whereFilter = `"inClassSchedule": {"$and":[{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},"inScheduleDates":{"date":"${date}"}`;
      } else if (
        !isEmpty(category_type_id) &&
        !isEmpty(creditRangeLow) &&
        !isEmpty(creditRangeHigh)
      ) {
        whereFilter = `"inClassSchedule":{"credits":{"$between":[${creditRangeLow},${creditRangeHigh}]},"is_virtual":{"$in":[${category_type_id}]}}`;
      } else if (!isEmpty(date)) {
        whereFilter = `"inScheduleDates":{"date":"${date}"}`;
      }

      if (!isEmpty(category_id)) {
        inClassCategory = `"inClassCategory": {"category_id": {"$in":[${category_id}]}}`;
      }

      if (
        !isEmpty(inClass) &&
        !isEmpty(inClassCategory) &&
        !isEmpty(whereFilter)
      ) {
        filter = `{${inClass},${whereFilter},${inClassCategory}}`;
      } else if (!isEmpty(inClass) && !isEmpty(whereFilter)) {
        filter = `{${inClass},${whereFilter}}`;
      } else if (!isEmpty(inClassCategory) && !isEmpty(whereFilter)) {
        filter = `{"inClass":{"is_active": 1},${whereFilter},${inClassCategory}}`;
      } else if (!isEmpty(whereFilter)) {
        filter = `{"inClass":{"is_active": 1},${whereFilter}}`;
      } else {
        filter = `{"inClass":{"is_active": 1}}`;
      }
      this.props.getFilterFindClassesNew(filter);
      /* const {start_time, end_time, search, selectedDate} = this.state;
      let date = selectedDate;

      date = new Date(date);
      let dateString = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split('T')[0];
      this.props.getFindClasses(dateString, start_time, end_time, search); */
    });
  }
  onGoBack = data => {
    const {
      category_id,
      category_type_id,
      creditRangeHigh,
      creditRangeLow,
      gender_id,
      end_time,
      selectedDate,
      start_time,
      rangeLow,
      rangeHigh,
    } = data;
    this.setState({
      category_id,
      category_type_id,
      creditRangeHigh,
      creditRangeLow,
      gender_id,
      end_time,
      selectedDate,
      start_time,
      rangeLow,
      rangeHigh,
    });
  };

  handleBack = async () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  componentWillUnmount() {
    if (this.back?.remove) {
      this.back?.remove();
    }
    this.focusListener2();
  }
  searchSubmit = e => {
    e.preventDefault();
    const {search, start_time, end_time, selectedDate} = this.state;
    let date = new Date(selectedDate);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    if (selectedDate) {
      this.props.getSearchFindClasses(search, dateString, start_time, end_time);
    } else {
      this.props.getSearchFindClasses(search);
    }
  };
  handleChangeText = (name, value) => {
    this.props.clearErrors();
    this.setState({[name]: value});
  };

  renderItemGym = ({item}) => {
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
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
        onPress={() =>
          this.props.navigation.navigate('Gym', {id, back: 'Favorities'})
        }
        style={{
          width: normalize(120),
          marginRight: normalize(10),
          height: normalize(163),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}],
        }}>
        <View
          style={{
            width: normalize(120),
            height: normalize(118),
            //borderRadius: 10,
          }}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(120),
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
                width: normalize(120),
                height: normalize(118),
                borderRadius: normalize(10),
              }}
            />
          )}
        </View>
        <View style={{marginTop: normalize(8)}}>
          <Text style={{fontSize: normalize(13), textAlign: textAlign}}>
            {lang === 'ar'
              ? name_ar.length > 18
                ? `${name.substring(0, 18)}...`
                : name_ar
              : name.length > 18
                ? `${name.substring(0, 18)}...`
                : name}
          </Text>
          <View
            style={[
              styles.classRatingContainer,
              {flexDirection: flexDirection, marginTop: normalize(5)},
            ]}>
            <ReviewShow
              rating={item.rating_avg}
              style={{
                fontSize: normalize(13),
                paddingRight: normalize(2.75),
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  handleConfirmBooking = (gymClass = {}) => {
    this.setState({
      isShowConfirmBooking: !this.state.isShowConfirmBooking,
      class: gymClass,
    });
  };

  handleNavigateFindClassDetails = (e, id) => {
    e.preventDefault();
    let paramsData = {
      id: id,
    };
    const {
      selectedDate,
      start_time,
      end_time,
      category_id,
      category_type_id,
      creditRangeHigh,
      creditRangeLow,
      gender_id,
    } = this.state;
    let date = new Date(selectedDate);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    if (selectedDate) {
      paramsData.date = dateString;
      paramsData.start_time = start_time;
      paramsData.end_time = end_time;
      paramsData.category_id = category_id;
      paramsData.category_type_id = category_type_id;
      paramsData.creditRangeHigh = creditRangeHigh;
      paramsData.creditRangeLow = creditRangeLow;
      paramsData.gender_id = gender_id;
    }
    this.props.navigation.navigate({
      routeName: 'GymClass',
      params: paramsData,
      key: `GymClassesSearch_${Math.random() * 10000}`,
    });
  };

  renderItem = ({item}) => {
    const {
      id,
      name,
      name_ar,
      attachments,
      credits,
      start_time,
      end_time,
      class_schedules,
      distance,
    } = item;
    //const {distance} = this.props.home.gym;

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

    let scheduleDates = [];
    class_schedules.map(schedule => {
      if (!isEmpty(schedule.schedule_dates)) {
        schedule.schedule_dates[0].dateTime = `${schedule.schedule_dates[0].date}T${schedule.start_time}`;
        schedule.schedule_dates[0].start_time = schedule.start_time;
        schedule.schedule_dates[0].end_time = schedule.end_time;
        schedule.schedule_dates[0].credits = schedule.credits;
        schedule.schedule_dates[0].duration = schedule.duration;
        scheduleDates.push(schedule.schedule_dates[0]);
      }
    });
    scheduleDates.sort(function (a, b) {
      return new Date(a.dateTime) - new Date(b.dateTime);
    });

    return (
      <TouchableOpacity
        onPress={e => this.handleNavigateFindClassDetails(e, id)}
        style={{
          display: 'flex',
          flexDirection: flexDirection,
          marginTop: normalize(16),
          marginHorizontal: normalize(16),
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
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image
              resizeMode={'cover'}
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
            flexDirection: flexDirection,
            width: normalize(267),
            marginLeft: normalize(20),
            justifyContent: 'space-between',
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
                flexDirection: flexDirection,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: normalize(17),
                    fontWeight: '700',
                    textAlign: textAlign,
                  }}>
                  {lang === 'ar' ? name_ar : name}
                </Text>
                <View style={{display: 'flex', flexDirection: flexDirection}}>
                  <Text style={{fontSize: normalize(12), color: '#8A8A8F'}}>
                    {`${
                      !isEmpty(scheduleDates) ? scheduleDates[0].duration : 0
                    } ${I18n.t('min', {
                      locale: lang,
                    })}`}
                  </Text>
                  {distance ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        marginHorizontal: normalize(8),
                      }}>
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
                {marginTop: normalize(6), flexDirection: flexDirection},
              ]}>
              <ReviewShow
                rating={item.rating_avg}
                style={{
                  fontSize: normalize(11),
                  paddingRight: normalize(2.75),
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
              justifyContent: 'flex-end',
              //width: normalize(65)
            }}>
            <View
              style={{
                width: '100%',
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  fontSize: normalize(14),
                  color: '#8A8A8F',
                  textAlign: 'center',
                  width: '100%',
                }}>
                {!isEmpty(scheduleDates) && scheduleDates[0].credits > 0
                  ? `${
                      !isEmpty(scheduleDates) ? scheduleDates[0].credits : 0
                    } ${
                      !isEmpty(scheduleDates) && scheduleDates[0].credits > 1
                        ? I18n.t('credits', {
                            locale: lang,
                          })
                        : I18n.t('credit', {
                            locale: lang,
                          })
                    }`
                  : I18n.t('free', {
                      locale: lang,
                    })}
              </Text>
            </View>

            <TouchableOpacity
              onPress={e => this.handleNavigateFindClassDetails(e, id)}
              /* onPress={() =>
                this.props.navigation.navigate({
                  routeName: 'GymClass',
                  params: {
                    id: id,
                  },
                  key: `GymClassesSearch_${Math.random() * 10000}`,
                })
              } */
              //onPress={() => this.handleConfirmBooking(item)}
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'center',
                width: normalize(62),
                height: normalize(27),
                backgroundColor: '#FE9800',
                borderRadius: normalize(14),
                marginTop: normalize(10),
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontSize: normalize(12),
                  color: '#FFFFFF',
                }}>
                {I18n.t('book', {locale: lang})}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  diff = (start, end) => {
    start = start.split(':');
    end = end.split(':');
    var startDate = new Date(0, 0, 0, start[0], start[1], start[2], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], end[2], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours > 0) {
      return `${hours}:${minutes} hour`;
    } else {
      return `${minutes} min`;
    }
  };

  handleSelectDate = date => {
    const {start_time, end_time, search, selectedDate} = this.state;
    if (selectedDate !== date) {
      this.setState({
        selectedDate: date,
        category_id: [],
        category_type_id: [],
        creditRangeHigh: '',
        creditRangeLow: '',
        gender_id: [],
      });
      date = new Date(date);
      let dateString = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split('T')[0];

      this.props.getFindClasses(dateString, start_time, end_time, search);
    } else {
      this.setState({
        selectedDate: 0,
        category_id: [],
        category_type_id: [],
        creditRangeHigh: '',
        creditRangeLow: '',
        gender_id: [],
      });
      this.props.getFindClasses();
    }
  };
  handleSelectTime = e => {
    if (!isEmpty(e)) {
      const {start_time, end_time, selectedDate, search} = this.state;
      let date = new Date(selectedDate);
      let dateString = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split('T')[0];
      if (selectedDate) {
        this.props.getFindClasses(dateString, start_time, end_time, search);
      } else {
        // Alert.alert(I18n.t('pleaseSelectDate', {locale: lang}));
      }
    }
  };
  handleRefresh = async () => {
    this.props.getPopularGyms();
    this.setState({refreshing: true});

    const {
      selectedDate,
      start_time,
      end_time,
      category_id,
      category_type_id,
      creditRangeHigh,
      creditRangeLow,
      gender_id,
    } = this.state;
    let date1 = new Date(selectedDate);
    let date = new Date(date1.getTime() - date1.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    let filter;
    let whereFilter = '';
    let inClass = '';
    let inClassCategory = '';
    if (!isEmpty(gender_id)) {
      inClass = `"inClass":{"is_active": 1,"gender_id":{"$in":[${gender_id}]} }`;
    }

    if (
      !isEmpty(date) &&
      !isEmpty(start_time) &&
      !isEmpty(end_time) &&
      !isEmpty(category_type_id) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}],"is_virtual":{"$in":[${category_type_id}]}},"inScheduleDates": { "date": "${date}" }`;
    } else if (
      !isEmpty(date) &&
      !isEmpty(start_time) &&
      !isEmpty(end_time) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}]},"inScheduleDates": { "date": "${date}" }`;
    } else if (!isEmpty(date) && !isEmpty(start_time) && !isEmpty(end_time)) {
      whereFilter = `"inClassSchedule": {"$and":[{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},"inScheduleDates":{"date":"${date}"}`;
    } else if (
      !isEmpty(category_type_id) &&
      !isEmpty(creditRangeLow) &&
      !isEmpty(creditRangeHigh)
    ) {
      whereFilter = `"inClassSchedule":{"credits":{"$between":[${creditRangeLow},${creditRangeHigh}]},"is_virtual":{"$in":[${category_type_id}]}}`;
    } else if (!isEmpty(date)) {
      whereFilter = `"inScheduleDates":{"date":"${date}"}`;
    }

    if (!isEmpty(category_id)) {
      inClassCategory = `"inClassCategory": {"category_id": {"$in":[${category_id}]}}`;
    }

    if (
      !isEmpty(inClass) &&
      !isEmpty(inClassCategory) &&
      !isEmpty(whereFilter)
    ) {
      filter = `{${inClass},${whereFilter},${inClassCategory}}`;
    } else if (!isEmpty(inClass) && !isEmpty(whereFilter)) {
      filter = `{${inClass},${whereFilter}}`;
    } else if (!isEmpty(inClassCategory) && !isEmpty(whereFilter)) {
      filter = `{"inClass":{"is_active": 1},${whereFilter},${inClassCategory}}`;
    } else if (!isEmpty(whereFilter)) {
      filter = `{"inClass":{"is_active": 1},${whereFilter}}`;
    } else {
      filter = `{"inClass":{"is_active": 1}}`;
    }
    this.props.getFilterFindClassesNew(filter);

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
  };
  render() {
    const {search, selectedDate, refreshing} = this.state;
    let date = new Date(selectedDate);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    const {findClasses} = this.props.findClass;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    return (
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
              marginTop: normalize(20),
              marginHorizontal: normalize(16),
              flexDirection: flexDirection,
            }}>
            <Text
              style={{
                fontSize: normalize(40),
                fontWeight: 'bold',
                color: '#231F20',
                textAlign: textAlign,
              }}>
              {I18n.t('findClass', {locale: lang})}
            </Text>
          </View>
          <View
            style={{
              marginTop: normalize(16),
              marginHorizontal: normalize(16),
              flexDirection: flexDirection,
            }}>
            <View
              style={{
                backgroundColor: '#EFEFF4',
                height: normalize(36),
                borderRadius: normalize(10),
                paddingLeft: normalize(10),
                borderBottomWidth: 0,
                flexDirection: flexDirection,
                alignItems:"center",
                flex:1
              }}>
              <FilterSearchIcon width={normalize(20)} height={normalize(20)} />
              <Input
                placeholder={I18n.t('search', {locale: lang})}
                placeholderTextColor="#8A8A8F"
                width={'90%'}
                borderWidth={0}
                style={{
                  fontSize: normalize(14),
                  textAlign: textAlign,
                  flexDirection: 'row',
                  outlineWidth:0,
                  borderWidth:0
                }}
                returnKeyLabel="Search"
                returnKeyType="search"
                onSubmitEditing={this.searchSubmit}
                value={search}
                onChangeText={val => this.handleChangeText('search', val)}
              />
            </View>
            <View
              style={{
     
                flexDirection: flexDirection,
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{display: 'flex'}}
                onPress={() => this.props.navigation.navigate('FindClassMap')}>
                <MapIcon
                  width={normalize(24)}
                  height={normalize(24)}
                  style={{marginHorizontal: normalize(16)}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{display: 'flex'}}
                onPress={() =>
                  this.props.navigation.navigate('Filter', {
                    onGoBack: this.onGoBack,
                  })
                }>
                <FilterIcon width={normalize(24)} height={normalize(24)} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginTop: normalize(24),
              marginHorizontal: normalize(16),
              flexDirection: flexDirection,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: normalize(20),
                fontWeight: 'bold',
                color: '#231F20',
                textAlign: textAlign,
              }}>
              {I18n.t('dateTime', {locale: lang})}
            </Text>
            <Text style={{color: '#8A8A8F'}}>
              {selectedDate ? dateString : ''}
            </Text>
          </View>
          <View
            style={{
              marginTop: normalize(16),
              flexDirection: flexDirection,
            }}>
            <CalendarStrip
              selectedDate={this.state.selectedDate}
              onPressDate={this.handleSelectDate}
              onPressGoToday={this.handleSelectDate}
              onSwipeDown={() => {
                // alert('onSwipeDown');
              }}
              markedDate={[]}
              weekStartsOn={0}
            />
          </View>
          <View
            style={{
              marginHorizontal: normalize(16),
            }}>
            <View
              style={{
                marginLeft: normalize(7),
                marginRight: normalize(10),
                marginBottom: normalize(15),
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: normalize(16), color: '#22242A'}}>
                {moment.utc(this.state.rangeLow).format('hh:mm A')}
              </Text>
              <Text style={{fontSize: normalize(16), color: '#22242A'}}>
                {moment.utc(this.state.rangeHigh).format('hh:mm A')}
              </Text>
            </View>

            <RangeSlider
              style={{
                flex: 1,
                height: 70,
              }}
              gravity={'center'}
              min={0}
              max={86344000}
              step={1800000}
              valueType="time"
              textFormat="hh:mm a"
              disabled={selectedDate ? false : true}
              selectionColor={selectedDate ? '#FE9800' : '#8A8A8F'}
              blankColor="#F1F1F1"
              renderThumb={() => (
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 20,
                    backgroundColor: '#fff',
                    borderColor: '#FE9800',
                    borderWidth: 5,
                  }}
                />
              )}
              renderRail={() => (
                <View
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 2,
                    backgroundColor: '#EBEBEB',
                  }}
                />
              )}
              renderRailSelected={() => (
                <View
                  style={{
                    height: 6,
                    backgroundColor: '#FE9800',
                    borderRadius: 2,
                  }}
                />
              )}
              onValueChanged={(low, high, fromUser) => {
                if (fromUser) {
                  this.setState({
                    rangeLow: low,
                    rangeHigh: high,
                    start_time: moment.utc(low).format('HH:mm:ss'),
                    end_time: moment.utc(high).format('HH:mm:ss'),
                  });
                }
              }}
              low={this.state.rangeLow}
              high={this.state.rangeHigh}
              onTouchEnd={e => this.handleSelectTime(e)}
            />
          </View>
          <View>
            <View
              style={{
                marginTop: normalize(24),
                marginHorizontal: normalize(16),
                flexDirection: flexDirection,
              }}>
              <Text
                style={{
                  fontSize: normalize(20),
                  fontWeight: 'bold',
                  color: '#22242A',
                }}>
                {I18n.t('upcomingClassesNearYou', {locale: lang})}
              </Text>
            </View>
            {findClasses.length > 0 ? (
              <FlatList
                style={styles.container}
                data={findClasses}
                renderItem={this.renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{
                  marginBottom: normalize(10),
                }}
              />
            ) : (
              <View
                style={{
                  marginHorizontal: normalize(16),
                  marginVertical: normalize(16),
                }}>
                <Text style={{color: '#8f8f8f', fontSize: normalize(16)}}>
                  {I18n.t('noUpcomingClasses', {locale: lang})}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        {!isEmpty(this.state.class) ? (
          <>
            <ConfirmBooking
              isShowConfirmBooking={this.state.isShowConfirmBooking}
              handleConfirmBooking={this.handleConfirmBooking}
              data={this.state.class}
              navigation={this.props.navigation}
            />
          </>
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  classRatingContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  classStarIcon: {
    color: '#FE9800',
    fontSize: normalize(11),
    paddingRight: normalize(2.75),
  },
  container: {
    flex: 1,
  },
  gymRatingCountText: {
    color: '#8A8A8F',
    fontSize: normalize(12),
  },
  moveLeft: {
    left: normalize(10),
  },
  moveRight: {
    right: normalize(10),
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  findClass: state.findClass,
  home: state.home,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getPopularGyms,
  clearErrors,
  getFindClasses,
  getSearchFindClasses,
  getFilterFindClassesNew,
})(FindClass);
