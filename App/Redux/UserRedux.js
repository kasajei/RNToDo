import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signInAnonymous:[],
  loginTwitter:[], // switch user
  linkToTwitter:[], // link twitter account to current user
  unlink:["providerId"], // ex: twtter.com, facebook.com
  logout:[],
  updateEmail:["email"],

  updateProfile: ['user'],
  uploadProfilePhoto: ['user'],
  userSuccess: ['user'],
  userFailure: null,
  userLogout: [],
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */
const defaultUser = {
  uid:null,
  displayName:null,
  photoURL:null,
}
export const INITIAL_STATE = Immutable({
  user: defaultUser,
  fetching: null,
  error: null
})

/* ------------- Selectors ------------- */

export const UserSelectors = {
  getUser: state => state.user.user
}

/* ------------- Reducers ------------- */
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

export const userLogout = state =>{
  return state.merge({user:defaultUser})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_PROFILE]: updateProfile,
  [Types.UPLOAD_PROFILE_PHOTO]: uploadProfilePhoto,
  [Types.USER_SUCCESS]: userSuccess,
  [Types.USER_FAILURE]: userFailure,
  [Types.USER_LOGOUT]: userLogout,
})
