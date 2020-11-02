import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import { CommonActions } from '@react-navigation/native';
import { createGroup, joinGroup } from "../constants/api"


class CreateNewGroupForm extends Component {
    static defaultProps = {
        createGroup
      }
    constructor(props) {
        super(props);
        this.state = {group_name: '', user: this.props.loggedInUser};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(text) {
        // handler for name box change
        this.setState({group_name: text});
    }

    handleSubmit(event) {
        // handler for when submit button gets pressed

        createGroup(this.state.group_name).then((data)=>{
            this.setState({response: data});
            if(data.repeatedGroup == false){ // group successfully created
                console.log("Data: " + data.group);

                // put creator into group
                joinGroup(this.state.user._id, data.group._id)

                alert("Group"+ data.group.name+ "successfully created")

                // redirect back to the user home page
                this.props.navigation.dispatch(CommonActions.goBack());

            }
            else{
                // group name repeated
                console.log("Group name taken");
                alert("Group name"+ this.state.group_name+ "is taken")
            }
            
        })

        
        this.setState({group_name: ''});
        event.preventDefault();
    }

    render() {
        return (
            <View>
                <TextInput value={this.state.group_name} onChangeText={(text) => {this.handleChange(text)}} style={styles.text}/>
                
                <Button title="Create Group" onPress={(e) => this.handleSubmit(e)} />
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