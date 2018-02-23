import React, { Component } from 'react'
import {View, ScrollView, Text, Alert,  KeyboardAvoidingView, Platform} from 'react-native'
import { connect } from 'react-redux'
import {Button, Input, Icon, Avatar} from 'react-native-elements'
import { Images, Colors, Metrics} from '../Themes'
import firebase from 'react-native-firebase'
import styles from './Styles/UserScreenStyle'
import UserActions from '../Redux/UserRedux'
import TodoActions from '../Redux/TodoRedux'
import ImagePicker from 'react-native-image-picker'
import Config from 'react-native-config'
import { twitter } from 'react-native-simple-auth'

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

  componentWillReceiveProps(nextProps){
    if(this.props.fetching && !nextProps.fetching){
      Alert.alert(this.props.error?"Error":"Updated")
    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
      <KeyboardAvoidingView style={styles.centered}>     
        <Avatar
          rounded
          xlarge
          source={this.props.user.photoURL?{uri:this.props.user.photoURL}:Images.launch}
          onPress={() => {
            var options = {
              mediaType:"photo",
              maxWidth:640,
              maxHeight:640,
              allowsEditing: true,
              storageOptions: {
                skipBackup: false,
              }
            }
            ImagePicker.showImagePicker(options, (value) => {
              if(value.uri){
                this.props.uploadProfilePhoto({photoURL:value.uri})
              }
            })
          }}
          activeOpacity={0.7}
        />
        <Input
              returnKeyType="send"
              inputStyle={{color:Colors.snow}}
              placeholder={'Your Name Here'}
              placeholderTextColor={Colors.charcoal} 
              defaultValue={this.props.user.displayName?this.props.user.displayName:""} 
              onSubmitEditing={(event) => {
                if (this.props.user.displayName != event.nativeEvent.text){
                  this.props.updateProfile({displayName:event.nativeEvent.text})
                }
              }}
            />       
        <Button
          text= "Twitter Link"
          loading={this.props.fetching}
          onPress={()=>{
            this.props.linkToTwitter()
          }}
          />
          
          <Button 
            text="Twitter Unlink"
            onPress={()=>{
              console.log(firebase.auth().currentUser)
              this.props.unlink("twitter.com")
              this.props.updateEmail("example+"+this.props.user.uid+"@gmail.com")
            }}
          />
          <Button
            text="Log out"
            onPress={()=>{
              this.props.logout()
            }}/>
            <Button 
            text="getToken"
            onPress={()=>{
              firebase.auth().currentUser.getIdToken().then((tokenId)=>{
                console.log(tokenId)
              })
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user:state.user.user,
    fetching:state.user.fetching,
    error:state.user.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginTwitter: () => dispatch(UserActions.loginTwitter()),
    linkToTwitter:() => dispatch(UserActions.linkToTwitter()),
    unlink:(providerId) => dispatch(UserActions.unlink(providerId)),
    logout:() => dispatch(UserActions.logout()),
    updateEmail:(email) => dispatch(UserActions.updateEmail(email)),
    updateProfile: (user) => dispatch(UserActions.updateProfile(user)),
    uploadProfilePhoto: (user) => dispatch(UserActions.uploadProfilePhoto(user)),
    failure:() => dispatch(UserActions.userFailure()),
    setShareId:(todoId, shareId) => dispatch(TodoActions.setShareId(todoId, shareId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)
