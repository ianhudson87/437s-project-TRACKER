import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getObjectByID, getObjectsByIDs } from "../constants/api"
import LogoutButton from "../components/LogoutButton"
import GroupThumbnail from '../components/GroupThumbnail'

class UserHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
          groups: [],
          loggedInUserID: null,
          loggedInUser: {name: "default"},
          friends: [],
        };
        this.navigateToGroup = this.navigateToGroup.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
        this.refreshUserInfo = this.refreshUserInfo.bind(this);
        this.processUserInfo = this.processUserInfo.bind(this);
        this.populateFriendsAndGroupsArrays = this.populateFriendsAndGroupsArrays.bind(this);
    }

    componentDidMount(){
      // this.refreshUserInfo()
      this.props.navigation.addListener('focus', ()=>{this.refreshUserInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
    }

    populateFriendsAndGroupsArrays(groupIDs, friendIDs){
      console.log("groupIDS", groupIDs);
      // POPULATE GROUPS LIST WITH GROUP OBJECTS
      // get information about groups based on id. used for displaying groups that user is in
      getObjectsByIDs({ids: groupIDs, type: "group"}).then((data)=>{
        console.log(data.objects)
        if(data.objects_exist){
          this.setState({groups: data.objects})
        }
      })

      // POPULATE FRIENDS LIST WITH FRIEND OBJECTS
      // get information about friends based on id. used for displaying activity feed
      getObjectsByIDs({ids: friendIDs, type: "user"}).then((data)=>{
        console.log(data.objects)
        if(data.objects_exist){
          this.setState({friends: data.objects})
        }
      })
    }

    processUserInfo(userInfo){
      // given user object of the logged in user, update the info of the page
      if(userInfo.object_exists){
        // if user exists
        let user = userInfo.object
        this.setState({loggedInUser: user}) // update loggedInUser

        let groupIDs = user.groups; // ids of groups that user is in
        let friendIDs = user.friends;
        this.populateFriendsAndGroupsArrays(groupIDs, friendIDs)
      }
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
          return response
        }).then((response)=>{
          this.processUserInfo(response)
        })
      })
    }

    navigateToGroup(group, event) {
        console.log(group.name);
        this.props.navigation.navigate("GroupPage", {
            group: group,
            loggedInUser: this.state.loggedInUser
        });
    }

    createNewGroup(event) {
        this.props.navigation.navigate("CreateNewGroup", {
            loggedInUser: this.state.loggedInUser
        });
    }

    joinGroup(event) {
      this.props.navigation.navigate("JoinGroup", {
          loggedInUser: this.state.loggedInUser
      });
  }
  
render() {
  const navigation = this.props.navigation;
  const loggedInUser = this.state.loggedInUser;
    return (
      <View style={styles.container}>
        <View style={styles.welcomeMessage}>
          <Text>
            Welcome, {this.state.loggedInUser.name}!
          </Text>
        </View>
        <Text>
          My Groups:
          { this.state.groups.map((group, key)=> (<GroupThumbnail group={group} key={key} navigation={this.props.navigation}/>)) }
          My Friends:
          {
              this.state.friends.map((friend, key) => (
                <Button title={friend.name} key={key} onPress={(e) => this.navigateTo}/>
              ))
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
  },
  welcomeMessage: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  }
})

export default UserHome;