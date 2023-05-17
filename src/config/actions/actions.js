const actions = {
  SET_APP_MODE: "SET_APP_MODE",
  SET_FREQUENCY: "SET_FREQUENCY",
  SET_MAX_VOLTAGE: "SET_MAX_VOLTAGE",
  SET_MIN_VOLTAGE: "SET_MIN_VOLTAGE",
  SET_AVG_VOLTAGE: "SET_AVG_VOLTAGE",
  SET_IS_PLAYING: "SET_IS_PLAYING",
  SET_IS_RECORDING: "SET_IS_RECORDING",
  SET_IS_SERIAL_CONNECTED: "SET_IS_SERIAL_CONNECTED",
  SEND_WAVE_DATA: "SEND_WAVE_DATA",
  SET_SEND_STATUS: "SET_SEND_STATUS",

  setAppMode: (mode) => {
    return {
      type: actions.SET_APP_MODE,
      mode,
    };
  },
  setFrequency: (frequency) => {
    return {
      type: actions.SET_FREQUENCY,
      frequency,
    };
  },
  setMaxVoltage: (maxVoltage) => {
    return {
      type: actions.SET_MAX_VOLTAGE,
      maxVoltage,
    };
  },
  setMinVoltage: (minVoltage) => {
    return {
      type: actions.SET_MIN_VOLTAGE,
      minVoltage,
    };
  },
  setAvgVoltage: (avgVoltage) => {
    return {
      type: actions.SET_AVG_VOLTAGE,
      avgVoltage,
    };
  },
  setIsPlaying: (isPlaying) => {
    return {
      type: actions.SET_IS_PLAYING,
      isPlaying,
    };
  },
  setIsRecording: (isRecording) => {
    return {
      type: actions.SET_IS_RECORDING,
      isRecording,
    };
  },
  setIsSerialConnected: (isSerialConnected) => {
    return {
      type: actions.SET_IS_SERIAL_CONNECTED,
      isSerialConnected,
    };
  },
  sendWaveData: (sendWaveData) => {
    return {
      type: actions.SEND_WAVE_DATA,
      sendWaveData,
    };
  },
  setSendStatus: (sendStatus) => {
    return {
      type: actions.SET_SEND_STATUS,
      sendStatus,
    };
  },
};

export default actions;
