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
import UserThumbnail from '../components/UserThumbnail'
import FeedObject from '../components/FeedObject'
import { ScrollView } from 'react-native-gesture-handler'

class UserHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
          groups: [], // group objects
          loggedInUserID: null,
          loggedInUser: {name: "default"}, // user object
          friends: [], // user objects
          feed: [] // feed objects {time: 78912, type: 1, data: [object]}
        };
        this.createNewGroup = this.createNewGroup.bind(this);
        this.refreshUserInfo = this.refreshUserInfo.bind(this);
        this.processUserInfo = this.processUserInfo.bind(this);
        this.populateFriendsAndGroupsArrays = this.populateFriendsAndGroupsArrays.bind(this);
        this.generateFeed = this.generateFeed.bind(this);
    }

    componentDidMount(){
      // this.refreshUserInfo()
      this.props.navigation.addListener('focus', ()=>{this.refreshUserInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
    }

    refreshUserInfo(){
      // refreshes the entire page
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
          return this.processUserInfo(response)
        })
      })
    }

    async processUserInfo(userInfo){
      // given user object of the logged in user, update the info of the page
      if(userInfo.object_exists){
        // if user exists
        let user = userInfo.object
        this.setState({loggedInUser: user}) // update loggedInUser

        let groupIDs = user.groups; // ids of groups that user is in
        let friendIDs = user.friends;
        await this.populateFriendsAndGroupsArrays(groupIDs, friendIDs)
        this.generateFeed(); // update the feed
      }
    }

    async populateFriendsAndGroupsArrays(groupIDs, friendIDs){
      console.log("groupIDS", groupIDs);
      // POPULATE GROUPS LIST WITH GROUP OBJECTS
      // get information about groups based on id. used for displaying groups that user is in
      await getObjectsByIDs({ids: groupIDs, type: "group"}).then((data)=>{
        console.log(data.objects)
        if(data.objects_exist){
          this.setState({groups: data.objects})
        }
      })

      // POPULATE FRIENDS LIST WITH FRIEND OBJECTS
      // get information about friends based on id. used for displaying activity feed
      await getObjectsByIDs({ids: friendIDs, type: "user"}).then((data)=>{
        console.log(data.objects)
        if(data.objects_exist){
          this.setState({friends: data.objects})
        }
      })
    }

    generateFeed(){
      // with the info currently stored, create a feed of the latest things that have happened

      let newFeed = []
      // get all "user joined group" events
      this.state.friends.forEach((user)=>{
        // for each user
        user.groups.forEach((group_id, index) => {
          // get each group_id they are in and what time they joined the group at
          let time_joined_group = user.group_time_joined[index]
          // create new feed object and push it to this.state.feed
          newFeed.push({
            time: time_joined_group,
            type: 0, // "user joined group" event
            data: {group_id: group_id, user: user}
          });
        })
      })

      // order newFeed by date
      this.setState({ feed: newFeed })

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
  let orderedFeed = this.state.feed.sort((a,b)=>{console.log('here'); return (a._id > b._id) ? 1 : -1})

  const navigation = this.props.navigation;
  const loggedInUser = this.state.loggedInUser;
    return (
      <View style={styles.container}>
        <View style={styles.welcomeMessage}>
          <Text>
            Welcome, {this.state.loggedInUser.name}!
          </Text>
        </View>

        <View style={styles.groupsContainer}>
          <Text>My Groups:</Text>
          { this.state.groups.map((group, key)=> (<GroupThumbnail group={group} key={key} navigation={this.props.navigation}/>)) }
        </View>

        <View style={styles.friendsContainer}>
          <Text>My Friends:</Text>
          { this.state.friends.map((user, key)=> (<UserThumbnail user={user} key={key} navigation={this.props.navigation}/>)) }
        </View>

        <View style={styles.feedContainer}>
          <Text>My Feed:</Text>
          <ScrollView>
            { orderedFeed.map((feed, key)=> (
                <View key={key} style={styles.feedObjectContainer}>
                  <FeedObject feed={feed} key={key} navigation={this.props.navigation}/>
                </View>
              ))
            }
          </ScrollView>
        </View>

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
  groupsContainer: {
    flex:1,
  },
  friendsContainer: {
    flex:1,
    padding: 2,
  },
  feedContainer: {
    flex: 1,
    borderWidth: 2,
    padding: 2,
    backgroundColor: 'green',
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
  },
  feedObjectContainer: {
    padding: 2,
  }
})

export default UserHome;