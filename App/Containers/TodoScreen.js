import React, { Component } from 'react'
import { ScrollView, Text, Image, View, RefreshControl } from 'react-native'
import {connect} from 'react-redux'
import SortableListView from 'react-native-sortable-listview'
import {Button, Input, Icon} from 'react-native-elements'
import { Images, Colors, Metrics} from '../Themes'
import Swipeout from 'react-native-swipeout'
import TodoActions from '../Redux/TodoRedux'
import { KeyboardAwareListView } from 'react-native-keyboard-aware-scroll-view'

import styles from './Styles/TodoScreenStyle'

class ToDoCell extends Component {
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
              placeholder={'ToDo List Name'}
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
              icon={<Icon name='chevron-right' type="font-awesome" color={Colors.snow}/>}
              buttonStyle={{
                backgroundColor:Colors.transparent
              }}
              iconContainerStyle={{
                marginRight:Metrics.baseMargin,
                flex:0.1
              }}
              onPress={()=>{this.props.goToTaskScreen(this.props.id, this.props.todo)}}
              />
         </View>
      </Swipeout>
    )
  }
}

class TodoScreen extends Component {
  static navigationOptions =  ({ navigation }) => {
    const { params = {} } = navigation.state
    var title = params.isShare ? "Share Lists" : "Todo Lists"
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
              navigation.state.params.addTodoList({}, params.isShare)
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
      <Icon name={params.isShare ?'users':'cloud'} type="font-awesome" color={tintColor}/>
      ),
      drawerLockMode:"unlocked",
    }
  } 

  componentWillMount(){
    this.props.navigation.setParams({
      addTodoList:this.props.addTodoList,
      user:this.props.user, 
    })
    const {params = {}} = this.props.navigation.state
    params.isShare 
      ? this.props.fetchSyncTodoList(true) 
      : this.props.fetchTodoList(true)
    this.params = params
  }

  goToTaskScreen(id, todo){
    this.props.navigation.navigate("TaskScreen", Object.assign(this.props.navigation.state.params,{todoId:id, todo:todo}))
  }

  renderFooter(){
    return(
      <View>
        <View  style={styles.groupAroundContainer}>
        <Input
              returnKeyType="done"
              inputStyle={{color:Colors.snow}}
              placeholder={'Share ID Here'}
              placeholderTextColor={Colors.charcoal} 
              onSubmitEditing={(event) => {
                const text = event.nativeEvent.text
                this.props.subscribeTodo(text)
              }}
            />
        </View>
      </View>
    )
  }
  
  render () {
    return (
      <View style={styles.container}>
        <SortableListView
          data={this.props.todoLists}
          renderRow={(row, section, index) => {
            return (
              <ToDoCell 
                todo={row} 
                id={index}
                changeTodoList={this.props.changeTodoList}
                deleteTodoList={this.props.deleteTodoList}
                goToTaskScreen={this.goToTaskScreen.bind(this)}
              />
            )}}
            renderFooter={this.renderFooter.bind(this)}
            ListViewComponent={KeyboardAwareListView}
            extraScrollHeight={44}
            refreshControl={
              <RefreshControl
                refreshing={this.props.fetching}
                onRefresh={()=>{
                  this.params.isShare 
                  ? this.props.fetchSyncTodoList(true) 
                  : this.props.fetchTodoList(true)
                }}
              />
            }
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    todoLists: state.todo.todoLists,
    fetching: state.todo.fetching,
    user: state.user.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTodoList: (todo, isShare) => dispatch(TodoActions.addTodoList(todo, isShare)),
    fetchTodoList: (isReload) => dispatch(TodoActions.fetchTodoList(isReload)),
    fetchSyncTodoList: (isReload) => dispatch(TodoActions.fetchSyncTodoList(isReload)),
    changeTodoList:(id, diff) => dispatch(TodoActions.changeTodoList(id, diff)),
    deleteTodoList:(id) => dispatch(TodoActions.deleteTodoList(id)),
    subscribeTodo:(shareId) => dispatch(TodoActions.subscribeTodo(shareId)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoScreen)
