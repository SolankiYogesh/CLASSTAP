import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcome from '../screens/Welcome';
import {Login} from '../screens/Login';
import {ForgotPassword} from '../screens/ForgotPassword';
import {Signup} from '../screens/Signup';
import Otp from '../screens/Otp';
import {ResetPassword} from '../screens/ResetPassword';
import Success from '../components/Success';
import Language from '../screens/Language';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator initialRouteName="Welcome">
    <Stack.Screen
      name="Welcome"
      component={Welcome}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{headerShown: false}}
    />
    <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}} />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Success"
      component={Success}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Language"
      component={Language}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);
