import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import { createGame } from "./constants/api"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import UserHome from './UserHome'

const Stack = createStackNavigator();

class CreateNewGameForm extends Component {
    static defaultProps = {
        createGame
      }
    constructor(props) {
        super(props);
        this.state = {game_name: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        // handler for name box change
        this.setState({game_name: event.target.value});
    }

    handleSubmit(navigation, event) {
        // handler for when submit button gets pressed
        console.log(navigation);

        createGame(this.state.game_name).then((data)=>{
            this.setState({response: data});
            if(data.repeatedGame == false){ // group successfully created
                console.log("Game created");
            }
            else{ // group name repeated
                console.log("Game name taken");
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
                <TextInput value={this.state.game_name} onChange={this.handleChange} style={styles.text}/>
                
                <Button title="Create Game" onPress={(e) => this.handleSubmit(navigation, e)} />
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

export default CreateNewGameForm;