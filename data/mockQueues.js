// data/mockQueues.js
// Mock queue data for operator queue manager
export const queueStations = [
  {
    id: 'TA-G1',
    name: 'Terminal A - Gate 1',
    code: 'TA-G1',
    status: 'Operational',
    activeLane: 'Lane A',
    eta: '~6 min',
    lastCall: '2 min ago',
    queue: [
      { id: 'Q-201', carrier: 'Delta Logistics', truck: '34 ABC 123', trailer: 'TRL-77', commodity: 'Containers', eta: '5 min', status: 'waiting' },
      { id: 'Q-202', carrier: 'NorthPort Freight', truck: '06 NPF 456', trailer: 'TRL-12', commodity: 'Cold chain', eta: '9 min', status: 'waiting' },
      { id: 'Q-203', carrier: 'Ege Trans', truck: '35 EGT 789', trailer: 'TRL-19', commodity: 'Dry goods', eta: '14 min', status: 'waiting' }
    ],
    history: [
      { id: 'H-1', carrier: 'Blue River', action: 'completed', at: '2025-12-27 09:05', truck: '41 BRV 222' }
    ]
  },
  {
    id: 'TB-D2',
    name: 'Terminal B - Dock 2',
    code: 'TB-D2',
    status: 'Paused',
    activeLane: 'Lane C',
    eta: '~12 min',
    lastCall: '7 min ago',
    queue: [
      { id: 'Q-301', carrier: 'Istanbul Freight', truck: '34 IF 654', trailer: 'TRL-44', commodity: 'Mixed', eta: '12 min', status: 'waiting' },
      { id: 'Q-302', carrier: 'Marmara Lines', truck: '34 MR 777', trailer: 'TRL-35', commodity: 'Containers', eta: '18 min', status: 'waiting' }
    ],
    history: [
      { id: 'H-2', carrier: 'Odyssey', action: 'no-show', at: '2025-12-27 08:50', truck: '06 ODY 987' }
    ]
  },
  {
    id: 'TC-LB',
    name: 'Terminal C - Loading Bay',
    code: 'TC-LB',
    status: 'Operational',
    activeLane: 'Lane E',
    eta: '~4 min',
    lastCall: '1 min ago',
    queue: [
      { id: 'Q-401', carrier: 'Anadolu Cargo', truck: '01 ANC 333', trailer: 'TRL-21', commodity: 'Pharma', eta: '4 min', status: 'waiting' }
    ],
    history: [
      { id: 'H-3', carrier: 'TransEuro', action: 'completed', at: '2025-12-27 08:40', truck: '34 TEU 118' }
    ]
  },
  {
    id: 'TD-TS1',
    name: 'Terminal D - Temp Storage',
    code: 'TD-TS1',
    status: 'Operational',
    activeLane: 'Lane F',
    eta: '~9 min',
    lastCall: '5 min ago',
    queue: [
      { id: 'Q-501', carrier: 'Eurasia Haulage', truck: '16 ERH 521', trailer: 'TRL-91', commodity: 'Electronics', eta: '9 min', status: 'waiting' },
      { id: 'Q-502', carrier: 'Black Sea Lines', truck: '61 BSL 410', trailer: 'TRL-04', commodity: 'Consumer goods', eta: '15 min', status: 'waiting' }
    ],
    history: []
  }
];
