import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import normalize from 'react-native-normalize';

import FavoriteIcon from '../assets/img/favorite.svg';
import FavoriteActiveIcon from '../assets/img/favorite-active.svg';
import HomeIcon from '../assets/img/home.svg';
import HomeActiveIcon from '../assets/img/home-active.svg';
import ProfileIcon from '../assets/img/profile.svg';
import ProfileActiveIcon from '../assets/img/profile-active.svg';
import SearchIcon from '../assets/img/search.svg';
import SearchActiveIcon from '../assets/img/search-active.svg';
import I18n from '../utils/i18n';
import FavoritieNavigator from './FavoritieNavigator';
import FindClassNavigator from './FindClassNavigator';
import HomeNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();
export default ({lang}: any) => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarActiveTintColor: '#FE9800',
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: {
        borderTopColor: 'rgba(108, 123, 138, 0.1)',
      },
    }}>
    {/* Home Tab */}
    <Tab.Screen
      name="Home"
      component={HomeNavigator}
      options={{
        tabBarLabel: I18n.t('home', {locale: lang}),
        tabBarIcon: ({focused}) =>
          focused ? (
            <HomeActiveIcon width={normalize(30)} height={normalize(30)} />
          ) : (
            <HomeIcon width={normalize(30)} height={normalize(30)} />
          ),
      }}
    />

    {/* FindClass Tab */}
    <Tab.Screen
      name="FindClass"
      component={FindClassNavigator}
      options={{
        tabBarLabel: I18n.t('findClass', {locale: lang}),
        tabBarIcon: ({focused}) =>
          focused ? (
            <SearchActiveIcon width={normalize(30)} height={normalize(30)} />
          ) : (
            <SearchIcon width={normalize(30)} height={normalize(30)} />
          ),
      }}
    />

    {/* Favorities Tab */}
    <Tab.Screen
      name="Favorities"
      component={FavoritieNavigator}
      options={{
        tabBarLabel: I18n.t('favorities', {locale: lang}),
        tabBarIcon: ({focused}) =>
          focused ? (
            <FavoriteActiveIcon width={normalize(30)} height={normalize(30)} />
          ) : (
            <FavoriteIcon width={normalize(30)} height={normalize(30)} />
          ),
      }}
    />

    {/* Profile Tab */}
    <Tab.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{
        tabBarLabel: I18n.t('profile', {locale: lang}),
        tabBarIcon: ({focused}) =>
          focused ? (
            <ProfileActiveIcon width={normalize(30)} height={normalize(30)} />
          ) : (
            <ProfileIcon width={normalize(30)} height={normalize(30)} />
          ),
      }}
    />
  </Tab.Navigator>
);
