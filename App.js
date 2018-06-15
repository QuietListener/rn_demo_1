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


export default class App extends Component {

  constructor()
  {
    super();
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

  /*
  获取IMSI码
  在native代码中使用RCT_EXPORT_METHOD(getIMSIPromise:  resolver:(RCTPromiseResolveBlock)resolve  rejecter:(RCTPromiseRejectBlock)reject)，返回的是一个promise
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

        <View style={styles.block}>
          <Text style={styles.text}>调用原生方法， 使用的callback获取结构</Text>
          <Button  style={styles.btn}
                   title={"获取IMSI"}
                   onPress={()=>{this.getIMSI()}}></Button>
        </View>

        <View style={styles.block}>
          <Text style={styles.text}>调用原生方法，使用promise获取结果</Text>
          <Button  style={styles.btn}
                   title={"获取Appversion"}
                   onPress={()=>{this.getAppversion()}}></Button>
        </View>

        <View style={styles.block}>
          <Text style={styles.text}>非常耗时的方法，放在一个queue中异步执行，使用promise获取结果</Text>
          <Button style={styles.btn}
                  title={"获取response(耗时)"}
                  onPress={()=>{this.getResponsePromise()}}></Button>
        </View>

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
  block: {
    marginTop: 20,
    padding: 6
  },
  text:{
    textAlign:"center"
  },
  btn:{
    padding:6,
    backgroundColor:"black",
    borderWidth:1,
    borderColor:"green"
  }
});




