// Page for displaying game
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
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
    
    this.handleIncrement = this.handleIncrement.bind(this)
  }

  componentDidMount(){
    // populate the this.state.users array
    let user_object_list = []
    this.state.game.users.forEach((user_id) => {
      getObjectByID({id: user_id, type: 'user'}).then((response) => {
        if(response.object_exists){
          user_object_list.push(response.object)
        }
  
        this.setState({users: user_object_list})
        console.log("user_object_list", this.state.users)
      })
    })
    

    console.log("data: game:", this.state.game)
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
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          THIS IS THE PAGE FOR A SINGLE GAME
        </Text>

        <Text>
          Users in the game:
          { this.state.users.map((user, key) => (<Text key={key}>{user.name}</Text>)) }
          Scores in the game:
          { this.state.game.scores.map((score, key) => (<Text key={key}>{score}</Text>)) }
          Add scores:
          { this.state.users.map((user, key) => (<Button key={key} title={'Increment ' + user.name + "'s score"} onPress={this.handleIncrement(this.state.game._id, user._id)}/>))}
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
  }
})

export default Game;