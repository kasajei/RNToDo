import React, { Component } from 'react'
import {View, ScrollView, Text, KeyboardAvoidingView, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import SortableListView from 'react-native-sortable-listview'
import {Button, Input, Icon} from 'react-native-elements'
import { Images, Colors, Metrics} from '../Themes'
import Swipeout from 'react-native-swipeout'
import TodoActions from '../Redux/TodoRedux'
import { KeyboardAwareListView } from 'react-native-keyboard-aware-scroll-view'


// Styles
import styles from './Styles/ShareTaskScreenStyle'

const shareTodoId = "QlNVrSvXYUplDhIIAAu9"

class TaskCell extends Component {
  render(){
    var swipeoutBtns = [
      {
        text: 'delete',
        type:"delete",
        onPress:() => {
          this.props.deleteTask(this.props.todoId, this.props.taskId)
        }
      }
    ]
    return(
      <Swipeout right={swipeoutBtns} autoClose={true} close={false} style={{backgroundColor:Colors.backgroundColor}}>
        <View  style={styles.groupBetweenContainer}>
          <View style={styles.groupAroundContainer}>
            <Input
              returnKeyType="done"
              inputStyle={{color:Colors.snow}}
              placeholder={'Task Name'}
              placeholderTextColor={Colors.charcoal} 
              defaultValue={this.props.task.title} 
              onSubmitEditing={(event) => {
                const text = event.nativeEvent.text
                if (this.props.task.title != text){
                  this.props.changeTask(this.props.todoId, this.props.taskId, {title:text}) 
                }
              }}
            />
          </View>
          {/* <Button
              text=""
              iconRight
              icon={<Icon name='bars' type="font-awesome" color={Colors.snow}/>}
              buttonStyle={{
                backgroundColor:Colors.transparent
              }}
              iconContainerStyle={{
                marginRight:Metrics.baseMargin,
                flex:0.1
              }}
              /> */}
         </View>
      </Swipeout>
    )
  }
}

class ShareTaskScreen extends Component {
  static navigationOptions =  ({ navigation }) => {
    const { params = {} } = navigation.state
    var title = "Share Task"
    return {
      title: title,
      headerRight: 
        <Button 
          text=""
          buttonStyle={{
            backgroundColor:Colors.transparent
          }}
          icon={<Icon name='plus' type="font-awesome" color={Colors.fire}/>}
          onPress={
            ()=>{
              navigation.state.params.addTask(shareTodoId, {})
            }
          }
        />,
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
      <Icon name='users' type="font-awesome" color={tintColor}/>
      ),
      drawerLockMode:"unlocked",
    }
  } 
  componentWillMount(){
    this.props.navigation.setParams({
      addTask:this.props.addTask
    })
    this.props.startSyncTask(shareTodoId)
  }

  componentWillUnmount(){
    this.props.stopSyncTask(shareTodoId)
  }
  render () {
    return (
      <View style={styles.container}>
        <SortableListView
          // moveOnPressIn = {true}
          data={this.props.tasks?this.props.tasks:{}}
          // onRowMoved={e => {
          //   this.props.changeOrder(e.from, e.to)
          // }}
          renderRow={(row, section, index) => {
            return (
              <TaskCell 
                task={row} 
                todoId={shareTodoId}
                taskId={index}
                changeTask={this.props.changeTask}
                deleteTask={this.props.deleteTask}
              />
            )}}
          // renderFooter={this.renderFooter.bind(this)}
          ListViewComponent={KeyboardAwareListView}
          extraScrollHeight={44}
          refreshControl={
            <RefreshControl
              refreshing={this.props.fetching}
              onRefresh={()=>{this.props.fetchTask(shareTodoId,false)}}
            />
          }
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.todo.tasks,
    fetching: state.todo.fetching,
    user: state.user.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTask:(todoId, task)=>dispatch(TodoActions.addTask(todoId, task)),
    fetchTask:(todoId, isReload) => dispatch(TodoActions.fetchTask(todoId, isReload)),
    startSyncTask: (todoId) => dispatch(TodoActions.startSyncTask(todoId)),
    stopSyncTask : (todoId) => dispatch(TodoActions.stopSyncTask(todoId)),
    changeTask:(todoId, taskId, diff) => dispatch(TodoActions.changeTask(todoId, taskId, diff)),
    deleteTask:(todoId, taskId) => dispatch(TodoActions.deleteTask(todoId, taskId)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShareTaskScreen)
