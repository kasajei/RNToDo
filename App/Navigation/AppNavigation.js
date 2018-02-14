import { StackNavigator } from 'react-navigation'
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

export default PrimaryNav
