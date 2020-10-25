import React, { Component } from 'react'
import LoginForm from './LoginForm'


import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Button
  } from 'react-native'
  import { fetchUsers, createUser, loginUser } from "./constants/api"


  class Login extends Component {
    static defaultProps = {
      fetchUsers,
      createUser,
      loginUser
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
          <Text>
            {
              // print out all users
              this.state.users.map((user, key)=> (<Text key={key}>{user.name}</Text>))
            }
          </Text>
          <LoginForm navigation={navigation}></LoginForm>
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
            <Button title="go to HOME" onPress={ () => navigation.navigate("Home") }></Button>
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
  
  export default Login;