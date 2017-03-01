/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'use strict';

import React, { Component } from 'react';
import {
  Platform,
  AsyncStorage,
} from 'react-native';
import { DocumentPickerUtil, DocumentPicker } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import FilePickerManager from 'react-native-file-picker';

//const KEY_NOVELS = "key_novels";
const KEY_CUR_NOVEL = "key_cur_novel";
const KEY_CUR_CHAPTER = "key_cur_chapter";
/**
 * key_{novel}_chapters: [novel_chapter_titles],
 * key_{novel}_{chapter_title} : [novel_chapter_text],
**/

export default class Data {

  static importNovel(opt) {
    return this._pickFile()
      .then(path => {
        return this._processFile(path);
      });
  }

  static _pickFile() {
    return new Promise((resolve, reject) => {
      if (Platform.OS == 'android') {
        FilePickerManager.showFilePicker(null, (response) => {
          console.log('Response: ' + JSON.stringify(response));
          if (response.didCancel) {
            console.log('user cancelled file picker');
            reject('cancelled');
          } else if (response.error) {
            console.error('FilePickerManager error: ' + response.error);
            reject(response.error);
          } else {
            console.log('success!' + response);
            //this.processFile(response.path);
            resolve(response.path);
          }
        })

      } else {
        DocumentPicker.show({filetype: [DocumentPickerUtil.plainText()]}, (error, url) => {
          if (error) {
            console.error(e);
            reject(response.error);
          } else {
            console.log("file url:" + JSON.stringify(url));
            //this.processFile(url.uri);
            resolve(response.path);
          }
        });
      }
    });
  }

  static _processFile(path) {
    let filenames = path.match(/.+\/(.+)\.txt/i);
    console.log('filename: ' + filenames);
    let novel = filenames.length > 1 ? filenames[filenames.length - 1] : path;
    return RNFS.readFile(path)
        .then((content) => {
          console.log("file read");
          let novelKey = "key_"+new Date().getTime();
          Data.saveNovel(novelKey, novel);

          let lines = content.split(/(\r)?\n/);
          console.log("lines: " + lines.length);
          let idx = 0;
          let text = '';
          let title = '简介';
          let chapters = [];
          chapters.push(title);
          for (let line of lines) {
            //console.log(lines[i]);
            if (line.match("^\s*第.{1,4}章\s*$")) {
              console.log("chapter: " + line);
              title = line;
              chapters.push(title);
              //this.setValue("key_"+filename+"_"+title, text);
              Data.saveChapter(novelKey, idx, text);
              idx ++;
              text = '';
            }
            text = text + line + '\n';
          }
          //this.setObjects("key_"+filename+"_chapters", chapters);
          Data.saveChapters(novelKey, chapters);
          return novel;
        });
  }

  static getNovels() {
    console.log("getNovels");
    return AsyncStorage.getAllKeys().then(keys => {
        return keys.filter(key => {
          return key.match(/key_\d{13}$/);
        });
      }).then(novelKeys => {
        console.log(JSON.stringify(novelKeys));
        return AsyncStorage.multiGet(novelKeys).then(result => {
          console.log(JSON.stringify(result));
          let novels = [];
          result.map(novel => {
            novels.push({key: novel[0], name: novel[1]});
          })
          return novels;
          //novels.push({key: key, name: result});
        });
    });
  }

  static saveNovel(key, novel) {
    return AsyncStorage.setItem(key, novel);
  }

  static deleteNovel(novelKey) {
    return AsyncStorage.getAllKeys().then(keys => {
      return keys.filter(key => {
        return key.match(novelKey);
      });
    }).then(keys => {
      console.log("prepare to delete: " + JSON.stringify(keys));
      return AsyncStorage.multiRemove(keys);
    });
  }

  static getChapters(novelKey) {
    return AsyncStorage.getItem(novelKey).then(result => {
      return JSON.parse(result);
    });
  }

  static saveChapters(novelKey, chapters) {
    return AsyncStorage.setItem(novelKey+"_chapters", JSON.stringify(chapters));
  }

  static getChapter(novelKey, idx) {
    return AsyncStorage.getItem(novelKey+"_"+idx);
  }

  static saveChapter(novelKey, idx, content) {
    return AsyncStorage.setItem(novelKey+"_"+idx, content);
  }

  static getCurNovel() {
    return AsyncStorage.getItem(KEY_CUR_NOVEL);
  }
  static setCurNovel(novel) {
    return AsyncStorage.setItem(KEY_CUR_NOVEL, novel);
  }

  static getCurChapter() {
    return AsyncStorage.getItem(KEY_CUR_CHAPTER);
  }

  static setCurChapter(chapter) {
    return AsyncStorage.setItem(KEY_CUR_CHAPTER, chapter);
  }
}