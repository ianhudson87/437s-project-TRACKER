import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'
import { fetchUsers } from "./constants/api"

class App extends Component {
  static defaultProps = {
    fetchUsers
  }

  state = {
    users: ["asdf"],
    count: 4,
    loading: false
  }

  componentDidMount() {
    fetch(fetchUsers())
    .then(res => res.json())
    .then(json => {this.setState({users: json.users}); console.log(json.users[0].name)})
    .catch(error => console.log('Authorization failed : ' + error.message));
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