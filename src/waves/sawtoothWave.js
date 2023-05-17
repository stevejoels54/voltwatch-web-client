const sawtoothWave = (frequency, cycles) => {
  const pointsPerCycle = 50;
  const data = [];

  for (let i = 0; i < cycles; i++) {
    const cycleStartTime = (1000 * i) / frequency;
    const points = [];

    for (let j = 0; j < pointsPerCycle; j++) {
      const time = cycleStartTime + (1000 * j) / (pointsPerCycle * frequency);
      const period = 1000 / frequency;

      // Calculate the position within the current period
      const position = (time - cycleStartTime) % period;

      // Calculate the voltage based on the position within the period
      const voltage = (position / period) * 5;

      points.push({ time, voltage });
    }

    data.push(...points);
  }

  return data;
};

export default sawtoothWave;
