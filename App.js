/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Tts from 'react-native-tts';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
'use strict';
import { RNCamera } from 'react-native-camera';



const Stack = createStackNavigator();
var base64Code = null;
var recievedJason = null;
var text = null;
let colourList = null;
let index = -1;
let boolScondaryPatrren = false;
let boolShadowColor = false;





class ColourItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadeColorExist:false,
    };
  }


  render() {
    index++;
    boolShadowColor = false;
    if (String(colourList[index].shade) != ''){
     boolShadowColor = true;
    }

    let percentageDescription = 'Percentage : ' + String(colourList[index].percentage).split(".")[0] + '%.';
    let shadeDescription = 'Shade Color : ' + String(colourList[index].shade) + '.';
    return (
      <View style = {styles.output}>
      <View style={styles.flatlistView}>
        <View style={{backgroundColor:String(colourList[index].color),width:50, height:50,borderColor:'white', borderWidth:1.5, borderRadius:4}}/>

          {
            boolShadowColor ?
            <View style={styles.flatlistTextcontainer}>
              <Text style={styles.flatlistTextHeader}>{String(colourList[index].color)}</Text>
            <Text style={styles.flatListText}>{shadeDescription}</Text>
            <Text style={styles.flatListText}>{percentageDescription}</Text>
            </View>
            :
            <View style={styles.flatlistTextcontainer}>
              <Text style={styles.flatlistTextHeader}>{String(colourList[index].color)}</Text>
            <Text style={styles.flatListText}>{percentageDescription}</Text>
            </View>

          }

        </View>

      </View>

    );

  }
}




class OpenCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.textRead('please tap on the screen to take photo');
  }

  render() {
    return (
      <View style={styles.containerCamera}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }} />
        <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} />
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true, height: 1512, width: 2016 };
      const data = await this.camera.takePictureAsync(options);
      base64Code = data.base64;
      this.props.navigation.push('Home');
    }
  };
  textRead = (toRead) => {
    Tts.stop();
    Tts.speak(toRead);
  }
 

}
class ProcessOutput extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    boolScondaryPatrren = false;
    boolShadowColor = false;
    base64Code = null;
    text = null;
    let colors = recievedJason.colors;
    let pattern = recievedJason.pattern;
    let secondary_pattern = recievedJason.secondry_pattern;
    this.textRead('image pattern is ' + String(pattern) + ' and');
    text = ('Image pattern is ' + String(pattern) + '. ');
    if (String(pattern).match('irregular')) {

        this.textRead('secondary pattern is ' + String(secondary_pattern) + '.');
        text = text + 'secondary pattern is ' + String(secondary_pattern) + '.';

    }
    var i;
    for (i = 0; i < colors.length; i++) {
      var trimmed = String(colors[i].percentage).split(".")[0];
      console.log(trimmed);
      if (String(colors[i].shade) == '') {
        text = text + ' the color ' + String(colors[i].color) + ' consist with ' + trimmed + ' percent.';
        this.textRead(' the color  ' + String(colors[i].color) + ' consist with ' + trimmed + ' percent.');
      } else {

        text = text + ' the color ' + String(colors[i].color) + ' consist with ' + trimmed + ' percent and shade colour is ' + String(colors[i].shade) + '.';
        this.textRead(' the color  ' + String(colors[i].color) + ' consist with ' + trimmed + ' percent and shade colour is ' + String(colors[i].shade) + '    ');
      }
    }
    //console.log(text);
    this.textRead('  to hear the description tap on the left side of the screen or tap right side to take new photo');



  }
  again() {
    this.textRead(text);
   
  }
  navigateToHome() {
    boolScondaryPatrren = false;
    boolShadowColor = false;
    base64Code = null;
    text = null;
    index = -1;
    colourList = null;
    this.props.navigation.push('Home');
  }


  textRead = (toRead) => {
    Tts.setDefaultRate(0.8, true);
    Tts.stop();
    Tts.speak(toRead);
  }
  render() {
    if (recievedJason.secondry_pattern != false){
      console.log('conditional loop achieved');
      boolScondaryPatrren = true;

    }
    console.log(colourList);
    let patternHeader = 'Pattern is ' + recievedJason.pattern;
    let secondary_patternHeader = 'Secondary pattern is ' + recievedJason.secondry_pattern;
    return (
      <View>
        <View style={styles.ProcessOutputView} >
          <View>
            {
              boolScondaryPatrren ?
              <View style={styles.ProcessOutputHeaderView}>
                <Text style={styles.ProcessOutputHeaderText}>{patternHeader}</Text>
                <Text  style={styles.ProcessOutputSecondaryText}>{secondary_patternHeader}</Text>
              </View>
              :
              <View style={styles.ProcessOutputHeaderView}>
                <Text style={styles.ProcessOutputHeaderText}>{patternHeader}</Text>
              </View>
            }

          </View>

        <FlatList
      data = {colourList}
      renderItem = {itemData=>
      <ColourItems colourName = {itemData.color} shadeColor ={itemData.shade} colorPercentage={itemData.percentage}/>}/>
     { /*courseGoals.map((goal)=><View key={goal} style = {styles.output}><Text>{goal}</Text></View>)    this is when using a scroll View to map data*/}


        { // <Text style={styles.textViewProcess}>{text}</Text>
        }
        </View>
        <View style={styles.processButtonContainerView}>
          <TouchableOpacity style={styles.hearAgain} onPress={() => this.again()} />
          <TouchableOpacity style={styles.gotoHome} onPress={() => this.navigateToHome()} />
        </View>

      </View>
    );
  }
}


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      ShowIndicator: false,
      loading: true,
    };
    boolScondaryPatrren = false;
    boolShadowColor = false;

  }


  componentDidMount() {
    this.textRead('touch left side to take a new photo or right side to process the photo');
  }
  textRead = (toRead) => {
    Tts.stop();
    Tts.speak(toRead);
  }

  async sendBase64code(ImageJason) {
    this.setState({
      ShowIndicator: true,
    });
    this.textRead('the photo is processing.');

    try {
      let response = await fetch('https://secret-dusk-19853.herokuapp.com/Classification/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ImageJason),
      });
      let responseJson = await response.json();
      // console.log(responseJson);
      recievedJason = responseJson;
      colourList = responseJson.colors;
      this.setState({
        ShowIndicator: false,
      });
      //console.log(responseJson);
      this.props.navigation.push('ProcessOutput');
      return responseJson;
    } catch (error) {
      console.log(error);
    }
  }
  processHandler() {
    if (base64Code != null) {

      var imageBase64 = {
        'content': base64Code,
      };
      this.sendBase64code(imageBase64);
    } else {
      this.textRead('first you should take a photo to process please tap left side of the screen');

    }
  }
  cameraHandler(){
    boolScondaryPatrren = false;
    boolShadowColor = false;
    base64Code = null;
    recievedJason = null;
    colourList = null;
    text = null;
    this.props.navigation.push('camera');

  }
  render() {
    return (

      <View >
        {
          this.state.ShowIndicator ?
            <View style={styles.container}>
              <ActivityIndicator size="large" color="blue" />
            </View>
            :
            <View style={styles.container}>
              <TouchableOpacity style={styles.takePhoto} onPress={() => this.cameraHandler()}>
                <View style={styles.textContainer} >
                  <Text style={[styles.text,{color:'white'}]}>Take Photo</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.processPhoto} onPress={() => this.processHandler()} >
                <View style={styles.textContainer}>
                  <Text style={styles.text}>Process Photo</Text>
                </View>
              </TouchableOpacity>
            </View>

        }


      </View>
    );
  }


}


