// components/scaleHandler.js
import generateDisplayScale from './generateDisplayScale';
import {standardizeTonic} from './convertToDisplayNotes';
import generateAllNotesArray from './allNotesArray';

const notes = generateAllNotesArray();

const tonicOptions = [
    'C4',
    'C♯4',
    'D♭4',
    'D4',
    'E♭4',
    'E4',
    'F4',
    'F♯4',
    'G♭4',
    'G4',
    'A♭4',
    'A4',
    'B♭4',
    'B4',
    'C♭4',
    'C5',
];

const modes = {
    Diatonic: {
        'I. Ionian (Major)': [2, 2, 1, 2, 2, 2, 1],
        'II. Dorian': [2, 1, 2, 2, 2, 1, 2],
        'III. Phrygian': [1, 2, 2, 2, 1, 2, 2],
        'IV. Lydian': [2, 2, 2, 1, 2, 2, 1],
        'V. Mixolydian (Melodic Minor ↓)': [2, 2, 1, 2, 2, 1, 2],
        'VI. Aeolian (Natural Minor)': [2, 1, 2, 2, 1, 2, 2],
        'VII. Locrian': [1, 2, 2, 1, 2, 2, 2],
    },
    Melodic: {
        'I. Melodic Minor (↑)': [2, 1, 2, 2, 2, 2, 1],
        'II. Dorian ♭2': [1, 2, 2, 2, 2, 1, 2],
        'III. Lydian Augmented': [2, 2, 2, 2, 1, 2, 1],
        'IV. Lydian Dominant (Acoustic)': [2, 2, 2, 1, 2, 1, 2],
        'V. Aeolian Dominant': [2, 2, 1, 2, 1, 2, 2],
        'VI. Half Diminished': [2, 1, 2, 1, 2, 2, 2],
        'VII. Super Locrian "Altered" (Diminished Whole Tone)': [
            1, 2, 1, 2, 2, 2, 2,
        ],
    },
    'Harmonic Major': {
        'I. Harmonic Major': [2, 2, 1, 2, 1, 3, 1],
        'II. Dorian ♭5': [2, 1, 2, 1, 3, 1, 2],
        'III. Phrygian ♭4': [1, 2, 1, 3, 1, 2, 2],
        'IV. Lydian ♭3': [2, 1, 3, 1, 2, 2, 1],
        'V. Mixolydian ♭2': [1, 3, 1, 2, 2, 1, 2],
        'VI. Lydian Augmented ♯2': [3, 1, 2, 2, 1, 2, 1],
        'VII. Locrian ♭7': [1, 2, 2, 1, 2, 1, 3],
    },
    'Harmonic Minor': {
        'I. Harmonic Minor': [2, 1, 2, 2, 1, 3, 1],
        'II. Locrian ♯6': [1, 2, 2, 1, 3, 1, 2],
        'III. Ionian ♯5': [2, 2, 1, 3, 1, 2, 1],
        'IV. Dorian ♯4 (Ukrainian Dorian)': [2, 1, 3, 1, 2, 1, 2],
        'V. Phrygian ♯2 (Phrygian Dominant)': [1, 3, 1, 2, 1, 2, 2],
        'VI. Lydian ♯2': [3, 1, 2, 1, 2, 2, 1],
        'VII. Mixolydian ♯1': [1, 2, 1, 2, 2, 1, 3],
    },
    'Double Harmonic': {
        'I. Double Harmonic Major': [1, 3, 1, 2, 1, 3, 1],
        // I. aka (Gypsy Maj/Arabic/Byzantine Echoi/Flamenco)
        'II. Lydian ♯2 ♯6': [3, 1, 2, 1, 3, 1, 1],
        'III. Ultraphrygian': [1, 2, 1, 3, 1, 3, 1],
        'IV. Hungarian minor / Gypsy minor': [2, 1, 3, 1, 1, 3, 1],
        'V. Oriental': [1, 3, 1, 1, 3, 1, 2],
        'VI. Ionian ♯2 ♯5': [3, 1, 1, 3, 1, 2, 1],
        'VII. Locrian bb3 bb7': [1, 1, 3, 1, 2, 1, 3],
    },
    'Other Heptatonic': {
        'Neapolitan major': [1, 2, 2, 2, 2, 2, 1],
        'Neapolitan minor': [1, 2, 2, 2, 1, 3, 1],
        'Hungarian major': [3, 1, 2, 1, 2, 1, 2],
        'Locrian major': [2, 2, 1, 1, 2, 2, 2],
        'Lydian diminished': [2, 1, 3, 1, 1, 2, 1],
        'Gypsy major': [2, 1, 3, 1, 1, 2, 2],
        Enigmatic: [1, 3, 2, 2, 2, 1, 1],
        Persian: [1, 3, 1, 1, 2, 3, 1],
    },
    Pentatonic: {
        'Pentatonic Major': [2, 2, 3, 2, 3],
        'Pentatonic Minor (Yo)': [3, 2, 2, 3, 2],
        Iwato: [1, 4, 1, 4, 2],
        In: [1, 4, 2, 1, 4],
        Insen: [1, 4, 2, 3, 2],
        'Hirajoshi scale': [4, 2, 1, 4, 1],
    },
    Hexatonic: {
        'Blues scale': [3, 2, 1, 1, 3, 2],
        'Whole Tone': [2, 2, 2, 2, 2, 2],
        'Two-semitone tritone scale': [1, 1, 4, 1, 1, 4],
        'Istrian scale': [1, 2, 1, 2, 1, 5],
        'Tritone scale': [1, 3, 2, 1, 3, 2],
        'Prometheus scale': [2, 2, 2, 3, 1, 2],
        'Scale of harmonics': [3, 1, 1, 2, 2, 3],
        'Augmented scale': [3, 1, 3, 1, 3, 1],
    },
    Supertonic: {
        'Major Bebop': [2, 2, 1, 2, 1, 1, 2, 1],
        'Bebop Dominant': [2, 2, 1, 2, 2, 1, 1, 1],
        Algerian: [2, 1, 3, 1, 1, 3, 1, 2, 1, 2],
        Diminished: [2, 1, 2, 1, 2, 1, 2, 1],
        'Dominant Diminished': [1, 2, 1, 2, 1, 2, 1, 2],
        Chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
};

const modeDiatonicMapping = {
    'I. Ionian (Major)': 'Ionian',
    'II. Dorian': 'Dorian',
    'III. Phrygian': 'Phrygian',
    'IV. Lydian': 'Lydian',
    'V. Mixolydian (Melodic Minor ↓)': 'Mixolydian',
    'VI. Aeolian (Natural Minor)': 'Aeolian',
    'VII. Locrian': 'Locrian',

    'I. Melodic Minor (↑)': 'Aeolian',
    'II. Dorian ♭2': 'Dorian',
    'III. Lydian Augmented': 'Lydian',
    'IV. Lydian Dominant (Acoustic)': 'Lydian',
    'V. Aeolian Dominant': 'Aeolian',
    'VI. Half Diminished': 'Aeolian',
    'VII. Super Locrian "Altered" (Diminished Whole Tone)': 'Locrian',

    'I. Harmonic Major': 'Ionian',
    'II. Dorian ♭5': 'Dorian',
    'III. Phrygian ♭4': 'Phrygian',
    'IV. Lydian ♭3': 'Lydian',
    'V. Mixolydian ♭2': 'Mixolydian',
    'VI. Lydian Augmented ♯2': 'Lydian',
    'VII. Locrian ♭7': 'Locrian',

    'I. Harmonic Minor': 'Ionian',
    'II. Locrian ♯6': 'Dorian',
    'III. Ionian ♯5': 'Phrygian',
    'IV. Dorian ♯4 (Ukrainian Dorian)': 'Lydian',
    'V. Phrygian ♯2 (Phrygian Dominant)': 'Mixolydian',
    'VI. Lydian ♯2': 'Lydian',
    'VII. Mixolydian ♯1': 'Locrian',

    'I. Double Harmonic Major': 'Ionian',
    'II. Lydian ♯2 ♯6': 'Lydian',
    'III. Ultraphrygian': 'Phrygian',
    'IV. Hungarian minor / Gypsy minor': 'Lydian',
    'V. Oriental': 'Mixolydian',
    'VI. Ionian ♯2 ♯5': 'Ionian',
    'VII. Locrian bb3 bb7': 'Locrian',

    'Neapolitan major': 'Ionian',
    'Neapolitan minor': 'Aeolian',
    // 'Hungarian major': 'Phrygian',
    'Locrian major': 'Lydian',
    'Lydian diminished': 'Mixolydian',
    'Gypsy major': 'Ionian',
    Enigmatic: 'Aeolian',
    Persian: 'Locrian',

    'Pentatonic Major': 'Ionian',
    'Pentatonic Minor (Yo)': 'Aeolian',
    Iwato: 'Phrygian',
    In: 'Lydian',
    Insen: 'Mixolydian',
    'Hirajoshi scale': 'Aeolian',

    'Blues scale': 'Aeolian',
    // 'Whole Tone': 'Dorian',
    // 'Two-semitone tritone scale': 'Phrygian',
    // 'Istrian scale': 'Lydian',
    // 'Tritone scale': 'Mixolydian',
    // 'Prometheus scale': 'Aeolian',
    // 'Scale of harmonics': 'Aeolian',
    // 'Augmented scale': 'Locrian',

    // 'Major Bebop': 'Ionian',
    // 'Bebop Dominant': 'Dorian',
    // 'Algerian': 'Phrygian',
    // 'Diminished': 'Lydian',
    // 'Dominant Diminished': 'Mixolydian',
    // 'Chromatic': 'Aeolian',
};

const modeAdjustments = {
    Ionian: 0,
    Dorian: -2,
    Phrygian: -4,
    Lydian: 1,
    Mixolydian: -1,
    Aeolian: -3,
    Locrian: -5,
};

const scaleTypes = Object.keys(modes);

const intervalNamesMap = {
    Unison: 0,
    '2nd': 2,
    '3rd': 4,
    '4th': 5,
    '5th': 7,
    '6th': 9,
    '7th': 11,
    Octave: 12,
    '9th': 14,
    '10th': 16,
    '11th': 17,
    '12th': 19,
    '13th': 21,
    '14th': 23,
    'Double Octave': 24,
};

const reverseIntervalNamesMap = {};
for (const [key, value] of Object.entries(intervalNamesMap)) {
    reverseIntervalNamesMap[value] = key;
}
const getIntervalName = (number) => reverseIntervalNamesMap[number];

const intervalNames = Object.keys(intervalNamesMap);

const generateSelectedScale = (tonic, selectedScaleType, mode, scaleRange) => {
    if (!modes || !modes.hasOwnProperty(selectedScaleType)) {
        console.error(`Scale type '${selectedScaleType}' not found in modes.`);
        return {scale: [], displayScale: []};
    }

    const scaleType = modes[selectedScaleType];

    if (!scaleType.hasOwnProperty(mode)) {
        console.error(
            `Mode '${mode}' not found for scale type '${selectedScaleType}'.`
        );
        return [];
    }

    const intervals = scaleType[mode];

    if (!Array.isArray(intervals)) {
        console.error(
            `Intervals for mode '${mode}' in scale type '${selectedScaleType}' are invalid.`
        );
        return [];
    }

    const scale = generateScale(tonic, intervals, scaleRange);
    const displayScale = generateDisplayScale(tonic, intervals, scaleRange);
    const numAccidentals = generatenumAccidentals(tonic, mode);
    return {scale, displayScale, numAccidentals};
};

const generatenumAccidentals = (tonic, mode) => {
    // Step 1: Extract the tonic without the octave number
    const tonicNote = tonic.match(/[A-G][♭♯]?/)[0]; // Regex to extract the note part (e.g., C, Gb)

    // Step 2: Determine the basic number of sharps or flats based on the circle of fifths
    let accidentals = 0;

    // Determine the basic number of sharps or flats based on the circle of fifths
    const circleOfFifths = {
        C: 0,
        G: 1,
        D: 2,
        A: 3,
        E: 4,
        B: 5,
        'F♯': 6,
        'C♯': 7,
        F: -1,
        'B♭': -2,
        'E♭': -3,
        'A♭': -4,
        'D♭': -5,
        'G♭': -6,
        'C♭': -7,
    };

    if (circleOfFifths.hasOwnProperty(tonicNote)) {
        accidentals = circleOfFifths[tonicNote];
    } else {
        return 0;
    }
    // Adjust based on mode using modeDiatonicMapping
    const modeType = modeDiatonicMapping[mode];
    if (modeType !== undefined) {
        accidentals += modeAdjustments[modeType];
    } else {
        // Default adjustment for major scale (Ionian)
        accidentals += 0;
    }
    return accidentals;
};

const generateScale = (anyTonic, intervals, scaleRange) => {
    const tonic = standardizeTonic(anyTonic);
    console.log('generating Scale for', {tonic}, {intervals}, {scaleRange});
    const scale = [];
    let noteIndex = notes.indexOf(tonic);
    let sumOfIntervals = 0;
    let i = 0;

    while (sumOfIntervals <= scaleRange) {
        const note = notes[noteIndex % notes.length];
        scale.push(note);
        sumOfIntervals += intervals[i % intervals.length];
        noteIndex += intervals[i % intervals.length];
        i++;
    }
    return scale;
};

const randomScale = (
    scaleTypes,
    modes,
    setSelectedScaleType,
    setSelectedMode
) => {
    const randomScaleType =
        scaleTypes[Math.floor(Math.random() * scaleTypes.length)];
    const scaleTypeModes = modes[randomScaleType];
    const modesArray = Object.keys(scaleTypeModes);
    const randomMode = modesArray[Math.floor(Math.random() * modesArray.length)];

    setSelectedScaleType(randomScaleType);
    setSelectedMode(randomMode);
};

const randomMode = (selectedScaleType, modes, setSelectedMode) => {
    if (!modes.hasOwnProperty(selectedScaleType)) {
        console.error(`Scale type '${selectedScaleType}' not found in modes.`);
        return;
    }

    const scaleTypeModes = Object.keys(modes[selectedScaleType]);
    const randomMode =
        scaleTypeModes[Math.floor(Math.random() * scaleTypeModes.length)];

    setSelectedMode(randomMode);
};

const randomTonic = () => {
    const newTonic =
        tonicOptions[Math.floor(Math.random() * tonicOptions.length)];
    return newTonic;
};

export {
    generateSelectedScale,
    generateScale,
    randomScale,
    randomMode,
    randomTonic,
    tonicOptions,
    modes,
    intervalNames,
    intervalNamesMap,
};
