import { StatusBar } from "expo-status-bar";
import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, _Text } from "react-native";
import * as location from 'expo-location';
import {colors} from './utils/index'

import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from "./components/UnitsPicker";
import WeatherDetails from './components/WeatherDetails'

// import {WEATHER_API_KEY} from '@env';
const WEATHER_API_KEY = '55fc18a3d6249a2a58c2c9f13f288020';
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";
// q=${query}&units=metric&appid=${API_KEY}

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

  const handleUnitChange = (text) => {
    setUnitSystem(text);
    handleClick();
  }
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
            <UnitsPicker unitSystem={unitSystem} setUnitSystem={handleUnitChange}/>
            <WeatherInfo currentWeather={currentWeather} />
            </>
          ) : <></>}
          {errorMessage && !loading ? <Text style={{textAlign: 'center'}}>{errorMessage}</Text>  : <></>}
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
