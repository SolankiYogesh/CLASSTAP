import React, {useEffect} from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';
import SplashScreen from 'react-native-splash-screen';
import {connect} from 'react-redux';

const Splash = (props) => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (props.auth.user && !props.errors.isLodaing) {
      setTimeout(() => {
        props.onAnimationFinish();
      }, 2000);
    } else if (!props.auth.user) {
      setTimeout(() => {
        props.onAnimationFinish();
      }, 1500);
    }
  }, [props.errors]);

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: '#FE9800',
        bottom: 0,
        flex: 1,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      }}>
      <LottieView
        source={require('../../assets/splash.json')}
        autoPlay
        loop={false}
      />
    </View>
  );
};

// export default Splash;
const mapStateToProps = state => ({
  home: state.home,
  errors: state.errors,
  auth: state.auth,
});

export default connect(
  mapStateToProps,
)(Splash);