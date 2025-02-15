import React from 'React';
import ReactTestRenderer from 'react-test-renderer';
import CalendarStrip from '../index';

describe('CalendarStrip', () => {
  it('renders correctly', () => {
    const instance = ReactTestRenderer.create(
      <CalendarStrip
        selectedDate={new Date()}
        onPressDate={date => {}}
        onPressGoToday={today => {}}
        onSwipeDown={() => {}}
        markedDate={['2018-05-04', '2018-05-15', '2018-06-04', '2018-05-01']}
      />,
    );

    expect(instance.toJSON()).toMatchSnapshot();
  });
});
