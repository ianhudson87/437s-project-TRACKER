// Page for displaying game
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ScrollView
} from 'react-native'
import { getObjectByID, changeScore } from '../constants/api'

class Game extends Component {
  // need to have the game object passed as a prop

  constructor(props) {
    super(props);
    // info about the group, scores, and users for the game
    this.state = {
      game: this.props.route.params.game, // stores game object that we want to display
      users: [{name: "asdjf"}] // stores user objects of users in the game (because the game object only stores user ids)
    }
    
    this.populateUsersArray = this.populateUsersArray.bind(this)
    this.handleIncrement = this.handleIncrement.bind(this)
  }

  componentDidMount(){
    this.populateUsersArray()
    console.log("data: game:", this.state.game)
  }

  populateUsersArray(){
    // populate the this.state.users array
    let user_object_list = []
    this.state.game.users.forEach((user_id) => {
      getObjectByID({id: user_id, type: 'user'}).then((response) => {
        if(response.object_exists){
          user_object_list.push(response.object)
        }
  
        user_object_list.sort((a,b)=>{console.log('here'); return (a._id > b._id) ? 1 : -1})
        this.setState({users: user_object_list})
        console.log("user_object_list", this.state.users)
      })
    })
  }

  handleIncrement(game_id, user_id){
    console.log("INCREMENT SCORE: game_id:", game_id, "user_id", user_id)
    // send api request to increment score of user with the id, for a specific game_id
    let scoreData = {
      // info about how to change the score
      game_id: game_id,
      user_id: user_id,
      type: "delta",
      amount: 1
    }
    changeScore(scoreData).then((response)=>{
      console.log("CHANGE SCORE RESPONSE", response)
      if(response.game_updated){
        // game is updated on server. display updated game
        this.setState({game: response.updated_game})
        this.populateUsersArray() // update the list of user just in case
      }
      else{
        // game failed to update
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.nameContainer}>
          Game: {this.state.game.name}
        </Text>

      <View style={styles.usersContainer}>
        <Text>Players:</Text>
        <ScrollView style={styles.usersListContainer}>
        {this.state.users.map((user, key)=> (<Text key={key}> { user.name } { this.state.game.scores[key] } </Text>))}
        </ScrollView>
      </View>


  
        <Text>
          Add scores:
          { this.state.users.map((user, key) => (<Button key={key} title={'Increment ' + user.name + "'s score"} onPress={ () => {this.handleIncrement(this.state.game._id, user._id)} }/>))}
        </Text>

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
  },
  text: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 2,
  },
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
})

export default Game;