import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import CreateNewGroupForm from '../components/CreateNewGroupForm'

class CreateNewGroup extends Component {
  constructor(props) {
      super(props);
      this.state = {loggedInUserID: null, group: {'name': "default", 'users': [], 'games': []}}

      this.getUserID = this.getUserID.bind(this);
  }

  componentDidMount(){
    this.getUserID()
  }

  getUserID(){
    AsyncStorage.getItem('loggedInUserID').then((loggedInUserID)=>{
      console.log("USERID FROM STORAGE:", loggedInUserID)
      // update loggedInUserID in the state
      this.setState({loggedInUserID: loggedInUserID})
    })
  }

render() {
  console.log("RENDER")
  console.log(this.state)
    return (
      <View>
        <CreateNewGroupForm navigation={this.props.navigation} loggedInUserID={this.state.loggedInUserID}></CreateNewGroupForm>
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

export default CreateNewGroup;