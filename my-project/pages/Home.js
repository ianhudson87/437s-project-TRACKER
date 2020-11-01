import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'

class Home extends Component {

constructor(props){
    super(props);
}

componentDidMount(){
    console.log("HERE")
    if(__DEV__){
        console.log("THIS IS DEV")
    }
    else{
        console.log("THIS IS PPRODUCTION")
    }
}
  

render() {
    return (
      <View style={styles.container}>
        <Text>
            THIS IS THE HOME PAGE!hi
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10
  }
})

export default Home;