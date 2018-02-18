import { StackNavigator, DrawerNavigator } from 'react-navigation'
import TaskScreen from '../Containers/TaskScreen'
import TodoScreen from '../Containers/TodoScreen'
import UserScreen from '../Containers/UserScreen'
import LaunchScreen from '../Containers/LaunchScreen'
import Colors from '../Themes/Colors'
import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header,
    headerTintColor: Colors.snow,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
})

const TodoNav = StackNavigator({
  TaskScreen: { screen: TaskScreen },
  TodoScreen: { screen: TodoScreen },
}, {
  // Default config for all screens
  initialRouteName: 'TodoScreen',
  navigationOptions: {
    headerStyle: styles.header,
    headerTintColor: Colors.snow,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
})

const UserNav = StackNavigator({
  UserScreen: { screen: UserScreen }
}, {
  // Default config for all screens
  initialRouteName: 'UserScreen',
  navigationOptions: {
    headerStyle: styles.header,
    headerTintColor: Colors.snow,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
})

const MyApp = DrawerNavigator({
  UserNav: { screen: UserNav },
  TodoNav: {screen: TodoNav},
  PrimaryNav: { screen: PrimaryNav,},
  
},{
  initialRouteName: 'TodoNav',
  drawerBackgroundColor:Colors.drawer,
  contentOptions: {
    activeTintColor: Colors.background,
    inactiveTintColor: Colors.snow,
    activeBackgroundColor:Colors.silver,
    inactiveBackgroundColor:Colors.background,
  }
});

export default MyApp
