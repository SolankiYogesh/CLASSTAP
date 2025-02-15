import {createStackNavigator} from 'react-navigation-stack';


import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import ForgotPassword from './src/screens/ForgotPassword';
import Welcome from './src/screens/Welcome';
import Home from './src/screens/Home';
import FindClass from './src/screens/FindClass';
import Favorities from './src/screens/Favorities';
import Profile from './src/screens/Profile';
import Otp from './src/screens/Otp';
import ResetPassword from './src/screens/ResetPassword';
import MySchedule from './src/screens/MySchedule';
import Membership from './src/screens/Membership';
import Payment from './src/screens/Payment';
import Account from './src/screens/Account';
import Setting from './src/screens/Setting';
import ContactUs from './src/screens/ContactUs';
import Upcoming from './src/screens/Upcoming';
import Completed from './src/screens/Completed';
import Gym from './src/screens/Gym';
import GymClass from './src/screens/Class';
import Coach from './src/screens/Coach';
import Review from './src/screens/Review';
import WriteReview from './src/screens/WriteReview';
import GymDetail from './src/screens/Gym/GymDetail';
import CategoryClass from './src/screens/CategoryClass';
import CoachClass from './src/screens/CoachClass';
import BookClass from './src/screens/BookClass';
import FindClassMap from './src/screens/FindClassMap';
import Filter from './src/screens/Filter';
import Map from './src/screens/Map';
import Success from './src/components/Success';
import ChangeMobile from './src/screens/ChangeMobile';
import MobileOtp from './src/screens/MobileOtp';
import CoachReview from './src/screens/CoachReview';
import Language from './src/screens/Language';

const navOptionHandler = () => ({
  headerShown: false,
});

