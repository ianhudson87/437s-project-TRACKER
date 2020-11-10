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

class Tournament extends Component {
  // need to have the game object passed as a prop

  constructor(props) {
    super(props);
    // info about the group, scores, and users for the game
    this.state = {
      game: this.props.route.params.game, // stores tournament object that we want to display
      users: [], // stores user objects of users in the game (because the game object only stores user ids)
      results: [] // contains key:value pairs of user_id:score
    }
    
    this.populateUsersArray = this.populateUsersArray.bind(this)
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
        console.log('RESPONSE', response)
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
        }
  
        this.setState({users: user_object_list, results: this.state.game.results}) // update state of component
        console.log("user_object_list", this.state.users)
        console.log("results", this.state.results)
      })
    })
    
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.nameContainer}>
          Tournament: {this.state.game.name}
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

export default Tournament;