import React, { Component } from 'react'
import NewUserForm from '../components/NewUserForm'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button
} from 'react-native'
import { fetchUsers, createUser } from "../constants/api"

class Register extends Component {
  static defaultProps = {
    fetchUsers,
    createUser
  }

  state = {
    users: [],
    count: 0,
    loading: false,
    response: ""
  }

  componentDidMount() {
    fetchUsers().then((data)=>{
      this.setState({users: data.users})
    })
  }

  onPress = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

 render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <NewUserForm navigation={this.props.navigation} />
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

export default Register;