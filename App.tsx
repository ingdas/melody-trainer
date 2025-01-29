// App.js
// import { Audio } from 'expo-av';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View,} from 'react-native';
import {SceneMap, TabBar} from 'react-native-tab-view';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Melody from './src/model/Melody';
import MelodyGenerator from './src/model/MelodyGenerator';
import Scale from './src/model/Scale';

import {useFonts} from 'expo-font';
import generateAllNotesArray from './src/operations/allNotesArray';
import Keyboard from './src/components/Keyboard';
import {
    generateSelectedScale,
    intervalNames,
    intervalNamesMap,
    modes,
    randomTonic,
    tonicOptions,
} from './src/operations/scale/scaleHandler'; // Import relevant functions
import SheetMusic from './src/components/SheetMusic'; // Import the SheetMusic component
import MeasureAndTempoSettings from './src/components/settings/MeasureAndTempoSettings';
import {ContinuousPlaybackSettings} from './src/components/settings/ContinuousPlaybackSettings';
import TrebleSettings from './src/components/settings/TrebleSettings';
import {faGuitar, faPlay} from '@fortawesome/free-solid-svg-icons';

import {colors, styles} from './src/components/generic/styles';

import playMelodies from './src/operations/playback/playMelodies';
import playContinuously from './src/operations/playback/playContinuously';

import {DrumMachine, Soundfont} from 'smplr';
import {ScaleModeSettings} from "./src/components/settings/ScaleModeSettings";
import {Instrument, useStore} from "./src/model/UseStore";
import type InstrumentSettings from "./src/model/InstrumentSettings";

