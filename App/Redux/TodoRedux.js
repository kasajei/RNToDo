import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  // for local : deprecated
  addTodo: ['todo'],
  deleteTodo: ['index'],
  changeTodo: ['index', 'diff'],
  changeOrder: ['from', 'to'],

  // for cloud
  addTodoList: ['todo'],
  mergeTodoList: ['todos'],
  fetchTodoList: ['isReload'],
  deleteTodoList: ['id'],
  changeTodoList: ['id', 'diff'],

  addTask:['todoId', 'task'],
  mergeTask: ['tasks'],
  fetchTask:['todoId','isReload'],
  deleteTask: ['todoId', 'taskId'],
  changeTask:['todoId', 'taskId', 'diff'],

  // sync
  startSyncTask:['todoId'],
  stopSyncTask:['todoId'],
})

export const TodoTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  // for local : deprecated
  todos:[{}], // [{title:"first task"},{title:"second task"}]

  // for cloud
  todoLists: {},
  tasks:{},
  taskIds:[],
  fetching: false,
})

/* ------------- Selectors ------------- */

export const TodoSelectors = {
  getTodo: (state, id) => state.todo.todoLists[[id]],
  getTask: (state, taskId) => state.todo.tasks[[taskId]],
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

export const fetchTodoList = (state, {isReload}) =>{
  if (isReload) state = state.merge({todoLists:{}})
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
  if (isReload) state = state.merge({tasks:{}, taskIds:[]})
  return state.merge({fetching:true})
}

const orderdTask = (tasks) =>{
  tasks =  Object.keys(tasks).reduce((pre, value, index)=>{
    pre[value] = tasks[value].order? tasks[value]: tasks[value].merge({order:(index*10+1)})
    return pre
  },{})
  const taskIds = Object.keys(tasks).sort((a,b)=>{
    if(tasks[a].order < tasks[b].order ) return -1
    if(tasks[a].order > tasks[b].order ) return 1
    return 0
  })
  return [tasks, taskIds]
}

export const changeTask = (state, {todoId, taskId, diff})=>{
  const {tasks} = state
  newTasks = tasks.merge({[taskId]:diff}, {deep: true})
  var [newTasks, taskIds] = orderdTask(newTasks)
  return state.merge({tasks:newTasks, taskIds})
}

export const mergeTask = (state, {tasks}) =>{
  const beforeTasks = state.tasks
  const taskList = tasks.reduce((pre, value)=>{
    pre[value.id] = value
    return pre
  }, {})
  var newTasks = beforeTasks.merge(taskList, {deep: true})
  var [newTasks, taskIds] = orderdTask(newTasks)
  return state.merge({tasks:newTasks, fetching:false, taskIds},{deep: true})
}

export const deleteTask = (state, {todoId, taskId}) =>{
  const {tasks, taskIds} = state
  const newTaskIds = taskIds.filter((value) => value!=taskId)
  const newTasks = tasks.without([taskId])
  return state.merge({tasks:newTasks, taskIds:newTaskIds})
}

export const startSyncTask = (state, {todoId}) =>{
  return state.merge({tasks:{}, taskIds:[]})
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
  [Types.CHANGE_TASK]: changeTask,
  [Types.MERGE_TASK]: mergeTask,
  [Types.DELETE_TASK]: deleteTask,

  [Types.START_SYNC_TASK]:startSyncTask,
})
