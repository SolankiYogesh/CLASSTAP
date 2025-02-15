import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Form, Item, Input } from "native-base";
import FIcon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import I18n from "../../utils/i18n";
import HeaderComponent from "../../components/Header";
import { registerUser } from "../../actions/authActions";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlreadyLogin: true,
      mobile: "",
      password: "",
      isSecure: true,
      errors: {},
    };
  }
  handleChangeText = (name, value) => {
    const errors = this.state.errors;
    if (name === "mobile" && errors.isMobile) {
      delete errors.isMobile;
    } else if (name === "password" && errors.isPassword) {
      delete errors.isPassword;
    }
    if (errors[name]) {
      delete errors[name];

      //delete errors.common;
    }
    //this.props.clearErrors();
    this.setState({ [name]: value, errors });
  };
  handleShowPassword = () => {
    this.setState({ isSecure: !this.state.isSecure });
  };
  handleCreateAccount = () => {};
  render() {
    const { isAlreadyLogin, errors, mobile, password, isSecure } = this.state;
    const { lang } = this.props.setting;
    const flexDirection = lang === "ar" ? "row-reverse" : "row";
    const textAlign = lang === "ar" ? "right" : "left";
    return (
      <Container>
        <HeaderComponent navigation={this.props.navigation} />
        <View style={styles.contentContainer}>
          {isAlreadyLogin ? (
            <View style={styles.welcomeUserContainer}>
              <View></View>
              <View style={{ marginVertical: 10 }}>
                <Text style={styles.welcomeText}>
                  {I18n.t("welcomeBack", { locale: lang })}
                </Text>
                <Text style={styles.welcomeText}>Khaled Abderlrahman</Text>
                <Text style={styles.welcomeTextSmall}>
                  {I18n.t("logBack", { locale: lang })}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                {I18n.t("newApp", { locale: lang })}
              </Text>
              <Text style={styles.titleText}>
                {I18n.t("loginToYourAccount", { locale: lang })}
              </Text>
            </View>
          )}

          <View style={styles.formContainer}>
            <Form>
              <View>
                <Item
                  error={errors.isPassword ? true : false}
                  style={[
                    styles.formInputText,
                    { flexDirection: flexDirection },
                  ]}
                >
                  <FIcon
                    name={isSecure ? "lock" : "unlock-alt"}
                    size={18}
                    style={{
                      flexDirection: flexDirection,
                    }}
                  />
                  <Input
                    placeholder={I18n.t("password", { locale: lang })}
                    secureTextEntry={isSecure}
                    style={
                      lang === "ar" ? styles.formInputArabic : styles.formInput
                    }
                    onChangeText={(val) =>
                      this.handleChangeText("password", val)
                    }
                    value={password}
                  />
                  <TouchableOpacity onPress={this.handleShowPassword}>
                    <Text>
                      {isSecure
                        ? I18n.t("show", { locale: lang })
                        : I18n.t("hide", { locale: lang })}
                    </Text>
                  </TouchableOpacity>
                </Item>
                {errors.password ? (
                  <Text style={[styles.errorMessage, { textAlign: textAlign }]}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>
              <View>
                <Item
                  error={errors.isPassword ? true : false}
                  style={[
                    styles.formInputText,
                    { flexDirection: flexDirection },
                  ]}
                >
                  <FIcon
                    name={isSecure ? "lock" : "unlock-alt"}
                    size={18}
                    style={{
                      flexDirection: flexDirection,
                    }}
                  />
                  <Input
                    placeholder={I18n.t("password", { locale: lang })}
                    secureTextEntry={isSecure}
                    style={
                      lang === "ar" ? styles.formInputArabic : styles.formInput
                    }
                    onChangeText={(val) =>
                      this.handleChangeText("password", val)
                    }
                    value={password}
                  />
                  <TouchableOpacity onPress={this.handleShowPassword}>
                    <Text>
                      {isSecure
                        ? I18n.t("show", { locale: lang })
                        : I18n.t("hide", { locale: lang })}
                    </Text>
                  </TouchableOpacity>
                </Item>
                {errors.password ? (
                  <Text style={[styles.errorMessage, { textAlign: textAlign }]}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>
              <View>
                <Item
                  error={errors.isPassword ? true : false}
                  style={[
                    styles.formInputText,
                    { flexDirection: flexDirection },
                  ]}
                >
                  <FIcon
                    name={isSecure ? "lock" : "unlock-alt"}
                    size={18}
                    style={{
                      flexDirection: flexDirection,
                    }}
                  />
                  <Input
                    placeholder={I18n.t("password", { locale: lang })}
                    secureTextEntry={isSecure}
                    style={
                      lang === "ar" ? styles.formInputArabic : styles.formInput
                    }
                    onChangeText={(val) =>
                      this.handleChangeText("password", val)
                    }
                    value={password}
                  />
                  <TouchableOpacity onPress={this.handleShowPassword}>
                    <Text>
                      {isSecure
                        ? I18n.t("show", { locale: lang })
                        : I18n.t("hide", { locale: lang })}
                    </Text>
                  </TouchableOpacity>
                </Item>
                {errors.password ? (
                  <Text style={[styles.errorMessage, { textAlign: textAlign }]}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>
            </Form>
            <TouchableOpacity
              onPress={this.handleCreateAccount}
              style={styles.accountButton}
            >
              <Text style={styles.accountButtonText}>
                {I18n.t("logIn", { locale: lang })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleCreateAccount}
              style={styles.forgotPasswordAccount}
            >
              <Text style={styles.forgotPasswordAccountText}>
                {I18n.t("forgotPassword", { locale: lang })}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.alreadyAccount}>
              <Text style={styles.alreadyAccountText}>
                {I18n.t("dontHaveAnAccount", { locale: lang })}{" "}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Signup")}
              >
                <Text style={styles.signUpText}>
                  {I18n.t("signup", { locale: lang })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 0,
  },
  titleContainer: {
    flex: 1,
    //height: 80,
    justifyContent: "center",
    marginLeft: "10%",
    marginRight: "10%",
    //alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontFamily: "arial",
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeTextSmall: {
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
    marginTop: 5,
  },
  welcomeUserContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "10%",
    marginRight: "10%",
  },
  formContainer: {
    flex: 5,
    justifyContent: "flex-start",
  },
  formInput: {
    marginLeft: 5,
  },
  formInputArabic: {
    marginLeft: 5,
    flexDirection: "row",
    textAlign: "right",
  },
  formInputText: {
    //flex: 1,
    marginLeft: "10%",
    marginRight: "10%",
    marginVertical: "2%",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  accountButton: {
    height: 46,
    backgroundColor: "#FE9800",
    marginHorizontal: 45,
    borderRadius: 23,
    justifyContent: "center",
    marginVertical: 15,
  },
  accountButtonText: {
    fontSize: 15,
    textAlign: "center",
    color: "#ffffff",
  },
  forgotPasswordAccount: {
    marginVertical: "1%",
  },
  forgotPasswordAccountText: {
    textAlign: "center",
    fontSize: 13,
  },
  alreadyAccount: {
    justifyContent: "center",
    flexDirection: "row",
  },

  alreadyAccountText: {
    textAlign: "center",
  },
  signUpText: {
    fontWeight: "bold",
    fontSize: 13,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(Login);
