import initialState from "../initialState/initialState";
import actions from "../actions/actions";

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_APP_MODE:
      return {
        ...state,
        appMode: action.mode,
      };
    case actions.SET_FREQUENCY:
      return {
        ...state,
        frequency: action.frequency,
      };
    case actions.SET_MAX_VOLTAGE:
      return {
        ...state,
        maxVoltage: action.maxVoltage,
      };
    case actions.SET_MIN_VOLTAGE:
      return {
        ...state,
        minVoltage: action.minVoltage,
      };
    case actions.SET_AVG_VOLTAGE:
      return {
        ...state,
        avgVoltage: action.avgVoltage,
      };
    case actions.SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.isPlaying,
      };
    case actions.SET_IS_RECORDING:
      return {
        ...state,
        isRecording: action.isRecording,
      };
    case actions.SET_IS_SERIAL_CONNECTED:
      return {
        ...state,
        isSerialConnected: action.isSerialConnected,
      };
    case actions.SEND_WAVE_DATA:
      return {
        ...state,
        sendWaveData: action.sendWaveData,
      };
    case actions.SET_SEND_STATUS:
      return {
        ...state,
        sendStatus: action.sendStatus,
      };
    default:
      return state;
  }
};

export default reducers;
