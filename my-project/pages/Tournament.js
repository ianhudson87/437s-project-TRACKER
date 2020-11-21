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
import { getObjectByID, moveToNextRound } from '../constants/api'
import { getSocket } from '../constants/socketio'

class Tournament extends Component {
  // need to have the game object passed as a prop

  constructor(props) {
    super(props);
    // info about the group, scores, and users for the game
    this.state = {
      game: this.props.route.params.game, // stores tournament object that we want to display
      users: [], // stores user objects of users in the game (because the game object only stores user ids)
      results: [], // contains id of user at each position in tournament
      results_objects: [], // contains name of user at each position in tournament
    }
    
    this.populateUsersArray = this.populateUsersArray.bind(this)
    this.populateResultsArray = this.populateResultsArray.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount(){
    this.populateUsersArray()
    this.populateResultsArray()
    console.log("data: game:", this.state.game)

    this.socket = getSocket()
    this.socket.emit('join_room', {
      // tell socket to put user into a room so that they can send/recieve updates to the game in real time
      game_id: this.state.game._id
    })

    this.socket.on('refresh_score', (data)=>{
      console.log('REFRESH SCORE')
      getObjectByID({id: this.state.game._id, type: 'tournament'}).then((response) => {
        console.log('RESPONSE', response)
        if(response.object_exists){
          this.setState({ tournament: response.object })
          this.populateResultsArray() // updates the tournament results in the display
        }
      })
    })
  }

  populateUsersArray(){
    // populate the this.state.users array
    let user_object_list = []
    console.log("Populate Array")
    console.log(this.state.game.results)
    this.state.game.users.forEach((user_id, index) => {
      getObjectByID({id: user_id, type: 'user'}).then((response) => {
        if(response.object_exists){
          user_object_list.push(response.object)
        }
      })
    })
    this.setState({users: user_object_list, results: this.state.game.results}) // update state of component
  }

  populateResultsArray(){
    // populate the this.state.results_objects array
    let results_object_list = []
    this.state.game.results.forEach((user_id, index) => {
      if(user_id != 0){
        getObjectByID({id: user_id, type: 'user'}).then((response) => {
          if(response.object_exists){  
            results_object_list.push(response.object)
          }
          this.setState({results_objects: results_object_list}) // update state of component
          console.log("State0")
        })
      }
      else{
        results_object_list.push({name: ''})
        this.setState({results_objects: results_object_list}) // update state of component
        console.log("State1")
      }
    })
  }

  handleClick(user, key){
    console.log("Handle click")
    console.log(user)
    console.log(key)
    let resultData = {
      tournament_id: this.state.game._id,
      index: key
    }
    moveToNextRound(resultData).then((response)=>{
      console.log("MOVE ROUND RESPONSE", response)
      if(response.tournament_updated){
        this.socket.emit('changed_score', {
          game_id: this.state.game._id
        }) // tells other people to change their scores
        // game is updated on server. display updated game
        this.setState({game: response.updated_tournament})
        this.populateUsersArray() // update the list of user just in case
      }
      else if(response.error){
        // tournament failed to update
        console.log("ERROR")
      }
      else{
        console.log("Invalid button pressed")
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.nameContainer}>
          Tournament: {this.state.game.name}
        </Text>
        
        <View style={styles.usersContainer}>
          <Text>Bracket:</Text>
            {this.state.results_objects.map((user, key)=> (<Button title={user.name} key={key} 
                  onPress={(e) => this.handleClick(user, key, e)}/>))}

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

export default Tournament;