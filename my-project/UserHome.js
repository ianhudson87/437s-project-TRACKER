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

class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {groups: ["hi"], user: {'name': "default"}}
        this.navigateToGroup = this.navigateToGroup.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
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

    navigateToGroup(group, event) {
        console.log(group.name);
        this.props.navigation.navigate("GroupPage", {
            itemId: 86,
            group: group,
            loggedInUser: this.state.user
        });
    }

    createNewGroup(group, event) {
        this.props.navigation.navigate("CreateNewGroup", {
            itemId: 86,
            loggedInUser: this.state.user
        });
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
            this.state.groups.map((group, key)=> (<Button title={group.name} key={key} 
                onPress={(e) => this.navigateToGroup(group, e)}/>))
        }
        </Text>
        <Button title='Create New Group' onPress={(e) => this.createNewGroup(e)}/>
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