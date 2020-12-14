import React, { Component, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { StyleSheet, TouchableOpacity, Text, Button, View } from 'react-native'
import { Card, ListItem, Icon, Divider } from 'react-native-elements'
import { getObjectByID, getObjectsByIDs } from "../constants/api"
import { Title } from 'react-native-paper';
import LogoutButton from "../components/LogoutButton"
import GroupThumbnail from '../components/GroupThumbnail'
import UserThumbnail from '../components/UserThumbnail'
import FeedObject from '../components/FeedObject'
import { ScrollView } from 'react-native-gesture-handler'

class Groups extends Component {

  constructor(props) {
      super(props);
      this.state = {
        groups: [], // group objects
        loggedInUserID: null,
        loggedInUser: {name: "default"}, // user object
        friends: [], // user objects
        feed: [] // feed objects {time: 78912, type: 1, data: [object]}
      };
      this.refreshUserInfo = this.refreshUserInfo.bind(this);
      this.processUserInfo = this.processUserInfo.bind(this);
      this.populateFriendsAndGroupsArrays = this.populateFriendsAndGroupsArrays.bind(this);
      this.generateFeed = this.generateFeed.bind(this);
  }

  componentDidMount(){
    this.props.navigation.addListener('focus', ()=>{this.refreshUserInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
    
    // if user is first time user (came from register page, automatically open up the drawer since it isn't very intuitive)
    if(this.props.firstTimeUser){
      console.log('first time user')
      this.props.navigation.openDrawer();
    }

    //useEffect(() => {
    this.props.navigation.setOptions({ title: 'Your Groups' })
    //});
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
      await this.generateFeed(); // update the feed
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

  async generateFeed(){
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
          type: 0, // "user joined group" event
          data: {group_id: group_id, user: user},
          time_obj: (time_joined_group!=undefined) ? new Date( time_joined_group ) : new Date(0) // used for sorting below
        });
      })
    })

    // get all "friend won/lost game" events
    for (const friend of this.state.friends) {
      // go through all friends
      let response = await getObjectsByIDs({ids: friend.games, type: 'game'}) // get all games friend is in
      if(response.objects_exist){
        let games_friend_is_in = response.objects
        for(const game of games_friend_is_in){
          // for each game friend is in
          console.log("here")
          if(game.game_ended){
            // if game has ended
            newFeed.push({
              time_obj: (game.updatedAt!=undefined) ? new Date( game.updatedAt.substring(0, game.updatedAt.length-5) + "Z" ) : new Date(0), // used for sorting below
              type: 1, // "friend completed game" event
              data: {game: game, friend: friend}
            })
            
          }
        }
      }

    }

    // order newFeed by date
    console.log(newFeed)
    this.setState({ feed: newFeed.sort((a,b)=>{return (a.time_obj.getTime() < b.time_obj.getTime()) ? 1 : -1}) })

  }

  
render() {
  
  //this.props.navigation.setOptions({ title: 'Welcome, ' + this.state.loggedInUser.name })
  console.log("NAVIGATION", this.props.navigation)
  const navigation = this.props.navigation;
  const loggedInUser = this.state.loggedInUser;
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <View style= {{ flex: 1 }}/>
          <View style={{ flex: 1, paddingHorizontal: 5 }}>
            <Button title="Create" onPress={() => this.props.navigation.navigate("CreateNewGroup")}/>
          </View>
          <View style={{ flex: 1, paddingHorizontal: 5 }}>
            <Button title="Join" onPress={() => this.props.navigation.navigate("JoinGroup")}/>
          </View>
          <View style= {{ flex: 1 }}/>
        </View>
        <View style={styles.groupsContainer}>
          <ScrollView pagingEnabled>
            { this.state.groups.map((group, key)=> (<GroupThumbnail group={group} key={group._id} navigation={this.props.navigation}/>)) }
          </ScrollView>
          
        </View>


      </View>
    )
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    // alignItems: 'center',
  },
  groupsContainer: {
    flex:1,
    paddingBottom: 10,
    alignItems: 'center'
  },
  // friendsContainer: {
  //   flex:1,
  //   padding: 1,
  // },
  feedContainer: {
    flex: 3,
    padding: 3,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 1,
    marginBottom: 1
  },
  // welcomeMessage: {
  //   borderColor: 'black',
  //   borderStyle: 'solid',
  //   borderWidth: 1,
  // },
  feedObjectContainer: {
    padding: 1,
  }
})

export default Groups;