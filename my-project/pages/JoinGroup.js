import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  View,
} from 'react-native'
import { joinGroup, fetchGroups } from "../constants/api"

class JoinGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {groups: [], loggedInUserID: null}
    }

    componentDidMount(){
      AsyncStorage.getItem('loggedInUserID').then((value)=>{
        this.setState({loggedInUserID: value})
      })
      // console.log("USERUSER:", this.state.loggedInUser)
      let group_list = []
      fetchGroups().then((response)=>{
        let groups = response.groups
        groups.forEach((group)=>{group_list.push(group)})
        this.setState({groups: group_list})
      })

    }

    handleGroupPress(group, event)
    {    
      joinGroup(this.state.loggedInUserID, group._id).then((data)=>{
        console.log('reponse', data)
        if(data.error){
          alert('error in joining group')
        }
        else if(data.joined_group==false){
          alert('You are already in this group')
        }
        else{
          alert('joined group:'+ group.name + 'successfully')
          this.props.navigation.dispatch(CommonActions.goBack())
        }
      })
    }

  
render() {
    return (
      <View style={styles.container}>
        <Text>
            Groups:
        </Text>

        <Text>
        {
            this.state.groups.map((group, key)=> (<Button title={group.name} key={key} 
                onPress={(e) => this.handleGroupPress(group, e)}/>))
        }
        </Text>

        <Button title="Cancel" onPress={()=>{ this.props.navigation.dispatch(CommonActions.goBack()) }}/>
        
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

export default JoinGroup;