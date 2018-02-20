import React, { Component } from 'react'
import {View, ScrollView, Text, Alert,  KeyboardAvoidingView, Platform} from 'react-native'
import { connect } from 'react-redux'
import {Button, Input, Icon, Avatar} from 'react-native-elements'
import { Images, Colors, Metrics} from '../Themes'
import firebase from 'react-native-firebase'
import styles from './Styles/UserScreenStyle'
import UserActions from '../Redux/UserRedux'
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
          text= "TwitterLogin"
          loading={this.props.fetching}
          onPress={()=>{
            twitter({
              appId: Config.TWITTER_CONSUMER_KEY,
              appSecret: Config.TWITTER_CONSUMER_SECRET,
              callback:"RNTodo://authorize"
            }).then((info) => {
              console.log(info)
              // info.user - user details from the provider
              // info.credentials - tokens from the provider

              // create a new firebase credential with the token
              const credential = firebase.auth.TwitterAuthProvider.credential(
                info.credentials.oauth_token,
                info.credentials.oauth_token_secret
              );
              // login with credential
              // const currentUser = await firebase.auth().signInWithCredential(credential);

              // link to current user
              firebase.auth().currentUser.linkWithCredential(credential).then(function(user) {
                console.log("Anonymous account successfully upgraded", user);
              }, function(error) {
                console.log("Error upgrading anonymous account", error);
              });
            }).catch((error) => {
              console.log(error)
              // error.code
              // error.description
            });
          }}
          />
          <Button 
            text="Twitter Unlink"
            onPress={()=>{
              console.log(firebase.auth().currentUser)
              firebase.auth().currentUser.unlink("twitter.com").then(()=>{

              }).catch((error)=>{
                console.log(error)
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
    updateProfile: (user) => dispatch(UserActions.updateProfile(user)),
    uploadProfilePhoto: (user) => dispatch(UserActions.uploadProfilePhoto(user)),
    failure:() => dispatch(UserActions.userFailure()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)
