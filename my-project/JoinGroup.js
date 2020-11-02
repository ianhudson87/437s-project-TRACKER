import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getGroupByID } from "./constants/api"
import { joinGroup } from "./constants/api"
import { getAllGroups } from "./constants/api"

import LoginForm from './LoginForm'

class JoinGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {groups: ["hi"], user: {'name': "default"}}
    }

    componentDidMount(){
        const user = this.props.route.params.user;
        this.setState({user: user})
        const groupIDs = getAllGroups();

        console.log(groupIDs.length);
        
        for(let i=0; i<groupIDs.length; i++){
            getGroupByID({'id': groupIDs[i]}).then((data)=>{
                this.setState({groups: data.group})
            })
        }
    }

    handleGroupPress(group, event)
    {    
      joinGroup(group.id, this.state.user).then((data)=>{console.log("Joined Group")})
    }

  
render() {
    return (
      <View style={styles.container}>
        <Text>
            Groups:
        </Text>

        <Text>
        {
            this.state.groups.map((group, key)=> (<Button title={group} key={key} 
                onPress={(e) => this.handleGroupPress(group, e)}/>))
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

export default JoinGroup;