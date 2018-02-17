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
// import { UserSelectors } from '../Redux/UserRedux'

export function * signInAnonymous (action) {
  try {
    const firebaseAuth = firebase.auth()
    const data= yield call([firebaseAuth, firebaseAuth.signInAnonymouslyAndRetrieveData])
    const user = firebaseAuth.currentUser
    yield put(UserActions.userSuccess(user))
  }catch(error){
    console.log(error)
    yield put(UserActions.userFailure())
  }
}

export function * updateProfile (action) {
  const { user } = action
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