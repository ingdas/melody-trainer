import { create } from "zustand/index";
import Scale from "./Scale";
import InstrumentSettings from "./InstrumentSettings";
import Melody from "./Melody";
import { Dimensions } from "react-native";
import { CacheStorage, Reverb } from "smplr";

export const Instrument = {
    Treble: "treble",
    Bass: "bass",
    Percussion: "percussion",
    Metronome: "metronome",
};

const context = new AudioContext();

export const useStore = create((set) => ({
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
            settings: InstrumentSettings.defaultTrebleInstrumentSettings(),
            melody: Melody.defaultTrebleMelody(),
        },
        [Instrument.Bass]: {
            settings: InstrumentSettings.defaultBassInstrumentSettings(),
            melody: Melody.defaultBassMelody(),
        },
        [Instrument.Percussion]: {
            settings: InstrumentSettings.defaultPercussionInstrumentSettings(),
            melody: Melody.defaultPercussionMelody(),
        },
        [Instrument.Metronome]: {
            settings: InstrumentSettings.defaultMetronomeInstrumentSettings(),
            melody: Melody.defaultMetronomeMelody(),
        },
    },

    // Scale and Mode
    scale: Scale.defaultScale(),

    // Setters
    setTonic: (newTonic) => set({ tonic: newTonic }),
    setSelectedScaleType: (newScaleType) => set({ selectedScaleType: newScaleType }),
    setSelectedMode: (newMode) => set({ selectedMode: newMode }),
    setScaleRange: (newRange) => set({ scaleRange: newRange }),
    setSelectedInterval: (newInterval) => set({ selectedInterval: newInterval }),
    setScale: (newScale) => set({ scale: newScale }),
    setBpm: (newBpm) => set({ bpm: newBpm }),
    setTimeSignature: (newTimeSignature) => set({ timeSignature: newTimeSignature }),
    setNumMeasures: (newNumMeasures) => set({ numMeasures: newNumMeasures }),
    setIsPlayingContinuously: (newStatus) => set({ isPlayingContinuously: newStatus }),
    setStopPlayback: (newStatus) => set({ stopPlayback: newStatus }),
    setScreenWidth: (newWidth) => set({ screenWidth: newWidth }),

    // Instrument Setters
    setInstrumentSettings: (instrument, newSettings) =>
        set((state) => ({
            instruments: {
                ...state.instruments,
                [instrument]: {
                    ...state.instruments[instrument],
                    settings: newSettings,
                },
            },
        })),

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
    setTonicModalVisible: (isVisible) => set({ isTonicModalVisible: isVisible }),
    setScaleTypeModalVisible: (isVisible) => set({ isScaleTypeModalVisible: isVisible }),
    setModeModalVisible: (isVisible) => set({ isModeModalVisible: isVisible }),
    setIntervalModalVisible: (isVisible) => set({ isIntervalModalVisible: isVisible }),
}));