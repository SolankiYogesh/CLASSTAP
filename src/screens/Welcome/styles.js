import {StyleSheet} from 'react-native'
import normalize from 'react-native-normalize'

const styles = StyleSheet.create({
  accountButton: {
    backgroundColor: '#FE9800',
    borderRadius: normalize(23),
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(40)
    //marginVertical: 10,
  },
  accountButtonText: {
    color: '#ffffff',
    fontSize: normalize(15),
    textAlign: 'center'
  },
  alreadyAccount: {
    justifyContent: 'center'
  },
  alreadyAccountText: {
    fontSize: normalize(13),
    textAlign: 'center'
  },
  alreadyAccountTextLogin: {
    color: '#FE9800',
    fontSize: normalize(13),
    marginLeft: normalize(5),
    textDecorationLine: 'underline'
  },
  appleButton: {
    alignItems: 'center',
    borderColor: '#000000',
    borderRadius: normalize(23),
    borderWidth: 1,
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(40)
  },
  appleButtonText: {
    color: '#000000',
    fontSize: normalize(15),
    marginHorizontal: normalize(10),
    textAlign: 'center'
  },
  buttonContainer: {
    flex: 3,
    justifyContent: 'space-evenly'
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  contentContainer: {
    flex: 2,
    //height: 60,
    justifyContent: 'center'
    //marginVertical: 30,
  },
  contentSmallTitle: {
    fontSize: normalize(16),
    marginHorizontal: '5%'
  },
  contentTitle: {
    fontSize: normalize(40),
    fontWeight: 'bold',
    marginHorizontal: '5%'
  },
  facebookButton: {
    alignItems: 'center',
    borderColor: '#3578E5',
    borderRadius: normalize(23),
    borderWidth: 1,
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(40)
    //flexDirection: 'row',
    //marginVertical: 10,
  },
  facebookButtonText: {
    color: '#3578E5',
    fontSize: normalize(15),
    marginHorizontal: normalize(10),
    textAlign: 'center'
  },
  guestAccount: {
    //marginVertical: 20,
  },
  guestAccountText: {
    fontSize: normalize(16),
    fontWeight: '500',
    textAlign: 'center'
  },
  imageContainer: {
    flex: 4,
    // width: width,
    alignItems: 'stretch'
    //height: 250,
  },
  titleContainer: {
    flex: 1,
    //height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: normalize(30),
    letterSpacing: normalize(4.74)
  },
  welcomeImage: {
    backgroundColor: 'red',
    flex: 1,
    height: 100,
    width: 200
  }
})

export default styles
