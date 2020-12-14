import React, { Component } from 'react'
import { SearchBar, ButtonGroup } from 'react-native-elements';
import { StyleSheet, ScrollView, Text, Button, View } from 'react-native'
import { CommonActions } from '@react-navigation/native';
import { searchObjectsByString } from '../constants/api'
import UserThumbnail from '../components/UserThumbnail'
import GroupThumbnail from '../components/GroupThumbnail'
import GameThumbnail from '../components/GameThumbnail'

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query_string: '',
            query_objects: [], // objects you get from search

            selected_index: 0, // selected index between ["users", "group", "game"]
            type_table: ['user', 'group', 'game'], // converts selected_index to type
        }

        this.update_query_string = this.update_query_string.bind(this)
        this.update_search_results = this.update_search_results.bind(this)
        this.result_objects = this.result_objects.bind(this)
        this.updateIndex = this.updateIndex.bind(this)
    }

    componentDidMount(){ }

    update_query_string(text){
        this.setState({ query_string: text }, async () => this.update_search_results() ) // set the query_string, then update results
    }

    async update_search_results(){
        if(this.state.query_string.length > 0){
            // given query_string, selected_index, ... update query_objects
            console.log(this.state.selected_index)
            let type = this.state.type_table[this.state.selected_index]
            let res = await searchObjectsByString({ type: type, query_string: this.state.query_string })
            if(res.error){
                this.setState({ query_objects: [] })
            }
            else{
                this.setState({ query_objects: res.objects })
            }
        }
        else{
            // query_string is empty
            this.setState({ query_objects: [] })
        }
    }

    result_objects() {
        switch(this.state.selected_index){
            case 0:
                // users
                return(
                    <View style={{flex: 1}}>
                        <ScrollView>
                            { this.state.query_objects.map((user, i) => { return(<UserThumbnail key={ user._id } user={ user } navigation={ this.props.navigation } />) }) }                  
                        </ScrollView>
                    </View>
                )
            case 1:
                // groups
                return(
                    <View style={{flex: 1}}>
                        <ScrollView>
                            { this.state.query_objects.map((group, i) => { return(<GroupThumbnail key={ group._id } group={ group } navigation={ this.props.navigation } />) }) }                  
                        </ScrollView>
                    </View>
                )
            case 2:
                // games
                return(
                    <View style={{flex: 1}}>
                        <ScrollView>
                            { this.state.query_objects.map((game, i) => { return(<GameThumbnail key={ game._id } game={ game } type="standard" navigation={ this.props.navigation } />) }) }                  
                        </ScrollView>
                    </View>
                )
        }
    }

    updateIndex(index){
        this.setState({ query_objects: [] }, () => {
            this.setState({ selected_index: index }, async () => this.update_search_results())
        })
    }
  
render() {
    return (
    <View style={styles.container}>
        <View sytle={styles.searchBarContainer}>
            {/* <Button title="Cancel" onPress={ () => this.props.navigation.dispatch(CommonActions.goBack()) }/> */}
            <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selected_index}
            buttons={["User", "Group", "Game"]}
            />
            <SearchBar
                lightTheme
                placeholder="Type Here..."
                onChangeText={ (text) => this.update_query_string(text) }
                value={this.state.query_string}
            />
        </View>

        <View style={styles.resultsContainer}>
            { this.result_objects() }
        </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
      flex: 1,
  },
  resultsContainer: {
      flex: 4,
  }
})

export default Search;