import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import ReduxPersist from '../Config/ReduxPersist'
import UserActions from '../Redux/UserRedux'
// Styles
import styles from './Styles/RootContainerStyles'
import LoginScreen from '../Containers/LoginScreen'


class RootContainer extends Component {
  render () {
    var component = <LoginScreen />
    if (this.props.user && this.props.user.uid){
      component = <ReduxNavigation />
    }
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        {component}
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

})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
