import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import normalize from 'react-native-normalize';
const width = Dimensions.get('window').width;
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const WEEK_en = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export default ({isChinese, weekStartsOn}) => {
  const week_localized = isChinese ? WEEK : WEEK_en;
  const weekStartsOnMinnor = weekStartsOn % 7;
  //const weekStartsOnMinnor = 0 % 7;

  const weekTranformed = [
    ...week_localized.slice(weekStartsOnMinnor),
    ...week_localized.slice(0, weekStartsOnMinnor),
  ];

  return (
    <View
      style={{
        width,
        height: normalize(30),
        flexDirection: 'row',
      }}>
      {weekTranformed.map(day => (
        <View
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          key={day}>
          <Text
            style={{
              color: '#8A8A8F',
              fontSize: normalize(14),
            }}>
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
};
