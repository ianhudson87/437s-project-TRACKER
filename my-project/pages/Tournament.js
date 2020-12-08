// Page for displaying game
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ScrollView
} from 'react-native'
import { getObjectByID, moveToNextRound } from '../constants/api'
import { getSocket } from '../constants/socketio'

class Tournament extends Component {
  // need to have the game object passed as a prop

  constructor(props) {
    super(props);
    // info about the group, scores, and users for the game
    this.state = {
      game: this.props.route.params.game, // stores tournament object that we want to display
      users: [], // stores user objects of users in the game (because the game object only stores user ids)
      results: [], // contains id of user at each position in tournament
      results_objects: [], // contains name of user at each position in tournament
      first_round: [],
      second_round: [],
      third_round: [],
      fourth_round: [],
      fifth_round: [],
      results_to_display: [[], [], [], [], []],
      numRounds: 0
    }
    
    this.populateUsersArray = this.populateUsersArray.bind(this)
    this.populateResultsArray = this.populateResultsArray.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.bracketDisplayHandler = this.bracketDisplayHandler.bind(this)
  }

  componentDidMount(){
    this.populateUsersArray()
    this.populateResultsArray()
    console.log("data: game:", this.state.game)

    this.socket = getSocket()
    this.socket.emit('join_room', {
      // tell socket to put user into a room so that they can send/recieve updates to the game in real time
      game_id: this.state.game._id
    })

    this.socket.on('refresh_score', (data)=>{
      console.log('REFRESH SCORE')
      getObjectByID({id: this.state.game._id, type: 'tournament'}).then((response) => {
        console.log('RESPONSE', response)
        if(response.object_exists){
          this.setState({ game: response.object })
          this.populateResultsArray() // updates the tournament results in the display
        }
      })
    })
  }

  populateUsersArray(){
    // populate the this.state.users array
    let user_object_list = []
    console.log("Populate Array")
    console.log(this.state.game.results)
    this.state.game.users.forEach((user_id, index) => {
      getObjectByID({id: user_id, type: 'user'}).then((response) => {
        if(response.object_exists){
          user_object_list.push(response.object)
        }
      })
    })
    this.setState({users: user_object_list, results: this.state.game.results}) // update state of component
  }

  populateResultsArray(){
    // populate the this.state.results_objects array
    // let results_object_list = []
    // let first_round = []
    // let second_round = []
    // let third_round = []
    // let fourth_round = []
    // let fifth_round = []
    // console.log(this.state.game.results)
    // this.state.game.results.forEach((user_id, index) => {
    //   if(index > 14){
    //     if(user_id != 0){
    //       getObjectByID({id: user_id, type: 'user'}).then((response) => {
    //         if(response.object_exists){  
    //           first_round[index] = response.object
    //         }
    //         this.setState({first_round: first_round}) // update state of component
    //       })
    //     }
    //     else{
    //       first_round[index] = {name: '           '}
    //       this.setState({first_round: first_round}) // update state of component
    //     }
    //   }
    //   else if(index > 6){
    //     if(user_id != 0){
    //       getObjectByID({id: user_id, type: 'user'}).then((response) => {
    //         if(response.object_exists){  
    //           second_round[index] = response.object
    //         }
    //         this.setState({second_round: second_round}) // update state of component
    //       })
    //     }
    //     else{
    //       second_round[index] = {name: '           '}
    //       this.setState({second_round: second_round}) // update state of component
    //     }
    //   }
    //   else if(index > 2){
    //     if(user_id != 0){
    //       getObjectByID({id: user_id, type: 'user'}).then((response) => {
    //         if(response.object_exists){  
    //           third_round[index] = response.object
    //         }
    //         this.setState({third_round: third_round}) // update state of component
    //       })
    //     }
    //     else{
    //       third_round[index] = {name: '           '}
    //       this.setState({third_round: third_round}) // update state of component
    //     }
    //   }
    //   else if(index > 0){
    //     if(user_id != 0){
    //       getObjectByID({id: user_id, type: 'user'}).then((response) => {
    //         if(response.object_exists){  
    //           fourth_round[index] = response.object
    //         }
    //         this.setState({fourth_round: fourth_round}) // update state of component
    //       })
    //     }
    //     else{
    //       fourth_round[index] = {name: '           '}
    //       this.setState({fourth_round: fourth_round}) // update state of component
    //     }
    //   }
    //   else{
    //     if(user_id != 0){
    //       getObjectByID({id: user_id, type: 'user'}).then((response) => {
    //         if(response.object_exists){  
    //           fifth_round[index] = response.object
    //         }
    //         this.setState({fifth_round: fifth_round}) // update state of component
    //       })
    //     }
    //     else{
    //       fifth_round[index] = {name: '           '}
    //       this.setState({fifth_round: fifth_round}) // update state of component
    //     }
    //   }
      
    // })
    
    console.log("POPULATE")
    let results = []
    let numRounds = Math.log2(this.state.game.results.length+1)
    this.setState({numRounds: numRounds})
    for(let i = 0; i < numRounds; i++){
      results[i] = []
    }
    this.state.game.results.forEach((user_id, index) => {
      let added = false
      for(let i = numRounds-1; i >= 0; i--){
        if(index >= Math.pow(2, i)-1 && !added){
          added = true
          if(user_id != 0){
            getObjectByID({id: user_id, type: 'user'}).then((response) => {
              if(response.object_exists){  
                results[(numRounds-1)-i][index-Math.pow(2, i)+1] = response.object
              }
              this.setState({results_to_display: results}, ()=>{
                console.log(this.state.results_to_display)
              }) // update state of component
            })
          }
          else{
            results[(numRounds-1)-i][index-Math.pow(2, i)+1] = {name: '           ', _id: index}
            this.setState({results_to_display: results}, ()=>{
              console.log(this.state.results_to_display)
            }) // update state of component
          }
        }
      }
    })
  }

