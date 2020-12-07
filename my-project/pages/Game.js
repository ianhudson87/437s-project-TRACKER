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
import { getObjectByID, changeScore, getObjectsByIDs } from '../constants/api'
import { getSocket } from '../constants/socketio'

class Game extends Component {
  // need to have the game object passed as a prop

  constructor(props) {
    super(props);
    // info about the group, scores, and users for the game
    this.state = {
      game: this.props.route.params.game, // stores game object that we want to display
      users: [], // stores user objects of users in the game (because the game object only stores user ids)
      user_scores: {}, // contains key:value pairs of user_id:score
    }
    
    this.updateGame = this.updateGame.bind(this)
    this.updateDisplay = this.updateDisplay.bind(this)
    this.handleIncrement = this.handleIncrement.bind(this)
    this.game_buttons = this.game_buttons.bind(this)
  }

  componentDidMount(){
    this.props.navigation.addListener('focus', ()=>{this.updateGame()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
    console.log("data: game:", this.state.game)

    this.socket = getSocket()
    this.socket.emit('join_room', {
      // tell socket to put user into a room so that they can send/recieve updates to the game in real time
      game_id: this.state.game._id
    })

    this.socket.on('refresh_score', (data)=>{
      console.log('REFRESH SCORE')
      this.updateGame()
    })
  }

  updateGame(){
    getObjectByID({id: this.state.game._id, type: 'game'}).then((response) => {
      // GETTING ALL INFO ABOUT GAME
      console.log('REPSPONSE', response)
      if(response.object_exists){
        this.setState({ game: response.object })
        this.updateDisplay() // updates the scores of the players in the display
      }
    })
  }

  updateDisplay(){
    // populate the this.state.users array. Populate the this.state.user_scores dictionary

    // POPULATE USERS ARRAY
    let user_ids = this.state.game.users
    getObjectsByIDs({ids: user_ids, type: 'user'}).then((response)=>{
      if(response.objects_exist){
        let user_object_list = response.objects.sort((a,b)=>{console.log('here'); return (a._id > b._id) ? 1 : -1})
        // we have list of user objects that always come in the same order
        this.setState({users: user_object_list})
      }
    })

    // turn two arrays (users, scores) into dictionary. user is key, score is value
    let user_scores_dict = {}
    let userIDs = this.state.game.users
    let scores = this.state.game.scores
    userIDs.forEach((userID, index) => { user_scores_dict[userID] = scores[index] })
    this.setState({user_scores: user_scores_dict})
    
  }

  handleIncrement(game_id, user_id, amount){
    console.log("INCREMENT SCORE: game_id:", game_id, "user_id", user_id)
    // send api request to increment score of user with the id, for a specific game_id
    let scoreData = {
      // info about how to change the score
      game_id: game_id,
      user_id: user_id,
      type: "delta",
      amount: amount
    }
    changeScore(scoreData).then((response)=>{
      console.log("CHANGE SCORE RESPONSE", response)
      if(response.game_updated){
        this.socket.emit('changed_score', {
          game_id: this.state.game._id
        }) // tells other people to change their scores
        // game is updated on server. display updated game
        this.setState({game: response.updated_game})
        this.updateGame() // update the list of user just in case
      }
      else{
        // game failed to update
      }
    })
  }

  game_buttons(){
    if(this.state.game.game_ended){
      // game has ended
      return(
        <View>
          <Text>Game has ended!</Text>
        </View>
      )
    }
    else{
      return(
        <View>
          <Text>Goal: {this.state.game.goal_score} </Text>
          <Text>Add scores:</Text>
          { this.state.users.map((user, key) => (<Button key={key} title={user.name} onPress={ () => {this.handleIncrement(this.state.game._id, user._id, 1)} }/>))}
          <Text>Decrement scores:</Text>
          { this.state.users.map((user, key) => (<Button key={key} title={user.name} onPress={ () => {this.handleIncrement(this.state.game._id, user._id, -1)} }/>))}
        </View>
      )
    }
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

      <View>
        {this.game_buttons()}
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