const AuthNavigator = createStackNavigator({
  Welcome: {
    screen: Welcome,
    navigationOptions: navOptionHandler,
  },
  Login: {
    screen: Login,
    navigationOptions: navOptionHandler,
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: navOptionHandler,
  },
  Signup: {
    screen: Signup,
    navigationOptions: navOptionHandler,
  },
  Otp: {
    screen: Otp,
    navigationOptions: navOptionHandler,
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: navOptionHandler,
  },
  Success: {
    screen: Success,
    navigationOptions: navOptionHandler,
  },
  Language: {
    screen: Language,
    navigationOptions: navOptionHandler,
  }
},
{
  initialRouteName: 'Welcome',
});

  const HomeNavigator = createStackNavigator(
    {
      Home: {
        screen: Home,
        navigationOptions: navOptionHandler,
      },
      Gym: {
        screen: Gym,
        navigationOptions: navOptionHandler,
      },
      GymRecommend: {
        screen: Gym,
        navigationOptions: navOptionHandler,
      },
      GymClass: {
        screen: GymClass,
        navigationOptions: navOptionHandler,
      },
      Coach: {
        screen: Coach,
        navigationOptions: navOptionHandler,
      },
      Review: {
        screen: Review,
        navigationOptions: navOptionHandler,
      },
      WriteReview: {
        screen: WriteReview,
        navigationOptions: navOptionHandler,
      },
      GymDetail: {
        screen: GymDetail,
        navigationOptions: navOptionHandler,
      },
      CategoryClass: {
        screen: CategoryClass,
        navigationOptions: navOptionHandler,
      },
      CoachClass: {
        screen: CoachClass,
        navigationOptions: navOptionHandler,
      },
      Upcoming: {
        screen: Upcoming,
        navigationOptions: navOptionHandler,
      },
      Completed: {
        screen: Completed,
        navigationOptions: navOptionHandler,
      },
      Map: {
        screen: Map,
        navigationOptions: navOptionHandler,
      },
      Membership: {
        screen: Membership,
        navigationOptions: navOptionHandler,
      },
      BookClass: {
        screen: BookClass,
        navigationOptions: navOptionHandler,
      },
      Success: {
        screen: Success,
        navigationOptions: navOptionHandler,
      },
      CoachReview: {
        screen: CoachReview,
        navigationOptions: navOptionHandler,
      },
    },
    {
      initialRouteName: 'Home',
    },
  );

  const FindClassNavigator = createStackNavigator(
    {
      FindClass: {
        screen: FindClass,
        navigationOptions: navOptionHandler,
      },
      FindClassMap: {
        screen: FindClassMap,
        navigationOptions: navOptionHandler,
      },
      Filter: {
        screen: Filter,
        navigationOptions: navOptionHandler,
      },
      Gym: {
        screen: Gym,
        navigationOptions: navOptionHandler,
      },
      GymClass: {
        screen: GymClass,
        navigationOptions: navOptionHandler,
      },
      Coach: {
        screen: Coach,
        navigationOptions: navOptionHandler,
      },
      Review: {
        screen: Review,
        navigationOptions: navOptionHandler,
      },
      WriteReview: {
        screen: WriteReview,
        navigationOptions: navOptionHandler,
      },
      GymDetail: {
        screen: GymDetail,
        navigationOptions: navOptionHandler,
      },
      CoachClass: {
        screen: CoachClass,
        navigationOptions: navOptionHandler,
      },
      Map: {
        screen: Map,
        navigationOptions: navOptionHandler,
      },
      Membership: {
        screen: Membership,
        navigationOptions: navOptionHandler,
      },
      BookClass: {
        screen: BookClass,
        navigationOptions: navOptionHandler,
      },
      Success: {
        screen: Success,
        navigationOptions: navOptionHandler,
      },
      CoachReview: {
        screen: CoachReview,
        navigationOptions: navOptionHandler,
      },
    },
    {
      initialRouteName: 'FindClass',
    },
  );

  const FavoritieNavigator = createStackNavigator(
    {
      Favorities: {
        screen: Favorities,
        navigationOptions: navOptionHandler,
      },
      Gym: {
        screen: Gym,
        navigationOptions: navOptionHandler,
      },
      GymClass: {
        screen: GymClass,
        navigationOptions: navOptionHandler,
      },
      Coach: {
        screen: Coach,
        navigationOptions: navOptionHandler,
      },
      Review: {
        screen: Review,
        navigationOptions: navOptionHandler,
      },
      WriteReview: {
        screen: WriteReview,
        navigationOptions: navOptionHandler,
      },
      GymDetail: {
        screen: GymDetail,
        navigationOptions: navOptionHandler,
      },
      CoachClass: {
        screen: CoachClass,
        navigationOptions: navOptionHandler,
      },
      Map: {
        screen: Map,
        navigationOptions: navOptionHandler,
      },
      Membership: {
        screen: Membership,
        navigationOptions: navOptionHandler,
      },
      BookClass: {
        screen: BookClass,
        navigationOptions: navOptionHandler,
      },
      Success: {
        screen: Success,
        navigationOptions: navOptionHandler,
      },
      CoachReview: {
        screen: CoachReview,
        navigationOptions: navOptionHandler,
      },
    },
    {
      initialRouteName: 'Favorities',
    },
  );

  const ProfileNavigator = createStackNavigator(
    {
      Profile: {
        screen: Profile,
        navigationOptions: navOptionHandler,
      },
      MySchedule: {
        screen: MySchedule,
        navigationOptions: navOptionHandler,
      },
      Membership: {
        screen: Membership,
        navigationOptions: navOptionHandler,
      },
      Payment: {
        screen: Payment,
        navigationOptions: navOptionHandler,
      },
      Account: {
        screen: Account,
        navigationOptions: navOptionHandler,
      },
      Setting: {
        screen: Setting,
        navigationOptions: navOptionHandler,
      },
      ContactUs: {
        screen: ContactUs,
        navigationOptions: navOptionHandler,
      },
      Gym: {
        screen: Gym,
        navigationOptions: navOptionHandler,
      },
      GymClass: {
        screen: GymClass,
        navigationOptions: navOptionHandler,
      },
      Coach: {
        screen: Coach,
        navigationOptions: navOptionHandler,
      },
      Review: {
        screen: Review,
        navigationOptions: navOptionHandler,
      },
      WriteReview: {
        screen: WriteReview,
        navigationOptions: navOptionHandler,
      },
      GymDetail: {
        screen: GymDetail,
        navigationOptions: navOptionHandler,
      },
      CoachClass: {
        screen: CoachClass,
        navigationOptions: navOptionHandler,
      },
      Map: {
        screen: Map,
        navigationOptions: navOptionHandler,
      },
      BookClass: {
        screen: BookClass,
        navigationOptions: navOptionHandler,
      },
      ChangeMobile: {
        screen: ChangeMobile,
        navigationOptions: navOptionHandler,
      },
      MobileOtp: {
        screen: MobileOtp,
        navigationOptions: navOptionHandler,
      },
      CoachReview: {
        screen: CoachReview,
        navigationOptions: navOptionHandler,
      },
    },
    {
      initialRouteName: 'Profile',
    },
  );

export { AuthNavigator, HomeNavigator, FindClassNavigator, FavoritieNavigator, ProfileNavigator };