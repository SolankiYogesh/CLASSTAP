import {createNativeStackNavigator} from '@react-navigation/native-stack'

import Success from '../components/Success'
import {ForgotPassword} from '../screens/ForgotPassword'
import Language from '../screens/Language'
import {Login} from '../screens/Login'
import Otp from '../screens/Otp'
import {ResetPassword} from '../screens/ResetPassword'
import {Signup} from '../screens/Signup'
import Welcome from '../screens/Welcome'

const Stack = createNativeStackNavigator()

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
)
