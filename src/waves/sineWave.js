const sineWave = (frequency, cycles) => {
  const pointsPerCycle = 50;
  const data = [];

  for (let i = 0; i < cycles; i++) {
    const cycleStartTime = (1000 * i) / frequency;
    const points = [];

    for (let j = 0; j < pointsPerCycle; j++) {
      const time = cycleStartTime + (1000 * j) / (pointsPerCycle * frequency);
      const voltage = 5 * Math.sin((2 * Math.PI * frequency * time) / 1000);
      points.push({ time, voltage });
    }

    data.push(...points);
  }

  return data;
};

export default sineWave;
