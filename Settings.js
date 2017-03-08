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
  Button,
  PixelRatio,
  Linking,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Image,
  Slider,
} from 'react-native';
import Data from './data';
import ZrxDialog from './ZrxDialog';

const KEY_SETTINGS = "key_settings";
const LMM = "内篇 \n\
\n\
美貌是一种表情。 \n\
别的表情等待反应，例如悲哀等待怜悯，威严等待慑服，滑稽等待嘻笑。唯美貌无为，无目的，使人没有特定的反应义务的挂念，就不由自主地被吸引，其实是被感动。 \n\
其实美貌这个表情的意思，就是爱。 \n\
这个意思既蕴藉又坦率地随时呈现出来。 \n\
拥有美貌的人并没有这个意思，而美貌是这个意思。 \n\
当美貌者摒拒别人的爱时，其美貌却仍是这个意思：爱——所以美貌者难于摒拒别人的爱。往往遭殃。 \n\
用美貌这个先验的基本表情，再变化为别的表情，特别容易奏效（所以演员总是以美貌者为上选。日常生活中，也是美貌者尽占优势），那变化出来的别的表情，既是含义清晰，又反而强化美貌。可见这个基本表情的功能之大、先验性之肯定。美貌者的各种后天的自为表情，何以如此容易感动人？因为起始已被先验的基本表情感动，继之是程度的急剧增深，或角度的顺利转变。 \n\
美貌的人睡着了，后天的表情全停止，而美貌是不睡的，美貌不需要休息；倒是由于撤除附加的表情，纯然只剩美貌这一种表情，就尤其感动人，故曰：睡美人。 \n\
人老去，美貌衰败，就是这种表情终于疲惫了。老人化妆、整容，是“强迫”坚持不疲惫，有时反显得疲惫不堪。老人睡着，见得更老，因为别的附加的表情率尔褪净，只剩下衰败的美貌这一种惨相，光荣销歇，美貌的废墟不及石头的废墟，罗马夕照供人凭吊，美貌的残局不忍卒睹。 \n\
\n\
外篇 \n\
\n\
在脸上，接替美貌，再光荣一番，这样的可能有没有？有——智慧。 \n\
很难，真难，唯有极度高超的智慧，才足以取代美貌。也因此报偿了某些年轻时期不怎么样的哲学家科学家艺术家，老了，像样起来了，风格起来了，可以说好看起来了——到底是一件痛苦的事。 \n\
那些天才，当时都曾与上帝争吵，要美貌！上帝不给，为什么不给，不给就是不给（这是上帝的隐私，上帝有最大的隐私权——拆穿了也简单，美貌是给蠢人和懒人的），争得满头大汗力竭声嘶（所以天才往往秃顶，嗓子也不太好），只落得怏怏然拖了一袋天才下凡来。 \n\
“你再活下去，就好看不成了。” \n\
拜伦辩道： \n\
“那么天才还有没有用完哪？” \n\
上帝啐之： \n\
“是成全你呢，给人世留个亮丽的印象吧。还不快去洗澡，把希腊灰尘土耳其灰尘，统统冲掉！” \n\
拜伦垂头而斜睨，上帝老得这样啰嗦，用词何其伧俗，“亮丽的”。其实上帝逗他，见他穿着指挥官的军服，包起彩色头巾，分外英爽！ \n\
他懒洋洋地在无花果树下泼水抹身。上帝化作一只金丝雀停在枝头，这也难怪，上帝近来很寂寞。 \n\
拜伦叹道： \n\
“唉唉，地下天上，瘸子只要漂亮，还是值得偷看的！” \n\
树上的金丝雀唧的一声飞走了。"

export default class Settings extends Component {

  static navigationOptions = {
    title: 'SETTINGS',
    header: {
      titleStyle: {
        alignSelf: 'center',
        marginLeft: -40,
      }
    }
  }

  constructor(props) {
    super(props);

    this.settings = {
      fontSize: 16,
      color: '#000',
      backgroundColor: '#fff',
    };

    this.state = {
      settings: this.settings,
    }
  }

  componentDidMount() {
    console.log("Settings componentDidMount");

    this._load();
  }

  /*componentWillUnmount() {
    try {
      this.saveSettings();
    } catch (e) {
      console.error(e);
    }
  }*/

  async _load() {
    let settings = await Settings.loadSettings();
    if (settings != null) {
      this.settings = settings;
      this.setState({
        settings: this.settings,
      });
    }
    //console.log(JSON.stringify(this.settings));
    //console.log(JSON.stringify(this.state.settings));
  }


  static async loadSettings() {
    try {
      let value = await AsyncStorage.getItem(KEY_SETTINGS);
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  async saveSettings() {
    try {
      await AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>

          <Text style={styles.title}>配色</Text>

          <View style={styles.colors}>
            <TouchableWithoutFeedback onPress={() => {
              this.settings['color'] = '#fff';
              this.settings['backgroundColor'] = '#000';
              this.setState({settings: this.settings});
            }}>
              <View>
              <Text style={[styles.colorBlock, {backgroundColor: '#000', color: '#fff', fontSize: 10}]}>The quick brown fox jumps over the lazy dog</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => {
              this.settings['color'] = '#0f0';
              this.settings['backgroundColor'] = '#000';
              this.setState({settings: this.settings});
            }}>
              <View>
              <Text style={[styles.colorBlock, {backgroundColor: '#000', color: '#0f0', fontSize: 10}]}>The quick brown fox jumps over the lazy dog</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => {
              this.settings['color'] = '#000';
              this.settings['backgroundColor'] = '#fff';
              this.setState({settings: this.settings});
            }}>
              <View>
              <Text style={[styles.colorBlock, {backgroundColor: '#fff', color: '#000', fontSize: 10}]}>The quick brown fox jumps over the lazy dog</Text>
              </View>
            </TouchableWithoutFeedback>

          </View>

          <Text style={styles.title}>字体</Text>
          <Slider minimumValue={8} maximumValue={24} step={1} value={this.state.settings.fontSize} onValueChange={(value) => {
            console.log('fontSize: ' + value);
            this.settings['fontSize'] = value;
            this.setState({settings: this.settings});
          }} />
          <ScrollView
            style={{borderWidth: 1 / PixelRatio.get()}} >
            <Text style={{
              backgroundColor: this.state.settings.backgroundColor,
              fontSize: this.state.settings.fontSize,
              color: this.state.settings.color,
              padding: 5,
            }}>{LMM}</Text>
          </ScrollView>

        </View>

        <TouchableOpacity activeOpacity={0.5} onPress={() => {
          this.saveSettings();
          //this.props.navigation.goBack();
          this.props.navigation.dispatch({
            type: 'goBackWithParams',
            params: {timestamp: new Date().getTime()},
          });
        }}>
          <View style={styles.button}>
            <Text style={{color:'white'}}>保存</Text>
          </View>
        </TouchableOpacity>

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
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: '#000',
    marginTop: 20,
  },
  colors: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    marginLeft: 30,
    marginRight: 30,
  },
  colorBlock: {
    height: 60,
    width: 80,
    padding: 5,
    margin: 5,
    borderWidth: 1 / PixelRatio.get(),
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: 100,
    backgroundColor: '#2196f3',
    borderRadius: 5,
    margin: 8,
    elevation: 2,
  },
});
