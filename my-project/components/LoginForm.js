import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native'
import { createUser, loginUser } from "../constants/api"
import { Input, Icon } from 'react-native-elements';

class LoginForm extends Component {
    static defaultProps = {
        createUser,
        loginUser
      }
    constructor(props) {
        super(props);
        this.state = {
            username: '', 
            password: '',
            validUser: true,
            validPassword: true
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.wrongUserHandler = this.wrongUserHandler.bind(this);
        this.wrongPasswordHandler = this.wrongPasswordHandler.bind(this);
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
            this.setState({validUser: true, validPassword: true})
            if(data.userExists && data.correctPassword){ // user exists and password correct
                console.log(data.user.name + " logged in");
                console.log("THIS IS WHAT I WANT", data.user._id)
                AsyncStorage.setItem( 'loggedInUserID', data.user._id )// save user_id as session variable. tutorial: https://www.tutorialspoint.com/react_native/react_native_asyncstorage.htm
                
                this.props.navigation.dispatch(
                    // reset the navigation so that you can't navigate back from the userhome page
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {
                                name: 'UserHome',
                                params: {firstTimeUser: false}
                            }
                        ]
                    })
                );
                //this.props.navigation.navigate("UserHome");
            }
            else if(data.userExists){ // user exists but password is incorrect
                console.log("Wrong password");
                //alert("Wrong password")
                this.setState({validPassword: false})
            }
            else{ // user does not exist
                console.log("User does not exist");
                //alert("User does not exist")
                this.setState({validUser: false})
            }
            
        })
        
        this.setState({username: ''});
        this.setState({password: ''});
        event.preventDefault();
    }

    wrongUserHandler(){
        if(this.state.validUser){
            return (<View></View>)
        }
        else{
            return (
                <View>
                    <Text style={{color: 'red', }}>The username you entered does not exist</Text>
                </View>
            )
        }
    }

    wrongPasswordHandler(){
        if(this.state.validPassword){
            return (<View></View>)
        }
        else{
            return (
                <View>
                    <Text style={{color: 'red', }}>The password you entered is incorrect</Text>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder="name"
                    value={this.state.username}
                    onChangeText={(text) => {this.handleChangeName(text)}}
                    style={styles.text}
                    leftIcon={<Icon name='fingerprint'/>}
                />
                <Input
                    placeholder="password"
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(text) => {this.handleChangePass(text)}}
                    style={styles.text}
                    leftIcon={<Icon name='lock'/>}
                />
                <Button title="Login" onPress={(e) => this.handleSubmit(e)} />
                {this.wrongUserHandler()}
                {this.wrongPasswordHandler()}
            </View>
           
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 400
    },
    text: {
    }
  })

export default LoginForm;