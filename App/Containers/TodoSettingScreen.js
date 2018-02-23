import React, { Component } from 'react'
import { View, ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import {Button, Input, Icon, Avatar} from 'react-native-elements'
import { Images, Colors, Metrics} from '../Themes'
import TodoActions from '../Redux/TodoRedux'
import styles from './Styles/TodoSettingScreenStyle'

class TodoSettingScreen extends Component {
  static navigationOptions =  ({ navigation }) => {
    const { params = {} } = navigation.state
    var title = (params.todo.title || "Todo List")+" Setting"
    return {
      title: title,
    }
  }
  renderPrivate (todo){
    return(
      <View>
        <Text style={styles.subtitle}>Private</Text>
        <Button
            text= "Share"
            onPress={()=>{
              this.props.changeTodoList(todo.id, {sharedUsers:{[todo.userId]:true}})
            }}
            />
      </View>
    )
  }

  renderShared (todo){
    return(
      <View>
        <View style={styles.groupAroundContainer}>
          <Text style={styles.subtitle}>Shared</Text>
        </View>
        <View style={styles.groupAroundContainer}>
          <Input
            returnKeyType="done"
            inputStyle={{color:Colors.snow}}
            placeholder={'Set Share Uniqe ID'}
            placeholderTextColor={Colors.charcoal} 
            defaultValue={todo.shareId || ""} 
            onSubmitEditing={(event) => {
              const text = event.nativeEvent.text
              if(text != todo.ShareId){
                // shareId don't allow change directly
                // this.props.changeTodoList(todo.id, {shareId:text})

                // This method check Share ID Uniqu with Function
                this.props.setShareId(todo.id, text)
              }
            }}
          />
        </View>
          {Object.keys(todo.sharedUsers).map((value,index)=>{
            return (
              <View style={styles.groupAroundContainer} key={value}>
                <Text style={styles.subtitle} key={value}>{index+1}. {value}</Text>
              </View>
            )
          })}
        <View style={styles.groupAroundContainer}>
          {this.props.user.uid == todo.userId &&<Button
            text= "Private"
            onPress={()=>{
              this.props.changeTodoList(todo.id, {sharedUsers:null})
            }}
            />}
          {this.props.user.uid != todo.userId &&<Button
            text= "UnSubscribe"
            onPress={()=>{
              this.props.changeTodoList(todo.id, {sharedUsers:todo.sharedUsers.without(this.props.user.uid)})
            }}
            />}
        </View>
      </View>
    )
  }

  render () {
    const {params} = this.props.navigation.state
    this.params = params
    var component = null
    if (this.props.todoLists && this.props.todoLists[params.todoId]){
      const todo = this.props.todoLists[params.todoId] || {}
      if(todo.sharedUsers){
        component = this.renderShared(todo)
      }else{
        component = this.renderPrivate(todo)
      }
    }
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.screenContainer}>
        <Text style={styles.titleText}>{(this.props.todoLists && this.props.todoLists[params.todoId].title || "Todo List")} Settings</Text>
        {component}
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    todoLists: state.todo.todoLists,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeTodoList:(id, diff) => dispatch(TodoActions.changeTodoList(id, diff)),
    setShareId:(todoId, shareId) => dispatch(TodoActions.setShareId(todoId, shareId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoSettingScreen)
