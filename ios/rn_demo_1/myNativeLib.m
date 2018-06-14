//
//  myNativeLib.m
//  rn_demo_1
//
//  Created by junjun on 2018/6/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTLog.h"
#import <React/RCTConvert.h>

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>


#import <CoreTelephony/CTCarrier.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>


//定义类
@interface MyNativeLib : NSObject<RCTBridgeModule>

@end


//类实现
@implementation MyNativeLib

//在javascript端使用时候module名字叫MyNativeLibModule,如果参数为空，会默认使用类名
RCT_EXPORT_MODULE(MyNativeLibModule)

//相当于一个 js module export出去的方法 ,在js中使用RCTPromiseResolveBlock().then().catch()调用
RCT_EXPORT_METHOD(getIMSIPromise: (RCTPromiseResolveBlock)resolve  rejecter:(RCTPromiseRejectBlock)reject    )
{
  NSString * imsi = nil;
  @try {
    
    /**
     ......
     获取imsi逻辑
     ......
     */
    
    imsi = @"46000";
    resolve(imsi);
    
  } @catch (NSException *exception) {
     reject(@"", @"失败", nil);
  }
}


//相当于一个 js module export出去的方法 在js中使用 getAppVersionCallback(function (val,e){})调用
RCT_EXPORT_METHOD(getAppVersionCallback:(RCTResponseSenderBlock)callback)
{
  NSString * version = nil;
  @try {
    /**
     ......
     获取vappersion逻辑
     ......
     */
    
   version = @"1.0.5";
   //callback只接受一个数组做参数
   callback(@[version,[NSNull null]]);
    
  } @catch (NSException *exception) {
    callback(@[version,exception]);
  }
}


//非常耗时的方法需要使用async的方式让一个线程去执行

//指定方法执行的队列
//
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();//指定为主线程(UI线程)
}

//很耗时的方法,使用异步 ,在js中使用RCTPromiseResolveBlock().then().catch()调用
RCT_EXPORT_METHOD(getResponsePromise: (RCTPromiseResolveBlock)resolve  rejecter:(RCTPromiseRejectBlock)reject    )
{
    /**
     ......
     获取imsi逻辑
     ......
     */
  
    //使用global_queue
    dispatch_queue_t myQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
  
    //业务逻辑放入queue仲执行
    dispatch_async(myQueue, ^{
       @try {
          NSString * response = nil;
          /*假装获取网络资源需要3秒钟*/
          sleep(3);
        
          response = @"response is {data:123}";
          resolve(response);
         
       } @catch (NSException *exception) {
         reject(@"", @"注册失败", nil);
       }
    });

    
 
}

@end



/*
 * native code 主动通知rn端的js代码
 */
@interface MyBatteryManager : RCTEventEmitter<RCTBridgeModule>
@end

@implementation MyBatteryManager

-(instancetype)init {
    self = [super init];
  
    NSLog(@"\n\n\n  NSNotificationCenter register  \n\n.");
    return self;
}

//指定方法执行的队列
//
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();//指定为主线程(UI线程)
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"EventBattery"];
}

- (void)eventBatteryChanged
{
  NSString *eventName = @"EventBattery";
  [self sendEventWithName:@"EventBattery" body:@{@"name": eventName,@"remained": @"10%"}];
}
@end
