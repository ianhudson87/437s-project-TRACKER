import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { StyleSheet, TouchableOpacity, Text, Button, View, ScrollView } from 'react-native'
import { Icon, Overlay, Divider, ListItem } from 'react-native-elements'
import { Title } from 'react-native-paper'
import { getObjectByID, getObjectsByIDs } from "../constants/api"
import GameThumbnail from "../components/GameThumbnail"
import UserThumbnail from '../components/UserThumbnail'

class GroupPage extends Component {
constructor(props) {
  super(props);
  this.state = { 
    groupID: this.props.route.params.groupID,
    group: {name: "default"}, // contains group "object". get this from api
    loggedInUserID: null, // contains userID. get this from local storage
    usersInGroup: [], // contains list of user objects
    gamesInGroup: [], // contains list of game objects
    tournamentsInGroup: [], // contains list of tournament objects
    stats: {users_wins_dict: {}}, // stats of the group
    overlay_visible: false, // stats overlay visibility
    code_overlay_visible: false,
  }

  this.handleNewUser = this.handleNewUser.bind(this);
  this.handleNewGame = this.handleNewGame.bind(this);
  this.refreshInfo = this.refreshInfo.bind(this);
  this.toggleOverlay = this.toggleOverlay.bind(this);
  this.toggleCodeOverlay = this.toggleCodeOverlay.bind(this);
  this.getTitle = this.getTitle.bind(this);
}

componentDidMount(){
  this.props.navigation.addListener('focus', async ()=>{this.refreshInfo()}); // THIS REFRESHES THE PAGE EVERY TIME YOU GO BACK TO IT. 0.0
}

async refreshInfo(){
  // refresh all the information about the group
  console.log('REFRESH')

  let newState = {}
  AsyncStorage.getItem('loggedInUserID').then((value)=>{
    // get the id of the logged in user
    newState.loggedInUserID = value // this.setState({loggedInUserID: value})
  }).then(()=>{console.log("data: group:", newState)})



  // populate the usersInGroup list and gamesInGroup list
  getObjectByID({id: this.state.groupID, type: "group"}).then((response)=>{
    // get the group object
    if(response.object_exists){
      newState.group = response.object // this.setState({group: response.object})
      return response.object
    }
    else{
      return null
    }
  }).then( async (group)=>{
    console.log("GROUP:", group)

    // get stats of the group
    newState.stats = group.stats

    // GET ALL THE USERS IN THE GROUP
    let user_ids_in_group = group.users
    let response = await getObjectsByIDs({ids: user_ids_in_group, type: "user"})
    if(response.objects_exist){
      newState.usersInGroup = response.objects // this.setState({usersInGroup: response.objects})
    }

    // GET ALL THE GAMES IN THE GROUP
    let game_ids_in_group = group.games
    response = await getObjectsByIDs({ids: game_ids_in_group, type: "game"})
    if(response.objects_exist){
      console.log("length", response.objects.length)
      response.objects
      newState.gamesInGroup = response.objects.reverse() // this.setState({gamesInGroup: response.objects})
      console.log("set state for group page")
    }
    
    let tournament_ids_in_group = group.tournaments
    response = await getObjectsByIDs({ids: tournament_ids_in_group, type: "tournament"})
    console.log("ERESPONES POIJAPODIJAWD", response)
    if(response.objects_exist){
      // console.log("RESPONSE OBJECT", response.object)
      newState.tournamentsInGroup = response.objects// this.setState({tournamentsInGroup: response.objects})
    }
    // newState.tournamentsInGroup = tournaments_info_list// this.setState({tournamentsInGroup: tournaments_info_list})
    // console.log(this.state.tournamentsInGroup)
    // console.log("tournamentsInGroup", this.state.tournamentsInGroup)
    // tournament_ids_in_group.forEach((tournament_id) => {
    //   // push game info into list
    //   response = getObjectByID({id: tournament_id, type: "tournament"})
    //     console.log("RESPONSE", response)
    //     if(response.object_exists){
    //       console.log("RESPONSE OBJECT", response.object)
    //       tournaments_info_list.push(response.object)
    //     }
    //     newState.tournamentsInGroup = tournaments_info_list// this.setState({tournamentsInGroup: tournaments_info_list})
    //     console.log(this.state.tournamentsInGroup)
    //     console.log("tournamentsInGroup", this.state.tournamentsInGroup)
    //   })
    // })

    this.setState(newState)
  })
}

handleNewUser(){
    this.props.navigation.navigate("AddUserToGroup", {
        group: this.state.group,
        navigation: this.props.navigation,
        loggedInUser: this.state.loggedInUser
    });
}

// function for handling "create new game" button click
handleNewGame(){
  // redirect to create new game page
  // need to pass group and user that clicked the button
  this.props.navigation.navigate("CreateNewGame", {
    group: this.state.group,
    loggedInUser: this.state.loggedInUser
  });
}

toggleOverlay(){
  this.refreshInfo()
  this.setState({ overlay_visible: !this.state.overlay_visible })
}

toggleCodeOverlay(){
  // this.refreshInfo()
  this.setState({ code_overlay_visible: !this.state.code_overlay_visible })
}

getTitle(){
  return(
    <View>
      <Text>
        {this.state.group.name} <Icon reverse size={15} name="chart-areaspline" type="material-community" onPress={this.toggleOverlay} />
      </Text>
    </View>
  )
}

getLeaderboardIcon(pos){
  let icon_table = {0: 'podium-gold', 1: 'podium-silver', 2: 'podium-bronze', 'else': 'emoticon-poop'}
  if(pos <= 2){
    return icon_table[pos]
  }
  else{
    return icon_table['else']
  }
}
  
render() {

  this.props.navigation.setOptions({ headerTitle: this.getTitle(), headerRight: this.getLogout })
  // console.log("STATE", this.state)
  return (
    <View style={styles.container}>
      {/* <View style={styles.nameContainer}>
        <Text style={styles.nameText}>
          <Button title="stats" onPress={this.toggleOverlay} />
          
        </Text>
      </View> */}
      
      <View style={styles.usersContainer}>
        {/* {console.log("USERS HERE", this.state.usersInGroup)} */}
        <Title>Players <Icon size={15} reverse name="person-add" onPress={this.toggleCodeOverlay}/></Title>
        <ScrollView>
          { this.state.usersInGroup.map((user, key)=> (<UserThumbnail key={user._id} user={user} navigation={this.props.navigation} />)) }
        </ScrollView>
      </View>
        
      <View style={styles.gamesContainer}>
        <Title>Games <Icon size={15} name="create" reverse onPress={() => this.handleNewGame()} /></Title>
        <ScrollView style={{flex:1}}>
          {/* { console.log("GamesInGroup", this.state.gamesInGroup)} */}
          { this.state.gamesInGroup.map((game, key)=> (<GameThumbnail key={game._id} game={game} type="standard" navigation={this.props.navigation}/>)) }
        </ScrollView>

        <Divider />

        <ScrollView style={{flex:1}}>
          { this.state.tournamentsInGroup.map((tournament, key)=> (<GameThumbnail key={tournament._id} game={tournament} type="tournament" navigation={this.props.navigation}/>)) }
        </ScrollView>
      </View>
      
      <Overlay isVisible={ this.state.overlay_visible } onBackdropPress={ this.toggleOverlay }>
        <View>
          <Title> Total Games: {this.state.stats.total_num_of_games} (completed: {this.state.stats.num_finished_games}) </Title>
          <View>
            <ScrollView style={{height: 500}}>
            {Array.from(Object.values(this.state.stats.users_wins_dict)).sort((a,b) => {return a.wins < b.wins ? 1: -1}).map( (wins_user, index) => {
              return(
                <ListItem key={index} bottomDivider>
                  <ListItem.Content>
                    <Icon name={this.getLeaderboardIcon(index)} type="material-community" />
                    <ListItem.Title>{wins_user.user_name}</ListItem.Title>
                    <ListItem.Subtitle>{wins_user.wins} wins</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
                // <Text key={wins_user.user_name}> {wins_user.user_name}: {wins_user.wins} wins </Text>
              )
            })}
            </ScrollView>
          </View>
        </View>
      </Overlay>

      <Overlay isVisible={ this.state.code_overlay_visible } onBackdropPress={ this.toggleCodeOverlay }>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>
            Send this code to other people to allow them to join the group!
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20}}>
            {this.state.group.code}
          </Text>
        </View>
      </Overlay>

      {/* <Button title='Create new game' onPress={() => this.handleNewGame()} /> */}
    </View>
  )
}
}

const styles = StyleSheet.create({
  // scrollView: {
  //   flex: 1,
  //   backgroundColor: 'lightblue',
  //   marginHorizontal: 0,
  // },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usersContainer: {
    flex: 3,
  },
  gamesContainer: {
    flex: 3,
  },
})

export default GroupPage;