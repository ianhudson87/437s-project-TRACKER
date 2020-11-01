import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
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

    handleSubmit(navigation, event) {
        // handler for when submit button gets pressed
        console.log(navigation);

        loginUser(this.state.username, this.state.password).then((data)=>{
            this.setState({response: data});
            if(data.userExists && data.correctPassword){ // user exists and password correct
                console.log(data.user.name + " logged in");
                this.props.navigation.navigate("UserHome", {
                    itemId: 86,
                    user: data.user
                });
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
        const navigation = this.props.navigation;
        return (
            <View>
                <Text>Username:</Text>
                <TextInput value={this.state.username} onChangeText={(text) => {this.handleChangeName(text)}} style={styles.text}/>
                <Text>Password:</Text>
                <TextInput secureTextEntry={true} value={this.state.password} onChangeText={(text) => {this.handleChangePass(text)}} style={styles.text} />
                <Button title="Login" onPress={(e) => this.handleSubmit(navigation, e)} />
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