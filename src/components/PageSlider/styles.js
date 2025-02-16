import {StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    // height: normalize(326),
    width: '100%',
    resizeMode: 'cover',
    alignSelf: 'stretch',
    //marginRight: normalize(10),
  },
  circleDiv: {
    flex: 1,
    //marginTop: normalize(20),
    //position: 'absolute',
    //bottom: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 10,
  },
  container: {
    flex: 1,
  },
  contentItem: {flex: 6.3},

  pageWrapper: {
    flex: 1,
    marginLeft: normalize(16),
  },
  sliderItem: {
    backgroundColor: '#ffffff',
    borderRadius: normalize(4),
    elevation: 4,
    flex: 1,
    marginBottom: normalize(4),
    marginRight: normalize(16),
    padding: normalize(10),
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 4,

    width: normalize(321),
  },
  whiteCircle: {
    backgroundColor: '#fff',
    borderRadius: 1,
    height: 2,
    margin: 5,
    width: 9.14,
  },
});

export default styles;
