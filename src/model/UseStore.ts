import {create} from "zustand";
import {defaultPercussionScale, defaultScale, generateBassScale} from "./Scale";
import {
    defaultBassInstrumentSettings,
    defaultMetronomeInstrumentSettings,
    defaultPercussionInstrumentSettings,
    defaultTrebleInstrumentSettings,
    updateSound
} from "./InstrumentSettings";
import {
    defaultBassMelody,
    defaultMetronomeMelody,
    defaultPercussionMelody,
    defaultTrebleMelody
} from "./Melody";
import {Dimensions} from "react-native";
import {CacheStorage, Reverb} from "smplr";
import {StoreActions, StoreState} from './UseStoreTypes';
import {Instrument} from "./Instrument";

const context = new AudioContext();
const reverb = new Reverb(context);
const storage = new CacheStorage();

export const useStore = create<StoreState & StoreActions>((set) => ({
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
    setTonic: (newTonic) => set({tonic: newTonic}),
    setSelectedScaleType: (newScaleType) => set({selectedScaleType: newScaleType}),
    setSelectedMode: (newMode) => set({selectedMode: newMode}),
    setScaleRange: (newRange) => set({scaleRange: newRange}),
    setSelectedInterval: (newInterval) => set({selectedInterval: newInterval}),
    setScale: (newScale) =>
        set((state) => ({
            ...state,
            scale: newScale,
            instruments: {
                ...state.instruments,  // Preserve all instruments
                [Instrument.Treble]: {
                    ...state.instruments[Instrument.Treble],
                    scale: newScale,
                },
                [Instrument.Bass]: {
                    ...state.instruments[Instrument.Bass],
                    scale: generateBassScale(newScale),
                },
            }
        })),
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
        set((state) => ({
            instruments: {
                ...state.instruments,
                [instrument]: {
                    ...state.instruments[instrument],
                    melody: newMelody,
                },
            },
        })),

    // Modal Visibility
    isTonicModalVisible: false,
    isScaleTypeModalVisible: false,
    isModeModalVisible: false,
    isIntervalModalVisible: false,
    setTonicModalVisible: (isVisible) => set({isTonicModalVisible: isVisible}),
    setScaleTypeModalVisible: (isVisible) => set({isScaleTypeModalVisible: isVisible}),
    setModeModalVisible: (isVisible) => set({isModeModalVisible: isVisible}),
    setIntervalModalVisible: (isVisible) => set({isIntervalModalVisible: isVisible}),
}));