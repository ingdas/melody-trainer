class Scale {
  constructor(scale, displayScale, numAccidentals) {
    this.scale = scale;
    this.displayScale = displayScale;
    this.numAccidentals = numAccidentals;
    this.tonic = scale[0];
    this.displayTonic = displayScale[0];
    this.notes = scale;
    this.durations = new Array(scale.length).fill(12);
    this.timeStamps = Array.from({ length: scale.length }, (_, i) => i * 12);
    this.volumes = new Array(scale.length).fill(1);
  }

  static defaultScale() {
    return new Scale(
      ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
      ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
      0
    );
  }

  static defaultPercussionScale() {
    return new Scale(
      ['b', 's', 'hh', 'ho', 'th', 'tm', 'tl', 'hp', 'cr', 'cc'],
      ['b', 's', 'hh', 'ho', 'th', 'tm', 'tl', 'hp', 'cr', 'cc'],
      0
    );
  }

  static defaultCymbalScale() {
    return new Scale(
      ['hh', 'ho', 'hp', 'cr', 'cc'],
      ['hh', 'ho', 'hp', 'cr', 'cc'],
      0
    );
  }

  static defaultBeatScale() {
    return new Scale(['b', 's'], ['b', 's'], 'Percussion', 'Beat', 0);
  }

  length() {
    return this.scale.length;
  }

  generateBassScale() {
    function lowerOctave(note) {
      const noteParts = note.match(/([^0-9]+)(\d+)/);
      if (!noteParts) return note;
      const pitch = noteParts[1];
      const octave = parseInt(noteParts[2], 10) - 1;
      return pitch + octave;
    }

    const bassScale = this.scale.map(lowerOctave);

    const bassDisplayScale = this.displayScale.map(lowerOctave);
    return new Scale(
      bassScale,
      bassDisplayScale,
      this.numAccidentals
    );
  }
}

export default Scale;
