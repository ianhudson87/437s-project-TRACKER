// Thumbnail for displaying an update in the feed

import React, { Component } from 'react'
import { format, formatDistance, formatRelative } from "date-fns";
import {
  StyleSheet,
  Text,
  Platform,
  TextInput,
  Button,
  View,
} from 'react-native'
import { Card, ListItem, Icon } from 'react-native-elements'
import { getObjectByID } from '../constants/api';
import GameThumbnail from './GameThumbnail';
import GroupThumbnail from './GroupThumbnail'

class FeedObject extends Component {
  // gets passed a feed object ex: {time: 78912, type: 1, data: [object]}
  // data depends on what the type is

  constructor(props) {
    super(props);

    this.state = {
      time: this.props.feed.time,
      type: this.props.feed.type,
        /* types
        0: "user joined group" event. input_data: {group_id: group_id, user: user}
        */
      input_data: this.props.feed.data,
      generated_data: null, // generated from input_data
    }

    this.generateNeededInfo = this.generateNeededInfo.bind(this);
  }

  componentDidMount(){
    this.generateNeededInfo()
  }

  generateNeededInfo(){
    // generate necessary info for displaying the feed object
    switch(this.state.type){
      case 0:
        // need to get the group object
        getObjectByID({id: this.state.input_data.group_id, type: "group"}).then((data)=>{
          if(data.object_exists){
            this.setState({generated_data: {group: data.object, user: this.state.input_data.user}})
          }
        })
        break;
      case 1:
        // determine if friend won or lost the game
        let game = this.props.feed.data.game
        let friend_object = this.props.feed.data.friend
        let scores = game.scores
        let user_ids = game.users
        let goal_score = game.goal_score
        let update_time_string = this.props.feed.data.game.updatedAt
        let update_time = null
        
        // get index of player who won
        let winner_player_index = scores.findIndex((elt)=>{ return elt>=goal_score })

        let winner_player_id = user_ids[winner_player_index] // get id of player who won
        let friend_won = winner_player_id == friend_object._id

        // determine the time of when the game finished
        if(update_time_string){
          update_time = new Date( update_time_string.substring(0, update_time_string.length-5) + "Z" )
        }

        console.log("update_time", update_time)
        this.setState({ generated_data: { friend_won: friend_won }, time: update_time })
        break;
      default:
        console.log('type not handled: ', this.state.type)
    }
  }

  
  render() {
    switch(this.state.type){
      // depending on the type of the feed object render different things
      case 0:
        if(this.state.generated_data){
          // if the data needed to display the feed update has been gotten
          let formatted_date
          let group = this.state.generated_data.group
          let user = this.state.generated_data.user
          try{ formatted_date = formatDistance(new Date(this.state.time), new Date()) }
          catch(e){ formatted_date = "unknown date" }

          let text = user.name + " joined " + group.name + " " + formatted_date + " ago."
          return(
            <Card>
              <Text style={{marginBottom: 10}}>
                  {text}
              </Text>
              <View style={styles.shadow}>
                <GroupThumbnail group={group} key={group._id} navigation={this.props.navigation}/>
              </View>
            </Card>

          )
        }
        else{
          // necessary data has not been gotten yet
          return(
            <Card>
              <Text style={{marginBottom: 10}}>
                  Loading...
              </Text>
            </Card>
          )
        }
      case 1:
        if(this.state.generated_data){
          //console.log("PROPS", this.props)
          let game = this.props.feed.data.game
          let friend = this.props.feed.data.friend
          let win_lost = this.state.generated_data.friend_won ? "WON" : "LOST"
          let formatted_date
          // console.log("look here", this.state)
          try{ formatted_date = formatDistance(this.state.time, new Date()) }
          catch(e){ formatted_date = "unknown date" }
          let text = friend.name + " " + win_lost + " " + game.name + " " + formatted_date + " ago"
          return(
            <Card>
              <Text>{text}</Text>
              <Card.Divider/>
              <View style={styles.shadow}>
                <GameThumbnail key={game._id} game={game} navigation={this.props.navigation}/>
              </View>
              
            </Card>
          )
        }
        else{
          // necessary data has not been gotten yet
          return(
            <Card>
              <Text style={{marginBottom: 10}}>
                  Loading...
              </Text>
            </Card>
          )
        }
        
      default:
        return(
          <View>
            <Text>
              unknown feed object type: {this.state.type}
            </Text>
          </View>
        )

    }
  }
}

const stylesByPlatform = Platform.select({
  ios: {
    fontFamily: 'Papyrus',
    fontWeight: 'bold',
  },
  android: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    borderRadius: 3,
  },
  text:{
    ...stylesByPlatform,
    padding: 2,
    color: 'white',
    fontSize: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  }
})

export default FeedObject;