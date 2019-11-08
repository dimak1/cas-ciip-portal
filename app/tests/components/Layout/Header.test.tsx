import React from 'react';
import {shallow} from 'enzyme';
import {HeaderLayout} from '../../../components/Layout/Header';

// It renders the Header

it('It matches the last accepted Snapshot', () => {
  const wrapper = shallow(<HeaderLayout />);
  expect(wrapper).toMatchSnapshot();
});