import 'react-native-gesture-handler';

import * as React from 'react';
import { SafeAreaView,ImageBackground,Button,View,Text, ScrollView,StyleSheet, TouchableOpacity, Linking,Image,TextInput,ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from "axios";
import constVar from "./global";


//import MySqlConnection from 'react-native-my-sql-connection';

//import React,{Component,useCallback} from 'react';


import QRCodeScanner from 'react-native-qrcode-scanner';

function HomeScanner({navigation}) {
  
  return (
    
   <ImageBackground source={require('./assets/qrcodeBkg.jpg')} style={styles.imageS}>   
    <SafeAreaView>
     <ScrollView>
    <View style={styles.container}>
    
      <View style={styles.imgContainer}>
        <Image resizeMode ="contain" style={styles.tinyLogo} source={require('./assets/prism-logo.png')} />     
      </View>

      <Text style={styles.text}>{constVar.homepage_description}{"\n"} {"\n"}</Text>
      <Text style={styles.text}>{constVar.homepage_quote}{"\n"}</Text>
      
       <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('Scanner')}
      />
   
    </View> 
     </ScrollView>       
   </SafeAreaView>  
  </ImageBackground>
  );
}


function ScannerResult({ navigation }){  

   const Datarecord = ()=>{
    return(
      
        <View style={styles.container}>          
        <Text style={styles.textscanner}>{"\n"}<Text style={styles.textbold}>Name: </Text>{name}</Text>
        <Text style={styles.textscanner}><Text style={styles.textbold}>{"\n"}Email: </Text>{email}</Text>       
        <Text style={styles.textscanner}><Text style={styles.textbold}>{"\n"}Company Name: </Text>{companyName}</Text>       
        <Text style={styles.textscanner}><Text style={styles.textbold}>{"\n"}Designation: </Text>{designation}</Text>       
        <Text style={styles.textscanner}><Text style={styles.textbold}>{"\n"}Nominee Category: </Text>{category}</Text>       
        <Text style={styles.textscanner}><Text style={styles.textbold}>{"\n"}Brand: </Text>{brand.toUpperCase()}</Text>         
        <Text style={styles.textscanner}><Text style={styles.textbold}>{"\n"}Additional Delegates</Text></Text>         
          {deligate.map((name,key)=>(         
               <Text style={styles.textscanner} key={key}>{key+1}. <Text>{name}</Text></Text>
            ))}
          { animatingStatue === true ? 
            <ActivityIndicator size="large" color="#000000"  />        
            :
            null
          }
              <Text>{"\n"}</Text>
               <Button title="Check In" onPress={setEntryTimeStatus} />
              
        </View> 
    );
  } 
  const Datamsg = () => {
      return (
         <View style={styles.flashMessage}>
          <Text style={styles.textmsg}><Text></Text>{"\n"}{"\n"}{msg}{"\n"}{"\n"}</Text>
         </View>   
      );
  }

  const FatchdataRaw = () => {
      return (
         <View style={styles.container}>
          <Text style={styles.text}><Text></Text>{fetchdata}{"\n"}</Text>
         </View>   
      );
  }

  
// variable 
  const [fetchdata, setfetchdata] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [category, setCategory] = React.useState(null);
  const [brand, setBrand] = React.useState(null);
  const [timestamp, setTimestamp] = React.useState(null);
  const [registerstatus, setStatus] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const [companyName, setcompanyName] = React.useState(null);
  const [designation, setdesignation] = React.useState(null);

  const [animatingStatue, setanimatingStatue] = React.useState(false);

  const [deligate, setdelegates] = React.useState([]);

  onRead = async (e) => {   
    
    console.log(constVar.base_url); 
    console.log(e.data); 
    const text = e.data.split("-&-");
    setName(text[3]);
    setEmail(text[0]);
    setCategory(text[2]);
    setBrand(text[1].toLowerCase());
    setcompanyName(text[4]);
    setdesignation(text[5]);
    const today = new Date();
    //setTimestamp(today);
    setfetchdata(text);   
    //const arraydata = ['roh','tes','htek','end'];
    console.log(text[6]);
    if(text[6]){
      const arraydata = text[6].split("-#-"); 
      setdelegates(arraydata);   
    }
        
  }
    const setEntryTimeStatus =  () =>{
        setanimatingStatue(true);
    const today = new Date();  

    axios.post(constVar.base_url+'/qrcodesresult/',    
            JSON.stringify({
              email: email,
              timestamp: Date.parse(today),              
            })
     ).then((response) =>{
     setanimatingStatue(false);        
        setStatus(response.data.status);
        let varr = response.data;          
        setMsg(varr.mssg);
     }).catch((err) =>{
         console.log("Enter in Catch error block"); 
          console.log(err);
          setMsg(err[0]);
     })
     //navigation.navigate('Home');
  }
   
  
  return ( 
    <SafeAreaView>
     <ScrollView>
    <View style={styles.container}>    
      <Text style={styles.pageheading}>QRCode Scanner/Result Screen</Text>
      {fetchdata == null ?

        <View style={styles.qrCodeContainer}>
          <QRCodeScanner onRead={onRead}/>
        </View>
        :
         null
      }
      { name != null?         
          <Datarecord/>
        :
        <FatchdataRaw/>
      }
        <View>
          <Datamsg/>
        </View> 
    </View>
  </ScrollView>  
  </SafeAreaView>
  ); 
}

const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScanner} />
        <Stack.Screen name="Scanner" component={ScannerResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",    
    paddingHorizontal: 20,
  },
  imageS: {
    flex: 1,
    resizeMode: "cover",
  },
  text: {
    color: "#007f2d73",
    fontSize: 20,
    fontWeight: "normal",
    textAlign: "center",    
    justifyContent:'center', 
    textShadowColor: "#007f2d73",
    textShadowRadius: 1,
    paddingLeft:10,
    paddingRight:10, 
    fontFamily: "Cochin"  
  },
   textscanner: {
    color: "black",
    fontSize: 20,
    fontWeight: "normal",
    textAlign: "left",    
    justifyContent:'center', 
    textShadowColor: "#007f2d73",
    textShadowRadius: 1,
    paddingLeft:10,
    paddingRight:10, 
    fontFamily: "Cochin"  
  },
  pageheading:{
    color: "black",
    fontSize: 20,
    fontWeight: "bold",    
    width:'100%', 
    justifyContent:'center', 
    textAlign: 'center', 
    marginBottom:10,
    textDecorationLine: 'underline',
    fontStyle: 'italic'
  },
  flashMessageF:{
    position:'absolute', 
    backgroundColor:'red', 
    width:'100%', 
    justifyContent:'center', 
    alignItems:'center',           
    height:60, 
    top:0
  },
  flashMessageS:{
    position:'relative', 
    backgroundColor:'green', 
    width:'100%', 
    justifyContent:'center', 
    alignItems:'center',           
    height:80, 
    bottom:140,
  },
  textmsg: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",    
    margin:10,
    paddingLeft:10,
    paddingRight:10,
    padding:0
  },
  tinyLogo: {       
    width: 250,
    height: 250,
  },
  imgContainer: {    
    alignItems: 'center',
    justifyContent:'center', 

  },  
  qrCodeContainer: {    
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    marginTop:60,
    paddingTop:10,   
  },  
   input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  selectcontainer: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
    marginTop:50
  },
  textbold: {
    fontWeight: "bold", 
  },
   horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }  
});


export default App;