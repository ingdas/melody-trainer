interface Scale {
    scale: string[];
    displayScale: string[];
    numAccidentals: number;
    tonic: string;
    displayTonic: string;
    notes: string[];
    durations: number[];
    timeStamps: number[];
    volumes: number[];
}

function createScale(
    scale: string[],
    displayScale: string[],
    numAccidentals: number
): Scale {
    return {
        scale,
        displayScale,
        numAccidentals,
        tonic: scale[0],
        displayTonic: displayScale[0],
        notes: scale,
        durations: new Array(scale.length).fill(12),
        timeStamps: Array.from({length: scale.length}, (_, i) => i * 12),
        volumes: new Array(scale.length).fill(1)
    };
}

function defaultScale(): Scale {
    return createScale(
        ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
        ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
        0
    );
}

function defaultPercussionScale(): Scale {
    return createScale(
        ['b', 's', 'hh', 'ho', 'th', 'tm', 'tl', 'hp', 'cr', 'cc'],
        ['b', 's', 'hh', 'ho', 'th', 'tm', 'tl', 'hp', 'cr', 'cc'],
        0
    );
}

function defaultCymbalScale(): Scale {
    return createScale(
        ['hh', 'ho', 'hp', 'cr', 'cc'],
        ['hh', 'ho', 'hp', 'cr', 'cc'],
        0
    );
}

function defaultBeatScale(): Scale {
    return createScale(
        ['b', 's'],
        ['b', 's'],
        0
    );
}

function getLength(scale: Scale): number {
    return scale.scale.length;
}

function generateBassScale(scale: Scale): Scale {
    function lowerOctave(note: string): string {
        const noteParts = note.match(/([^0-9]+)(\d+)/);
        if (!noteParts) return note;
        const pitch = noteParts[1];
        const octave = parseInt(noteParts[2], 10) - 1;
        return pitch + octave;
    }

    const bassScale = scale.scale.map(lowerOctave);
    const bassDisplayScale = scale.displayScale.map(lowerOctave);

    return createScale(
        bassScale,
        bassDisplayScale,
        scale.numAccidentals
    );
}

export {
    type Scale,
    createScale,
    defaultScale,
    defaultPercussionScale,
    defaultCymbalScale,
    defaultBeatScale,
    getLength,
    generateBassScale
};