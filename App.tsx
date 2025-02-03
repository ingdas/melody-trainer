// App.js
import React, {useEffect, useRef} from 'react';
import {Dimensions, Text, TouchableOpacity, View,} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {useFonts} from 'expo-font';
import Keyboard from './src/components/Keyboard';
import {
    intervalNames,
    intervalNamesMap,
    modes,
    randomMode,
    randomScale,
    randomTonic,
    tonicOptions,
} from './src/operations/scale/scaleHandler';
import SheetMusic from './src/components/SheetMusic';
import MeasureAndTempoSettings from './src/components/settings/MeasureAndTempoSettings';
import {ContinuousPlaybackSettings} from './src/components/settings/ContinuousPlaybackSettings';
import TrebleSettings from './src/components/settings/TrebleSettings';
import {faGuitar, faPlay} from '@fortawesome/free-solid-svg-icons';

import {colors, styles} from './src/components/generic/styles';

import playMelodies from './src/operations/playback/playMelodies';
import playContinuously from './src/operations/playback/playContinuously';

import {ScaleModeSettings} from "./src/components/settings/ScaleModeSettings";
import {useStore} from "./src/model/UseStore";
import {InstrumentSettings} from "./src/model/InstrumentSettings";

import {Instrument} from "./src/model/Instrument";
import {PercussionSettings} from "./src/components/settings/PercussionSettings";
import {TempoMetronome} from "./src/components/TempoMetronome";
import {updateMetronome} from "./src/model/Melody";
import allNotesArray from "./src/operations/allNotesArray";
import {SettingModal} from "./src/model/UseStoreTypes";


