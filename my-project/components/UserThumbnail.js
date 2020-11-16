// Thumbnail for displaying a user

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native'
import { Card, ListItem, Icon, Divider } from 'react-native-elements'

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
    navigation.push("UserProfile", {profileUserID: this.state.user_info._id})
  }

  
render() {
  return (
    <ListItem bottomDivider onPress={this.goToUser}>
        <ListItem.Content>
            <ListItem.Title>{this.state.name}</ListItem.Title>
        </ListItem.Content>
    </ListItem>
    // <View style={styles.container}>
    //   <Button color="#ff5c5c" title={this.state.name} onPress={this.goToUser}/>
    // </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default UserThumbnail;