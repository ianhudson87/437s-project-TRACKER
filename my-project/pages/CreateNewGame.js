// Page for creating a new game

import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'
import { StyleSheet, ScrollView, Text, TextInput, View} from 'react-native'
import { ButtonGroup, Overlay, Icon, Button, Input, ListItem } from 'react-native-elements'
import { Title } from 'react-native-paper'
import { createGame, getObjectsByIDs, fetchUsers } from "../constants/api"

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
      opponent_ids: [],
      opponent_names: [],
      game_name: "",
      game_type:"standard",
      selected_index: 0, // this corresponds to game_type. Is used for the button group
      error_msg: "",
      goal_score: "",
      users: [], // contains user objects
      user_ids: this.props.route.params.group.users, //contains user id's
      game_overlay_visible: false,
      tournament_overlay_visible: false,
      invalid_tournament_number: false,
    }

    this.handleSelectOpponent = this.handleSelectOpponent.bind(this);
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
    this.toggleGameOverlay = this.toggleGameOverlay.bind(this);
    this.toggleTournamentOverlay = this.toggleTournamentOverlay.bind(this);
    this.getUserSelectButton = this.getUserSelectButton.bind(this);
    this.invalidNumberHandler = this.invalidNumberHandler.bind(this)
  }

  componentDidMount(){
    // get id of logged in user
    AsyncStorage.getItem('loggedInUserID').then((value)=>{
      this.setState({ loggedInUserID: value})
    }).then(()=>{
      console.log("data: group:", this.state.group, "user", this.state.loggedInUserID)
    })

    // populate this.state.users
    // fetchUsers().then((data)=>{
    //   console.log("response from fetchUsers", data)
    //   this.setState({users: data.users})
    // }).then(()=>{
    //   console.log("this.state.users", this.state.users)
    // })
    //this.setState({users: this.state.group.users})
    
    let userIDs = this.state.user_ids
    getObjectsByIDs({ids: userIDs, type: 'user'}).then((response) => {
      //console.log("RESPONSE", response)
      // GET ALL USERS
      if(response.objects_exist){
        let users = response.objects // contains user objects
        this.setState({users: users})
      }
    })

  }

  handleGameNameChange(text) {
    // handler for game name box change
    this.setState({game_name: text});
  }

  handleSelectOpponent(user){
    // handler for when user clicks on user to be opponent
    let original_ids = this.state.opponent_ids;
    let original_names = this.state.opponent_names;
    let isInGame = false;
    for(let i=0; i<original_ids.length; i++){
      if(original_ids[i] === user._id){
        isInGame = true;
        original_ids.splice(i, 1)
        original_names.splice(i, 1)
        this.setState({opponent_ids: original_ids})
        this.setState({opponent_names: original_names})
      }
    }
    if(!isInGame){
      original_ids.push(user._id)
      original_names.push(user.name)
      this.setState({opponent_ids: original_ids})
      this.setState({opponent_names: original_names})
    }
    console.log(this.state.opponent_names)
    this.setState({opponent_id: user._id, opponent_name: user.name})
  }

  handleGoalScoreChange(text){
    // handler for goal score text box
    if(!isNaN(text)){
      // if the input is a number
      this.setState({goal_score: text});
    }
  }

  updateIndex(selected_index){
    console.log("Update index")
    let selected_game_type
    switch(selected_index){
      case 0:
        selected_game_type = "standard"
        break
      case 1:
        selected_game_type = "tournament"
        break
      default:
        selected_game_type = "standard"
        break
    }
    this.setState({selected_index: selected_index, game_type: selected_game_type})

  }

  handleNewGame(event) {
    console.log('button click')
    if(this.state.game_type == "tournament"){ // for now I'm adding all group members to tournament
      if(this.state.game_name==""){
        alert("Input a game name")
      }
      else{
        // let user_ids = []
        // for(let i=0; i<this.state.users.length; i++){
        //   user_ids.push(this.state.users[i]._id)
        // }
        this.setState({invalid_tournament_number: false})
        let initial_user_ids = [this.state.loggedInUserID]
        let user_ids = initial_user_ids.concat(this.state.opponent_ids)
        if(user_ids.length < 4){
          this.setState({invalid_tournament_number: true})
        }
        else{
          let pending = true
          let requester_id = this.state.loggedInUserID
          createGame(pending, this.state.game_name, user_ids, this.state.group._id, "tournament", 0, requester_id).then((data)=>{
            console.log("response", data)
            if(data.error){
              // error in creating game
              alert("error in creating tournament")
            }
            else if(data.game_created==false){
              // no error, but game not created
              alert(data.message)
            }
            else{
              // game was created
              let game = data.game_info
              alert("tournament " + game.name + " was created")

              this.props.navigation.dispatch(
                CommonActions.goBack()
              );
            }
          })
        }
        
      }
    }
    else{
      // handler for create new game button press
      let goal_score_int = parseInt(this.state.goal_score)
      console.log(goal_score_int)
      //let user_ids = [this.state.loggedInUserID, this.state.opponent_id] // hard coded for 2 players
      let initial_user_ids = [this.state.loggedInUserID]
      let user_ids = initial_user_ids.concat(this.state.opponent_ids)
      if(this.state.opponent_ids.length == 0){
        alert("select at least one opponent")
      }
      else if(this.state.game_name == ""){
        alert("Input a game name")
      }
      else if(this.state.goal_score == ""){
        alert("Input a goal score")
      }
      else{
        let pending = true
        let requester_id = this.state.loggedInUserID
        createGame(pending, this.state.game_name, user_ids, this.state.group, "standard", goal_score_int, requester_id).then((data)=>{
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
            console.log(game)
  
            this.props.navigation.dispatch(
              // reset the navigation so that you can't navigate back from the userhome page
              CommonActions.goBack()
          );
          }
        })
      }
    }    
  }

  toggleGameOverlay(){
    this.setState({ game_overlay_visible: !this.state.game_overlay_visible })
  }

  toggleTournamentOverlay(){
    this.setState({ tournament_overlay_visible: !this.state.tournament_overlay_visible })
  }

  getUserSelectButton(user, key){
    let icon_name = this.state.opponent_ids.includes(user._id) ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'
    return(
      <ListItem key={key} bottomDivider onPress={()=>{this.handleSelectOpponent(user)}}>
        <Icon name={icon_name} type="material-community" />
        <ListItem.Content>
        <ListItem.Title>{user.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    )
  }

  invalidNumberHandler(){
    if(!this.state.invalid_tournament_number){
      return (<View></View>)
    }
    else{
        return (
            <View>
                <Text style={{color: 'red', }}>Tournaments need at least 4 players</Text>
            </View>
        )
    }
  }

  showGameOptions(game_type){
    if(game_type == "standard"){
    return(
      <View style={styles.gameOptionsContainer}>
        <View style={{ alignSelf:"center" }}>
        <Button  icon={ <Icon name="help-circle-outline" type="material-community" size={20} color="white" /> } title="Info" onPress={this.toggleGameOverlay} />
        </View>
        <View style={styles.opponentsContainer}>
          <Title>Opponents</Title>
          <ScrollView style={styles.scrollView}>
            {/* buttons that show each user */}
            {this.state.users.map((user, key)=> {
              if(user._id != this.state.loggedInUserID){
                return(
                  this.getUserSelectButton(user, key)
                  // <ListItem key={key} bottomDivider onPress={()=>{this.handleSelectOpponent(user)}}>
                  //   <Icon name={'checkbox-blank-circle-outline'} type="material-community" />
                  //   <ListItem.Content>
                  //     <ListItem.Title>{user.name}</ListItem.Title>
                  //   </ListItem.Content>
                  // </ListItem>
                )
                // return (<Button title={user.name} key={key} onPress={()=>{this.handleSelectOpponent(user)}} />)
              }
            })}
          </ScrollView>
        </View>
        
        <View style={styles.submitContainer}>
          <Input
            returnKeyType={ 'done' }
            placeholder="Game Name:"
            value={this.state.game_name}
            onChangeText={(text)=>this.handleGameNameChange(text)}
            // leftIcon={<Icon name='fingerprint'/>}
          />
          {/* <TextInput returnKeyType={ 'done' } value={this.state.game_name} onChangeText={(text)=>this.handleGameNameChange(text)} style={styles.textInput}/> */}

          {/* <Text>Goal Score:</Text> */}
          <Input
            keyboardType="number-pad"
            placeholder="Goal Score:"
            value={this.state.goal_score}
            onChangeText={(text)=>this.handleGoalScoreChange(text)}
            // leftIcon={<Icon name='fingerprint'/>}
          />
          {/* <TextInput keyboardType="number-pad" returnKeyType={ 'done' } value={this.state.goal_score} onChangeText={(text)=>this.handleGoalScoreChange(text)} style={styles.textInput}/> */}
          <Button title='Create Game' onPress={this.handleNewGame}/>

          <View style={styles.overlay}>
            <Overlay isVisible={ this.state.game_overlay_visible } onBackdropPress={ this.toggleGameOverlay }>
              <View>
                <Text>Counter games track the scores of two players until they reach a goal score.</Text>
              </View>
            </Overlay>
          </View>
        </View>
      </View>
    )}
    else if(game_type == "tournament"){
    return(
      <View style={styles.gameOptionsContainer}>
        <Button style={{ alignSelf:"center", marginTop: 40 }} icon={ <Icon name="help-circle-outline" type="material-community" size={20} color="white" /> } title="Info" onPress={this.toggleTournamentOverlay} />
        
        
        
        <View style={styles.opponentsContainer}>
          <Title>Opponents</Title>
          <ScrollView style={styles.scrollView}>
            {/* buttons that show each user */}
            {this.state.users.map((user, key)=> {
              if(user._id != this.state.loggedInUserID){
                return(
                  this.getUserSelectButton(user, key)
                  // <ListItem key={key} bottomDivider onPress={()=>{this.handleSelectOpponent(user)}}>
                  //   <Icon name={'checkbox-blank-circle-outline'} type="material-community" />
                  //   <ListItem.Content>
                  //     <ListItem.Title>{user.name}</ListItem.Title>
                  //   </ListItem.Content>
                  // </ListItem>
                )
                // return (<Button title={user.name} key={key} onPress={()=>{this.handleSelectOpponent(user)}} />)
              }
            })}
          </ScrollView>
        </View>



        <View style={styles.submitContainer}>
          <Input
            returnKeyType={ 'done' }
            placeholder="Tournament name"
            value={this.state.game_name}
            onChangeText={(text)=>this.handleGameNameChange(text)}
            // leftIcon={<Icon name='fingerprint'/>}
          />
          {this.invalidNumberHandler()}
          <Button title='Create Game' onPress={this.handleNewGame}/>
          <View style={styles.overlay}>
            <Overlay isVisible={ this.state.tournament_overlay_visible } onBackdropPress={ this.toggleTournamentOverlay }>
              <View>
                <Text>Tournament games produce a bracket. Click on users to advance them to the next round.</Text>
              </View>
            </Overlay>
          </View>
        </View>
      </View>
    )}
  }

  
render() {
  return (
    <View style={styles.container}>
      <View style={styles.gameTypeContainer}>
        <Title>Create new game for {this.state.group.name}</Title>
        {/* buttons that show each game type */}
        <View>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.selected_index}
          buttons={["Counter", "Tournament"]}
        />
        </View>
      </View>
      

      {this.showGameOptions(this.state.game_type)}
      
      
    </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameTypeContainer:{
    flex:1,
  },
  gameOptionsContainer:{
    // alignItems: "top",
    // backgroundColor: "blue", 
    flex: 10,
    position: "relative",
    top: 50
  },
  opponentsContainer:{
    flex:2,
    width: 250,
    alignSelf: "center",
  },
  submitContainer:{
    flex:3,
    width: 250,
    alignSelf: "center",
  },
  textInput: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  }
})

export default CreateNewGame;