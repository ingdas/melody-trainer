import {create} from "zustand";
import {createScale, defaultPercussionScale, defaultScale, generateBassScale, Scale} from "./Scale";
import {
    defaultBassInstrumentSettings,
    defaultMetronomeInstrumentSettings,
    defaultPercussionInstrumentSettings,
    defaultTrebleInstrumentSettings,
    updateSound
} from "./InstrumentSettings";
import {defaultBassMelody, defaultMetronomeMelody, defaultPercussionMelody, defaultTrebleMelody} from "./Melody";
import {Dimensions} from "react-native";
import {CacheStorage, Reverb} from "smplr";
import {StoreActions, StoreState} from './UseStoreTypes';
import {Instrument} from "./Instrument";
import {generateMelody} from "./MelodyGenerator";
import {generateSelectedScale} from "../operations/scale/scaleHandler";

const context = new AudioContext();
const reverb = new Reverb(context);
const storage = new CacheStorage();

const updateInstrumentMelody = (state: StoreState, instrument: Instrument, newMelody: any) => ({
    instruments: {
        ...state.instruments,
        [instrument]: {
            ...state.instruments[instrument],
            melody: newMelody,
        },
    },
});

const updateScaleAndInstruments = (state: StoreState, scale : Scale) => {
    return {
        ...state,
        scale: scale,
        instruments: {
            ...state.instruments,
            [Instrument.Treble]: {
                ...state.instruments[Instrument.Treble],
                scale: scale,
            },
            [Instrument.Bass]: {
                ...state.instruments[Instrument.Bass],
                scale: generateBassScale(scale),
            },
        }
    };
};


export const useStore = create<StoreState & StoreActions>((set, get) => ({
    context: context,
    reverb: new Reverb(context),
    storage: new CacheStorage(),

    // Global Settings
    tonic: 'C4',
    selectedScaleType: 'Diatonic',
    selectedMode: 'I. Ionian (Major)',
    scaleRange: 12,
    selectedInterval: 'Octave',
    bpm: 120,
    timeSignature: [4, 4],
    numMeasures: 2,
    isPlayingContinuously: false,
    stopPlayback: false,
    screenWidth: Dimensions.get('window').width,

    // Instrument Hierarchy
    instruments: {
        [Instrument.Treble]: {
            settings: defaultTrebleInstrumentSettings(context, storage, reverb),
            melody: defaultTrebleMelody(),
            scale: defaultScale()
        },
        [Instrument.Bass]: {
            settings: defaultBassInstrumentSettings(context, storage, reverb),
            melody: defaultBassMelody(),
            scale: generateBassScale(defaultScale())
        },
        [Instrument.Percussion]: {
            settings: defaultPercussionInstrumentSettings(context, storage, reverb),
            melody: defaultPercussionMelody(),
            scale: defaultPercussionScale()
        },
        [Instrument.Metronome]: {
            settings: defaultMetronomeInstrumentSettings(context, storage, reverb),
            melody: defaultMetronomeMelody(),
            scale: defaultPercussionScale()
        },
    },

    scale: defaultScale(),

    // Setters
    setTonic: (newTonic) => set((state) => {
        try {
            const scale = generateSelectedScale(
                newTonic,
                state.selectedScaleType,
                state.selectedMode,
                state.scaleRange
            );
            return updateScaleAndInstruments({...state, tonic: newTonic}, scale);
        } catch (error) {
            console.error('Error updating current scale', error);
            return state; // Return the current state if there's an error
        }
    }),
    setSelectedScaleType: (newScaleType) => set((state) => {
        try {
            const scale = generateSelectedScale(
                state.tonic,
                newScaleType,
                state.selectedMode,
                state.scaleRange
            );
            return updateScaleAndInstruments({...state, selectedScaleType: newScaleType}, scale);
        } catch (error) {
            console.error('Error updating current scale', error);
            return state;
        }
    }),
    setSelectedMode: (newMode) => set((state) => {
        try {
            const scale = generateSelectedScale(
                state.tonic,
                state.selectedScaleType,
                newMode,
                state.scaleRange
            );
            return updateScaleAndInstruments({...state, selectedMode : newMode}, scale);
        } catch (error) {
            console.error('Error updating current scale', error);
            return state;
        }
    }),
    setScaleRange: (newRange) => set((state) => {
        try {
            const scale = generateSelectedScale(
                state.tonic,
                state.selectedScaleType,
                state.selectedMode,
                newRange
            );
            return updateScaleAndInstruments({...state, scaleRange : newRange}, scale);
        } catch (error) {
            console.error('Error updating current scale', error);
            return state;
        }
    }),
    setSelectedInterval: (newInterval) => set({selectedInterval: newInterval}),
    setBpm: (newBpm) => set({bpm: newBpm}),
    setTimeSignature: (newTimeSignature) => set({timeSignature: newTimeSignature}),
    setNumMeasures: (newNumMeasures) => set({numMeasures: newNumMeasures}),
    setIsPlayingContinuously: (newStatus) => set({isPlayingContinuously: newStatus}),
    setStopPlayback: (newStatus) => set({stopPlayback: newStatus}),
    setScreenWidth: (newWidth) => set({screenWidth: newWidth}),

    // Instrument Setters
    setInstrumentSettings: (instrument, newSettings) =>
        set((state) => {
            updateSound(newSettings);
            return {
                instruments: {
                    ...state.instruments,
                    [instrument]: {
                        ...state.instruments[instrument],
                        settings: newSettings,
                    },
                },
            }
        }),

    setInstrumentMelody: (instrument, newMelody) =>
        set((state) => updateInstrumentMelody(state, instrument, newMelody)),

    randomizeMelody: (instrument) =>
        set((state) => {
            const newMelody = generateMelody({
                numMeasures: state.numMeasures,
                timeSignature: state.timeSignature,
                instrumentState: state.instruments[instrument]
            });
            return updateInstrumentMelody(state, instrument, newMelody);
        }),

    // Modal Visibility
    isTonicModalVisible: false,
    isScaleTypeModalVisible: false,
    isModeModalVisible: false,
    isIntervalModalVisible: false,
    setTonicModalVisible: (isVisible) => set({isTonicModalVisible: isVisible}),
    setScaleTypeModalVisible: (isVisible) => set({isScaleTypeModalVisible: isVisible}),
    setModeModalVisible: (isVisible) => set({isModeModalVisible: isVisible}),
    setIntervalModalVisible: (isVisible) => set({isIntervalModalVisible: isVisible}),

    isMeasureAndScaleSettingsVisible: false,
    isPlaybackSettingsVisible: false,
    isInstrumentSettingsVisible: false,
    isPercussionSettingsVisible: false,
    setMeasureAndScaleSettingsVisible: (isVisible) => set({isMeasureAndScaleSettingsVisible: isVisible}),
    setPlaybackSettingsVisible: (isVisible) => set({isPlaybackSettingsVisible: isVisible}),
    setInstrumentSettingsVisible: (isVisible) => set({isInstrumentSettingsVisible: isVisible}),
    setPercussionSettingsVisible: (isVisible) => set({isPercussionSettingsVisible: isVisible}),
}));