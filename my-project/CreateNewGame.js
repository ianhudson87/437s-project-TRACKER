import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getGameByID } from "./constants/api"
import CreateNewGameForm from './CreateNewGameForm'

class CreateNewGame extends Component {
    constructor(props) {
        super(props);
        this.state = {game: {'name': "default", 'users': [], 'score': 0}}
    }

    componentDidMount(){
        
    }

  
render() {
    return (
      <View style={styles.container}>
        <Text>
          New Game
        </Text>
       
        <CreateNewGameForm navigation={this.props.navigation} loggedInUser={this.props.loggedInUser}></CreateNewGameForm>
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
  }
})

export default CreateNewGame;