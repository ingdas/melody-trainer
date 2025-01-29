interface Melody {
    notes: (string | null)[];
    durations: (number | null)[];
    timeStamps: (number | null)[];
    displayNotes: (string | null)[];
    volumes: number[];
}

function createMelody(
    notes: (string | null)[],
    durations: (number | null)[],
    timeStamps: (number | null)[],
    displayNotes: (string | null)[] = notes,
    volumes: number[] = new Array(notes.length).fill(1)
): Melody {
    return {
        notes,
        durations,
        timeStamps,
        displayNotes,
        volumes
    };
}

function defaultTrebleMelody(): Melody {
    return createMelody(
        [
            'C4', null, 'D4', null, null, 'E4', 'F4', 'G4',
            'A4', null, 'B4', null, 'C5', null, null, null
        ],
        [
            12, null, 18, null, null, 6, 6, 6,
            12, null, 12, null, 24, null, null, null
        ],
        [
            0, null, 12, null, null, 30, 36, 42,
            48, null, 60, null, 72, null, null, null
        ]
    );
}

function defaultBassMelody(): Melody {
    return createMelody(
        ['C3', 'G3'],
        [48, 48],
        [0, 48]
    );
}

function defaultPercussionMelody(): Melody {
    return createMelody(
        ['b', 'hh', 's', 'hh', 'b'],
        [12, 12, 12, 12, 12],
        [0, 12, 24, 36, 48]
    );
}

function defaultMetronomeMelody(): Melody {
    return createMelody(
        ['k', 'c', 'c', 'c', 'k', 'c', 'c', 'c'],
        [12, 12, 12, 12, 12, 12, 12, 12],
        [0, 12, 24, 36, 48, 60, 72, 84]
    );
}

function fromFlattenedNotes(
    notes: (string | null)[],
    timeSignature: [number, number],
    numMeasures: number,
    displayMelody: (string | null)[] = notes
): Melody {
    const durations: (number | null)[] = [];
    const timeStamps: (number | null)[] = [];
    const timeScale = ((48 * numMeasures) / notes.length) * (timeSignature[0] / timeSignature[1]);

    let noteIndex = 0;

    notes.forEach((note, index) => {
        if (note === null) {
            durations.push(null);
            timeStamps.push(null);
            if (durations[noteIndex] !== null) {
                durations[noteIndex]!++; // Non-null assertion since we know noteIndex points to a number
            }
        } else {
            durations.push(1);
            noteIndex = index;
            timeStamps.push(index * timeScale);
        }
    });

    // Scale up the durations
    return createMelody(
        notes,
        durations.map(dur => dur !== null ? timeScale * dur : null),
        timeStamps,
        displayMelody
    );
}

function updateMetronome(
    timeSignature: [number, number],
    numMeasures: number
): Melody {
    const measureCounts = (4 * timeSignature[0]) / timeSignature[1];
    const beatsPerMeasure = Math.ceil(measureCounts);
    const totalBeats = beatsPerMeasure * numMeasures;
    const reciprocalDuration = (1 + measureCounts - beatsPerMeasure) * 12;

    const notes: string[] = [];
    const timestamps: number[] = [];
    const durations: number[] = [];

    for (let i = 0; i < totalBeats; i++) {
        const isFirstBeat = i % beatsPerMeasure === 0;
        const isLastBeat = (i + 1) % beatsPerMeasure === 0;

        notes.push(isFirstBeat ? 'k' : 'c');
        const nextTimeStamp = durations.reduce((sum, current) => sum + current, 0);
        timestamps.push(nextTimeStamp);
        durations.push(isLastBeat ? reciprocalDuration : 12);
    }

    return createMelody(notes, durations, timestamps, notes);
}

export {
    Melody,
    createMelody,
    defaultTrebleMelody,
    defaultBassMelody,
    defaultPercussionMelody,
    defaultMetronomeMelody,
    fromFlattenedNotes,
    updateMetronome
};