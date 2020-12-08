import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
  ScrollView,
} from 'react-native'
import { ListItem } from 'react-native-elements'
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
  console.log("IN SCROLL")
  console.log(this.state.users)
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
        <Text>
          Add users to group {this.state.group.name}
        </Text>
        <Text>
            Current Users:
        </Text>
        </View>
        <View style={styles.middleContainer}>
        <ScrollView style={styles.scrollContainer}>
        {
            this.state.users.map((user, key)=>(
              <Text>{user.name}</Text>
            ))
        }
        </ScrollView>
        </View>
        <View style={styles.bottomContainer}>
        <AddUserForm group={this.state.group} navigation={this.props.navigation} loggedInUser={this.props.loggedInUser}></AddUserForm>
        </View>
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
  scrollContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
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