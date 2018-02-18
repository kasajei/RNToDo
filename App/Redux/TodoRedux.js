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
})

export const TodoTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  todos:[{}], // [{title:"first task"},{title:"second task"}]
  todoLists: {},
  fetching: false,
})

/* ------------- Selectors ------------- */

export const TodoSelectors = {
  getTodo: (state, id) => state.todo.todoLists[[id]]
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
  console.log(todoLists)
  return state.merge({todoLists:todoLists, fetching:false},{deep: true})
}

export const deleteTodoList = (state, {id}) =>{
  const {todoLists} = state
  const newTodoLists = todoLists.without([id])
  return state.merge({todoLists:newTodoLists})
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
})
