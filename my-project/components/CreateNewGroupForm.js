import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import { createGroup } from "../constants/api"


class CreateNewGroupForm extends Component {
    static defaultProps = {
        createGroup
      }
    constructor(props) {
        super(props);
        this.state = {group_name: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        // handler for name box change
        this.setState({group_name: event.target.value});
    }

    handleSubmit(navigation, event) {
        // handler for when submit button gets pressed
        console.log(navigation);

        createGroup(this.state.group_name).then((data)=>{
            this.setState({response: data});
            if(data.repeatedGroup == false){ // group successfully created
                console.log("Group created");
                // this.props.navigation.navigate("UserHome", {
                //     itemId: 86,
                //     user: data.user
                // });
            }
            else{ // group name repeated
                console.log("Group name taken");
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
                <TextInput value={this.state.group_name} onChange={this.handleChange} style={styles.text}/>
                
                <Button title="Create Group" onPress={(e) => this.handleSubmit(navigation, e)} />
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