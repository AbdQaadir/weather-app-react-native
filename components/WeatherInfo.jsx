import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

import {colors} from '../utils/index';

const {PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR} = colors;
export default function WeatherInfo({currentWeather}) {
    const {
        main: {temp},
        weather: [details],
        name
    } = currentWeather;
    
    const {icon, main, description} = details;
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    return (
        <View style={styles.weatherInfo}>
            <Text>{name}</Text>
            <Image style={styles.weatherIcon} source={{ uri: iconUrl }}/>
            <Text style={styles.textPrimary}>{temp}°</Text>
            <Text style={styles.weatherDescription}>{description}</Text>
            <Text style={styles.textSecondary}>{main}</Text>
        </View>
    ) 
}

const styles = StyleSheet.create({
    weatherInfo: {
        alignItems: 'center',
    },
    weatherDescription: {
        textTransform: "capitalize",
    },
    weatherIcon: {
        width: 100,
        height: 100
    },
    textPrimary: {
        fontSize: 40,
        color: PRIMARY_COLOR
    },
    textSecondary: {
        fontSize: 20,
        color: SECONDARY_COLOR,
        fontWeight: '500',
        marginTop: 10,
    }
})
