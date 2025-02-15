import FastImage from '@d11/react-native-fast-image'
import moment from 'moment-timezone'
import {Container} from 'native-base'
import React, {Component} from 'react'
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import normalize from 'react-native-normalize'
import {connect} from 'react-redux'

import {getCompletedClasses} from '../../actions/subscriptionActions'
import HeaderComponent from '../../components/Header'
import {API_URI,IMAGE_URI} from '../../utils/config'
import I18n from '../../utils/i18n'
import isEmpty from '../../validation/is-empty'
import Loading from '../Loading'
import ReviewShow from '../Review/ReviewShow'
moment.tz.setDefault('Asia/Qatar')

export class Completed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      completedClasses: [],
      isLoading: true
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEmpty(props.subscription.completedClasses)) {
      return {
        completedClasses: props.subscription.completedClasses,
        isLoading: false
      }
    }
    return null
  }

  async componentDidMount() {
    const {completedClasses} = this.props.subscription
    this.setState({completedClasses: completedClasses, isLoading: false})
    /*  const {id} = await this.props.auth.user;
    let url = `${API_URI}/booking_classes?filter={"where": {"user_id": ${id}}}`;

    await axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
        } else {
          const {data} = res.data;
          this.setState({completedClasses: data, isLoading: false});
          return true;
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
      }); */

    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleNavigateCompletedClass = (e, id, isCoachRev) => {
    e.preventDefault()
    this.props.navigation.navigate({
      routeName: 'BookClass',
      params: {
        id: id,
        isCoachReview: isCoachRev
      },
      key: `CompletedClass_${Math.random() * 10000}`
    })
  }
  renderItem = ({item}) => {
    const {id, class: gymClass, schedule_date} = item
    const {name, name_ar, gym, rating_avg, rating_count, attachments} =
      gymClass
    const {lang} = this.props.setting
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    let image

    if (attachments && attachments.length > 0) {
      let primaryAttachment = attachments.find(
        newImage => newImage.is_primary === true,
      )

      if (!isEmpty(primaryAttachment)) {
        image = {
          uri: `${IMAGE_URI}/${primaryAttachment.dir}/${primaryAttachment.file_name}`
        }
      } else {
        image = {
          uri: `${IMAGE_URI}/${attachments[0].dir}/${attachments[0].file_name}`
        }
      }
    } else {
      image = require('../../assets/img/no_image_found.png')
    }
    let isCoachRev = !isEmpty(item.class_schedule.coach_review) ? false : true
    return (
      <TouchableOpacity
        onPress={e => this.handleNavigateCompletedClass(e, id, isCoachRev)}
        style={{flexDirection: flexDirection, marginBottom: normalize(16)}}>
        <View style={{display: 'flex', width: normalize(60)}}>
          {image.url ? (
            <FastImage
              style={{
                width: normalize(60),
                height: normalize(60),
                borderRadius: normalize(10)
              }}
              source={{
                uri: image.url,
                priority: FastImage.priority.normal
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
                borderRadius: normalize(10)
              }}
            />
          )}
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: flexDirection,
            width: normalize(190),
            marginLeft: normalize(20),
            justifyContent: 'space-between'
          }}>
          <View>
            <View>
              <Text
                style={{
                  fontSize: normalize(17),
                  fontWeight: '700',
                  textAlign: textAlign
                }}>
                {lang === 'ar' ? name_ar : name}
              </Text>
              <View style={{marginTop: normalize(5)}}>
                <Text
                  style={{
                    fontSize: normalize(12),
                    color: '#8A8A8F',
                    textAlign: textAlign
                  }}>
                  {lang === 'ar' ? gym.name_ar : gym.name}
                </Text>
              </View>

              <View
                style={[
                  styles.classRatingContainer,
                  {flexDirection: flexDirection}
                ]}>
                <ReviewShow
                  rating={rating_avg}
                  style={{
                    fontSize: normalize(11),
                    paddingRight: normalize(2.75)
                  }}
                />

                <Text style={styles.gymRatingCountText}>({rating_count})</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end'
          }}>
          <Text style={{fontSize: normalize(12), color: '#8A8A8F'}}>
            {moment(schedule_date.date, 'YYYY-MM-DD').format('D MMM YYYY')}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  handleBack = async () => {
    this.props.navigation.goBack()
    return true
  }

  render() {
    const {completedClasses, isLoading} = this.state
    const {lang} = this.props.setting
    const flexDirection = lang === 'ar' ? 'row-reverse' : 'row'
    const textAlign = lang === 'ar' ? 'right' : 'left'
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start'
    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <Container style={{flex: 1, backgroundColor: '#ffffff'}}>
            <HeaderComponent navigation={this.props.navigation} />
            <View
              // showsVerticalScrollIndicator={false}
              style={{backgroundColor: '#ffffff', flex: 1}}>
              <View
                style={{
                  height: normalize(50),
                  marginHorizontal: normalize(16),
                  justifyContent: 'center'
                  //flexDirection: flexDirection,
                }}>
                <Text
                  style={{
                    fontSize: normalize(40),
                    fontWeight: 'bold',
                    alignSelf: alignSelf
                  }}>
                  {`${completedClasses.length} ${I18n.t('completed', {
                    locale: lang
                  })}`}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: normalize(24),
                  marginHorizontal: normalize(16)
                }}>
                {completedClasses.length > 0 ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.container}
                    data={completedClasses}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                  />
                ) : (
                  <View>
                    <Text
                      style={{
                        color: '#8f8f8f',
                        fontSize: normalize(16),
                        textAlign: textAlign
                      }}>
                      {I18n.t('noCompletedClasses', {locale: lang})}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Container>
        )}
      </>
    )
  }
}

const styles = StyleSheet.create({
  classRatingContainer: {
    alignItems: 'center',
    display: 'flex',
    marginTop: normalize(5)

    //flexDirection: 'row',
  },
  classStarIcon: {
    color: '#FE9800',
    fontSize: normalize(11),
    paddingRight: normalize(2.75)
  },
  container: {
    flex: 1
  },
  eventContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: normalize(16),
    marginTop: normalize(12)
  },
  gymRatingCountText: {
    color: '#8A8A8F',
    fontSize: normalize(12)
  }
})

const mapStateToProps = state => ({
  auth: state.auth,
  subscription: state.subscription,
  setting: state.setting,
  errors: state.errors
})

export default connect(mapStateToProps, {getCompletedClasses})(Completed)
