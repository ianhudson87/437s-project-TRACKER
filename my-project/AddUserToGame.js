import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getGameByID } from "./constants/api"
import AddUserToGameForm from './AddUserToGameForm'

class AddUserToGame extends Component {
    constructor(props) {
        super(props);
        this.state = {game: {'name': "default", 'users': [], 'score': 0}}
    }

    componentDidMount(){
        const game = this.props.route.params.game;
        this.setState({game: game});
        console.log(this.props.route.params.game)
    }

  
render() {
    return (
      <View style={styles.container}>
        <Text>
          Add users to game {this.state.game.name}
        </Text>
        <Text>
            Current Users:
        </Text>
        <Text>
        {
            this.state.game.users.map((user, key)=> (<Text key={key}>{user}</Text>))
        }
        </Text>
        <AddUserForm game={this.state.game} navigation={this.props.navigation} loggedInUser={this.props.loggedInUser}></AddUserForm>
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

export default AddUserToGame;