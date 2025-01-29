import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styles } from './styles';

const PickerButton = ({ onPress, label, icon }) => (
  <TouchableOpacity style={styles.pickerButton} onPress={onPress}>
    {icon && <FontAwesomeIcon name={icon} size={12} color="#FFF" style={styles.pickerButtonIcon} />}
    <Text style={styles.pickerButtonText}>{label}</Text>
  </TouchableOpacity>
);

export default PickerButton;