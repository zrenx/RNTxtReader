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
  TouchableWithoutFeedback,
  TextInput,
  Image,
  Slider,
} from 'react-native';

export default class Help extends Component {

  static navigationOptions = {
    title: 'HELP',
    header: {
      titleStyle: {
        alignSelf: 'center',
        marginLeft: -40,
      }
    }
  }

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    console.log("Help componentDidMount");

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>

          <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.instructions}>Any issues, </Text>
            <Text style={[styles.instructions, styles.url]}
              onPress={() => {
              Linking.openURL('https://github.com/zrenx/RNTxtReader/issues');
            }}>
              create an issue here.
            </Text>
          </View>
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
  body: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#000',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
  url: {
    color: '#05A5D1'
  },
});