const TempoMetronome = () => (
    <View style={styles.tempoMetronome}>
        <Text style={styles.text}>Tempo & Metronome</Text>
    </View>
);


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
        setScale,
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
        storage,
        reverb,
        instruments,
        setTonicModalVisible,
        setScaleTypeModalVisible,
        setModeModalVisible,
        setInstrumentMelody,
        setInstrumentSettings
    } = useStore();

    const treble = instruments[Instrument.Treble];
    const {settings: bassSettings, melody: bassMelody} = instruments[Instrument.Bass];
    const {settings: percussionSettings, melody: percussionMelody} = instruments[Instrument.Percussion];
    const {settings: metronomeSettings, melody: metronomeMelody} = instruments[Instrument.Metronome];

    const allNotesArray = useMemo(() => generateAllNotesArray(), []);

    const percussionScale = Scale.defaultPercussionScale();
    console.log("NOW CREATING:", treble, treble.settings.instrument);
    const trebleInstrument = new Soundfont(context, {
        instrument: treble.settings.instrument,
        storage: storage,
    });
    trebleInstrument.output.addEffect('reverb', reverb, 0.1);
    const bassInstrument = new Soundfont(context, {
        instrument: bassSettings.instrument,
        storage: storage,
    });
    const metronomeInstrument = new Soundfont(context, {
        instrument: metronomeSettings.instrument,
        storage: storage,
    });
    const percussionInstrument = new DrumMachine(context, {
        instrument: percussionSettings.instrument,
        storage: storage,
    });

    // State Handlers
    const abortControllerRef = useRef(null);

    useEffect(() => {
        const updatedMetronome = Melody.updateMetronome(timeSignature, numMeasures);
        setInstrumentMelody(Instrument.Metronome, updatedMetronome);
    }, [timeSignature, numMeasures]);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(Dimensions.get('window').width);
        };
        Dimensions.addEventListener('change', handleResize);
    }, []);

    // melody
    const generateMelody = () => {
        const newMelody = new MelodyGenerator(
            scale,
            numMeasures,
            timeSignature,
            treble.settings
        ).generateMelody();
        setInstrumentMelody(Instrument.Treble, newMelody);
    };

    const generateBassLine = () => {
        const newMelody = new MelodyGenerator(
            scale.generateBassScale(),
            numMeasures,
            timeSignature,
            bassSettings
        ).generateMelody();
        setInstrumentMelody(Instrument.Bass, newMelody);
    };

    const generatePercussion = () => {
        const newMelody = new MelodyGenerator(
            percussionScale,
            numMeasures,
            timeSignature,
            percussionSettings
        ).generateMelody();
        setInstrumentMelody(Instrument.Percussion, newMelody);
    };

    // MEASURE AND TEMPO HANDLING
    const updateBpm = (newBpm) => {
        setBpm(newBpm);
    };

    // SCALE AND MODE HANDLING
    const handleRandomizeTonic = () => {
        const newTonic = randomTonic(); // Get random tonic
        setTonic(newTonic);
    };

    const handleRandomizeScaleType = () => {
        const newTonic = randomTonic(); // Get random tonic
        setTonic(newTonic);
    };

    const handleRandomizeMode = () => {
        const newTonic = randomTonic(); // Get random tonic
        setTonic(newTonic);
    };

    const chooseScaleType = (selectedScaleType) => {
        const scaleTypeModes = modes[selectedScaleType];
        const modesArray = Object.keys(scaleTypeModes);
        setSelectedScaleType(selectedScaleType);
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

    useEffect(() => {
        const updateCurrentScale = (tonic, selectedMode) => {
            try {
                // @ts-ignore
                const {scale, displayScale, numAccidentals} = generateSelectedScale(
                    tonic,
                    selectedScaleType,
                    selectedMode,
                    scaleRange
                );
                setScale(new Scale(scale, displayScale, numAccidentals));
            } catch (error) {
                console.error('Error updating current scale', error);
            }
        };
        updateCurrentScale(tonic, selectedMode);
    }, [tonic, selectedScaleType, selectedMode, scaleRange]);

    const playScale = async () => {
        trebleInstrument.stop();
        bassInstrument.stop();
        percussionInstrument.stop({});
        metronomeInstrument.stop();
        await playMelodies(
            [scale],
            [trebleInstrument],
            context,
            bpm,
            context.currentTime
        );
    };

    const playAllMelodies = async () => {
        handleStopAllPlayback();
        await playMelodies(
            [treble.melody, bassMelody, percussionMelody],
            [trebleInstrument, bassInstrument, percussionInstrument],
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
                abortControllerRef,
                bpm,
                timeSignature,
                numMeasures,
                context,
                treble.melody,
                bassMelody,
                percussionMelody,
                metronomeMelody,
                scale,
                scale.generateBassScale(),
                percussionScale,
                trebleInstrument,
                bassInstrument,
                percussionInstrument,
                metronomeInstrument,
                treble.settings,
                bassSettings,
                percussionSettings,
                metronomeSettings,
                (x: Melody) => setInstrumentMelody(Instrument.Treble, x),
                (x: Melody) => setInstrumentMelody(Instrument.Bass, x),
                (x: Melody) => setInstrumentMelody(Instrument.Percussion, x)
            ).finally(() => setIsPlayingContinuously(false));
        }
    };

    const handleStopAllPlayback = () => {
        setStopPlayback(true);
        // context.close();
        trebleInstrument.stop();
        bassInstrument.stop();
        percussionInstrument.stop({});
        metronomeInstrument.stop();
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

    // TOGGLE VIEWS
    const [measureAndScaleSettingsVisible, setMeasureAndScaleSettingsVisible] =
        useState(false);
    const [playbackSettingsVisible, setPlaybackSettingsVisible] = useState(false);
    const [instrumentSettingsVisible, setInstrumentSettingsVisible] =
        useState(false);
    const [percussionSettingsVisible, setPercussionSettingsVisible] =
        useState(false);

    const handleToggleMeasureAndScaleSettings = () => {
        setMeasureAndScaleSettingsVisible(!measureAndScaleSettingsVisible);
        setPlaybackSettingsVisible(false);
        setInstrumentSettingsVisible(false);
        setPercussionSettingsVisible(false);
    };

    const handleTogglePlaybackSettings = () => {
        setMeasureAndScaleSettingsVisible(false);
        setPlaybackSettingsVisible(!playbackSettingsVisible);
        setInstrumentSettingsVisible(false);
        setPercussionSettingsVisible(false);
    };

    const handleToggleInstrumentSettings = () => {
        setMeasureAndScaleSettingsVisible(false);
        setPlaybackSettingsVisible(false);
        setInstrumentSettingsVisible(!instrumentSettingsVisible);
        setPercussionSettingsVisible(false);
    };

    const handleTogglePercussionSettings = () => {
        setMeasureAndScaleSettingsVisible(false);
        setPlaybackSettingsVisible(false);
        setInstrumentSettingsVisible(false);
        setPercussionSettingsVisible(!percussionSettingsVisible);
    };

    const renderPlaybackSettingsScene = SceneMap({
        measure: () => (
            <MeasureAndTempoSettings
                bpm={bpm}
                updateBpm={updateBpm}
                timeSignature={timeSignature}
                setTimeSignature={setTimeSignature}
                numMeasures={numMeasures}
                setNumMeasures={setNumMeasures}
            />
        ),
        scale: () => (
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
        ),
        playback: ContinuousPlaybackSettings,
    });

    // Definitions for VIEWS
    const tabSymbols = {
        treble: '&', // treble clef
        bass: '?', // bass clef
        percussion: '/', // neutral clef
        measure: 'c', // treble clef
        scale: '#  b', // bass clef
        playback: '}', // neutral clef
    };

    // PICKER MODALS

    const CustomTabBar = (props) => {
        return (
            <TabBar
                style={styles.tabBar}
                {...props}
                renderLabel={({route, focused, color}) => (
                    <View
                        style={[
                            styles.tabBar,
                            {flexDirection: 'row', alignItems: 'center'},
                        ]}>
                        <Text style={{fontFamily: 'Maestro', fontSize: 18, color}}>
                            {tabSymbols[route.key]} {/* Display the correct symbol */}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'System',
                                fontSize: 14,
                                color,
                                marginLeft: 5,
                            }}>
                            {route.title} {/* Use the standard font for the title */}
                        </Text>
                    </View>
                )}
            />
        );
    };

    // OUTPUT
    return (
        <View style={styles.container}>
            <View style={styles.visualizer}>
                <Text style={styles.text}>Melody Visualizer</Text>
                <SheetMusic
                    timeSignature={timeSignature}
                    trebleMelody={treble.melody}
                    bassMelody={bassMelody}
                    percussionMelody={percussionMelody}
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
                        onPress={generateMelody}>
                        <Text style={styles.pickerButtonText}> Randomize Melody </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={generateBassLine}>
                        <Text style={styles.pickerButtonText}> Randomize Bass Line </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={generatePercussion}>
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
                    trebleInstrument={trebleInstrument}
                />
                <View style={styles.paddingRow}/>
            </View>
            <TempoMetronome/>
            <View style={styles.paddingRow}/>
            <View style={styles.paddingRow}/>
            <View
                style={[
                    styles.tabToggleContainer,
                    measureAndScaleSettingsVisible ||
                    playbackSettingsVisible ||
                    instrumentSettingsVisible ||
                    percussionSettingsVisible
                        ? {bottom: '50%'}
                        : {bottom: 0},
                ]}>
                <TouchableOpacity
                    style={[
                        styles.tabToggle,
                        measureAndScaleSettingsVisible
                            ? {backgroundColor: colors.measureAndScaleActive}
                            : {backgroundColor: colors.measureAndScalePassive},
                    ]}
                    onPress={handleToggleMeasureAndScaleSettings}>
                    <FontAwesomeIcon icon={faPlay} size={"1x"} color="#E5E5E5"/>
                    <Text style={styles.tabTitle}> Measure & Scale</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabToggle,
                        playbackSettingsVisible
                            ? {backgroundColor: colors.playbackActive}
                            : {backgroundColor: colors.playbackPassive},
                    ]}
                    onPress={handleTogglePlaybackSettings}>
                    <FontAwesomeIcon icon={faPlay} size={"1x"} color="#E5E5E5"/>
                    <Text style={styles.tabTitle}> Playback</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabToggle,
                        instrumentSettingsVisible
                            ? {backgroundColor: colors.instrumentsActive}
                            : {backgroundColor: colors.instrumentsPassive},
                    ]}
                    onPress={handleToggleInstrumentSettings}>
                    <FontAwesomeIcon icon={faGuitar} size={"1x"} color="#E5E5E5"/>
                    <Text style={styles.tabTitle}> Instruments</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabToggle,
                        percussionSettingsVisible
                            ? {backgroundColor: colors.percussionActive}
                            : {backgroundColor: colors.percussionPassive},
                    ]}
                    onPress={handleTogglePercussionSettings}>
                    <FontAwesomeIcon icon={faPlay} size={"1x"} color="#E5E5E5"/>
                    <Text style={styles.tabTitle}> Percussion</Text>
                </TouchableOpacity>
            </View>
            {playbackSettingsVisible && (
                <View style={[styles.settingsTab, styles.playbackSettingsTab]}>
                    <ContinuousPlaybackSettings/>
                </View>
            )}
            {measureAndScaleSettingsVisible && (
                <View style={styles.settingsTab}>
                    <MeasureAndTempoSettings
                        bpm={bpm}
                        updateBpm={updateBpm}
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
            {instrumentSettingsVisible && (
                <View style={styles.settingsTab}>
                    <TrebleSettings
                        trebleInstrumentSettings={treble.settings}
                        setTrebleInstrumentSettings={(newSettings : InstrumentSettings) => setInstrumentSettings(Instrument.Treble, newSettings)}
                    />
                </View>
            )}
            {percussionSettingsVisible && (
                <View style={styles.settingsTab}>
                    <PercussionSettings/>
                </View>
            )}
        </View>
    );
};
const PercussionSettings = () => (
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

export default App;
