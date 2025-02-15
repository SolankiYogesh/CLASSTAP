import React, {Component} from 'react';
import {
  Text,
  View,
  Modal,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import normalize from 'react-native-normalize';
import {Icon} from 'native-base';
import {addReviewValidation} from '../../validation/validation';
import {clearErrors} from '../../actions/errorAction';
import {addReview} from '../../actions/homeActions';
const {width, height} = Dimensions.get('window');
import {API_URI} from '../../utils/config';
import axios from 'axios';

import I18n from '../../utils/i18n';
import Toast from 'react-native-toast-notifications';
import {getWhatsOnToday} from '../../actions/subscriptionActions';

export class WriteCoachReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      description: '',
      Max_Rating: 5,
      errors: {},
      isEnablrdScroll: false,
    };
  }
  UpdateRating(key) {
    this.setState({rating: key});
  }
  handleReview = async () => {
    const {lang} = this.props.setting;
    const {description, rating} = this.state;
    const {coach_id, /* class_schedule_id, schedule_dates_id, */ auth} =
      this.props;
    const addReviewData = {
      user_id: auth.user.id,
      coach_id,
      //class_schedule_id,
      // schedule_dates_id,
      description,
      rating,
    };
    const {errors, isValid} = addReviewValidation(addReviewData, lang);

    if (isValid) {
      // this.props.addReview(addReviewData);
      await axios
        .post(`${API_URI}/coach_reviews`, addReviewData)
        .then(async res => {
          if (res.data.error.code) {
          } else {
            const {data} = res.data;
            toast.show(I18n.t('reviewAddedSucessfully', {locale: lang}), {
              type: 'normal',
              placement: 'bottom',
              duration: 2000,
              offset: 30,
              animationType: 'slide-in',
            });
            this.props.getWhatsOnToday(auth.user.id);
            this.props.handleWriteReview();
          }
        })
        .catch(err => {
          /* if (err.response.data.error) {
          } */
        });

      this.props.handleWriteReview();
    } else {
      this.setState({errors});
    }
  };
  truncate = (str, no_words) => {
    return str.split(' ').splice(0, no_words).join(' ');
  };
  handleChangeText = (name, value) => {
    const errors = this.state.errors;

    if (errors[name]) {
      delete errors[name];

      //delete errors.common;
    }

    delete errors.common;
    this.props.clearErrors();
    if (value.trim()) {
      if (name === 'description') {
        let description = this.truncate(value, 100);
        this.setState({description, errors});
      } else {
        this.setState({[name]: value, errors});
      }
    } else {
      if (this.state.description) {
        this.setState({[name]: value, errors});
      }
    }
  };

  onKeyboarDidShow = () => {
    this.setState({isEnablrdScroll: true});
  };

  onKeyboardWillHide = () => {
    this.setState({isEnablrdScroll: false});
  };

  componentDidMount() {
    this.props.clearErrors();
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }
  render() {
    const {description, errors, isEnablrdScroll} = this.state;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    let React_Native_Rating_Bar = [];
    //Array to hold the filled or empty Stars
    for (var i = 1; i <= this.state.Max_Rating; i++) {
      React_Native_Rating_Bar.push(
        <TouchableOpacity
          activeOpacity={0.7}
          key={i}
          onPress={this.UpdateRating.bind(this, i)}>
          {i <= this.state.rating ? (
            <Icon
              type="FontAwesome"
              name="star"
              style={[styles.classStarIcon, {color: '#FE9800'}]}
            />
          ) : (
            <Icon
              type="FontAwesome"
              name="star"
              style={[styles.classStarIcon, {color: '#EFEFF4'}]}
            />
          )}
        </TouchableOpacity>,
      );
    }
    return (
      <>
        <Modal
          visible={this.props.isShowWriteReview}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            this.props.handleWriteReview();
          }}>
          <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === 'android' ? undefined : 'position'}>
            <ScrollView
              scrollEnabled={false}
              keyboardShouldPersistTaps="handled">
              <TouchableOpacity
                onPress={() => {
                  this.props.handleWriteReview();
                }}
                style={{
                  height: height - normalize(406),
                  backgroundColor: 'rgba(34, 36, 42, 0.2)',
                }}
              />
              <View style={[styles.modalContent]}>
                <View style={{marginHorizontal: normalize(25)}}>
                  <View style={{marginTop: normalize(20)}}>
                    <Text
                      style={{
                        fontSize: normalize(24),
                        color: '#231F20',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}>
                      {I18n.t('rateYourCoach', {locale: lang})}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.classRatingContainer,
                      {flexDirection: flexDirection},
                    ]}>
                    {React_Native_Rating_Bar}
                  </View>
                  {errors.rating ? (
                    <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                      {errors.rating}
                    </Text>
                  ) : null}

                  <TextInput
                    placeholder={I18n.t('pleaseTakeMinuteToReviewCoach', {
                      locale: lang,
                    })}
                    placeholderTextColor="#8A8A8F"
                    numberOfLines={10}
                    multiline={true}
                    selectTextOnFocus={true}
                    style={{
                      height: normalize(164),
                      backgroundColor: '#F9F9F9',
                      textAlignVertical: 'top',
                      borderRadius: normalize(16),
                    }}
                    onChangeText={val =>
                      this.handleChangeText('description', val)
                    }
                    value={description}
                    returnKeyLabel="Done"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />

                  {errors.description ? (
                    <Text style={[styles.errorMessage, {textAlign: textAlign}]}>
                      {errors.description}
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    onPress={this.handleReview}
                    style={styles.accountButton}>
                    <Text style={styles.accountButtonText}>
                      {I18n.t('submitYourReview', {locale: lang})}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
        <Toast ref={ref => (global['toast'] = ref)} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  classRatingContainer: {
    display: 'flex',
    alignSelf: 'center',
    marginVertical: normalize(25),
  },
  classStarIcon: {
    fontSize: normalize(42),
    paddingRight: normalize(14),
  },
  accountButton: {
    height: normalize(48),
    backgroundColor: '#FE9800',
    marginHorizontal: normalize(33),
    borderRadius: normalize(24),
    justifyContent: 'center',
    marginVertical: normalize(15),
    marginBottom: Platform.OS === 'ios' ? normalize(46) : normalize(15),
  },
  accountButtonText: {
    fontSize: normalize(16),
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  StarImage: {
    width: normalize(40),
    height: normalize(40),
    resizeMode: 'cover',
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    fontSize: normalize(12),
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    flexDirection: 'column',
    height: normalize(406),
    backgroundColor: '#ffffff',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  addReview,
  clearErrors,
  getWhatsOnToday,
})(WriteCoachReview);
