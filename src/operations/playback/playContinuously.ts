// components/playContinuously.js

import playMelodies from './playMelodies';
import {generateMelody, Scale} from '../../model/MelodyGenerator';
import {Instrument, Instruments, InstrumentType} from "../../model/Instrument";
import type Melody from "../../model/Melody";

const playContinuously = async (
    instruments: Instruments,
    setInstrumentMelody: (instrument: InstrumentType, newMelody: Melody) => void,
    abortControllerRef: any,
    bpm: number,
    timeSignature: [number, number],
    numMeasures: number,
    context: AudioContext,
    scale: Scale,
    bassScale: Scale,
    percussionScale: Scale,
) => {

    const timeFactor = 5 / bpm;
    const measureLength = (48 * timeSignature[0]) / timeSignature[1];
    const melodyDuration = measureLength * numMeasures * timeFactor;

    let startTime = context.currentTime;
    let iteration = 0;

    let oldTrebleMelody = instruments.treble.melody;
    let oldBassMelody = instruments.bass.melody;
    let oldPercussionMelody = instruments.percussion.melody;
    let newTrebleMelody = oldTrebleMelody;
    let newBassMelody = oldBassMelody;
    let newPercussionMelody = oldPercussionMelody;

    while (!abortControllerRef.current.signal.aborted) {
        console.log(`looping iteration ${iteration}`, abortControllerRef.current);
        if (iteration % 4 === 0) {
            newTrebleMelody = generateMelody({
                scale,
                numMeasures,
                timeSignature,
                instrumentSettings: instruments.treble.settings
            })
            newBassMelody = generateMelody({
                scale: bassScale,
                numMeasures,
                timeSignature,
                instrumentSettings: instruments.bass.settings
            })
            newPercussionMelody = generateMelody({
                scale: percussionScale,
                numMeasures,
                timeSignature,
                instrumentSettings: instruments.percussion.settings
            });
        }

        if (iteration % 2 === 0) {
            await playMelodies(
                [newTrebleMelody, newBassMelody, newPercussionMelody],
                [instruments.treble.settings.sound, instruments.bass.settings.sound, instruments.percussion.settings.sound],
                context,
                bpm,
                startTime
            );
        } else {
            await playMelodies(
                [instruments.metronome.melody],
                [instruments.metronome.settings.sound],
                context,
                bpm,
                startTime
            );
        }

        const updateTime = startTime - timeFactor / 12;
        // console.log(`Waiting until ${updateTime} to update melodies`);

        while (
            context.currentTime < updateTime &&
            !abortControllerRef.current.signal.aborted
            ) {
            await new Promise((resolve) => setTimeout(resolve, 10)); // Check every 10ms
        }

        if (abortControllerRef.current.signal.aborted) {
            break;
        }

        setInstrumentMelody(Instrument.Treble, newTrebleMelody);
        setInstrumentMelody(Instrument.Bass, newBassMelody);
        setInstrumentMelody(Instrument.Percussion, newPercussionMelody);
        oldBassMelody = newBassMelody;
        oldTrebleMelody = newTrebleMelody;
        oldPercussionMelody = newPercussionMelody;

        // Wait until the exact timestamp
        const nextStartTime = startTime + melodyDuration * 0.5;
        // console.log(`Waiting until ${nextStartTime} to start the next iteration`);

        while (
            context.currentTime < nextStartTime &&
            !abortControllerRef.current.signal.aborted
            ) {
            await new Promise((resolve) => setTimeout(resolve, 10)); // Check every 10ms
        }

        if (abortControllerRef.current.signal.aborted) {
            break;
        }

        startTime += melodyDuration;
        iteration++;
    }
    // stop all playback if broken.
    instruments.treble.settings.sound.stop({});
    instruments.bass.settings.sound.stop({});
    instruments.percussion.settings.sound.stop({});
    instruments.metronome.settings.sound.stop({});
};

export default playContinuously;
