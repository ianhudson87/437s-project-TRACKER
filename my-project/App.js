// App.js
// Main page for routing to different pages
import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

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
import UserProfile from './pages/UserProfile'


// docs: https://reactnavigation.org/docs/hello-react-navigation

class Welcome extends Component {
    render(){
        // "navigation - the navigation prop is passed in to every screen component (definition) in stack navigator (more about this later in "The navigation prop in depth")."
        const navigation = this.props.navigation;
        return(
            <View>
                <Text>LOGIN/REGISTER SCREEN</Text>
                {/* use the navigation prop to go to other screens */}
                <Button title="Login" onPress={ () => navigation.navigate("Login") }></Button>
                <Button title="Register" onPress={ () => navigation.navigate("Register") }></Button>
            </View>
        )
    }
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

/********************* DEFINE ALL STACKS AND DRAWERS WITHIN HERE*/

class AppStack extends Component {
    render(){
        // welcome screen, login, register, home_drawer
        return(
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="Welcome" component={Welcome} options={{ title: 'Login/Register' }}/>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="UserHome" component={UserHomeDrawer} />

                <Stack.Screen name="GroupPage" component={GroupPage} />
                <Stack.Screen name="AddUserToGroup" component={AddUserToGroup} />
                <Stack.Screen name="CreateNewGame" component={CreateNewGame} />
                <Stack.Screen name="Game" component={Game} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
            </Stack.Navigator>
        )
    }
};

class UserHomeDrawer extends Component {
    render(){
        console.log("IM HERE", this.props)
        return(
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home">
                    {props => <UserHome {...props} firstTimeUser={this.props.route.params.firstTimeUser}/>}
                </Drawer.Screen>
                <Drawer.Screen name="Settings" component={UserHome}/>
                <Drawer.Screen name="Friends" component={UserHome}/>
                <Drawer.Screen name="CreateNewGroup" component={CreateNewGroup} />
                <Drawer.Screen name="JoinGroup" component={JoinGroup} />
            </Drawer.Navigator>
        )
    }
};

/********************* DEFINE ALL STACKS AND DRAWERS WITHIN HERE*/

class App extends Component {
    render(){
        return(
            <NavigationContainer>
                <AppStack />
            </NavigationContainer>

        )
    }
}

export default App;