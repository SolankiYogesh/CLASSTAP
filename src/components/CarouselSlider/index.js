import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Dimensions, Image} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;

class CarouselSlider extends Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {
    setInterval(() => {
      this.setState(
        prev => ({
          selectedIndex:
            prev.selectedIndex === this.props.images.length - 1
              ? 0
              : prev.selectedIndex + 1,
        }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            x: DEVICE_WIDTH * this.state.selectedIndex,
            y: 0,
          });
        },
      );
    }, 3000);
  };

  componentWillUnmount() {
    this.setState({selectedIndex: 0});
  }

  setSelectedIndex = event => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
    this.setState({selectedIndex});
  };

  render() {
    const {images} = this.props;
    const {selectedIndex} = this.state;
    return (
      <View style={{height: '100%', width: '100%'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          onMomentumScrollEnd={this.setSelectedIndex}
          ref={this.scrollRef}>
          {images.map(image => (
            <Image
              style={styles.backgroundImage}
              source={{uri: image}}
              key={image}
            />
          ))}
        </ScrollView>
        <View style={styles.circleDiv}>
          {images.map((image, i) => (
            <View
              style={[
                styles.whiteCircle,
                {backgroundColor: i === selectedIndex ? '#0053FE' : '#ffffff'},
              ]}
              key={image}
              active={i === selectedIndex}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    width: Dimensions.get('window').width,
    resizeMode: 'cover',
    alignSelf: 'stretch',
  },
  circleDiv: {
    position: 'absolute',
    bottom: 20,
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
});

export default CarouselSlider;
