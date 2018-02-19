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
          this.props.deleteTodoList(this.props.id)
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
              defaultValue={this.props.todo.title} 
              onSubmitEditing={(event) => {
                const text = event.nativeEvent.text
                if (this.props.todo.title != text){
                  this.props.changeTodoList(this.props.id, {title:text}) 
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
              // onPress={()=>{this.props.goToTaskScreen(this.props.id, this.props.todo)}}
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
    this.props.fetchTask(this.props.navigation.state.params.todoId, true)
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
                todo={row} 
                id={index}
                // changeTodoList={this.props.changeTodoList}
                // deleteTodoList={this.props.deleteTodoList}
              />
            )}}
          // renderFooter={this.renderFooter.bind(this)}
          ListViewComponent={KeyboardAwareListView}
          extraScrollHeight={44}
          refreshControl={
            <RefreshControl
              refreshing={this.props.fetching}
              onRefresh={()=>{this.props.fetchTask(this.props.navigation.state.params.todoId,false)}}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen)
