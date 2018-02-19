import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addTodo: ['todo'],
  deleteTodo: ['index'],
  changeTodo: ['index', 'diff'],
  changeOrder: ['from', 'to'],

  addTodoList: ['todo'],
  mergeTodoList: ['todos'],
  fetchTodoList: [],
  deleteTodoList: ['id'],
  changeTodoList: ['id', 'diff'],

  addTask:['todoId', 'task'],
  mergeTask: ['tasks'],
  fetchTask:['todoId','isReload'],
  deleteTask: ['todoId', 'taskId'],
  changeTask:['todoId', 'taskId', 'diff'],

  startSyncTask:['todoId'],
  addSubscriber:['todoId', 'subscriber'],
  stopSyncTask:['todoId'],
})

export const TodoTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  todos:[{}], // [{title:"first task"},{title:"second task"}]

  todoLists: {},
  tasks:{},
  fetching: false,

  subscribers:{},
})

/* ------------- Selectors ------------- */

export const TodoSelectors = {
  getTodo: (state, id) => state.todo.todoLists[[id]],
  getTask: (state, taskId) => state.todo.tasks[[taskId]],
  getSubscriber: (state, todoId) => state.todo.subscribers[[todoId]],
}

/* ------------- Reducers ------------- */
export const addTodo = (state, {todo}) =>{
  const { todos } = state
  return state.merge({todos:todos.concat([todo])})
}

export const deleteTodo = (state, {index}) =>{
  const { todos } = state
  return state.merge({todos:[ 
    ...todos.slice(0, parseInt(index)),
    ...todos.slice(parseInt(index) + 1)
  ]})
}

export const changeTodo = (state , {index, diff}) => {
  const { todos } = state
  const pIndex = parseInt(index)
  return state.merge({todos : [ 
    ...todos.slice(0, pIndex),
    Object.assign({}, todos[pIndex], diff),
    ...todos.slice(pIndex + 1)
  ]})
}

export const changeOrder = (state , {from, to}) => {
  const { todos } = state
  const pFrom = parseInt(from)
  const pTo = parseInt(to)
  let newTodos = [
    ...todos.slice(0, pFrom),
    ...todos.slice(pFrom + 1)]
  let fromTodo = Object.assign({}, todos[pFrom])
  return state.merge({todos : [ 
    ...newTodos.slice(0, pTo),
    fromTodo,
    ...newTodos.slice(pTo)
  ]})
}

export const fetchTodoList = (state) =>{
  return state.merge({fetching:true})
}

export const mergeTodoList = (state, {todos}) =>{
  const todoLists = todos.reduce((pre, value)=>{
    pre[value.id] = value
    return pre
  }, {})
  return state.merge({todoLists:todoLists, fetching:false},{deep: true})
}

export const deleteTodoList = (state, {id}) =>{
  const {todoLists} = state
  const newTodoLists = todoLists.without([id])
  return state.merge({todoLists:newTodoLists})
}

export const fetchTask = (state, {isReload}) =>{
  if (isReload) state = state.merge({tasks:{}})
  return state.merge({fetching:true})
}

export const mergeTask = (state, {tasks}) =>{
  const taskList = tasks.reduce((pre, value)=>{
    pre[value.id] = value
    return pre
  }, {})
  return state.merge({tasks:taskList, fetching:false},{deep: true})
}

export const deleteTask = (state, {todoId, taskId}) =>{
  const {tasks} = state
  const newTasks = tasks.without([taskId])
  return state.merge({tasks:newTasks})
}

export const addSubscriber = (state, {todoId, subscriber}) =>{
  return state.merge({subscribers:{[todoId]:subscriber}}, {deep:true})
}

export const stopSyncTask = (state, {todoId}) =>{
  const {subscribers} = state
  const newSubscribers = subscribers.without([todoId])
  return state.merge({subscribers:newSubscribers})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_TODO]:addTodo,
  [Types.DELETE_TODO]: deleteTodo,
  [Types.CHANGE_TODO]: changeTodo,
  [Types.CHANGE_ORDER]: changeOrder,

  [Types.FETCH_TODO_LIST]:fetchTodoList,
  [Types.MERGE_TODO_LIST]: mergeTodoList,
  [Types.DELETE_TODO_LIST]: deleteTodoList,

  [Types.FETCH_TASK]: fetchTask,
  [Types.MERGE_TASK]: mergeTask,
  [Types.DELETE_TASK]: deleteTask,

  [Types.ADD_SUBSCRIBER]:addSubscriber,
  [Types.STOP_SYNC_TASK]:stopSyncTask,
})
