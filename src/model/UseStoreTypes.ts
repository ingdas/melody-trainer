import {CacheStorage, Reverb} from "smplr";
import Melody from "./Melody";
import {InstrumentSettings} from "./InstrumentSettings";
import {Instruments, InstrumentType} from "./Instrument";
import {Scale} from "./Scale";

interface StoreState {
    context: AudioContext;
    reverb: Reverb;
    storage: CacheStorage;

    // Global Settings
    tonic: string;
    selectedScaleType: string;
    selectedMode: string;
    scaleRange: number;
    selectedInterval: string;
    bpm: number;
    timeSignature: [number, number];
    numMeasures: number;
    isPlayingContinuously: boolean;
    stopPlayback: boolean;
    screenWidth: number;

    instruments: Instruments;
    scale: Scale;

    // Modal Visibility
    isTonicModalVisible: boolean;
    isScaleTypeModalVisible: boolean;
    isModeModalVisible: boolean;
    isIntervalModalVisible: boolean;
}

interface StoreActions {
    setTonic: (newTonic: string) => void;
    setSelectedScaleType: (newScaleType: string) => void;
    setSelectedMode: (newMode: string) => void;
    setScaleRange: (newRange: number) => void;
    setSelectedInterval: (newInterval: string) => void;
    setScale: (newScale: Scale) => void;
    setBpm: (newBpm: number) => void;
    setTimeSignature: (newTimeSignature: [number, number]) => void;
    setNumMeasures: (newNumMeasures: number) => void;
    setIsPlayingContinuously: (newStatus: boolean) => void;
    setStopPlayback: (newStatus: boolean) => void;
    setScreenWidth: (newWidth: number) => void;
    setInstrumentSettings: (instrument: InstrumentType, newSettings: InstrumentSettings) => void;
    setInstrumentMelody: (instrument: InstrumentType, newMelody: Melody) => void;
    setTonicModalVisible: (isVisible: boolean) => void;
    setScaleTypeModalVisible: (isVisible: boolean) => void;
    setModeModalVisible: (isVisible: boolean) => void;
    setIntervalModalVisible: (isVisible: boolean) => void;
}

export {StoreState, StoreActions};