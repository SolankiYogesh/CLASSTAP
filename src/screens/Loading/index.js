import React from 'react'
import {ActivityIndicator, StyleSheet,View} from 'react-native'

const Loading = () => {
  return (
    <View style={styles.lodaingContainer}>
      <ActivityIndicator size={'large'} color="blue" />
    </View>
  )
}

const styles = StyleSheet.create({
  lodaingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    justifyContent: 'center'
  }
})

export default Loading
