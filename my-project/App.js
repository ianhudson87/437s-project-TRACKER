// App.js
// Main page for routing to different pages
import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// need to make sure to import all pages
import Register from './Register';
import Login from './Login';
import Home from './Home';
import UserHome from './UserHome'
import GroupPage from './GroupPage'
import LoginForm from './LoginForm'

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
                    <Stack.Screen name="Test" component={Test} options={{ title: 'THIS IS THE NEW TITLE' }}/>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="UserHome" component={UserHome} />
                    <Stack.Screen name="GroupPage" component={GroupPage} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default App;