// data/mockReports.js
export const reportData = {
  metrics: {
    totalIncidents: 167,
    avgResolution: '2.4h',
    slaBreach: '8.2%',
    topCategory: 'Safety'
  },
  incidentsByDay: [
    { day: 'Mon', value: 10 },
    { day: 'Tue', value: 20 },
    { day: 'Wed', value: 6 },
    { day: 'Thu', value: 12 },
    { day: 'Fri', value: 18 }
  ],
  topStations: [
    { rank: 1, name: 'Terminal A - Gate 1', code: 'TA-G1', incidents: 45, change: -12 },
    { rank: 2, name: 'Terminal B - Dock 2', code: 'TB-D2', incidents: 38, change: -5 },
    { rank: 3, name: 'Terminal B - Dock 1', code: 'TB-D1', incidents: 32, change: 3 }
  ],
  carriersSummary: [
    { name: 'ABC Logistics', incidents: 12 },
    { name: 'TransGlobal Shipping', incidents: 9 }
  ]
};
