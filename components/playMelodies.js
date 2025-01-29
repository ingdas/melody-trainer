import playSound from './playSound'

const playMelodies = async (
  melodies,
  instruments,
  context,
  bpm,
  scheduledStart = context.currentTime,
) => {
  const timeFactor = 5 / bpm;

  for (let index = 0; index < melodies.length; index++) {
    const melody = melodies[index];
    const instrument = instruments[index];
    const { notes, durations, timeStamps } = melody;


    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const startTime = scheduledStart + timeStamps[i] * timeFactor;
      const duration = durations[i] * timeFactor;
      playSound(note, instrument, context, startTime, duration);
    }
  }

  // // Calculate total duration and wait
  // const maxDuration = Math.max(
  //   ...melodies.map((melody) => Math.max(...melody.timestamps))
  // );
  // const totalTime =
  //   (maxDuration * timeFactor) / 1000 +
  //   (Math.max(...melodies.map((melody) => Math.max(...melody.durations))) *
  //     timeFactor) /
  //     1000;

  // await new Promise((r) => setTimeout(r, totalTime * 1000));
};

export default playMelodies;
