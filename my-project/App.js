import { StatusBar } from 'expo-status-bar';
import React, { useReducer } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {fetchUsers} from './constants/api';


export default function App() {
  const data = fetchUsers();

  return (
    <View style={styles.container}>
      <Text>TESTING TESTING</Text>
      {data.map((user)=> {
        <Text >{user.name}</Text>
      })}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
