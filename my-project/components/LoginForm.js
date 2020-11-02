import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native'
import { createUser, loginUser } from "../constants/api"

class LoginForm extends Component {
    static defaultProps = {
        createUser,
        loginUser
      }
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(text) {
        // handler for name box change
        this.setState({username: text});
    }

    handleChangePass(text) {
        // handler for password box change
        this.setState({password: text});
    }

    handleSubmit(event) {
        // handler for when submit button gets pressed

        loginUser(this.state.username, this.state.password).then((data)=>{
            this.setState({response: data});
            if(data.userExists && data.correctPassword){ // user exists and password correct
                console.log(data.user.name + " logged in");
                console.log("THIS IS WHAT I WANT", data.user._id)
                AsyncStorage.setItem( 'loggedInUserID', data.user._id )// save user_id as session variable. tutorial: https://www.tutorialspoint.com/react_native/react_native_asyncstorage.htm
                
                this.props.navigation.dispatch(
                    // reset the navigation so that you can't navigate back from the userhome page
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'UserHome' }
                        ]
                    })
                );
                //this.props.navigation.navigate("UserHome");
            }
            else if(data.userExists){ // user exists but password is incorrect
                console.log("Wrong password");
                alert("Wrong password")
            }
            else{ // user does not exist
                console.log("User does not exist");
                alert("User does not exist")
            }
            
        })
        
        this.setState({username: ''});
        this.setState({password: ''});
        event.preventDefault();
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <View>
                <Text>Username:</Text>
                <TextInput value={this.state.username} onChangeText={(text) => {this.handleChangeName(text)}} style={styles.text}/>
                <Text>Password:</Text>
                <TextInput secureTextEntry={true} value={this.state.password} onChangeText={(text) => {this.handleChangePass(text)}} style={styles.text} />
                <Button title="Login" onPress={(e) => this.handleSubmit(e)} />
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

export default LoginForm;