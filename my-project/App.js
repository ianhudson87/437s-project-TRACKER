// App.js
// Main page for routing to different pages
import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItem, DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';

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
import Tournament from "./pages/Tournament"
import JoinGroup from './pages/JoinGroup'
import UserProfile from './pages/UserProfile'
import Search from './pages/Search'


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
                <Stack.Screen name="UserHome" component={UserHomeDrawer} options={{ title: 'Home'}}/>

                <Stack.Screen name="GroupPage" component={GroupPage} options={{ title: 'Group Page'}}/>
                <Stack.Screen name="AddUserToGroup" component={AddUserToGroup} options={{ title: 'Add User To Group'}}/>
                <Stack.Screen name="CreateNewGame" component={CreateNewGame} options={{ title: 'Create New Game'}}/>
                <Stack.Screen name="Game" component={Game} />
                <Stack.Screen name="UserProfile" component={UserProfile} options={{title: 'User Profile'}}/>
                <Stack.Screen name="Tournament" component={Tournament} />
            </Stack.Navigator>
        )
    }
};

class UserHomeDrawer extends Component {


    render(){
        console.log("IM HERE", this.props)
        return(
            // citation: https://stackoverflow.com/questions/60450126/how-to-add-a-button-inside-a-react-navigation-drawer
            <Drawer.Navigator initialRouteName="Home" drawerContent={props => {
                // ADDING LOGOUT BUTTON TO DRAWER
                return (
                  <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                    <DrawerItem
                        label="Logout"
                        onPress={() => props.navigation.dispatch(
                            // reset the navigation so that you can't navigate back from the welcome page
                            CommonActions.reset({ index: 1, routes: [{ name: 'Welcome', params: {firstTimeUser: true} }] })
                        ) }
                    />
                  </DrawerContentScrollView>
                )
            }}>
                <Drawer.Screen name="Home">
                    {props => <UserHome {...props} firstTimeUser={this.props.route.params.firstTimeUser}/>}
                </Drawer.Screen>
                <Drawer.Screen name="Search" component={Search} options={{ title: 'Search'}}/>
                {/* <Drawer.Screen name="Settings" component={UserHome}/> */}
                <Drawer.Screen name="CreateNewGroup" component={CreateNewGroup} options={{ title: 'Create New Group'}}/>
                <Drawer.Screen name="JoinGroup" component={JoinGroup} options={{ title: 'Join Group'}}/>
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