const squareWave = (frequency, dutyCycle, cycles) => {
  const pointsPerCycle = 100;
  const data = [];

  for (let i = 0; i < cycles; i++) {
    const cycleStartTime = (1000 * i) / frequency;
    const points = [];

    for (let j = 0; j < pointsPerCycle; j++) {
      const time = cycleStartTime + (1000 * j) / (pointsPerCycle * frequency);
      const dutyCycleStartTime =
        cycleStartTime + (dutyCycle / 100) * (1000 / frequency);
      const voltage = time <= dutyCycleStartTime ? 5 : 0;
      points.push({ time, voltage });
    }

    data.push(...points);
  }

  return data;
};

export default squareWave;
