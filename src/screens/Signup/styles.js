import { StyleSheet } from 'react-native';
import normalize from 'react-native-normalize';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: '#ffffff',
    },
    headerContainer: {
      backgroundColor: '#ffffff',
      borderBottomWidth: 0,
    },
    titleContainer: {
      flex: 2,
      //height: 80,
      justifyContent: 'center',
      marginLeft: normalize(40),
      marginRight: normalize(40),
    },
    titleText: {
      fontSize: normalize(20),
      fontFamily: 'arial',
      fontWeight: 'bold',
    },
    formContainer: {
      flex: 10,
      justifyContent: 'space-evenly',
    },
    formInput: {
      marginLeft: normalize(5),
      fontSize: normalize(13),
    },
    formInputArabic: {
      marginLeft: normalize(5),
      flexDirection: 'row',
      textAlign: 'right',
      fontSize: normalize(13),
    },
    formInputText: {
      //flex: 1,
      marginLeft: normalize(40),
      marginRight: normalize(40),
      marginVertical: normalize(5),
      //direction: 'rtl',
      //flexDirection: 'row-reverse',
    },
  
    buttonContainer: {
      flex: 3,
      justifyContent: 'flex-start',
    },
    accountButton: {
      height: normalize(46),
      backgroundColor: '#FE9800',
      marginHorizontal: normalize(45),
      borderRadius: normalize(23),
      justifyContent: 'center',
      //marginVertical: 10,
      marginBottom: normalize(9),
    },
    accountButtonText: {
      textAlign: 'center',
      color: '#ffffff',
    },
    facebookButton: {
      height: normalize(46),
      marginHorizontal: normalize(45),
      borderRadius: normalize(23),
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#0053FE',
      //marginVertical: 10,
    },
    facebookButtonText: {
      textAlign: 'center',
      color: '#0053FE',
    },
    guestAccount: {
      marginLeft: normalize(20),
      marginRight: normalize(20),
      //marginVertical: 20,
    },
    guestAccountText: {
      //textAlign: 'center',
      fontSize: normalize(12),
    },
    alreadyAccount: {
      flex: 1,
      //flexDirection: 'row',
      alignSelf: 'center',
    },
  
    alreadyAccountText: {
      // textAlign: 'center',
      fontSize: normalize(13),
      flexDirection: 'column',
      alignSelf: 'flex-end',
      bottom: normalize(20),
    },
    loginTextButton: {
      flexDirection: 'column',
      alignSelf: 'flex-end',
      bottom: normalize(20),
    },
    loginText: {
      fontSize: normalize(13),
      fontWeight: 'bold',
    },
    errorMessage: {
      marginLeft: normalize(40),
      marginRight: normalize(40),
      color: 'red',
      fontSize: normalize(12),
    },
    notificationContainer: {
      display: 'flex',
      marginTop: '2%',
      marginLeft: normalize(40),
      marginRight: normalize(40),
    },
    sendControlContainerOuter: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    appleButton: {
      marginTop: normalize(10),
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
  });

export default styles;