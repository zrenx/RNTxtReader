import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  NavigationExperimental,
} from 'react-native';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;


import Reader from './Reader';
import Library from './Library';

export default class ZrxNavigator extends Component {

  constructor(props: any, context: any) {
    super(props, context);
    console.log("Navigator constructor");
    this._renderScene = this._renderScene.bind(this);
  }

  render(): React.Element {
    return (
      <View style={styles.navigator}>
        <NavigationCardStack
          navigationState={this.props.navigationState}
          renderScene={this._renderScene}
          style={styles.navigatorCardStack}
        />
      </View>
    );
  }

  _renderScene(sceneProps: Object): React.Element {
    let routeKey = sceneProps.scene.route.key;
    let scene = null;
    switch (routeKey) {
      case 'reader':
        scene = <Reader {...sceneProps} navigate={this.props.onNavigationChange} /> 
        break;
      case 'settings':
        scene = <Settings {...sceneProps} navigate={this.props.onNavigationChange}  />
        break;
      case 'library':
        scene = <Library {...sceneProps} navigate={this.props.onNavigationChange} />
        break;
      case 'help':
        scene = <Help {...sceneProps} navigate={this.props.onNavigationChange} />
        break;
    }
    return scene;
  }

}

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  navigatorCardStack: {
    flex: 20,
  },
});