class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="camera" component={OpenCamera} />
          <Stack.Screen name="ProcessOutput" component={ProcessOutput} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
  },
  takePhoto: {
    flex: 1,
    backgroundColor: 'black',
  },
  processPhoto: {
    flex: 1,
    backgroundColor: 'white',

  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  containerCamera: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    width: 700,
    height: 1000,
    alignSelf: 'center',
  },
  ProcessOutputView: {
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  textViewProcess: {
    margin: 30,
    fontSize: 20,
    fontWeight: 'bold',

  },
  processButtonContainerView: {
    position: 'absolute',
    flexDirection: 'row',
    width: 700,
    height: 1000,
    alignSelf: 'center',
  },
  hearAgain: {
    flex: 1,
    backgroundColor: 'rgba(247, 249, 251,0)',
  },
  gotoHome: {
    flex: 1,
    backgroundColor: 'rgba(144, 175, 207,0.2)',
  },
  output:{
    borderColor:'gray',
    backgroundColor:'black',
    borderRadius:6,
    borderWidth:2,
    padding:10,
    width:350,
    height:90,
    margin:10,
    justifyContent:'center',
    shadowColor:'black',
    elevation:10,
  },
  flatlistView:{
    flexDirection:'row',


  },
  flatlistImageView:{
    flex:1,
  },
  flatlistTextcontainer:{
    flex:5,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
  },
  flatListText:{
    color:'white',

  },
  flatlistTextHeader:{
    fontWeight:'bold',
    color:'white',

  },
  ProcessOutputHeaderView:{
    paddingHorizontal:20,
    paddingVertical:20,
    justifyContent:'center',
    alignItems:'flex-start',

  },
  ProcessOutputHeaderText:{
    color:'black',
    fontSize:20,
    fontWeight:'bold',
  },
  ProcessOutputSecondaryText:{
    color:'gray',
    fontSize:15,
    fontWeight:'normal',
  },
});
