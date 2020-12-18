import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import {Picker} from '@react-native-community/picker';

export default function UnitsPicker({unitSystem, setUnitSystem}) {
    return (
        <View style={styles.unitsSystem}>
            <Picker selectedValue={unitSystem} onValueChange={(item) => setUnitSystem(item)} mode="dropdown" itemStyle={{fontSize: 120}}>
                <Picker.Item label="C" value="metric" />
                <Picker.Item label="F" value="imperial" />
            </Picker>
        </View>
    )
}


const styles = StyleSheet.create({
    unitsSystem: {
        position: 'absolute',
        ... Platform.select({
            ios: {
                top: -20,
            },
            android: {
                top: 30,
            }
        }),
        left: 20,
        height: 20,
        width: 100,


    }
})