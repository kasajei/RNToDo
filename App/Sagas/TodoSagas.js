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

import { eventChannel} from 'redux-saga'
import { take, call, put, select, takeEvery, fork, cancelled, cancel } from 'redux-saga/effects'
import TodoActions from '../Redux/TodoRedux'
import { TodoSelectors } from '../Redux/TodoRedux'
import { UserSelectors } from '../Redux/UserRedux'
import firebase from 'react-native-firebase'

const todoCollection = "test"
const taskCollection = 'task'

export function * addTodoList (action) {
  const { todo } = action
  const user = yield select(UserSelectors.getUser)
  const collection = firebase.firestore().collection(todoCollection)
  const docRef = yield call([collection, collection.add], {
    userId: user.uid,
  })
  const doc = yield call([docRef, docRef.get])
  const newTodo = Object.assign(doc.data(),{id:doc.id})
  yield put(TodoActions.mergeTodoList([newTodo]))
}

export function * fetchTodoList (action){
  const user = yield select(UserSelectors.getUser)
  const collection = firebase.firestore().collection(todoCollection).where("userId", "==", user.uid)
  const querySnap = yield call([collection, collection.get])
  const todoList = querySnap.docs.map(doc=>{
    return Object.assign(doc.data(),{id:doc.id})
  })
  yield put(TodoActions.mergeTodoList(todoList))
}

export function * changeTodoList (action){
  const {id, diff} = action
  const todo = yield select(TodoSelectors.getTodo, id)
  const doc = firebase.firestore().collection(todoCollection).doc(id)
  // update return undefined
  yield call([doc, doc.update], diff)
  const changedTodo = todo.merge(diff)
  yield put(TodoActions.mergeTodoList([changedTodo]))
}

export function * deleteTodoList (action){
  const {id} = action
  const doc = firebase.firestore().collection(todoCollection).doc(id)
  const result = yield call([doc, doc.delete])
}


export function * addTask (action){
  const {todoId, task} = action
  console.log(todoId, task)
  const user = yield select(UserSelectors.getUser)
  const collection = firebase.firestore()
    .collection(todoCollection).doc(todoId).collection(taskCollection)
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
    .collection(todoCollection).doc(todoId).collection(taskCollection)
  const querySnap = yield call([collection, collection.get])
  const tasks = querySnap.docs.map(doc=>{
    return Object.assign(doc.data(),{id:doc.id})
  })
  yield put(TodoActions.mergeTask(tasks))
}

export function * changeTask (action){
  const {todoId, taskId, diff} = action
  const task = yield select(TodoSelectors.getTask, taskId)
  const doc = firebase.firestore()
    .collection(todoCollection).doc(todoId)
    .collection(taskCollection).doc(taskId)
  // update return undefined
  yield call([doc, doc.update], diff)
  const changedTask = task.merge(diff)
  yield put(TodoActions.mergeTask([changedTask]))
}

export function * deleteTask (action) {
  const {todoId, taskId} = action
  const doc = firebase.firestore()
    .collection(todoCollection).doc(todoId)
    .collection(taskCollection).doc(taskId)
  const result = yield call([doc, doc.delete])
}

export function *subscribe(collection) {
  return eventChannel(emit => {
    const unsubscribe = collection.onSnapshot(snapshot=>{
      emit(snapshot)
    })
    return unsubscribe
  })  
}

export function *syncTask (action){
  const {todoId} = action
  const collection = firebase.firestore()
    .collection(todoCollection).doc(todoId)
    .collection(taskCollection)

  const subscribeTask = ()=>{ return eventChannel(emit => {
      const unsubscribe = collection.onSnapshot(snapshot=>{
        emit(snapshot)
      })
      return unsubscribe
    }
  )} 
  const subscribeAction = yield call(subscribeTask)
  try{
    while(true){
      const snapshot = yield take(subscribeAction)
      console.log("snap",snapshot)
    }
  }finally {
    if (yield cancelled()) {
      console.log("キャンセル")
      subscribeAction.close()
    }
  }
}

export function *startSyncTask (action){
  const { todoId } = action
  const subscriber = yield fork(syncTask, action);
  yield put(TodoActions.addSubscriber(todoId, subscriber))
}

export function *stopSyncTask (action){
  const {todoId} = action
  const subscriber = yield select(TodoSelectors.getSubscriber,todoId)
  console.log("getSubscriber",subscriber)
  // yield cancel(subscriber);
}