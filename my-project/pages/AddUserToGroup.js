import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import AddUserForm from '../components/AddUserForm'
import { getObjectsByIDs } from '../constants/api'

class AddUserToGroup extends Component {
constructor(props) {
    super(props);
    this.state = {
      group: {'name': "default", 'users': []},
      users: [] //stores user objects
    }
}

componentDidMount(){
    const group = this.props.route.params.group;
    this.setState({group: group});
    console.log(this.props.route.params.group)
    getObjectsByIDs({ids: group.users, type: 'user'}).then((response)=>{
      if(response.objects_exist){
        this.setState({users: response.objects})
      }
    })
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
            this.state.users.map((user, key)=> (<Text key={key}>{user.name} </Text>))
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