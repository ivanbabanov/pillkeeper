//
//  FacebookLoginManager.m
//  SimpleProject
//
//  Created by Ivan Babanov on 06.01.16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FacebookLoginManager.h"
#import "FBSDKCoreKit/FBSDKCoreKit.h"
#import "FBSDKLoginKit/FBSDKLoginKit.h"

@implementation FacebookLoginManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(newSession:(RCTResponseSenderBlock)callback) {
  FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
  [login logInWithReadPermissions:@[@"public_profile", @"email"] handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
    
    if (error) {
      callback(@[@"Error", [NSNull null]]);
    } else if (result.isCancelled) {
      callback(@[@"Canceled", [NSNull null]]);
    } else {
      FBSDKAccessToken *token = result.token;
      NSString *tokenString = token.tokenString;
      NSString *userId = token.userID;
      NSDictionary *credentials = @{ @"token" : tokenString, @"userId" : userId };
      callback(@[[NSNull null], credentials]);
    }
  }];
};

@end