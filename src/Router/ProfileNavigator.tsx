import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Map from '../screens/Map';
import {Profile} from '../screens/Profile';
import {MySchedule} from '../screens/MySchedule';
import {Membership} from '../screens/Membership';
import {PaymentWeb} from '../components/PaymentWeb';
import {Account} from '../screens/Account';
import {Setting} from '../screens/Setting';
import {ContactUs} from '../screens/ContactUs';
import {Gym} from '../screens/Gym';
import {GymClass} from '../screens/Class';
import {Coach} from '../screens/Coach';
import {Review} from '../screens/Review';
import {WriteReview} from '../screens/WriteReview';
import {GymDetail} from '../screens/Gym/GymDetail';
import {CoachClass} from '../screens/CoachClass';
import {BookClass} from '../screens/BookClass';
import {ChangeMobile} from '../screens/ChangeMobile';
import MobileOtp from '../screens/MobileOtp';
import {CoachReview} from '../screens/CoachReview';
const Stack = createNativeStackNavigator();
export default () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MySchedule"
        component={MySchedule}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Membership"
        component={Membership}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentWeb}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Gym" component={Gym} options={{headerShown: false}} />
      <Stack.Screen
        name="GymClass"
        component={GymClass}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Coach"
        component={Coach}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WriteReview"
        component={WriteReview}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GymDetail"
        component={GymDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CoachClass"
        component={CoachClass}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Map" component={Map} options={{headerShown: false}} />
      <Stack.Screen
        name="BookClass"
        component={BookClass}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangeMobile"
        component={ChangeMobile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MobileOtp"
        component={MobileOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CoachReview"
        component={CoachReview}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
