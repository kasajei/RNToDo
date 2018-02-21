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
import styles from './Styles/TaskScreenStyle'

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
          <Button
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
              {...this.props.sortHandlers}
              />
         </View>
      </Swipeout>
    )
  }
}

class TaskScreen extends Component {
  static navigationOptions =  ({ navigation }) => {
    const { params = {} } = navigation.state
    var title = params.todo.title?params.todo.title:"ToDo List Name"
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
              navigation.state.params.addTask(params.todoId, {})
            }
          }
        />
    }
  } 
  componentWillMount(){
    this.props.navigation.setParams({
      addTask:this.props.addTask
    })
    const {params = {}} = this.props.navigation.state
    params.isShare
      ? this.props.startSyncTask(params.todoId)
      : this.props.fetchTask(params.todoId, true)
    this.params = params
  }
  render () {
    return (
      <View style={styles.container}>
        <SortableListView
          moveOnPressIn = {true}
          data={this.props.tasks}
          order={this.props.taskIds}
          onRowMoved={e => {
            if(e.to == 0){ // firest
              this.props.changeTask(
                this.params.todoId,
                this.props.taskIds[e.from],
                {order: this.props.tasks[this.props.taskIds[0]].order/2}  
              )
            }else if (e.to == this.props.taskIds.length -1){ // last
              this.props.changeTask(
                this.params.todoId,
                this.props.taskIds[e.from],
                {order: this.props.tasks[this.props.taskIds[e.to]].order+1}  
              )
            }else{
              this.props.changeTask(
                this.params.todoId,
                this.props.taskIds[e.from],
                {order: (this.props.tasks[this.props.taskIds[(e.to>e.from)?(e.to+1):(e.to-1)]].order+this.props.tasks[this.props.taskIds[e.to]].order)/2}  
              )
            }
          }}
          renderRow={(row, section, index) => {
            return (
              <TaskCell 
                task={row} 
                todoId={this.params.todoId}
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
              onRefresh={()=>{!this.params.isShare && this.props.fetchTask(this.params.todoId,false)}}
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
    taskIds: state.todo.taskIds,
    fetching: state.todo.fetching,
    user: state.user.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTask:(todoId, task)=>dispatch(TodoActions.addTask(todoId, task)),
    fetchTask:(todoId, isReload) => dispatch(TodoActions.fetchTask(todoId, isReload)),
    startSyncTask: (todoId) => dispatch(TodoActions.startSyncTask(todoId)),
    changeTask:(todoId, taskId, diff) => dispatch(TodoActions.changeTask(todoId, taskId, diff)),
    deleteTask:(todoId, taskId) => dispatch(TodoActions.deleteTask(todoId, taskId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen)
