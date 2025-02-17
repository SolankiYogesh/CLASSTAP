/* eslint-disable semi */
import analytics from '@react-native-firebase/analytics';
import {Box, FormControl, Input, VStack} from 'native-base';
import React, {Component} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import normalize from 'react-native-normalize';
import Toast from 'react-native-toast-notifications';
import {connect} from 'react-redux';

import {
  clearUpdateUser,
  currentUser,
  deleteAttachment,
  updateUser,
} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorAction';
import CameraIcon from '../../assets/img/add_photo.svg';
import LockIcon from '../../assets/img/lock.svg';
import MailIcon from '../../assets/img/mail.svg';
import PhoneIcon from '../../assets/img/phone.svg';
import UserIcon from '../../assets/img/user.svg';
import HeaderComponent from '../../components/Header';
import {IMAGE_URI} from '../../utils/config';
import Const from '../../utils/Const';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import {updateUserValidation} from '../../validation/validation';
import Loading from '../Loading';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.auth.user.first_name,
      lastName: props.auth.user.last_name,
      email: props.auth.user.email,
      mobile: props.auth.user.mobile,
      attachment: props.auth.user.attachment,
      password: 'password',
      image_data: '',
      newPassword: '',
      confirmPassword: '',
      isSecure: true,
      errors: {},
      isChangePassword: false,
      isEnablrdScroll: false,
      attachId: '',
    };
  }

  componentDidUpdate(props, state) {
    if (props.auth.isUpdateUser) {
      toast.show(
        I18n.t('accountUpdatedSucessfully', {locale: props.setting.lang}),
        {
          type: 'normal',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in',
        },
      );

      props.clearUpdateUser();
    }

    if (!isEmpty(props.errors.error)) {
      return {
        errors: {common: props.errors.error},
      };
    } else {
      if (state.errors.common) {
        delete state.errors.common;
      }
    }

    return null;
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearUpdateUser();
    this.focusListener2();
  }
  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.ACCOUNT_SCREEN);
    this.props.clearErrors();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.focusListener2 = this.props.navigation.addListener('focus', () => {
      this.setState({
        mobile: this.props.auth.user.mobile,
      });
    });
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack();
    return true;
  };

  handleChangeText = (name, value) => {
    const {errors} = this.state;
    if (name === 'firstName' && errors.isFirstName) {
      delete errors.isFirstName;
    } else if (name === 'lastName' && errors.isLastName) {
      delete errors.isLastName;
    } else if (name === 'email' && errors.isEmail) {
      delete errors.isEmail;
    } else if (name === 'mobile' && errors.isMobile) {
      delete errors.isMobile;
    } else if (name === 'password' && errors.isPassword) {
      delete errors.isPassword;
    } else if (name === 'newPassword' && errors.isNewPassword) {
      delete errors.isNewPassword;
    } else if (name === 'confirmPassword' && errors.isConfirmPassword) {
      delete errors.isConfirmPassword;
    }
    if (errors[name]) {
      delete errors[name];

      //delete errors.common;
    }
    delete errors.common;
    this.props.clearErrors();
    this.setState({[name]: value, errors});
  };
  handleIsNotification = () => {
    this.setState({isNotification: !this.state.isNotification});
  };
  handleShowPassword = () => {
    this.setState({isSecure: !this.state.isSecure});
  };
  handleUpdateAccount = () => {
    const {
      firstName,
      lastName,
      email,
      image_data,
      isChangePassword,
      password,
      newPassword,
      confirmPassword,
      attachId,
    } = this.state;
    const updateUserData = {
      first_name: firstName,
      last_name: lastName,
    };

    if (this.props.auth.user.email !== email) {
      updateUserData.email = email;
    }

    if (isChangePassword) {
      updateUserData.isChangePassword = isChangePassword;
      updateUserData.current_password = password;
      updateUserData.password = newPassword;
      updateUserData.confirm_password = confirmPassword;
    }
    const {lang} = this.props.setting;
    const {errors, isValid} = updateUserValidation(updateUserData, lang);

    if (isValid) {
      if (image_data) {
        updateUserData.image_data = image_data;
      }
      const {user} = this.props.auth;
      this.props.updateUser(updateUserData, user.id, this.props.navigation);
      if (!isEmpty(attachId)) {
        this.props.deleteAttachment(attachId);
      }
      this.setState({
        isChangePassword: false,
        newPassword: '',
        confirmPassword: '',
        attachId: '',
      });
    } else {
      this.setState({errors});
    }
  };
  handleFacebookAccount = () => {};

  onSelectedImage = image => {
    //const source = {uri: image.path};
    const image_data = `data:${image.mime};base64,${image.data}`;

    this.setState({image_path: image.path, image_data});
  };

  takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxHeight: 500,
      compressImageMaxWidth: 500,
      compressImageQuality: 0.7,
      includeBase64: true,
      cropping: false,
    }).then(image => {
      this.onSelectedImage(image);
    });
  };

  choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      compressImageMaxHeight: 500,
      compressImageMaxWidth: 500,
      ompressImageQuality: 0.7,
      includeBase64: true,
      cropping: false,
    }).then(image => {
      this.onSelectedImage(image);
    });
  };

  handleRemovePhoto = () => {
    const {user} = this.props.auth;
    if (user.attachment) {
      this.setState({attachId: user.attachment.id, attachment: false});
      //this.props.deleteAttachment(user.attachment.id);
    } else {
      Alert.alert('No profile photo available');
    }
    //
  };

  onClickAddImage = () => {
    const BUTTONS = [
      'Take Photo',
      'Choose Photo Library',
      'Remove Photo',
      'Cancel',
    ];
    // ActionSheet.show(
    //   {options: BUTTONS, cancelButtonIndex: 3, title: 'Select a Photo'},
    //   buttonIndex => {
    //     switch (buttonIndex) {
    //       case 0:
    //         this.takePhotoFromCamera();
    //         break;
    //       case 1:
    //         this.choosePhotoFromLibrary();
    //         break;
    //       case 2:
    //         this.handleRemovePhoto();
    //         break;
    //       default:
    //         break;
    //     }
    //   },
    // );
  };
  handleShowChangePassword = () => {
    const {isChangePassword, password} = this.state;
    this.setState({
      password: !isChangePassword ? '' : 'password',
      isChangePassword: !isChangePassword,
    });
  };
  handleShowChangeMobile = () => {
    this.props.navigation.navigate('ChangeMobile');
  };
  render() {
    const {lang} = this.props.setting;
    const {user} = this.props.auth;
    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      isSecure,
      errors,
      image_path,
      newPassword,
      confirmPassword,
      isChangePassword,
      isEnablrdScroll,
      attachment,
    } = this.state;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    const image = image_path
      ? {uri: image_path}
      : attachment
        ? {
            uri: `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`,
          }
        : require('../../assets/img/avatar1.png');
    const {isLodaing} = this.props.errors;
    return (
      <>
        {isLodaing ? (
          <Loading />
        ) : (
          <View style={{flex: 1}}>
            <SafeAreaView />
            <HeaderComponent navigation={this.props.navigation} />
            <View style={styles.contentContainer}>
              <View style={styles.userImageContainer}>
                <Image source={image} style={styles.profileImage} />
                <TouchableOpacity
                  style={{position: 'absolute'}}
                  onPress={this.onClickAddImage}>
                  <CameraIcon
                    style={styles.cameraIcon}
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <KeyboardAwareScrollView
                  enableOnAndroid={true}
                  keyboardShouldPersistTaps={'handled'}
                  enableResetScrollToCoords={false}
                  scrollEnabled={isEnablrdScroll}
                  enableAutomaticScroll={isEnablrdScroll}>
                  <VStack>
                    <View
                      style={{
                        flexDirection: flexDirection,
                        height: normalize(62, 'height'),
                      }}>
                      <Grid
                        style={{
                          flexDirection: flexDirection,
                          marginRight: lang === 'ar' ? '5%' : '5%',
                          marginLeft: lang === 'ar' ? '0%' : '10%',
                        }}>
                        <Col>
                          <View>
                            <View
                              style={[
                                styles.formInputFirstContainer,
                                {flexDirection: flexDirection},
                              ]}>
                              <View style={styles.formInputIconContainer}>
                                <UserIcon
                                  width={normalize(20)}
                                  height={normalize(20)}
                                />
                              </View>

                              <View
                                style={[
                                  styles.formInputItemContainer,
                                  {
                                    borderBottomColor: errors.isFirstName
                                      ? 'red'
                                      : 'rgba(0, 0, 0, 0.2)',
                                  },
                                ]}>
                                <Box
                                  floatingLabel
                                  error={errors.isFirstName ? true : false}
                                  style={
                                    lang === 'ar'
                                      ? styles.formInputContainerArabic
                                      : styles.formInputContainer
                                  }>
                                  <FormControl.Label
                                    style={{
                                      alignSelf: alignSelf,
                                      fontSize: normalize(11),
                                    }}>
                                    {I18n.t('firstName', {locale: lang})}
                                  </FormControl.Label>
                                  <Input
                                    style={[
                                      styles.inputText,
                                      {
                                        flexDirection: 'row',
                                        textAlign:
                                          lang === 'ar' ? 'right' : 'left',
                                      },
                                    ]}
                                    onChangeText={val =>
                                      this.handleChangeText('firstName', val)
                                    }
                                    maxLength={10}
                                    value={firstName}
                                    returnKeyLabel="Done"
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                  />
                                </Box>
                              </View>
                            </View>
                            {errors.firstName ? (
                              <Text
                                style={[
                                  styles.errorMessage,
                                  {textAlign: textAlign},
                                ]}>
                                {errors.firstName}
                              </Text>
                            ) : null}
                          </View>
                        </Col>
                        <Col>
                          <View
                            style={{
                              marginRight: lang === 'ar' ? '20%' : '0%',
                              marginLeft: lang === 'ar' ? '0%' : '10%',
                            }}>
                            <View
                              style={[
                                styles.formInputLastContainer,
                                {flexDirection: flexDirection},
                              ]}>
                              <View
                                style={[
                                  styles.formInputItemContainer,
                                  {
                                    borderBottomColor: errors.isLastName
                                      ? 'red'
                                      : 'rgba(0, 0, 0, 0.2)',
                                  },
                                ]}>
                                <Box
                                  floatingLabel
                                  error={errors.isLastName ? true : false}
                                  style={
                                    lang === 'ar'
                                      ? styles.formInputLastNameContainerArabic
                                      : styles.formInputLastNameContainer
                                  }>
                                  <FormControl.Label
                                    style={{
                                      alignSelf: alignSelf,
                                      fontSize: normalize(11),
                                    }}>
                                    {I18n.t('lastName', {locale: lang})}
                                  </FormControl.Label>
                                  <Input
                                    style={[
                                      styles.inputText,
                                      {
                                        flexDirection: 'row',
                                        textAlign:
                                          lang === 'ar' ? 'right' : 'left',
                                      },
                                    ]}
                                    onChangeText={val =>
                                      this.handleChangeText('lastName', val)
                                    }
                                    maxLength={10}
                                    value={lastName}
                                    returnKeyLabel="Done"
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                  />
                                </Box>
                              </View>
                            </View>
                            {errors.lastName ? (
                              <Text
                                style={[
                                  styles.errorMessage,
                                  {textAlign: textAlign},
                                ]}>
                                {errors.lastName}
                              </Text>
                            ) : null}
                          </View>
                        </Col>
                      </Grid>
                    </View>
                    <View style={{height: normalize(62, 'height')}}>
                      <View
                        style={[
                          styles.formInputMainContainer,
                          {flexDirection: flexDirection},
                        ]}>
                        <View style={styles.formInputIconContainer}>
                          <MailIcon
                            width={normalize(20)}
                            height={normalize(20)}
                          />
                        </View>

                        <View
                          style={[
                            styles.formInputItemContainer,
                            {
                              borderBottomColor: errors.isEmail
                                ? 'red'
                                : 'rgba(0, 0, 0, 0.2)',
                            },
                          ]}>
                          <Box
                            floatingLabel
                            error={errors.isEmail ? true : false}
                            style={
                              lang === 'ar'
                                ? styles.formInputContainerArabic
                                : styles.formInputContainer
                            }>
                            <FormControl.Label
                              style={{
                                alignSelf: alignSelf,
                                fontSize: normalize(11),
                              }}>
                              {I18n.t('email', {locale: lang})}
                            </FormControl.Label>
                            <Input
                              style={[
                                styles.inputText,
                                {
                                  flexDirection: 'row',
                                  textAlign: lang === 'ar' ? 'right' : 'left',
                                },
                              ]}
                              onChangeText={val =>
                                this.handleChangeText('email', val)
                              }
                              value={email}
                              returnKeyLabel="Done"
                              returnKeyType="done"
                              onSubmitEditing={Keyboard.dismiss}
                            />
                          </Box>
                        </View>
                      </View>

                      {errors.email ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.email}
                        </Text>
                      ) : null}
                    </View>
                    <View style={{height: normalize(62, 'height')}}>
                      <View
                        style={[
                          styles.formInputMainContainer,
                          {flexDirection: flexDirection},
                        ]}>
                        <View style={styles.formInputIconContainer}>
                          <PhoneIcon
                            width={normalize(20)}
                            height={normalize(20)}
                            style={{
                              transform: [
                                {rotate: lang === 'ar' ? '270deg' : '0deg'},
                              ],
                            }}
                          />
                        </View>

                        <View
                          style={[
                            styles.formInputItemContainer,
                            {
                              borderBottomColor: errors.isMobile
                                ? 'red'
                                : 'rgba(0, 0, 0, 0.2)',
                            },
                          ]}>
                          <Box
                            floatingLabel
                            error={errors.isMobile ? true : false}
                            style={
                              lang === 'ar'
                                ? styles.formInputContainerArabic
                                : styles.formInputContainer
                            }>
                            <FormControl.Label
                              style={{
                                alignSelf: alignSelf,
                                fontSize: normalize(11),
                              }}>
                              {I18n.t('phoneNumber', {locale: lang})}
                            </FormControl.Label>
                            <Input
                              disabled
                              style={[
                                styles.inputText,
                                {
                                  flexDirection: 'row',
                                  textAlign: lang === 'ar' ? 'right' : 'left',
                                },
                              ]}
                              onChangeText={val =>
                                this.handleChangeText('mobile', val)
                              }
                              value={mobile}
                              keyboardType="numeric"
                              returnKeyLabel="Done"
                              returnKeyType="done"
                              onSubmitEditing={Keyboard.dismiss}
                            />
                          </Box>
                        </View>
                        <TouchableOpacity
                          onPress={this.handleShowChangeMobile}
                          style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                          }}>
                          <Text
                            style={{
                              fontSize: normalize(11),
                              color: '#0053FE',
                            }}>
                            {I18n.t('change', {locale: lang})}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {errors.mobile ? (
                        <Text
                          style={[styles.errorMessage, {textAlign: textAlign}]}>
                          {errors.mobile}
                        </Text>
                      ) : null}
                    </View>
                    {!user.is_social_login ? (
                      <View
                        style={{
                          height: normalize(62, 'height'),
                          bottom: normalize(6),
                        }}>
                        <View
                          style={[
                            styles.formInputMainContainer,
                            {flexDirection: flexDirection},
                          ]}>
                          <View style={styles.formInputIconContainer}>
                            <LockIcon
                              width={normalize(20)}
                              height={normalize(20)}
                            />
                          </View>

                          <View
                            style={[
                              styles.formInputItemContainer,
                              {
                                borderBottomColor: errors.isPassword
                                  ? 'red'
                                  : 'rgba(0, 0, 0, 0.2)',
                              },
                            ]}>
                            <Box
                              floatingLabel
                              error={errors.isPassword ? true : false}
                              style={
                                lang === 'ar'
                                  ? styles.formInputContainerArabic
                                  : styles.formInputContainer
                              }>
                              <FormControl.Label
                                style={{
                                  alignSelf: alignSelf,
                                  fontSize: normalize(11),
                                }}>
                                {!isChangePassword
                                  ? I18n.t('password', {locale: lang})
                                  : I18n.t('oldPassword', {locale: lang})}
                              </FormControl.Label>
                              <Input
                                disabled={!isChangePassword}
                                secureTextEntry={isSecure}
                                style={[
                                  styles.inputText,
                                  {
                                    flexDirection: 'row',
                                    textAlign: lang === 'ar' ? 'right' : 'left',
                                  },
                                ]}
                                onChangeText={val =>
                                  this.handleChangeText('password', val)
                                }
                                value={password ? password : ''}
                                returnKeyLabel="Done"
                                returnKeyType="done"
                                onSubmitEditing={Keyboard.dismiss}
                                //onEndEditing={Keyboard.dismiss}
                              />
                            </Box>
                          </View>

                          <TouchableOpacity
                            onPress={this.handleShowChangePassword}
                            style={{
                              position: 'absolute',
                              bottom: 10,
                              right: 10,
                            }}>
                            <Text
                              style={{
                                fontSize: normalize(11),
                                color: '#0053FE',
                              }}>
                              {!isChangePassword
                                ? I18n.t('change', {locale: lang})
                                : I18n.t('noChange', {locale: lang})}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {errors.password ? (
                          <Text
                            style={[
                              styles.errorMessage,
                              {textAlign: textAlign},
                            ]}>
                            {errors.password}
                          </Text>
                        ) : null}
                      </View>
                    ) : null}

                    {isChangePassword ? (
                      <>
                        <View style={{height: normalize(62, 'height')}}>
                          <View
                            style={[
                              styles.formInputMainContainer,
                              {flexDirection: flexDirection},
                            ]}>
                            <View style={styles.formInputIconContainer}>
                              <LockIcon
                                width={normalize(20)}
                                height={normalize(20)}
                              />
                            </View>

                            <View
                              style={[
                                styles.formInputItemContainer,
                                {
                                  borderBottomColor: errors.isNewPassword
                                    ? 'red'
                                    : 'rgba(0, 0, 0, 0.2)',
                                },
                              ]}>
                              <Box
                                floatingLabel
                                error={errors.isNewPassword ? true : false}
                                style={
                                  lang === 'ar'
                                    ? styles.formInputContainerArabic
                                    : styles.formInputContainer
                                }>
                                <FormControl.Label
                                  style={{
                                    alignSelf: alignSelf,
                                    fontSize: normalize(11),
                                  }}>
                                  {I18n.t('newPassword', {locale: lang})}
                                </FormControl.Label>
                                <Input
                                  secureTextEntry={isSecure}
                                  style={[
                                    styles.inputText,
                                    {
                                      flexDirection: 'row',
                                      textAlign:
                                        lang === 'ar' ? 'right' : 'left',
                                    },
                                  ]}
                                  onChangeText={val =>
                                    this.handleChangeText('newPassword', val)
                                  }
                                  value={newPassword}
                                  returnKeyLabel="Done"
                                  returnKeyType="done"
                                  onSubmitEditing={Keyboard.dismiss}
                                />
                              </Box>
                            </View>
                          </View>

                          {errors.new_password ? (
                            <Text
                              style={[
                                styles.errorMessage,
                                {textAlign: textAlign},
                              ]}>
                              {errors.new_password}
                            </Text>
                          ) : null}
                        </View>

                        <View
                          style={{
                            //height: normalize(62, 'height'),
                            bottom: normalize(6),
                          }}>
                          <View
                            style={[
                              styles.formInputMainContainer,
                              {flexDirection: flexDirection},
                            ]}>
                            <View style={styles.formInputIconContainer}>
                              <LockIcon
                                width={normalize(20)}
                                height={normalize(20)}
                              />
                            </View>

                            <View
                              style={[
                                styles.formInputItemContainer,
                                {
                                  borderBottomColor: errors.isConfirmPassword
                                    ? 'red'
                                    : 'rgba(0, 0, 0, 0.2)',
                                },
                              ]}>
                              <Box
                                floatingLabel
                                error={errors.isConfirmPassword ? true : false}
                                style={
                                  lang === 'ar'
                                    ? styles.formInputContainerArabic
                                    : styles.formInputContainer
                                }>
                                <FormControl.Label
                                  style={{
                                    alignSelf: alignSelf,
                                    fontSize: normalize(11),
                                  }}>
                                  {I18n.t('confirmPassword', {locale: lang})}
                                </FormControl.Label>
                                <Input
                                  secureTextEntry={isSecure}
                                  style={[
                                    styles.inputText,
                                    {
                                      flexDirection: 'row',
                                      textAlign:
                                        lang === 'ar' ? 'right' : 'left',
                                    },
                                  ]}
                                  onChangeText={val =>
                                    this.handleChangeText(
                                      'confirmPassword',
                                      val,
                                    )
                                  }
                                  value={confirmPassword}
                                  returnKeyLabel="Done"
                                  returnKeyType="done"
                                  onSubmitEditing={Keyboard.dismiss}
                                />
                              </Box>
                            </View>
                          </View>

                          {errors.confirm_password ? (
                            <Text
                              style={[
                                styles.errorMessage,
                                {textAlign: textAlign},
                              ]}>
                              {errors.confirm_password}
                            </Text>
                          ) : null}
                        </View>
                      </>
                    ) : null}
                    {errors.common ? (
                      <Text
                        style={[styles.errorMessage, {textAlign: textAlign}]}>
                        {errors.common}
                      </Text>
                    ) : null}
                  </VStack>
                </KeyboardAwareScrollView>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={this.handleUpdateAccount}
                  style={styles.accountButton}>
                  <Text style={styles.accountButtonText}>
                    {I18n.t('saveEdit', {locale: lang})}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <Toast ref={ref => (global['toast'] = ref)} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  accountButton: {
    backgroundColor: '#FE9800',
    borderRadius: normalize(23),
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(45),
    //marginVertical: 10,
  },
  accountButtonText: {
    color: '#ffffff',
    fontSize: normalize(15),
    textAlign: 'center',
  },
  alreadyAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  alreadyAccountText: {
    fontSize: normalize(13),
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,

    //justifyContent: 'space-evenly',
  },
  cameraIcon: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'space-between',
  },
  errorMessage: {
    color: 'red',
    fontSize: normalize(12),
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: normalize(20),
  },
  facebookButton: {
    borderColor: '#0053FE',
    borderRadius: normalize(23),
    borderWidth: normalize(1),
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(45),
    //marginVertical: 10,
  },
  facebookButtonText: {
    color: '#0053FE',
    textAlign: 'center',
  },
  formContainer: {
    flex: 6,

    //justifyContent: 'space-evenly',
  },
  formInput: {
    ///marginLeft: normalize(5),
    //marginTop: normalize(5),
    fontSize: normalize(13),
    color: '#22242A',
  },
  formInputArabic: {
    //marginLeft: normalize(5),
    flexDirection: 'row',
    textAlign: 'right',
    // marginTop: normalize(5),
    fontSize: normalize(13),
    color: '#22242A',
  },
  formInputContainer: {
    borderBottomWidth: 0,
    left: 20,
  },

  formInputContainerArabic: {
    borderBottomWidth: 0,
    right: 30,
  },

  formInputFirstContainer: {
    display: 'flex',
    // flexDirection: 'row',
    // marginLeft: '10%',
    //marginRight: '10%',
    width: '80%',
  },

  formInputIconContainer: {
    top: normalize(30),
  },
  formInputItemContainer: {
    width: '100%',
    borderBottomWidth: 1,
    //borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    left: normalize(-20),
  },

  formInputLastContainer: {
    display: 'flex',
    // flexDirection: 'row',
    // marginRight: '10%',
    // marginLeft: '10%',
    // width: '80%',
  },
  formInputLastNameContainer: {
    borderBottomWidth: 0,
    right: 10,
    //left: 20,
  },
  formInputLastNameContainerArabic: {
    borderBottomWidth: 0,
    //right: 30,
  },
  formInputMainContainer: {
    display: 'flex',
    // flexDirection: 'row',
    marginLeft: '10%',
    marginRight: '10%',
    width: '80%',
  },
  guestAccount: {
    //marginVertical: 20,
  },
  guestAccountText: {
    fontSize: normalize(12),
    textAlign: 'center',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
  },
  inputLabel: {
    fontSize: normalize(14),
  },

  inputText: {
    color: '#22242A',
    fontSize: normalize(13),
  },
  loginText: {
    fontSize: normalize(13),
    fontWeight: 'bold',
  },
  notificationContainer: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '2%',
  },
  profileImage: {
    borderRadius: normalize(50),
    height: normalize(100),
    width: normalize(100),
  },
  titleText: {
    fontFamily: 'arial',
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  userImageContainer: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  updateUser,
  currentUser,
  clearErrors,
  clearUpdateUser,
  deleteAttachment,
})(Account);
