import {InstrumentSettings} from "./InstrumentSettings";
import Melody from "./Melody";

enum Instrument {
    Treble = "treble",
    Bass = "bass",
    Percussion = "percussion",
    Metronome = "metronome",
}

type InstrumentType = typeof Instrument[keyof typeof Instrument];

interface InstrumentState {
    settings: InstrumentSettings;
    melody: Melody;
}

type Instruments = {
    [key in InstrumentType]: InstrumentState
}
export {Instruments};
export {InstrumentType};
export {Instrument};