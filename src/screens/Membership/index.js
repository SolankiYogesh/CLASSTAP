import React, { Component } from "react";
import {
  Text,
  View,
  BackHandler,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { Container, Header, Icon, Left, Button, Body } from "native-base";
import normalize from "react-native-normalize";
import PageSlider from "../../components/PageSlider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import isEmpty from "../../validation/is-empty";
import { clearErrors } from "../../actions/errorAction";
import {
  getSubscriptions,
  addUserSubscription,
} from "../../actions/subscriptionActions";
import I18n from "../../utils/i18n";
import PaymentWeb from "../../components/PaymentWeb";
import { API_URI } from "../../utils/config";
import axios from "axios";
import PaymentSuccess from "../../components/PaymentSuccess";
import Loading from "../Loading";
import { currentUser } from "../../actions/authActions";
import Toast from "react-native-toast-notifications";

export class Membership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectPackage: "",
      activePackage: "",
      selectIndex: 0,
      isShowPaymentWeb: false,
      url: "",
      isShowPaymentSuccess: false,
      title: "",
      isLoading: false,
      class_id: "",
      isShowRenew: false,
      count: 0,
      isLastPackage: false,
      lastPackageIndex: "",
      isGo: false,
    };
  }
  async componentDidMount() {
    //this.props.clearErrors();
    BackHandler.addEventListener("hardwareBackPress", this.handleBack);
    this.props.getSubscriptions();
    const class_id = await this.props.navigation.getParam("class_id");
    const class_schedule_id = await this.props.navigation.getParam(
      "class_schedule_id"
    );
    const schedule_dates_id = await this.props.navigation.getParam(
      "schedule_dates_id"
    );
    const subscription_id = await this.props.navigation.getParam(
      "subscription_id"
    );
    const credits = await this.props.navigation.getParam("credits");
    const { subscriptions } = this.props.subscription;

    if (subscription_id) {
      let subscription = await subscriptions.find(
        (sub) => sub.id === subscription_id
      );

      let price = subscription.price;
      let newSubscriptions = await subscriptions.filter(
        (sub) => sub.price > price
      );
      if (!isEmpty(newSubscriptions)) {
        newSubscriptions = await newSubscriptions.sort(function (a, b) {
          return a.price - b.price;
        });
        let index = await subscriptions.findIndex(
          (sub) => sub.id === newSubscriptions[0].id
        );
        this.setState({
          // selectPackage: newSubscriptions[0].id,
          selectIndex: index,
          class_id: class_id,
          isLastPackage: false,
          lastPackageIndex: "",
        });
      } else {
        let index = await subscriptions.findIndex(
          (sub) => sub.id === subscription.id
        );
        this.setState({
          // selectPackage: subscription.id,
          selectIndex: index,
          class_id: class_id,
          isLastPackage: true,
          lastPackageIndex: index,
        });
      }
    } else {
      let type = await this.props.navigation.getParam("type");
      if (type === "new") {
        this.setState({
          class_id: class_id,
        });
      } else {
        const { user } = this.props.auth;
        let index = await subscriptions.findIndex(
          (sub) => sub.id === user.subscription_id
        );
        let price = subscriptions[index].price;
        let newSubscriptions = await subscriptions.filter(
          (sub) => sub.price > price
        );
        if (!isEmpty(newSubscriptions)) {
          this.setState({
            //selectPackage: user.subscription_id,
            selectIndex: index,
            isGo: true,
            isLastPackage: false,
          });
        } else {
          this.setState({
            // selectPackage: user.subscription_id,
            selectIndex: index,
            isGo: true,
            isLastPackage: true,
            lastPackageIndex: index,
          });
        }
      }
    }
    const { user } = this.props.auth;
    if (user.subscription_validity) {
      let GivenDate = await user.subscription_validity;
      date = GivenDate.split(" ");
      let CurrentDate = new Date();
      GivenDate = new Date(date[0]);
      if (GivenDate < CurrentDate) {
        this.setState({ isShowRenew: true });
      }
    }
  }

  handleBack = async (back) => {
    this.props.navigation.goBack();
    return true;
  };

  handleBackButtonClick = () => {
    this.props.navigation.goBack();
    return true;
  };
  handleUpgradePlanBooking = async (e) => {
    e.preventDefault();

    const { subscriptions } = this.props.subscription;
    const { lang } = this.props.setting;
    const { selectPackage } = this.state;
    const subscription = subscriptions.find(
      (subc) => subc.id === selectPackage
    );
    const { user } = this.props.auth;

    if (!isEmpty(selectPackage)) {
      Alert.alert(
        I18n.t("message", { locale: lang }),
        I18n.t("upgradeMessage", { locale: lang }),
        [
          {
            text: I18n.t("no", { locale: lang }),
            onPress: () => console.log("come"),
            style: "cancel",
          },
          {
            text: I18n.t("yes", { locale: lang }),
            onPress: () => {
              let addData = {
                language: lang,
                user_id: user.id,
                subscription_id: selectPackage,
              };
              this.setState({ isLoading: true });

              axios
                .post(`${API_URI}/user_subscriptions`, addData)
                .then((res) => {
                  if (res.data.error.code) {
                  } else {
                    const { data } = res.data;
                    this.setState({
                      isShowPaymentWeb: true,
                      data: data,
                      title:
                        lang === "ar"
                          ? subscription.name_ar
                          : subscription.name,
                      isLoading: false,
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  if (err.response.data.error) {
                    this.setState({
                      isLoading: false,
                    });
                  }
                });
            },
          },
        ],
        {
          cancelable: false,
        }
      );

      //this.props.addUserSubscription(addData, this.props.navigation);
    } else {
      toast.show(I18n.t("selectPlan", { locale: lang }), {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
  };

  handleChoosePlanBooking = async (e) => {
    e.preventDefault();
    const { subscriptions } = this.props.subscription;
    const { lang } = this.props.setting;
    const { selectPackage } = this.state;
    const subscription = subscriptions.find(
      (subc) => subc.id === selectPackage
    );
    const { user } = this.props.auth;

    if (!isEmpty(selectPackage)) {
      let addData = {
        language: lang,
        user_id: user.id,
        subscription_id: selectPackage,
      };
      this.setState({ isLoading: true });
      axios
        .post(`${API_URI}/user_subscriptions`, addData)
        .then((res) => {
          if (res.data.error.code) {
          } else {
            const { data, payment_url } = res.data;

            this.setState({
              isShowPaymentWeb: true,
              url: payment_url,
              data: data,
              title: lang === "ar" ? subscription.name_ar : subscription.name,
              isLoading: false,
            });
          }
        })
        .catch((err) => {
          if (err.response.data.error) {
            this.setState({
              isLoading: false,
            });
          }
        });

      //this.props.addUserSubscription(addData, this.props.navigation);
    } else {
      toast.show(I18n.t("selectPlan", { locale: lang }), {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
  };
  handleDowngradePlanBooking = async (e) => {
    e.preventDefault();
    const { lang } = this.props.setting;
    const { selectPackage } = this.state;
    if (!isEmpty(selectPackage)) {
      Alert.alert(
        I18n.t("message", { locale: lang }),
        I18n.t("downgradeMessage", { locale: lang }),
        [
          {
            text: I18n.t("no", { locale: lang }),
            onPress: () => console.log("come"),
            style: "cancel",
          },
          {
            text: I18n.t("yes", { locale: lang }),
            onPress: () => this.handleDowngradeBooking(),
          },
        ],
        {
          cancelable: false,
        }
      );
    } else {
      toast.show(I18n.t("selectPlan", { locale: lang }), {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
  };

  handleDowngradeBooking = () => {
    const { subscriptions } = this.props.subscription;
    const { lang } = this.props.setting;
    const { selectPackage } = this.state;
    const subscription = subscriptions.find(
      (subc) => subc.id === selectPackage
    );
    const { user } = this.props.auth;
    if (!isEmpty(selectPackage)) {
      let addData = {
        user_id: user.id,
        subscription_id: selectPackage,
        is_downgrade: true,
        language: lang,
        is_downgrade: true,
      };
      // this.setState({isLoading: true});
      axios
        .post(`${API_URI}/user_subscriptions`, addData)
        .then((res) => {
          if (res.data.error.code) {
            toast.show(I18n.t("somethingWrong", { locale: lang }), {
              type: "danger",
              placement: "bottom",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else {
            toast.show(I18n.t("downgradePlanStatus", { locale: lang }), {
              type: "normal",
              placement: "bottom",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          }
        })
        .catch((err) => {
          if (err.response.data.error) {
            this.setState({
              isLoading: false,
            });
          }
        });

      //this.props.addUserSubscription(addData, this.props.navigation);
    } else {
      toast.show(I18n.t("selectPlan", { locale: lang }), {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    }
  };

  handleSelectPackage = (id) => {
    this.setState({ selectPackage: id });
  };
  /* handleSelectIndex = (index, id) => {
    this.setState({selectIndex: index, selectPackage: id});
  }; */
  handleSelectIndex = (index) => {
    this.setState({ selectIndex: index, selectPackage: "" });
  };
  handlePaymentWeb = async (status = "", paymentID = "") => {
    const { lang } = this.props.setting;
    if (status === "success") {
      this.setState({
        isShowPaymentWeb: false,
        isLoading: true,
      });

      this.setState({
        isShowPaymentSuccess: !this.state.isShowPaymentSuccess,
        isLoading: false,
      });
    } else if (status === "failed") {
      toast.show(I18n.t("paymentFailed", { locale: lang }), {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
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

  handlePaymentSuccess = () => {
    this.setState({
      isShowPaymentSuccess: !this.state.isShowPaymentSuccess,
    });
  };

  render() {
    const { user } = this.props.auth;
    const { lang } = this.props.setting;
    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    const { subscriptions } = this.props.subscription;

    const type = this.props.navigation.getParam("type");
    const {
      selectIndex,
      isShowPaymentWeb,
      url,
      data,
      isShowPaymentSuccess,
      title,
      isLoading,
      selectPackage,
      class_id,
      count,
      isLastPackage,
      lastPackageIndex,
      isGo,
    } = this.state;

    return (
      <Container style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
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
                  {I18n.t("back", { locale: lang })}
                </Text>
              </View>
            </Button>
          </Left>
          <Body />
        </Header>
        {isLoading ? (
          <Loading />
        ) : (
          <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
            <View
              style={{
                flex: 1,
                marginHorizontal: normalize(16),
                flexDirection: flexDirection,
              }}
            >
              <Text
                style={{
                  color: "#22242A",
                  fontSize: normalize(40),
                  fontWeight: "bold",
                  textAlign: textAlign,
                }}
              >
                {!isEmpty(user.subscription_id) &&
                !isEmpty(subscriptions) &&
                !isEmpty(selectIndex) &&
                user.subscription_id === subscriptions[selectIndex].id
                  ? I18n.t("currentPlan", { locale: lang })
                  : !isEmpty(user.subscription) &&
                    !isEmpty(subscriptions) &&
                    !isEmpty(selectIndex) &&
                    subscriptions[selectIndex].price > user.subscription.price
                  ? I18n.t("upgradePlan", { locale: lang })
                  : I18n.t("choosePlan", { locale: lang })}
              </Text>
            </View>

            <View
              style={{
                flex: 8,
                marginTop: normalize(5),
              }}
            >
              <PageSlider
                data={subscriptions}
                handleSelectPackage={this.handleSelectPackage}
                handleSelectIndex={this.handleSelectIndex}
                subscription_id={user.subscription_id}
                selectIndex={selectIndex}
                selectPackage={selectPackage}
                isGoBack={class_id || count > 0 || isGo ? true : false}
                navigation={this.props.navigation}
                count={count}
                isLastPackage={isLastPackage}
                type={type ? type : ""}
              />
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                marginBottom: normalize(15),
              }}
            >
              {type === "new" ||
              isEmpty(user.subscription) ||
              (subscriptions[selectIndex] &&
                user.subscription &&
                subscriptions[selectIndex].price < user.subscription.price) ? (
                <TouchableOpacity
                  onPress={(e) => {
                    console.log("user.subscription = ", user.subscription);
                    console.log("user = ", user);
                    type === "new" ||
                    isEmpty(user.subscription) ||
                    new Date(user.subscription_validity).getTime() <
                      new Date().getTime()
                      ? this.handleChoosePlanBooking(e)
                      : this.handleDowngradePlanBooking(e);
                  }}
                  style={{
                    marginHorizontal: normalize(32),
                    width: normalize(310),
                    height: normalize(48),
                    backgroundColor: "#FE9800",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: normalize(24),
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: normalize(16),
                      fontWeight: "bold",
                    }}
                  >
                    {I18n.t("choosePlan", { locale: lang })}
                  </Text>
                </TouchableOpacity>
              ) : (isLastPackage && selectIndex === lastPackageIndex) ||
                (subscriptions[selectIndex] &&
                  user.subscription &&
                  subscriptions[selectIndex].price >
                    user.subscription.price) ? (
                <TouchableOpacity
                  onPress={(e) => this.handleUpgradePlanBooking(e)}
                  style={{
                    //alignSelf: 'flex-end',
                    // marginTop: normalize(30),
                    marginHorizontal: normalize(32),
                    width: normalize(310),
                    height: normalize(48),
                    backgroundColor: "#FE9800",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: normalize(24),
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: normalize(16),
                      fontWeight: "bold",
                    }}
                  >
                    {I18n.t("upgradePlan", { locale: lang })}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
        {this.state.data && this.state.data.access_code && isShowPaymentWeb && (
          <PaymentWeb
            isShowPaymentWeb={isShowPaymentWeb}
            handlePaymentWeb={this.handlePaymentWeb}
            navigation={this.props.navigation}
            url={url}
            data={data}
            language={lang}
          />
        )}

        <PaymentSuccess
          isShowPaymentSuccess={isShowPaymentSuccess}
          handlePaymentSuccess={this.handlePaymentSuccess}
          text={I18n.t("successful", { locale: lang })}
          shortText={`${I18n.t("youHaveSuccessfullySubscribedTo", {
            locale: lang,
          })} ${title}`}
          buttonText={I18n.t("showMeSchedule", { locale: lang })}
          MoveScreenName={"Profile"}
          navigation={this.props.navigation}
          isGoBack={class_id ? true : false}
        />

        <Toast ref={(ref) => (global["toast"] = ref)} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 0,
  },
  backButtonContainer: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
  },
  backButtonIcon: {
    fontSize: normalize(18),
    color: "#22242A",
    fontWeight: "bold",
  },
  backButtonText: {
    fontSize: normalize(12),
    color: "#22242A",

    top: Platform.OS === "ios" ? normalize(3) : normalize(3.3),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  setting: state.setting,
  subscription: state.subscription,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  clearErrors,
  getSubscriptions,
  addUserSubscription,
  currentUser,
})(Membership);
