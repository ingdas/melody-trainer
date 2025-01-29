//components/PickerModel.js
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Modal,
    Button
} from 'react-native';

import {styles, colors} from './styles'
// PICKER MODALS
const PickerModal = (
    data,
    onValueChange,
    isVisible,
    setVisible
) => (
    <Modal visible={isVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                onValueChange(item);
                                setVisible(false);
                            }}>
                            <Text style={[styles.label, {color: 'white'}]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
                <Button title="Close" onPress={() => setVisible(false)}/>
            </View>
        </View>
    </Modal>
);

export default PickerModal;
