/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'use strict';

import {StackNavigator} from 'react-navigation';
import Reader from './Reader';
import Library from './Library';

const RNTxtReader = StackNavigator({
  Reader: {
    screen: Reader,
  },
  Library: {
    screen: Library,
  },
}, {headerMode: 'screen'});
export default RNTxtReader;
