import React, { Component } from 'react'
import NewUserForm from './NewUserForm'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'
import { fetchUsers, createUser } from "./constants/api"

class App extends Component {
  static defaultProps = {
    fetchUsers,
    createUser
  }

  state = {
    users: ["asdf"],
    count: 69,
    loading: false,
    response: ""
  }

  componentDidMount() {
    fetchUsers().then((data)=>{
      this.setState({users: data.users})
    })

    // createUser().then((data)=>{
    //   this.setState({response: data})
    // })
  }

  onPress = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

 render() {
    return (
      <View style={styles.container}>
        <Text>
          {
            this.state.users.map((user, key)=> (<Text key={key}>{user.name}</Text>))
          }
        </Text>
        <NewUserForm></NewUserForm>
        <TouchableOpacity
         style={styles.button}
         onPress={this.onPress}
        >
         <Text>Click me</Text>
        </TouchableOpacity>
        <View>
          <Text>
            You clicked { this.state.count } times
          </Text>
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
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10
  }
})

export default App;