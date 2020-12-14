import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import { Icon } from 'react-native-elements'
import { CommonActions } from '@react-navigation/native';


class LogoutButton extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {user: this.props.loggedInUser};

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log(this.props.navigation)
        // handler for logout button change
        this.props.navigation.dispatch(
            // reset the navigation so that you can't navigate back from the userhome page
            // StackActions.pop()
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Welcome' }
                ]
            })
        )
    }

    render() {
        return (
            <View>
                <Icon name="logout" type='material-community' onPress={(e) => this.handleClick(e)} />
            </View>
           
        )
    }
}

const styles = StyleSheet.create({
    text: {
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: 2,
    }
  })

export default LogoutButton;