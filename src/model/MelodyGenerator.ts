import {Scale} from './Scale';
import convertRankedArrayToMelody from "../operations/melodyGeneration/convertRankedArrayToMelody";
import {fromFlattenedNotes, Melody} from "./Melody";
import {InstrumentState} from "./Instrument";

interface InstrumentSettings {
    notesPerMeasure: number;
    smallestNoteDenom: number;
    rhythmVariability: number;
    enableTriplets: boolean;
    randomizationRules: any; // Define specific type based on actual usage
    type: string;
}

interface MelodyGeneratorConfig {
    numMeasures: number;
    timeSignature: [number, number];
    instrumentState: InstrumentState;
}

function getDivisors(timeSignature: [number, number], denom: number): number[] {
    const divisors: number[] = [];
    const n = timeSignature[0];
    for (let i = 2; i <= n; i++) {
        if (n % i === 0) {
            divisors.unshift((i * denom) / timeSignature[1]);
        }
    }
    return divisors;
}

function getNearDivisors(timeSignature: [number, number], denom: number): number[] {
    const nearDivisors: number[] = [];
    const n = timeSignature[0];
    for (let i = 2; i <= n; i++) {
        if (n % i === 1 || n % i === n - 1) {
            nearDivisors.unshift((i * denom) / timeSignature[1]);
        }
    }
    return nearDivisors;
}

function insertTriplets(notes: number[]): { array: (number | null)[]; tripletsInserted: boolean } {
    if (notes.length < 2) return {array: notes, tripletsInserted: false};

    const tripletsArray = notes.flatMap(note => [note, null, null]);
    const numMeasures = Math.ceil(notes.length / 8); // Assuming 8 notes per measure
    const numTriplets = 1 + Math.floor((Math.random() * numMeasures * 50) / 100); // Using default rhythmVariability of 50

    for (let i = 0; i < numTriplets; i++) {
        const randomIndex = Math.floor(Math.random() * (notes.length - 1)) * 3;
        let tripletHasPriority = true;

        for (let j = 1; j === 3; j++) {
            if (tripletsArray[randomIndex] > tripletsArray[randomIndex + j]) {
                tripletHasPriority = false;
            }
        }

        if (tripletHasPriority) {
            tripletsArray[randomIndex] = tripletsArray[randomIndex];
            tripletsArray[randomIndex + 2] = tripletsArray[randomIndex];
            tripletsArray[randomIndex + 3] = null;
            tripletsArray[randomIndex + 4] = tripletsArray[randomIndex];
        }
    }

    return {array: tripletsArray, tripletsInserted: true};
}

function rankArray(notesArray: (number | null)[]): (number | null)[] {
    const nonNullValues = notesArray
        .map((value, index) => (value !== null ? {value, index} : null))
        .filter((item): item is {
            rank: number | null;
            value: number; index: number
        } => item !== null);

    nonNullValues.sort((a, b) => a.value - b.value);

    let rank = 0;
    let lastValue = nonNullValues[0]?.value;
    nonNullValues.forEach((item, i) => {
        if (i === 0 || item.value !== lastValue) {
            rank = i;
        }
        item.rank = rank;
        lastValue = item.value;
    });

    const rankedArray = new Array(notesArray.length).fill(null);
    nonNullValues.forEach(item => {
        rankedArray[item.index] = item.rank;
    });

    return rankedArray;
}

function insertRestsAtBeats(
    melodyArray: (string | null)[],
    numMeasures: number,
    timeSignature: [number, number]
): (string | null)[] {
    const numMeasureSlots = melodyArray.length / numMeasures;
    const numBeatSlots = (numMeasureSlots / timeSignature[0]) * (timeSignature[1] / 4);

    return melodyArray.map((note, index) => {
        const isBeat = (index % numMeasureSlots) % numBeatSlots === 0;
        return isBeat && note === null ? 'r' : note;
    });
}

function createDisplayMelody(
    melodyArray: (string | null)[],
    scale: string[],
    displayScale: string[]
): (string | null)[] {
    return melodyArray.map(note => {
        if (note === null) return note;
        const index = scale.indexOf(note);
        return index !== -1 ? displayScale[index] : note;
    });
}

function generateMelody(config: MelodyGeneratorConfig): Melody {
    const {
        scale: {scale, displayScale, tonic},
        settings: {
            notesPerMeasure,
            smallestNoteDenom,
            rhythmVariability,
            enableTriplets,
            randomizationRules,
            type
        }
    } = config.instrumentState;
    const numMeasures = config.numMeasures;
    const timeSignature = config.timeSignature;

    // Initialize melody array
    let melodyArray = Array(numMeasures).fill([]);

    // Calculate smallest note value and number of slots
    const smallestNoteDenomValue = timeSignature[1];
    const measureNoteResolution = Math.max(smallestNoteDenomValue, smallestNoteDenom);
    const numberOfSlotsPerMeasure = (measureNoteResolution * timeSignature[0]) / timeSignature[1];

    // Generate measure slots with rankings
    melodyArray = Array(numMeasures).fill(null).map(() => {
        const measureSlots = Array(numberOfSlotsPerMeasure).fill(null);
        const divisors = getDivisors(timeSignature, smallestNoteDenom);
        const nearDivisors = getNearDivisors(timeSignature, smallestNoteDenom);

        // Fill slots based on divisors
        [...divisors, ...nearDivisors].forEach(div => {
            let rank = 1 + measureSlots.filter(slot => slot !== null).length;
            for (let j = 0; j < numberOfSlotsPerMeasure; j++) {
                if (
                    measureSlots[j] === null &&
                    ((j % div) * timeSignature[1]) / measureNoteResolution === 0
                ) {
                    measureSlots[j] = rank;
                    rank += 0.2;
                }
            }
        });

        // Fill remaining slots
        [8, 4, 2, 1].forEach(div => {
            const rank = numberOfSlotsPerMeasure / div;
            for (let j = 0; j < numberOfSlotsPerMeasure; j++) {
                if (
                    measureSlots[j] === null &&
                    ((j % div) * timeSignature[1]) / measureNoteResolution === 0
                ) {
                    measureSlots[j] = rank;
                }
            }
        });

        return measureSlots;
    });

    // Generate melody with rhythm variability
    const flatMelody = melodyArray.flat();
    const randomValues = Array.from({length: flatMelody.length}, () => Math.random());
    const piecewiseSum = flatMelody.map((value, index) =>
        (rhythmVariability / 100) * numberOfSlotsPerMeasure * numMeasures * randomValues[index] * 1.1 +
        ((100 - rhythmVariability) / 100) * (value ?? 0)
    );

    // Handle triplets
    let processedMelody = piecewiseSum;
    if (enableTriplets) {
        const {array} = insertTriplets(piecewiseSum);
        processedMelody = array;
    }

    // Generate final melody
    const rankedArray = rankArray(processedMelody);
    const generatedMelody = convertRankedArrayToMelody(
        rankedArray,
        tonic,
        scale,
        notesPerMeasure,
        numMeasures,
        randomizationRules
    );

    // Handle rests and display melody
    const melodyWithRests = type === 'percussion'
        ? insertRestsAtBeats(generatedMelody, numMeasures, timeSignature)
        : generatedMelody;

    const displayMelodyNotes = createDisplayMelody(melodyWithRests, scale, displayScale);

    return fromFlattenedNotes(
        melodyWithRests,
        timeSignature,
        numMeasures,
        displayMelodyNotes
    );
}

export {
    type Scale,
    type InstrumentSettings,
    type MelodyGeneratorConfig,
    generateMelody,
    getDivisors,
    getNearDivisors
};