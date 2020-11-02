// Page for creating a new game

import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native'
import { createGame } from "../constants/api"

class CreateNewGame extends Component {
  // need to know the user who wants to create the game. Need to know the group that the user is creating the game in
  // These are passed as props

  constructor(props) {
    super(props);
    // info about the group and user that the game is being create for
    this.state = {
      group: this.props.route.params.group,
      loggedInUserID: null,
      opponent_id: "",
      game_name: "",
      error_msg: "",
    }

    this.handleOpponentChange = this.handleOpponentChange.bind(this);
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
  }

  componentDidMount(){
    AsyncStorage.getItem('loggedInUserID').then((value)=>{
      this.setState({ loggedInUserID: value})
    }).then(()=>{
      console.log("data: group:", this.state.group, "user", this.state.loggedInUserID)
    })
  }

  handleOpponentChange(text) {
    // handler for opponent box change
    this.setState({opponent_id: text});
  }

  handleGameNameChange(text) {
    // handler for game name box change
    this.setState({game_name: text});
  }

  handleNewGame(event) {
    console.log('button click')
    // handler for create new game button press
    let user_ids = [this.state.loggedInUserID, this.state.opponent_id] // hard coded for 2 players
    createGame(this.state.game_name, user_ids, this.state.group).then((data)=>{
      console.log("repsonse", data)
      if(data.error){
        // error in creating game
        alert("error in creating game")
      }
      else if(data.game_created==false){
        // no error, but game not created
        alert("game was not created")
      }
      else{
        // game was created
        let game = data.game_info
        alert("game " + game.name + " was created")

        this.props.navigation.dispatch(
          // reset the navigation so that you can't navigate back from the userhome page
          CommonActions.goBack()
      );

      }

    })
  }

  
render() {
  return (
    <View style={styles.container}>
      <Text>
        Create New Game Page
      </Text>

      <Text>
          For Group: {this.state.group.name}
      </Text>

      <Text>Opponent User ID:</Text>
      <TextInput value={this.state.opponent_id} onChangeText={(text)=>{this.handleOpponentChange(text)}} style={styles.text}/>
      
      <Text>game Name:</Text>
      <TextInput value={this.state.game_name} onChangeText={(text)=>this.handleGameNameChange(text)} style={styles.text}/>
      <Button title='Create Game' onPress={this.handleNewGame}/>
      <Text>{}</Text>
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

export default CreateNewGame;