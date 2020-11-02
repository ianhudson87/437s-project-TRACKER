import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import { CommonActions } from '@react-navigation/native';


class LogoutButton extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {user: this.props.loggedInUser};

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // handler for name box change
        this.props.navigation.navigate("Login");
        // this.props.navigation.navigate("AddUserToGroup", {
        //     itemId: 86,
        //     group: this.state.group,
        //     navigation: this.props.navigation,
        //     loggedInUser: this.state.loggedInUser
        // });
    }

    render() {
        return (
            <View>
                <Button title="Logout" onPress={(e) => this.handleClick(e)} />
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