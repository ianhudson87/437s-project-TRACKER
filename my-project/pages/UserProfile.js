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

class UserProfile extends Component {
constructor(props) {
  super(props);
  this.state = { 
    userID: this.props.route.params.userID,
    user: {name: "default"}, // contains user "object". get this from api
    loggedInUserID: null, // contains userID. get this from local storage
    userGroups: [], // contains list of group objects
    userGames: [], // contains list of game objects
  }

  this.refreshInfo = this.refreshInfo.bind(this);
}

refreshInfo(){
  // refresh all the information about the group
  console.log('REFRESH')
  console.log('DDDDDDDDDDDDDD')

  // populate the usersInGroup list
  getObjectByID({id: this.state.userID, type: "user"}).then((response)=>{
    // get the group object
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
        console.log("RESPONSE", response)
        if(response.object_exists){
          console.log("RESPONSE OBJECT", response.object)
          games_info_list.push(response.object)
        }
        this.setState({userGames: games_info_list})
        console.log("userGames", this.state.userGames)
      })
    })
  })
}

componentDidMount(){
  this.props.navigation.addListener('focus', ()=>{this.refreshInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
}
  
render() {
    return (
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameContainer}>
            {this.state.user.name}
          </Text>
        </View>
        
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
  }
})

export default UserProfile;