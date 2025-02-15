import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../screens/Home';
import {Gym} from '../screens/Gym';
import {GymClass} from '../screens/Class';
import {Coach} from '../screens/Coach';
import {Review} from '../screens/Review';
import {WriteReview} from '../screens/WriteReview';
import {GymDetail} from '../screens/Gym/GymDetail';
import {CategoryClass} from '../screens/CategoryClass';
import {CoachClass} from '../screens/CoachClass';
import {Upcoming} from '../screens/Upcoming';
import Map from '../screens/Map';
import {Completed} from '../screens/Completed';
import {Membership} from '../screens/Membership';
import {BookClass} from '../screens/BookClass';
import Success from '../components/Success';
import {CoachReview} from '../screens/CoachReview';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
    <Stack.Screen name="Gym" component={Gym} options={{headerShown: false}} />
    <Stack.Screen
      name="GymRecommend"
      component={Gym}
      options={{headerShown: false}}
    />
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
      name="CategoryClass"
      component={CategoryClass}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="CoachClass"
      component={CoachClass}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Upcoming"
      component={Upcoming}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Completed"
      component={Completed}
      options={{headerShown: false}}
    />
    <Stack.Screen name="Map" component={Map} options={{headerShown: false}} />
    <Stack.Screen
      name="Membership"
      component={Membership}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="BookClass"
      component={BookClass}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Success"
      component={Success}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="CoachReview"
      component={CoachReview}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);
