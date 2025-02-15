import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FavoritieNavigator from './FavoritieNavigator';
import ProfileNavigator from './ProfileNavigator';
import HomeNavigator from './HomeNavigator';
import i18n from '../translations/i18n';
import FindClassNavigator from './FindClassNavigator';
import normalize from 'react-native-normalize';
import ProfileActiveIcon from '../assets/img/profile-active.svg';
import FavoriteIcon from './src/assets/img/favorite.svg';
import FavoriteActiveIcon from './src/assets/img/favorite-active.svg';
import SearchIcon from './src/assets/img/search.svg';
import SearchActiveIcon from './src/assets/img/search-active.svg';
import HomeIcon from './src/assets/img/home.svg';
import HomeActiveIcon from './src/assets/img/home-active.svg';
import ProfileIcon from './src/assets/img/profile.svg';

const Tab = createBottomTabNavigator();
export default ({lang}: any) => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarActiveTintColor: '#FE9800',
      tabBarShowLabel: false,
      tabBarStyle: {
        borderTopColor: 'rgba(108, 123, 138, 0.1)',
      },
    }}>
    {/* Home Tab */}
    <Tab.Screen
      name="Home"
      component={HomeNavigator}
      options={{
        tabBarLabel: i18n.t('home', {locale: lang}),
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
        tabBarLabel: i18n.t('findClass', {locale: lang}),
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
        tabBarLabel: i18n.t('favorities', {locale: lang}),
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
        tabBarLabel: i18n.t('profile', {locale: lang}),
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
