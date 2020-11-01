import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getGroupByID } from "./constants/api"

class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {groups: [], user: this.props.route.params.user}
        this.navigateToGroup = this.navigateToGroup.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
    }

    componentDidMount(){
        const groupIDs = this.state.user.groups;
        console.log('IDS', groupIDs)
        let groups_list = []
        
        // get information about groups based on id
        // used for displaying groups that user is in
        for(let i=0; i<groupIDs.length; i++){
          // get info about group by id
          getObjectByID({'id': groupIDs[i]}).then((data)=>{
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