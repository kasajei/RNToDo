#  RNToDo (only iOS now)

Simple ToDo apps.

[![https://gyazo.com/0ae5f2797aed6df2458d88872c2f8a24](https://i.gyazo.com/0ae5f2797aed6df2458d88872c2f8a24.gif)](https://gyazo.com/0ae5f2797aed6df2458d88872c2f8a24)


[![https://gyazo.com/b6f1d8ece7d470f25ff43f12f037456d](https://i.gyazo.com/b6f1d8ece7d470f25ff43f12f037456d.gif)](https://gyazo.com/b6f1d8ece7d470f25ff43f12f037456d)

* Standard compliant React Native App Utilizing [Ignite](https://github.com/infinitered/ignite)

## How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application `npm i`

## Firebase (only iOS)

**Step 1:** configure Bundle identifier on RNToDo.xcworkspace

**Step 2:** create Firebase project & donwload GoogleService-info.plist

**Step 3:** locate at ios/RNToDo/GoogleService-info.plist

**Step 4:** Activate service on Firebase Console (ex:Auth)

* Firestore
* Auth
  * Annonymous
  * Twitter

## Firebase (for firestore / functions)

1. Copy .firebaserc.example to .firebaserc
2. Configure your firebase's product id 
3. First `firebase login`

## Secrets

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables to your javascript code in React Native. You can store API keys
and other sensitive information in a `.env` file:

```
TWITTER_CONSUMER_KEY=your consumer key
TWITTER_CONSUMER_SECRET=your consumer secret
```

The `.env` file is ignored by git keeping those secrets out of your repo.

### Get started:
1. Copy .env.example to .env
2. Add your config variables (You need create [Twitter app](https://apps.twitter.com))
3. Done!

## How to Run App

* Run Build for either OS
  * for iOS
    * run `cd ios && pod install && cd ../` or `npm run ios:pod:install`
    * run `react-native run-ios`
  * for Android
    * Run Genymotion
    * run `react-native run-android`
