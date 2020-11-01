import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet} from 'react-native'
import { getUser, joinGroup } from "../constants/api"


class AddUserForm extends Component {
    static defaultProps = { }
    constructor(props) {
        super(props);
        this.state = {username: ''};

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const group = this.props.group;
        this.setState({group: group})
    }

    handleChangeName(event) {
        // handler for name box change
        this.setState({username: event.target.value});
    }

    handleSubmit(navigation, event) {
        // handler for when add user button gets pressed
        getUser(this.state.username).then((userData)=>{
            if(userData.user_exists){ // username found in database
                //join group
                console.log(userData)
                console.log(userData.user[0]._id)
                joinGroup(userData.user[0]._id, this.props.group._id).then((groupData)=>{
                    this.setState({response: groupData});
                    if(groupData.joined_group){ // user joined group successfully
                        console.log("User was added");
                        this.props.navigation.navigate("GroupPage", {
                            itemId: 86,
                            user: this.props.loggedInUser,
                            group: this.state.group,
                            navigation: this.props.navigation
                        });
                    }
                    else{ // user not added to group
                        console.log("User could not be added");
                        console.log(groupData)
                    }
                })
            }
            else{ // username not found in database
                console.log("User does not exist")
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
                <Text>User to add:</Text>
                <TextInput value={this.state.username} onChange={this.handleChangeName} style={styles.text}/>
                <Button title="Add User" onPress={(e) => this.handleSubmit(navigation, e)} />
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

export default AddUserForm;