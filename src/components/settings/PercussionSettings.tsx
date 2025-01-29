import {Text, View} from "react-native";
import {colors, styles} from "../generic/styles";
import React from "react";

export const PercussionSettings = () => (
    <View style={[styles.settings, {backgroundColor: colors.percussionActive}]}>
        <Text style={styles.tabTitle}>Percussion</Text>
        <View style={styles.pickerRow}>
            <Text style={styles.label}>Metronome</Text>
        </View>
        <View style={styles.pickerRow}>
            <Text style={styles.label}>Cymbals</Text>
        </View>
        <View style={styles.pickerRow}>
            <Text style={styles.label}>Bass and Snare</Text>
        </View>
        <View style={styles.pickerRow}>
            <Text style={styles.label}>Fills</Text>
        </View>
        <View style={styles.pickerRow}>
            <Text style={styles.label}>Rhythm Variability</Text>
        </View>
        <View style={styles.paddingRow}/>
    </View>
);