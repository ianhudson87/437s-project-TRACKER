import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getObjectByID } from "../constants/api"

class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {groups: [], loggedInUser: this.props.route.params.user}
        this.navigateToGroup = this.navigateToGroup.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
    }

    componentDidMount(){
      console.log("USERUSER:", this.state.loggedInUser)
      // FIX THIS
        const groupIDs = this.state.loggedInUser.groups;
        console.log('IDS', groupIDs)
        let groups_list = []
        
        // get information about groups based on id
        // used for displaying groups that user is in
        for(let i=0; i<groupIDs.length; i++){
          // get info about group by id
          getObjectByID({id: groupIDs[i], type: "group"}).then((data)=>{
            console.log("data", data)
            if(data.object_exists){
              // console.log("GROUP", data.group[0])
              groups_list.push(data.object)
            }
            this.setState({groups: groups_list})
            // console.log(this.state.groups[0])
          })

        }
    }

    navigateToGroup(group, event) {
        console.log(group.name);
        this.props.navigation.navigate("GroupPage", {
            itemId: 86,
            group: group,
            loggedInUser: this.state.loggedInUser
        });
    }

    createNewGroup(group, event) {
        this.props.navigation.navigate("CreateNewGroup", {
            loggedInUser: this.state.loggedInUser
        });
    }

    joinGroup(group, event) {
      this.props.navigation.navigate("JoinGroup", {
          loggedInUser: this.state.loggedInUser
      });
  }
  
render() {
    return (
      <View style={styles.container}>
        <Text>
          User Home Page
        </Text>
        <Text>
            Logged in user: {this.state.loggedInUser.name}

        </Text>
        <Text>
            Groups:
        </Text>
        <Text>
          Groups that user is in:
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