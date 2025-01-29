import  {InstrumentSettings} from "./InstrumentSettings";
import {Melody} from "./Melody";
import {Scale} from "./Scale";

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
    scale : Scale
}

type Instruments = {
    [key in InstrumentType]: InstrumentState
}
export {Instruments, InstrumentType, Instrument, InstrumentState};
