var React = require('react-native');

var {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AlertIOS,
  } = React;


var Camera = require('react-native-camera');


var AddItemScreen = React.createClass({

  saveData: function(){
    console.log('Pressed'+this.state.apName);
    var ref = this.props.dbref;
    var uid = this.props.dbuid;
    console.log("uid: "+uid);
    var aptRef = ref.child("apteka").child(uid).child(this.state.apName);
    aptRef.set({exp_date: this.state.apExpire, count: this.state.apCount},function(error) {
  if (error) {
    alert("Data could not be saved." + error);
  } else {
    alert("Data saved successfully.");
  }
});

  
},

makePhoto: function(){
  console.log('Making photo');
  this.setState({showCamera:true});
},

getInitialState: function(){
  return({apName:'', 
          apCount:'', 
          apExpire:'',
          showCamera:false,
          cameraType:Camera.constants.Type.back,
        });
},

_SearchBarCode: function(bar, callback) {
        var res = fetch("http://google.com/search?q="+bar, {method: "GET"})
        .then((response) => response.text())
        .then((responseData) => {
            // AlertIOS.alert(
            //     "GET Response",
            //     "Search Query -> " + responseData
                
            // );
            var result = responseData.substring(responseData.indexOf('<div id=\"ires\"'), responseData.indexOf('<div id=\"foot\">'));
            var arrRes = [];
            arrRes = result.split('<h3 class=\"r\">');
            arrRes.forEach(function(item,i,arr){
              var searchItem = item.substring(0,item.indexOf('</h3>'));
              searchItem = searchItem.replace(/<(?:.|\n)*?>/gm, '');
              searchItem = searchItem.replace(/\./g,'');
              searchItem = searchItem.replace(/\$/g,'');
              searchItem = searchItem.replace(/\[/g,'');
              searchItem = searchItem.replace(/\#/g,'');
              searchItem = searchItem.replace(/\]/g,'');
              searchItem = searchItem.replace(bar,'');

              arr[i] = searchItem;
              //console.log("item = "+searchItem);
            });
            console.log('returning '+arrRes[3]);
            callback.setState({apName:arrRes[3]});
            return(arrRes[3]);
            
        })
        .done();
        console.log('returning '+res);
        return(res);
    },

_onBarCodeRead: function(e) {
        this.setState({showCamera: false});
        var itemName = this._SearchBarCode(e.data, this);
        //this.setState({apName:itemName});
        // AlertIOS.alert(
        //     "Barcode Found!",
        //     "Type: " + e.type + "\nData: " + e.data
        // );
    },

  render: function() {
    if(this.state.showCamera) {
            return (
                <Camera
                    ref="cam"
                    style={styles.container}
                    onBarCodeRead={this._onBarCodeRead}
                    type={this.state.cameraType}>

                </Camera>
            );
        } else {
            return (
              <View style={styles.container}>
               
                  <View style={{width: 200}}>
                      <Text>Name</Text><TextInput style={{height: 40,  borderColor: 'gray', borderWidth: 1, borderRadius: 10}} onChangeText={(text) => this.setState({apName: text})} value={this.state.apName} ref='apName'></TextInput>
                      <Text>Count</Text><TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10}} onChangeText={(text) => this.setState({apCount: text})} value={this.state.apCount} ref='apCount'></TextInput>
                      <Text>Exp. date</Text><TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10}}onChangeText={(text) => this.setState({apExpire: text})} value={this.state.apExpire} ref='apExpire'></TextInput>
                      <Text style={{borderWidth:1, borderColor: 'gray', borderRadius: 10, height:40, textAlign: 'center',}} onPress={()=>this.saveData()}>Save</Text>
                      <Text style={{borderWidth:1, borderColor: 'gray', borderRadius: 10, height:40, textAlign: 'center',}} onPress={()=>this.makePhoto()}>Photo</Text>
                  </View>
              </View>
            );
          }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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


module.exports = AddItemScreen;