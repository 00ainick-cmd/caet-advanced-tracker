// CAET Advanced PQS — 8 Categories, 65 Tasks
// Source: Workforce Committee Review (Feb 2026)

export interface PqsFundamental {
  item: string
  description: string
}

export interface PqsRisk {
  description: string
}

export interface PqsTask {
  taskId: string
  description: string
  performanceStandard: string
}

export interface PqsSection {
  number: number
  title: string
  objective: string
  fundamentals: PqsFundamental[]
  risks: PqsRisk[]
  tasks: PqsTask[]
}

export const PQS_SECTIONS: PqsSection[] = [
  {
    number: 1,
    title: 'Pitot-Static & Air Data Systems',
    objective: 'Demonstrate proficiency in pitot-static system maintenance, leak testing, and certification per 14 CFR 91.411.',
    fundamentals: [],
    risks: [],
    tasks: [
      { taskId: '1-01', description: 'Connect Pitot-Static Test Equipment', performanceStandard: 'Connect without leaks; proper adapter selection.' },
      { taskId: '1-02', description: 'Perform Static System Leak Test', performanceStandard: 'Verify leak rate within 100 ft/min (or limit).' },
      { taskId: '1-03', description: 'Perform Pitot System Operational Check', performanceStandard: 'Verify airspeed response; no leaks.' },
      { taskId: '1-04', description: 'Test Altimeter at Required Points', performanceStandard: 'Record scale error; verify tolerance.' },
      { taskId: '1-05', description: 'Verify Altitude Encoder Correlation', performanceStandard: 'Within 125 feet of altimeter.' },
      { taskId: '1-06', description: 'Test Pitot Heat Operation', performanceStandard: 'Verify current draw and heat.' },
      { taskId: '1-07', description: 'Perform Altimeter Case Leak Test', performanceStandard: 'At 18,000 ft; verify leak rate.' },
      { taskId: '1-08', description: 'Isolate and Repair Static System Leak', performanceStandard: 'Systematic isolation; effective repair.' },
      { taskId: '1-09', description: 'Perform RVSM Certification Test', performanceStandard: 'Follow ICA; verify tighter tolerances.' },
      { taskId: '1-10', description: 'Complete 91.411 Documentation', performanceStandard: 'Logbook entry with all required elements.' }
    ]
  },
  {
    number: 2,
    title: 'Surveillance Systems',
    objective: 'Verify operation and compliance of Transponder and ADS-B systems per 14 CFR 91.413 and 91.227.',
    fundamentals: [],
    risks: [],
    tasks: [
      { taskId: '2-01', description: 'Perform 91.413 Transponder Test', performanceStandard: 'Test Mode A/C/S parameters.' },
      { taskId: '2-02', description: 'Verify ADS-B Out Compliance', performanceStandard: 'Check NACp, NIC, SIL, flight ID.' },
      { taskId: '2-03', description: 'Troubleshoot ADS-B FAIL Annunciation', performanceStandard: 'Isolate GPS/TX/Config issue.' },
      { taskId: '2-04', description: 'Verify ICAO Address Programming', performanceStandard: 'Match hex code to aircraft reg.' },
      { taskId: '2-05', description: 'Verify Mode C Altitude Correlation', performanceStandard: 'Within 125 ft of altimeter.' },
      { taskId: '2-06', description: 'Explain Transponder Mode Operation', performanceStandard: 'Explain A vs C vs S vs ADS-B.' },
      { taskId: '2-07', description: 'Identify Transponder Antenna Requirements', performanceStandard: 'Location, bonding, cable loss.' },
      { taskId: '2-08', description: 'Complete 91.413 Documentation', performanceStandard: 'Logbook entry with all required elements.' }
    ]
  },
  {
    number: 3,
    title: 'Autopilot & Flight Control',
    objective: 'Troubleshoot and verify autopilot servo operation, rigging, and mode engagement.',
    fundamentals: [],
    risks: [],
    tasks: [
      { taskId: '3-01', description: 'Perform Autopilot Ground Check', performanceStandard: 'Verify servo direction and override.' },
      { taskId: '3-02', description: 'Test All Autopilot Disconnect Methods', performanceStandard: 'Yoke, panel, trim switch disconnects.' },
      { taskId: '3-03', description: 'Test Electric Trim System', performanceStandard: 'Verify speed, direction, runaway protection.' },
      { taskId: '3-04', description: 'Verify Autopilot Mode Engagement', performanceStandard: 'HDG, NAV, ALT, APR modes.' },
      { taskId: '3-05', description: 'Troubleshoot Autopilot Won\'t Engage', performanceStandard: 'Check interlocks (AHRS, ADC, servos).' },
      { taskId: '3-06', description: 'Troubleshoot Autopilot Oscillation', performanceStandard: 'Identify axis; check bridle tension/gain.' },
      { taskId: '3-07', description: 'Explain Flight Director vs Autopilot', performanceStandard: 'Command bars vs servo movement.' },
      { taskId: '3-08', description: 'Identify Autopilot System Components', performanceStandard: 'Computer, servos, sensors, feedback.' }
    ]
  },
  {
    number: 4,
    title: 'FMS & Navigation',
    objective: 'Manage navigation databases, troubleshoot position inputs, and verify FMS-autopilot coupling.',
    fundamentals: [],
    risks: [],
    tasks: [
      { taskId: '4-01', description: 'Verify FMS-to-Autopilot Coupling', performanceStandard: 'Check lateral/vertical deviation deviation.' },
      { taskId: '4-02', description: 'Verify Navigation Database Currency', performanceStandard: 'Check cycle and effective dates.' },
      { taskId: '4-03', description: 'Load Navigation Database Update', performanceStandard: 'Update cards/USB; verify load.' },
      { taskId: '4-04', description: 'Troubleshoot FMS Position Invalid', performanceStandard: 'Check GPS/IRS inputs.' },
      { taskId: '4-05', description: 'Verify ARINC 429 Communication', performanceStandard: 'Verify labels and data flow.' },
      { taskId: '4-06', description: 'Perform GPS Receiver Operational Check', performanceStandard: 'Verify signal strength, position.' },
      { taskId: '4-07', description: 'Explain WAAS and LPV Approaches', performanceStandard: 'Sat-based augmentation explanation.' },
      { taskId: '4-08', description: 'Identify FMS Components and Interfaces', performanceStandard: 'CDU, FMC, sensors, annunciators.' }
    ]
  },
  {
    number: 5,
    title: 'Audio & Communication',
    objective: 'Troubleshoot complex audio issues, isolate noise, and verify VHF communication performance.',
    fundamentals: [],
    risks: [],
    tasks: [
      { taskId: '5-01', description: 'Perform COM Radio Functional Check', performanceStandard: 'Tx/Rx quality, sidetone, squelch.' },
      { taskId: '5-02', description: 'Measure Antenna VSWR', performanceStandard: 'Measure forward/reflected power.' },
      { taskId: '5-03', description: 'Troubleshoot No Transmit Condition', performanceStandard: 'Isolate PTT, mic, radio, or antenna.' },
      { taskId: '5-04', description: 'Troubleshoot No Receive / Weak Receive', performanceStandard: 'Isolate antenna, coax, or radio.' },
      { taskId: '5-05', description: 'Troubleshoot Audio Hum or Noise', performanceStandard: 'Identify ground loops or shielding issues.' },
      { taskId: '5-06', description: 'Troubleshoot Stuck Mic / Hot Mic', performanceStandard: 'Isolate key line or jack short.' },
      { taskId: '5-07', description: 'Explain Audio Signal Routing', performanceStandard: 'Mic -> Audio Panel -> Radio path.' },
      { taskId: '5-08', description: 'Perform ELT Inspection', performanceStandard: 'Per 91.207 (G-switch, batt, ant).' }
    ]
  },
  {
    number: 6,
    title: 'Wire Harness & Installation',
    objective: 'Fabricate and install wire harnesses to EWIS standards with proper routing and termination.',
    fundamentals: [],
    risks: [],
    tasks: [
      { taskId: '6-01', description: 'Fabricate Crimped Terminations', performanceStandard: 'Proper strip, crimp, and tensile test.' },
      { taskId: '6-02', description: 'Perform Harness Continuity Test', performanceStandard: 'End-to-end verification.' },
      { taskId: '6-03', description: 'Perform Insulation Resistance (Megger)', performanceStandard: 'Check for shorts/breakdown.' },
      { taskId: '6-04', description: 'Install Bonding Jumper', performanceStandard: 'Surface prep, milliohm check.' },
      { taskId: '6-05', description: 'Verify Bonding Resistance', performanceStandard: 'Measure < 2.5 milliohms.' },
      { taskId: '6-06', description: 'Route and Secure Wire Bundle', performanceStandard: 'Clamping, separation, radius.' },
      { taskId: '6-07', description: 'Apply Wire Identification Marking', performanceStandard: 'Legible, proper interval.' },
      { taskId: '6-08', description: 'Troubleshoot Open or Short in Harness', performanceStandard: 'Locate fault distance/segment.' }
    ]
  },
  {
    number: 7,
    title: 'Software & Configuration',
    objective: 'Manage avionics software loading, configuration files, and version control.',
    fundamentals: [],
    risks: [],
    tasks: [
      { taskId: '7-01', description: 'Verify Software Compatibility', performanceStandard: 'Check hardware/software mod levels.' },
      { taskId: '7-02', description: 'Back Up Configuration Before Update', performanceStandard: 'Save config to SD/USB.' },
      { taskId: '7-03', description: 'Perform Software Update', performanceStandard: 'Load OS/App software correctly.' },
      { taskId: '7-04', description: 'Recover From Failed Software Load', performanceStandard: 'Retry procedure; boot mode.' },
      { taskId: '7-05', description: 'Verify Software Configuration After Load', performanceStandard: 'Confirm part numbers/versions.' },
      { taskId: '7-06', description: 'Perform Operational Test After Update', performanceStandard: 'Full system function check.' },
      { taskId: '7-07', description: 'Identify Approved Software Configuration', performanceStandard: 'Reference STC/Service Bulletin.' }
    ]
  },
  {
    number: 8,
    title: 'Documentation & Compliance',
    objective: 'Research regulations, complete maintenance records, and ensure airworthiness compliance.',
    fundamentals: [],
    risks: [],
    tasks: [
      { taskId: '8-01', description: 'Write 91.411 Logbook Entry', performanceStandard: 'Include max alt, static leak details.' },
      { taskId: '8-02', description: 'Write 91.413 Logbook Entry', performanceStandard: 'Include transponder S/N, error check.' },
      { taskId: '8-03', description: 'Write Installation Logbook Entry', performanceStandard: 'Reference data, W&B, 337.' },
      { taskId: '8-04', description: 'Complete FAA Form 337', performanceStandard: 'Major alteration description.' },
      { taskId: '8-05', description: 'Determine Major vs Minor Alteration', performanceStandard: 'Evaluate per Part 43 App A.' },
      { taskId: '8-06', description: 'Identify Approved Data for Installation', performanceStandard: 'STC, TSO, AC 43.13 logic.' },
      { taskId: '8-07', description: 'Research Airworthiness Directives', performanceStandard: 'Find applicable ADs.' },
      { taskId: '8-08', description: 'Explain Return to Service Authority', performanceStandard: 'Repairman vs A&P vs IA.' }
    ]
  },
]

export const TOTAL_TASKS = PQS_SECTIONS.reduce((sum, s) => sum + s.tasks.length, 0) // 65
