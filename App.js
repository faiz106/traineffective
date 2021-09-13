import React, {Component} from 'react';
import {
  View,
  Text,
  Image,Alert,
  FlatList,Linking,
  WebView,
  TouchableOpacity,TouchableNativeFeedback,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      searchResults: [],
      isShowingResults: false,
    };
  }

 
  searchLocation = async (text) => {
    this.setState({searchKeyword: text});
    axios
      .request({
        method: 'get',
        url: `https://api.github.com/search/users?q=${this.state.searchKeyword}`,
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          searchResults: response.data.items,
          isShowingResults: true,
        });
      })
      .catch((e) => {
        console.log(e.response);
      });
  };


  loadInBrowser (item) {
   
    
    this.setState({
      searchKeyword: item.login,
      isShowingResults: false,
    })


    Linking.canOpenURL(item.html_url).then(supported => {
      if (supported) {
        Linking.openURL(item.html_url);
      } else {
        alert("We are having some problems to open this profile.")
      }
    });

  
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.autocompleteContainer}>
          <TextInput
            placeholder="Search for any github user"
            returnKeyType="search"
            style={styles.searchBox}
            placeholderTextColor="#000"
            onChangeText={(text) => this.searchLocation(text)}
            value={this.state.searchKeyword}
          />
          {this.state.isShowingResults && (
            <FlatList
              data={this.state.searchResults}
              renderItem={({item, index}) => {
                return (
                  <TouchableNativeFeedback
                    style={styles.resultItem}
                    onPress={() => this.loadInBrowser(item)}
                  >
                    <View style={styles.flatListStyle}>

                    <Image
                        style={styles.ProfilePics}
                        source={{
                          uri: item.avatar_url}
                        }
                      />

                    <Text>{item.login}</Text>

                    </View>

                  </TouchableNativeFeedback>
                );
              }}
              keyExtractor={(item) => item.id}
              style={styles.searchResultsContainer}
            />
          )}
        </View>
       
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1,
  },
  flatListStyle: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: 'white'
  },
  ProfilePics: {
    width: 50,
    height: 50,
  },
  searchResultsContainer: {
    width: 340,
    height: 200,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50,
  },
 
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  searchBox: {
    width: 340,
    height: 50,
    fontSize: 18,
    borderRadius: 8,
    borderColor: '#aaa',
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    paddingLeft: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
  },
});