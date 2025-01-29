// components/TrebleSettings.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { styles, colors } from './styles';
import PickerModal from './PickerModal'; // Adjust the path if necessary
import PickerButton from './PickerButton';

const instrumentOptions = {
  'Acoustic Grand Piano': 'acoustic_grand_piano',
  Harp: 'orchestral_harp',
  'Acoustic Guitar (Nylon)': 'acoustic_guitar_nylon',
  'Acoustic Guitar (Steel)': 'acoustic_guitar_steel',
  'Electric Guitar (Clean)': 'electric_guitar_clean',
  'Electric Bass (Picked)': 'electric_bass_pick',
  'Synth Bass': 'synth_bass_1',
  'Slap Bass': 'slap_bass_2',
  Violin: 'violin',
  'String Ensemble': 'string_ensemble_1',
  Trumpet: 'trumpet',
  Saxophone: 'tenor_sax',
  Flute: 'flute',
  Marimba: 'marimba',
  'Voice Oohs': 'voice_oohs',
};

const randomizationRulesOptions = {
  Uniform: 'uniform',
  'Tonic On Ones': 'tonic_on_ones',
  'Chords (Arpeggio)': 'chords_arpeggio',
};

const noteDenomOptions = {
  w: 1,
  h: 2,
  q: 4,
  e: 8,
  x: 16,
};

const noteDenomNames = {
  'Whole (1)': 1,
  'Half (1/2)': 2,
  'Quarter (1/4)': 4,
  'Eigth (1/8)': 8,
  'Sixteenth (1/16)': 16,
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const TrebleSettings = ({
  trebleInstrumentSettings,
  setTrebleInstrumentSettings,
}) => {
  const [isPickerModalVisible, setPickerModalVisible] = useState(false);
  const [pickerType, setPickerType] = useState(null);

  const handleInstrumentChange = (newInstrument) => {
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      instrument: instrumentOptions[newInstrument],
    }));
  };

  const handleRandomizationRuleChange = (newRule) => {
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      randomizationRules: randomizationRulesOptions[newRule],
    }));
  };

  const handleNoteDenomChange = (newDenom) => {
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      smallestNoteDenom: noteDenomNames[newDenom],
    }));
  };

  const increaseNotesPerMeasure = () =>
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      notesPerMeasure: Math.min(32, prevSettings.notesPerMeasure + 1),
    }));

  const decreaseNotesPerMeasure = () =>
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      notesPerMeasure: Math.max(0, prevSettings.notesPerMeasure - 1),
    }));

  const increaseRhythmVariability = () =>
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      rhythmVariability: Math.min(100, prevSettings.rhythmVariability + 5),
    }));

  const decreaseRhythmVariability = () =>
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      rhythmVariability: Math.max(0, prevSettings.rhythmVariability - 5),
    }));

  const toggleTriplets = () =>
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      enableTriplets: !prevSettings.enableTriplets,
    }));

  const decreaseNoteDenom = () => {
    const currentDenom = trebleInstrumentSettings.smallestNoteDenom;
    const denomKeys = Object.keys(noteDenomOptions);
    const currentIndex = denomKeys.findIndex(
      (key) => noteDenomOptions[key] === currentDenom
    );
    const nextIndex = Math.min(denomKeys.length - 1, currentIndex + 1);
    const nextKey = denomKeys[nextIndex];
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      smallestNoteDenom: noteDenomOptions[nextKey],
    }));
  };

  const increaseNoteDenom = () => {
    const currentDenom = trebleInstrumentSettings.smallestNoteDenom;
    const denomKeys = Object.keys(noteDenomOptions);
    const currentIndex = denomKeys.findIndex(
      (key) => noteDenomOptions[key] === currentDenom
    );
    const prevIndex = Math.max(0, currentIndex - 1);
    const prevKey = denomKeys[prevIndex];
    setTrebleInstrumentSettings((prevSettings) => ({
      ...prevSettings,
      smallestNoteDenom: noteDenomOptions[prevKey],
    }));
  };

  const MaestroText = ({ noteLetter }) => {
    const lineHeight = noteLetter === 'w' ? 0 : 5; // Adjust lineHeight based on noteLetter
    return (
      <Text
        style={[
          styles.maestroGlyphButton,
          { lineHeight, marginBottom: noteLetter === 'w' ? 7 : 0 },
        ]}>
        {noteLetter}
      </Text>
    );
  };

  return (
    <View style={[styles.settings, { backgroundColor: colors.instrumentsActive }]}>
      <Text style={styles.tabTitle}>Treble</Text>

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Instrument</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setPickerModalVisible(true);
            setPickerType('instrument');
          }}>
          <Text style={styles.pickerButtonText}>
            {getKeyByValue(
              instrumentOptions,
              trebleInstrumentSettings.instrument
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Notes per Measure</Text>
        <PickerButton onPress={decreaseNotesPerMeasure} label="-" />
        <Text style={styles.label}>
          {trebleInstrumentSettings.notesPerMeasure}
        </Text>
        <PickerButton onPress={increaseNotesPerMeasure} label="+" />
      </View>

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Smallest Note</Text>
        <PickerButton onPress={decreaseNoteDenom} label="-" />
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setPickerModalVisible(true);
            setPickerType('noteDenom');
          }}>
          <MaestroText
            noteLetter={getKeyByValue(
              noteDenomOptions,
              trebleInstrumentSettings.smallestNoteDenom
            )}
          />
        </TouchableOpacity>
        <PickerButton onPress={increaseNoteDenom} label="+" />
      </View>

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Rhythm Variability</Text>
        <PickerButton onPress={decreaseRhythmVariability} label="-" />
        <Text style={styles.label}>
          {trebleInstrumentSettings.rhythmVariability}%
        </Text>
        <PickerButton onPress={increaseRhythmVariability} label="+" />
      </View>

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Enable Triplets</Text>
        <TouchableOpacity
          style={[
            styles.pickerButton,
            {
              backgroundColor: trebleInstrumentSettings.enableTriplets
                ? colors.activeColor
                : colors.passiveButtonColor,
            },
          ]}
          onPress={toggleTriplets}>
          <Text style={styles.pickerButtonText}>
            {trebleInstrumentSettings.enableTriplets
              ? 'Triplets Enabled'
              : 'Triplets Disabled'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Randomization Rules</Text>
        <PickerButton
          onPress={() => {
            setPickerModalVisible(true);
            setPickerType('randomizationRules');
          }}
          label={getKeyByValue(
            randomizationRulesOptions,
            trebleInstrumentSettings.randomizationRules
          )}
        />
      </View>

      {PickerModal(
        pickerType === 'instrument'
          ? Object.keys(instrumentOptions)
          : pickerType === 'noteDenom'
          ? Object.keys(noteDenomNames)
          : Object.keys(randomizationRulesOptions),
        pickerType === 'instrument'
          ? handleInstrumentChange
          : pickerType === 'noteDenom'
          ? handleNoteDenomChange
          : handleRandomizationRuleChange,
        isPickerModalVisible,
        setPickerModalVisible
      )}

      {/* Include other settings as necessary */}
      <View style={styles.paddingRow} />
    </View>
  );
};

export default TrebleSettings;
