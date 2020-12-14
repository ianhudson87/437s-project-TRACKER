import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getObjectByID, getObjectsByIDs, acceptGame, createGame } from '../constants/api'
import { Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'

class GameRequest extends Component {
  constructor(props) {
      super(props);
      this.state = {
          group_name: "loading...",
          users_names: ['loading...'],
          users_accepted_names: ['loading...']
      }
      this.loggedInUserID = this.props.loggedInUserID

      // We populate these things in getInfo, then use them to populate the state variables
      this.group // group object
      this.users = [] // object of all users
      this.users_accepted = [] // object of all users that have accepted

      // INFO FROM THE PENDING GAME
      this.pending_game = this.props.pending_game
      this.game_name = this.props.pending_game.name
      this.users_ids = this.props.pending_game.users
      this.group_id = this.props.pending_game.group
      this.users_accepted_ids = this.props.pending_game.users_accepted
      this.game_type = this.props.pending_game.game_type
      this.goal_score = this.props.pending_game.goal_score

      this.refresh_parent = this.props.refresh_parent

      this.accept_game = this.accept_game.bind(this)
  }

  componentDidMount(){
    this.getInfo()
  }

  async getInfo(){
      console.log("hi", this.pending_game.name)
    // get info needed to display based off of instance variables and then display by putting stuff into state variables

    // get the group object
    let response = await getObjectByID({ id: this.group_id, type: "group" })
    if(!response.error && response.object_exists){
        this.group = response.object
    }

    // get the user objects
    response = await getObjectsByIDs({ ids: this.users_ids, type: "user" })
    if(!response.error && response.objects_exist){
        this.users = response.objects
    }

    // get the accepted user objects
    response = await getObjectsByIDs({ ids: this.users_accepted_ids, type: "user" })
    if(!response.error && response.objects_exist){
        this.users_accepted = response.objects
    }

    this.setState({
        group_name: this.group.name,
        users_names: this.users.map((user, key) => { 
          if(key != this.users.length - 1){
            return (user.name) 
          }
          else{
            return (user.name) 
          }
          
        }),
        users_accepted_names: this.users_accepted.map((user, key) => { 
          if(key != this.users_accepted.length - 1){
            return (user.name) 
          }
          else{
            return (user.name) 
          }
          
        }),
    })
  }

  async accept_game(){
    let response = await acceptGame(this.loggedInUserID, this.pending_game._id)
    if(response.error){
        alert("error: could not accept game")
    }
    else{
        alert("accepted game: "+ this.pending_game.name)
        console.log(this.pending_game)
        // update info of pending game
        this.pending_game = response.updated_pending_game
        this.game_name = response.updated_pending_game.name
        this.users_ids = response.updated_pending_game.users
        this.group_id = response.updated_pending_game.group
        this.users_accepted_ids = response.updated_pending_game.users_accepted
        this.game_type = response.updated_pending_game.game_type

        this.getInfo() // update the info of the game request

        if(response.all_users_have_accepted){
            // everyone has accepted the game. create the game
            createGame(false, this.game_name, this.users_ids, this.group_id, this.game_type, this.goal_score)
            
            // need to refresh the list of notifications on the parent component
            this.refresh_parent()
        }
    }
  }

  accept_button(){
    console.log("look here", this.users_accepted_ids, this.loggedInUserID)
    if(this.users_accepted_ids.includes(this.loggedInUserID)){
        // user has already accepted
        return(<View/>)
    }
    else{
        return(
            <Button title="accept" onPress={this.accept_game}/>
        )
    }
  }

render() {
  console.log("RENDER")
  console.log(this.state)
    return (
        <View style={styles.container}>
          <View style={{width: 500}}>
            <Card>
                <Card.Title> Pending game: {this.game_name} {this.accept_button()}</Card.Title>
                <Card.Divider />
                <Text>Group: {this.state.group_name}</Text>
                <Text>Type: {this.game_type}</Text>
                <Text>Goal Score: {this.goal_score}</Text>
                <Text>
                  Users:
                  {
                    this.state.users_names.map((name) => {
                      if(this.state.users_accepted_names.includes(name)){
                        return(<Text style={{color: 'green'}}> [{name}] </Text>)
                      }
                      else{
                        return(<Text style={{color: 'red'}}> [{name}] </Text>)
                      }
                    })
                  }
                </Text>
                {/* <Text>: {this.state.users_accepted_names}</Text> */}
            </Card>
          </View>
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

export default GameRequest;