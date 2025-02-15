import {StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    flex: 1,
    //height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: normalize(30),
    letterSpacing: normalize(4.74),
  },
  imageContainer: {
    flex: 4,
    // width: width,
    alignItems: 'stretch',
    //height: 250,
  },
  welcomeImage: {
    flex: 1,
    height: 100,
    width: 200,
    backgroundColor: 'red',
  },
  contentContainer: {
    flex: 2,
    //height: 60,
    justifyContent: 'center',
    //marginVertical: 30,
  },
  contentTitle: {
    fontSize: normalize(40),
    fontWeight: 'bold',
    marginHorizontal: '5%',
  },
  contentSmallTitle: {
    fontSize: normalize(16),
    marginHorizontal: '5%',
  },
  buttonContainer: {
    flex: 3,
    justifyContent: 'space-evenly',
  },
  accountButton: {
    height: normalize(46),
    backgroundColor: '#FE9800',
    marginHorizontal: normalize(40),
    borderRadius: normalize(23),
    justifyContent: 'center',
    //marginVertical: 10,
  },
  accountButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: normalize(15),
  },
  facebookButton: {
    height: normalize(46),
    marginHorizontal: normalize(40),
    borderRadius: normalize(23),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3578E5',
    alignItems: 'center',
    //flexDirection: 'row',
    //marginVertical: 10,
  },
  facebookButtonText: {
    textAlign: 'center',
    color: '#3578E5',
    fontSize: normalize(15),
    marginHorizontal: normalize(10),
  },
  appleButton: {
    height: normalize(46),
    marginHorizontal: normalize(40),
    borderRadius: normalize(23),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
  },
  appleButtonText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: normalize(15),
    marginHorizontal: normalize(10),
  },
  guestAccount: {
    //marginVertical: 20,
  },
  guestAccountText: {
    textAlign: 'center',
    fontSize: normalize(16),
    fontWeight: '500',
  },
  alreadyAccount: {
    justifyContent: 'center',
  },
  alreadyAccountText: {
    textAlign: 'center',
    fontSize: normalize(13),
  },
  alreadyAccountTextLogin: {
    fontSize: normalize(13),
    color: '#FE9800',
    marginLeft: normalize(5),
    textDecorationLine: 'underline',
  },
});

export default styles;