import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Provider} from 'react-redux';
import normalize from 'react-native-normalize';
import {NativeBaseProvider} from 'native-base';
import notifee from '@notifee/react-native';
import I18n from './src/utils/i18n';

import store from './store';

import AuthLoading from './src/components/AuthLoading';
import SplashScreen from './src/screens/SplashScreen';

import NavigationService from './NavigationService';
import {ToastProvider} from 'react-native-toast-notifications';
import DeviceInfo from 'react-native-device-info';

import {
  AuthNavigator,
  HomeNavigator,
  FindClassNavigator,
  FavoritieNavigator,
  ProfileNavigator,
} from './NavigatorStacks';

import {
  getGyms,
  getCategories,
  getGymsLocation,
  getRecommendedGyms,
  getRecommendedClasses,
  getTodayClasses,
  getGymsRefresh,
} from './src/actions/homeActions';

import HomeIcon from './src/assets/img/home.svg';
import HomeActiveIcon from './src/assets/img/home-active.svg';
import SearchIcon from './src/assets/img/search.svg';
import SearchActiveIcon from './src/assets/img/search-active.svg';
import FavoriteIcon from './src/assets/img/favorite.svg';
import FavoriteActiveIcon from './src/assets/img/favorite-active.svg';
import ProfileIcon from './src/assets/img/profile.svg';
import ProfileActiveIcon from './src/assets/img/profile-active.svg';

FindClassNavigator.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  for (let i = 0; i < navigation.state.routes.length; i++) {
    if (navigation.state.routes[i].routeName == 'Filter') {
      tabBarVisible = false;
    }
  }

  return {
    tabBarVisible,
  };
};

ProfileNavigator.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  for (let i = 0; i < navigation.state.routes.length; i++) {
    if (navigation.state.routes[i].routeName == 'Account') {
      tabBarVisible = false;
    }
  }

  return {
    tabBarVisible,
  };
};

let TAB_BAR_NAV = {};

