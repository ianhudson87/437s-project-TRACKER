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
import { getObjectByID } from "../constants/api"
import GameThumbnail from "../components/GameThumbnail"

class GroupPage extends Component {
constructor(props) {
  super(props);
  this.state = { 
    groupID: this.props.route.params.group._id,
    group: {name: "default"}, // contains group "object". get this from api
    loggedInUserID: null, // contains userID. get this from local storage
    usersInGroup: [], // contains list of user objects
    gamesInGroup: [], // contains list of game objects
    tournamentsInGroup: [], // contains list of tournament objects
  }

  this.handleNewUser = this.handleNewUser.bind(this);
  this.handleNewGame = this.handleNewGame.bind(this);
  this.refreshInfo = this.refreshInfo.bind(this);
}

refreshInfo(){
  // refresh all the information about the group
  console.log('REFRESH')
  AsyncStorage.getItem('loggedInUserID').then((value)=>{
    // get the id of the logged in user
    this.setState({loggedInUserID: value})
  }).then(()=>{console.log("data: group:", this.state.groupID, "user", this.state.loggedInUser)})

  // populate the usersInGroup list
  getObjectByID({id: this.state.groupID, type: "group"}).then((response)=>{
    // get the group object
    if(response.object_exists){
      this.setState({group: response.object})
      return response.object
    }
    else{
      return null
    }
  }).then((group)=>{
    console.log("GROUP:", group)

    let users_info_list = []
    let user_ids_in_group = group.users
    user_ids_in_group.forEach((user_id) => {
      // push user info into list
      getObjectByID({id: user_id, type: "user"}).then((response)=>{
        if(response.object_exists){
          users_info_list.push(response.object)
        }
        this.setState({usersInGroup: users_info_list})
        console.log(this.state.usersInGroup)
        console.log("gamesInGroup", this.state.gamesInGroup)
      })
    })

    let games_info_list = []
    let game_ids_in_group = group.games
    game_ids_in_group.forEach((game_id) => {
      // push game info into list
      getObjectByID({id: game_id, type: "game"}).then((response)=>{
        console.log("RESPONSE", response)
        if(response.object_exists){
          console.log("RESPONSE OBJECT", response.object)
          games_info_list.push(response.object)
        }
        this.setState({gamesInGroup: games_info_list})
        console.log(this.state.gamesInGroup)
        console.log("gamesInGroup", this.state.gamesInGroup)
      })
    })

    let tournaments_info_list = []
    let tournament_ids_in_group = group.tournaments
    tournament_ids_in_group.forEach((tournament_id) => {
      // push game info into list
      getObjectByID({id: tournament_id, type: "tournament"}).then((response)=>{
        console.log("RESPONSE", response)
        if(response.object_exists){
          console.log("RESPONSE OBJECT", response.object)
          tournaments_info_list.push(response.object)
        }
        this.setState({tournamentsInGroup: tournaments_info_list})
        console.log(this.state.tournamentsInGroup)
        console.log("tournamentsInGroup", this.state.tournamentsInGroup)
      })
    })
  })
}

componentDidMount(){
  this.props.navigation.addListener('focus', ()=>{this.refreshInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
}

handleNewUser(){
    this.props.navigation.navigate("AddUserToGroup", {
        group: this.state.group,
        navigation: this.props.navigation,
        loggedInUser: this.state.loggedInUser
    });
}

// function for handling "create new game" button click
handleNewGame(){
  // redirect to create new game page
  // need to pass group and user that clicked the button
  this.props.navigation.navigate("CreateNewGame", {
    group: this.state.group,
    loggedInUser: this.state.loggedInUser
  });
}

navigateToUserProfile(user, event) {
  console.log(user.name);
  this.props.navigation.navigate("UserProfile", {
      profileUserID: user._id
  });
}

  
render() {
    return (
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameContainer}>
            {this.state.group.name}
          </Text>
          <Button title='Add User' onPress={(e) => this.handleNewUser(e)}/>
        </View>
        
        <View style={styles.usersContainer}>
          <Text>Players:</Text>
          <ScrollView style={styles.usersListContainer}>
            {this.state.usersInGroup.map((user, key)=> (<Button title={user.name} key={key} 
                  onPress={(e) => this.navigateToUserProfile(user, e)}/>))}
          </ScrollView>
        </View>
          
        <View style={styles.gamesContainer}>
          <Text>Games in the group:</Text>
          <ScrollView style={styles.gamesListContainer}>
            { this.state.gamesInGroup.map((game, key)=> (<GameThumbnail key={key} game={game} type="standard" navigation={this.props.navigation}/>)) }
          </ScrollView>
        </View>
        
        <View style={styles.gamesContainer}>
          <Text>Tournaments in the group:</Text>
            <ScrollView style={styles.gamesListContainer}>
              { this.state.tournamentsInGroup.map((tournament, key)=> (<GameThumbnail key={key} game={tournament} type="tournament" navigation={this.props.navigation}/>)) }
            </ScrollView>
        </View>

        <Button title='Create new game' onPress={() => this.handleNewGame()} />
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
  nameContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
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
    width: "120%"
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
  }
})

export default GroupPage;