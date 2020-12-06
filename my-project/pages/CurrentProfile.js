// SHOW USER PROFILE OF USER THAT IS CURRENTLY LOGGED IN
import React, { Component } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import UserProfile from './UserProfile'
import { CommonActions } from '@react-navigation/native';

class CurrentProfile extends Component {

constructor(props) {
  super(props);
  this.state = {
    profileUserID: null
  }
}

componentDidMount(){
    AsyncStorage.getItem('loggedInUserID').then((value)=>{
        // get the id of the logged in user
        // this.setState({profileUserID: value})
        // this.props.navigation.navigate('UserProfile', {profileUserID: value})
        this.props.navigation.dispatch(
            // reset the navigation so that you can't navigate back from the userhome page
            CommonActions.reset({
                index: 1,
                routes: [{ name: 'UserProfile', params: {profileUserID: value} }]
            })
        );
    })
}

render() {
    return(
        <View />
    )
// }
}
}


export default CurrentProfile;