var React = require('react-native');

var {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  } = React;



var AddItemScreen = React.createClass({

  saveData: function(){
    console.log('Pressed'+this.state.apName);
    
    var aptRef = ref.child("apteka").child(uid).child(this.state.apName);
    aptRef.set({exp_date: this.state.apExpire, count: this.state.apCount},function(error) {
  if (error) {
    alert("Data could not be saved." + error);
  } else {
    alert("Data saved successfully.");
  }
});

  
},

getInitialState: function(){
  return({apName:'', apCount:'', apExpire:''});
},

  render: function() {
    return (
      <View style={styles.container}>
       
          <View style={{width: 200}}>
              <Text>Name</Text><TextInput style={{height: 40,  borderColor: 'gray', borderWidth: 1, borderRadius: 10}} onChangeText={(text) => this.setState({apName: text})} value={this.state.apName} ref='apName'></TextInput>
              <Text>Count</Text><TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10}} onChangeText={(text) => this.setState({apCount: text})} value={this.state.apCount} ref='apCount'></TextInput>
              <Text>Exp. date</Text><TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10}}onChangeText={(text) => this.setState({apExpire: text})} value={this.state.apExpire} ref='apExpire'></TextInput>
              <Text style={{borderWidth:1, borderColor: 'gray', borderRadius: 10, height:40, textAlign: 'center',}} onPress={()=>this.saveData()}>Save</Text>
          </View>
      </View>
    );
  }
});

module.exports = addItemScreen;