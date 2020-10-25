import React, { Component } from 'react'
import { View, Text, TextInput, Button} from 'react-native'
import { createUser, loginUser } from "./constants/api"

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

    handleChangeName(event) {
        // handler for name box change
        this.setState({username: event.target.value});
    }

    handleChangePass(event) {
        // handler for password box change
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        // handler for when submit button gets pressed
        alert('Login request submitted');

        loginUser(this.state.username, this.state.password).then((data)=>{
            this.setState({response: data});
            if(data.userExists && data.correctPassword){ // user exists and password correct
                console.log(data.user.name + " logged in");
            }
            else if(data.userExists){ // user exists but password is incorrect
                console.log("Wrong password");
            }
            else{ // user does not exist
                console.log("User does not exist");
            }
            
        })
        
        this.setState({username: ''});
        this.setState({password: ''});
        event.preventDefault();
    }

    render() {
        return (
            <View>
                <Text>Username:</Text>
                <TextInput value={this.state.username} onChange={this.handleChangeName}/>
                <Text>Password:</Text>
                <TextInput secureTextEntry={true} value={this.state.password} onChange={this.handleChangePass}/>
                <Button title="Login" onPress={this.handleSubmit} />
            </View>
        )
    }
}

export default LoginForm;