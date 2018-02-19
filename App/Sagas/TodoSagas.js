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

import { call, put, select } from 'redux-saga/effects'
import TodoActions from '../Redux/TodoRedux'
import { TodoSelectors } from '../Redux/TodoRedux'
import { UserSelectors } from '../Redux/UserRedux'
import firebase from 'react-native-firebase'

const collectionName = "test"

export function * addTodoList (action) {
  const { todo } = action
  const user = yield select(UserSelectors.getUser)
  const collection = firebase.firestore().collection(collectionName)
  const docRef = yield call([collection, collection.add], {
    userId: user.uid,
  })
  const doc = yield call([docRef, docRef.get])
  const newTodo = Object.assign(doc.data(),{id:doc.id})
  yield put(TodoActions.mergeTodoList([newTodo]))
}

export function * fetchTodoList (action){
  const user = yield select(UserSelectors.getUser)
  const collection = firebase.firestore().collection(collectionName).where("userId", "==", user.uid)
  const querySnap = yield call([collection, collection.get])
  const todoList = querySnap.docs.map(doc=>{
    return Object.assign(doc.data(),{id:doc.id})
  })
  yield put(TodoActions.mergeTodoList(todoList))
}

export function * changeTodoList (action){
  const {id, diff} = action
  const todo = yield select(TodoSelectors.getTodo, id)
  const doc = firebase.firestore().collection(collectionName).doc(id)
  // update return undefined
  yield call([doc, doc.update], diff)
  const changedTodo = todo.merge(diff)
  yield put(TodoActions.mergeTodoList([changedTodo]))
}

export function * deleteTodoList (action){
  const {id} = action
  const doc = firebase.firestore().collection(collectionName).doc(id)
  const result = yield call([doc, doc.delete])
}


export function * addTask (action){
  const {todoId, task} = action
  console.log(todoId, task)
  const user = yield select(UserSelectors.getUser)
  const collection = firebase.firestore()
    .collection(collectionName).doc(todoId).collection('tasks')
  const docRef = yield call([collection, collection.add], Object.assign(task,{
    userId: user.uid,
  }))
  const doc = yield call([docRef, docRef.get])
  const newTask = Object.assign(doc.data(), {id:doc.id})
  yield put(TodoActions.mergeTask([newTask]))
}

export function * fetchTask (action){
  const {todoId} = action
  const collection = firebase.firestore()
    .collection(collectionName).doc(todoId).collection('tasks')
  const querySnap = yield call([collection, collection.get])
  const tasks = querySnap.docs.map(doc=>{
    return Object.assign(doc.data(),{id:doc.id})
  })
  yield put(TodoActions.mergeTask(tasks))
}