import {StyleSheet} from 'react-native'
import normalize from 'react-native-normalize'

const styles = StyleSheet.create({
  accountButton: {
    height: normalize(46),
    backgroundColor: '#FE9800',
    marginHorizontal: normalize(45),
    borderRadius: normalize(23),
    justifyContent: 'center',
    //marginVertical: 10,
    marginBottom: normalize(9)
  },
  accountButtonText: {
    color: '#ffffff',
    textAlign: 'center'
  },
  alreadyAccount: {
    flex: 1,
    //flexDirection: 'row',
    alignSelf: 'center'
  },
  alreadyAccountText: {
    // textAlign: 'center',
    fontSize: normalize(13),
    flexDirection: 'column',
    alignSelf: 'flex-end',
    bottom: normalize(20)
  },
  appleButton: {
    alignItems: 'center',
    borderColor: '#000000',
    borderRadius: normalize(23),
    borderWidth: 1,
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(40),
    marginTop: normalize(10)
  },
  appleButtonText: {
    color: '#000000',
    fontSize: normalize(15),
    marginHorizontal: normalize(10),
    textAlign: 'center'
  },
  buttonContainer: {
    flex: 3,
    justifyContent: 'flex-start'
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'space-between'
  },

  errorMessage: {
    color: 'red',
    fontSize: normalize(12),
    marginLeft: normalize(40),
    marginRight: normalize(40)
  },
  facebookButton: {
    borderColor: '#0053FE',
    borderRadius: normalize(23),
    borderWidth: 1,
    height: normalize(46),
    justifyContent: 'center',
    marginHorizontal: normalize(45)
    //marginVertical: 10,
  },
  facebookButtonText: {
    color: '#0053FE',
    textAlign: 'center'
  },
  formContainer: {
    flex: 10,
    justifyContent: 'space-evenly'
  },
  formInput: {
    fontSize: normalize(13),
    marginLeft: normalize(5)
  },
  formInputArabic: {
    flexDirection: 'row',
    fontSize: normalize(13),
    marginLeft: normalize(5),
    textAlign: 'right'
  },
  formInputText: {
    //flex: 1,
    marginLeft: normalize(40),
    marginRight: normalize(40),
    marginVertical: normalize(5)
    //direction: 'rtl',
    //flexDirection: 'row-reverse',
  },
  guestAccount: {
    marginLeft: normalize(20),
    marginRight: normalize(20)
    //marginVertical: 20,
  },

  guestAccountText: {
    //textAlign: 'center',
    fontSize: normalize(12)
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0
  },
  loginText: {
    fontSize: normalize(13),
    fontWeight: 'bold'
  },
  loginTextButton: {
    alignSelf: 'flex-end',
    bottom: normalize(20),
    flexDirection: 'column'
  },
  notificationContainer: {
    display: 'flex',
    marginLeft: normalize(40),
    marginRight: normalize(40),
    marginTop: '2%'
  },
  sendControlContainerOuter: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  titleContainer: {
    flex: 2,
    //height: 80,
    justifyContent: 'center',
    marginLeft: normalize(40),
    marginRight: normalize(40)
  },
  titleText: {
    fontFamily: 'arial',
    fontSize: normalize(20),
    fontWeight: 'bold'
  }
})

export default styles
