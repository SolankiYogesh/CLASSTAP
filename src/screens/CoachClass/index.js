import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Body, Button, Header, Icon, Left} from 'native-base';
import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {getCoachClasses} from '../../actions/homeActions';
import HeaderComponent from '../../components/Header';
import {IMAGE_URI} from '../../utils/config';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import Loading from '../Loading';
import ReviewShow from '../Review/ReviewShow';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

const {width} = Dimensions.get('window');

export class CoachClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowWriteReview: false,
      isShowAbout: false,
    };
  }

  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.COACH_CLASS_SCREEN);
    const id = await this.props.navigation.getParam('id');
    this.props.getCoachClasses(id);
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
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
      coach_id,
      class_schedules,
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
        schedule.schedule_dates[0].duration = schedule.duration;
        scheduleDates.push(schedule.schedule_dates[0]);
      }
    });

    scheduleDates.reverse();
    scheduleDates.sort(function (a, b) {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate({
            routeName: 'GymClass',
            params: {
              id: item.id,
              back: 'CoachClass',
              back_id: item.coach_id,
            },
            key: `GymCoachClass_${item.id}`,
          })
        }
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
          <View>
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
                  {/* this.diff(start_time, end_time) */}
                  {/* distance >= 1
                  ? `${distance.toFixed(2)} km`
                  : `${distance.toFixed(3) * 1000} m` */}
                  {/* {`${class_schedules.length} ${
                    class_schedules.length > 1
                      ? I18n.t('sessions', {
                          locale: lang,
                        })
                      : I18n.t('session', {
                          locale: lang,
                        })
                  }`} */}
                  {`${
                    !isEmpty(scheduleDates) ? scheduleDates[0].duration : 0
                  } ${I18n.t('min', {
                    locale: lang,
                  })}`}
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
            <View>
              <Text style={{fontSize: normalize(12), color: '#8A8A8F'}}>
                {moment(scheduleDates[0].date, 'YYYY-MM-DD').format(
                  'D MMM YYYY',
                )}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  handleBack = async () => {
    const id = await this.props.navigation.getParam('id');
    this.props.navigation.goBack();
    //this.props.navigation.navigate('Coach', {id, back: 'GymClass'});

    /*    const back = await this.props.navigation.getParam('back');
    const back_id = await this.props.navigation.getParam('back_id');

    // this.props.clearErrors();
    if (!isEmpty(back)) {
      const classTabToken = await AsyncStorage.getItem('classTabToken');
      if (classTabToken) {
        if (back_id) {
          this.props.navigation.navigate(back, {id: back_id});
          this.props.getGym(back_id);
        } else {
          this.props.navigation.navigate(back);
        }
      } else {
        this.props.navigation.navigate('Auth');
      }
    } else {
      this.props.navigation.goBack();
    } */
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
    const {coachClasses} = this.props.home;

    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';

    return (
      <>
        {isLodaing ? (
          <Loading />
        ) : (
          <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <Header style={styles.headerContainer}>
              {/* <Left> */}

              <Button transparent onPress={this.handleBack}>
                <View style={styles.backButtonContainer}>
                  <Icon
                    type="FontAwesome"
                    name="angle-left"
                    style={styles.backButtonIcon}
                  />
                  <Text style={styles.backButtonText}>
                    {I18n.t('BackToCoachProfile', {locale: lang})}
                  </Text>
                </View>
              </Button>

              {/* </Left> */}
              <Body />
            </Header>

            {/* <StatusBar hidden={true} /> */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{backgroundColor: '#ffffff'}}>
              <View>
                <View
                  style={
                    {
                      //marginHorizontal: normalize(16),
                    }
                  }>
                  <FlatList
                    style={styles.container}
                    data={coachClasses}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{
                      marginBottom: normalize(10),
                    }}
                  />
                </View>
              </View>
            </ScrollView>
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
  backButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButtonIcon: {
    color: '#22242A',
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  backButtonText: {
    color: '#22242A',
    fontSize: normalize(12),

    top: Platform.OS === 'ios' ? normalize(3.1) : normalize(3.3),
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
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    paddingLeft: normalize(-10),
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

export default connect(mapStateToProps, {getCoachClasses})(CoachClass);
