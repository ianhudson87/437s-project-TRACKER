// App.js
// Main page for routing to different pages
import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// need to make sure to import all pages
import Login from './Login';
import Home from './Home';

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
                    <Stack.Screen name="Home" component={Home} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default App;