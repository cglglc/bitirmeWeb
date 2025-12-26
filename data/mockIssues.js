// data/mockIssues.js
export const issues = [
  {
    id: 'i1',
    title: 'Gate 1 scanner malfunction',
    station: 'TA-G1',
    reporter: 'John Doe',
    created: '2025-12-24 09:12',
    priority: 'High',
    status: 'Open',
    description: 'Scanner at Gate 1 is intermittently failing to read plates.',
    comments: [
      { by: 'Tech Team', text: 'We are investigating.', time: '2025-12-24 09:45' }
    ]
  },
  {
    id: 'i2',
    title: 'Queue delay at Dock 2',
    station: 'TB-D2',
    reporter: 'Ops Manager',
    created: '2025-12-24 10:05',
    priority: 'Medium',
    status: 'Open',
    description: 'Unexpected traffic causing delays in queue processing.',
    comments: []
  },
  {
    id: 'i3',
    title: 'Lighting issue on loading bay',
    station: 'TC-LB',
    reporter: 'Maintenance',
    created: '2025-12-23 18:20',
    priority: 'Low',
    status: 'Resolved',
    description: 'Some lights are flickering; replaced bulbs.',
    comments: [{ by: 'Maintenance', text: 'Issue resolved, replaced bulbs.', time: '2025-12-23 20:00' }]
  }
  ,
  {
    id: 'i4',
    title: 'Temperature sensor offline',
    station: 'TD-TS1',
    reporter: 'Warehouse',
    created: '2025-12-22 14:30',
    priority: 'High',
    status: 'Open',
    description: 'Temperature sensor on cold storage not responding to pings.',
    comments: [{ by: 'Tech Team', text: 'Temporary workaround applied.', time: '2025-12-22 15:00' }]
  },
  {
    id: 'i5',
    title: 'Conveyor belt slip',
    station: 'TE-CB3',
    reporter: 'Line Supervisor',
    created: '2025-12-21 08:50',
    priority: 'High',
    status: 'Resolved',
    description: 'Belt slipping under load; adjusted tension and replaced roller.',
    comments: [{ by: 'Maintenance', text: 'Parts replaced, monitoring for 24h.', time: '2025-12-21 10:12' }]
  },
  {
    id: 'i6',
    title: 'Access control card reader',
    station: 'TF-AC',
    reporter: 'Security',
    created: '2025-12-20 12:00',
    priority: 'Medium',
    status: 'Open',
    description: 'Some staff cards intermittently denied at east entrance reader.',
    comments: []
  },
  {
    id: 'i7',
    title: 'Water leak near dock 5',
    station: 'TG-D5',
    reporter: 'Cleaning',
    created: '2025-12-19 07:40',
    priority: 'High',
    status: 'Resolved',
    description: 'Minor leak from overhead pipe; sealed and dry.',
    comments: [{ by: 'Facilities', text: 'Leak sealed, no further action required.', time: '2025-12-19 08:30' }]
  },
  {
    id: 'i8',
    title: 'Software update required for kiosk',
    station: 'TH-K1',
    reporter: 'Ops',
    created: '2025-12-18 16:10',
    priority: 'Low',
    status: 'Open',
    description: 'Kiosk firmware outdated; schedule update off-hours.',
    comments: [{ by: 'IT', text: 'Planned for 2025-12-27 02:00', time: '2025-12-18 16:30' }]
  },
  {
    id: 'i9',
    title: 'Broken pallet rack',
    station: 'TI-RK2',
    reporter: 'Forklift Operator',
    created: '2025-12-17 11:22',
    priority: 'Medium',
    status: 'Resolved',
    description: 'Damaged rack beam replaced and inspected.',
    comments: [{ by: 'Maintenance', text: 'Replaced beam; safety check passed.', time: '2025-12-17 13:00' }]
  }
];
