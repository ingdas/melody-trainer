import {Text, View, Pressable, DimensionValue} from "react-native";
import {styles} from "./generic/styles";
import React, {useState} from "react";
import SheetMusic from "./SheetMusic";
import {StoreActions, StoreState} from "../model/UseStoreTypes";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark, faCog, faDice} from '@fortawesome/free-solid-svg-icons';
import {Instrument} from "../model/Instrument";
import {RandomizationRule} from "../model/InstrumentSettings";

export const ConfigurableSheetMusic = ({store}: { store: StoreState & StoreActions }) => {
    const {timeSignature, instruments, scale, screenWidth, randomizeMelody} = store;
    const [showOverlay, setShowOverlay] = useState(false);

    const handleDicePress = (diceNumber: number) => {
        console.log(`Dice ${diceNumber} was pressed`);
    };

    const SHEET_MUSIC_HEIGHT = 290;
    const instrumentOptions = [
        {text: "Uniform", action: RandomizationRule.Uniform},
        {text: "Tonic On One", action: RandomizationRule.TonicOnOne},
        {text: "Keep", action: RandomizationRule.Keep},
        {text: "Mute", action: RandomizationRule.Mute}]
    const percussionOptions = [
        {text: "Standard", action: RandomizationRule.Percussion},
        {text: "Uniform", action: RandomizationRule.Uniform},
        {text: "Keep", action: RandomizationRule.Keep},
        {text: "Mute", action: RandomizationRule.Mute}]

    const DICE = [
        {yOffset: 51, instrument: Instrument.Treble, options: instrumentOptions},
        {yOffset: 131, instrument: Instrument.Bass, options: instrumentOptions},
        {yOffset: 211, instrument: Instrument.Percussion, options: percussionOptions},
    ]

    return (
        <View style={{
            position: 'relative',
            flex: 1,
            width: '100%',
            height: SHEET_MUSIC_HEIGHT,
            justifyContent: 'center'
        }}>
            <View style={{
                position: 'relative',
                width: '100%',
                height: SHEET_MUSIC_HEIGHT,
            }}>
                <SheetMusic
                    timeSignature={timeSignature}
                    trebleMelody={instruments.treble.melody}
                    bassMelody={instruments.bass.melody}
                    percussionMelody={instruments.percussion.melody}
                    numAccidentals={scale.numAccidentals}
                    screenWidth={screenWidth}
                />

                {/* Overlay with background press handler */}
                {showOverlay && (
                    <Pressable
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: SHEET_MUSIC_HEIGHT,
                            backgroundColor: 'rgba(128, 128, 128, 0.5)',
                            zIndex: 1,
                        }}
                        onPress={() => setShowOverlay(false)}
                    >
                        {/* Dice buttons */}
                        {DICE.map((die, index) => (
                            <Pressable
                                key={index + 1}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleDicePress(index + 1);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: die.yOffset,
                                    left: '20%',
                                    padding: 10,
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    zIndex: 2,
                                    transform: "translate(0,-50%)"
                                }}
                            >
                                <FontAwesomeIcon icon={faDice} size={24}/>
                            </Pressable>
                        ))}
                    </Pressable>
                )}
            </View>

            {/* Toggle button */}
            <Pressable
                onPress={() => setShowOverlay(!showOverlay)}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    padding: 8,
                    backgroundColor: '#666',
                    borderRadius: 4,
                    zIndex: 2,
                }}
            >
                {showOverlay ?
                    <FontAwesomeIcon icon={faXmark}/> :
                    <FontAwesomeIcon icon={faCog}/>
                }
            </Pressable>
        </View>
    );
};