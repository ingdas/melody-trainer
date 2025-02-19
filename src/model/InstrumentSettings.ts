import { DrumMachine, Soundfont } from "smplr";

import {Instrument} from "./Instrument";

enum RandomizationRule {
    Uniform = "uniform",
    TonicOnOne = "tonicOnOnes",
    Percussion = "percussion",
    Metronome = "metronome",
    Keep = "Keep",
    Mute = "Mute",
}

type InstrumentSettings = {
    instrument: string;
    type: Instrument;
    notesPerMeasure: number;
    smallestNoteDenom: number;
    rhythmVariability: number;
    enableTriplets: boolean;
    randomizationRule: RandomizationRule;
    context: AudioContext;
    storage: any;
    reverb: any;
    sound?: Soundfont | DrumMachine;
};

const createInstrumentSettings = (
    instrument: string,
    type: Instrument,
    notesPerMeasure: number,
    smallestNoteDenom: number,
    rhythmVariability: number,
    enableTriplets: boolean,
    randomizationRule: RandomizationRule,
    context: AudioContext,
    storage: any,
    reverb: any
): InstrumentSettings => {
    const settings: InstrumentSettings = {
        instrument,
        type,
        notesPerMeasure,
        smallestNoteDenom,
        rhythmVariability,
        enableTriplets,
        randomizationRule: randomizationRule,
        context,
        storage,
        reverb,
    };
    updateSound(settings);
    return settings;
};

const updateSound = (settings) => {
    switch (settings.type) {
        case Instrument.Treble:
            settings.sound = new Soundfont(settings.context, {
                instrument: settings.instrument,
                storage: settings.storage,
            });
            if (settings.sound && settings.reverb) {
                settings.sound.output.addEffect("reverb", settings.reverb, 0.1);
            }
            break;
        case Instrument.Bass:
        case Instrument.Metronome:
            settings.sound = new Soundfont(settings.context, {
                instrument: settings.instrument,
                storage: settings.storage,
            });
            break;
        case Instrument.Percussion:
            settings.sound = new DrumMachine(settings.context, {
                instrument: settings.instrument,
                storage: settings.storage,
            });
            break;
    }
};

const defaultTrebleInstrumentSettings = (
    context: AudioContext,
    storage: any,
    reverb?: any
): InstrumentSettings =>
    createInstrumentSettings(
        "acoustic_grand_piano",
        Instrument.Treble,
        3,
        4,
        30,
        false,
        RandomizationRule.Uniform,
        context,
        storage,
        reverb
    );

const defaultBassInstrumentSettings = (
    context: AudioContext,
    storage: any,
    reverb?: any
): InstrumentSettings =>
    createInstrumentSettings(
        "acoustic_grand_piano",
        Instrument.Bass,
        2,
        2,
        0,
        false,
        RandomizationRule.TonicOnOne,
        context,
        storage,
        reverb
    );

const defaultPercussionInstrumentSettings = (
    context: AudioContext,
    storage: any,
    reverb?: any
): InstrumentSettings =>
    createInstrumentSettings(
        "TR-808",
        Instrument.Percussion,
        4,
        8,
        30,
        false,
        RandomizationRule.Percussion,
        context,
        storage,
        reverb
    );

const defaultMetronomeInstrumentSettings = (
    context: AudioContext,
    storage: any,
    reverb?: any
): InstrumentSettings =>
    createInstrumentSettings(
        "woodblock",
        Instrument.Metronome,
        4,
        4,
        0,
        false,
        RandomizationRule.Metronome,
        context,
        storage,
        reverb
    );

export {
    createInstrumentSettings,
    defaultTrebleInstrumentSettings,
    defaultBassInstrumentSettings,
    defaultPercussionInstrumentSettings,
    defaultMetronomeInstrumentSettings,
    updateSound,
    InstrumentSettings,
    RandomizationRule
};