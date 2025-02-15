/* eslint-disable react-native/no-inline-styles */
import notifee from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Root} from 'native-base'
import React, {useEffect, useMemo,useState} from 'react'
import {View} from 'react-native'
import  { getModel } from 'react-native-device-info'
import normalize from 'react-native-normalize'
import {ToastProvider} from 'react-native-toast-notifications'
import {Provider} from 'react-redux'

import {
  getCategories,
  getGyms,
  getGymsLocation,
  getGymsRefresh,
  getRecommendedClasses,
  getRecommendedGyms,
  getTodayClasses
} from './src/actions/homeActions'
import AppNavigation from './src/Router/AppNavigation'
import SplashScreen from './src/screens/SplashScreen'
import store from './store'

const App = () => {
  const [animationFinished, setAnimationFinished] = useState(false)

  const isNeedStack = useMemo(()=>{
    const brand =  getModel()
    return brand.includes('12') || brand.includes('13')
  },[])


  const saveFirstStart = async () => {
    const status = await AsyncStorage.getItem('firstStart')

    if (!status) {
      notifee.setBadgeCount(0)
      AsyncStorage.setItem('firstStart', 'true')
    }
  }

  useEffect(() => {
    saveFirstStart()
  }, [])

  const onAnimationFinish = () => {
    setAnimationFinished(true)
  }

  useEffect(() => {
    if (!animationFinished) {
      store.dispatch(getGyms())
      store.dispatch(getCategories())
      store.dispatch(getGymsLocation())
      store.dispatch(getRecommendedGyms())
      store.dispatch(getRecommendedClasses())
      store.dispatch(getTodayClasses())
      store.dispatch(getGymsRefresh())
    }
  }, [animationFinished])

  return   <Provider  store={store}>
  <ToastProvider>
    <Root>
      <View style={{flex: 1, paddingBottom:isNeedStack? normalize(20):0}}>
        <AppNavigation
        
        />
      </View>
    </Root>
    {!animationFinished && (
      <SplashScreen  onAnimationFinish={onAnimationFinish} />
    )}
  </ToastProvider>
</Provider>
}

export default App
