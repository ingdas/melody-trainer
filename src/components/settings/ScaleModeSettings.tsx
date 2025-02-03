import {Text, TouchableOpacity, View} from "react-native";
import {colors, styles} from "../generic/styles";
import PickerModal from "../generic/PickerModal";
import PickerButton from "../generic/PickerButton";
import {
    getIntervalName,
    intervalNames,
    intervalNamesMap,
    modes,
    randomMode,
    randomScale,
    randomTonic,
    scaleTypes,
    tonicOptions
} from "../../operations/scale/scaleHandler";
import {StoreActions, StoreState} from "../../model/UseStoreTypes";

const ScaleModeSettings = (
    {
        store: {
            tonic,
            setTonic,
            selectedScaleType,
            setSelectedScaleType,
            selectedInterval,
            setSelectedInterval,
            selectedMode,
            setSelectedMode,
            scale,

            scaleRange,
            setScaleRange,

            isTonicModalVisible,
            setTonicModalVisible,
            isScaleTypeModalVisible,
            setScaleTypeModalVisible,
            isModeModalVisible,
            setModeModalVisible,
        }
    }: { store: StoreActions & StoreState }) => {

    const currentDisplayScale = scale.displayScale;
    const handleRandomizeTonic = () => {
        const newTonic = randomTonic(); // Get random tonic
        setTonic(newTonic);
    };

    const handleRandomizeScaleType = () => {
        setSelectedScaleType(randomScale());
        setSelectedMode(randomMode(selectedScaleType));
    };

    const handleRandomizeMode = () => {
        setSelectedMode(randomMode(selectedScaleType));
    };

    const chooseScaleType = (newScaleType: string) => {
        const scaleTypeModes = modes[newScaleType];
        const modesArray = Object.keys(scaleTypeModes);
        setSelectedScaleType(newScaleType);
        setSelectedMode(modesArray[0]);
    };

    const increaseScaleRange = () => {
        let currentIndex = intervalNames.indexOf(selectedInterval);
        let nextIndex = Math.min(currentIndex + 1, intervalNames.length - 1);
        let newInterval = intervalNames[nextIndex];
        setScaleRange(intervalNamesMap[newInterval]);
        setSelectedInterval(newInterval);
    };

    const decreaseScaleRange = () => {
        let currentIndex = intervalNames.indexOf(selectedInterval);
        let nextIndex = Math.max(currentIndex - 1, 0);
        let newInterval = intervalNames[nextIndex];
        setScaleRange(intervalNamesMap[newInterval]);
        setSelectedInterval(newInterval);
    };
    return (
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
                <PickerButton onPress={decreaseScaleRange} label="-" icon={null}/>
                <TouchableOpacity
                    style={[styles.pickerButton, {backgroundColor: '#036'}]}>
                    <Text style={styles.pickerButtonText}>
                        Range: {getIntervalName(scaleRange)} ({scaleRange}H){' '}
                    </Text>
                </TouchableOpacity>
                <PickerButton onPress={increaseScaleRange} label="+" icon={null}/>
            </View>

            <View style={styles.paddingRow}/>
        </View>
    )
};
export {ScaleModeSettings};