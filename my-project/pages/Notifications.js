import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { getPendingGamesOfUser } from '../constants/api'
import { Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'

class Notifications extends Component {
  constructor(props) {
      super(props);
      this.state = {
          pending_games: []
      }
      this.loggedInUserID

      this.getUserID = this.getUserID.bind(this)

  }

  componentDidMount(){
    this.getUserID()
    this.props.navigation.addListener('focus', async ()=>{this.getNotifications()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
  }

  getUserID(){
    AsyncStorage.getItem('loggedInUserID').then((loggedInUserID)=>{
      console.log("USERID FROM STORAGE:", loggedInUserID)
      // update loggedInUserID in the state
      this.loggedInUserID = loggedInUserID
    })
  }

  getNotifications(){
      this.getPendingGames()
  }

  async getPendingGames(){
    let response = await getPendingGamesOfUser(this.loggedInUserID)
    if(response.error){
        alert('error in getting pending games')
    }
    else{
        this.setState({ pending_games: response.pending_games }, ()=>{console.log(this.state)})
    }
  }

render() {
  console.log("RENDER")
  console.log(this.state)
    return (
      <View style={styles.container}>
        <ScrollView>
            {this.state.pending_games.map((pending_game) => {
                return(
                    <Card>
                        <Card.Title> Pending game: {pending_game.name} </Card.Title>
                        <Card.Divider />
                        <Text>Group: {pending_game.group}</Text>
                        <Text>Users: {pending_game.users}</Text>
                        <Text>accepted: {pending_game.users_accepted}</Text>
                    </Card>
                )
            })}

        </ScrollView>
        <Text>
            hi
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

export default Notifications;