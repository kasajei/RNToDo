import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import {Button, Input, Icon, Avatar} from 'react-native-elements'
import { Images, Colors, Metrics} from '../Themes'
import firebase from 'react-native-firebase'
import styles from './Styles/UserScreenStyle'

class UserScreen extends Component {
  static navigationOptions =  ({ navigation }) => {
    var title = "User"
    return {
      title: title,
      headerLeft: 
        <Button 
          text=""
          buttonStyle={{
            backgroundColor:Colors.transparent
          }}
          iconRight
          icon={<Icon name='bars' type="font-awesome" color={Colors.snow}/>}
          onPress={
            ()=>{
              navigation.navigate('DrawerOpen');
            }
          }
        />,
      drawerLabel: title,
      drawerIcon: ({ tintColor }) => (
      <Icon name='user' type="font-awesome" color={tintColor}/>
      ),
    }
  }
  state = {
    user: null
  } 
  componentWillMount(){
    firebase.auth().signInAnonymouslyAndRetrieveData().then((data) => {
      this.user = firebase.auth().currentUser
      this.setState({user:this.user})
    });
  }
  render () {
    return (
      <ScrollView style={styles.container}>
        <Avatar
          rounded
          xlarge
          source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"}}
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
        />
        <Text style={styles.titleText}>{this.state.user?this.state.user.displayName:""}</Text>
        <Button text="Change DisplayName" onPress={()=>{
          this.user.updateProfile({
            displayName:"kasajei"
          }).then(()=>{
            this.setState({user:firebase.auth().currentUser})
          })
        }
        }/>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)
