import { StackNavigator, DrawerNavigator } from 'react-navigation'
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

const MyApp = DrawerNavigator({
  PrimaryNav: { screen: PrimaryNav,},
  SecondNav: {screen: PrimaryNav,},
},{
  drawerBackgroundColor:Colors.drawer,
  contentOptions: {
    activeTintColor: Colors.background,
    inactiveTintColor: Colors.snow,
    activeBackgroundColor:Colors.silver,
    inactiveBackgroundColor:Colors.background,
  }
});

export default MyApp
