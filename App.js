/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import {NativeModules,NativeEventEmitter} from "react-native"

//在objective-c中使用"RCT_EXPORT_MODULE(MyNativeLibModule)"我们使用 MyNativeLibModule
const MyNativeLibModule = NativeModules.MyNativeLibModule

/**
 * native主动于react-native通信
 */
// const MyBatteryManager = NativeModules.MyBatteryManager
// const MyBatteryManagerEmitter = new NativeEventEmitter(MyBatteryManager);


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  constructor()
  {
    super();

    //监听电池电量
    // this.subscription = MyBatteryManagerEmitter.addListener(
    //   'EventBattery',
    //   (data)=>{console.log("envent happend",data)}
    // );
  }

  //移除监听
  componentWillUnmount()
  {
    // if( this.subscription)
    // {
    //   this.subscription.remove();
    // }
  }

  /*
    获取IMSI码
    在native代码中使用RCT_EXPORT_METHOD(getIMSI:  resolver:(RCTPromiseResolveBlock)resolve  rejecter:(RCTPromiseRejectBlock)reject)，返回的是一个promise
    我们在js代码这样使用中
   */

  getIMSI()
  {
       //使用promise
       MyNativeLibModule.getIMSIPromise().then(val => {
         alert(`成功获取IMSI:${val}`)
       }).catch(e => {
         console.error(e);
       })
  }

  getAppversion()
  {
    //使用一个匿名函数作为callback
    MyNativeLibModule.getAppVersionCallback( (val,e)=> {
      if(e)
      {
        console.error(e);
      }
      else
      {
        alert(`成功获取AppVersion:${val}`)
      }
    });
  }


/**
   * 耗时的方法
   */
  getResponsePromise()
  {
    //使用promise
    MyNativeLibModule.getResponsePromise().then(val => {
      alert(`成功获取response(非常耗时):${val}`)
    }).catch(e => {
      console.error(e);
    })
  }

  render() {
    return (
      <View style={styles.container}>


        <Button title={"获取IMSI"} onPress={()=>{this.getIMSI()}}></Button>
        <Button title={"获取Appversion"} onPress={()=>{this.getAppversion()}}></Button>
        <Button title={"获取response(耗时)"} onPress={()=>{this.getResponsePromise()}}></Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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




