// MeasureAndTempoSettings.js

import React from 'react';
import {Text, View} from 'react-native';
import {colors, styles} from '../generic/styles';
import PickerButton from '../generic/PickerButton';

const tempoTerms = [
    {bpm: 0, term: 'Larghissimo'},
    {bpm: 35, term: 'Larghissimo (Grave)'},
    {bpm: 40, term: 'Largo (Grave)'},
    {bpm: 45, term: 'Largo (Lento)'},
    {bpm: 60, term: 'Larghetto'},
    {bpm: 66, term: 'Adagio'},
    {bpm: 72, term: 'Adagietto'},
    {bpm: 76, term: 'Andante'},
    {bpm: 80, term: 'Andante (Andantino)'},
    {bpm: 92, term: 'Andante Moderato'},
    {bpm: 108, term: 'Moderato'},
    {bpm: 112, term: 'Allegretto (Moderato)'},
    {bpm: 116, term: 'Allegro Moderato'},
    {bpm: 120, term: 'Allegro'},
    {bpm: 140, term: 'Allegro (Vivace)'},
    {bpm: 168, term: 'Presto'},
    {bpm: 172, term: 'Allegrissimo (Vivacissimo)'},
    {bpm: 176, term: 'Presto'},
    {bpm: 200, term: 'Prestissimo'},
];

const getTempoTerm = (bpm) => {
    const reversedTerms = [...tempoTerms].reverse();
    const term = reversedTerms.find((term) => bpm >= term.bpm);
    return term ? term.term : 'Unknown';
};

const MeasureAndTempoSettings = ({timeSignature, setTimeSignature, bpm, updateBpm, numMeasures, setNumMeasures}) => {

    const increaseBpm = () => {
        const newBpm = bpm + 5;
        updateBpm(newBpm);
    };

    const decreaseBpm = () => {
        const newBpm = bpm > 10 ? bpm - 5 : 10;
        updateBpm(newBpm);
    };

    const incrementNumMeasures = () => {
        const newNM = numMeasures < 10 ? numMeasures + 1 : 10;
        setNumMeasures(newNM);
    };

    const decrementNumMeasures = () => {
        const newNM = numMeasures > 1 ? numMeasures - 1 : 1;
        setNumMeasures(newNM);
    };

    const incrementTop = () => {
        setTimeSignature([timeSignature[0] + 1, timeSignature[1]]);
    };

    const decrementTop = () => {
        setTimeSignature([timeSignature[0] > 1 ? timeSignature[0] - 1 : 1, timeSignature[1]]);
    };

    const incrementBottom = () => {
        const newMeasureNorm = timeSignature[1] === 4 ? 8 : 16;
        setTimeSignature([timeSignature[0], newMeasureNorm]);
    };

    const decrementBottom = () => {
        const newMeasureNorm = timeSignature[1] === 16 ? 8 : 4;
        setTimeSignature([timeSignature[0], newMeasureNorm]);
    };

    return (
        <View style={[styles.settings, {backgroundColor: colors.measureAndScaleActive}]}>
            <Text style={styles.tabTitle}>Measure and Tempo</Text>

            <View style={styles.pickerRow}>
                <Text style={styles.label}>Tempo</Text>
                <PickerButton onPress={decreaseBpm} label="-"/>
                <View style={styles.metronomeContainer}>
                    <Text style={styles.noteText}>q</Text>
                    <Text style={styles.label}> =</Text>
                    <Text style={styles.bpmText}>{bpm}</Text>
                </View>
                <PickerButton onPress={increaseBpm} label="+"/>
                <Text style={styles.tempoTerm}>{getTempoTerm(bpm)}</Text>
            </View>

            <View style={styles.pickerRow}>
                <Text style={styles.label}>Measure</Text>
                <View style={styles.measureContainer}>
                    <View style={styles.measureRow}>
                        <PickerButton onPress={decrementTop} label="-"/>
                        <Text style={styles.measureText}>{timeSignature[0]}</Text>
                        <PickerButton onPress={incrementTop} label="+"/>
                    </View>
                    <View style={styles.measureRow}>
                        <PickerButton onPress={decrementBottom} label="-"/>
                        <Text style={styles.measureText}>{timeSignature[1]}</Text>
                        <PickerButton onPress={incrementBottom} label="+"/>
                    </View>
                </View>
            </View>

            <View style={styles.pickerRow}>
                <PickerButton onPress={decrementNumMeasures} label="-"/>
                <Text style={styles.label}> Number of Measure {numMeasures}</Text>
                <PickerButton onPress={incrementNumMeasures} label="+"/>
            </View>
        </View>
    );
};

export default MeasureAndTempoSettings;