// Thumbnail for displaying a game

import { isEqual } from 'date-fns';
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native'
import { Card, ListItem, Icon, Divider } from 'react-native-elements'
import { getObjectsByIDs } from '../constants/api';
import { arraysEqual } from '../constants/helper'

class GameThumbnail extends Component {
  // need to know the name of the game, and maybe other info
  // These are passed as props

  constructor(props) {
    super(props);

    this.state = {
      game_info: this.props.game,
      name: this.props.game.name,
      userID_scores: {}, // contains key:value pairs of user_id:score
      users: [], // contains user objects
    }

    this.goToGame = this.goToGame.bind(this);
    this.generateUserScores = this.generateUserScores.bind(this);
  }

  componentDidMount(){
    this.generateUserScores()
  }

  componentDidUpdate(prevProps){
    // every time props update?
    //console.log("HEREHRHERHEHREHR", arraysEqual(prevProps.game.scores,this.props.game.scores))
    if(!arraysEqual(prevProps.game.scores, this.props.game.scores)){
      // if the game scores of teh previous props are different from the scores of the props just passed down
      this.setState({game_info: this.props.game, name: this.props.game.name}, this.generateUserScores)
    }
  }

  generateUserScores(){
    // populate this.state.users and this.state.user_scores
    let userIDs = this.state.game_info.users
    getObjectsByIDs({ids: userIDs, type: 'user'}).then((response) => {
      //console.log("RESPONSE", response)
      // GET ALL USERS
      if(response.objects_exist){
        let users = response.objects // contains user objects
        this.setState({users: users})
      }
    })

    let userID_scores_dict = {}
    let scores = this.state.game_info.scores
    userIDs.forEach((userID, index)=>{ userID_scores_dict[userID] = scores[index] })
    this.setState({userID_scores: userID_scores_dict})
  }

  goToGame(event) {
    console.log('button click')
    // handler for user clicks on the game
    const navigation = this.props.navigation;
    navigation.navigate("Game", {game: this.state.game_info})
  }

  
render() {
  //console.log("RENDER THIS!", this.state)
  // console.log("STATE", this.state)
  return (
    <ListItem bottomDivider onPress={this.goToGame}>
        <Icon name="games" />
        <ListItem.Content>
            <ListItem.Title>{this.state.name}</ListItem.Title>
            <ListItem.Subtitle>
              {
                this.state.users.map((userObject, index) => {
                  // show scores of players
                  return(<Text key={index}>[{userObject.name}: {this.state.userID_scores[userObject._id]}] </Text>)
                })
              }
            </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
    </ListItem>

    // <View style={styles.container}>
    //   <Button color="#eedd11" title={this.state.name} onPress={this.goToGame}/>
    // </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default GameThumbnail;