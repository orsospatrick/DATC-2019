import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, StyleSheet, Alert} from 'react-native';
import {useInterval} from './helpers/setInterval';
import Geolocation from '@react-native-community/geolocation';
import {getDistance} from 'geolib';

const App = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [latitudeAnimal, setLatitudeAnimal] = useState(0);
  const [longitudeAnimal, setLongitudeAnimal] = useState(0);
  const [distance, setDistance] = useState(0);

  const getSensorDetails = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };

  const getMeters = () => {
    setLatitudeAnimal(45.461384);
    setLongitudeAnimal(21.234174);
    let distance = getDistance(
      {latitude: latitude, longitude: longitude},
      {latitude: latitudeAnimal, longitude: longitudeAnimal},
    );
    setDistance(distance);
  };

  const activateAlarm = () => {
    Alert.alert(
      'A dangerous wild animal is in your area, Stay in a safe place',
    );
  };

  useInterval(() => {
    let testDistance = 10105358;
    getSensorDetails();
    getMeters();
    console.log(distance);
    if (distance === testDistance) {
      activateAlarm();
    }
  }, 1000);

  return (
    <>
      <Image
        style={styles.imageStyle}
        source={require('./images/securityDeltaFore.png')}
      />
      <Text style={styles.textStyle}>You will be in safe with our system</Text>
    </>
  );
};

// eslint-disable-next-line no-undef
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#DEB887',
  },
  textStyle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: '10%',
  },
  imageStyle: {
    width: '100%',
    height: '40%',
  },
});

export default App;
