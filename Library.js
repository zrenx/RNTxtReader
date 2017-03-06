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
} from 'react-native';
import Data from './data';
import ZrxDialog from './ZrxDialog';

import {SwipeRow} from 'react-native-swipe-list-view';

export default class Library extends Component {

  static navigationOptions = {
    title: 'Library',
    header: {
      titleStyle: {
        alignItems: 'center',
      }
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      novels: [],
      editNovel: null,
      loading: false,
    }
  }

  componentDidMount() {
    console.log("Library componentDidMount");

    this._updateNovels();
  }

  _updateNovels() {
    Data.getNovels().then(novels => {
      if (novels) {
        //console.log("novels:" + JSON.stringify(novels));
        this.setState({
          novels: novels,
          loading: false,
        });
      }
    }).catch(error => {
      console.error(error);
    }); 
  }

  _deleteNovel(novel) {
    Data.deleteNovel(novel).then(() => {
      this._updateNovels();
    })
  }

  _importNovel() {
    console.log('import novel');
    this.setState({loading: true});
    Data.importNovel()
      .then(novel => {
        console.log("imported: " + novel);
        this._updateNovels();
      })
      .catch(e => {
        console.log(e.message);
      });
  }

  _updateNovel(key, name) {
    Data.saveNovel(key, name)
      .then(() => {
        this._updateNovels();
      });
  }

  _renderNovels() {
    let novelViews = [];
    this.state.novels.map((novel,i) => {
      //console.log('map['+i+']: ' + JSON.stringify(novel));
      novelViews.push(
        <SwipeRow
          key={novel.key}
          disableRightSwipe={true}
          rightOpenValue={-80}
          style={styles.bottomLine}
          >
          <View style={styles.hiddenStyle}>
            <TouchableWithoutFeedback onPress={() => {this._deleteNovel(novel.key)}}>
            <Image source={require('./img/delete.png')} style={styles.icon} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.visibleStyle}>
            <Text
              onLongPress={() => {
                this.setState({editNovel: novel});
                setTimeout(() => {
                  this.refs.input.focus();
                }, 10);
              }}
              onPress={() => {
                Data.setCurNovel(novel.key).then(() => {
                  console.log("done setCurNovel: " + novel.key);
                  return Data.removeCurChapter();
                }).then(() => {
                  console.log("done setCurChapter");
                  this.props.navigation.goBack();
                }).catch(e => {
                  console.e(e);
                })

              }}>{novel.name}</Text>
          </View>
        </SwipeRow>
        );
    });
    return novelViews;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>

        <View style={styles.body}>
          {this._renderNovels()}
        </View>

        <View style={styles.bottom}>
          <Image style={styles.icon} source={require('./img/add.png')} />
          <Text style={{marginLeft: 8}} onPress={() => {this._importNovel()}}>
            IMPORT A TXT NOVEL
          </Text>
        </View>

        {this.state.editNovel && 
          <ZrxDialog
            ref="dialog"
            title="编辑书名"
            buttonActions={[
              {name: "取消", func: () => {
                this.setState({editNovel: null});
              }}
            ]}>
            <TextInput ref='input'
              style={{marginTop: 16, textAlign: 'center'}}
              defaultValue={this.state.editNovel.name}
              onSubmitEditing={(event) => {
                this._updateNovel(this.state.editNovel.key, event.nativeEvent.text);
                this.state.editNovel = null;
              }}
              />
          </ZrxDialog>
        }
        </View>

        {this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator
              animating={true}
              size='large'
              color='black' />
          </View>
        }
      </View>
    );
  }

  logCyclic(obj) {
    let seen = [];
    return JSON.stringify(obj, function(key, val) {
        //if (typeof key == 'string' && key.startsWith('_')) {
        if (typeof key == 'string') {
          return;
        }
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
              return;
          }
          seen.push(val);
        }
        return val;
  });
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
  bottomLine: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#ccc',
  },
  hiddenStyle: {
    height: 48,
    width: 80,
    position: 'absolute',
    right: 0,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibleStyle: {
    justifyContent: 'center',
    paddingLeft: 16,
    height: 48,
    backgroundColor: 'white',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  bottom: {
    flexDirection: 'row',
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#ccc',
    height: 48,
    justifyContent: 'center',
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
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0006',
    padding: 8,
    zIndex: 1024,
  },
});
