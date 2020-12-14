import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
  ScrollView,
} from 'react-native'
import { Title } from 'react-native-paper'
import { Overlay, Icon } from 'react-native-elements'
import { getObjectByID, addFriend, checkFriends, getObjectsByIDs } from "../constants/api"
import GameThumbnail from "../components/GameThumbnail"
import UserThumbnail from "../components/UserThumbnail"
import GroupThumbnail from '../components/GroupThumbnail'
import LogoutButton from "../components/LogoutButton"

class UserProfile extends Component {

constructor(props) {
  super(props);
  this.state = { 
    profileUserID: this.props.route.params.profileUserID,
    user: {name: "default"}, // contains user "object". get this from api
    loggedInUserID: null, // contains userID. get this from local storage
    userGroups: [], // contains list of group objects
    userGames: [], // contains list of game objects
    isFriend: null, // friend status of logged in user and user whose profile is displayed
    friends: [], // contains list of user objects that are friends of the user
    stats_overlay_visible: false, // visibility of overlay
    friends_overlay_visible: false // visibility of overlay
  }

  this.handleFriend = this.handleFriend.bind(this);
  this.refreshInfo = this.refreshInfo.bind(this);
  this.populateFriendsArrays = this.populateFriendsArrays.bind(this);
  this.friendDisplayHandler = this.friendDisplayHandler.bind(this);
  this.toggleStatsOverlay = this.toggleStatsOverlay.bind(this);
  this.toggleFriendsOverlay = this.toggleFriendsOverlay.bind(this);
  this.getLogout = this.getLogout.bind(this)
}

populateFriendsArrays(friendIDs){
  // POPULATE FRIENDS LIST WITH USER OBJECTS
  // get information about friends based on id. used for displaying activity feed
  getObjectsByIDs({ids: friendIDs, type: "user"}).then((data)=>{
    console.log(data.objects)
    if(data.objects_exist){
      this.setState({friends: data.objects})
    }
  })
}

async refreshInfo(){
  // refresh all the information for the profile

  AsyncStorage.getItem('loggedInUserID').then((value)=>{
    // get the id of the logged in user
    this.setState({loggedInUserID: value})
  }).then(()=> {
    checkFriends({user1_id: this.state.loggedInUserID, user2_id: this.state.profileUserID}).then((response)=>{
        if(response.friends == true){
            this.setState({isFriend: true});
        }
        else{
          this.setState({isFriend: false})
        }
    })
  })

 
  let response = await getObjectByID({id: this.state.profileUserID, type: "user"})
  let user
  if(response.object_exists){
    this.setState({user: response.object})
    this.populateFriendsArrays(response.object.friends)
    user = response.object
  }
  else{
    user = null
  }
  console.log("USER:", user)

  let groups_info_list = []
  let group_ids_for_user = user.groups
  response = await getObjectsByIDs({ ids: group_ids_for_user, type:"group"})
  if(!response.error){
    if(response.objects_exist){
      groups_info_list = response.objects
      this.setState({ userGroups: groups_info_list })
    }
  }
  // group_ids_for_user.forEach((group_id) => {
  //   // push user info into list
  //   getObjectByID({id: group_id, type: "group"}).then((response)=>{
  //     if(response.object_exists){
  //       groups_info_list.push(response.object)
  //     }
  //     this.setState({userGroups: groups_info_list})
  //     console.log(this.state.userGroups)
  //   })
  // })

  let games_info_list = []
  let game_ids_for_user = user.games
  response = await getObjectsByIDs({ ids: game_ids_for_user, type:"game"})
  if(!response.error){
    if(response.objects_exist){
      games_info_list = response.objects
      this.setState({ userGames: games_info_list })
    }
  }
  // game_ids_for_user.forEach((game_id) => {
  //   // push game info into list
  //   getObjectByID({id: game_id, type: "game"}).then((response)=>{
  //     if(response.object_exists){
  //       games_info_list.push(response.object)
  //     }
  //     this.setState({userGames: games_info_list})
  //   })
  // })
}

componentDidMount(){
  this.props.navigation.addListener('focus', async ()=>{this.refreshInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
  this.props.navigation.addListener('blur', ()=>{
    this.setState({stats_overlay_visible: false, friends_overlay_visible: false})
  })
}

handleFriend(){
    console.log("FRIEND")
    console.log(this.state.loggedInUserID)
    console.log(this.state.profileUserID)

    addFriend({user_friending_id: this.state.loggedInUserID, user_being_friended_id: this.state.profileUserID})
        .then((response)=> {
            console.log("HHHHHHHHH")
            console.log(response)
            if(response.friend_added == true){
                console.log("Friend added")
                this.refreshInfo()
            }
            else{
                console.log("Friend not added")
            }
        })
}

friendDisplayHandler(isFriend, isCurrentUser){
  if(isCurrentUser){
    // looking at own profile
    return(
       
            <Text> (You) </Text>
          
    )
  }
  else if(isFriend === true){
    // looking at profile of friend
    return <Text> (Friended) </Text>
  }
  else if(isFriend === false){
    // looking at profile of stranger
    return <Button title='Add friend' onPress={() => this.handleFriend()} />
  }
  else{
    // waiting for verdict
    return <Text>Loading...</Text>
  }
}

getTitle(){
  return(
    <View style={styles.nameContainer}>
        <Text style={styles.nameContainer}>
          {this.state.user.name}
          {this.friendDisplayHandler(this.state.isFriend, this.state.profileUserID==this.state.loggedInUserID)}
          <Icon reverse size={15} name="chart-areaspline" type="material-community" onPress={this.toggleStatsOverlay} />
          <Icon reverse size={15} name="baby-face-outline" type="material-community" onPress={this.toggleFriendsOverlay} />
        </Text>
    </View>
  )
}

getLogout(){
  let logoutButton = null
  if(this.props.route.params.parentNavigation){
    // if coming from CurrentProfile.js
    logoutButton = <LogoutButton navigation={this.props.route.params.parentNavigation}/>
  }
  return(
    logoutButton
  )
}

toggleStatsOverlay(){
  this.refreshInfo()
  this.setState({ stats_overlay_visible: !this.state.stats_overlay_visible })
}

toggleFriendsOverlay(){
  this.refreshInfo()
  this.setState({ friends_overlay_visible: !this.state.friends_overlay_visible })
}
  
render() {
  this.props.navigation.setOptions({ headerTitle: this.getTitle(), headerRight: this.getLogout })
  console.log("state", this.state.user)
  let stats = this.state.user.stats || {}
  return (
    <View style={styles.container} onPress={ ()=>{alert("asdf")}} >
      
      <View style={styles.groupsContainer}>
        <Title> Group</Title>
        <ScrollView pagingEnabled style={styles.usersListContainer}>
          {this.state.userGroups.map((group, key)=> (<GroupThumbnail group={group} key={group._id} navigation={this.props.navigation}>{group.name}</GroupThumbnail>))}
          {/* {this.state.userGroups.map((group, key)=> (<Text key={group._id}>{group.name}</Text>))} */}
        </ScrollView>
      </View>

      <Overlay isVisible={ this.state.friends_overlay_visible } onBackdropPress={ this.toggleFriendsOverlay }>
        <View style={styles.friendsContainer} >
          <Title> Friends </Title>
          <ScrollView pagingEnabled >
            { this.state.friends.map((user, key)=> (
              <UserThumbnail user={user} key={user._id} navigation={this.props.navigation}/>
            )) }
          </ScrollView>

        </View>
      </Overlay>
        
      <View style={styles.gamesContainer}>
        <Text>{this.state.user.name}'s Games:</Text>
        <ScrollView pagingEnabled>
          { this.state.userGames.map((game, key)=> (<GameThumbnail key={game._id} game={game} type={'standard'} navigation={this.props.navigation}/>)) }
        </ScrollView>
      </View>

      <View style={styles.overlay}>
        <Overlay isVisible={ this.state.stats_overlay_visible } onBackdropPress={ this.toggleStatsOverlay }>
          <View>
            <Text> Total games: { stats.total_num_of_games } (completed: { stats.num_finished_games })</Text>
            <Text> Average Score: { stats.avg_score_over_all_games } </Text>
            <Text> Wins: { stats.total_num_of_wins }</Text>
            <Text> Win percentage: { Math.round(stats.total_num_of_wins / stats.num_finished_games * 100) }%</Text>
            <Text> Average percentage of points out of max: { Math.round(stats.avg_fraction_of_max_points_over_all_games * 100) }%</Text>
          </View>
        </Overlay>
      </View>
    </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameContainer: {
    flex: 1,
  },
  groupsContainer: {
    flex: 3,
  },
  friendsContainer: {
    flex: 3,
  },
  gamesContainer: {
    flex: 3,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginTop: 20
  },
  friendMessage: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  }
})

export default UserProfile;