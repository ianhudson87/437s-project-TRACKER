import React, { Component } from 'react'
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
        this.state = {user: this.props.route.params.loggedInUser, group: {'name': "default", 'users': [], 'games': []}}
    }

    componentDidMount(){
      console.log(this.state.user);
    }

render() {
    return (
      <View style={styles.container}>
        <Text>
          New group
        </Text>
       
        <CreateNewGroupForm navigation={this.props.navigation} loggedInUser={this.state.user}></CreateNewGroupForm>
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