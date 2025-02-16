import React, {useEffect} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import normalize from 'react-native-normalize';
import analytics from '@react-native-firebase/analytics';
import Const from '../../utils/Const';

const handleMoveScreen = (screen, navigation) => {
  navigation.navigate(screen);
};
const Success = props => {
  const {text, shortText, buttonText, MoveScreenName} =
    props.navigation.state.params;

  useEffect(() => {
    analytics().logEvent(Const.ANALYTICS_EVENT.SUCCESS_SCREEN);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <View style={{flex: 3, alignItems: 'center', marginTop: normalize(20)}}>
        <Image
          source={require('../../assets/img/welcome.gif')}
          style={{height: normalize(320), width: normalize(320)}}
        />
      </View>
      <View style={{flex: 2}}>
        <View
          style={{marginTop: normalize(30), marginHorizontal: normalize(36)}}>
          <Text
            style={{
              fontSize: normalize(40),
              color: '#231F20',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {text}
          </Text>
        </View>
        <View
          style={{marginTop: normalize(10), marginHorizontal: normalize(78)}}>
          <Text
            style={{
              fontSize: normalize(13),
              color: '#8A8A8F',
              textAlign: 'center',
            }}>
            {shortText}
          </Text>
        </View>
        <View
          style={{
            marginTop: normalize(40),
            marginLeft: normalize(40),
            marginRight: normalize(40),
          }}>
          <TouchableOpacity
            onPress={() => handleMoveScreen(MoveScreenName, props.navigation)}
            style={{
              width: normalize(295),
              height: normalize(46),
              backgroundColor: '#FE9800',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: normalize(23),
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: normalize(15),
                ///fontWeight: 'bold',
              }}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Success;
