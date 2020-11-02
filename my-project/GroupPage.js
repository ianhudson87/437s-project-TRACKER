import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getGroupByID, getGameByID } from "./constants/api"
import LoginForm from './LoginForm'

class GroupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {group: {'name': "default", 'users': [], 'games': []}}
    }

    componentDidMount(){
        const group = this.props.route.params.group;
        this.setState({group: group});
        
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    navigateToGame(game, event) {
      console.log(game.name);
      this.props.navigation.navigate("GamePage", {
          itemId: 91,
          game: game,
          loggedInUser: this.state.user
      });
  }

  createNewGame(game, event) {
      this.props.navigation.navigate("CreateNewGame", {
          itemId: 91,
          loggedInUser: this.state.user
      });
  }

    handleNewUser(){
        this.props.navigation.navigate("AddUserToGroup", {
            itemId: 86,
            group: this.state.group,
            navigation: this.props.navigation,
            loggedInUser: this.props.loggedInUser
        });
    }

  
render() {
    return (
      <View style={styles.container}>
        <Text>
          Group Page
        </Text>
        <Text>
            Group: {this.state.group.name}
        </Text>
        <Text>
            Users:
        </Text>
        <Text>
        {
            this.state.group.users.map((user, key)=> (
            <Text key={key}>
              {user.name}
            </Text>))
        }
        </Text>
        <Button title='Add User' onPress={(e) => this.handleNewUser(e)}/>
        <Text>
            Games:
        </Text>
        <Text>
        {
            this.state.group.games.map((game, key)=> (<Button title={game.name} key={key} 
                onPress={(e) => this.navigateToGame(game, e)}/>))
        }
        </Text>
        <Button title='Create New Game' onPress={(e) => this.createNewGame(e)}/>
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

export default GroupPage;