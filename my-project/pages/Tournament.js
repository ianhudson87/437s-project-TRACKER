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
      results: [], // contains id of user at each position in tournament
      results_objects: [], // contains name of user at each position in tournament
    }
    
    this.populateUsersArray = this.populateUsersArray.bind(this)
    this.handleClick = this.handleClick.bind(this)
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
          this.populateUsersArray() // updates the tournament results in the display
        }
      })
    })
  }

  populateUsersArray(){
    // populate the this.state.users array. Set the tournament results
    let user_object_list = []
    let user_scores_dict = {}
    this.state.game.users.forEach((user_id, index) => {
      getObjectByID({id: user_id, type: 'user'}).then((response) => {
        if(response.object_exists){
          user_object_list.push(response.object)
        }
      })
    })
    this.setState({users: user_object_list, results: this.state.game.results}) // update state of component
    console.log("user_object_list", this.state.users)
    console.log("results", this.state.results)

    let results_object_list = []
    this.state.game.results.forEach((user_id, index) => {
        console.log(user_id)
        if(user_id != 0){
            getObjectByID({id: user_id, type: 'user'}).then((response) => {
                if(response.object_exists){  
                    results_object_list.push(response.object)
                    console.log(results_object_list)
                }
                this.setState({results_objects: results_object_list}) // update state of component
                console.log("State")
                console.log(this.state.results_objects)
              })
        }
        else{
            results_object_list.push({name: ''})
            this.setState({results_objects: results_object_list}) // update state of component
            console.log("State")
            console.log(this.state.results_objects)
        }
    })
    
  }

  handleClick(user){
    console.log("Handle click")
    console.log(user)
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
                  onPress={(e) => this.handleClick(user, e)}/>))}

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