// /components/SheetMusic.js

import React from 'react';
import { View } from 'react-native';
import { Svg, Path, Text as SvgText } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { processMelodyAndCalculateSlots } from '../operations/processMelodyAndCalculateSlots';
import { processMelodyAndCalculateFlags } from '../operations/processMelodyAndCalculateFlags';

import { renderMelodyNotes } from '../operations/renderMelodyNotes';
import renderAccidentals from '../operations/renderAccidentals';
import calculateAllTimeStamps from '../operations/calculateAllTimeStamps';

const SheetMusic = ({
  timeSignature,
  trebleMelody,
  bassMelody,
  percussionMelody,
  numAccidentals,
  screenWidth,
}) => {
  const [fontsLoaded] = useFonts({
    Maestro: require('../../assets/fonts/maestro.ttf'),
  });

  let noteGroupSize = 12;
  let measureLength = (48 * timeSignature[0]) / timeSignature[1];

  if (measureLength % 18 === 0) {
    noteGroupSize = 18;
  }
  // else if (timeSignature[1] === 8) {
  //   noteGroupSize = 24
  // }

  if (!fontsLoaded) {
    return null;
  }

  const endX = screenWidth * 0.85;

  const staffLines = [
    11, 21, 31, 41, 51, 91, 101, 111, 121, 131, 171, 181, 191, 201, 211,
  ];

  // Measure
  const measurePositionX = Math.min(Math.abs(numAccidentals), 7) * 8 + 60;
  const startX = measurePositionX + 15;
  const [measureTop, measureBottom] = timeSignature;

  const measureYPositions = [20, 40, 100, 120, 180, 200]; // Define y positions

  const renderMeasureTexts = () => {
    return measureYPositions.map((yPos, index) => {
      if (
        (measureTop !== 4 || measureBottom !== 4) &&
        !(measureTop === 2 && measureBottom === 2)
      ) {
        // Render measureTop and measureBottom normally
        return (
          <SvgText
            key={`measure-text-${index}`}
            x={measurePositionX}
            y={yPos}
            fontSize="32"
            fill="white"
            fontFamily="Maestro"
            textAnchor="middle" // Center horizontally
          >
            {index % 2 === 0 ? measureTop : measureBottom}
          </SvgText>
        );
      } else if (index % 2 === 0) {
        return (
          <SvgText
            key={`measure-text-${index}`}
            x={measurePositionX}
            y={yPos + 10}
            fontSize="32"
            fill="white"
            fontFamily="Maestro"
            textAnchor="middle" // Center horizontally
          >
            {measureTop === 2 ? 'C' : 'c'}
          </SvgText>
        );
      } else {
        return null; // Render nothing for this yPos
      }
    });
  };

  const adjustedTrebleMelody = processMelodyAndCalculateSlots(
    trebleMelody,
    timeSignature,
    noteGroupSize
  );

  const trebleMelodyFlags = processMelodyAndCalculateFlags(
    adjustedTrebleMelody,
    timeSignature,
    noteGroupSize
  );
  console.log('trebleMelodyFlags', trebleMelodyFlags);

  const adjustedBassMelody = processMelodyAndCalculateSlots(
    bassMelody,
    timeSignature,
    noteGroupSize
  );

  const adjustedPercussionMelody = processMelodyAndCalculateSlots(
    percussionMelody,
    timeSignature,
    noteGroupSize
  );

  const allTimeStamps = calculateAllTimeStamps(
    timeSignature,
    noteGroupSize,
    adjustedTrebleMelody.timeStamps,
    adjustedBassMelody.timeStamps,
    adjustedPercussionMelody.timeStamps
  );

  const noteWidth = (endX - startX) / (allTimeStamps.length - 1);

  // Function to render vertical lines at the end of each measure
  const renderMeasureLines = () => {
    return allTimeStamps.map((timestamp, index) => {
      if (timestamp === 'm') {
        const x = index === 0 ? 0 : startX + index * noteWidth;
        return (
          <Path
            key={`measure-line-${index}`}
            d={`M ${x} 11 V 131 M ${x} 171 V 211`}
            stroke="white"
            strokeWidth="0.5"
          />
        );
      }
      return null;
    });
  };
  // Return
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={endX + 2} viewBox={`0 -20 ${endX + 2} 270`}>
        <Path d={`M 0 -19 H 50 M 0 249 H 50`} stroke="yellow" strokeWidth="1" />
        {/* Draw musical staff */}
        {staffLines.map((y) => (
          <Path
            key={y}
            d={`M 0 ${y} H ${endX}`}
            stroke="white"
            strokeWidth="0.5"
          />
        ))}
        {/* Clefs */}
        <SvgText x="8" y="40" fontSize="36" fill="white" fontFamily="Maestro">
          &
        </SvgText>
        <SvgText x="8" y="100" fontSize="36" fill="white" fontFamily="Maestro">
          ?
        </SvgText>
        {/* Draw percussion staff */}
        <SvgText
          x="18"
          y="200" // Adjust Y position as needed
          fontSize="36"
          fill="white"
          fontFamily="Maestro">
          /
        </SvgText>
        {/* Display measure number */}
        {renderMeasureTexts()}
        {/* Draw flats or sharps */}
        {renderAccidentals(numAccidentals)}
        {/* Draw notes */}
        {renderMelodyNotes(
          adjustedTrebleMelody,
          numAccidentals,
          startX,
          noteWidth,
          allTimeStamps,
          'treble'
        )}
        {renderMelodyNotes(
          adjustedBassMelody,
          numAccidentals,
          startX,
          noteWidth,
          allTimeStamps,
          'bass'
        )}
        {renderMelodyNotes(
          adjustedPercussionMelody,
          0,
          startX,
          noteWidth,
          allTimeStamps,
          'percussion'
        )}
        {/* Draw measure lines */}
        {renderMeasureLines()}
      </Svg>
    </View>
  );
};

export default SheetMusic;
