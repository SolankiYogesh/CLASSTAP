import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Platform,
} from "react-native";
import { Text, Icon, Button } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import normalize from "react-native-normalize";
import I18n from "../../utils/i18n";
import { connect } from "react-redux";
import { IMAGE_URI } from "../../utils/config";
import Loading from "../Loading";
import {
  getCoach,
  getCoachLocation,
  getRecommendedClasses,
  getCoach1,
  getCoachLocation1,
  getCoachClasses,
} from "../../actions/homeActions";
import isEmpty from "../../validation/is-empty";
import WriteReview from "../WriteReview";
import ReviewShow from "../Review/ReviewShow";
import ReadMore from "react-native-read-more-text";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Qatar");

import WriteCoachReview from "../WriteCoachReview";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export class Coach extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowWriteReview: false,
      isCoachReviewRate: false,
    };
  }

  async componentDidMount() {
    let id = await this.props.navigation.getParam("id");
    let latitude = await AsyncStorage.getItem("latitude");
    let longitude = await AsyncStorage.getItem("longitude");

    if (latitude && longitude) {
      this.props.getCoachLocation(id);
    } else {
      this.props.getCoach(id);
    }
    this.props.getCoachClasses(id);

    BackHandler.addEventListener("hardwareBackPress", this.handleBack);
    this.focusListener2 = this.props.navigation.addListener(
      "didFocus",
      async () => {
        let id = await this.props.navigation.getParam("id");
        let latitude = await AsyncStorage.getItem("latitude");
        let longitude = await AsyncStorage.getItem("longitude");

        if (latitude && longitude) {
          this.props.getCoachLocation1(id);
        } else {
          this.props.getCoach1(id);
        }
      }
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
    this.focusListener2.remove();
  }

  handleBack = async () => {
    this.props.navigation.goBack();
    /*     const back = await this.props.navigation.getParam('back');
    const back_id = await this.props.navigation.getParam('back_id');

    // this.props.clearErrors();
    if (!isEmpty(back)) {
      const classTabToken = await AsyncStorage.getItem('classTabToken');
      if (classTabToken) {
        if (back_id) {
          this.props.navigation.navigate(back, {id: back_id});
          //this.props.getClass(back_id);
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
  renderItemGym = ({ item }) => {
    const { lang } = this.props.setting;
    const { attachments, name_ar, name } = item;

    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const alignSelf = lang === "ar" ? "flex-end" : "flex-start";
    let classImage;

    if (attachments && attachments.length > 0) {
      let primaryAttachment = attachments.find(
        (newImage) => newImage.is_primary === true
      );

      if (!isEmpty(primaryAttachment)) {
        classImage = {
          uri: `${IMAGE_URI}/${primaryAttachment.dir}/${primaryAttachment.file_name}`,
        };
      } else {
        classImage = {
          uri: `${IMAGE_URI}/${attachments[0].dir}/${attachments[0].file_name}`,
        };
      }
    } else {
      classImage = require("../../assets/img/no_image_found.png");
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate({
            routeName: "GymClass",
            params: {
              id: item.id,
              back: "Coach",
              back_id: item.coach_id,
            },
            key: `GymClass_${item.id}`,
          })
        }
        style={{
          width: normalize(142),
          marginRight: normalize(10),
          height: normalize(171),
          transform: [{ scaleX: lang === "ar" ? -1 : 1 }],
        }}
      >
        <View
          style={{
            width: normalize(142),
            height: normalize(142),
            //borderRadius: 10,
          }}
        >
          <Image
            resizeMode={"cover"}
            source={classImage}
            style={{
              width: normalize(142),
              height: normalize(142),
              borderRadius: normalize(10),
            }}
          />
        </View>
        <View style={{ marginTop: normalize(5) }}>
          <Text style={{ fontSize: normalize(15), textAlign: textAlign }}>
            {lang === "ar" ? name_ar : name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _renderTruncatedFooter = (handlePress) => {
    const { lang } = this.props.setting;
    return (
      <Text
        style={{
          color: "#0053FE",
          marginTop: 5,
          fontSize: normalize(12),
          fontWeight: "bold",
        }}
        onPress={handlePress}
      >
        {I18n.t("readMore", { locale: lang })}
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    const { lang } = this.props.setting;
    return (
      <Text
        style={{
          color: "#0053FE",
          marginTop: 5,
          fontSize: normalize(12),
          fontWeight: "bold",
        }}
        onPress={handlePress}
      >
        {I18n.t("showLess", { locale: lang })}
      </Text>
    );
  };
  handleWriteCoachReview = async () => {
    const id = await this.props.navigation.getParam("id");
    const latitude = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");

    if (latitude && longitude) {
      this.props.getCoachLocation(id);
    } else {
      this.props.getCoach(id);
    }
    this.setState({ isCoachReviewRate: false });
  };
  renderReviewItem = ({ item }) => {
    const { lang } = this.props.setting;
    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const alignSelf = lang === "ar" ? "flex-end" : "flex-start";
    let image;

    if (!isEmpty(item.user) && !isEmpty(item.user.attachment)) {
      const { attachment } = item.user;
      image = {
        uri: `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`,
      };
    } else {
      image = require("../../assets/img/NoPicture.png");
    }
    return (
      <>
        <View
          style={{
            marginTop: normalize(16),
            marginHorizontal: normalize(16),
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: flexDirection,
            }}
          >
            <View style={{ width: normalize(44) }}>
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
                marginLeft: lang === "ar" ? 0 : normalize(16),
                marginRight: lang === "ar" ? normalize(16) : 0,
                width: normalize(267),
                //marginHorizontal: normalize(16),
              }}
            >
              <Text
                style={{
                  fontSize: normalize(15),
                  fontWeight: "700",
                  textAlign: textAlign,
                }}
              >
                {!isEmpty(item.user)
                  ? `${item.user.first_name} ${item.user.last_name}`
                  : ""}
              </Text>
              <View
                style={[
                  styles.classRatingContainer,
                  { flexDirection: flexDirection },
                ]}
              >
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
                }}
              >
                {item.description}
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: "#8A8A8F",
                  textAlign: textAlign,
                }}
              >
                {moment(item.createdAt, "YYYY-MM-DD hh:mm:ss")
                  .startOf("hour")
                  .fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };
  handleWriteReview = async () => {
    const { lang } = this.props.setting;
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t("login", { locale: lang }),
        I18n.t("loginToProceed", { locale: lang }),
        [
          {
            text: I18n.t("no", { locale: lang }),
            onPress: () => console.log("come"),
            style: "cancel",
          },
          {
            text: I18n.t("yes", { locale: lang }),
            onPress: () => this.props.navigation.navigate("Login"),
          },
        ],
        {
          cancelable: false,
        }
      );
    } else {
      this.setState({ isCoachReviewRate: true });
    }
  };
  render() {
    const { isCoachReviewRate } = this.state;
    const { coachClasses } = this.props.home;
    const {
      id,
      name,
      name_ar,
      description,
      description_ar,
      class_count,
      rating_count,
      rating_avg,
      attachment,
      // classes,
      participants,
      class_schedules,
      coach_reviews,
    } = this.props.home.coach;

    /*  let classes = [];
    if (!isEmpty(class_schedules)) {
      classes = class_schedules.map(schedule => {
        return schedule.class;
      });
      jsonObject = classes.map(JSON.stringify);

      uniqueSet = new Set(jsonObject);
      uniqueArray = Array.from(uniqueSet).map(JSON.parse);
      classes = uniqueArray;
    } */

    const { lang } = this.props.setting;
    const { user } = this.props.auth;

    const image = attachment
      ? {
          uri: `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`,
        }
      : require("../../assets/img/no_image_found.png");
    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const alignSelf = lang === "ar" ? "flex-end" : "flex-start";
    const { isLodaing } = this.props.errors;
    return (
      <>
        {isLodaing ? (
          <Loading />
        ) : (
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ImageBackground
                source={image}
                style={styles.welcomeImage}
                resizeMode="cover"
              >
                <View
                  style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "row",
                    top: Platform.OS === "ios" ? normalize(40) : normalize(10),
                    ///left: normalize(10),
                  }}
                >
                  <TouchableOpacity
                    onPress={this.handleBack}
                    style={{ flexDirection: "row", marginLeft: normalize(10) }}
                  >
                    <Icon
                      type="FontAwesome"
                      name="angle-left"
                      style={{
                        fontSize: normalize(18),
                        color: "#ffffff",
                      }}
                      //style={styles.backButtonIcon}
                    />
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: normalize(14),
                        marginLeft: normalize(10),
                      }}
                    >
                      {I18n.t("back", { locale: lang })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  marginTop: normalize(-76),
                  backgroundColor: "#ffffff",
                  borderTopStartRadius: 16,
                  borderTopEndRadius: 16,
                }}
              >
                <View
                  style={{
                    marginTop: normalize(30),
                    marginHorizontal: normalize(16),
                  }}
                >
                  <Text
                    style={{
                      fontSize: normalize(40),
                      color: "#231F20",
                      fontWeight: "bold",
                      textAlign: textAlign,
                    }}
                  >
                    {lang === "ar" ? name_ar : name}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: normalize(6),
                    marginHorizontal: normalize(16),
                    borderBottomWidth: 1,
                    borderBottomColor: "#EFEFF4",
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  display: "flex",
                  flexDirection: flexDirection,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("CoachClass", {
                      id,
                      back: "Coach",
                      back_id: id,
                    })
                  }
                >
                  <Text style={{ fontSize: normalize(12), color: "#8A8A8F" }}>
                    {I18n.t("classes", { locale: lang })}
                  </Text>
                  <Text style={{ fontSize: normalize(22), fontWeight: "bold" }}>
                    {coachClasses.length}
                  </Text>
                </TouchableOpacity>
                <View>
                  <Text style={{ fontSize: normalize(12), color: "#8A8A8F" }}>
                    {I18n.t("participants", { locale: lang })}
                  </Text>
                  <Text style={{ fontSize: normalize(22), fontWeight: "bold" }}>
                    {participants}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: normalize(12), color: "#8A8A8F" }}>
                    {I18n.t("RATING", { locale: lang })} {rating_avg} (
                    {rating_count})
                  </Text>
                  <View
                    style={[
                      styles.classRatingContainer,
                      { flexDirection: flexDirection },
                    ]}
                  >
                    <ReviewShow
                      rating={rating_avg}
                      style={{
                        fontSize: normalize(15),
                        paddingRight: normalize(2.75),
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.aboutContainer, { alignSelf: alignSelf }]}>
                <Text style={styles.aboutContainerText}>
                  {I18n.t("aboutCoach", { locale: lang })}
                </Text>
              </View>
              <View
                style={[styles.aboutContentContainer, { alignSelf: alignSelf }]}
              >
                {/*  <Text
                  style={[
                    styles.aboutContentContainerText,
                    {textAlign: textAlign},
                  ]}>
                  {lang === 'ar' ? description_ar : description}
                </Text> */}
                <ReadMore
                  numberOfLines={3}
                  renderTruncatedFooter={this._renderTruncatedFooter}
                  renderRevealedFooter={this._renderRevealedFooter}
                  onReady={this._handleTextReady}
                >
                  <Text
                    style={[
                      styles.aboutContentContainerText,
                      { textAlign: textAlign },
                    ]}
                  >
                    {lang === "ar" ? description_ar : description}
                  </Text>
                </ReadMore>
              </View>
              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  flexDirection: flexDirection,
                }}
              >
                <Text style={{ fontSize: normalize(20), fontWeight: "bold" }}>
                  {I18n.t("topCourses", { locale: lang })}
                  {lang === "ar" ? name_ar : name}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: normalize(16),
                  marginVertical: normalize(16),
                  flexDirection: flexDirection,
                }}
              >
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    width: width,
                    height: normalize(171),
                    //scaleX: -1,
                    transform: [{ rotateY: lang === "ar" ? "180deg" : "0deg" }],
                    //flexDirection: flexDirection,
                  }}
                >
                  {coachClasses.length > 0 ? (
                    <FlatList
                      horizontal={true}
                      style={[styles.container]}
                      data={coachClasses}
                      renderItem={this.renderItemGym}
                      keyExtractor={(item) => item.id.toString()}
                      contentContainerStyle={
                        {
                          /*  marginRight:
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
                        transform: [{ scaleX: lang === "ar" ? -1 : 1 }],
                        backgroundColor: "#efefef",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: normalize(10),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: normalize(16),
                          color: "#8f8f8f",
                          textAlign: "center",
                        }}
                      >
                        {I18n.t("noTopCourses", { locale: lang })}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
              {/* Start Reviews */}
              <View
                style={{
                  marginTop: normalize(6),
                  marginHorizontal: normalize(16),
                  borderBottomWidth: 1,
                  borderBottomColor: "#EFEFF4",
                }}
              />
              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  display: "flex",
                  flex: 1,
                  flexDirection: flexDirection,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: normalize(20),
                      fontWeight: "700",
                      color: "#22242A",
                    }}
                  >
                    {rating_count} {I18n.t("reviews", { locale: lang })}
                  </Text>
                </View>
                {coach_reviews && coach_reviews.length > 0 ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("CoachReview", {
                        coach_id: id,
                        handleReviews: (data) => this.handleAllReviews(data),
                      })
                    }
                  >
                    <Text
                      style={{
                        marginTop: normalize(7),
                        fontSize: normalize(13),
                        color: "#8A8A8F",
                        justifyContent: "center",
                      }}
                    >
                      {I18n.t("readAll", { locale: lang })}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={this.handleWriteReview}>
                    <Text
                      style={{
                        marginTop: normalize(7),
                        fontSize: normalize(13),
                        color: "#0053FE",
                        justifyContent: "center",
                      }}
                    >
                      {I18n.t("writeReview", { locale: lang })}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {coach_reviews && coach_reviews.length > 0 ? (
                <FlatList
                  style={[styles.container]}
                  data={coach_reviews}
                  renderItem={this.renderReviewItem}
                  keyExtractor={(item) => item.id.toString()}
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
                  borderBottomColor: "#EFEFF4",
                }}
              />
              {/* End Reviews */}
              {/* <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('CoachClass', {
                    id,
                    back: 'Coach',
                    back_id: id,
                  })
                }
                style={{
                  height: normalize(48),
                  marginVertical: normalize(9),
                  marginHorizontal: normalize(32),
                  borderRadius: normalize(24),
                  backgroundColor: '#FE9800',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: normalize(30),
                }}>
                <Text
                  style={{
                    fontSize: normalize(16),
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                  }}>
                  {I18n.t('topCourses', {locale: lang})}{lang === 'ar' ? name_ar : name}
                </Text>
              </TouchableOpacity> */}
            </ScrollView>
            <WriteCoachReview
              isShowWriteReview={isCoachReviewRate}
              handleWriteReview={this.handleWriteCoachReview}
              coach_id={id}
              //class_schedule_id={class_schedule_id}
              //schedule_dates_id={schedule_dates_id}
            />
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    //flex: 2,
    alignItems: "stretch",
    //height: 250,
  },
  welcomeImage: {
    //flex: 1,
    //height: normalize(height * 0.4),
    height: Platform.OS === "ios" ? normalize(300) : normalize(260),
    width: width,
  },
  classRatingContainer: {
    display: "flex",
    //flexDirection: 'row',
  },
  classStarIcon: {
    fontSize: normalize(15),
    color: "#FE9800",
    paddingRight: normalize(2.75),
  },
  aboutContainer: {
    marginTop: normalize(20),
    marginHorizontal: normalize(16),
  },
  aboutContainerText: {
    marginTop: normalize(12),
    fontSize: normalize(14),
    //fontWeight: '700',
    color: "#8A8A8F",
  },
  aboutContentContainer: {
    marginTop: normalize(6),
    marginHorizontal: normalize(16),
  },
  aboutContentContainerText: {
    fontSize: normalize(12),
    //color: '#8A8A8F',
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  home: state.home,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getCoach,
  getCoachLocation,
  getRecommendedClasses,
  getCoach1,
  getCoachLocation1,
  getCoachClasses,
})(Coach);
