import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, Alert, TextInput} from 'react-native';
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

  const getSensorDetails = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };

  const pressButton = () => {
    console.log(typeAnimal + nameVet);
    setVisible(true);
    getSensorDetails();

    let type = 0;
    if (typeAnimal === 'urs') {
      type = 0;
    } else if (typeAnimal === 'vulpe') {
      type = 1;
    } else if (typeAnimal === 'lup') {
      type = 2;
    }

    const body = {
      Id: 1,
      Lat: latitude,
      Long: longitude,
      Name: 'Georgel',
      Type: 0,
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

  return (
    <>
      <View style={styles.bigView}>
        <View style={styles.containerStyle}>
          <TextInput
            style={styles.textStyle}
            placeholder={'Type of animal'}
            value={typeAnimal}
            onChangeText={text => setTypeAnimal(text)}
          />
          <TextInput
            style={styles.textStyle}
            placeholder={'Vet'}
            value={nameVet}
            onChangeText={text => setNameVet(text)}
          />
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
