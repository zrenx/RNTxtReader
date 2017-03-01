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
} from 'react-native';
import { DocumentPickerUtil, DocumentPicker } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import FilePickerManager from 'react-native-file-picker';
import Drawer from 'react-native-drawer';
import DrawerLayout from 'react-native-drawer-layout';

import ZrxDialog from './ZrxDialog';
import ZrxPgListView from './ZrxPgListView';
import MoreTouchable from './MoreTouchable';
import DashBoard from './DashBoard';
import Data from './data';

let KEY_NOVELS = "key_novels";
let KEY_CUR_NOVEL = "key_cur_novel";
let KEY_CUR_CHAPTER = "key_cur_chapter";
/**
 * key_{novel}_chapters: [novel_chapter_titles],
 * key_{novel}_{chapter_title} : [novel_chapter_text],
**/

export default class Reader extends Component {

  constructor(props) {
    super(props);
    let novels = null;
    let curNovel = null;
    let curChapter = null;
    let curContent = null;
    let chapters = null;
    this.titleAnim = new Animated.Value(0);

    this.state = {
      loading: true,
      title: 'RNTxtReader',
      content: '',
      showChapterList: false,
      showChapter: true,
    };
  }

  componentDidMount() {
    //this.init();
    Data.getNovels().then(novels => {
      console.log(JSON.stringify(novels));
      if (!novels || novels.length == 0) {
         this.pickFile();
      } else {
        this.novels = novels;

        let text = "";
        this.setState({loading: false, content: text});
      }
    }).catch(error => {
      console.error(error);
    });

  }

  render() {
    return (
      <Drawer
        ref='drawer'
        tapToClose={true}
        open={true}
        openDrawerOffset={0.3}
        content={<DashBoard navigate={this.props.navigate} />}>

        <View style={{flex:1, backgroundColor: 'black'}}>
        <ScrollView ref="scrollView" indicatorStyle="white"
          onScroll={(event) => {
            this.controlTitleAnim(event.nativeEvent.contentOffset.y);
            //Animated.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']
          }}>

          <MoreTouchable
              onDoublePress={() => {
                console.log("onDoublePress");
                if (!this.state.showProgress) {
                  this.renderCb = () => {
                    this.showNextChapter();
                  }
                  this.setState({showProgress: true});
                }
              }}
              onSinglePress={() => {
                console.log("onSinglePress");
              }}
              onLongPress={() => {
                console.log("onLongPress");
                this.setState({showChapterList: true});
                for (let i = 0; i < this.chapters.length; i++) {
                  if (this.chapters[i].href === this.curChapter.href) {
                    this.refs.listView.goToItem(i);
                  }
                }
              }}>
            <Text style={styles.content} >
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
          <ZrxPgListView
            ref="listView"
            style={{flex: 1}}
            pageSize={50}
            postMount={async (pglv) => {
              pglv.updateData(this._chapters2Rows());
            }}
            onSelect={(rowID) => {
              console.log("selected: "+ rowID);
              this.selectChapterIdx(rowID);
              this.setState({showChapterList: false});
            }}
            />
        </ZrxDialog>
        }

        </Drawer>
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
    backgroundColor: '#000',
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
