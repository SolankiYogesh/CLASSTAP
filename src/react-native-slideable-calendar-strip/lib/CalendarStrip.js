import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  Platform,
  Dimensions,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import Weeks from './Weeks';
import {
  // getDay,
  format,
  addDays,
  subDays,
  // isToday,
  eachDay,
  isFuture,
  isSameDay,
  endOfWeek,
  getISOWeek,
  startOfWeek,
  differenceInDays,
} from 'date-fns';
import normalize from 'react-native-normalize';
import ChineseLunar from 'chinese-lunar';
import ChineseLocale from 'date-fns/locale/zh_cn';

const {width} = Dimensions.get('window');
const ITEM_LENGTH = width / 7;
const _today = new Date();
const _year = _today.getFullYear();
const _month = _today.getMonth();
const _day = _today.getDate();
const TODAY = new Date(_year, _month, _day); // FORMAT: Wed May 16 2018 00:00:00 GMT+0800 (CST)

class DateItem extends PureComponent {
  render() {
    const {
      item,
      marked,
      highlight,
      showLunar,
      onItemPress,
      currentDate,
    } = this.props;

    const solar = format(item, 'D');
    const nowDate = format(currentDate, 'D');
    const _lunar = ChineseLunar.solarToLunar(item);
    const lunar = ChineseLunar.format(_lunar, 'd');
    const highlightBgColor = '#FE9800';
    const normalBgColor = 'white';
    const hightlightTextColor = '#fff';
    const normalTextColor = '#8A8A8F';
    const currentTextColor = '#0053FE';
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          underlayColor="#008b8b"
          style={styles.itemWrapButton}
          onPress={onItemPress}>
          <View
            style={[
              styles.itemView,
              {paddingTop: showLunar ? 0 : normalize(10)},
              {
                backgroundColor: highlight ? highlightBgColor : normalBgColor,
              },
            ]}>
            <Text
              style={[
                styles.itemDateText,
                {
                  color: highlight
                    ? hightlightTextColor
                    : nowDate === solar
                    ? currentTextColor
                    : normalTextColor,
                },
              ]}>
              {solar}
            </Text>
            {showLunar && (
              <Text
                style={[
                  styles.itemLunarText,
                  {color: highlight ? hightlightTextColor : 'gray'},
                ]}>
                {lunar}
              </Text>
            )}
            {marked && (
              <View
                style={[
                  styles.itemBottomDot,
                  {backgroundColor: highlight ? 'white' : '#6D88E6'},
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

class CalendarStrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: this.getInitialDates(props.weekStartsOn),
      isTodayVisible: true,
      pageOfToday: 2, // page of today in calendar, start from 0
      currentPage: 2, // current page in calendar,  start from 0,
      currentDate: new Date(),
    };
  }

  UNSAFE_componentWillMount() {
    const touchThreshold = 50;
    const speedThreshold = 0.2;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dy, vy} = gestureState;
        if (dy > touchThreshold && vy > speedThreshold) {
          const {onSwipeDown} = this.props;
          onSwipeDown && onSwipeDown();
        }
        return false;
      },
      onPanResponderRelease: () => {},
    });
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.scrollToPage(2);
  //   }, 100);
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate !== 0) {
      if (isSameDay(nextProps.selectedDate, this.props.selectedDate)) return;
      const nextSelectedDate = nextProps.selectedDate;
      if (!this.currentPageDatesIncludes(nextSelectedDate)) {
        const sameDay = d => isSameDay(d, nextSelectedDate);
        if (this.state.datas.find(sameDay)) {
          let selectedIndex = this.state.datas.findIndex(sameDay);
          if (selectedIndex === -1) selectedIndex = this.state.pageOfToday; // in case not find
          const selectedPage = ~~(selectedIndex / 7);
          this.scrollToPage(selectedPage);
        } else {
          // not born, then spawn these dates, then scroll to it.
          // past: born [startOfThatWeek, last]
          // future: born [first, endOfThatWeek]
          // momentumEnd() handle pageOfToday and currentPage
          if (isFuture(nextSelectedDate)) {
            const head = this.state.datas[0];
            const tail = endOfWeek(nextSelectedDate, {
              weekStartsOn: nextProps.weekStartsOn,
            });
            const days = eachDay(head, tail);
            this.setState(
              {
                datas: days,
                isTodayVisible: false,
              },
              () => {
                const page = ~~(days.length / 7 - 1);
                // to last page
                this.scrollToPage(page);
              },
            );
          } else {
            const head = startOfWeek(nextSelectedDate, {
              weekStartsOn: nextProps.weekStartsOn,
            });
            const tail = this.state.datas[this.state.datas.length - 1];
            const days = eachDay(head, tail);
            this.setState(
              {
                datas: days,
                isTodayVisible: false,
              },
              () => {
                // to first page
                this.scrollToPage(0);
              },
            );
          }
        }
      }
    }
  }

  scrollToPage = (page, animated = true) => {
    this._calendar.scrollToIndex({animated, index: 7 * page});
  };

  currentPageDatesIncludes = date => {
    const {currentPage} = this.state;
    const currentPageDates = this.state.datas.slice(
      7 * currentPage,
      7 * (currentPage + 1),
    );
    // dont use currentPageDates.includes(date); because can't compare Date in it
    return !!currentPageDates.find(d => isSameDay(d, date));
  };

  getInitialDates(weekStartsOn = 0) {
    // const todayInWeek = getDay(TODAY);
    const last2WeekOfToday = subDays(TODAY, 7 * 2);
    const next2WeekOfToday = addDays(TODAY, 7 * 2);
    const startLast2Week = startOfWeek(last2WeekOfToday, {weekStartsOn});
    const endNext2Week = endOfWeek(next2WeekOfToday, {weekStartsOn});
    const eachDays = eachDay(startLast2Week, endNext2Week);
    return eachDays;
  }

  loadNextTwoWeek(originalDates) {
    const originalFirstDate = originalDates[0];
    const originalLastDate = originalDates[originalDates.length - 1];
    const lastDayOfNext2Week = addDays(originalLastDate, 7 * 2);
    const eachDays = eachDay(originalFirstDate, lastDayOfNext2Week);
    this.setState({datas: eachDays});
  }

  loadPreviousTwoWeek(originalDates) {
    const originalFirstDate = originalDates[0];
    const originalLastDate = originalDates[originalDates.length - 1];
    const firstDayOfPrevious2Week = subDays(originalFirstDate, 7 * 2);
    const eachDays = eachDay(firstDayOfPrevious2Week, originalLastDate);
    this.setState(
      prevState => ({
        datas: eachDays,
        currentPage: prevState.currentPage + 2,
        pageOfToday: prevState.pageOfToday + 2,
      }),
      () => {
        this.scrollToPage(2, false);
      },
    );
  }

  _renderHeader = () => {
    const {
      selectedDate,
      onPressGoToday,
      isChinese,
      showWeekNumber,
    } = this.props;

    const dateFormatted_zh = format(selectedDate, 'YYYY/MM/DD [周]dd', {
      locale: ChineseLocale,
    });
    const dateFormatted_en = format(selectedDate, 'YYYY/MM/DD ddd');
    const dateFormatted = isChinese ? dateFormatted_zh : dateFormatted_en;
    const weekNumber = getISOWeek(selectedDate);
    return (
      <View style={styles.header}>
        <Text style={styles.headerDate}>{dateFormatted}</Text>
        {showWeekNumber && (
          <Text style={styles.headerDateWeek}>{` W${weekNumber}`}</Text>
        )}
        {!this.state.isTodayVisible && (
          <TouchableOpacity
            style={styles.headerGoTodayButton}
            onPress={() => {
              const page = this.state.pageOfToday;
              onPressGoToday && onPressGoToday(TODAY);
              this.scrollToPage(page);
            }}>
            <Text style={styles.todayText}>今</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  _stringToDate = dateString => {
    // '2018-01-01' => Date
    const dateArr = dateString.split('-');
    const [y, m, d] = dateArr.map(ds => parseInt(ds, 10));
    // CAVEAT: Jan is 0
    return new Date(y, m - 1, d);
  };

  render() {
    const {
      isChinese,
      markedDate,
      onPressDate,
      selectedDate,
      weekStartsOn,
      showChineseLunar,
    } = this.props;
    const {currentDate} = this.state;

    const marked = markedDate.map(ds => this._stringToDate(ds));
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        {/* this._renderHeader() */}
        <Weeks isChinese={isChinese} weekStartsOn={weekStartsOn} />
        <View /* style={{marginTop: normalize(10)}} */>
          <FlatList
            ref={ref => (this._calendar = ref)}
            bounces={false}
            horizontal
            pagingEnabled
            initialScrollIndex={14}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={this.momentumEnd}
            scrollEventThrottle={500}
            getItemLayout={(data, index) => ({
              length: ITEM_LENGTH,
              offset: ITEM_LENGTH * index,
              index,
            })}
            onEndReached={() => {
              this.onEndReached();
            }}
            onEndReachedThreshold={0.01}
            data={this.state.datas}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <DateItem
                item={item}
                showLunar={showChineseLunar}
                onItemPress={() => onPressDate && onPressDate(item)}
                highlight={isSameDay(selectedDate, item)}
                marked={marked.find(d => isSameDay(d, item))}
                currentDate={currentDate}
              />
            )}
          />
        </View>
      </View>
    );
  }

  momentumEnd = event => {
    /**
      {
        contentInset: { bottom: 0, top: 0, left: 0, right: 0 },
        zoomScale: 1,
        contentOffset: { y: 0, x: 1875 },
        layoutMeasurement: { height: 50, width: 375 },
        contentSize: { height: 50, width: 2625 }
      }
    */
    const firstDayInCalendar = this.state.datas
      ? this.state.datas[0]
      : new Date();
    const daysBeforeToday = differenceInDays(firstDayInCalendar, new Date());
    const pageOfToday = ~~Math.abs(daysBeforeToday / 7);
    const screenWidth = event.nativeEvent.layoutMeasurement.width;
    const currentPage = event.nativeEvent.contentOffset.x / screenWidth;
    this.setState({
      pageOfToday,
      currentPage,
      isTodayVisible: currentPage === pageOfToday,
    });

    // swipe to head ~ load 2 weeks
    if (event.nativeEvent.contentOffset.x < width) {
      this.loadPreviousTwoWeek(this.state.datas);
    }
  };

  onEndReached() {
    this.loadNextTwoWeek(this.state.datas);
  }
}

