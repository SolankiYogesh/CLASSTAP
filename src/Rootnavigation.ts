import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(...arg: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(arg as never);
  }
}
