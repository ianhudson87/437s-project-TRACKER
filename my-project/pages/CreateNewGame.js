// Page for creating a new game

import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native'
import { createGame, fetchUsers} from "../constants/api"

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
      opponent_name: "",
      game_name: "",
      game_type:"standard",
      error_msg: "",
      goal_score: "",
      users: [], // contains user objects
    }

    this.handleSelectOpponent = this.handleSelectOpponent.bind(this);
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
  }

  componentDidMount(){
    // get id of logged in user
    AsyncStorage.getItem('loggedInUserID').then((value)=>{
      this.setState({ loggedInUserID: value})
    }).then(()=>{
      console.log("data: group:", this.state.group, "user", this.state.loggedInUserID)
    })

    // populate this.state.users
    fetchUsers().then((data)=>{
      console.log("response from fetchUsers", data)
      this.setState({users: data.users})
    }).then(()=>{
      console.log("this.state.users", this.state.users)
    })

  }

  handleGameNameChange(text) {
    // handler for game name box change
    this.setState({game_name: text});
  }

  handleSelectOpponent(user){
    // handler for when user clicks on user to be opponent
    this.setState({opponent_id: user._id, opponent_name: user.name})
  }

  handleGoalScoreChange(text){
    // handler for goal score text box
    this.setState({goal_score: text});
  }

  

  handleNewGame(event) {
    console.log('button click')
    if(this.state.game_type == "tournament"){ // for now I'm adding all group members to tournament
        let user_ids = []
        for(let i=0; i<this.state.users.length; i++){
          user_ids.push(this.state.users[i]._id)
        }
        createGame(this.state.game_name, user_ids, this.state.group, "tournament", 0).then((data)=>{
        console.log("response", data)
        if(data.error){
          // error in creating game
          alert("error in creating tournament")
        }
        else if(data.game_created==false){
          // no error, but game not created
          alert("tournament was not created")
        }
        else{
          // game was created
          let game = data.game_info
          alert("tournament " + game.name + " was created")

          this.props.navigation.dispatch(
            // reset the navigation so that you can't navigate back from the userhome page
            CommonActions.goBack()
        );
        }
      })
    }
    else{
      // handler for create new game button press
      let goal_score_int = parseInt(this.state.goal_score)
      console.log(goal_score_int)
      let user_ids = [this.state.loggedInUserID, this.state.opponent_id] // hard coded for 2 players
      createGame(this.state.game_name, user_ids, this.state.group, "standard", goal_score_int).then((data)=>{
        console.log("response", data)
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
  }

  
render() {
  return (
    <View style={styles.container}>
      <View style={styles.view1}>
        <Text>
          Create New Game Page
        </Text>

        <Text>
            For Group: {this.state.group.name}
        </Text>
      </View>

      <View style={styles.view2}>
        <Text>Select Game Type:</Text>
        <ScrollView style={styles.scrollView}>
          {/* buttons that show each game type */}
          <Button title="Counter" onPress={()=>{this.setState({game_type: "standard"})}} />
          <Button title="Tournament" onPress={()=>{this.setState({game_type: "tournament"})}} />
        </ScrollView>
      </View>
      
      <View style={styles.view2}>
        <Text>Select Opponent:</Text>
        <ScrollView style={styles.scrollView}>
          {/* buttons that show each user */}
          {this.state.users.map((user, key)=> (<Button title={user.name} key={key} onPress={()=>{this.handleSelectOpponent(user)}} />))}
        </ScrollView>
      </View>
      
      <View style={styles.view3}>
        <Text>Opponent User ID: {this.state.opponent_id}</Text>
        <Text>Opponent User ID: {this.state.opponent_name}</Text>

        <Text>game Name:</Text>
        <TextInput value={this.state.game_name} onChangeText={(text)=>this.handleGameNameChange(text)} style={styles.textInput}/>

        <Text>goal score:</Text>
        <TextInput value={this.state.goal_score} onChangeText={(text)=>this.handleGoalScoreChange(text)} style={styles.textInput}/>
        <Button title='Create Game' onPress={this.handleNewGame}/>
      </View>
      
    </View>
  )
}
}

const styles = StyleSheet.create({
  view1:{
    flex:1,
    backgroundColor: 'lightblue',
    height:50
  },
  view2:{
    flex:2,
    backgroundColor: 'lightgreen',
    height:150
  },
  view3:{
    flex:1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  }
})

export default CreateNewGame;