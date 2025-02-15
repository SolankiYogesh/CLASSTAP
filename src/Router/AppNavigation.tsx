import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthLoading from '../components/AuthLoading';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import {memo, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef} from '../Rootnavigation';
const Stack = createNativeStackNavigator();

export default memo(() => {
  const [lang, setLang] = useState('en');

  const getLanguage = async () => {
    const lang = await AsyncStorage.getItem('lang');
    setLang(lang !== null ? lang : 'en');
  };

  useEffect(() => {
    getLanguage();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          initialParams={{lang: lang}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});
