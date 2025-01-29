import {getRelativeNoteName, standardizeTonic} from './convertToDisplayNotes'
import generateAllNotesArray from './allNotesArray';

const notes = generateAllNotesArray();

const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1];

const generateScale = (anyTonic, intervals, scaleRange) => {
    const tonic = standardizeTonic(anyTonic);
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

const computeScaleDelta = (intervals) => {
    const intervalsSum = intervals.reduce((acc, val) => {
        acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + val);
        return acc;
    }, []);

    const majorSum = majorScaleIntervals.reduce((acc, val) => {
        acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + val);
        return acc;
    }, []);

    return [0].concat(
        intervalsSum.map((sum, index) => sum - majorSum[index])
    );
};

const simplifications = {
    'C𝄪': 'D',
    'D𝄪': 'E',
    'E♯': 'F',
    'F𝄪': 'G',
    'G𝄪': 'A',
    'A𝄪': 'B',
    'B♯': 'C',
    'C♭': 'B',
    'D𝄫': 'C',
    'E𝄫': 'D',
    'F♭': 'E',
    'G𝄫': 'F',
    'A𝄫': 'G',
    'B𝄫': 'A',
};

const generateDisplayScale = (tonic, intervals, scaleRange) => {
    if (intervals.length === majorScaleIntervals.length) {
        const scaleDelta = computeScaleDelta(intervals);
        console.log(scaleDelta)

        const standardMajorNotes = generateScale(tonic, majorScaleIntervals, scaleRange);
        const majorNotes = standardMajorNotes.map(note => getRelativeNoteName(note, tonic));

        return majorNotes.map((note, index) => {
            const [pitch, octave] = note.match(/[A-G]♯?♭?|[0-9]/g);
            const delta = scaleDelta[index];

            let accidental = '';
            let adjustedPitch = pitch;

            if (delta < 0) {
                accidental = '♭'.repeat(Math.abs(delta));
                adjustedPitch = `${pitch}${accidental}`;
            } else if (delta > 0) {
                accidental = '♯'.repeat(delta);
                adjustedPitch = `${pitch}${accidental}`;
            }

            adjustedPitch = adjustedPitch.replace('♯♭', '').replace('♭♯', '').replace('♯♯', '𝄪').replace('♭♭', '𝄫');

            let displayNote = adjustedPitch;
            // if (simplifications.hasOwnProperty(adjustedPitch)) {
            //   displayNote = `${simplifications[adjustedPitch]}(${adjustedPitch})`;
            // }
            return `${displayNote}${octave}`;
        });
    } else {
        const standardScale = generateScale(tonic, intervals, scaleRange);
        return standardScale.map(note => getRelativeNoteName(note, tonic));
    }
};

export default generateDisplayScale;