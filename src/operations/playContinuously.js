// components/playContinuously.js

import playMelodies from './playMelodies';
import MelodyGenerator from '../model/MelodyGenerator';

const playContinuously = async (
    abortControllerRef,
    bpm,
    timeSignature,
    numMeasures,
    context,
    trebleMelody,
    bassMelody,
    percussionMelody,
    metronomeMelody,
    scale,
    bassScale,
    percussionScale,
    trebleInstrument,
    bassInstrument,
    percussionInstrument,
    metronomeInstrument,
    trebleInstrumentSettings,
    bassInstrumentSettings,
    percussionInstrumentSettings,
    metronomeInstrumentSettings,
    setTrebleMelody,
    setBassMelody,
    setPercussionMelody
) => {

    const timeFactor = 5 / bpm;
    const measureLength = (48 * timeSignature[0]) / timeSignature[1];
    const melodyDuration = measureLength * numMeasures * timeFactor;

    let startTime = context.currentTime;
    let iteration = 0;

    let oldTrebleMelody = trebleMelody;
    let oldBassMelody = bassMelody;
    let oldPercussionMelody = percussionMelody;
    let newTrebleMelody = oldTrebleMelody;
    let newBassMelody = oldBassMelody;
    let newPercussionMelody = oldPercussionMelody;

    while (!abortControllerRef.current.signal.aborted) {
        console.log(`looping iteration ${iteration}`, abortControllerRef.current);
        if (iteration % 4 === 0) {
            newTrebleMelody = new MelodyGenerator(
                scale,
                numMeasures,
                timeSignature,
                trebleInstrumentSettings
            ).generateMelody();
            newBassMelody = new MelodyGenerator(
                bassScale,
                numMeasures,
                timeSignature,
                bassInstrumentSettings
            ).generateMelody();
            newPercussionMelody = new MelodyGenerator(
                percussionScale,
                numMeasures,
                timeSignature,
                percussionInstrumentSettings
            ).generateMelody();
        }

        if (iteration % 2 === 0) {
            await playMelodies(
                [newTrebleMelody, newBassMelody, newPercussionMelody],
                [trebleInstrument, bassInstrument, percussionInstrument],
                context,
                bpm,
                startTime
            );
        } else {
            await playMelodies(
                [metronomeMelody],
                [metronomeInstrument],
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

        setTrebleMelody(newTrebleMelody);
        setBassMelody(newBassMelody);
        setPercussionMelody(newPercussionMelody);
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
    trebleInstrument.stop();
    bassInstrument.stop();
    percussionInstrument.stop();
    metronomeInstrument.stop();
};

export default playContinuously;
