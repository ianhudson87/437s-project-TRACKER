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
import { getObjectByID, addFriend, checkFriends } from "../constants/api"
import GameThumbnail from "../components/GameThumbnail"

class UserProfile extends Component {
constructor(props) {
  super(props);
  this.state = { 
    profileUserID: this.props.route.params.profileUserID,
    user: {name: "default"}, // contains user "object". get this from api
    loggedInUserID: null, // contains userID. get this from local storage
    userGroups: [], // contains list of group objects
    userGames: [], // contains list of game objects
    isFriend: false, // friend status of logged in user and user whose profile is displayed
  }

  this.handleFriend = this.handleFriend.bind(this);
  this.refreshInfo = this.refreshInfo.bind(this);
}

refreshInfo(){
  // refresh all the information for the profile

//   AsyncStorage.getItem('loggedInUserID').then((value)=>{
//     // get the id of the logged in user
//     this.setState({loggedInUserID: value})
//   }).then(()=>{console.log("user", this.state.loggedInUser)})



  AsyncStorage.getItem('loggedInUserID').then((value)=>{
    // get the id of the logged in user
    this.setState({loggedInUserID: value})
  }).then(()=> {
    checkFriends({user1_id: this.state.loggedInUserID, user2_id: this.state.profileUserID}).then((response)=>{
        if(response.friends == true){
            this.setState({isFriend: true});
        }
    })
  })

 
  getObjectByID({id: this.state.profileUserID, type: "user"}).then((response)=>{
    if(response.object_exists){
      this.setState({user: response.object})
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
  
render() {
    if(this.state.isFriend==false){
    return (
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameContainer}>
            {this.state.user.name}
          </Text>
        </View>

        <Button title='Add friend' onPress={() => this.handleFriend()} />
        
        <View style={styles.usersContainer}>
          <Text>{this.state.user.name}'s Groups:</Text>
          <ScrollView style={styles.usersListContainer}>
            {this.state.userGroups.map((group, key)=> (<Text key={key}>{group.name}</Text>))}
          </ScrollView>
        </View>
          
        <View style={styles.gamesContainer}>
          <Text>{this.state.user.name}'s Games:</Text>
          <ScrollView style={styles.gamesListContainer}>
            { this.state.userGames.map((game, key)=> (<GameThumbnail key={key} game={game} navigation={this.props.navigation}/>)) }
          </ScrollView>
        </View>
      </View>
    )
    }
    else{
        return (
            <View style={styles.container}>
              <View style={styles.nameContainer}>
                <Text style={styles.nameContainer}>
                  {this.state.user.name}
                </Text>
              </View>
      
              <Text style={styles.friendMessage}>You are friends with {this.state.user.name}</Text>
              
              <View style={styles.usersContainer}>
                <Text>{this.state.user.name}'s Groups:</Text>
                <ScrollView style={styles.usersListContainer}>
                  {this.state.userGroups.map((group, key)=> (<Text key={key}>{group.name}</Text>))}
                </ScrollView>
              </View>
                
              <View style={styles.gamesContainer}>
                <Text>{this.state.user.name}'s Games:</Text>
                <ScrollView style={styles.gamesListContainer}>
                  { this.state.userGames.map((game, key)=> (<GameThumbnail key={key} game={game} navigation={this.props.navigation}/>)) }
                </ScrollView>
              </View>
            </View>
          )
    }
  }
}

const styles = StyleSheet.create({
  // scrollView: {
  //   flex: 1,
  //   backgroundColor: 'lightblue',
  //   marginHorizontal: 0,
  // },
  nameContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: "30px",
    fontWeight: "bold",
  },
  usersContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "20%",
  },
  usersListContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    marginHorizontal: 0,
    //height: "30%",
    width: "80%"
  },
  gamesContainer: {
    //flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    height: "20%",
  },
  gamesListContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    marginHorizontal: 0,
    height: "20%",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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