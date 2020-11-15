// Thumbnail for displaying a user

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native'

class UserThumbnail extends Component {
  // need to know the name of the user, and maybe other info
  // These are passed as props

  constructor(props) {
    super(props);

    this.state = {
      user_info: this.props.user,
      name: this.props.user.name
    }

    this.goToUser = this.goToUser.bind(this);
  }

  goToUser(event) {
    console.log('button click')
    // handler for user clicks on the user
    const navigation = this.props.navigation;
    navigation.navigate("UserProfile", {profileUserID: this.state.user_info._id})
  }

  
render() {
  return (
    <View style={styles.container}>
      <Button title={this.state.name} onPress={this.goToUser}/>
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
  },
  text: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 2,
  }
})

export default GroupThumbnail;