import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { UserTypes } from '../Redux/UserRedux'

/* ------------- Sagas ------------- */

import {updateProfile, uploadProfilePhoto, signInAnonymous} from './UserSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    takeLatest(UserTypes.SIGN_IN_ANONYMOUS, signInAnonymous),
    takeLatest(UserTypes.UPDATE_PROFILE, updateProfile),
    takeLatest(UserTypes.UPLOAD_PROFILE_PHOTO, uploadProfilePhoto),
  ])
}
