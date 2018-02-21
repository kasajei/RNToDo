import React, { Component } from 'react'
import { View, ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import {Button, Input, Icon, Avatar} from 'react-native-elements'
import { Images, Colors, Metrics} from '../Themes'
import UserActions from '../Redux/UserRedux'

import styles from './Styles/LoginScreenStyle'

class LoginScreen extends Component {
  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.screenContainer}>
        <Avatar
          rounded
          xlarge
          source={Images.launch}
        />
        <View style={styles.groupAroundContainer}>
          <Button
            text= "Annonymous"
            onPress={()=>{
              this.props.signInAnonymous()
            }}
            />
          <Button 
            text="Twitter Login"
            onPress={()=>{
              this.props.loginTwitter()
            }}
          />
        </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user:state.user.user,
  }
}

const mapDispatchToProps = (dispatch) => ({
  signInAnonymous:()=> dispatch(UserActions.signInAnonymous()),
  loginTwitter:() => dispatch(UserActions.loginTwitter()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
