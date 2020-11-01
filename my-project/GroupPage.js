import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getObjectByID } from "./constants/api"

class GroupPage extends Component {
constructor(props) {
  super(props);
  this.state = { 
    group: this.props.route.params.group, // contains group "object"
    loggedInUser: this.props.route.params.loggedInUser, // contains user "oject"
    usersInGroup: [], // contains list of user objects
    gamesInGroup: [], // contains list of game objects
  }

  this.handleNewUser = this.handleNewUser.bind(this);
  this.handleNewGame = this.handleNewGame.bind(this);
}

componentDidMount(){
    console.log("data: group:", this.state.group, "user", this.state.loggedInUser)

    // populate the usersInGroup list
    let users_info_list = []
    let user_ids_in_group = this.state.group.users
    user_ids_in_group.forEach((user_id) => {
      // push user info into list
      getObjectByID({id: user_id, type: "user"}).then((response)=>{
        if(response.object_exists){
          users_info_list.push(response.object)
        }

        this.setState({usersInGroup: users_info_list})
        console.log(this.state.usersInGroup)
      })
      
    })

    // populate the gamesInGroup list
    let game_info_list = []
    let game_ids_in_group = this.state.group.games
    game_ids_in_group.forEach((game_id) => {
      // push game info into list
      getGameByID(game_id).then((response)=>{
        if(response.user_exists){
          users_info_list.push(response.user)
        }

        this.setState({usersInGroup: users_info_list})
        console.log(this.state.usersInGroup)
      })
      
    })
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
        <Text>
          Group Page
        </Text>
        <Text>
            Group NAME: {this.state.group.name}
        </Text>
        <Button title='Add User' onPress={(e) => this.handleNewUser(e)}/>
        <Text>
        Users in the group:
        {
            this.state.usersInGroup.map((user, key)=> (<Text key={key}>{user.name}</Text>))
        }
        </Text>
        <Button title='Create new game' onPress={() => this.handleNewGame()} />
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
  }
})

export default GroupPage;