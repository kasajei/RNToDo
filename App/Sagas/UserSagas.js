/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import {Platform} from 'react-native'
import { call, put, select, fork } from 'redux-saga/effects'
import UserActions from '../Redux/UserRedux'
import firebase from 'react-native-firebase'
import { UserSelectors } from '../Redux/UserRedux'
import { twitter } from 'react-native-simple-auth'
import Config from 'react-native-config'
// import { UserSelectors } from '../Redux/UserRedux'

export function * signInAnonymous (action) {
  try {
    var firebaseAuth = yield call(firebase.auth)
    const user = firebaseAuth.currentUser
    if(user) {
      put(UserActions.userSuccess(user))
      return
    }

    firebaseAuth = firebase.auth()
    const data= yield call([firebaseAuth,firebaseAuth.signInAnonymouslyAndRetrieveData])
    yield put(UserActions.userSuccess(data.user))
  }catch(error){
    console.log(error)
    yield put(UserActions.userFailure())
  }
}

export function * loginTwitter (action){
  try{
    const info = yield call(twitter,{
      appId: Config.TWITTER_CONSUMER_KEY,
      appSecret: Config.TWITTER_CONSUMER_SECRET,
      callback:"RNTodo://authorize"
    })
    const credential = firebase.auth.TwitterAuthProvider.credential(
      info.credentials.oauth_token,
      info.credentials.oauth_token_secret
    );    
    const firebaseAuth = firebase.auth()
    const data = yield call([firebaseAuth, firebaseAuth.signInAndRetrieveDataWithCredential], credential)
    var user = data.user
    yield put(UserActions.userSuccess(user))

    var diff = {
      displayName:user.displayName || info.user.screen_name,
      photoURL: user.photoURL || info.user.profile_image_url_https.replace("_normal","")
    }
    yield fork(updateProfile, {user:diff})
  }catch(error){
    console.log(error)
    yield put(UserActions.userFailure())
  }
}

export function * linkToTwitter (action){
  try{
    const info = yield call(twitter,{
      appId: Config.TWITTER_CONSUMER_KEY,
      appSecret: Config.TWITTER_CONSUMER_SECRET,
      callback:"RNTodo://authorize"
    })
    const credential = firebase.auth.TwitterAuthProvider.credential(
      info.credentials.oauth_token,
      info.credentials.oauth_token_secret
    );    
    const firebaseAuth = firebase.auth()
    const user = yield call([firebaseAuth.currentUser, firebaseAuth.currentUser.linkWithCredential], credential)
    yield put(UserActions.userSuccess(user))

    var diff = {
      displayName:user.displayName || info.user.screen_name,
      photoURL: user.photoURL || info.user.profile_image_url_https.replace("_normal","")
    }
    console.log(diff)
    yield fork(updateProfile, {user:diff})
  }catch(error){
    console.log(error)
    yield put(UserActions.userFailure())
  }
}

export function * unlink (action){
  const {providerId} = action
  try{
    const firebaseAuth = yield call(firebase.auth)
    yield call([firebaseAuth.currentUser, firebaseAuth.currentUser.unlink], providerId)
    const newUser = firebaseAuth.currentUser
    yield put(UserActions.userSuccess(newUser))
  }catch(error){
    console.log(error)
    yield put(UserActions.userFailure())
  }
}

export function * logout (action){
  try{
    const firebaseAuth = firebase.auth()
    yield call([firebaseAuth, firebaseAuth.signOut])
    yield put(UserActions.userLogout())
  }catch(error){
    console.log(error)
    yield put(UserActions.userFailure())
  }
}

export function *updateEmail (action){
  const {email} = action
  try{
    const firebaseAuth = yield call(firebase.auth)
    yield call([firebaseAuth.currentUser, firebaseAuth.currentUser.updateEmail], email)
    const newUser = firebaseAuth.currentUser
    yield put(UserActions.userSuccess(newUser))
  }catch(error){
    console.log(error)
    yield put(UserActions.userFailure())
  }
}

export function * updateProfile (action) {
  const { user } = action
  console.log(user)
  try{
    const firebaseAuth = yield call(firebase.auth)
    yield call([firebaseAuth.currentUser, firebaseAuth.currentUser.updateProfile], user)
    const newUser = firebaseAuth.currentUser
    yield put(UserActions.userSuccess(newUser))
  }catch(error){
    console.log(error)
    yield put(UserActions.userFailure())
  }
}

export function * uploadProfilePhoto (action){
  var { user } = action 
  const stateUser = yield select(UserSelectors.getUser)
  // upload image
  const storageRef = firebase.storage().ref("profile/icon_"+stateUser.uid)
  const response = yield call([storageRef, storageRef.putFile], user.photoURL)
  if (response.state == "success"){
    user = Object.assign(user,{photoURL:response.downloadURL})
    yield fork(updateProfile, {user:user})
  }else{
    console.log(error)
    yield put(UserActions.userFailure())
  }
}