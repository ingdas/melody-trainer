// components/ContinuousPlaybackSettings.js

import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {EyeSlashFill, FileEarmarkMusicFill, Pause, PlayFill, Repeat, Shuffle} from 'react-bootstrap-icons';
import {colors} from '../generic/styles';

const ToggleButton = ({active, onPress, activeIcon, passiveIcon, activeColor, iconSource, glyph}) => {
    return (
        <TouchableOpacity
            style={[styles.toggleButtonContainer, {borderColor: active ? activeColor : '#666', width: 35}]}
            onPress={onPress}
        >
            {iconSource === 'bootstrap' ? (
                React.createElement(active ? activeIcon : passiveIcon, {
                    size: 18,
                    color: active ? activeColor : '#666',
                    style: styles.pickerButtonIcon,
                })
            ) : (
                <Text
                    style={[
                        styles.pickerButtonIcon,
                        styles.maestroGlyph,
                        {color: active ? activeColor : '#666'}
                    ]}
                >
                    {glyph}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const ContinuousPlaybackSettings = () => {
    const [buttonStates, setButtonStates] = useState([
        [null, true, true, true, true, true], // headings
        [false, true, null, null, null, null], // scale
        [null, true, true, true, true, true], // metronome
        [true, null, true, false, true, false], // melody
        [true, null, true, false, true, false], // bass
        [true, null, false, false, false, false], // percussion
        [null, null, false, false, true, true], // sheet music
    ]);

    const handleButtonToggle = (rowIndex, colIndex) => {
        const newButtonStates = buttonStates.map((row, rIdx) =>
            row.map((col, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? !col : col))
        );
        setButtonStates(newButtonStates);
    };

    const buttonIcons = [
        [
            null,
            {type: 'maestro', glyph: '0'},
            {type: 'maestro', glyph: '1'},
            {type: 'maestro', glyph: '2'},
            {type: 'maestro', glyph: '3'},
            {type: 'maestro', glyph: '4'},
        ],
        [
            {type: 'bootstrap', icon: Shuffle, passiveIcon: Repeat},
            {type: 'bootstrap', icon: PlayFill, passiveIcon: Pause},
            null, null, null, null
        ],
        [
            null,
            {type: 'bootstrap', icon: PlayFill, passiveIcon: Pause},
            {type: 'bootstrap', icon: PlayFill, passiveIcon: Pause},
            {type: 'bootstrap', icon: PlayFill, passiveIcon: Pause},
            {type: 'bootstrap', icon: PlayFill, passiveIcon: Pause},
            {type: 'bootstrap', icon: PlayFill, passiveIcon: Pause},
        ],
        [
            {type: 'bootstrap', icon: Shuffle, passiveIcon: Repeat},
            null,
            {type: 'maestro', glyph: '&', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '&', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '&', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '&', passiveIcon: 'pause'},
        ],
        [
            {type: 'bootstrap', icon: Shuffle, passiveIcon: Repeat},
            null,
            {type: 'maestro', glyph: '?', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '?', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '?', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '?', passiveIcon: 'pause'},
        ],
        [
            {type: 'bootstrap', icon: Shuffle, passiveIcon: Repeat},
            null,
            {type: 'maestro', glyph: '/', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '/', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '/', passiveIcon: 'pause'},
            {type: 'maestro', glyph: '/', passiveIcon: 'pause'},
        ],
        [
            null,
            null,
            {type: 'bootstrap', icon: FileEarmarkMusicFill, passiveIcon: EyeSlashFill},
            {type: 'bootstrap', icon: FileEarmarkMusicFill, passiveIcon: EyeSlashFill},
            {type: 'bootstrap', icon: FileEarmarkMusicFill, passiveIcon: EyeSlashFill},
            {type: 'bootstrap', icon: FileEarmarkMusicFill, passiveIcon: EyeSlashFill},
        ],
    ];

    const renderRow = (label, rowIndex, activeColor) => (
        <View style={styles.pickerRow} key={rowIndex}>
            <Text style={styles.label}>{label}</Text>
            {buttonStates[rowIndex]?.map((active, colIndex) => {
                const buttonIcon = buttonIcons[rowIndex][colIndex];
                if (!buttonIcon) return <View style={styles.emptySpace} key={colIndex}/>; // Empty space for gaps

                return (
                    <ToggleButton
                        key={colIndex}
                        active={active}
                        onPress={() => handleButtonToggle(rowIndex, colIndex)}
                        activeIcon={buttonIcon.icon}
                        passiveIcon={buttonIcon.passiveIcon}
                        activeColor={activeColor}
                        iconSource={buttonIcon.type}
                        glyph={buttonIcon.glyph}
                    />
                );
            })}
        </View>
    );

    return (
        <View style={[styles.settings, {backgroundColor: colors.playbackActive}]}>
            <Text style={styles.tabTitle}>Continuous Playback</Text>
            {renderRow('', 0, colors.accentColor1)}
            {renderRow('scale', 1, colors.accentColor2)}
            {renderRow('metronome', 2, colors.accentColor2)}
            {renderRow('melody', 3, colors.accentColor3)}
            {renderRow('bass', 4, colors.accentColor3)}
            {renderRow('percussion', 5, colors.accentColor3)}
            {renderRow('sheet music', 6, colors.accentColor4)}
            <View style={styles.paddingRow}/>
        </View>
    );
};

const styles = StyleSheet.create({
    settings: {
        padding: 10,
        backgroundColor: '#1B263B',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabTitle: {
        fontWeight: 'bold',
        color: '#E5E5E5',
        marginBottom: 20,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        width: 120,
        color: '#AAC',
    },
    toggleButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
    },
    pickerButtonIcon: {
        marginTop: 2, // Adjust this value to move the icon up or down
    },
    maestroGlyph: {
        fontFamily: 'Maestro',
        fontSize: 30,
        height: 35,
        lineHeight: 35,
    },
    paddingRow: {
        minHeight: 20,
    },
    emptySpace: {
        width: 35,
    },
});

export {ContinuousPlaybackSettings};
