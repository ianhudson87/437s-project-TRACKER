import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native'
import { Input, Icon } from 'react-native-elements';
import { CommonActions } from '@react-navigation/native';
import { createGroup, joinGroup } from "../constants/api"


class CreateNewGroupForm extends Component {
    static defaultProps = {
        createGroup
      }
    constructor(props) {
        super(props);
        // user id is in this.props.loggedInUserID
        this.state = {
            group_name: '',
            group_description: '',
            games_require_accept: true,
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    handleChangeName(text) {
        // handler for name box change
        this.setState({group_name: text});
    }

    handleChangeDescription(text) {
        // handler for name box change
        this.setState({group_description: text});
    }

    handleSubmit(event) {
        // handler for when submit button gets pressed
        console.log("OVER HERE", this.props.loggedInUserID)
        console.log(this.state.group_name)
        console.log(this.state.group_description)
        let description = this.state.group_description === '' ? 'none' : this.state.group_description
        createGroup(this.state.group_name, description, this.props.loggedInUserID, this.state.games_require_accept).then((data)=>{
            this.setState({response: data});
            if(data.repeatedGroup == false){ // group successfully created
                console.log("Data: " + data.group);

                alert("Group "+ data.group.name+ " successfully created")

                // redirect back to the user home page
                this.props.navigation.dispatch(CommonActions.goBack());

            }
            else{
                // group name repeated
                console.log("Group name taken");
                alert("Group name "+ this.state.group_name+ " is taken")
            }
            
        })

        
        this.setState({group_name: ''});
        this.setState({group_description: ''});
        event.preventDefault();
    }

    handleCancel(){
        this.props.navigation.dispatch(CommonActions.goBack());
    }

    handleSwitchChange(value){
        this.setState({ games_require_accept: value })
    }

    render() {
        console.log("RENDER2")
        console.log(this.state)
        console.log(this.props.loggedInUserID)
        return (
            <View style={{width: 400, alignSelf:'center'}}>
                {/* <TextInput value={this.state.group_name} onChangeText={(text) => {this.handleChange(text)}} style={styles.text}/> */}
                <Input 
                    placeholder="New Group Name"
                    value={this.state.group_name} 
                    onChangeText={(text) => {this.handleChangeName(text)}}
                /> 
                <Input 
                    placeholder="Group Description"
                    value={this.state.group_description} 
                    onChangeText={(text) => {this.handleChangeDescription(text)}}
                /> 
                {/* <Text>Games require acceptance: <Switch value = {this.state.games_require_accept} onValueChange={this.handleSwitchChange} /> </Text> */}
                <Button title="Create Group" onPress={(e) => this.handleSubmit(e)} />
                {/* <Button title="Cancel" onPress={(e) => this.handleCancel(e)} /> */}
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

export default CreateNewGroupForm;