import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {styles} from './styles';

const PickerButton = ({onPress, label, icon}) => (
    <TouchableOpacity style={styles.pickerButton} onPress={onPress}>
        {icon && <FontAwesomeIcon icon={icon} size={"1x"} color="#FFF" style={styles.pickerButtonIcon}/>}
        <Text style={styles.pickerButtonText}>{label}</Text>
    </TouchableOpacity>
);

export default PickerButton;