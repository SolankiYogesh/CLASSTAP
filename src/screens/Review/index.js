import FastImage from '@d11/react-native-fast-image';
import moment from 'moment-timezone';
import {Body, Button, Header, Icon, Left, Right} from 'native-base';
import React, {Component} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {connect} from 'react-redux';

import {getReviews} from '../../actions/homeActions';
import {API_URI, IMAGE_URI} from '../../utils/config';
import I18n from '../../utils/i18n';
import isEmpty from '../../validation/is-empty';
import Loading from '../Loading';
import WriteReview from '../WriteReview';
import ReviewShow from './ReviewShow';
moment.tz.setDefault('Asia/Qatar');
import axios from 'axios';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

const {width} = Dimensions.get('window');

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowWriteReview: false,
      reviews: [],
      isLoading: true,
    };
  }
  async componentDidMount() {
    analytics().logEvent(Const.ANALYTICS_EVENT.REVIEW_SCREEN);
    const foreign_id = await this.props.navigation.getParam('foreign_id');
    const foreign_class = await this.props.navigation.getParam('class');
    await axios
      .get(
        `${API_URI}/reviews?filter={"where": {"is_active": 1,"foreign_id": ${foreign_id}, "class": "${foreign_class}"}}`,
      )
      .then(async res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data;
          this.setState({reviews: data, isLoading: false});
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.back = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack,
    );
  }

  componentWillUnmount() {
    if (this.back) {
      this.back?.remove(0);
    }
  }

  handleReviews = review => {
    let reviews = [...this.state.reviews];
    reviews.push(review);
    this.props.navigation.state.params.handleReviews(reviews);
    this.setState({reviews});
  };

  renderItem = ({item}) => {
    const {attachment} = item.user;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    let image;

    if (!isEmpty(attachment)) {
      image = {
        uri: `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`,
      };
    } else {
      image = require('../../assets/img/NoPicture.png');
    }
    return (
      <View style={{flexDirection: flexDirection, marginBottom: normalize(16)}}>
        <View style={{display: 'flex', width: normalize(44)}}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(44),
                height: normalize(44),
                borderRadius: normalize(22),
              }}
              source={{
                uri: image.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <Image
              //resizeMode={'stretch'}
              source={image}
              style={{
                width: normalize(44),
                height: normalize(44),
                borderRadius: normalize(22),
              }}
            />
          )}
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
            <View>
              <Text
                style={{
                  fontSize: normalize(15),
                  fontWeight: '700',
                  textAlign: textAlign,
                }}>
                {`${item.user.first_name} ${item.user.last_name}`}
              </Text>
              <View
                style={[
                  styles.classRatingContainer,
                  {flexDirection: flexDirection},
                ]}>
                <ReviewShow
                  rating={item.rating}
                  style={{
                    fontSize: normalize(11),
                    paddingRight: normalize(2.75),
                  }}
                />
              </View>
              <Text style={{textAlign: textAlign, fontSize: normalize(12)}}>
                {item.description}
              </Text>
              <Text
                style={{
                  textAlign: textAlign,
                  fontSize: normalize(12),
                  color: '#8A8A8F',
                }}>
                {moment(item.createdAt, 'YYYY-MM-DD hh:mm:ss')
                  .startOf('hour')
                  .fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  handleBack = async () => {
    this.props.navigation.goBack();
    /*     const back = await this.props.navigation.getParam('back');
    // this.props.clearErrors();
    if (!isEmpty(back)) {
      const classTabToken = await AsyncStorage.getItem('classTabToken');
      if (classTabToken) {
        this.props.navigation.navigate(back);
      } else {
        this.props.navigation.navigate('Auth');
      }
    } else {
      this.props.navigation.goBack();
    } */
  };

  handleWriteReview = () => {
    const {lang} = this.props.setting;
    if (isEmpty(this.props.auth.user)) {
      Alert.alert(
        I18n.t('login', {locale: lang}),
        I18n.t('loginToProceed', {locale: lang}),
        [
          {
            text: I18n.t('no', {locale: lang}),
            onPress: () => console.log('come'),
            style: 'cancel',
          },
          {
            text: I18n.t('yes', {locale: lang}),
            onPress: () => this.props.navigation.navigate('Login'),
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      this.setState({isShowWriteReview: !this.state.isShowWriteReview});
    }
  };
  render() {
    const {reviews, isLoading} = this.state;
    const {isShowWriteReview} = this.state;
    const {lang} = this.props.setting;
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
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
              <Right>
                <Button transparent onPress={this.handleWriteReview}>
                  <View style={styles.backButtonContainer}>
                    <Text style={styles.backButtonRightText}>
                      {I18n.t('writeReview', {locale: lang})}
                    </Text>
                  </View>
                </Button>
              </Right>
            </Header>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{backgroundColor: '#ffffff'}}>
              <View
                style={{
                  height: normalize(40, 'height'),
                  marginHorizontal: normalize(16),
                  justifyContent: 'center',
                  //flexDirection: flexDirection,
                }}>
                <Text
                  style={{
                    fontSize: normalize(40),
                    fontWeight: 'bold',
                    alignSelf: alignSelf,
                  }}>
                  {`${reviews.length} ${I18n.t('reviews', {locale: lang})}`}
                </Text>
              </View>
              <View
                style={{
                  marginTop: normalize(24),
                  marginHorizontal: normalize(16),
                }}>
                <View style={{marginBottom: normalize(10)}}>
                  {reviews.map(item => {
                    return this.renderItem({item});
                  })}
                </View>
              </View>
              <WriteReview
                isShowWriteReview={isShowWriteReview}
                handleWriteReview={this.handleWriteReview}
                foreign_id={this.props.navigation.getParam('foreign_id')}
                class={this.props.navigation.getParam('class')}
                handleReviews={this.handleReviews}
                reviews={reviews}
              />
            </ScrollView>
          </SafeAreaView>
        )}
      </>
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
  backButtonRightText: {
    color: '#0053FE',
    fontSize: normalize(16),
  },
  backButtonText: {
    color: '#22242A',
    fontSize: normalize(12),

    marginLeft: normalize(10),
    top: Platform.OS === 'ios' ? normalize(3) : normalize(3.5),
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
  container: {
    flex: 1,
  },
  eventContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: normalize(16),
    marginTop: normalize(12),
  },
  gymRatingCountText: {
    color: '#8A8A8F',
    fontSize: normalize(12),
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  home: state.home,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {getReviews})(Review);
