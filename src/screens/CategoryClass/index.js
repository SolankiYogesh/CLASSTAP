import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import axios from 'axios';
import React, {Component} from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {getCategoryClasses} from '../../actions/homeActions';
import HeaderComponent from '../../components/Header';
import {API_URI, IMAGE_URI} from '../../utils/config';
import Const from '../../utils/Const';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import ConfirmBooking from '../ConfirmBooking';
import Loading from '../Loading';
import ReviewShow from '../Review/ReviewShow';

class CategoryClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowWriteReview: false,
      isShowAbout: false,
      categoryClasses: [],
      isLoading: true,
      class: {},
      isShowConfirmBooking: false,
    };
  }

  /*  async componentDidMount() {
    const id = await this.props.navigation.getParam('id');
    this.props.getCategoryClasses(id);
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  } */
  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.CATEGORY_CLASS_SCREEN);

    const id = await this.props.route.params.id;
    const latitude = await AsyncStorage.getItem('latitude');
    const longitude = await AsyncStorage.getItem('longitude');
    let url = `${API_URI}/classes?filter={"inClass": {"is_active": 1},"inClassCategory": {"category_id": ${id}}}`;
    if (latitude && longitude) {
      url = `${url}&latitude=${latitude}&longitude=${longitude}`;
    }
    await axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data;

          this.setState({categoryClasses: data, isLoading: false});
          return true;
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
      });

    this.back = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack,
    );
  }

  componentWillUnmount() {
    if (this.back?.remove) {
      this.back?.remove();
    }
  }

  handleNavigateGymCategoryClass = (e, id) => {
    e.preventDefault();
    this.props.navigation.navigate({
      routeName: 'GymClass',
      params: {
        id: id,
      },
      key: `GymCategoryClass_${Math.random() * 10000}`,
    });
  };

  handleConfirmBooking = (gymClass = {}) => {
    this.setState({
      isShowConfirmBooking: !this.state.isShowConfirmBooking,
      class: gymClass,
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
    // const {distance} = this.props.home.gym;

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
        schedule.schedule_dates[0].dateTime = `${schedule.schedule_dates[0].date} ${schedule.start_time}`;
        schedule.schedule_dates[0].start_time = schedule.start_time;
        schedule.schedule_dates[0].end_time = schedule.end_time;
        schedule.schedule_dates[0].credits = schedule.credits;
        scheduleDates.push(schedule.schedule_dates[0]);
      }
    });
    scheduleDates.sort(function (a, b) {
      return new Date(a.dateTime) - new Date(b.dateTime);
    });
    return (
      <TouchableOpacity
        onPress={e => this.handleNavigateGymCategoryClass(e, id)}
        /*         onPress={() =>
          this.props.navigation.navigate({
            routeName: 'GymClass',
            params: {
              id: id,
              // back: 'CategoryClass',
              // back_id: item.category_id,
            },
            key: `GymCategoryClass_${item.id}`,
          })
        } */
        style={{
          display: 'flex',
          flexDirection: flexDirection,
          marginTop: normalize(16),
          marginHorizontal: normalize(16),
        }}>
        <View style={{display: 'flex', width: normalize(60)}}>
          <Image
            source={image}
            style={{
              width: normalize(60),
              height: normalize(60),
              borderRadius: normalize(10),
            }}
          />
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

                <Text style={{fontSize: normalize(12), color: '#8A8A8F'}}>
                  {/* {this.diff(start_time, end_time)} */} {/* .{' '} */}
                  {distance
                    ? distance >= 1
                      ? `${distance.toFixed(2)} km`
                      : `${distance.toFixed(3) * 1000} m`
                    : ''}
                </Text>
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
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              //width: normalize(65)
            }}>
            {/*   <Text style={{fontSize: normalize(14), color: '#8A8A8F'}}>
              {`${class_schedules.length} ${
                class_schedules.lengt > 1
                  ? I18n.t('sessions', {
                      locale: lang,
                    })
                  : I18n.t('session', {
                      locale: lang,
                    })
              }`}
            </Text> */}
            <Text
              style={{
                fontSize: normalize(14),
                color: '#8A8A8F',
                textAlign: 'center',
              }}>
              {!isEmpty(scheduleDates) && scheduleDates[0].credits > 0
                ? `${!isEmpty(scheduleDates) ? scheduleDates[0].credits : 0} ${
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
            <TouchableOpacity
              onPress={e => this.handleNavigateGymCategoryClass(e, id)}
              //onPress={() => this.handleConfirmBooking(item)}
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                justifyContent: 'center',
                width: normalize(62),
                height: normalize(27),
                backgroundColor: '#FE9800',
                borderRadius: normalize(14),
                marginTop: normalize(10),
              }}>
              <Text
                style={{
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

  handleBack = async () => {
    this.props.navigation.goBack();
    return true;
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

  render() {
    const {lang} = this.props.setting;
    const {isLodaing} = this.props.errors;
    const {categoryClasses, isLoading} = this.state;

    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';

    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <SafeAreaView />
            <HeaderComponent navigation={this.props.navigation} />
            {/* <StatusBar hidden={true} /> */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{backgroundColor: '#ffffff'}}>
              <View style={[styles.titleContainer, {alignSelf: alignSelf}]}>
                <Text
                  style={[styles.titleContainerText, {textAlign: textAlign}]}>
                  {this.props.route.params.categoryName}
                </Text>
              </View>

              <View>
                {/* <View
                  style={[styles.classTitleContainer, {alignSelf: alignSelf}]}>
                  <Text style={styles.classTitleContainerText}>
                    {`${classes ? classes.length : 0} ${I18n.t(
                      'classByThisGym',
                      {
                        locale: lang,
                      },
                    )}`}
                  </Text>
                </View> */}
                <View
                  style={
                    {
                      //marginHorizontal: normalize(16),
                    }
                  }>
                  {categoryClasses.length > 0 ? (
                    <FlatList
                      style={styles.container}
                      data={categoryClasses}
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
                      }}>
                      <Text
                        style={{
                          color: '#8f8f8f',
                          fontSize: normalize(16),
                          textAlign: textAlign,
                        }}>
                        {I18n.t('noClasses', {locale: lang})}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
            {!isEmpty(this.state.class) ? (
              <>
                <ConfirmBooking
                  isShowConfirmBooking={this.state.isShowConfirmBooking}
                  handleConfirmBooking={this.handleConfirmBooking}
                  //foreign_id={id}
                  //class="Class"
                  data={this.state.class}
                  navigation={this.props.navigation}
                />
              </>
            ) : null}
          </View>
        )}
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
  distanceContainer: {
    bottom: normalize(10),
    left: normalize(10),
    position: 'absolute',
  },
  distanceContainerArabic: {
    bottom: normalize(10),
    position: 'absolute',
    right: normalize(10),
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
    marginBottom: normalize(10),
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

export default connect(mapStateToProps, {getCategoryClasses})(CategoryClass);
