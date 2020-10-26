import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getGroupByID } from "./constants/api"
import LoginForm from './LoginForm'

class GroupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {group: {'name': "default", 'users': []}}
    }

    componentDidMount(){
        const group = this.props.route.params.group;
        this.setState({group: group});
        console.log(group)
        console.log(this.state.group)
        console.log(this.state.group.users)
    }

  
render() {
    return (
      <View style={styles.container}>
        <Text>
          Group Page
        </Text>
        <Text>
            Group: {this.state.group.name}
        </Text>
        <Text>
        {
            this.state.group.users.map((user, key)=> (<Text key={key}>{user}</Text>))
        }
        </Text>
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

export default GroupPage;