import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import ReduxPersist from '../Config/ReduxPersist'
import UserActions from '../Redux/UserRedux'
// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  componentWillMount(){
    this.props.signInAnonymous()
  }
  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        {this.props.user && this.props.user.uid && <ReduxNavigation />}
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapStateToProps = (state) => {
  return {
    user:state.user.user,
  }
}

const mapDispatchToProps = (dispatch) => ({
  signInAnonymous:()=> dispatch(UserActions.signInAnonymous()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
