// App.js
// Main page for routing to different pages
import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// need to make sure to import all pages

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import UserHome from './pages/UserHome'
import GroupPage from './pages/GroupPage'
import AddUserToGroup from './pages/AddUserToGroup'
import CreateNewGroup from './pages/CreateNewGroup'
import CreateNewGame from './pages/CreateNewGame'
import Game from "./pages/Game"
import JoinGroup from './pages/JoinGroup'


// docs: https://reactnavigation.org/docs/hello-react-navigation

class Test extends Component {
    render(){
        // "navigation - the navigation prop is passed in to every screen component (definition) in stack navigator (more about this later in "The navigation prop in depth")."
        const navigation = this.props.navigation;
        return(
            <View>
                <Text>THIS IS THE TEST SCREEn</Text>
                {/* use the navigation prop to go to other screens */}
                <Button title="go to login" onPress={ () => navigation.navigate("Login") }></Button>
                <Button title="go to registration" onPress={ () => navigation.navigate("Register") }></Button>
                
            </View>
            
        )
    }
};

const Stack = createStackNavigator();

class App extends Component {
    render(){
        return(
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Test">
                    {/* All the screens that can be routed to need to be here*/}
                    <Stack.Screen name="Test" component={Test} options={{ title: 'new TITLE' }}/>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="UserHome" component={UserHome} />
                    <Stack.Screen name="GroupPage" component={GroupPage} />
                    <Stack.Screen name="AddUserToGroup" component={AddUserToGroup} />
                    <Stack.Screen name="CreateNewGroup" component={CreateNewGroup} />
                    <Stack.Screen name="JoinGroup" component={JoinGroup} />
                    <Stack.Screen name="CreateNewGame" component={CreateNewGame} />
                    <Stack.Screen name="Game" component={Game} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default App;