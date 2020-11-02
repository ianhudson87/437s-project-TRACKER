import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getObjectByID } from "../constants/api"
import LogoutButton from "../components/LogoutButton"

class UserHome extends Component {

    constructor(props) {
        super(props);
        this.state = {groups: [], loggedInUserID: null, loggedInUser: {name: "default"}};
        this.navigateToGroup = this.navigateToGroup.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
        this.refreshUserInfo = this.refreshUserInfo.bind(this);
    }

    componentDidMount(){
      // this.refreshUserInfo()
      this.props.navigation.addListener('focus', ()=>{this.refreshUserInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
    }

    refreshUserInfo(){
      console.log("REFRESH")
      // get loggedInUserID from "local storage"
      AsyncStorage.getItem('loggedInUserID').then((loggedInUserID)=>{
        console.log("USERID FROM STORAGE:", loggedInUserID)
        // update loggedInUserID in the state
        this.setState({loggedInUserID: loggedInUserID})
        return loggedInUserID
      }).then((loggedInUserID)=>{
        // get info about loggedInUserID
        getObjectByID({id: loggedInUserID, type: "user"}).then((response)=>{
          return response}).then((response)=>{

            if(response.object_exists){
              // if user exists
              let user = response.object
              this.setState({loggedInUser: user}) // update loggedInUser
  
              let groupIDs = user.groups; // ids of groups that user is in
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
                  groups_list.sort((a,b)=>{return (a._id < b._id) ? 1 : -1}) // keep order of groups
                  this.setState({groups: groups_list})
                  // console.log(this.state.groups[0])
                })
              }
            }
            
          })
      })


      console.log("USERUSER:", this.state.loggedInUser)
      // FIX THIS
        
    }

    navigateToGroup(group, event) {
        console.log(group.name);
        this.props.navigation.navigate("GroupPage", {
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
  const navigation = this.props.navigation;
  const loggedInUser = this.state.loggedInUser;
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

        <Button title='Join Group' onPress={(e) => this.joinGroup(e)}/>

        <LogoutButton navigation={navigation} loggedInUser={loggedInUser}></LogoutButton>
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