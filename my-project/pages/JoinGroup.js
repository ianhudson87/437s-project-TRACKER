import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'
import { Input, Button, Tooltip } from 'react-native-elements'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Modal,
  Icon,
} from 'react-native'
import { joinGroup } from "../constants/api"

class JoinGroup extends Component {
  constructor(props) {
      super(props);
      this.state = {
        code: '',
        loggedInUserID: null,
        validCode: true
      }

      this.handleChangeCode = this.handleChangeCode.bind(this)
      this.joinGroup = this.joinGroup.bind(this)
      this.invalidHandler = this.invalidHandler.bind(this)
  }

  componentDidMount(){
    AsyncStorage.getItem('loggedInUserID').then((value)=>{
      this.setState({ loggedInUserID: value })
    })
  }

  handleChangeCode(text){
    this.setState({ code: text })
  }

  async joinGroup(){
    this.setState({validCode: true})
    let res = await joinGroup(this.state.loggedInUserID, this.state.code)
    if(res.error){
      alert("Error in joining group")
    }
    else{
      if(res.joined_group == false){
        //alert(res.message)
        this.setState({validCode: false})
      }
      else{
        alert("Successfully joined group "+ res.group.name)
        this.props.navigation.goBack()
      }
    }
    console.log(res)
  }

  invalidHandler(){
    if(this.state.validCode){
      return (<View></View>)
    }
    else{
      return (
          <View>
              <Text style={{color: 'red', }}>The code you entered is incorrect</Text>
          </View>
      )
    }
  }
  
render() {
    return (
      <View style={styles.container}>
        <View>
          <Input
            placeholder="Group join code"
            value = {this.state.code}
            onChangeText={(text) => this.handleChangeCode(text)}
          />
          <Text>Each group has a join code that is displayed on the group page. Ask someone in the group for the code!</Text>
        </View>
        <Button
          title="Join!"
          onPress={this.joinGroup}
        />
        {this.invalidHandler()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 400,
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10
  }
})

export default JoinGroup;