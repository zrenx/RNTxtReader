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
  FlatList,
} from 'react-native';

import Drawer from 'react-native-drawer';

import ZrxDialog from './ZrxDialog';
import MoreTouchable from './MoreTouchable';
import DashBoard from './DashBoard';
import Data from './data';
import { stringifyCyclic } from './Utils';
import Settings from './Settings';

export default class Reader extends Component {

  static navigationOptions = {
    title: 'RNTxtReader',
    header: {visible: false},
  }

  constructor(props) {
    super(props);
    let timestamp = null;
    let novels = null;
    let curNovel = null;
    let curChapter = null;
    let curContent = null;
    let chapters = null;
    let settings = {
      fontSize: 16,
      color: '#fff',
      backgroundColor: '#000',
    };

    this.titleAnim = new Animated.Value(0);
    this.renderCb = null;

    this.state = {
      loading: true,
      title: 'RNTxtReader',
      content: '',
      showChapterList: false,
      showChapter: true,
      drawerOpen: false,
      settings: settings,
    };
  }
  componentWillMount() {
    console.log('Reader componentWillMount');
  }

  componentWillReceiveProps(nextProps) {
    console.log('Reader componentWillReceiveProps');
    console.log("params: " + JSON.stringify(this.props.navigation));
    console.log("nextProps: " + JSON.stringify(nextProps));

    if (!this.props.navigation.state.params || nextProps.navigation.state.params.timestamp !== this.props.navigation.state.params.timestamp) {
      //this._init();
      this.refs.drawer.close();
    }
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    console.log('Reader shouldComponentUpdate');
    return true;
  }*/

  componentDidUpdate() {
    console.log('Reader componentDidUpdate');
    console.log("params: " + JSON.stringify(this.props.navigation));
    console.log("state: " + JSON.stringify(this.state));
  }

  componentDidMount() {
    console.log('Reader componentDidMount');
    console.log('fun: ' +JSON.stringify(this.props));
    this.timestamp = new Date().getTime();
    //this.props.onNavigationStateChange=(prev, cur) => {
    //  consolog.log("onNavigationStateChange: " + JSON.stringify(prev));
    //};
    this._init();
  }

  _init() {
    console.log("_init")
    Settings.loadSettings().then(settings => {
      if (settings) {
        this.state.settings = settings;
      }
    });

    Data.getNovels().then(async (novels) => {
      //console.log(JSON.stringify(novels));
      if (!novels || novels.length == 0) {
        this.setState({loading: false, drawerOpen: true})

      } else {
        //let ck = null;
        this.curChapter = await Data.getCurChapter();
        this.curNovel = await Data.getCurNovel();
        if (this.curNovel) {
          this.chapters = await Data.getChapters(this.curNovel);
          if (!this.curChapter) {
            this.curChapter = this.curNovel + '_'+ 0;
          }

          Data.getChapter(this.curChapter).then(text => {
            this.setState({loading: false, content: text, title: this.chapters[this.curChapter.split('_')[2]]});
          })

        } else {
          this.setState({loading: false, drawerOpen: true});
        }
      }
    }).catch(error => {
      console.error(error);
    });

  }

