import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  BackHandler,
  Linking,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import normalize from "react-native-normalize";
import { Icon, Button } from "native-base";
import { connect } from "react-redux";
import I18n from "../../utils/i18n";
import { getCategoryClasses } from "../../actions/homeActions";
import Loading from "../Loading";
import { IMAGE_URI, API_URI } from "../../utils/config";
import isEmpty from "../../validation/is-empty";
import ReviewShow from "../Review/ReviewShow";
import moment from "moment";
import HeaderComponent from "../../components/Header";
import axios from "axios";
import ConfirmBooking from "../ConfirmBooking";

const { width } = Dimensions.get("window");

export class CategoryClass extends Component {
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
    const id = await this.props.navigation.getParam("id");
    const latitude = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");
    let url = `${API_URI}/classes?filter={"inClass": {"is_active": 1},"inClassCategory": {"category_id": ${id}}}`;
    if (latitude && longitude) {
      url = `${url}&latitude=${latitude}&longitude=${longitude}`;
    }

    await axios
      .get(url)
      .then((res) => {
        if (res.data.error.code) {
        } else {
          const { data } = res.data;

          this.setState({ categoryClasses: data, isLoading: false });
          return true;
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
      });

    BackHandler.addEventListener("hardwareBackPress", this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
  }

  handleNavigateGymCategoryClass = (e, id) => {
    e.preventDefault();
    this.props.navigation.navigate({
      routeName: "GymClass",
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
  renderItem = ({ item }) => {
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

    const { lang } = this.props.setting;
    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const alignSelf = lang === "ar" ? "flex-end" : "flex-start";
    let image;

    if (attachments && attachments.length > 0) {
      let primaryAttachment = attachments.find(
        (newImage) => newImage.is_primary === true
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
      image = require("../../assets/img/no_image_found.png");
    }
    let scheduleDates = [];
    class_schedules.map((schedule) => {
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
        onPress={(e) => this.handleNavigateGymCategoryClass(e, id)}
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
          display: "flex",
          flexDirection: flexDirection,
          marginTop: normalize(16),
          marginHorizontal: normalize(16),
        }}
      >
        <View style={{ display: "flex", width: normalize(60) }}>
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
            display: "flex",
            flexDirection: flexDirection,
            width: normalize(267),
            marginLeft: normalize(20),
            justifyContent: "space-between",
          }}
        >
          <View
            style={
              {
                //width: normalize(200),
                //marginLeft: lang === 'ar' ? 0 : normalize(18),
                //marginRight: lang === 'ar' ? normalize(18) : 0,
              }
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: flexDirection,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: normalize(17),
                    fontWeight: "700",
                    textAlign: textAlign,
                  }}
                >
                  {lang === "ar" ? name_ar : name}
                </Text>

                <Text style={{ fontSize: normalize(12), color: "#8A8A8F" }}>
                  {/* {this.diff(start_time, end_time)} */} {/* .{' '} */}
                  {distance
                    ? distance >= 1
                      ? `${distance.toFixed(2)} km`
                      : `${distance.toFixed(3) * 1000} m`
                    : ""}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.classRatingContainer,
                { marginTop: normalize(6), flexDirection: flexDirection },
              ]}
            >
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
              display: "flex",
              justifyContent: "flex-end",
              //width: normalize(65)
            }}
          >
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
                color: "#8A8A8F",
                textAlign: "center",
              }}
            >
              {!isEmpty(scheduleDates) && scheduleDates[0].credits > 0
                ? `${!isEmpty(scheduleDates) ? scheduleDates[0].credits : 0} ${
                    !isEmpty(scheduleDates) && scheduleDates[0].credits > 1
                      ? I18n.t("credits", {
                          locale: lang,
                        })
                      : I18n.t("credit", {
                          locale: lang,
                        })
                  }`
                : I18n.t("free", {
                    locale: lang,
                  })}
            </Text>
            <TouchableOpacity
              onPress={(e) => this.handleNavigateGymCategoryClass(e, id)}
              //onPress={() => this.handleConfirmBooking(item)}
              style={{
                alignSelf: "flex-end",
                alignItems: "center",
                justifyContent: "center",
                width: normalize(62),
                height: normalize(27),
                backgroundColor: "#FE9800",
                borderRadius: normalize(14),
                marginTop: normalize(10),
              }}
            >
              <Text
                style={{
                  fontSize: normalize(12),
                  color: "#FFFFFF",
                }}
              >
                {I18n.t("book", { locale: lang })}
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
    start = start.split(":");
    end = end.split(":");
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
    const { lang } = this.props.setting;
    const { isLodaing } = this.props.errors;
    const { categoryClasses, isLoading } = this.state;

    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const alignSelf = lang === "ar" ? "flex-end" : "flex-start";

    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <HeaderComponent navigation={this.props.navigation} />
            {/* <StatusBar hidden={true} /> */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: "#ffffff" }}
            >
              <View style={[styles.titleContainer, { alignSelf: alignSelf }]}>
                <Text
                  style={[styles.titleContainerText, { textAlign: textAlign }]}
                >
                  {this.props.navigation.getParam("categoryName")}
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
                  }
                >
                  {categoryClasses.length > 0 ? (
                    <FlatList
                      style={[styles.container]}
                      data={categoryClasses}
                      renderItem={this.renderItem}
                      keyExtractor={(item) => item.id.toString()}
                      contentContainerStyle={{
                        marginBottom: normalize(10),
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        marginHorizontal: normalize(16),
                      }}
                    >
                      <Text
                        style={{
                          color: "#8f8f8f",
                          fontSize: normalize(16),
                          textAlign: textAlign,
                        }}
                      >
                        {I18n.t("noClasses", { locale: lang })}
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
  container: {
    flex: 1,
  },
  ratingFavContainer: {
    backgroundColor: "#F9F9F9",
    height: normalize(56),
    display: "flex",
    //flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: normalize(16),
  },
  ratingContainer: {
    flex: 2,
    display: "flex",
    //flexDirection: 'row',
  },
  starIcon: {
    fontSize: normalize(18),
    color: "#FE9800",
    //paddingRight: normalize(4),
  },
  classRatingContainer: {
    display: "flex",
    //flexDirection: 'row',
  },
  classStarIcon: {
    fontSize: normalize(11),
    color: "#FE9800",
    paddingRight: normalize(2.75),
  },
  ratingCountText: {
    color: "#8A8A8F",
    fontSize: normalize(14),
  },
  favMapContainer: {
    flex: 1,
    display: "flex",
    //flexDirection: 'row',
    justifyContent: "flex-end",
  },
  genderContainer: {
    marginTop: normalize(11),
    width: normalize(108),
    height: normalize(20),
    backgroundColor: "#F9F9F9",
    borderRadius: normalize(10),
    marginHorizontal: normalize(16),
    alignItems: "center",
    justifyContent: "center",
  },
  genderContainerText: {
    fontSize: normalize(12),
    color: "#8A8A8F",
  },
  titleContainer: {
    marginHorizontal: normalize(16),
    marginBottom: normalize(10),
  },
  titleContainerText: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: "#22242A",
  },
  aboutContainer: {
    marginHorizontal: normalize(16),
  },
  aboutContainerText: {
    marginTop: normalize(12),
    fontSize: normalize(14),
    fontWeight: "700",
    color: "#22242A",
  },
  aboutContentContainer: {
    marginTop: normalize(6),
    marginHorizontal: normalize(16),
  },
  aboutContentContainerText: {
    fontSize: normalize(12),
    color: "#8A8A8F",
  },
  classTitleContainer: {
    marginTop: normalize(12),
    marginHorizontal: normalize(16),
  },
  classTitleContainerText: {
    fontSize: normalize(20),
    color: "#22242A",
    fontWeight: "bold",
  },
  distanceContainer: {
    position: "absolute",
    bottom: normalize(10),
    left: normalize(10),
  },
  distanceContainerArabic: {
    position: "absolute",
    bottom: normalize(10),
    right: normalize(10),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  home: state.home,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, { getCategoryClasses })(CategoryClass);
