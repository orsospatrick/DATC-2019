import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, TextInput, Picker} from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const App = () => {
  const [typeAnimal, setTypeAnimal] = useState('');
  const [nameVet, setNameVet] = useState('');
  const [visible, setVisible] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [language, setLanguage] = useState('');

  const getSensorDetails = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };

  useEffect(() => {
    getSensorDetails();
  });

  const mountSensor = () => {
    let type = 0;
    if (typeAnimal === 'Bear') {
      type = 0;
    } else if (typeAnimal === 'Fox') {
      type = 1;
    } else if (typeAnimal === 'Wolf') {
      type = 2;
    }

    const body = {
      Id: 1,
      Lat: latitude,
      Long: longitude,
      Name: nameVet,
      Type: type,
    };
    console.log(
      'This data will be send to background worker ' + JSON.stringify(body),
    );
    axios({
      method: 'post',
      url: 'https://animaldangerapi.azurewebsites.net/api/Animal',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      data: body,
    })
      .then(function(response) {
        console.log('The response of the server: ' + response);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        //
      });
  };

  const pressButton = () => {
    setVisible(true);
    getSensorDetails();
    mountSensor();
  };

  return (
    <>
      <View style={styles.bigView}>
        <View style={styles.containerStyle}>
          <TextInput
            style={styles.textStyle}
            placeholder={'Vet name'}
            value={nameVet}
            placeholderTextColor="#fff"
            onChangeText={text => setNameVet(text)}
          />
          <Text style={{color: '#fff', marginLeft: 100, marginTop:20}}>
            Chose type of animal
          </Text>
          <Picker
            selectedValue={typeAnimal}
            style={{height: 50, width: 200, marginLeft: 80}}
            onValueChange={(itemValue, itemIndex) => {
              setTypeAnimal(itemValue);
            }}>
            <Picker.Item label="Bear" value="Bear" />
            <Picker.Item label="Fox" value="Fox" />
            <Picker.Item label="Wolf" value="Wolf" />
          </Picker>
          <View style={styles.buttonContainer}>
            <Button
              title="Activate sensor"
              value={nameVet}
              buttonStyle={styles.buttonStyle}
              onPress={pressButton}
            />
          </View>
        </View>
        <Overlay isVisible={visible} onBackdropPress={() => setVisible(false)}>
          <Text>This animal is monitored</Text>
        </Overlay>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bigView: {
    backgroundColor: '#bf8040',
    height: '100%',
  },
  buttonStyle: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: '#A0522D',
  },
  buttonContainer: {
    marginTop: '15%',
    height: '20%',
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textStyle: {
    height: '8%',
    alignSelf: 'center',
    width: '80%',
    borderColor: 'black',
    borderWidth: 2,
    marginTop: '10%',
  },
});

export default App;
