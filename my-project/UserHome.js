import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'

import LoginForm from './LoginForm'

class UserHome extends Component {
  
render() {
    const user = this.props.route.params.user;
    const groups = user.groups;
    return (
      <View style={styles.container}>
        <Text>
          User Home Page
        </Text>
        <Text>
            Logged in user: {user.name}
        </Text>
        <Text>
       
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10
  }
})

export default UserHome;