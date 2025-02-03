import {CacheStorage, Reverb} from "smplr";
import {InstrumentSettings} from "./InstrumentSettings";
import {Instruments, InstrumentType} from "./Instrument";
import {Scale} from "./Scale";
import {Melody} from "./Melody";

enum SettingModal {
    Invisible,
    MeasureAndScaleSettings,
    PlaybackSettings,
    InstrumentSettings,
    PercussionSettings
}

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
    screenWidth: number;

    instruments: Instruments;
    scale: Scale;

    // Modal Visibility
    isTonicModalVisible: boolean;
    isScaleTypeModalVisible: boolean;
    isModeModalVisible: boolean;
    isIntervalModalVisible: boolean;
    settingsModal : SettingModal;
}

interface StoreActions {
    setTonic: (newTonic: string) => void;
    setSelectedScaleType: (newScaleType: string) => void;
    setSelectedMode: (newMode: string) => void;
    setScaleRange: (newRange: number) => void;
    setSelectedInterval: (newInterval: string) => void;
    setBpm: (newBpm: number) => void;
    setTimeSignature: (newTimeSignature: [number, number]) => void;
    setNumMeasures: (newNumMeasures: number) => void;
    setIsPlayingContinuously: (newStatus: boolean) => void;
    setScreenWidth: (newWidth: number) => void;
    setInstrumentSettings: (instrument: InstrumentType, newSettings: InstrumentSettings) => void;
    setInstrumentMelody: (instrument: InstrumentType, newMelody: Melody) => void;
    randomizeMelody: (instrument: InstrumentType) => void;
    setTonicModalVisible: (isVisible: boolean) => void;
    setScaleTypeModalVisible: (isVisible: boolean) => void;
    setModeModalVisible: (isVisible: boolean) => void;
    setIntervalModalVisible: (isVisible: boolean) => void;
    handleSettingsModalClick: (modalClicked: SettingModal) => void;
}

export {StoreState, StoreActions, SettingModal};