CalendarStrip.propTypes = {
  //selectedDate: PropTypes.object.isRequired,
  onPressDate: PropTypes.func,
  onPressGoToday: PropTypes.func,
  markedDate: PropTypes.array,
  onSwipeDown: PropTypes.func,
  isChinese: PropTypes.bool,
  showWeekNumber: PropTypes.bool,
  showChineseLunar: PropTypes.bool,
  weekStartsOn: PropTypes.number,
};

CalendarStrip.defaultProps = {
  isChinese: false,
  showWeekNumber: false,
  showChineseLunar: false,
  weekStartsOn: 0,
};

const styles = StyleSheet.create({
  container: {
    width,
    height: normalize(85),
  },
  header: {
    height: normalize(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerDate: {
    color: 'gray',
    fontSize: normalize(13),
  },
  headerDateWeek: {
    color: '#3D6DCF',
    fontSize: normalize(14),
  },
  headerGoTodayButton: {
    borderRadius: normalize(10),
    width: normalize(20),
    height: normalize(20),
    backgroundColor: '#3D6DCF',
    position: 'absolute',
    top: normalize(5),
    right: normalize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayText: {
    fontSize: normalize(12),
    color: 'white',
  },
  itemContainer: {
    width: width / 7,
    height: normalize(50),
    //borderBottomWidth: 1,
    //borderBottomColor: 'rgba(100,100,100,0.1)',
  },
  itemWrapButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemView: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    // paddingTop: normalize(4),
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
  },
  itemDateText: {
    fontSize: normalize(14),
    //lineHeight: Platform.OS === 'ios' ? normalize(19) : normalize(15),
  },
  itemLunarText: {
    fontSize: normalize(10),
  },
  itemBottomDot: {
    width: normalize(4),
    left: normalize(20),
    height: normalize(4),
    bottom: normalize(4),
    borderRadius: normalize(2),
    position: 'absolute',
  },
});

export default CalendarStrip;
