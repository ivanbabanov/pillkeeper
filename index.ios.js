/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var ReactFireMixin = require('reactfire');
var Firebase = require('firebase');


var FacebookLoginManager = require('NativeModules').FacebookLoginManager;

var ref = new Firebase("https://flickering-torch-7754.firebaseio.com/");
//var authData = ref.getAuth();

var uid = 'empty';

var AddItemScreen = require('./AddItemScreen');


var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Navigator,
  NavigatorIOS,
  TabBarIOS,
  TouchableHighlight,
  ListView,
  ScrollView,
} = React;

var SimpleProject = React.createClass({
  handleCallback: function(){
  console.log("callback called");
  this.setState({barVis: 'false' });
},

render: function() {
  return (
    <NavigatorIOS style={{flex:1,}}
      
      barTintColor='#2093c3'
      titleTextColor='white'
      tintColor='white'
      sceneStyle={{paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight}}
      initialRoute={{
        component: SimpleProjectScreen,
        //leftButtonIcon: require('image!settings_icon'),
        //rightButtonIcon: require('image!users_icon'),
        title: 'Apteka',
        passProps: { callback: this.handleCallback },

      }}  />
  );
}  

});

var SimpleProjectScreen = React.createClass({

getInitialState: function() {
    return {
      selectedTab: 'view',
    };
  },
  


  render: function(){
    return(
        <TabBarIOS style={{ borderWidth:1, borderColor:'red', flex:1}}>
          <TabBarIOS.Item title='View' style={{ borderWidth:1, borderColor:'green', flex:1}}
              selected={this.state.selectedTab==='view'}
              onPress={() => {
                this.setState({
                  selectedTab: 'view',
            })}}
              >
            <ViewItemsScreen />
          </TabBarIOS.Item>

          <TabBarIOS.Item 
              title='Add New' 
              selected={this.state.selectedTab==='add'} 
              onPress={() => {
                this.setState({
                  selectedTab: 'add',
            })}}>
          <AddItemScreen dbref={ref} dbuid={uid}/>
          </TabBarIOS.Item>
        </TabBarIOS>
      );
  }
});

var ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

var foods = [
    {key: '', details:''},
        
];

var ViewItemsScreen = React.createClass({
  mixins: [ReactFireMixin],


  

  getInitialState: function() {

    return {
      items: [],
      auth: 'Not authenticated',
      result: '...',
      userId: 'empty',
      arrMeds: [],
      token: 'empty',
      isAuth: false,
      
      fireData: ds.cloneWithRows(foods),
    };
  },

  componentWillMount: function() {
      console.log("componentWillMount!!!");
      
          
  },


login() {

  var meds = [];    
  var ctx = this;
  ref = new Firebase("https://flickering-torch-7754.firebaseio.com/");
  ref.onAuth(function(authData) {
      if (authData) {
        console.log("Authenticated with uid:", authData.uid);
        uid = authData.uid;
        this.setState({userId: uid});
                  
                  ref.child("apteka").child(uid).on('value',function(data) {
                    meds = [];
                    data.forEach(function(dataChild){
                      var fireKey = dataChild.key();
                      
                      meds.push({key: fireKey, details: ''});
                      
                    });
                    console.log("Meds:");
                    console.log(meds);
                    this.setState({fireData: ds.cloneWithRows(meds)});
                    //this.setState({arrMeds: ['meds','meds1']
                  }.bind(this));
                   
      } else {
        console.log("Client unauthenticated.")
      }
    }.bind(this));
   

    FacebookLoginManager.newSession((error, info) => {
      //var meds = [];
      if (error) 
      {
        this.setState({result: error});
      } 
      else 
      {
        this.setState({result: info});
        this.setState({userId: info.userId});
        this.setState({token: info.token});

        ref.authWithOAuthToken("facebook", info.token, function(error, authData) {
                if (error) 
                {
                  console.log("Login Failed!", error);
                } 
                else 
                {
                  console.log("Authenticated successfully with payload:", authData);
                  this.setState({isAuth: true});
                }
              }.bind(this));
        this.setState({fireData: ds.cloneWithRows(meds)});
        console.log("External meds:");
        console.log(meds);
      }
    });

  },

  _renderFbAuth: function(){
    if(this.state.isAuth==true)
      {
          return(<Text></Text>);
      }
    else
    {
          return(<TouchableHighlight onPress={this.login}><Text style={styles.welcome}>Facebook Login</Text></TouchableHighlight>);
          
    }
  },

  handleScroll: function(event: Object) {
 console.log(event.nativeEvent.contentOffset.x);
},

  _renderList: function(){
    if(this.state.isAuth==true)
      {
          return(<ScrollView style={styles.scroll_container} horizontal={false}>
            <ListView contentContainerStyle={styles.list_container} dataSource={this.state.fireData} renderRow={(rowData) => <ScrollView onScroll={this.handleScroll} horizontal={true}><Text style={styles.list_item}>{rowData.key}</Text></ScrollView>}  />
            </ScrollView>);
      }
    else
    {
          return(<Text></Text>);
    }
  },

  render: function(){
    
    return(
        
        <View style={styles.container} horizontal={false}>
        
        {this._renderFbAuth()}
        {this._renderList()}
        
        </View>
        
      );
  },

  AuthPass: function(){

  console.log("email:"+this.state.text+" pass:"+this.refs.pass.props.value);

},

});




var styles = StyleSheet.create({
  scroll_container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  
  list_container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderColor:'orange',
    borderWidth:1,
    position:'relative',
    paddingTop:0,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderColor:'blue',
    borderWidth:1,
    position:'relative',
    paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loginButton: {
    width: 200,
    height: 50,
    shadowRadius: 5,
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowOffset: {width: 0, height: 0},
  },
  list_item:{
    borderColor: 'green',
    borderRadius: 7,
    borderWidth: 1,
    height: 30,
    width: 200,
    padding: 5,
    margin: 5,

  },
});

AppRegistry.registerComponent('SimpleProject', () => SimpleProject);

