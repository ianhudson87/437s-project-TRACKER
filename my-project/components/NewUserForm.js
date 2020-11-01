import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
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
        alert('New user registration was submitted');
        createUser(this.state.username, this.state.password).then((data)=>{
            this.setState({response: data})
            if(data.repeatedUser){
                alert('Username already exists');
                this.setState({username: '', password: ''});
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
                <TextInput value={this.state.username} onChange={this.handleChangeName} style={styles.text}/>
                <Text>Password:</Text>
                <TextInput secureTextEntry={true} value={this.state.password} onChange={this.handleChangePass} style={styles.text}/>
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