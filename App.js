/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'use strict';

import React, { Component } from 'react';
import {StackNavigator, StateUtils} from 'react-navigation';
import Reader from './Reader';
import Library from './Library';
import Settings from './Settings';
import Help from './Help';

const RNTxtReader = StackNavigator({
  Reader: {
    screen: Reader,
  },
  Library: {
    screen: Library,
  },
  Settings: {
  	screen: Settings,
  },
  Help: {
  	screen: Help,
  },
}, {headerMode: 'screen'});

const prevGetStateForAction = RNTxtReader.router.getStateForAction;

RNTxtReader.router.getStateForAction = (action, state) => {
    if (state && action.type === 'goBackWithParams') {
      console.log('state: ' + JSON.stringify(state));
      console.log('action: ' + JSON.stringify(action));
      // back
      let backRouteIndex = null;
      if (action.key) {
        // $FlowFixMe
        const backRoute = state.routes.find((route: *) => route.key === action.key);
        // $FlowFixMe
        backRouteIndex = state.routes.indexOf(backRoute);
      }
      let newState = null;
      if (backRouteIndex == null) {
        newState = StateUtils.pop(state);
      }
      if (backRouteIndex > 0) {
        newState =  {
          ...state,
          routes: state.routes.slice(0, backRouteIndex),
          index: backRouteIndex - 1,
        };
      }
      
      console.log('newState: ' + JSON.stringify(newState));
      if (newState) {
        // setParams
        // $flowfixme
        const lastRoute = newState.routes[newState.index];

        //const lastRoute = newState.routes.find((route: *) => route.key === action.key);
        console.log("lastRoute: " + lastRoute);
        if (lastRoute) {
          const params = {
            ...lastRoute.params,
            ...action.params,
          };
          const routes = [...newState.routes];
          routes[newState.routes.indexOf(lastRoute)] = {
            ...lastRoute,
            params,
          };
          console.log("routes: " + JSON.stringify(routes));
          return {
            ...newState,
            routes,
          };
        }
      }
    }
    //return RNTxtReader.router.getStateForAction(action, state);
    return prevGetStateForAction(action, state);
};
//export default () => <RNTxtReader />;
export default RNTxtReader;
