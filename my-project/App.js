// App.js
// Main page for routing to different pages
import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItem, DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { Icon } from 'react-native-elements'

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
import CurrentProfile from './pages/CurrentProfile'


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
const Tab = createBottomTabNavigator();

/********************* DEFINE ALL STACKS AND DRAWERS WITHIN HERE*/

class AppStack extends Component {
    render(){
        console.log("HEREEHRIJOIWPJE", this.props, this)
        // welcome screen, login, register, home_drawer
        return(
            <Stack.Navigator initialRouteName={ this.props.initialRouteName }>
                <Stack.Screen name="Welcome" component={Welcome} options={{ title: 'Login/Register' }}/>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                {/* <Stack.Screen name="UserHome" component={UserHomeDrawer} options={{ title: 'Home'}}/> */}

                <Stack.Screen name="UserHome" component={UserHome} options={{ title: 'Home' }}/>
                <Stack.Screen name="Search" component={Search} options={{ title: 'Search'}}/>
                <Stack.Screen name="CreateNewGroup" component={CreateNewGroup} options={{ title: 'Create New Group'}}/>
                <Stack.Screen name="JoinGroup" component={JoinGroup} options={{ title: 'Join Group'}}/>
                <Stack.Screen name="GroupPage" component={GroupPage} options={{ title: 'Group Page'}}/>
                <Stack.Screen name="AddUserToGroup" component={AddUserToGroup} options={{ title: 'Add User To Group'}}/>
                <Stack.Screen name="CreateNewGame" component={CreateNewGame} options={{ title: 'Create New Game'}}/>
                <Stack.Screen name="Game" component={Game} />
                <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'User Profile' }}/>
                <Stack.Screen name="CurrentProfile" component={CurrentProfile}/>
                <Stack.Screen name="Tournament" component={Tournament} />
            </Stack.Navigator>
        )
    }
};

class MainAppTabs extends Component {
    render(){
        return(
            <Tab.Navigator>
                {/* <Tab.Screen name="Home">
                    {props => <UserHome {...props} firstTimeUser={this.props.route.params.firstTimeUser}/>}
                </Tab.Screen> */}
                <Tab.Screen name="HomeStack" options={{
                    tabBarLabel:"Home",
                    tabBarIcon: ({ tintColor }) => (
                      <Icon name="home" size={30} color="#900" />
                    )
                }}>
                    {props => <AppStack {...props} initialRouteName="UserHome" />}
                </Tab.Screen>
                <Tab.Screen name="SearchStack" options={{
                    tabBarLabel:"Search",
                    tabBarIcon: ({ tintColor }) => (
                      <Icon name="search" size={30} color="#900" />
                    )
                }}>
                    {props => <AppStack {...props} initialRouteName="Search" />}
                </Tab.Screen>
                <Tab.Screen name="CreateNewGroupStack" options={{
                    tabBarLabel:"Create Group",
                    tabBarIcon: ({ tintColor }) => (
                      <Icon name="group" size={30} color="#900" />
                    )
                }}>
                    {props => <AppStack {...props} initialRouteName="CreateNewGroup" />}
                </Tab.Screen>
                <Tab.Screen name="CurrentProfileStack" options={{
                    tabBarLabel:"Profile",
                    tabBarIcon: ({ tintColor }) => (
                      <Icon name="account-box" size={30} color="#900" />
                    )
                }}>
                    {props => <AppStack {...props} initialRouteName="CurrentProfile" />}
                </Tab.Screen>
                {/* <Tab.Screen name="Home" component={AppStack} options={{ initialRouteName: "Search" }}/> */}
                {/* <Tab.Screen name="Search" component={AppStack} />
                <Tab.Screen name="Profile" component={AppStack} /> */}
            </Tab.Navigator>
        )
    }
};

/********************* DEFINE ALL STACKS AND DRAWERS WITHIN HERE*/

class App extends Component {
    render(){
        return(
            <NavigationContainer>
                <Stack.Navigator mode="modal">
                    <Stack.Screen name="Welcome" component={Welcome} options={{ title: 'Login/Register' }}/>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="UserHome" component={MainAppTabs} options={{ headerShown: false }}/>
                </Stack.Navigator>
          
            </NavigationContainer>

        )
    }
}

export default App;