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
  Image,
} from 'react-native';
import Data from './data';

export default class DashBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      book_count: 0,
    };
  }

  componentDidMount() {
    console.log("DashBoard componentDidMount");

    Data.getNovels().then(novels => {
      if (novels) {
        console.log("novels:" + novels);
        //console.log("novels:" + JSON.stringify(novels));
        this.setState({
          book_count: novels.length,
        });
      }
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.app_name}>
          RNTxtReader
        </Text>
        <Text style={styles.app_desc}>
          TXT Novel Reader, powered by ReactNative.
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.app_author}>
            Author: &nbsp;
          </Text>
          <Text style={[styles.app_author, styles.url]}
            onPress={() => {
            Linking.openURL('https://github.com/zrenx');
          }}>
              zrenx
          </Text>
        </View>
        </View>

        <View style={styles.body}>
        <View style={styles.setting}>
          <Image source={require('./img/library.png')} style={styles.settingIcon} />
          <Text style={styles.settingText} onPress={() => {
            this.props.navigate({type: 'push', route: {key: 'library', title: 'LIBRARY'}});
          }}>
            Library  ( {this.state.book_count} )
          </Text>
        </View>

        <View style={styles.setting}>
          <Image source={require('./img/settings.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>
            Settings
          </Text>
        </View>

        <View style={styles.setting}>
          <Image source={require('./img/info.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>
            Help
          </Text>
        </View>
        </View>


        <View style={styles.ver}>
          <Text style={styles.ver_text}>
            V 0.1
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#ccc',
  },
  settingText: {
    color: '#333333',
    paddingLeft: 8,
  },
  settingIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
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
