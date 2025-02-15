import LottieView from 'lottie-react-native'
import React, {useEffect} from 'react'
import {View} from 'react-native'
import {hide} from 'react-native-bootsplash'
import {connect} from 'react-redux'

const Splash = props => {
  useEffect(() => {
    hide({fade: false})
  }, [])


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
        top: 0
      }}>
      <LottieView
        source={require('../../assets/splash.json')}
        autoPlay
        loop={false}
        resizeMode='cover'
        duration={2000}
        onAnimationFinish={props.onAnimationFinish}
        style={{
          width:200,
          height:200
        }}
      />
    </View>
  )
}

// export default Splash;
const mapStateToProps = state => ({
  home: state.home,
  errors: state.errors,
  auth: state.auth
})

export default connect(mapStateToProps)(Splash)
