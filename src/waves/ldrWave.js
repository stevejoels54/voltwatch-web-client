// const ldrWave = (cycles) => {
//   const frequency = 1; // Frequency set to 1Hz
//   const pointsPerCycle = 50;
//   const maxVoltage = 4.8;
//   const minVoltage = 0.568;
//   const data = [];

//   for (let i = 0; i < cycles; i++) {
//     const cycleStartTime = (1000 * i) / frequency;
//     const points = [];

//     for (let j = 0; j < pointsPerCycle; j++) {
//       const time = cycleStartTime + (1000 * j) / (pointsPerCycle * frequency);
//       const voltage =
//         (maxVoltage + minVoltage) / 2 +
//         ((maxVoltage - minVoltage) / 2) *
//           Math.sin((2 * Math.PI * frequency * time) / 1000);
//       points.push({ time, voltage });
//     }

//     data.push(...points);
//   }

//   return data;
// };

// export default ldrWave;

const ldrWave = (cycles) => {
  const frequency = 1; // Frequency set to 1Hz
  const pointsPerCycle = 50;
  const maxVoltage = 4.8;
  const minVoltage = 0.568;
  const data = [];
  const totalTime = cycles * (1000 / frequency); // Total time in milliseconds

  for (let i = 0; i < cycles; i++) {
    const cycleStartTime = (totalTime * i) / cycles;
    const points = [];

    for (let j = 0; j < pointsPerCycle; j++) {
      const time = cycleStartTime + ((totalTime / cycles) * j) / pointsPerCycle;
      const voltage =
        (maxVoltage + minVoltage) / 2 +
        ((maxVoltage - minVoltage) / 2) *
          Math.sin((2 * Math.PI * frequency * time) / 1000);
      points.push({ time, voltage });
    }

    data.push(...points);
  }

  return data;
};

export default ldrWave;
