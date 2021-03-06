import { takeEvery, takeLatest, all, fork, call } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'
import firebase from 'react-native-firebase'
import Config from 'react-native-config'
/* ------------- Types ------------- */

import {TodoTypes} from '../Redux/TodoRedux'
import { UserTypes } from '../Redux/UserRedux'

/* ------------- Sagas ------------- */

import {signInAnonymous, loginTwitter, linkToTwitter, unlink, logout, updateEmail} from './UserSagas'
import {updateProfile, uploadProfilePhoto} from './UserSagas'
import {addTodoList, fetchTodoList, changeTodoList, deleteTodoList} from  './TodoSagas'
import {addTask, fetchTask, changeTask, deleteTask} from  './TodoSagas'
import {fetchSyncTodoList, watchProccess, setShareId, subscribeTodo} from './TodoSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const project_id = Config.FIREBASE_PROJECT_ID
const endpoint = DebugConfig.useLocal 
  ? `http://localhost:5000/${project_id}/us-central1/api/`
  : `https://us-central1-${project_id}.cloudfunctions.net/api/`
const api = API.create(endpoint)
console.log(endpoint)
/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([    
    call(firebase.auth), // Why dose this need?

    takeLatest(UserTypes.SIGN_IN_ANONYMOUS, signInAnonymous),
    takeLatest(UserTypes.LOGIN_TWITTER, loginTwitter),
    takeLatest(UserTypes.LINK_TO_TWITTER, linkToTwitter),
    takeLatest(UserTypes.UNLINK, unlink),
    takeLatest(UserTypes.LOGOUT, logout),
    takeLatest(UserTypes.UPDATE_EMAIL, updateEmail),

    takeLatest(UserTypes.UPDATE_PROFILE, updateProfile),
    takeLatest(UserTypes.UPLOAD_PROFILE_PHOTO, uploadProfilePhoto),

    takeLatest(TodoTypes.ADD_TODO_LIST, addTodoList),
    takeLatest(TodoTypes.FETCH_TODO_LIST, fetchTodoList),
    takeEvery(TodoTypes.CHANGE_TODO_LIST, changeTodoList),
    takeEvery(TodoTypes.DELETE_TODO_LIST, deleteTodoList),

    takeLatest(TodoTypes.ADD_TASK, addTask),
    takeLatest(TodoTypes.FETCH_TASK, fetchTask),
    takeEvery(TodoTypes.CHANGE_TASK, changeTask),
    takeEvery(TodoTypes.DELETE_TASK, deleteTask),

    takeEvery(TodoTypes.FETCH_SYNC_TODO_LIST, fetchSyncTodoList),
    fork(watchProccess),

    takeLatest(TodoTypes.SUBSCRIBE_TODO, subscribeTodo),
    takeLatest(TodoTypes.SET_SHARE_ID, setShareId, api),
  ])
}
