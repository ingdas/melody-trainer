import React from 'react';
import {StyleSheet, Text as RNText, TouchableOpacity} from 'react-native';

const ToggleButton = ({active, onPress, activeIcon, inactiveIcon, activeColor, iconSource, glyph}) => {
    return (
        <TouchableOpacity style={[styles.toggleButton, {borderColor: active ? activeColor : '#666'}]} onPress={onPress}>
            {iconSource === 'bootstrap' ? (
                <FontAwesomeIcon
                    icon={active ? activeIcon : inactiveIcon}
                    size={18}
                    color={active ? activeColor : '#666'}
                    style={styles.pickerButtonIcon}
                />
            ) : (
                glyph && (
                    <RNText style={[styles.maestroGlyph, {color: active ? activeColor : '#666'}]}>
                        {glyph}
                    </RNText>
                )
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    toggleButton: {
        backgroundColor: '#111',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
    },
    pickerButtonIcon: {
        marginRight: 5,
    },
    maestroGlyph: {
        fontFamily: 'Maestro',
        fontSize: 18,
    },
});

export default ToggleButton;
