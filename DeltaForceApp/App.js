import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, StyleSheet, Alert} from 'react-native';
import {useInterval} from './helpers/setInterval';
import Geolocation from '@react-native-community/geolocation';
import {getDistance} from 'geolib';
import MapView, {Marker} from 'react-native-maps';

// latitude: 45.744877,
// longitude: 21.228261,

const App = () => {
  const [latitude, setLatitude] = useState(45.744877);
  const [longitude, setLongitude] = useState(21.228261);
  const [latitudeAnimal, setLatitudeAnimal] = useState(0);
  const [longitudeAnimal, setLongitudeAnimal] = useState(0);
  const [distance, setDistance] = useState(0);
  const [alert, setAlert] = useState(false);
  const [animalList, setAnimalList] = useState([]);

  const getSensorDetails = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
  useEffect(() => {
    // Update the document title using the browser API
    populateAnimalData();
  }, []);

  const getMeters = () => {
    let jsonFirst = animalList[0];

    let distanceResult1 = getDistance(
      {latitude: latitude, longitude: longitude},
      {latitude: jsonFirst.lat, longitude: jsonFirst.long},
    );
    let jsonSecond = animalList[1];

    let distanceResult2 = getDistance(
      {latitude: latitude, longitude: longitude},
      {latitude: jsonSecond.lat, longitude: jsonSecond.long},
    );
    let jsonThird = animalList[2];

    let distanceResult3 = getDistance(
      {latitude: latitude, longitude: longitude},
      {latitude: jsonThird.lat, longitude: jsonThird.long},
    );
    console.log(distanceResult1 + distanceResult2 + distanceResult3);
    let finalDistance = Math.min(
      distanceResult1,
      distanceResult2,
      distanceResult3,
    );
    setDistance(finalDistance);
  };

  const activateAlarm = () => {
    Alert.alert(
      'Please',
      'Go in safe Area', // <- this part is optional, you can pass an empty string
      [{text: 'OK', onPress: () => setAlert(true)}],
      {cancelable: false},
    );
  };

  const populateAnimalData = async () => {
    const response = await fetch(
      'https://animaldangerapi.azurewebsites.net/api/Animal',
    );
    const data = await response.json();
    setAnimalList(data);
  };

  useInterval(() => {
    let testDistance = 10105360;
    // getSensorDetails();
    getMeters();
    populateAnimalData();
    console.log('My longitude' + longitude);
    console.log('My latitidudine' + latitude);
    console.log('Distance between me and nearest animal' + distance);
    if (distance < testDistance && alert === false) {
      activateAlarm();
    }
  }, 10000);

  return (
    <>
      <MapView
        style={styles.map}
        region={{
          latitude: 45.744877,
          longitude: 21.228261,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={mapStyle}>
        <Marker
          draggable
          coordinate={{
            latitude: 45.744877,
            longitude: 21.228261,
          }}
          onDragEnd={e => alert(JSON.stringify(e.nativeEvent.coordinate))}
          title={'My position'}
          description={'I am here !'}
        />
        {animalList.map((animal, index) => (
          <Marker
            draggable
            key={index}
            coordinate={{
              latitude: animal.lat,
              longitude: animal.long,
            }}
            image={require('./images/show.png')}
            onDragEnd={e => alert(JSON.stringify(e.nativeEvent.coordinate))}
            title={animal.partitionKey}
            description={'An animal is there !'}
          />
        ))}
      </MapView>
    </>
  );
};

// eslint-disable-next-line no-undef
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
];

export default App;
