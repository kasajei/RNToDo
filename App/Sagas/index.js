import { takeEvery, takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import {TodoTypes} from '../Redux/TodoRedux'
import { UserTypes } from '../Redux/UserRedux'

/* ------------- Sagas ------------- */

import {updateProfile, uploadProfilePhoto, signInAnonymous} from './UserSagas'
import {addTodoList, fetchTodoList, changeTodoList, deleteTodoList} from  './TodoSagas'
import {addTask, fetchTask, changeTask, deleteTask} from  './TodoSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    takeLatest(UserTypes.SIGN_IN_ANONYMOUS, signInAnonymous),
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
  ])
}
