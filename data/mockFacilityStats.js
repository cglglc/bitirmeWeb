// data/mockFacilityStats.js
export const facilityStats = {
  metrics: {
    throughputToday: 542,
    avgWait: '18m',
    longestWait: '45m',
    etaAccuracy: '94.2%',
    utilization: '78%'
  },
  throughputOverTime: [
    { time: '6am', value: 30 },
    { time: '9am', value: 65 },
    { time: '12pm', value: 110 },
    { time: '3pm', value: 95 },
    { time: '6pm', value: 70 }
  ],
  avgWaitByStation: [
    { code: 'TA-G1', value: 22 },
    { code: 'TA-G2', value: 16 },
    { code: 'TB-D1', value: 28 }
  ],
  liveStationStatus: { operational: 12, down: 2 }
};
