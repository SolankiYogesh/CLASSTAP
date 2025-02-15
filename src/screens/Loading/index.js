import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const Loading = () => {
  return (
    <View style={styles.lodaingContainer}>
      <ActivityIndicator size={'large'} color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  lodaingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default Loading;
