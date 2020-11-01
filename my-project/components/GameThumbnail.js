// Thumbnail for displaying a game

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native'

class GameThumbnail extends Component {
  // need to know the name of the game, and maybe other info
  // These are passed as props

  constructor(props) {
    super(props);

    this.state = {
      game_info: this.props.game,
      name: this.props.game.name
    }

    // info about the game
    // this.state = {
    //   game_info: this.props.game,
    //   name: this.props.game.name
    // }

    this.goToGame = this.goToGame.bind(this);
  }

  // componentDidMount(){
  // }

  goToGame(event) {
    console.log('button click')
    // handler for user clicks on the game
    const navigation = this.props.navigation;
    navigation.navigate("Game", {game: this.state.game_info})
  }

  
render() {
  return (
    <View style={styles.container}>
      <Button title={this.state.name} onPress={this.goToGame}/>
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

export default GameThumbnail;