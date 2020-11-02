import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import AddUserForm from '../components/AddUserForm'

class AddUserToGroup extends Component {
constructor(props) {
    super(props);
    this.state = {group: {'name': "default", 'users': []}}
}

componentDidMount(){
    const group = this.props.route.params.group;
    this.setState({group: group});
    console.log(this.props.route.params.group)
}

  
render() {
    return (
      <View style={styles.container}>
        <Text>
          Add users to group {this.state.group.name}
        </Text>
        <Text>
            Current Users:
        </Text>
        <Text>
        {
            this.state.group.users.map((user, key)=> (<Text key={key}>{user.name}</Text>))
        }
        </Text>
        <AddUserForm group={this.state.group} navigation={this.props.navigation} loggedInUser={this.props.loggedInUser}></AddUserForm>
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

export default AddUserToGroup;