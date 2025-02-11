import {View, Pressable} from "react-native";
import {Picker} from '@react-native-picker/picker';
import React, {useState} from "react";
import SheetMusic from "./SheetMusic";
import {StoreActions, StoreState} from "../model/UseStoreTypes";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark, faCog} from '@fortawesome/free-solid-svg-icons';
import {Instrument} from "../model/Instrument";
import {RandomizationRule} from "../model/InstrumentSettings";

export const ConfigurableSheetMusic = ({store}: { store: StoreState & StoreActions }) => {
    const {timeSignature, instruments, scale, screenWidth} = store;
    const [showOverlay, setShowOverlay] = useState(false);

    const SHEET_MUSIC_HEIGHT = 290;
    const instrumentOptions = [
        {text: "Uniform", action: RandomizationRule.Uniform},
        {text: "Tonic On One", action: RandomizationRule.TonicOnOne},
        {text: "Keep", action: RandomizationRule.Keep},
        {text: "Mute", action: RandomizationRule.Mute}
    ];
    const percussionOptions = [
        {text: "Standard", action: RandomizationRule.Percussion},
        {text: "Uniform", action: RandomizationRule.Uniform},
        {text: "Keep", action: RandomizationRule.Keep},
        {text: "Mute", action: RandomizationRule.Mute}
    ];

    const INSTRUMENTS = [
        {yOffset: 51, instrument: Instrument.Treble, options: instrumentOptions},
        {yOffset: 131, instrument: Instrument.Bass, options: instrumentOptions},
        {yOffset: 211, instrument: Instrument.Percussion, options: percussionOptions},
    ];

    const handleOptionSelect = (instrumentIndex: number, selectedAction: RandomizationRule) => {
        console.log(`Instrument ${instrumentIndex}: selected action ${selectedAction}`);
    };

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
                        onPress={() => setShowOverlay(true)}
                    >
                        {/* Dropdowns */}
                        {INSTRUMENTS.map((instrument, index) => (
                            <View
                                key={index}
                                style={{
                                    position: 'absolute',
                                    top: instrument.yOffset,
                                    left: '20%',
                                    width: 150,
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    zIndex: 2,
                                    transform: [{translateY: -20}],
                                }}
                            >
                                <Picker
                                    // @ts-ignore
                                    onValueChange={(value) => handleOptionSelect(index, value)}
                                    style={{
                                        height: 40,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    {instrument.options.map((option, optionIndex) => (
                                        <Picker.Item
                                            key={optionIndex}
                                            label={option.text}
                                            value={option.action}
                                        />
                                    ))}
                                </Picker>
                            </View>
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
                    <FontAwesomeIcon icon={faXmark} color="white"/> :
                    <FontAwesomeIcon icon={faCog} color="white"/>
                }
            </Pressable>
        </View>
    );
};