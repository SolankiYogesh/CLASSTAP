import React, {Fragment} from 'react';
import {View, Text} from 'react-native';
import {Icon} from 'native-base';

const ReviewShow = ({rating, style}) => {
  let React_Native_Rating_Bar = [];
  //Array to hold the filled or empty Stars
  for (var i = 1; i <= 5; i++) {
    React_Native_Rating_Bar.push(
      <Fragment key={i}>
        {i <= rating ? (
          <Icon
            type="FontAwesome"
            name="star"
            style={[style, {color: '#FE9800'}]}
            key={i}
          />
        ) : (
          <Icon
            type="FontAwesome"
            name="star"
            style={[style, {color: '#EFEFF4'}]}
            key={i}
          />
        )}
      </Fragment>,
    );
  }
  return <>{React_Native_Rating_Bar}</>;
};

export default ReviewShow;
