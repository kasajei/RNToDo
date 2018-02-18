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
              />
         </View>
      </Swipeout>
    )
  }
}

class TodoScreen extends Component {
  static navigationOptions =  ({ navigation }) => {
    var title = "Todo Lists"
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
              navigation.state.params.addTodoList({})
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
      <Icon name='check' type="font-awesome" color={tintColor}/>
      ),
      drawerLockMode:"unlocked",
    }
  } 

  componentWillMount(){
    this.props.navigation.setParams({
      addTodoList:this.props.addTodoList
    })
    this.props.fetchTodoList()
  }

  
  render () {
    return (
      <View style={styles.container}>
        <SortableListView
          // moveOnPressIn = {true}
          data={this.props.todoLists}
          // onRowMoved={e => {
          //   this.props.changeOrder(e.from, e.to)
          // }}
          renderRow={(row, section, index) => {
            return (
              <ToDoCell 
                todo={row} 
                id={index}
                changeTodoList={this.props.changeTodoList}
                deleteTodoList={this.props.deleteTodoList}
              />
            )}}
          // renderFooter={this.renderFooter.bind(this)}
          ListViewComponent={KeyboardAwareListView}
          extraScrollHeight={44}
          refreshControl={
            <RefreshControl
              refreshing={this.props.fetching}
              onRefresh={this.props.fetchTodoList}
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
    addTodoList: (todo) => dispatch(TodoActions.addTodoList(todo)),
    fetchTodoList: () => dispatch(TodoActions.fetchTodoList()),
    changeTodoList:(id, diff) => dispatch(TodoActions.changeTodoList(id, diff)),
    deleteTodoList:(id) => dispatch(TodoActions.deleteTodoList(id)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoScreen)
