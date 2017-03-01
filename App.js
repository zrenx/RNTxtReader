/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  AsyncStorage,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  NavigationExperimental,
} from 'react-native';

const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

import ZrxNavigator from './ZrxNavigator';

export default class RNTxtReader extends Component {

  constructor(props) {
    super(props);

    this._onNavigationChange = this._onNavigationChange.bind(this);
    //    routes: [{key: 'library', title: 'LIBRARY'}],
    this.state = {
      navigationState: {
        index: 0,
        routes: [{key: "reader"}],
        params: null,
        result: 0,
        lastScreenKey: null,
        targetScreenKey: null,
      },
    }
  }

  _onNavigationChange(action) {
    let {navigationState} = this.state;
    let lastScreenKey = navigationState.routes[navigationState.routes.length-1].key;
    switch (action.type) {
      case 'push':
        navigationState = NavigationStateUtils.push(navigationState, action.route);
        break;
      case 'pop':
        navigationState = NavigationStateUtils.pop(navigationState);
        break;
    }
    navigationState.lastScreenKey = lastScreenKey;

    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState});
    }
  }

  render() {
    return (
      <ZrxNavigator 
        navigationState={this.state.navigationState}
        onNavigationChange={this._onNavigationChange}
      />
    );
  }

  _chapters2Rows() {
    console.log("chapters2Rows");

    let rows = [];
    if (this.chapters) {
      for (var i =0 ; i < this.chapters.length; i++) {
        rows.push(this.chapters[i].title);
      }
    }
    console.log("chapters2Rows " + rows.length);

    return rows;
  };

    controlTitleAnim(offset) {
    if (offset == 0) {
      if (this.titleAnim._value == -50) {
        Animated.spring(this.titleAnim, {toValue: 0}).start();
      }
    } else {
      if (offset - this.offset > 2) {
        if (this.titleAnim._value == 0) {
          Animated.spring(this.titleAnim, {toValue: -50}).start();
        }
      } else if (offset - this.offset < -2) {
        if (this.titleAnim._value == -50) {
          Animated.spring(this.titleAnim, {toValue: 0}).start();
        }
      }
    }
    this.offset = offset;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  title_menu: {
    height: 40,
    width: 40,
    position: 'absolute',
    left: 5,
    top: 5,
  },
  content: {
    borderWidth: 5,
    color: '#fff',
    fontSize: 16,
    margin: 5,
    marginTop: 25,
  },
});
