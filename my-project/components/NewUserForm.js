import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage'
import { createUser } from "../constants/api"
import { Input, Icon, Overlay } from 'react-native-elements';

class NewUserForm extends Component {
    static defaultProps = {
        createUser
      }
    constructor(props) {
        super(props);
        this.state = {username: '', password: '', overlay_visible: false};

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
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
            else if(data.repeatedUser){
                // username already exists
                alert('Username already exists');
                this.setState({username: '', password: ''});
            }
            else{
                // good registration. go to user home page
                //alert('Successfully registered')
                console.log('NEW USER NAME:', data.user.name)
                AsyncStorage.setItem( 'loggedInUserID', data.user._id ) // set local storage var for userID

                this.props.navigation.dispatch(
                    // reset the navigation so that you can't navigate back from the userhome page
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {
                                name: 'UserHome',
                                params: {firstTimeUser: true}
                            }
                        ]
                    })
                );
                // this.props.navigation.navigate('UserHome', {firstTimeUser: true})
            }
        })
        
        this.setState({username: ''});
        this.setState({password: ''});
        event.preventDefault();
    }

    toggleOverlay() {
        this.setState({ overlay_visible: !this.state.overlay_visible })
    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder="email"
                    value={this.state.username}
                    onChangeText={(text)=>{this.handleChangeName(text)}}
                    leftIcon={<Icon name='email'/>}
                />
                <Input
                    placeholder="password"
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(text)=>{this.handleChangePass(text)}}
                    leftIcon={<Icon name='lock'/>}
                />
                <Button title="Register" onPress={this.handleSubmit} />
                <Button title="test" onPress={this.toggleOverlay} />

                <Overlay isVisible={ this.state.overlay_visible } onBackdropPress={ this.toggleOverlay }>
                    <Text>hi</Text>
                </Overlay>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 400,
    },
    text: {
    }
  })

export default NewUserForm;