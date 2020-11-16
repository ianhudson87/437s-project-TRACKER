// Thumbnail for displaying a group

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native'
import { Card, ListItem, Icon } from 'react-native-elements'

class GroupThumbnail extends Component {
  // need to know the name of the group, and maybe other info
  // These are passed as props

  constructor(props) {
    super(props);

    this.state = {
      group_info: this.props.group,
      name: this.props.group.name
    }

    this.goToGroup = this.goToGroup.bind(this);
  }

  goToGroup(event) {
    console.log('button click')
    // handler for user clicks on the group
    const navigation = this.props.navigation;
    navigation.navigate("GroupPage", {groupID: this.state.group_info._id})
  }

  
render() {
  return (
    <View style={styles.container}>
      <Button color="#00aa00" title={this.state.name} onPress={this.goToGroup}/>
    </View>
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

export default GroupThumbnail;