import {Text, TouchableOpacity, View} from "react-native";
import {colors, styles} from "../generic/styles";
import PickerModal from "../generic/PickerModal";
import PickerButton from "../generic/PickerButton";
import {getIntervalName, modes, scaleTypes} from "../../operations/scale/scaleHandler";

const ScaleModeSettings = ({
                               currentDisplayScale,

                               tonic,
                               tonicOptions,
                               setTonic,
                               isTonicModalVisible,
                               setTonicModalVisible,
                               handleRandomizeTonic,

                               selectedScaleType,
                               chooseScaleType,
                               isScaleTypeModalVisible,
                               setScaleTypeModalVisible,
                               handleRandomizeScaleType,

                               selectedMode,
                               setSelectedMode,
                               isModeModalVisible,
                               setModeModalVisible,
                               handleRandomizeMode,

                               scaleRange,

                               increaseScaleRange,
                               decreaseScaleRange,
                           }) => (
    <View
        style={[
            styles.settings,
            {backgroundColor: colors.measureAndScaleActive},
        ]}>
        <Text style={styles.tabTitle}>Scale and Mode</Text>

        <Text style={styles.label}>
            Current Scale: {currentDisplayScale.join(', ')}
        </Text>

        <View style={styles.pickerRow}>
            <Text style={styles.label}>Tonic</Text>
            <TouchableOpacity
                style={[
                    styles.pickerButton,
                    {position: 'absolute', left: '18%', backgroundColor: '#036'},
                ]}
                onPress={handleRandomizeTonic}>
                <Text style={styles.pickerButtonText}>↻</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.pickerButton, {backgroundColor: '#036'}]}
                onPress={() => setTonicModalVisible(true)}>
                <Text style={styles.pickerButtonText}>{tonic}</Text>
            </TouchableOpacity>
        </View>
        {PickerModal(
            tonicOptions,
            setTonic,
            isTonicModalVisible,
            setTonicModalVisible
        )}

        <View style={styles.pickerRow}>
            <Text style={styles.label}>Scale Family</Text>
            <TouchableOpacity
                style={[
                    styles.pickerButton,
                    {position: 'absolute', left: '18%', backgroundColor: '#066'},
                ]}
                onPress={handleRandomizeScaleType}>
                <Text style={styles.pickerButtonText}>↻</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.pickerButton, {backgroundColor: '#066'}]}
                onPress={() => setScaleTypeModalVisible(true)}>
                <Text style={styles.pickerButtonText}>{selectedScaleType}</Text>
            </TouchableOpacity>
        </View>
        {PickerModal(
            scaleTypes,
            chooseScaleType,
            isScaleTypeModalVisible,
            setScaleTypeModalVisible
        )}

        <View style={styles.pickerRow}>
            <Text style={styles.label}>Mode</Text>
            <TouchableOpacity
                style={[styles.pickerButton, {position: 'absolute', left: '18%'}]}
                onPress={handleRandomizeMode}>
                <Text style={styles.pickerButtonText}>↻</Text>
            </TouchableOpacity>
            {selectedScaleType && modes[selectedScaleType] && (
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setModeModalVisible(true)}>
                    <Text style={styles.pickerButtonText}>{selectedMode}</Text>
                </TouchableOpacity>
            )}
        </View>
        {PickerModal(
            Object.keys(modes[selectedScaleType] || {}),
            setSelectedMode,
            isModeModalVisible,
            setModeModalVisible
        )}

        <View style={styles.pickerRow}>
            <PickerButton onPress={decreaseScaleRange} label="-"/>
            <TouchableOpacity
                style={[styles.pickerButton, {backgroundColor: '#036'}]}>
                <Text style={styles.pickerButtonText}>
                    Range: {getIntervalName(scaleRange)} ({scaleRange}H){' '}
                </Text>
            </TouchableOpacity>
            <PickerButton onPress={increaseScaleRange} label="+"/>
        </View>

        <View style={styles.paddingRow}/>
    </View>
);
export {ScaleModeSettings};