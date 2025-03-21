/* eslint-disable react-native/no-inline-styles */
import notifee from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {extendTheme, NativeBaseProvider} from 'native-base'
import React, {useCallback, useEffect, useMemo,useState} from 'react'
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


  useEffect(() => {
    const saveFirstStart = async () => {
      const status = await AsyncStorage.getItem('firstStart')
  
      if (!status) {
        notifee.setBadgeCount(0)
        AsyncStorage.setItem('firstStart', 'true')
      }
    }
    saveFirstStart()
  }, [])

  const onAnimationFinish = useCallback(()=>{
    store.dispatch(getGyms())
      store.dispatch(getCategories())
      store.dispatch(getGymsLocation())
      store.dispatch(getRecommendedGyms())
      store.dispatch(getRecommendedClasses())
      store.dispatch(getTodayClasses())
      store.dispatch(getGymsRefresh())
  },[])

  const theme = extendTheme({
    colors: {
      primary:{
        "100":"#FE9800",
        "200":"#FE9800",
        "300":"#FE9800",
        "400":"#FE9800",
        "500":"#FE9800",
        "600":"#FE9800",
        "700":"#FE9800",
        "800":"#FE9800",
        "900":"#FE9800",
      },
    },
  });

  return   <Provider  store={store}>
  <ToastProvider>
    <NativeBaseProvider theme={theme}>
      <View style={{flex: 1, paddingBottom:isNeedStack? normalize(20):0}}>
        <AppNavigation
        
        />
      </View>
    </NativeBaseProvider>
    {!animationFinished && (
      <SplashScreen  onAnimationFinish={()=> {
        setAnimationFinished(true)
         onAnimationFinish()
      }} />
    )}
  </ToastProvider>
</Provider>
}

export default App
