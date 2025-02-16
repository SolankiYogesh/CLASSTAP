import moment from 'moment-timezone';
import {Body, Button, Container, Header, Icon, Left} from 'native-base';
import React, {Component} from 'react';
import {
  BackHandler,
  Platform,
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
import CalendarStrip from '../../react-native-slideable-calendar-strip';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
moment.tz.setDefault('Asia/Qatar');

//import {getCategories} from '../../actions/homeActions';
import {
  getCategories,
  getFilterFindClassCount,
  getFilterFindClasses,
} from '../../actions/findClassActions';

const genders = [
  {id: 1, name: 'Male', name_ar: 'الذكر'},
  {id: 2, name: 'Female', name_ar: 'أنثى'},
  {id: 3, name: 'Mixed', name_ar: 'مختلط'},
];

export class Membership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      rangeLow: 18000000,
      rangeHigh: 75600000,
      start_time: moment.utc(18000000).format('HH:mm:ss'),
      end_time: moment.utc(75600000).format('HH:mm:ss'),
      creditRangeLow: 0,
      creditRangeHigh: 50,
      gender_id: [],
      category_id: [],
      category_type_id: [],
    };
  }
  async componentDidMount() {
    this.handleSearchFilterCount();
    //this.props.clearErrors();
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.props.getCategories();
  }

  handleBack = async back => {
    this.props.navigation.goBack();
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleSelectDate = date => {
    const {selectedDate} = this.state;

    //this.setState({selectedDate: date});
    this.setState(
      {
        selectedDate: selectedDate !== date ? date : 0,
      },
      () => {
        this.handleSearchFilterCount();
      },
    );
  };

  handleSelectTime = e => {
    if (!isEmpty(e)) {
      // e.preventDefault();
      const {lang} = this.props.setting;
      const {selectedDate} = this.state;
      this.handleSearchFilterCount();
    }
  };

  handleSelectCredit = e => {
    if (!isEmpty(e)) {
      e.preventDefault();
      this.handleSearchFilterCount();
    }
  };

  handleSearchFilterCount = () => {
    const {
      start_time,
      end_time,
      selectedDate,
      creditRangeLow,
      creditRangeHigh,
      gender_id,
      category_id,
      category_type_id,
    } = this.state;
    let filter;
    let whereFilter = '';
    let inClass = '';
    let inClassCategory = '';
    let date = new Date(selectedDate);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    if (!isEmpty(gender_id)) {
      inClass = `"inClass":{"is_active": 1,"gender_id":{"$in":[${gender_id}]} }`;
    }

    if (selectedDate && !isEmpty(category_type_id)) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}],"is_virtual":{"$in":[${category_type_id}]}},"inScheduleDates": { "date": "${dateString}" }`;
    } else if (selectedDate) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}]},"inScheduleDates": { "date": "${dateString}" }`;
    } else if (!isEmpty(category_type_id)) {
      whereFilter = `"inClassSchedule":{"credits":{"$between":[${creditRangeLow},${creditRangeHigh}]},"is_virtual":{"$in":[${category_type_id}]}}`;
    } else {
      whereFilter = `"inClassSchedule":{"credits":{"$between":[${creditRangeLow},${creditRangeHigh}]}}`;
    }

    if (!isEmpty(category_id)) {
      inClassCategory = `"inClassCategory": {"category_id": {"$in":[${category_id}]}}`;
    }
    if (!isEmpty(inClass) && !isEmpty(inClassCategory)) {
      filter = `{${inClass},${whereFilter},${inClassCategory}}`;
    } else if (!isEmpty(inClass)) {
      filter = `{${inClass},${whereFilter}}`;
    } else if (!isEmpty(inClassCategory)) {
      filter = `{"inClass":{"is_active": 1},${whereFilter},${inClassCategory}}`;
    } else {
      filter = `{"inClass":{"is_active": 1},${whereFilter}}`;
    }

    this.props.getFilterFindClassCount(filter);
  };

  handleSearchFilter = e => {
    e.preventDefault();
    const {
      start_time,
      end_time,
      selectedDate,
      creditRangeLow,
      creditRangeHigh,
      gender_id,
      category_id,
      category_type_id,
      rangeLow,
      rangeHigh,
    } = this.state;
    let filter;
    let whereFilter = '';
    let inClass = '';
    let inClassCategory = '';
    let date = new Date(selectedDate);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    if (!isEmpty(gender_id)) {
      inClass = `"inClass":{"is_active": 1,"gender_id":{"$in":[${gender_id}]} }`;
    }

    if (selectedDate && !isEmpty(category_type_id)) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}],"is_virtual":{"$in":[${category_type_id}]}},"inScheduleDates": { "date": "${dateString}" }`;
    } else if (selectedDate) {
      whereFilter = `"inClassSchedule": {"$and": [{"$and": [{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},{"credits": { "$between": [${creditRangeLow},${creditRangeHigh}] }}]},"inScheduleDates": { "date": "${dateString}" }`;
    } else if (!isEmpty(category_type_id)) {
      whereFilter = `"inClassSchedule":{"credits":{"$between":[${creditRangeLow},${creditRangeHigh}]},"is_virtual":{"$in":[${category_type_id}]}}`;
    } else {
      whereFilter = `"inClassSchedule":{"credits":{"$between":[${creditRangeLow},${creditRangeHigh}]}}`;
    }

    if (!isEmpty(category_id)) {
      inClassCategory = `"inClassCategory": {"category_id": {"$in":[${category_id}]}}`;
    }

    if (!isEmpty(inClass) && !isEmpty(inClassCategory)) {
      filter = `{${inClass},${whereFilter},${inClassCategory}}`;
    } else if (!isEmpty(inClass)) {
      filter = `{${inClass},${whereFilter}}`;
    } else if (!isEmpty(inClassCategory)) {
      filter = `{"inClass":{"is_active": 1},${whereFilter},${inClassCategory}}`;
    } else {
      filter = `{"inClass":{"is_active": 1},${whereFilter}}`;
    }

    this.props.getFilterFindClasses(filter, this.props.navigation, {
      start_time,
      end_time,
      selectedDate,
      creditRangeLow,
      creditRangeHigh,
      gender_id,
      category_id,
      category_type_id,
      rangeLow,
      rangeHigh,
    });
  };

  handleGender = id => {
    let gender_id = [...this.state.gender_id];
    if (gender_id.indexOf(id) > -1) {
      gender_id = gender_id.filter(genId => genId !== id);
    } else {
      gender_id.push(id);
    }
    this.setState(
      {
        gender_id,
      },
      () => {
        this.handleSearchFilterCount();
      },
    );
    //this.setState({gender_id: id});
  };
  handleCategory = id => {
    let category_id = [...this.state.category_id];
    if (category_id.indexOf(id) > -1) {
      category_id = category_id.filter(catId => catId !== id);
    } else {
      category_id.push(id);
    }
    this.setState(
      {
        category_id,
      },
      () => {
        this.handleSearchFilterCount();
      },
    );
    //this.setState({category_id: id});
  };
  handleCategoryType = id => {
    let category_type_id = [...this.state.category_type_id];
    if (category_type_id.indexOf(id) > -1) {
      category_type_id = category_type_id.filter(catId => catId !== id);
    } else {
      category_type_id.push(id);
    }
    this.setState(
      {
        category_type_id,
      },
      () => {
        this.handleSearchFilterCount();
      },
    );
  };
  render() {
    const {gym_count, class_count, categories} = this.props.findClass;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    /// const {categories} = this.props.home;
    const {selectedDate} = this.state;
    let date = new Date(selectedDate);
    let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    return (
      <Container style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <Header style={styles.headerContainer}>
          <Left>
            <Button transparent onPress={this.handleBack}>
              <View style={styles.backButtonContainer}>
                <Icon
                  type="FontAwesome"
                  name="angle-left"
                  style={styles.backButtonIcon}
                />
                <Text style={styles.backButtonText}>
                  {I18n.t('back', {locale: lang})}
                </Text>
              </View>
            </Button>
          </Left>
          <Body />
        </Header>
        <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginHorizontal: normalize(16),
              }}>
              <Text
                style={{
                  color: '#231F20',
                  fontSize: normalize(40),
                  fontWeight: 'bold',
                  textAlign: textAlign,
                }}>
                {I18n.t('filter', {locale: lang})}
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: normalize(16),
                marginTop: normalize(24),
                display: 'flex',
                flexDirection: flexDirection,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: normalize(164),
                  height: normalize(32),
                  backgroundColor: '#EBEBEB',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: normalize(14),
                }}>
                <Text style={{color: '#22242A', fontSize: normalize(16)}}>
                  {I18n.t('gyms', {locale: lang})} ({gym_count ? gym_count : 0})
                </Text>
              </View>
              <View
                style={{
                  width: normalize(164),
                  height: normalize(32),
                  backgroundColor: '#EBEBEB',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: normalize(14),
                }}>
                <Text style={{color: '#22242A', fontSize: normalize(16)}}>
                  {I18n.t('classes', {locale: lang})} (
                  {class_count ? class_count : 0})
                </Text>
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
                //marginHorizontal: normalize(16),
                flexDirection: 'row',
              }}>
              <CalendarStrip
                selectedDate={this.state.selectedDate}
                onPressDate={this.handleSelectDate}
                onPressGoToday={this.handleSelectDate}
                onSwipeDown={() => {
                  // alert('onSwipeDown');
                }}
                markedDate={[]}
                weekStartsOn={0} // 0, 1,2,3,4,5,6 for S M T W T F S, defaults to 0
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
                  //width: normalize(343),
                  height: 70,
                  // top: normalize(-30),
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
                renderThumb={() => {
                  return (
                    <View
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 20,
                        backgroundColor: '#fff',
                        borderColor: '#FE9800',
                        borderWidth: 5,
                      }}></View>
                  );
                }}
                renderRail={() => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        height: 6,
                        borderRadius: 2,
                        backgroundColor: '#EBEBEB',
                      }}></View>
                  );
                }}
                renderRailSelected={() => {
                  return (
                    <View
                      style={{
                        height: 6,
                        backgroundColor: '#FE9800',
                        borderRadius: 2,
                      }}></View>
                  );
                }}
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
              {/* <RangeSlider
                disabled={selectedDate ? false : true}
                style={{
                  flex: 1,
                  //width: normalize(343),
                  height: 70,
                  top: normalize(-30),
                }}
                valueType="time"
                gravity={'center'}
                min={0}
                max={86344000}
                valueType="time"
                textFormat="hh:mm a"
                step={1800000}
                lineWidth={7}
                thumbBorderWidth={6}
                thumbRadius={12}
                selectionColor={selectedDate ? '#FE9800' : '#8A8A8F'}
                blankColor="#F1F1F1"
                thumbBorderColor={selectedDate ? '#FE9800' : '#8A8A8F'}
                labelStyle="none"
                //labelBackgroundColor="#ffffff"
                //labelBorderColor="#ffffff"
                //labelTextColor="#22242A"
                onValueChanged={(low, high, fromUser) => {
                  this.setState({
                    rangeLow: low,
                    rangeHigh: high,
                    start_time: moment.utc(low).format('HH:mm:ss'),
                    end_time: moment.utc(high).format('HH:mm:ss'),
                  });
                }}
                initialLowValue={18000000}
                initialHighValue={75600000}
                onTouchEnd={e => this.handleSelectTime(e)}
              /> */}
            </View>
            <View
              style={{
                marginHorizontal: normalize(16),
                marginTop: normalize(-20),
              }}>
              <Text
                style={{
                  fontSize: normalize(20),
                  fontWeight: 'bold',
                  color: '#231F20',
                  textAlign: textAlign,
                }}>
                {I18n.t('numberOfCreditsPerClass', {locale: lang})}
              </Text>
              <View
                style={{
                  marginLeft: normalize(7),
                  marginRight: normalize(10),
                  marginBottom: normalize(15),
                  marginTop: normalize(10),
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: normalize(16), color: '#22242A'}}>
                  {this.state.creditRangeLow}
                </Text>
                <Text style={{fontSize: normalize(16), color: '#22242A'}}>
                  {this.state.creditRangeHigh}
                </Text>
              </View>
              <RangeSlider
                style={{
                  flex: 1,
                  //width: normalize(343),
                  height: 70,
                  // top: normalize(-30),
                }}
                gravity={'center'}
                min={0}
                max={50}
                step={1}
                // valueType="time"
                // textFormat="hh:mm a"
                selectionColor="#FE9800"
                blankColor="#F1F1F1"
                renderThumb={() => {
                  return (
                    <View
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 20,
                        backgroundColor: '#fff',
                        borderColor: '#FE9800',
                        borderWidth: 5,
                      }}></View>
                  );
                }}
                renderRail={() => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        height: 6,
                        borderRadius: 2,
                        backgroundColor: '#EBEBEB',
                      }}></View>
                  );
                }}
                renderRailSelected={() => {
                  return (
                    <View
                      style={{
                        height: 6,
                        backgroundColor: '#FE9800',
                        borderRadius: 2,
                      }}></View>
                  );
                }}
                onValueChanged={(low, high, fromUser) => {
                  if (fromUser) {
                    this.setState({
                      creditRangeLow: low,
                      creditRangeHigh: high,
                    });
                  }
                }}
                initialLowValue={0}
                initialHighValue={50}
                onTouchEnd={e => this.handleSelectTime(e)}
              />
              {/* <RangeSlider
                style={{
                  flex: 1,
                  // width: normalize(343),
                  height: 70,
                  top: normalize(-30),
                }}
                gravity={'center'}
                min={0}
                max={50}
                //valueType="time"
                //textFormat="hh:mm a"
                step={1}
                lineWidth={7}
                thumbBorderWidth={6}
                thumbRadius={12}
                selectionColor="#FE9800"
                blankColor="#F1F1F1"
                thumbBorderColor="#FE9800"
                labelStyle="none"
                //labelBackgroundColor="#ffffff"
                //labelBorderColor="#ffffff"
                //labelTextColor="#22242A"
                onValueChanged={(low, high, fromUser) => {
                  this.setState({
                    creditRangeLow: low,
                    creditRangeHigh: high,
                  });
                }}
                initialLowValue={0}
                initialHighValue={50}
                onTouchEnd={e => this.handleSelectCredit(e)}
              /> */}

              {/* <View
                style={{
                  marginLeft: normalize(7),
                  marginRight: normalize(10),
                  marginTop: normalize(-45),
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: normalize(12), color: '#8A8A8F'}}>
                  {0}
                </Text>
                <Text style={{fontSize: normalize(12), color: '#8A8A8F'}}>
                  {50}
                </Text>
              </View> */}
            </View>
            <View
              style={{
                marginHorizontal: normalize(16),
                marginTop: normalize(16),
              }}>
              <View style={{marginBottom: normalize(16)}}>
                <Text
                  style={{
                    fontSize: normalize(20),
                    fontWeight: 'bold',
                    color: '#231F20',
                    textAlign: textAlign,
                  }}>
                  {I18n.t('gender', {locale: lang})}
                </Text>
              </View>

              <View style={{flexDirection: flexDirection, flexWrap: 'wrap'}}>
                {genders.map((gender, index) => (
                  <TouchableOpacity
                    onPress={id => this.handleGender(gender.id)}
                    key={index}
                    style={{
                      height: normalize(32),
                      paddingHorizontal: normalize(24),
                      paddingVertical: normalize(7),
                      backgroundColor:
                        this.state.gender_id.indexOf(gender.id) > -1
                          ? '#FE9800'
                          : '#F9F9F9',
                      borderRadius: normalize(16),
                      margin: normalize(5),
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(16),
                        color:
                          this.state.gender_id.indexOf(gender.id) > -1
                            ? '#ffffff'
                            : '#8A8A8F',
                      }}>
                      {lang === 'ar' ? gender.name_ar : gender.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View
              style={{
                marginHorizontal: normalize(16),
                marginTop: normalize(16),
              }}>
              <View style={{marginBottom: normalize(16)}}>
                <Text
                  style={{
                    fontSize: normalize(20),
                    fontWeight: 'bold',
                    color: '#231F20',
                    textAlign: textAlign,
                  }}>
                  {I18n.t('classType', {locale: lang})}
                </Text>
              </View>

              <View style={{flexDirection: flexDirection, flexWrap: 'wrap'}}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    onPress={id => this.handleCategory(category.id)}
                    key={index}
                    style={{
                      height: normalize(32),
                      paddingHorizontal: normalize(24),
                      paddingVertical: normalize(7),
                      backgroundColor:
                        this.state.category_id.indexOf(category.id) > -1
                          ? '#FE9800'
                          : '#F9F9F9',
                      borderRadius: normalize(16),
                      margin: normalize(5),
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(16),
                        color:
                          this.state.category_id.indexOf(category.id) > -1
                            ? '#ffffff'
                            : '#8A8A8F',
                      }}>
                      {lang === 'ar' ? category.name_ar : category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Start Category */}
            <View
              style={{
                marginHorizontal: normalize(16),
                marginTop: normalize(16),
              }}>
              <View style={{marginBottom: normalize(16)}}>
                <Text
                  style={{
                    fontSize: normalize(20),
                    fontWeight: 'bold',
                    color: '#231F20',
                    textAlign: textAlign,
                  }}>
                  {I18n.t('category', {locale: lang})}
                </Text>
              </View>

              <View style={{flexDirection: flexDirection, flexWrap: 'wrap'}}>
                <TouchableOpacity
                  onPress={id => this.handleCategoryType(1)}
                  style={{
                    height: normalize(32),
                    paddingHorizontal: normalize(24),
                    paddingVertical: normalize(7),
                    backgroundColor:
                      this.state.category_type_id.indexOf(1) > -1
                        ? '#FE9800'
                        : '#F9F9F9',
                    borderRadius: normalize(16),
                    margin: normalize(5),
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(16),
                      color:
                        this.state.category_type_id.indexOf(1) > -1
                          ? '#ffffff'
                          : '#8A8A8F',
                    }}>
                    {I18n.t('virtual', {locale: lang})}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={id => this.handleCategoryType(0)}
                  style={{
                    height: normalize(32),
                    paddingHorizontal: normalize(24),
                    paddingVertical: normalize(7),
                    backgroundColor:
                      this.state.category_type_id.indexOf(0) > -1
                        ? '#FE9800'
                        : '#F9F9F9',
                    borderRadius: normalize(16),
                    margin: normalize(5),
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(16),
                      color:
                        this.state.category_type_id.indexOf(0) > -1
                          ? '#ffffff'
                          : '#8A8A8F',
                    }}>
                    {I18n.t('offline', {locale: lang})}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* End Category */}
            <TouchableOpacity
              onPress={e => this.handleSearchFilter(e)}
              style={{
                marginVertical: normalize(30),
                marginHorizontal: normalize(32),
                width: normalize(310),
                height: normalize(48),
                backgroundColor: '#FE9800',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: normalize(24),
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                }}>
                {I18n.t('showMeResults', {locale: lang})}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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

    top: Platform.OS === 'ios' ? normalize(3) : normalize(3.3),
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  findClass: state.findClass,
  setting: state.setting,
  home: state.home,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  clearErrors,
  getCategories,
  getFilterFindClasses,
  getFilterFindClassCount,
})(Membership);
