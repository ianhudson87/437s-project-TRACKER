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
      name: this.props.user.name,
      id: this.props.user._id
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
  
  let info = this.state.user_info.info == 'none' || typeof(this.state.user_info.info) == 'undefined' ? '' : this.state.user_info.info
  
  return (
    <ListItem key={this.state.user_info._id} bottomDivider onPress={this.goToUser}>
        <Icon name="face" />
        <ListItem.Content>
            <ListItem.Title>{this.state.name}</ListItem.Title>
            <ListItem.Subtitle>{info}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
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