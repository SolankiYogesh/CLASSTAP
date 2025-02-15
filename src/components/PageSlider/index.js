import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import normalize from 'react-native-normalize';
import {IMAGE_URI} from '../../utils/config';
import isEmpty from '../../validation/is-empty';
import I18n from '../../utils/i18n';

import CircleCheckIcon from '../../assets/img/check_circle.svg';
import CircleCheckActiveIcon from '../../assets/img/check_circle_active.svg';
import CircleCheckSelectIcon from '../../assets/img/check_circle_select.svg';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import styles from './styles';
const width = Dimensions.get('window').width;

const PageSlider = props => {
  const [selectedIndex, setIndex] = useState(0);
  const [selectPackage, setPackage] = useState();
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setIndex(props.selectIndex);
    setPackage(props.selectPackage);

    setShowList(true);
  }, [props]);

  const setSelectedIndex = selectedIndex => {
    setIndex(selectedIndex);
    props.handleSelectIndex(selectedIndex);
    handlePackage(selectedIndex);
  };

  const handlePackage = index => {
    props.handleSelectPackage(props.data[index].id);
    setPackage(props.data[index].id);
  };

  const pagination = () => {
    return (
      <Pagination
        dotsLength={props.data.length}
        activeDotIndex={selectedIndex}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'black',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  const renderItem = ({item, index}) => {
    const {lang} = props.setting;
    const textAlign = lang === 'ar' ? 'right' : 'left';
    const alignSelf = lang === 'ar' ? 'flex-end' : 'flex-start';
    const alignItems = lang === 'ar' ? 'flex-end' : 'flex-start';

    const {
      id,
      attachment,
      name,
      name_ar,
      description_ar,
      description,
      price,
      period,
    } = item;

    let image;

    if (!isEmpty(attachment)) {
      image = {
        uri: `${IMAGE_URI}/${attachment.dir}/${attachment.file_name}`,
      };
    } else {
      image = require('../../assets/img/no_image_found.png');
    }
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handlePackage(index)}
        style={[
          {transform: [{scaleX: lang === 'ar' ? -1 : 1}]},
          styles.sliderItem,
        ]}>
        <View style={styles.contentItem}>
          <Image style={styles.backgroundImage} source={image} />

          <TouchableOpacity
            onPress={() => handlePackage(index)}
            style={{
              position: 'absolute',
              right: normalize(8),
              top: normalize(8),
            }}>
            {props.subscription_id === id &&
            !props.isLastPackage &&
            props.type !== 'new' ? (
              <CircleCheckActiveIcon
                width={normalize(24)}
                height={normalize(24)}
              />
            ) : selectPackage === id ? (
              <CircleCheckSelectIcon
                width={normalize(24)}
                height={normalize(24)}
              />
            ) : (
              <CircleCheckIcon width={normalize(24)} height={normalize(24)} />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1.7,
            alignSelf: alignSelf,
            alignItems: alignItems,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                //fontSize: normalize(14),
                fontSize: normalize(12),
                fontWeight: '600',
                color: '#FE9800',
                textAlign: textAlign,
              }}>
              {lang === 'ar' ? name_ar : name}
            </Text>
          </View>
          <Text
            style={{
              fontSize: normalize(13),
              fontWeight: '600',
              color: '#22242A',
              textAlign: textAlign,
            }}>
            {lang === 'ar' ? description_ar : description}
          </Text>
          <View style={{marginTop: normalize(6)}}>
            <Text
              style={{
                fontSize: normalize(20),
                fontWeight: 'bold',
                color: '#0053FE',
                textAlign: textAlign,
              }}>
              {price} {I18n.t('QAR', {locale: lang})}
            </Text>
          </View>

          <Text
            style={{
              fontSize: normalize(12),
              color: '#8A8A8F',
              textAlign: textAlign,
            }}>
            {period > 1
              ? `${period} ${I18n.t('months', {locale: lang})}`
              : I18n.t('perMonth', {locale: lang})}
            {}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.pageWrapper}>
      <View style={{flex: 6}}>
        {props.data && showList && (
          <Carousel
            data={props.data}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width - 20}
            layout={'default'}
            onSnapToItem={setSelectedIndex}
            firstItem={selectedIndex}
            initialNumToRender={100}
            useScrollView
          />
        )}
      </View>

      {pagination()}
    </View>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  setting: state.setting,
  subscription: state.subscription,
  errors: state.errors,
});

export default connect(mapStateToProps, {})(PageSlider);
