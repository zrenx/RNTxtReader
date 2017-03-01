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
  AsyncStorage,
  Platform,
  ActivityIndicator,
  PixelRatio,
  Linking,
  NavigationExperimental,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

export default class ZrxHeader extends Component {
  render() {
    let title = this.props.title ? this.props.title : this.props.scene.route.title;
    return (
      <NavigationHeader
          style={{height:50}}
          {...this.props}
          renderTitleComponent={() => (<TitleText title={title}/>)}
          renderLeftComponent={() => (<Back isCross={this.props.isCross} onPress={this.props.onPress} navigate={this.props.navigate}/>)}
      />
    );
  }
}

export class TitleText extends Component {

  render() {
    return (
      <View style={{flex:1, justifyContent:'center'}}>
        <Text style={{fontSize: 18, alignSelf: 'center', color: 'black'}}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

export class Back extends Component {

  render() {
     let backImg = this.props.isCross? require('./img/cross.png') : require('./img/arrow_back.png');
     return (
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={this._back.bind(this)}>
          <Image source={backImg} style={styles.back_icon} />
        </TouchableOpacity>
      </View>
    );
  }

  _back() {
      this.props.navigate({type: 'pop'});
      if (this.props.backPress != null) {
       this.props.backPress();
      }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back_icon: {
    marginLeft: 8,
    justifyContent: 'center',
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  header: {
    borderBottomWidth: 1 / PixelRatio.get(),
    padding: 16,
    paddingBottom: 8,
  },
  app_name: {
    fontSize: 18,
    color: 'black',
  },
  app_desc: {
    color: '#333333',
    marginTop: 16,
  },
  app_author: {
    fontSize: 12,
    marginTop: 16,
  },
  url: {
    color: '#05A5D1'
  },
  body: {
    flex: 1,
  },
  ver: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#ccc',
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  setting: {
    color: '#333333',
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#ccc',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
