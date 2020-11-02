import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { createUser } from "../constants/api"

class NewUserForm extends Component {
    static defaultProps = {
        createUser
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
        createUser(this.state.username, this.state.password).then((data)=>{
            console.log(data)
            this.setState({response: data})
            if(data.error){
                // error in creating user
                alert('error in creating user')
                this.setState({username: '', password: ''});
            }
            if(data.repeatedUser){
                // username already exists
                alert('Username already exists');
                this.setState({username: '', password: ''});
            }
            else{
                // good registration. go to user home page
                alert('Successfully registered')
                this.props.navigation.navigate('UserHome', {userID: data.user._id})
            }
        })
        
        this.setState({username: ''});
        this.setState({password: ''});
        event.preventDefault();
    }

    render() {
        return (
            // <form onSubmit={this.handleSubmit}>
            //     <label>
            //         Username:
            //         <input type="text" value={this.state.username} onChange={this.handleChangeName} />
            //     </label>
            //     <label>
            //         Password:
            //         <input type="password" value={this.state.password} onChange={this.handleChangePass} />
            //     </label>
            //     <input type="submit" value="Register" />
            // </form>
            <View>
                <Text>Username:</Text>
                <TextInput value={this.state.username} onChangeText={(text)=>{this.handleChangeName(text)}} style={styles.text}/>
                <Text>Password:</Text>
                <TextInput secureTextEntry={true} value={this.state.password} onChangeText={(text)=>{this.handleChangePass(text)}} style={styles.text}/>
                <Button title="Register" onPress={this.handleSubmit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: 2
    }
  })

export default NewUserForm;