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
import { getObjectByID, addFriend, checkFriends, getObjectsByIDs } from "../constants/api"
import GameThumbnail from "../components/GameThumbnail"
import UserThumbnail from "../components/UserThumbnail"
// import LogoutButton from "../components/LogoutButton"

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
  }

  this.handleFriend = this.handleFriend.bind(this);
  this.refreshInfo = this.refreshInfo.bind(this);
  this.populateFriendsArrays = this.populateFriendsArrays.bind(this);
  this.friendDisplayHandler = this.friendDisplayHandler.bind(this);
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

refreshInfo(){
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

 
  getObjectByID({id: this.state.profileUserID, type: "user"}).then((response)=>{
    if(response.object_exists){
      this.setState({user: response.object})
      this.populateFriendsArrays(response.object.friends)
      return response.object
    }
    else{
      return null
    }
  }).then((user)=>{
    console.log("USER:", user)

    let groups_info_list = []
    let group_ids_for_user = user.groups
    group_ids_for_user.forEach((group_id) => {
      // push user info into list
      getObjectByID({id: group_id, type: "group"}).then((response)=>{
        if(response.object_exists){
          groups_info_list.push(response.object)
        }
        this.setState({userGroups: groups_info_list})
        console.log(this.state.userGroups)
      })
    })

    let games_info_list = []
    let game_ids_for_user = user.games
    game_ids_for_user.forEach((game_id) => {
      // push game info into list
      getObjectByID({id: game_id, type: "game"}).then((response)=>{
        if(response.object_exists){
          games_info_list.push(response.object)
        }
        this.setState({userGames: games_info_list})
      })
    })
  })
}

componentDidMount(){
  this.props.navigation.addListener('focus', ()=>{this.refreshInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
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
      <View>
        <Text>THIS IS YOU!</Text>
        {/* <LogoutButton navigation={this.props.navigation} loggedInUser={this.state.loggedInUser}></LogoutButton> */}
      </View>
    )
  }
  else if(isFriend === true){
    // looking at profile of friend
    return <Text style={styles.friendMessage}>You are friends with {this.state.user.name}</Text>
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
  
render() {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.nameContainer}>
          {this.state.user.name}
          {this.friendDisplayHandler(this.state.isFriend, this.state.profileUserID==this.state.loggedInUserID)}
        </Text>
      </View>
      
      <View style={styles.groupsContainer}>
        <Text>{this.state.user.name}'s Groups:</Text>
        <ScrollView style={styles.usersListContainer}>
          {this.state.userGroups.map((group, key)=> (<Text key={key}>{group.name}</Text>))}
        </ScrollView>
      </View>

      <View style={styles.friendsContainer}>
        <Title> Friends </Title>
        <ScrollView>
          { this.state.friends.map((user, key)=> (
            <UserThumbnail user={user} key={key} navigation={this.props.navigation}/>
          )) }
        </ScrollView>

      </View>
        
      <View style={styles.gamesContainer}>
        <Text>{this.state.user.name}'s Games:</Text>
        <ScrollView>
          { this.state.userGames.map((game, key)=> (<GameThumbnail key={key} game={game} navigation={this.props.navigation}/>)) }
        </ScrollView>
      </View>
    </View>
  )
}
}

const styles = StyleSheet.create({
  // scrollView: {
  //   flex: 1,
  //   backgroundColor: 'lightblue',
  //   marginHorizontal: 0,
  // },
  container: {
    flex: 1,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    fontWeight: "bold",
  },
  groupsContainer: {
    flex: 1,
  },
  friendsContainer: {
    flex: 2,
  },
  gamesContainer: {
    flex: 2,
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