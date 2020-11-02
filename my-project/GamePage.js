import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getGroupByID } from "./constants/api"

class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {game: {'name': "default", 'users': [], 'score': 0 }}
    }

    componentDidMount(){
        const game = this.props.route.params.game;
        this.setState({game: game});
        
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    handleNewUser(){
        this.props.navigation.navigate("AddUserToGame", {
            itemId: 91,
            game: this.state.game,
            navigation: this.props.navigation,
            loggedInUser: this.props.loggedInUser
        });
    }

  
render() {
    return (
      <View style={styles.container}>
        <Text>
          Game Page
        </Text>
        <Text>
            Game: {this.state.game.name}
        </Text>
        <Button title='Add User' onPress={(e) => this.handleNewUser(e)}/>
        <Text>
        {
            this.state.game.users.map((user, key)=> (<Text key={key}>{user}</Text>))
        }
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
  }
})

export default GamePage;