  render() {
    console.log("render settings: " + JSON.stringify(this.state.settings));
    let scheme = {
      backgroundColor: this.state.settings.backgroundColor,
      color: this.state.settings.color,
      fontSize: this.state.settings.fontSize,
    };

    return (
      <Drawer
        ref='drawer'
        tapToClose={true}
        open={this.state.drawerOpen}
        openDrawerOffset={0.2}
        onClose={() => {
          //this.forceUpdate();
          console.log('Drawer onClose');
          this._init();
        }}
        content={<DashBoard navigation={this.props.navigation} />}>

        <View style={{flex:1, backgroundColor: this.state.settings.backgroundColor}}>
        <ScrollView ref="scrollView" indicatorStyle="white"
          onScroll={(event) => {
            this.controlTitleAnim(event.nativeEvent.contentOffset.y);
            //Animated.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']
          }}>

          <MoreTouchable
              onDoublePress={() => {
                console.log("onDoublePress");
                if (!this.state.showProgress) {
                  //this.renderCb = () => {
                    this.showNextChapter();
                  //}
                  //this.setState({showProgress: true});
                }
              }}
              onSinglePress={() => {
                console.log("onSinglePress");
              }}
              onLongPress={() => {
                console.log("onLongPress");
                this.setState({showChapterList: true});
                /*for (let i = 0; i < this.chapters.length; i++) {
                  if (this.chapters[i].key === this.curChapter) {
                    this.refs.listView.goToItem(i);
                  }
                }*/
                setTimeout(()=> {
                  let idx = parseInt(this.curChapter.split('_')[2]);
                  //console.log("scrollToIndex: " + idx);
                  //console.log(stringifyCyclic(this.refs));
                  this.refs.flatlist.scrollToIndex({animated: true, index:idx});
                }, 100);
              }}>
            <Text style={[styles.content, scheme]} >
              {this.state.content}
            </Text>
          </MoreTouchable>
        </ScrollView>

        <Animated.View
          style={{position: 'absolute', height: 50, left: 0, top: 0, right: 0,
            alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
            backgroundColor:'rgba(128, 128, 128, 0.8)', 
            transform: [{translateY: this.titleAnim}]
          }}>

          <TouchableWithoutFeedback
            onPress={() => {
              console.log("Drawer");
              this.refs.drawer.open();
          }}>
            <Image style={styles.title_menu}
              source={require('./img/nav.png')}/>
          </TouchableWithoutFeedback>

          <Text style={{alignSelf: 'center', fontSize: 20, color: '#fff'}}>{this.state.title}</Text>
        </Animated.View>

        {this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator
              animating={true}
              size='large'
              color='black' />
          </View>
        }

      </View>

        {this.state.showChapterList &&
        <ZrxDialog title="全部章节"
            onCancel={() => {
              console.log("CANCEL!");
              this.setState({showChapterList: false})
             }
            }>
          <FlatList
            ref='flatlist'
            data={this.chapters}
            keyExtractor={(item, index) => index}
            getItemLayout={(item, index) => ({length: 40, offset: 40 * index, index})}
            renderItem={({item, index}) => {
              let bg = this.curChapter.split('_')[2] == index ? {backgroundColor: '#eef'}: null;
              return (
                <TouchableOpacity activeOpacity={0.5}  onPress={() => {
                  this.selectChapterIdx(index);
                  this.setState({showChapterList: false});
                }}>
                <Text style={[{height: 40, textAlignVertical: 'center'}, bg]}>{item}</Text>
                </TouchableOpacity>
                );
            }}
            />
        </ZrxDialog>
        }

        </Drawer>
    );
  }

  showNextChapter() {
    //console.log("curChapter: " + this.curChapter);
    let idx = parseInt(this.curChapter.split('_')[2]) + 1;
    //console.log("idx: " + idx);
    this.curChapter = this.curNovel + "_" + idx;
    //console.log("curChapter: " + this.curChapter);
    Data.setCurChapter(this.curChapter);
    Data.getChapter(this.curChapter).then(text => {
      //console.log("getChapter: " + text);
      this.refs.scrollView.scrollTo({x:0, y:0, animated:false});
      this.setState({title: this.chapters[idx], content: text});
    });
  }

  selectChapterIdx(idx) {
    this.curChapter = this.curNovel + "_" + idx;
    //console.log("curChapter: " + this.curChapter);
    Data.setCurChapter(this.curChapter);
    Data.getChapter(this.curChapter).then(text => {
      this.refs.scrollView.scrollTo({x:0, y:0, animated:false});
      this.setState({title: this.chapters[idx], content: text});
    });
  }

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
    backgroundColor: '#000',
    padding: 8,
  },
  title_menu: {
    height: 32,
    width: 32,
    position: 'absolute',
    left: 5,
    top: 9,
  },
  content: {
    color: '#fff',
    fontSize: 16,
    margin: 5,
    marginTop: 50,
  },
});
