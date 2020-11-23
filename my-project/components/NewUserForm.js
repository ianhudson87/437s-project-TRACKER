import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage'
import { createUser, verifyEmail } from "../constants/api"
import { Input, Icon, Overlay } from 'react-native-elements';

class NewUserForm extends Component {
    static defaultProps = {
        createUser
      }
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            verification_code: '', // what user inputs as verification_code
            pending_user: null, // user that has been created, but not been verified. This gets populated in handleRegister
            overlay_visible: false
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleVerificationCodeChange = this.handleVerificationCodeChange.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleVerify = this.handleVerify.bind(this);
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

    handleChangeEmail(text) {
        // handler for password box change
        this.setState({email: text});
    }

    handleVerificationCodeChange(text) {
        this.setState({verification_code: text})
    }

    handleRegister(event) {
        // handler for when register button gets pressed
        createUser(this.state.username, this.state.email, this.state.password).then((data)=>{
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
                // good registration. show verification popup
                console.log('NEW USER NAME:', data.user.name)
                
                this.setState({ overlay_visible: true, pending_user: data.user })
            }
        })
        
        this.setState({username: ''});
        this.setState({password: ''});
        event.preventDefault();
    }

    handleVerify() {
        console.log("handle verify")
        // handle when user tries to verify email
        console.log("VERIFY EMAIL", this.state.pending_user._id, this.state.verification_code)
        verifyEmail(this.state.pending_user._id, this.state.verification_code).then((response) => {
            if(!response.error){
                // no error
                if(response.verified){
                    // correct code
                    AsyncStorage.setItem( 'loggedInUserID', this.state.pending_user._id ) // set local storage var for userID
                    this.props.navigation.dispatch(
                        // reset the navigation so that you can't navigate back from the userhome page
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: 'UserHome', params: {firstTimeUser: true} }]
                        })
                    );
                }
                else{
                    // wrong code
                    alert("wrong code, try again")
                }
            }
            else{
                alert("There was an error with verifying email")
            }
        })
    }

    toggleOverlay() {
        this.setState({ overlay_visible: !this.state.overlay_visible })
    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder="name"
                    value={this.state.username}
                    onChangeText={(text)=>{this.handleChangeName(text)}}
                    leftIcon={<Icon name='fingerprint'/>}
                />
                <Input
                    placeholder="email"
                    value={this.state.email}
                    onChangeText={(text)=>{this.handleChangeEmail(text)}}
                    leftIcon={<Icon name='email'/>}
                />
                <Input
                    placeholder="password"
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(text)=>{this.handleChangePass(text)}}
                    leftIcon={<Icon name='lock'/>}
                />
                <Button title="Register" onPress={this.handleRegister} />
                <Button title="test" onPress={this.toggleOverlay} />

                <Overlay isVisible={ this.state.overlay_visible } onBackdropPress={ this.toggleOverlay }>
                    <Text> A code has been sent to you email. Input below to verify your email </Text>
                    <Input
                        placeholder="code"
                        value={this.state.verification_code}
                        onChangeText={(text)=>{this.handleVerificationCodeChange(text)}}
                    />
                    <Button title="Submit" onPress={this.handleVerify}/>
                    <Button title="Cancel Registration" />
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