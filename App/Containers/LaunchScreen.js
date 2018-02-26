import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import {connect} from 'react-redux'
import SortableListView from 'react-native-sortable-listview'
import {Button, Input, Icon} from 'react-native-elements'
import { Images, Colors, Metrics} from '../Themes'
import Swipeout from 'react-native-swipeout'
import TodoActions from '../Redux/TodoRedux'
import { KeyboardAwareListView } from 'react-native-keyboard-aware-scroll-view'
import styles from './Styles/LaunchScreenStyles'
import firebase from 'react-native-firebase'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

class ToDoCell extends Component {
  render(){
    var swipeoutBtns = [
      {
        text: 'delete',
        type:"delete",
        onPress:() => {
          this.props.deleteTodo(this.props.index)
        }
      }
    ]
    return(
      <Swipeout right={swipeoutBtns} autoClose={true} close={false} style={{backgroundColor:Colors.backgroundColor}}>
        <View  style={styles.groupBetweenContainer}>
          <View style={styles.groupAroundContainer}>
            <Text style={styles.subtitle}>{this.props.index+1}.</Text>
            <Input
              returnKeyType="done"
              inputStyle={{color:Colors.snow}}
              placeholder={'Task Name Here'}
              placeholderTextColor={Colors.charcoal} value={this.props.todo.title} 
              onChangeText={(text) => {
                this.props.changeTodo(this.props.index, {title:text}) 
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

class LaunchScreen extends Component {
  static navigationOptions =  ({ navigation }) => {
    var title = "Local"
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
              navigation.state.params.addTodo({})
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
      <Icon name='hdd-o' type="font-awesome" color={tintColor}/>
      ),
      drawerLockMode:"unlocked",
    }
  } 

  componentWillMount(){
    this.props.navigation.setParams({
      addTodo:this.props.addTodo
    })
  }

  renderFooter(){
    return(
      <View>
        {["selection", "impactLight", "impactMedium","impactHeavy","notificationSuccess", "notificationWarning", "notificationError"].map((value)=>{
          return(<Button 
            text={value}
            onPress={
              ()=>{
                ReactNativeHapticFeedback.trigger(value);
              }
            }
          />)
        })}
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <SortableListView
          moveOnPressIn = {true}
          data={this.props.todos}
          onRowMoved={e => {
            this.props.changeOrder(e.from, e.to)
          }}
          renderRow={(row, section, index) => 
          <ToDoCell 
            todo={row} 
            index={parseInt(index)}
            changeTodo={this.props.changeTodo}
            deleteTodo={this.props.deleteTodo}
            />}
          renderFooter={this.renderFooter.bind(this)}
          ListViewComponent={KeyboardAwareListView}
          extraScrollHeight={44}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todo.todos,
    user: state.user.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTodo: (todo) => dispatch(TodoActions.addTodo(todo)),
    deleteTodo: (index) => dispatch(TodoActions.deleteTodo(index)),
    changeTodo: (index, diff) => dispatch(TodoActions.changeTodo(index, diff)),
    changeOrder: (from, to) => dispatch(TodoActions.changeOrder(from, to)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
