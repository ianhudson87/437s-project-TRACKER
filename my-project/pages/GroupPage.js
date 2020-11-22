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
import { Icon } from 'react-native-elements'
import { Title } from 'react-native-paper'
import { getObjectByID, getObjectsByIDs } from "../constants/api"
import GameThumbnail from "../components/GameThumbnail"
import UserThumbnail from '../components/UserThumbnail'

class GroupPage extends Component {
constructor(props) {
  super(props);
  this.state = { 
    groupID: this.props.route.params.groupID,
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

componentDidMount(){
  this.props.navigation.addListener('focus', ()=>{this.refreshInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
}

refreshInfo(){
  // refresh all the information about the group
  console.log('REFRESH')

  let newState = {}
  AsyncStorage.getItem('loggedInUserID').then((value)=>{
    // get the id of the logged in user
    newState.loggedInUserID = value // this.setState({loggedInUserID: value})
  }).then(()=>{console.log("data: group:", this.state.groupID, "user", this.state.loggedInUser)})



  // populate the usersInGroup list and gamesInGroup list
  getObjectByID({id: this.state.groupID, type: "group"}).then((response)=>{
    // get the group object
    if(response.object_exists){
      newState.group = response.object // this.setState({group: response.object})
      return response.object
    }
    else{
      return null
    }
  }).then((group)=>{
    console.log("GROUP:", group)

    // GET ALL THE USERS IN THE GROUP
    let user_ids_in_group = group.users
    getObjectsByIDs({ids: user_ids_in_group, type: "user"}).then((response) => {
      if(response.objects_exist){
        newState.usersInGroup = response.objects // this.setState({usersInGroup: response.objects})
      }
    })

    // GET ALL THE GAMES IN THE GROUP
    let game_ids_in_group = group.games
    getObjectsByIDs({ids: game_ids_in_group, type: "game"}).then((response) => {
      console.log("response", response)
      if(response.objects_exist){
        console.log("length", response.objects.length)
        response.objects
        newState.gamesInGroup = response.objects // this.setState({gamesInGroup: response.objects})
        console.log("set state for group page")
      }
      this.setState(newState)
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


  
render() {
    return (
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameContainer}>
            {this.state.group.name}
          </Text>
        </View>
        
        <View style={styles.usersContainer}>
          <Title>Players <Icon size={19} name="person-add" title='Add User' onPress={(e) => this.handleNewUser(e)}/></Title>
          <ScrollView>
            { this.state.usersInGroup.map((user, key)=> (<UserThumbnail key={user._id} user={user} navigation={this.props.navigation} />)) }
          </ScrollView>
        </View>
          
        <View style={styles.gamesContainer}>
          <Title>Games <Icon size={19} name="create" onPress={() => this.handleNewGame()} /></Title>
          <ScrollView>
            { console.log("GamesInGroup", this.state.gamesInGroup)}
            { this.state.gamesInGroup.reverse().map((game, key)=> (<GameThumbnail key={game._id} game={game} navigation={this.props.navigation}/>)) }
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    fontWeight: "bold",
  },
  usersContainer: {
    flex: 3,
  },
  gamesContainer: {
    flex: 3,
  },
  container: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginTop: 20
  }
})

export default GroupPage;