const App = () => {
  const [lang, setLang] = useState('en');
  const [animationFinished, setAnimationFinished] = useState(false);
  const [isNeedStack, setIsNeedStack] = useState(false);

  const getLanguage = async () => {
    const lang = await AsyncStorage.getItem('lang');
    setLang(lang !== null ? lang : 'en');
  };

  const getDeviceType = async () => {
    let brand = await DeviceInfo.getModel();
    if (brand.includes('12') || brand.includes('13')) {
      setIsNeedStack(true);
    }
  };

  const saveFirstStart = async () => {
    const status = await AsyncStorage.getItem('firstStart');

    if (!status) {
      notifee.setBadgeCount(0);
      AsyncStorage.setItem('firstStart', 'true');
    }
  };

  useEffect(() => {
    getDeviceType();
    getLanguage();
    saveFirstStart();
  }, []);

  const onAnimationFinish = () => {
    setAnimationFinished(true);
  };

  if (lang === 'ar') {
    TAB_BAR_NAV = {
      Profile: {
        screen: ProfileNavigator,
        navigationOptions: {
          tabBarLabel: I18n.t('profile', {locale: lang}),
          tabBarIcon: ({focused}) => {
            return focused ? (
              <ProfileActiveIcon width={normalize(30)} height={normalize(30)} />
            ) : (
              <ProfileIcon width={normalize(30)} height={normalize(30)} />
            );
          },
        },
      },
      Favorities: {
        screen: FavoritieNavigator,
        navigationOptions: {
          tabBarLabel: I18n.t('favorities', {locale: lang}),
          tabBarIcon: ({focused}) => {
            return focused ? (
              <FavoriteActiveIcon
                width={normalize(30)}
                height={normalize(30)}
              />
            ) : (
              <FavoriteIcon width={normalize(30)} height={normalize(30)} />
            );
          },
        },
      },

      FindClass: {
        screen: FindClassNavigator,
        navigationOptions: {
          tabBarLabel: I18n.t('findClass', {locale: lang}),
          tabBarIcon: ({focused}) => {
            return focused ? (
              <SearchActiveIcon width={normalize(30)} height={normalize(30)} />
            ) : (
              <SearchIcon width={normalize(30)} height={normalize(30)} />
            );
          },
        },
      },

      Home: {
        screen: HomeNavigator,
        navigationOptions: {
          tabBarLabel: I18n.t('home', {locale: lang}),
          tabBarIcon: ({focused}) => {
            return focused ? (
              <HomeActiveIcon width={normalize(30)} height={normalize(30)} />
            ) : (
              <HomeIcon width={normalize(30)} height={normalize(30)} />
            );
          },
        },
      },
    };
  } else {
    TAB_BAR_NAV = {
      Home: {
        screen: HomeNavigator,
        navigationOptions: {
          tabBarLabel: I18n.t('home', {locale: lang}),
          tabBarIcon: ({focused}) => {
            return focused ? (
              <HomeActiveIcon width={normalize(30)} height={normalize(30)} />
            ) : (
              <HomeIcon width={normalize(30)} height={normalize(30)} />
            );
          },
        },
      },
      FindClass: {
        screen: FindClassNavigator,
        navigationOptions: {
          tabBarLabel: I18n.t('findClass', {locale: lang}),
          tabBarIcon: ({focused}) => {
            return focused ? (
              <SearchActiveIcon width={normalize(30)} height={normalize(30)} />
            ) : (
              <SearchIcon width={normalize(30)} height={normalize(30)} />
            );
          },
        },
      },
      Favorities: {
        screen: FavoritieNavigator,
        navigationOptions: {
          tabBarLabel: I18n.t('favorities', {locale: lang}),
          tabBarIcon: ({focused}) => {
            return focused ? (
              <FavoriteActiveIcon
                width={normalize(30)}
                height={normalize(30)}
              />
            ) : (
              <FavoriteIcon width={normalize(30)} height={normalize(30)} />
            );
          },
        },
      },
      Profile: {
        screen: ProfileNavigator,
        navigationOptions: {
          tabBarLabel: I18n.t('profile', {locale: lang}),
          tabBarIcon: ({focused}) => {
            return focused ? (
              <ProfileActiveIcon width={normalize(30)} height={normalize(30)} />
            ) : (
              <ProfileIcon width={normalize(30)} height={normalize(30)} />
            );
          },
        },
      },
    };
  }

  const AppNavigator = createBottomTabNavigator(TAB_BAR_NAV, {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#FE9800',
      showLabel: false,
      style: {
        borderTopColor: 'rgba(108, 123, 138, 0.1)',
      },
    },
  });

  const MainNavigator = createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      Auth: AuthNavigator,
      Main: AppNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  );

  const AppContainer = createAppContainer(MainNavigator);

  useEffect(() => {
    if (!animationFinished) {
      store.dispatch(getGyms());
      store.dispatch(getCategories());
      store.dispatch(getGymsLocation());
      store.dispatch(getRecommendedGyms());
      store.dispatch(getRecommendedClasses());
      store.dispatch(getTodayClasses());
      store.dispatch(getGymsRefresh());
    }
  }, [animationFinished]);

  return isNeedStack ? (
    <Provider store={store}>
      <ToastProvider>
        <NativeBaseProvider>
          <View style={{flex: 1, paddingBottom: normalize(20)}}>
            <AppContainer
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </View>
        </NativeBaseProvider>
        {!animationFinished && (
          <SplashScreen onAnimationFinish={onAnimationFinish} />
        )}
      </ToastProvider>
    </Provider>
  ) : (
    <Provider store={store}>
      <ToastProvider>
        <NativeBaseProvider>
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </NativeBaseProvider>
        {!animationFinished && (
          <SplashScreen onAnimationFinish={onAnimationFinish} />
        )}
      </ToastProvider>
    </Provider>
  );
};

export default App;
