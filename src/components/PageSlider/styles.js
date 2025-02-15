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
  whiteCircle: {
    width: 9.14,
    height: 2,
    borderRadius: 1,
    margin: 5,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },

  sliderItem: {
    flex: 1,
    width: normalize(321),
    padding: normalize(10),
    backgroundColor: '#ffffff',
    marginRight: normalize(16),
    borderRadius: normalize(4),
    marginBottom: normalize(4),
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 4,

    elevation: 4,
  },
  contentItem: {flex: 6.3},
  pageWrapper: {
    flex: 1,
    marginLeft: normalize(16),
  },
});

export default styles;
