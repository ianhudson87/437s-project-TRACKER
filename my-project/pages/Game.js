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
import { getSocket } from '../constants/socketio'

class Game extends Component {
  // need to have the game object passed as a prop

  constructor(props) {
    super(props);
    // info about the group, scores, and users for the game
    this.state = {
      game: this.props.route.params.game, // stores game object that we want to display
      users: [], // stores user objects of users in the game (because the game object only stores user ids)
      user_scores: {} // contains key:value pairs of user_id:score
    }
    
    this.populateUsersArray = this.populateUsersArray.bind(this)
    this.handleIncrement = this.handleIncrement.bind(this)
  }

  componentDidMount(){
    this.populateUsersArray()
    console.log("data: game:", this.state.game)

    this.socket = getSocket()
    this.socket.emit('join_room', {
      // tell socket to put user into a room so that they can send/recieve updates to the game in real time
      game_id: this.state.game._id
    })

    this.socket.on('refresh_score', (data)=>{
      console.log('REFRESH SCORE')
      getObjectByID({id: this.state.game._id, type: 'game'}).then((response) => {
        console.log('REPSPONSE', response)
        if(response.object_exists){
          this.setState({ game: response.object })
          this.populateUsersArray() // updates the scores of the players in the display
        }
      })
    })
  }

  populateUsersArray(){
    // populate the this.state.users array. Set the scores of the players
    let user_object_list = []
    let user_scores_dict = {}
    this.state.game.users.forEach((user_id, index) => {
      getObjectByID({id: user_id, type: 'user'}).then((response) => {
        if(response.object_exists){
          user_object_list.push(response.object)
          user_scores_dict[response.object._id] = this.state.game.scores[index] // get score of user
        }
  
        user_object_list.sort((a,b)=>{console.log('here'); return (a._id > b._id) ? 1 : -1})
        this.setState({users: user_object_list, user_scores: user_scores_dict}) // update state of component
        console.log("user_object_list", this.state.users)
        console.log("user_scores_dict", this.state.user_scores)
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
        this.socket.emit('changed_score', {
          game_id: this.state.game._id
        }) // tells other people to change their scores
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
        {this.state.users.map((user, key)=> (<Text key={key}> { user.name } { this.state.user_scores[user._id] } </Text>))}
        </ScrollView>
      </View>


  
        <Text>
          Add scores:
          { this.state.users.map((user, key) => (<Button key={key} title={user.name} onPress={ () => {this.handleIncrement(this.state.game._id, user._id)} }/>))}
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
    marginBottom: 10,
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
})

export default Game;