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
  }

  this.handleNewUser = this.handleNewUser.bind(this);
  this.handleNewGame = this.handleNewGame.bind(this);
  this.refreshInfo = this.refreshInfo.bind(this);
}

refreshInfo(){
  console.log('REFRESH')
  AsyncStorage.getItem('loggedInUserID').then((value)=>{
    // get the id of the logged in user
    alert(value)
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
  })
}

componentDidMount(){
  this.props.navigation.addListener('focus', ()=>{this.refreshInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
}

handleNewUser(){
    this.props.navigation.navigate("AddUserToGroup", {
        itemId: 86,
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
        <View>
          <Text>
            Group Page
          </Text>
          <Text>
            Group NAME: {this.state.group.name}
          </Text>
          <Button title='Add User' onPress={(e) => this.handleNewUser(e)}/>
        </View>
        
        <View style={styles.usersContainer}>
          <Text>Users in the groups:</Text>
          <ScrollView style={styles.scrollView}>
            {this.state.usersInGroup.map((user, key)=> (<Text key={key}>{user.name}</Text>))}
          </ScrollView>
        </View>
          
        <View style={styles.gamesContainer}>
          <Text>Games in the group:</Text>
          <ScrollView style={styles.scrollView}>
            { this.state.gamesInGroup.map((game, key)=> (<GameThumbnail key={key} game={game} navigation={this.props.navigation}/>)) }
          </ScrollView>
          <Button title='Create new game' onPress={() => this.handleNewGame()} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    marginHorizontal: 0,
  },
  usersContainer: {
    width: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamesContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 10
  }
})

export default GroupPage;