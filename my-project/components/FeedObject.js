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
          // if the data needed to display the feed update has been gotten
          let formatted_date
          try{ formatted_date = formatDistance(new Date(this.state.time), new Date()) }
          catch(e){ formatted_date = "unknown date" }
          let text = this.state.generated_data.user.name + " joined group " + this.state.generated_data.group.name + " " + formatted_date + " ago."
          return(
            <Card>
              <Text style={{marginBottom: 10}}>
                  {text}
              </Text>
              <Button
                  icon={<Icon name='code' color='#ffffff' />}
                  buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                  title='VIEW NOW' />
            </Card>
            
            // <View style={styles.container}>
            //   <Text style={styles.text}>
            //     {
            //       this.state.generated_data.user.name
            //     } joined group {
            //       this.state.generated_data.group.name
            //     } at {
            //       formatted_date
            //     }
            //   </Text>
            // </View>
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
  }
})

export default FeedObject;