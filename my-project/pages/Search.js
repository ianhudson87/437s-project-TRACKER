import React, { Component } from 'react'
import { SearchBar } from 'react-native-elements';
import { StyleSheet, ScrollView, Text, Button, View } from 'react-native'
import { searchObjectsByString } from '../constants/api'
import UserThumbnail from '../components/UserThumbnail'

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query_string: '',
            query_objects: [] // objects you get from search
        }

        this.update_query_string = this.update_query_string.bind(this)
        this.update_search_results = this.update_search_results.bind(this)
        this.result_objects = this.result_objects.bind(this)
    }

    componentDidMount(){ }

    update_query_string(text){
        this.setState({ query_string: text }, async () => this.update_search_results() ) // set the query_string, then update results
    }

    async update_search_results(){
        if(this.state.query_string.length > 0){
            // given query_string, update query_objects
            let res = await searchObjectsByString({ type: 'users', query_string: this.state.query_string })
            this.setState({ query_objects: res.objects })
        }
        else{
            // query_string is empty
            this.setState({ query_objects: [] })
        }
    }

    result_objects() {
        return(
        <View>
            <ScrollView>
                { this.state.query_objects.map((user, i) => { return(<UserThumbnail key={ user._id } user={ user } navigation={ this.props.navigation } />) }) }                  
            </ScrollView>
        </View>
        )
    }
  
render() {
    return (
      <View style={styles.container}>
        <Text>
            Search:
        </Text>
        <SearchBar
            placeholder="Type Here..."
            onChangeText={ (text) => this.update_query_string(text) }
            value={this.state.query_string}
        />

        { this.result_objects() }
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
})

export default Search;