const App = () => {
    useFonts({
        Maestro: require('./assets/fonts/maestro.ttf'),
    });

    const {
        tonic,
        setTonic,
        selectedScaleType,
        setSelectedScaleType,
        selectedMode,
        setSelectedMode,
        scaleRange,
        setScaleRange,
        selectedInterval,
        setSelectedInterval,
        scale,
        bpm,
        setBpm,
        timeSignature,
        setTimeSignature,
        numMeasures,
        setNumMeasures,
        isPlayingContinuously,
        setIsPlayingContinuously,
        setStopPlayback,
        screenWidth,
        setScreenWidth,
        isTonicModalVisible,
        isScaleTypeModalVisible,
        isModeModalVisible,
        context,
        instruments,
        setTonicModalVisible,
        setScaleTypeModalVisible,
        setModeModalVisible,
        setInstrumentMelody,
        randomizeMelody,
        setInstrumentSettings,
        settingsModal,
        handleSettingsModalClick
    } = useStore();

    // State Handlers
    const abortControllerRef = useRef(null);

    useEffect(() => {
        const updatedMetronome = updateMetronome(timeSignature, numMeasures);
        setInstrumentMelody(Instrument.Metronome, updatedMetronome);
    }, [timeSignature, numMeasures]);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(Dimensions.get('window').width);
        };
        const subscription = Dimensions.addEventListener('change', handleResize);
        return () => {
            subscription.remove();
        };
    }, []);

    // SCALE AND MODE HANDLING
    const handleRandomizeTonic = () => {
        const newTonic = randomTonic(); // Get random tonic
        setTonic(newTonic);
    };

    const handleRandomizeScaleType = () => {
        setSelectedScaleType(randomScale());
        setSelectedMode(randomMode(selectedScaleType));
    };

    const handleRandomizeMode = () => {
        setSelectedMode(randomMode(selectedScaleType));
    };

    const chooseScaleType = (newScaleType : string) => {
        const scaleTypeModes = modes[newScaleType];
        const modesArray = Object.keys(scaleTypeModes);
        setSelectedScaleType(newScaleType);
        setSelectedMode(modesArray[0]);
    };

    const increaseScaleRange = () => {
        let currentIndex = intervalNames.indexOf(selectedInterval);
        let nextIndex = Math.min(currentIndex + 1, intervalNames.length - 1);
        let newInterval = intervalNames[nextIndex];
        setScaleRange(intervalNamesMap[newInterval]);
        setSelectedInterval(newInterval);
    };

    const decreaseScaleRange = () => {
        let currentIndex = intervalNames.indexOf(selectedInterval);
        let nextIndex = Math.max(currentIndex - 1, 0);
        let newInterval = intervalNames[nextIndex];
        setScaleRange(intervalNamesMap[newInterval]);
        setSelectedInterval(newInterval);
    };

    const playScale = async () => {
        instruments.treble.settings.sound.stop({});
        instruments.bass.settings.sound.stop({});
        instruments.percussion.settings.sound.stop({});
        instruments.metronome.settings.sound.stop({});
        await playMelodies(
            [scale],
            [instruments.treble.settings.sound],
            context,
            bpm,
            context.currentTime
        );
    };

    const playAllMelodies = async () => {
        handleStopAllPlayback();
        await playMelodies(
            [instruments.treble.melody, instruments.bass.melody, instruments.percussion.melody],
            [instruments.treble.settings.sound, instruments.bass.settings.sound, instruments.percussion.settings.sound],
            context,
            bpm,
            context.currentTime
        );
    };

    const handlePlayContinuouslyButton = () => {
        if (isPlayingContinuously) {
            handleStopAllPlayback();
        } else {
            setStopPlayback(false);
            setIsPlayingContinuously(true);
            abortControllerRef.current = new AbortController(); // Initialize AbortController
            playContinuously(
                instruments,
                setInstrumentMelody,
                abortControllerRef,
                bpm,
                timeSignature,
                numMeasures,
                context,
            ).finally(() => setIsPlayingContinuously(false));
        }
    };

    const handleStopAllPlayback = () => {
        setStopPlayback(true);
        instruments.treble.settings.sound.stop({});
        instruments.bass.settings.sound.stop({});
        instruments.percussion.settings.sound.stop({});
        instruments.metronome.settings.sound.stop({});
        setIsPlayingContinuously(false);
        // Immediately abort the current playback
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Clean up after a short delay to ensure smooth transition
        setTimeout(() => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null; // Reset the abort controller
            }
        }, 20);
    };

    // Definitions for VIEWS
    return (
        <View style={styles.container}>
            <View style={styles.visualizer}>
                <Text style={styles.text}>Melody Visualizer</Text>
                <SheetMusic
                    timeSignature={timeSignature}
                    trebleMelody={instruments.treble.melody}
                    bassMelody={instruments.bass.melody}
                    percussionMelody={instruments.percussion.melody}
                    numAccidentals={scale.numAccidentals}
                    screenWidth={screenWidth}
                />
                <View style={styles.paddingRow}/>
            </View>
            <View style={styles.tempoMetronome}>
                <View style={styles.pickerRow}>
                    <TouchableOpacity style={styles.pickerButton} onPress={playScale}>
                        <Text style={styles.pickerButtonText}> ⏵ Scale </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.pickerButton,
                            {
                                backgroundColor: isPlayingContinuously
                                    ? colors.activeColor
                                    : colors.passiveButtonColor,
                            },
                        ]}
                        onPress={handlePlayContinuouslyButton}>
                        <Text style={styles.pickerButtonText}> ⏵ Continuous </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={playAllMelodies}>
                        <Text style={styles.pickerButtonText}> ⏵ Melodies </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pickerRow}>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={handleStopAllPlayback}>
                        <Text style={styles.pickerButtonText}>Stop</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pickerRow}>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => randomizeMelody(Instrument.Treble)}>
                        <Text style={styles.pickerButtonText}> Randomize Melody </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => randomizeMelody(Instrument.Bass)}>
                        <Text style={styles.pickerButtonText}> Randomize Bass Line </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => randomizeMelody(Instrument.Percussion)}>
                        <Text style={styles.pickerButtonText}> Randomize Percussion </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.visualizer}>
                <Text style={styles.text}>Piano View</Text>
                <Keyboard
                    scaleRange={scaleRange}
                    anyTonic={tonic}
                    currentScale={scale.scale}
                    currentDisplayScale={scale.displayScale}
                    notes={allNotesArray}
                    context={context}
                    trebleInstrument={instruments.treble.settings.sound}
                />
                <View style={styles.paddingRow}/>
            </View>
            <TempoMetronome/>
            <View style={styles.paddingRow}/>
            <View style={styles.paddingRow}/>
            <View
                style={[
                    styles.tabToggleContainer,
                    settingsModal == SettingModal.Invisible
                        ? {bottom: 0}
                        : {bottom: '50%'},
                ]}>
                <TouchableOpacity
                    style={[
                        styles.tabToggle,
                        settingsModal == SettingModal.MeasureAndScaleSettings
                            ? {backgroundColor: colors.measureAndScaleActive}
                            : {backgroundColor: colors.measureAndScalePassive},
                    ]}
                    onPress={() => handleSettingsModalClick(SettingModal.MeasureAndScaleSettings)}>
                    <FontAwesomeIcon icon={faPlay} size={"1x"} color="#E5E5E5"/>
                    <Text style={styles.tabTitle}> Measure & Scale</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabToggle,
                        settingsModal == SettingModal.PlaybackSettings
                            ? {backgroundColor: colors.playbackActive}
                            : {backgroundColor: colors.playbackPassive},
                    ]}
                    onPress={() => handleSettingsModalClick(SettingModal.PlaybackSettings)}>
                    <FontAwesomeIcon icon={faPlay} size={"1x"} color="#E5E5E5"/>
                    <Text style={styles.tabTitle}> Playback</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabToggle,
                        settingsModal == SettingModal.InstrumentSettings
                            ? {backgroundColor: colors.instrumentsActive}
                            : {backgroundColor: colors.instrumentsPassive},
                    ]}
                    onPress={() => handleSettingsModalClick(SettingModal.InstrumentSettings)}>
                    <FontAwesomeIcon icon={faGuitar} size={"1x"} color="#E5E5E5"/>
                    <Text style={styles.tabTitle}> Instruments</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabToggle,
                        settingsModal == SettingModal.PercussionSettings
                            ? {backgroundColor: colors.percussionActive}
                            : {backgroundColor: colors.percussionPassive},
                    ]}
                    onPress={() => handleSettingsModalClick(SettingModal.PercussionSettings)}>
                    <FontAwesomeIcon icon={faPlay} size={"1x"} color="#E5E5E5"/>
                    <Text style={styles.tabTitle}> Percussion</Text>
                </TouchableOpacity>
            </View>
            {settingsModal == SettingModal.PlaybackSettings && (
                <View style={[styles.settingsTab, styles.playbackSettingsTab]}>
                    <ContinuousPlaybackSettings/>
                </View>
            )}
            {settingsModal == SettingModal.MeasureAndScaleSettings && (
                <View style={styles.settingsTab}>
                    <MeasureAndTempoSettings
                        bpm={bpm}
                        updateBpm={setBpm}
                        timeSignature={timeSignature}
                        setTimeSignature={setTimeSignature}
                        numMeasures={numMeasures}
                        setNumMeasures={setNumMeasures}
                    />
                    <ScaleModeSettings
                        currentDisplayScale={scale.displayScale}
                        tonic={tonic}
                        setTonic={setTonic}
                        isTonicModalVisible={isTonicModalVisible}
                        setTonicModalVisible={setTonicModalVisible}
                        tonicOptions={tonicOptions}
                        handleRandomizeTonic={handleRandomizeTonic}
                        selectedScaleType={selectedScaleType}
                        chooseScaleType={chooseScaleType}
                        isScaleTypeModalVisible={isScaleTypeModalVisible}
                        setScaleTypeModalVisible={setScaleTypeModalVisible}
                        handleRandomizeScaleType={handleRandomizeScaleType}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode}
                        isModeModalVisible={isModeModalVisible}
                        setModeModalVisible={setModeModalVisible}
                        handleRandomizeMode={handleRandomizeMode}
                        scaleRange={scaleRange}
                        increaseScaleRange={increaseScaleRange}
                        decreaseScaleRange={decreaseScaleRange}
                    />
                </View>
            )}
            {settingsModal == SettingModal.InstrumentSettings && (
                <View style={styles.settingsTab}>
                    <TrebleSettings
                        trebleInstrumentSettings={instruments.treble.settings}
                        setTrebleInstrumentSettings={(newSettings: InstrumentSettings) => setInstrumentSettings(Instrument.Treble, newSettings)}
                    />
                </View>
            )}
            {settingsModal == SettingModal.PercussionSettings && (
                <View style={styles.settingsTab}>
                    <PercussionSettings/>
                </View>
            )}
        </View>
    );
};

export default App;
