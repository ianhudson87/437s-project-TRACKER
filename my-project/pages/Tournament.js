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
      first_round: [],
      second_round: [],
      third_round: [],
      fourth_round: [],
      fifth_round: [],
      results_to_display: [[], [], [], [], []],
      numRounds: 0
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
          this.setState({ game: response.object })
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
    console.log("POPULATE")
    let results = []
    let numRounds = Math.log2(this.state.game.results.length+1)
    this.setState({numRounds: numRounds})
    for(let i = 0; i < numRounds; i++){
      results[i] = []
    }
    this.state.game.results.forEach((user_id, index) => {
      let added = false
      for(let i = numRounds-1; i >= 0; i--){
        if(index >= Math.pow(2, i)-1 && !added){
          added = true
          if(user_id != 0){
            getObjectByID({id: user_id, type: 'user'}).then((response) => {
              if(response.object_exists){  
                results[(numRounds-1)-i][index-Math.pow(2, i)+1] = response.object
              }
              this.setState({results_to_display: results}, ()=>{
                console.log(this.state.results_to_display)
              }) // update state of component
            })
          }
          else{
            results[(numRounds-1)-i][index-Math.pow(2, i)+1] = {name: '           ', _id: index}
            this.setState({results_to_display: results}, ()=>{
              console.log(this.state.results_to_display)
            }) // update state of component
          }
        }
      }
    })
  }

  handleClick(user, key, roundNum){
    console.log("Handle click")
    console.log(user)
    console.log(key + Math.pow(2, roundNum) - 1)
    let resultData = {
      tournament_id: this.state.game._id,
      index: key + Math.pow(2, roundNum) - 1
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

  generateBracket(numRounds){
    let output = []
    let roundDescription
    for(let i=0; i<numRounds; i++){
      if(i<numRounds-1){
        roundDescription = <Text>Round: {i+1}</Text>
      }
      else{
        roundDescription = <Text>Winner</Text>
      }
      output.push(
        <View style={styles.round}>
          {roundDescription}
          {this.state.results_to_display[i].map((user, key)=> (
            <View style={styles.buttonContainer}>
              <Button title={user.name} key={user._id} onPress={(e) => this.handleClick(user, key, numRounds-1-i, e)}/>
            </View>
          ))} 
        </View>
      )
    }
    return output
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bracketContainer}>
          {this.generateBracket(this.state.numRounds)}
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
    marginBottom: 30,
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
  bracketContainer: {
    //flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // height: "20%",
    flexDirection: 'row',
    backgroundColor: 'blue'
  },
  usersListContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    marginHorizontal: 0,
    //height: "30%",
    width: "120%"
  },
  round: {
    flex: 5,
    flexDirection: "column",
    backgroundColor: 'green',
    padding: 2,
  },
  buttonContainer: {
    borderWidth: 1,
    flex: 1,
    backgroundColor: 'pink',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default Tournament;