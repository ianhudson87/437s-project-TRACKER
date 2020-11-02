import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { joinGroup, fetchGroups } from "../constants/api"

class JoinGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {groups: [], loggedInUser: this.props.route.params.loggedInUser}
    }

    componentDidMount(){
      console.log("USERUSER:", this.state.loggedInUser)
      let group_list = []
      fetchGroups().then((response)=>{
        let groups = response.groups
        groups.forEach((group)=>{group_list.push(group)})
        this.setState({groups: group_list})
      })

    }

    handleGroupPress(group, event)
    {    
      joinGroup(this.state.loggedInUser._id, group._id).then((data)=>{console.log("Joined Group")})
    }

  
render() {
    return (
      <View style={styles.container}>
        <Text>
            Groups:
        </Text>

        <Text>
        {
            this.state.groups.map((group, key)=> (<Button title={group.name} key={key} 
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