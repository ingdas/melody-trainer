//components/styles.js

import { StyleSheet } from 'react-native';

const colors = {
  accentColor1: '#ff5722',
  accentColor2: '#ff9800',
  accentColor3: '#ffc107',
  accentColor4: '#4caf50',
  accentColor5: '#8bc34a',
  passiveButtonColor: '#607d8b',
  lowLightColor: '#9e9e9e',
  activeColor: '#083',
  tabTitleColor: '#E5E5E5',
  measureAndScaleActive: '#6B2C3D',
  measureAndScalePassive: '#4E202C',
  playbackActive: '#40031F',
  playbackPassive: '#38031A',
  instrumentsActive: '#4B4149',
  instrumentsPassive: '#2D272C',
  percussionActive: '#693434',
  percussionPassive: '#4B2626',
  backBackground: '#001',
  label: '#AAC',
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: colors.backBackground },
  emptySpace: { height: 40, backgroundColor: colors.backBackground },
  buttons: {
    height: 40,
    backgroundColor: '#202',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempoMetronome: {
    height: 90,
    backgroundColor: '#202',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizer: {
    flex: 1,
    backgroundColor: '#013',
    justifyContent: 'space-between', // Spread items vertically
    alignItems: 'center', // Center items horizontally
    paddingVertical: 20, // Optional: Add some padding if needed
  },
  piano: {
    flex: 1,
    backgroundColor: '#1B263B',
    width: '100%',
    alignItems: 'center',
  },
  settings: {
    padding: 10,
    backgroundColor: '#1B263B',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  tabToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.backBackground,
  },
  tabToggle: {
    padding: 10,
    alignItems: 'center',
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center', // Center align the tab content horizontally
    marginHorizontal: 3,
    marginTop: 5,
  },
  tabTitle: {
    fontWeight: 'bold',
    color: colors.tabTitleColor,
  },
  tabActive: { backgroundColor: '#422553' },
  tabInactive: { backgroundColor: '#2D1938' },
  tabBar: { backgroundColor: '#422553' },
  settingsTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    color: '#FFF',
    backgroundColor: '#FFF',
    zIndex: 5,
  },
  measureAndScalekSettingsTab: { backgroundColor: '#000' },
  playbackSettingsTab: { backgroundColor: '#5E3147' },
  instrumentSettingsTab: { backgroundColor: '#5E3147' },
  percussionSettingsTab: { backgroundColor: '#5E3147' },
  text: { color: '#E5E5E5' },
  // BUTTONES
  pickerButton: {
    backgroundColor: '#306',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 30, // Example minimum width
    minHeight: 30, // Example minimum height
    marginRight: 10,
  },
  pickerButtonText: {
    color: '#FFF',
    // fontWeight: '500',
    textTransform: 'uppercase',
  },
  pickerButtonIcon: {
    marginRight: 5, // Adjust spacing between icon and text
    marginTop: 4, // Adjust this value to move the icon up or down
  },
  paddingRow: {
    minHeight: 20,
  },
  pickerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    // marginBottom: 5,
    // position: 'relative',
  },
  // Labels
  label: {
    // fontSize: 18,
    // marginBottom: 5,
    color: '#AAC',
  },
  //modals
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#779',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    color: '#AAC',
  },
  modalOption: {
    padding: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#AAC',
  },
  // Music Notation Text (Maestro)
  measureContainer: {
    flexDirection: 'column', // Stacks the measure rows vertically
    alignItems: 'center', // Centers child elements horizontally
  },
  measureRow: {
    flexDirection: 'row', // Aligns buttons and text in a row
    alignItems: 'center', // Centers items vertically
    marginBottom: 10, // Optional: Add spacing between rows
  },
  metronomeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 160,
  },
  noteText: {
    flex: 1,
    fontFamily: 'Maestro',
    fontSize: 30,
    height: 45,
    lineHeight: 45,
    marginTop: 0,
    // paddingHorizontal: 15,
    textAlign: 'center',
    overflow: 'hidden',
    color: '#AAC',
  },
  measureText: {
    flex: 1,
    fontFamily: 'Maestro',
    fontSize: 50,
    height: 88,
    width: 60,
    lineHeight: 125,
    marginTop: -55,
    paddingTop: 0,
    textAlign: 'center',
    overflow: 'hidden',
    color: '#AAC',
  },
  metronomeText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    color: '#AAC',
  },
  bpmText: {
    flex: 1,
    fontFamily: 'Maestro',
    fontSize: 50,
    height: 88,
    // paddingHorizontal: 15,
    lineHeight: 125,
    marginTop: -55,
    paddingTop: 0,
    textAlign: 'center',
    overflow: 'hidden',
    color: '#AAC',
  },
  tempoTerm: {
    fontFamily: 'Merriweather',
    fontSize: 18,
    textAlign: 'center',
    color: '#AAC',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    marginHorizontal: 5,
  },
  emptyHorizontalSpace: {
    width: 40,
  },
  maestroGlyph: {
    fontFamily: 'Maestro',
    fontSize: 18,
  },
  maestroGlyphButton: {
    fontFamily: 'Maestro',
    fontSize: 25,
    lineHeight: 5,
    minWidth: 25,
    textAlign: 'center',
    marginHorizontal: -5, 
    marginTop: 15,
    color: colors.label,

  },
});

export { styles, colors };
