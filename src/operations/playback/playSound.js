import generateAllNotesArray from '../allNotesArray';

const allNotesArray = generateAllNotesArray();

// https://danigb.github.io/smplr/
// https://smpldsnds.github.io/drum-machines/TR-808/dm.json

const noteMapping = {
    cc: "cymbal/cy0010", // Crash Cymbal
    hh: "hihat-close", // Hi-hat (Closed)
    ho: "hihat-open/oh10", // Open Hi-hat
    cr: "cymbal/cy7575", // Ride Cymbal
    th: "conga-hi", // High Tom
    tm: "conga-mid", // Medium Tom
    s: "snare/sd0010", // Snare Drum
    tl: "conga-low", // Floor Tom
    b: "mid-tom", // Bass Drum
    cb: "cowbell", // Cowbell
    hp: "maraca", // Hi-hat Pedal
    k: 100, // Woodblock Hi
    c: 75, // Woodblock Lo
};

// PLAY SOUNDS
const playSound = async (
    note,
    instrument,
    context,
    time = context.currentTime,
    duration = 0.25,
    volume = 1
) => {
    if (note !== null && note !== 'r') {
        const noteIndex = allNotesArray.indexOf(note);
        if (noteIndex !== -1) {
            // Note found in allNotesArray
            const noteNb = noteIndex + 21;
            instrument.start({
                note: noteNb,
                time: time,
                duration: duration,
            });
        } else if (note in noteMapping) {
            // Note found in noteMapping
            instrument.start({
                note: noteMapping[note],
                time: time,
                duration: duration,
            });
        } else {
            console.error(`Note ${note} not found in allNotesArray or noteMapping.`);
        }
    }
};

export default playSound;
