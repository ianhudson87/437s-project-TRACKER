import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'
import { getGroupByID } from "./constants/api"
import LoginForm from './LoginForm'

class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {groups: ["hi"], user: {'name': "default"}}
    }

    componentDidMount(){
        const user = this.props.route.params.user;
        this.setState({user: user})
        const groupIDs = user.groups;
        
        for(let i=0; i<groupIDs.length; i++){
            getGroupByID({'id': groupIDs[i]}).then((data)=>{
                this.setState({groups: data.group})
            })
            
        }
    }
  
render() {
    
    return (
      <View style={styles.container}>
        <Text>
          User Home Page
        </Text>
        <Text>
            Logged in user: {this.state.user.name}
        </Text>
        <Text>
        {
            this.state.groups.map((group, key)=> (<Text key={key}>{group.name}</Text>))
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

export default UserHome;