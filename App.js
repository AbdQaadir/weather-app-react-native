import { StatusBar } from "expo-status-bar";
import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, _Text } from "react-native";
import { WEATHER_API_KEY } from '@env';
import {colors} from './utils/index'

import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from "./components/UnitsPicker";
import WeatherDetails from './components/WeatherDetails'


const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

export default function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState([]);
  const [unitSystem, setUnitSystem] = useState("metric");


  const fetchWeather = async({lat, lon}) => {
    const weatherUrl = `${BASE_WEATHER_URL}lat=${lat}&lon=${lon}&units=${unitSystem}&appid=${WEATHER_API_KEY}`;
    fetch(weatherUrl)
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      setCurrentWeather(result);
    })
    .catch((err) => setErrorMessage(err.message));
    setLoading(false);
  }
  const handleClick = async () => {
    // Check if the input field is not empty before implementing the fetch request
    if(query){
      setCurrentWeather([]);
      setErrorMessage("");
      setLoading(true);
      fetch(`${BASE_WEATHER_URL}q=${query}&units=metric&appid=${WEATHER_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.cod === "404"){
          setErrorMessage(data.message);
          setLoading(false);
        }else{
          const { lat, lon } = data.coord;
          fetchWeather({lat, lon});
        }
      })
      .catch((err) => setErrorMessage(err.message));
    }
  }

  // Refetch the data when the unit system changes: celcius or farenheit
  useEffect(() => {
    handleClick();
  }, [unitSystem]);


    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.main}>
          <View style={styles.inputRow}>
            <TextInput style={styles.input}  value={query} onChangeText={(text) => setQuery(text)} placeholder="Enter City" />
            <TouchableOpacity disabled={!query ? true : false} style={styles.button} onPress={() => handleClick()}>
              <Text>Search</Text>
            </TouchableOpacity>
          </View>
          {currentWeather.main && !loading ? (
            <>
            <UnitsPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem}/>
            <WeatherInfo currentWeather={currentWeather} />
            </>
          ) : <></>}
          {errorMessage && !loading ? <Text style={{textAlign: 'center', textTransform: 'capitalize', color: 'red', fontSize: 20}}>{errorMessage}</Text>  : <></>}
          {loading ? <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} /> : <></>}
        </View>
        {currentWeather.main && !loading ? <WeatherDetails unitSystem={unitSystem} currentWeather={currentWeather}/> : <></>}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  main: {
    justifyContent: 'center',
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  input: {
    width: '60%',
    marginRight: 10,
    height: 40,
    borderColor: 'rgba(0,0,0,.095)',
    padding: 9,
    borderWidth: 1,
  },
  button: {
    width: "25%",
    height: 40,
    color: '#fff',
    backgroundColor: colors.PRIMARY_COLOR,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 420,
    fontWeight: '600'
  }
});
