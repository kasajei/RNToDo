import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signInAnonymous:[],
  updateProfile: ['user'],
  uploadProfilePhoto: ['user'],
  userSuccess: ['user'],
  userFailure: null
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  user: {
    uid:null,
    displayName:null,
    photoURL:null,
  },
  fetching: null,
  error: null
})

/* ------------- Selectors ------------- */

export const UserSelectors = {
  getUser: state => state.user.user
}

/* ------------- Reducers ------------- */
export const signInAnonymous = (state) =>{
  return state
}

export const updateProfile = (state, {user}) =>{
  return state.merge({fetching:true})
}

export const uploadProfilePhoto = (state, {user})=>{
  return state.merge({fetching:true})
}

// successful api lookup
export const userSuccess = (state, action) => {
  const { user } = action
  return state.merge({ fetching: false, error: null, user:{
      uid: user.uid,
      displayName:user.displayName,
      photoURL: user.photoURL,
    } 
  })
}

// Something went wrong somewhere.
export const userFailure = state =>
  state.merge({ fetching: false, error: true})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGN_IN_ANONYMOUS]: signInAnonymous,
  [Types.UPDATE_PROFILE]: updateProfile,
  [Types.UPLOAD_PROFILE_PHOTO]: uploadProfilePhoto,
  [Types.USER_SUCCESS]: userSuccess,
  [Types.USER_FAILURE]: userFailure
})
