// Thumbnail for displaying an update in the feed

import React, { Component } from 'react'
import { format } from "date-fns";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native'
import { getObjectByID } from '../constants/api';

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
      default:
        console.log('type not handled: ', this.state.type)
    }
  }

  
  render() {
    switch(this.state.type){
      // depending on the type of the feed object render different things
      case 0:
        if(this.state.generated_data){
          console.log(this.state.generated_data)
          // if the data needed to display the feed update has been gotten
          return(
            <View style={styles.container}>
              <Text>
                {
                  this.state.generated_data.user.name
                } joined group {
                  this.state.generated_data.group.name
                } at {
                  format(new Date(this.state.time), "MMMM do, yyyy H:mma")
                }
              </Text>
            </View>
          )
        }
        else{
          // necessary data has not been gotten yet
          return(
            <View>
              <Text>
                loading data...
              </Text>
            </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default FeedObject;