  handleClick(user, key, roundNum){
    console.log("Handle click")
    console.log(user)
    console.log(key + Math.pow(2, roundNum) - 1)
    let resultData = {
      tournament_id: this.state.game._id,
      index: key + Math.pow(2, roundNum) - 1
    }
    moveToNextRound(resultData).then((response)=>{
      console.log("MOVE ROUND RESPONSE", response)
      if(response.tournament_updated){
        this.socket.emit('changed_score', {
          game_id: this.state.game._id
        }) // tells other people to change their scores
        // game is updated on server. display updated game
        this.setState({game: response.updated_tournament})
        this.populateUsersArray() // update the list of user just in case
      }
      else if(response.error){
        // tournament failed to update
        console.log("ERROR")
      }
      else{
        console.log("Invalid button pressed")
      }
    })
  }

  bracketDisplayHandler(numRounds){
    if(numRounds == 3){
      return(
        <View style={styles.bracketContainer}>
          <View style={styles.first_round}>
            <Text style={styles.roundNum}>Round 1</Text>
            {this.state.results_to_display[0].map((user, key)=> {
            if(key%2==0)
              return (
                <View style={styles.button}>
                  <Button title={user.name} key={user._id} 
                    onPress={(e) => this.handleClick(user, key, 2, e)}/>
                </View>
              )
              return (
                <View style={styles.buttonOdd}>
                  <Button title={user.name} key={user._id} 
                    onPress={(e) => this.handleClick(user, key, 2, e)}/>
                </View>
              )
            })} 
    
          </View>
          <View style={styles.second_round}>
            <Text style={styles.roundNum}>Round 2</Text>
            {this.state.results_to_display[1].map((user, key)=> (
              <View style={styles.button}>
                <Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 1, e)}/>
              </View>
            ))}  
          </View>
          <View style={styles.third_round}>
            <Text style={styles.roundNum}>Round 3</Text>
            {this.state.results_to_display[2].map((user, key)=> (
              <View style={styles.button}>
                <Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 0, e)}/>
              </View>
            ))}  
          </View>
        </View>
      )
    }
    else if(numRounds == 4){
      console.log(this.state.results_to_display[0])
      return(
        <View style={styles.bracketContainer}>
          <View style={styles.first_round}>
            <Text style={styles.roundNum}>Round 1</Text>
            {this.state.results_to_display[0].map((user, key)=> {
            if(key%2==0)
              return (
                <View style={styles.button}>
                  <Button title={user.name} key={user._id} 
                    onPress={(e) => this.handleClick(user, key, 3, e)}/>
                </View>
              )
              return (
                <View style={styles.buttonOdd}>
                  <Button title={user.name} key={user._id} 
                    onPress={(e) => this.handleClick(user, key, 3, e)}/>
                </View>
              )
            })} 
          </View>
          <View style={styles.second_round}>
            <Text style={styles.roundNum}>Round 2</Text>
            {this.state.results_to_display[1].map((user, key)=> {
            if(key%2==0)
              return (
                <View style={styles.button}>
                  <Button title={user.name} key={user._id} 
                    onPress={(e) => this.handleClick(user, key, 2, e)}/>
                </View>
              )
              return (
                <View style={styles.buttonOdd}>
                  <Button title={user.name} key={user._id} 
                    onPress={(e) => this.handleClick(user, key, 2, e)}/>
                </View>
              )
            })} 
          </View>
          <View style={styles.third_round}>
            <Text style={styles.roundNum}>Round 3</Text>
            {this.state.results_to_display[2].map((user, key)=> (
              <View style={styles.button}>
                <Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 1, e)}/>
              </View>
            ))}  
          </View>
          <View style={styles.fourth_round}>
            <Text style={styles.roundNum}>Round 4</Text>
            {this.state.results_to_display[3].map((user, key)=> (
              <View style={styles.button}>
                <Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 0, e)}/>
              </View>
            ))} 
          </View>
        </View>
      )
    }
    else if(numRounds == 5){
      return(
        <View style={styles.bracketContainer}>
          <View style={styles.first_round}>
            <Text style={styles.roundNum}>Round 1</Text>
            {this.state.results_to_display[0].map((user, key)=> (<Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 4, e)}/>))} 
          </View>
          <View style={styles.second_round}>
            <Text style={styles.roundNum}>Round 2</Text>
            {this.state.results_to_display[1].map((user, key)=> (<Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 3, e)}/>))} 
          </View>
          <View style={styles.third_round}>
            <Text style={styles.roundNum}>Round 3</Text>
            {this.state.results_to_display[2].map((user, key)=> (<Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 2, e)}/>))} 
          </View>
          <View style={styles.fourth_round}>
            <Text style={styles.roundNum}>Round 4</Text>
            {this.state.results_to_display[3].map((user, key)=> (<Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 1, e)}/>))} 
          </View>
          <View style={styles.fifth_round}>
            <Text style={styles.roundNum}>Round 5</Text>
            {this.state.results_to_display[4].map((user, key)=> (<Button title={user.name} key={user._id} 
                  onPress={(e) => this.handleClick(user, key, 0, e)}/>))} 
          </View>
        </View>
      )
    }
    else{
      return(<View></View>)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.nameContainer}>
          Tournament: {this.state.game.name}
        </Text> */}
        {this.bracketDisplayHandler(this.state.numRounds)}
        {/*<View style={styles.bracketContainer}>
  
          {/* <Text>Bracket:</Text>
            {this.state.results_objects.map((user, key)=> (<Button title={user.name} key={key} 
                  onPress={(e) => this.handleClick(user, key, e)}/>))} *
          <View style={styles.first_round}>
            {this.state.results_to_display[0].map((user, key)=> (<Button title={user.name} key={key} 
                  onPress={(e) => this.handleClick(user, key, 4, e)}/>))} 
          </View>
          <View style={styles.second_round}>
            {this.state.results_to_display[1].map((user, key)=> (<Button title={user.name} key={key} 
                  onPress={(e) => this.handleClick(user, key, 3, e)}/>))} 
          </View>
          <View style={styles.third_round}>
            {this.state.results_to_display[2].map((user, key)=> (<Button title={user.name} key={key} 
                  onPress={(e) => this.handleClick(user, key, 2, e)}/>))} 
          </View>
          <View style={styles.fourth_round}>
            {this.state.results_to_display[3].map((user, key)=> (<Button title={user.name} key={key} 
                  onPress={(e) => this.handleClick(user, key, 1, e)}/>))} 
          </View>
          <View style={styles.fifth_round}>
            {this.state.results_to_display[4].map((user, key)=> (<Button title={user.name} key={key} 
                  onPress={(e) => this.handleClick(user, key, 0, e)}/>))} 
          </View>
            </View> */}
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
    // alignItems: 'center',
    // backgroundColor: '#DDDDDD',
    // padding: 10,
    // marginBottom: 30,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'pink',
    fontColor: 'green',
    marginBottom: 4
  },
  buttonOdd: {
    // alignItems: 'center',
    // backgroundColor: '#DDDDDD',
    // padding: 10,
    // marginBottom: 30,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'pink',
    fontColor: 'green',
    marginBottom: 12
  },
  text: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  nameContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    fontWeight: "bold",
  },
  bracketContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "20%",
    flexDirection: 'row',
  },
  usersListContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    marginHorizontal: 0,
    //height: "30%",
    width: "120%"
  },
  first_round: {
    flex: 5,
    flexDirection: "column",
    padding: 10
  },
  second_round: {
    flex: 5,
    flexDirection: "column",
    padding: 10
  },
  third_round: {
    flex: 5,
    flexDirection: "column",
    padding: 10
  },
  fourth_round: {
    flex: 5,
    flexDirection: "column"
  },
  fifth_round: {
    flex: 5,
    flexDirection: "column"
  },
  roundNum: {
    textAlign: "center",
    fontWeight: "bold",
  }
})

export default Tournament;