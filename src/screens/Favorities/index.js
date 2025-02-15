import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  Platform,
  BackHandler,
  Alert,
  RefreshControl,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';

import {Icon} from 'native-base';
import {connect} from 'react-redux';
import I18n from '../../utils/i18n';
import normalize from 'react-native-normalize';
import {
  getFavorites,
  removeFavorite,
  getClasses,
  getGyms,
  getFavoritesRefresh,
} from '../../actions/homeActions';
import Loading from '../Loading';
import ReviewShow from '../Review/ReviewShow';
import {IMAGE_URI} from '../../utils/config';
import isEmpty from '../../validation/is-empty';

import FavoriteRedIcon from '../../assets/img/favorite-red.svg';

const {width} = Dimensions.get('window');

export class Favorities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    if (!isEmpty(this.props.auth.user)) {
      const {id} = this.props.auth.user;
      this.props.getFavorites(id);
      //this.props.getGyms();
      //this.props.getClasses();
    } else {
      //this.props.navigation.navigate('Login');
    }
    this.focusListener = this.props.navigation.addListener('willFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    });

    this.focusListener1 = this.props.navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    });
    this.focusListener2 = this.props.navigation.addListener('didFocus', () => {
      // do something
      const {lang} = this.props.setting;
      if (isEmpty(this.props.auth.user)) {
        Alert.alert(
          I18n.t('login', {locale: lang}),
          I18n.t('loginToProceed', {locale: lang}),
          [
            {
              text: I18n.t('no', {locale: lang}),
              onPress: () => this.props.navigation.navigate('Home'),
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
      }
    });
    //BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = async back => {
    ///BackHandler.exitApp();
    //this.props.navigation.goBack();
    this.props.navigation.navigate('Home');
    return true;
  };

  componentWillUnmount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    this.focusListener.remove();
    this.focusListener1.remove();
    this.focusListener2.remove();
  }

  renderItem = ({item}) => {
    const attachments =
      item.class === 'Gym' ? item.gym.attachments : item.clas.attachments;
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    let image;

    if (attachments && attachments.length > 0) {
      let primaryAttachment = attachments.find(
        newImage => newImage.is_primary === true,
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
      image = require('../../assets/img/no_image_found.png');
    }
    return (
      <TouchableOpacity
        onPress={() =>
          item.class === 'Gym'
            ? this.props.navigation.navigate('Gym', {
                id: item.gym.id,
                back: 'Favorities',
              })
            : this.props.navigation.navigate('GymClass', {
                id: item.clas.id,
                back: 'Favorities',
              })
        }
        style={{flexDirection: flexDirection, marginBottom: normalize(16)}}>
        <View style={{display: 'flex', width: normalize(60)}}>
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
              resizeMode={'cover'}
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
                  fontSize: normalize(17),
                  fontWeight: '700',
                  textAlign: textAlign,
                }}>
                {item.class === 'Gym'
                  ? lang === 'ar'
                    ? item.gym.name_ar
                    : item.gym.name
                  : lang === 'ar'
                    ? item.clas.name_ar
                    : item.clas.name}
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: '#8A8A8F',
                  textAlign: textAlign,
                }}>
                {item.class === 'Gym'
                  ? `${item.gym.classes.length} ${I18n.t('classes', {
                      locale: lang,
                    })}`
                  : lang === 'ar'
                    ? item.clas.gym.name_ar
                    : item.clas.gym.name}
              </Text>
              <View
                style={[
                  styles.classRatingContainer,
                  {flexDirection: flexDirection},
                ]}>
                <ReviewShow
                  rating={
                    item.class === 'Gym'
                      ? item.gym.rating_avg
                      : item.clas.rating_avg
                  }
                  style={{
                    fontSize: normalize(11),
                    paddingRight: normalize(2.75),
                  }}
                />

                <Text style={styles.gymRatingCountText}>
                  (
                  {item.class === 'Gym'
                    ? item.gym.rating_count
                    : item.clas.rating_count}
                  )
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              marginRight: Platform.OS === 'ios' ? normalize(3) : 0,
              marginLeft: Platform.OS === 'ios' ? normalize(3) : 0,
            }}>
            <TouchableOpacity
              onPress={() => this.handleRemoveFavorite(item.id)}>
              <FavoriteRedIcon width={normalize(24)} height={normalize(24)} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderItemGym = ({item}) => {
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    const {id, name, name_ar, attachments, distance} = item;
    let image;

    if (attachments && attachments.length > 0) {
      let primaryAttachment = attachments.find(
        newImage => newImage.is_primary === true,
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
      image = require('../../assets/img/no_image_found.png');
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Gym', {id, back: 'Favorities'})
        }
        style={{
          width: normalize(204),
          marginRight: normalize(10),
          height: normalize(157),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}],
        }}>
        <View
          style={{
            width: normalize(204),
            height: normalize(136),
            //borderRadius: 10,
          }}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(204),
                height: normalize(136),
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
              resizeMode={'cover'}
              source={image}
              style={{
                width: normalize(204),
                height: normalize(136),
                borderRadius: normalize(10),
              }}
            />
          )}
          {distance ? (
            <View
              style={[
                {position: 'absolute', bottom: normalize(10)},
                lang === 'ar' ? styles.moveRight : styles.moveLeft,
              ]}>
              <View
                style={{
                  backgroundColor: '#ffffff',

                  borderRadius: normalize(14),
                  fontSize: normalize(10),
                  paddingHorizontal: normalize(5),
                  paddingVertical: normalize(2),
                }}>
                <Text>
                  {distance >= 1
                    ? `${distance.toFixed(2)} km`
                    : `${distance.toFixed(3) * 1000} m`}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <View style={{marginTop: normalize(3)}}>
          <Text style={{fontSize: normalize(15), textAlign: textAlign}}>
            {lang === 'ar' ? name_ar : name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  renderItemClass = ({item}) => {
    const {lang} = this.props.setting;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    const {id, name, name_ar, attachments} = item;
    let image;

    if (attachments && attachments.length > 0) {
      let primaryAttachment = attachments.find(
        newImage => newImage.is_primary === true,
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
      image = require('../../assets/img/no_image_found.png');
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('GymClass', {id, back: 'Favorities'})
        }
        style={{
          width: normalize(142),
          marginRight: normalize(10),
          height: normalize(171),
          transform: [{scaleX: lang === 'ar' ? -1 : 1}],
        }}>
        <View
          style={{
            width: normalize(142),
            height: normalize(142),
            //borderRadius: 10,
          }}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(142),
                height: normalize(142),
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
              resizeMode={'cover'}
              source={image}
              style={{
                width: normalize(142),
                height: normalize(142),
                borderRadius: normalize(10),
              }}
            />
          )}
        </View>
        <View style={{marginTop: normalize(5)}}>
          <Text style={{fontSize: normalize(15), textAlign: textAlign}}>
            {lang === 'ar' ? name_ar : name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  handleRemoveFavorite = id => {
    this.props.removeFavorite(id);
  };
  handleRefresh = async () => {
    this.setState({refreshing: true});
    if (!isEmpty(this.props.auth.user)) {
      const {id} = this.props.auth.user;
      this.props.getFavoritesRefresh(id);
    }
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
  };
  render() {
    const {refreshing} = this.state;
    const {favourites, recommendedGyms, recommendedClasses} = this.props.home;
    const {lang} = this.props.setting;
    const {isLodaing} = this.props.errors;
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row';
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    return (
      <>
        {isLodaing || isEmpty(this.props.auth.user) ? (
          <Loading />
        ) : (
          <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.handleRefresh}
                />
              }>
              <View
                style={{
                  height: normalize(40),
                  marginHorizontal: normalize(16),
                  justifyContent: 'center',
                  marginTop: normalize(16),
                }}>
                <Text
                  style={{
                    fontSize: normalize(40),
                    fontWeight: 'bold',
                    alignSelf: alignSelf,
                  }}>
                  {I18n.t('favorites', {locale: lang})}
                </Text>
              </View>
              <View
                style={{
                  marginTop: normalize(24),
                  marginHorizontal: normalize(16),
                }}>
                {favourites.length > 0 ? (
                  <View style={{marginBottom: normalize(10)}}>
                    {favourites.map(item => {
                      return this.renderItem({item});
                    })}
                  </View>
                ) : (
                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: normalize(16),
                        color: '#8f8f8f',
                        textAlign: textAlign,
                      }}>
                      {I18n.t('noFavourites', {locale: lang})}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  flexDirection: flexDirection,
                }}>
                <Text style={{fontSize: normalize(20), fontWeight: 'bold'}}>
                  {I18n.t('recommendedGyms', {locale: lang})}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: normalize(16),
                  width: width,
                  height: normalize(171),
                  transform: [{rotateY: lang === 'ar' ? '180deg' : '0deg'}],
                  paddingLeft: normalize(16),
                  flexDirection: flexDirection,
                }}>
                {recommendedGyms.length > 0 ? (
                  <FlatList
                    horizontal={true}
                    style={[styles.container]}
                    data={recommendedGyms}
                    renderItem={this.renderItemGym}
                    keyExtractor={item => item.id.toString()}
                  />
                ) : (
                  <View
                    style={{
                      width: normalize(204),
                      marginRight: normalize(10),
                      height: normalize(157),
                      transform: [{rotateY: lang === 'ar' ? '180deg' : '0deg'}],
                      borderRadius: normalize(10),
                      backgroundColor: '#efefef',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: normalize(16), color: '#8f8f8f'}}>
                      {I18n.t('noRecommendedGyms', {locale: lang})}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  marginTop: normalize(20),
                  marginHorizontal: normalize(16),
                  flexDirection: flexDirection,
                }}>
                <Text style={{fontSize: normalize(20), fontWeight: 'bold'}}>
                  {I18n.t('recommendedClasses', {locale: lang})}
                </Text>
              </View>

              <View
                style={{
                  marginVertical: normalize(16),
                  width: width,
                  height: normalize(171),
                  transform: [{rotateY: lang === 'ar' ? '180deg' : '0deg'}],
                  paddingLeft: normalize(16),
                  flexDirection: flexDirection,
                }}>
                {recommendedClasses.length > 0 ? (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    style={[styles.container]}
                    data={recommendedClasses}
                    renderItem={this.renderItemClass}
                    keyExtractor={item => item.id.toString()}
                  />
                ) : (
                  <View
                    style={{
                      width: normalize(142),
                      marginRight: normalize(10),
                      height: normalize(171),
                      transform: [{rotateY: lang === 'ar' ? '180deg' : '0deg'}],
                      borderRadius: normalize(10),
                      backgroundColor: '#efefef',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(16),
                        color: '#8f8f8f',
                        textAlign: 'center',
                      }}>
                      {I18n.t('noRecommendedClasses', {locale: lang})}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventContainer: {
    marginTop: normalize(12),
    marginHorizontal: normalize(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  classRatingContainer: {
    display: 'flex',
    alignItems: 'center',

    //flexDirection: 'row',
  },
  classStarIcon: {
    fontSize: normalize(11),
    color: '#FE9800',
    paddingRight: normalize(2.75),
  },
  gymRatingCountText: {
    color: '#8A8A8F',
    fontSize: normalize(12),
  },
  moveRight: {
    right: normalize(10),
  },
  moveLeft: {
    left: normalize(10),
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  home: state.home,
  setting: state.setting,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getFavorites,
  removeFavorite,
  getClasses,
  getGyms,
  getFavoritesRefresh,
})(Favorities);
