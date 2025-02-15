import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  BackHandler,
  Platform,
} from "react-native";
import FastImage from "@d11/react-native-fast-image";

import { connect } from "react-redux";
import normalize from "react-native-normalize";
import { Item, Input, Icon } from "native-base";
import { clearErrors } from "../../actions/errorAction";
import { getGyms, getClasses } from "../../actions/homeActions";
import { getSearchFindClasses } from "../../actions/findClassActions";

import FilterIcon from "../../assets/img/filter.svg";
import FilterSearchIcon from "../../assets/img/filter_search.svg";
import ListIcon from "../../assets/img/list.svg";

import CalendarStrip from "../../react-native-slideable-calendar-strip";
import ReviewShow from "../Review/ReviewShow";
import { IMAGE_URI } from "../../utils/config";
import isEmpty from "../../validation/is-empty";
import I18n from "../../utils/i18n";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import Carousel from "react-native-snap-carousel";
import Loading from "../Loading";

import RNAndroidLocationEnabler from "react-native-android-location-enabler";

const { width } = Dimensions.get("window");

export class FindClassMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      selectedDate: new Date(),
      markers: [],
      //initialPosition: {},
    };
  }
  componentDidMount() {
    this.props.getGyms();
    this.props.getClasses();
    this.requestLocationPermission();
    BackHandler.addEventListener("hardwareBackPress", this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
  }

  handleBack = async () => {
    this.props.navigation.goBack();
    return true;
  };

  searchSubmit = (e) => {
    e.preventDefault();
    const { search } = this.state;

    this.props.getSearchFindClasses(search);
  };
  handleChangeText = (name, value) => {
    this.props.clearErrors();
    this.setState({ [name]: value });
  };

  renderItemGym = ({ item }) => {
    const { lang } = this.props.setting;
    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const alignSelf = lang === "ar" ? "flex-end" : "flex-start";
    const { id, name, name_ar, attachments, distance } = item;
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
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("Gym", { id, back: "Favorities" })
        }
        style={{
          width: normalize(120),
          marginRight: normalize(10),
          height: normalize(163),
          transform: [{ rotateY: lang === "ar" ? "180deg" : "0deg" }],
        }}
      >
        <View
          style={{
            width: normalize(120),
            height: normalize(118),
            //borderRadius: 10,
          }}
        >
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
              resizeMode={"cover"}
              source={image}
              style={{
                width: normalize(120),
                height: normalize(118),
                borderRadius: normalize(10),
              }}
            />
          )}
        </View>
        <View style={{ marginTop: normalize(8) }}>
          <Text style={{ fontSize: normalize(13), textAlign: textAlign }}>
            {lang === "ar" ? name_ar : name}
          </Text>
          <View
            style={[
              styles.classRatingContainer,
              { flexDirection: flexDirection, marginTop: normalize(5) },
            ]}
          >
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

  renderItem = ({ item }) => {
    const { id, name, name_ar, attachments, credits, start_time, end_time } =
      item;
    const { distance } = this.props.home.gym;

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
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("GymClass", { id, back: "Gym" })
        }
        style={{
          display: "flex",
          flexDirection: flexDirection,
          marginTop: normalize(16),
          marginHorizontal: normalize(16),
        }}
      >
        <View style={{ display: "flex", width: normalize(60) }}>
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
              resizeMode={"cover"}
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
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontSize: normalize(12), color: "#8A8A8F" }}>
                    {this.diff(start_time, end_time)}
                    {"  "}
                  </Text>
                  <View style={{ justifyContent: "center" }}>
                    <Icon
                      type="FontAwesome"
                      name="circle"
                      style={{
                        fontSize: normalize(5),
                        color: "#C8C7CC",
                        textAlign: "center",
                      }}
                    />
                  </View>

                  <Text style={{ fontSize: normalize(12), color: "#8A8A8F" }}>
                    {"  "}
                    {distance
                      ? distance >= 1
                        ? `${distance.toFixed(2)} km`
                        : `${distance.toFixed(3) * 1000} m`
                      : ""}
                  </Text>
                </View>
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
            <Text style={{ fontSize: normalize(14), color: "#8A8A8F" }}>
              {`${credits} ${I18n.t("credits", { locale: lang })}`}
            </Text>
            <TouchableOpacity
              style={{
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

  requestLocationPermission = async () => {
    const { lang } = this.props.setting;
    if (Platform.OS === "ios") {
      await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          if (result === "denied" || "blocked") {
            request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
              if (result === "granted") {
                this.locateCurrentPosition();
              } else {
                Alert.alert(
                  I18n.t("location", { locale: lang }),
                  I18n.t("enableLocation", { locale: lang }),
                  [
                    {
                      text: I18n.t("no", { locale: lang }),
                      onPress: () => this.props.navigation.goBack(),
                      style: "cancel",
                    },
                    {
                      text: I18n.t("yes", { locale: lang }),
                      onPress: () => this.handleEnalbelLocation(),
                    },
                  ],
                  {
                    cancelable: false,
                  }
                );
              }
            });
          } else if (result === "granted") {
            this.locateCurrentPosition();
          }
        })
        .catch((error) => {
          // …
        });
    } else {
      await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then((result) => {
          if (result === "denied") {
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
              if (result === "granted") {
                this.locateCurrentPosition();
              } else {
                Alert.alert(
                  I18n.t("location", { locale: lang }),
                  I18n.t("enableLocation", { locale: lang }),
                  [
                    {
                      text: I18n.t("no", { locale: lang }),
                      onPress: () => this.props.navigation.goBack(),
                      style: "cancel",
                    },
                    {
                      text: I18n.t("yes", { locale: lang }),
                      onPress: () => this.handleEnalbelLocation(),
                    },
                  ],
                  {
                    cancelable: false,
                  }
                );
              }
            });
          } else if (result === "granted") {
            this.locateCurrentPosition();
          }
        })
        .catch((error) => {
          // …
        });
    }
  };

  locateCurrentPosition = () => {
    const { lang } = this.props.setting;
    Geolocation.getCurrentPosition(
      (position) => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.22,
          longitudeDelta: 0.035,
        };
        this.setState({ initialPosition: region });
      },
      (error) =>
        Alert.alert(
          I18n.t("location", { locale: lang }),
          I18n.t("enableLocation", { locale: lang }),
          [
            {
              text: I18n.t("no", { locale: lang }),
              onPress: () => this.props.navigation.goBack(),
              style: "cancel",
            },
            {
              text: I18n.t("yes", { locale: lang }),
              onPress: () => this.handleGpsLocation(),
            },
          ],
          {
            cancelable: false,
          }
        ),
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  };

  handleGpsLocation = () => {
    if (Platform.OS === "ios") {
      //Alert.alert('ssddfdd');
    } else {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then((data) => {
          if (data === "enabled") {
            this.locateCurrentPosition();
          }
        })
        .catch((err) => {
          if (err.code === "ERR00") {
            this.props.navigation.goBack();
          }

          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
        });
    }
  };

  handleEnalbelLocation = async () => {
    const { lang } = this.props.setting;
    if (Platform.OS === "ios") {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
        if (result === "granted") {
          this.locateCurrentPosition();
        } else {
          Alert.alert(
            I18n.t("location", { locale: lang }),
            I18n.t("enableLocation", { locale: lang }),
            [
              {
                text: I18n.t("no", { locale: lang }),
                onPress: () => console.log("cancel"),
                style: "cancel",
              },
              {
                text: I18n.t("yes", { locale: lang }),
                onPress: () => this.handleEnalbelLocation(),
              },
            ],
            {
              cancelable: false,
            }
          );
        }
      });
    } else {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
        if (result === "granted") {
          this.locateCurrentPosition();
        } else {
          Alert.alert(
            I18n.t("location", { locale: lang }),
            I18n.t("enableLocation", { locale: lang }),
            [
              {
                text: I18n.t("no", { locale: lang }),
                onPress: () => console.log("cancel"),
                style: "cancel",
              },
              {
                text: I18n.t("yes", { locale: lang }),
                onPress: () => this.handleEnalbelLocation(),
              },
            ],
            {
              cancelable: false,
            }
          );
        }
      });
    }
  };

  renderCarouselItem = ({ item }) => {
    const { lang } = this.props.setting;
    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const alignSelf = lang === "ar" ? "flex-end" : "flex-start";
    const {
      id,
      name,
      name_ar,
      attachments,
      rating_avg,
      rating_count,
      distance,
    } = item;
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
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate({
            routeName: "GymClass",
            params: {
              id: id,
            },
            key: `GymClassesSearchMap_${Math.random() * 10000}`,
          })
        }
        style={{
          paddingTop: normalize(13),
          paddingBottom: normalize(13),
          paddingLeft: normalize(10),
          //position: 'absolute',
          backgroundColor: "#ffffff",
          width: normalize(336),
          //marginRight: normalize(10),
          height: normalize(104),
          //transform: [{rotateY: lang === 'ar' ? '180deg' : '0deg'}],
          borderRadius: normalize(12),
          flexDirection: flexDirection,
        }}
      >
        <View style={{ flex: 1, flexDirection: flexDirection }}>
          <View
            style={{
              marginRight: normalize(13),
              width: normalize(113),
              height: normalize(78),
            }}
          >
            {image.url ? (
              <FastImage
                style={{
                  width: normalize(113),
                  height: normalize(78),
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
                resizeMode={"cover"}
                source={image}
                style={{
                  width: normalize(113),
                  height: normalize(78),
                  borderRadius: normalize(10),
                }}
              />
            )}
          </View>
          <View
            style={{
              flex: 1,
              marginHorizontal: normalize(3),
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                color: "#22242A",
                fontSize: normalize(16),
                fontWeight: "bold",
                lineHeight: normalize(20),
                textAlign: textAlign,
              }}
            >
              {lang === "ar" ? name_ar : name}
            </Text>

            <View
              style={[
                styles.classRatingContainer,
                {
                  flexDirection: flexDirection,
                  //marginTop: normalize(5),
                  // marginBottom: normalize(5),
                },
              ]}
            >
              <ReviewShow
                rating={rating_avg}
                style={{
                  fontSize: normalize(11),
                  paddingRight: normalize(2.75),
                }}
              />

              <Text style={styles.gymRatingCountText}>({rating_count})</Text>
            </View>
            <Text
              style={{
                fontSize: normalize(12),
                color: "#8A8A8F",
                textAlign: textAlign,
              }}
            >
              {distance
                ? distance >= 1
                  ? `${distance.toFixed(2)} km`
                  : `${distance.toFixed(3) * 1000} m`
                : ""}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  onCarouselItemChange = (index) => {
    // let location = this.state.coordinates[index];
    let gymClass = this.props.findClass.findClasses[index];

    this._map.animateToRegion({
      latitude: gymClass.lattitude,
      longitude: gymClass.longitute,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
    this.state.markers[index].showCallout();
  };

  onMarkerPressed = (gymClass, index) => {
    this._map.animateToRegion({
      latitude: gymClass.lattitude,
      longitude: gymClass.longitute,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
    this._carousel.snapToItem(index);
  };

  render() {
    const { search, initialPosition } = this.state;
    const { findClasses } = this.props.findClass;
    const { lang } = this.props.setting;
    const { isLodaing } = this.props.errors;
    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const alignSelf = lang === "ar" ? "flex-end" : "flex-start";
    return (
      <SafeAreaView
        style={[styles.mainContainer, { backgroundColor: "#ffffff" }]}
      >
        <View
          style={{
            marginTop: normalize(20),
            marginHorizontal: normalize(16),
            flexDirection: flexDirection,
          }}
        >
          <Text
            style={{
              fontSize: normalize(40),
              fontWeight: "bold",
              color: "#231F20",
              textAlign: textAlign,
            }}
          >
            {I18n.t("findClass", { locale: lang })}
          </Text>
        </View>
        <View
          style={{
            marginTop: normalize(16),
            marginHorizontal: normalize(16),
            flexDirection: flexDirection,
          }}
        >
          <Item
            style={{
              backgroundColor: "#EFEFF4",
              width: normalize(263),
              height: normalize(36),
              borderRadius: normalize(10),
              paddingLeft: normalize(10),
              borderBottomWidth: 0,
              flexDirection: flexDirection,
            }}
          >
            <FilterSearchIcon width={normalize(20)} height={normalize(20)} />
            <Input
              placeholder={I18n.t("search", { locale: lang })}
              placeholderTextColor="#8A8A8F"
              style={{
                fontSize: normalize(14),
                textAlign: textAlign,
                flexDirection: "row",
              }}
              returnKeyLabel="Search"
              returnKeyType="search"
              onSubmitEditing={this.searchSubmit}
              value={search}
              onChangeText={(val) => this.handleChangeText("search", val)}
            />
          </Item>
          <View
            style={{
              // marginLeft: normalize(16),
              flexDirection: flexDirection,
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ display: "flex" }}
              onPress={() => this.props.navigation.navigate("FindClass")}
            >
              <ListIcon
                width={normalize(24)}
                height={normalize(24)}
                style={{ marginHorizontal: normalize(16) }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ display: "flex" }}
              onPress={() => this.props.navigation.navigate("Filter")}
            >
              <FilterIcon width={normalize(24)} height={normalize(24)} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            //
            {
              flex: 1,
              marginTop: normalize(16),
            },
          ]}
        >
          {initialPosition ? (
            <>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                ref={(map) => (this._map = map)}
                showsUserLocation={true}
                style={styles.map}
                initialRegion={initialPosition}
              >
                {findClasses.map((gymClass, index) => (
                  <Marker
                    key={gymClass.name}
                    ref={(ref) => (this.state.markers[index] = ref)}
                    onPress={() => this.onMarkerPressed(gymClass, index)}
                    coordinate={{
                      latitude: gymClass.lattitude,
                      longitude: gymClass.longitute,
                    }}
                    title={gymClass.name}
                    //description={marker.name}
                  />
                ))}
              </MapView>
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={findClasses}
                renderItem={this.renderCarouselItem}
                sliderWidth={width}
                itemWidth={normalize(336)}
                containerCustomStyle={styles.carousel}
                removeClippedSubviews={false}
                onSnapToItem={(index) => this.onCarouselItemChange(index)}
                contentContainerCustomStyle={{ marginLeft: normalize(-10) }}
              />
            </>
          ) : (
            <Loading />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  classRatingContainer: {
    display: "flex",
    alignItems: "center",

    //flexDirection: 'row',
  },
  classStarIcon: {
    fontSize: normalize(11),
    color: "#FE9800",
    paddingRight: normalize(2.75),
  },
  gymRatingCountText: {
    color: "#8A8A8F",
    fontSize: normalize(12),
  },
  moveRight: {
    right: normalize(10),
  },
  moveLeft: {
    left: normalize(10),
  },
  map: {
    // height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: "absolute",
    //left: -10,

    bottom: 0,

    //marginRight: 0,
    // paddingRight: 0,
    marginBottom: normalize(10),
    //paddingLeft: 0,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  findClass: state.findClass,
  home: state.home,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getGyms,
  clearErrors,
  getClasses,
  getSearchFindClasses,
})(FindClassMap);
