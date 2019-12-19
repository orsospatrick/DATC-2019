/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Button,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
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
  const [time, setTime] = useState(30000);
  const [alertGlobal, setAlertGlobal] = useState(false);

  const getSensorDetails = () => {
    Geolocation.getCurrentPosition(info => {
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
  useEffect(() => {
    // Update the document title using the browser API
    getSensorDetails();
    populateAnimalData();
    getMeters();
  }, []);

  const getMeters = () => {
    let finalDistance = 0;
    let distanceResult = 0;
    let sumDistance = [];

    getSensorDetails();

    for (let i = 0; i < animalList.length; i++) {
      distanceResult = getDistance(
        {latitude: latitude, longitude: longitude},
        {latitude: animalList[i].lat, longitude: animalList[i].long},
      );
      sumDistance.push(distanceResult);
    }
    finalDistance = Math.min.apply(null, sumDistance);
    setDistance(finalDistance);
  };

  const callRescueTeam = () => {
    Linking.openURL('tel:+40767503706');
  };

  const activateAlarm = () => {
    Alert.alert(
      'Go in safe Area',
      `Animal is ${distance} meters away from you `, // <- this part is optional, you can pass an empty string
      [{text: 'OK', onPress: () => setAlert(true)}],
      {cancelable: false},
    );
  };

  const populateAnimalData = async () => {
    const response = await fetch(
      'https://animaldangerapi.azurewebsites.net/api/Animal',
    );
    const data = await response.json();
    console.log(data);
    setAnimalList(data);
  };

  const showAlert = description => {
    if (alertGlobal === false) {
      Alert.alert(`DANGER :${description}!`);
    }
  };

  const handleAlert = async () => {
    const response = await fetch(
      'https://animaldangerapi.azurewebsites.net/api/Animal/Alerts',
    );
    const data = await response.json();
    console.log(data);
    if (data != null) {
      showAlert(data[0].description);
      setAlertGlobal(true);
    }
  };

  useInterval(() => {
    populateAnimalData();
  }, time);

  useInterval(() => {
    let testDistance = 2000;
    getMeters();
    handleAlert();
    console.log('My longitude' + longitude);
    console.log('My latitidudine' + latitude);
    console.log('Distance between me and nearest animal  ' + distance);
    if (distance < testDistance && alert === false) {
      activateAlarm();
    }
  }, 1000);

  return (
    <>
      <MapView
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={mapStyle}>
        <Marker
          draggable
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          onDragEnd={e => alert(JSON.stringify(e.nativeEvent.coordinate))}
          title={'My position'}
          description={'I am here !'}
          onTouchMove={() => setTime(60000)}
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
      <TouchableOpacity style={styles.button} onPress={callRescueTeam}>
        <Text style={styles.txtButton}>Press for help</Text>
      </TouchableOpacity>
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
  txtButton: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: '2%',
  },
  button: {
    position: 'absolute', //use absolute position to show button on top of the map
    top: '85%', //for center align
    right: '25%',
    borderRadius: 20,
    width: '50%',
    height: '7%',
    backgroundColor: '#fff',
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
