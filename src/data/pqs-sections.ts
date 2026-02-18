// CAET Advanced PQS — All 13 Sections, 75 Tasks
// Source: PQS v4 Document (January 2026)

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
    title: 'Regulatory Compliance and Approved Data',
    objective: 'Demonstrate understanding of the regulatory framework for avionics maintenance and the ability to identify and use approved data for installation and repair tasks.',
    fundamentals: [
      { item: '1.2.1', description: '14 CFR Part 43: Who can perform maintenance, what requires approval' },
      { item: '1.2.2', description: '14 CFR Part 91.403: Owner/operator maintenance responsibility' },
      { item: '1.2.3', description: 'Approved data: manufacturer data, STCs, AC 43.13-1B, field approvals' },
      { item: '1.2.4', description: 'When an STC is required vs. when AC 43.13-1B authority applies' },
      { item: '1.2.5', description: 'Part 145 repair station privileges and limitations' },
      { item: '1.2.6', description: 'Airworthiness Directives: how to check, compliance requirements' },
    ],
    risks: [
      { description: 'Performing work without proper approved data (legal liability)' },
      { description: 'Assuming AC 43.13-1B covers everything (it doesn\'t)' },
      { description: 'Missing applicable ADs during installation' },
      { description: 'Working outside the scope of your authorization' },
    ],
    tasks: [
      { taskId: '1.4.1', description: 'Given an avionics installation scenario, determine what approved data is required: STC, manufacturer instructions, or AC 43.13-1B.', performanceStandard: 'Correct determination with explanation' },
      { taskId: '1.4.2', description: 'Look up whether any ADs apply to a specified avionics unit. Document the search method and results.', performanceStandard: 'AD search completed correctly; results documented' },
      { taskId: '1.4.3', description: 'Explain the difference between a major alteration and a minor alteration. Give examples of each in avionics.', performanceStandard: 'Distinction explained correctly with relevant examples' },
      { taskId: '1.4.4', description: 'Identify what approvals and documentation would be required to install a GPS navigator in an aircraft that doesn\'t have one.', performanceStandard: 'Correct identification of STC/approval requirements' },
    ],
  },
  {
    number: 2,
    title: 'Maintenance Documentation',
    objective: 'Demonstrate the ability to properly document avionics maintenance, inspections, and installations in accordance with regulatory requirements.',
    fundamentals: [
      { item: '2.2.1', description: 'Logbook entry requirements per 14 CFR 43.9 and 43.11' },
      { item: '2.2.2', description: 'What must be included in a maintenance record entry' },
      { item: '2.2.3', description: 'FAA Form 337: when required, how to complete' },
      { item: '2.2.4', description: 'Return-to-service statements: who can sign, what they mean' },
      { item: '2.2.5', description: 'Work order documentation: shop practices, customer records' },
      { item: '2.2.6', description: 'Record retention requirements' },
    ],
    risks: [
      { description: 'Incomplete logbook entries creating legal exposure' },
      { description: 'Missing 337 for major alterations' },
      { description: 'Signing off work you didn\'t perform or supervise' },
      { description: 'Failing to reference approved data in the logbook entry' },
    ],
    tasks: [
      { taskId: '2.4.1', description: 'Write a logbook entry for a transponder inspection per 91.413. Include all required elements.', performanceStandard: 'Entry contains all required elements per 43.9' },
      { taskId: '2.4.2', description: 'Write a logbook entry for a pitot-static test per 91.411. Include all required elements.', performanceStandard: 'Entry contains all required elements per 43.9' },
      { taskId: '2.4.3', description: 'Given a completed avionics installation, write the maintenance record entry including reference to approved data.', performanceStandard: 'Entry complete; approved data properly referenced' },
      { taskId: '2.4.4', description: 'Complete FAA Form 337 for a major alteration (GPS or autopilot installation). All blocks filled correctly.', performanceStandard: 'Form 337 complete and accurate' },
      { taskId: '2.4.5', description: 'Explain who can sign a return-to-service statement and what that signature means legally.', performanceStandard: 'Correct explanation of authorization and responsibility' },
    ],
  },
  {
    number: 3,
    title: 'Wiring Diagrams and Aircraft Drawings',
    objective: 'Demonstrate the ability to read, interpret, and apply aircraft wiring diagrams and installation drawings to perform avionics maintenance and installation tasks.',
    fundamentals: [
      { item: '3.2.1', description: 'Common drawing symbols used in avionics wiring diagrams' },
      { item: '3.2.2', description: 'Wire identification methods (color codes, wire numbers, labels)' },
      { item: '3.2.3', description: 'Drawing types: block diagrams, schematic diagrams, wiring diagrams, interconnect diagrams' },
      { item: '3.2.4', description: 'How to locate current revision of manufacturer installation manuals' },
      { item: '3.2.5', description: 'Service Bulletin and Service Letter interpretation' },
      { item: '3.2.6', description: 'Wire gauge selection based on current load and length (AC 43.13-1B)' },
      { item: '3.2.7', description: 'Connector pin-out diagrams and how to trace signal paths' },
    ],
    risks: [
      { description: 'Using outdated or superseded installation drawings' },
      { description: 'Misinterpreting wire gauge requirements leading to undersized wire' },
      { description: 'Incorrect connector pin assignments causing system malfunction' },
      { description: 'Failure to verify drawing applies to specific aircraft serial number' },
    ],
    tasks: [
      { taskId: '3.4.1', description: 'Given an avionics wiring diagram, identify: (a) wire types and gauges, (b) connector pin assignments, (c) ground points, (d) circuit breaker locations.', performanceStandard: 'Correctly identify all four elements within 10 minutes' },
      { taskId: '3.4.2', description: 'Given an installation drawing and a physical installation, identify two intentional discrepancies between the drawing and what is installed.', performanceStandard: 'Identify both discrepancies and explain the issue' },
      { taskId: '3.4.3', description: 'Locate the current revision of an installation manual for a specified avionics unit. Verify it applies to a given aircraft.', performanceStandard: 'Correct manual located; applicability verified' },
      { taskId: '3.4.4', description: 'Given a Service Bulletin, determine if it applies to a specific aircraft and identify required parts and estimated labor.', performanceStandard: 'Applicability determined correctly; parts and labor identified' },
    ],
  },
  {
    number: 4,
    title: 'Wire Harness Fabrication and Testing',
    objective: 'Demonstrate the ability to fabricate aircraft wire harnesses to industry standards, perform proper terminations, and verify harness integrity using test equipment.',
    fundamentals: [
      { item: '4.2.1', description: 'Wire types used in GA/BA aircraft: shielded, coaxial, twisted pair' },
      { item: '4.2.2', description: 'Crimp terminal selection and proper crimping technique per AC 43.13-1B' },
      { item: '4.2.3', description: 'Shield termination methods: pigtail and drain wire' },
      { item: '4.2.4', description: 'Coaxial cable connector installation (BNC, TNC, SMA)' },
      { item: '4.2.5', description: 'Wire bundling methods: lacing cord, spiral wrap, and cable ties' },
      { item: '4.2.6', description: 'Heat shrink tubing selection and application' },
      { item: '4.2.7', description: 'Wire labeling requirements' },
      { item: '4.2.8', description: 'Multimeter use: continuity, resistance, and voltage checks' },
      { item: '4.2.9', description: 'Megohmmeter use: insulation resistance testing and safety precautions' },
    ],
    risks: [
      { description: 'Incorrect crimp die or terminal selection for wire gauge' },
      { description: 'Over-stripping insulation leaving exposed conductor behind terminal' },
      { description: 'Inadequate shield coverage allowing interference' },
      { description: 'Applying megohmmeter voltage to sensitive avionics (remove unit first)' },
      { description: 'Heat shrink not fully recovered (cold spots, gaps)' },
      { description: 'Cable ties over-tightened causing insulation damage' },
    ],
    tasks: [
      { taskId: '4.4.1', description: 'Fabricate a wire harness section including: (a) one shielded wire with drain wire terminated at one end, (b) one standard wire run, (c) one coaxial cable with connector installed.', performanceStandard: 'Harness passes visual inspection per AC 43.13-1B standards' },
      { taskId: '4.4.2', description: 'Demonstrate proper crimp technique: select correct terminal for wire gauge, crimp, perform pull test, and visually inspect for proper bellmouth and insulation grip.', performanceStandard: 'Terminal correctly selected; crimp passes pull test; visually acceptable' },
      { taskId: '4.4.3', description: 'Bundle and secure a wire harness using cable ties. Demonstrate proper tie installation without over-tightening.', performanceStandard: 'Bundle neat; no insulation damage; ties properly trimmed' },
      { taskId: '4.4.4', description: 'Using a multimeter, check continuity of a wire from one connector pin to another. State what reading indicates good continuity.', performanceStandard: 'Correct meter setup; reading obtained; acceptable value stated' },
      { taskId: '4.4.5', description: 'Using a megohmmeter, perform insulation resistance test on a wire. Demonstrate safety precautions before, during, and after test.', performanceStandard: 'Safety steps followed; correct setup; result interpreted' },
      { taskId: '4.4.6', description: 'Given a harness with an inserted fault (open or short), use a multimeter to locate the fault.', performanceStandard: 'Fault correctly located within 10 minutes' },
    ],
  },
  {
    number: 5,
    title: 'Audio Panel and Intercom Systems',
    objective: 'Demonstrate the ability to configure, test, and troubleshoot aircraft audio panels and intercom systems.',
    fundamentals: [
      { item: '5.2.1', description: 'Audio panel functions: transmit selection, receiver selection, intercom' },
      { item: '5.2.2', description: 'Microphone and headset connector types (PJ-055, PJ-068, GA twin plug, LEMO)' },
      { item: '5.2.3', description: 'Intercom modes: isolated, crew, all' },
      { item: '5.2.4', description: 'Marker beacon system: function, antenna location, audio/visual indications' },
      { item: '5.2.5', description: 'Sidetone: what it is and why it matters' },
      { item: '5.2.6', description: 'Emergency/failsafe audio provisions' },
    ],
    risks: [
      { description: 'Transmitting on wrong frequency due to incorrect audio panel setup' },
      { description: 'Missing ATC calls due to receiver not selected' },
      { description: 'Intercom bleed allowing passengers to transmit inadvertently' },
      { description: 'Stuck mic condition blocking frequency' },
    ],
    tasks: [
      { taskId: '5.4.1', description: 'Configure audio panel for: (a) transmit on COM1, (b) receive on COM1 and COM2, (c) intercom in crew-isolated mode. Explain each selection.', performanceStandard: 'Correct configuration; clear explanation' },
      { taskId: '5.4.2', description: 'Identify the audio panel jacks: explain difference between mic and headphone connections and signal flow.', performanceStandard: 'Jacks correctly identified; signal flow explained' },
      { taskId: '5.4.3', description: 'Perform functional check: verify transmit on COM1 using a handheld radio, verify receive on COM2, verify intercom between pilot and copilot positions.', performanceStandard: 'All three verified functional' },
      { taskId: '5.4.4', description: 'Identify the marker beacon antenna location on the aircraft. Explain the three marker types and their indications.', performanceStandard: 'Antenna located; O/M/I markers explained correctly' },
      { taskId: '5.4.5', description: 'Troubleshoot a \'no transmit\' squawk: systematically check audio panel selection, PTT switch, mic connection, and COM radio. Document findings.', performanceStandard: 'Systematic approach; fault isolated or cleared' },
    ],
  },
  {
    number: 6,
    title: 'Navigation Systems',
    objective: 'Demonstrate the ability to configure, verify, and test aircraft navigation systems including VOR, ILS, and GPS receivers.',
    fundamentals: [
      { item: '6.2.1', description: 'VOR operation: radials, TO/FROM indication, CDI deflection, OBS function' },
      { item: '6.2.2', description: 'ILS operation: localizer, glideslope, and how they display on the indicator' },
      { item: '6.2.3', description: 'GPS/GNSS basics: WAAS, LPV approaches, RAIM' },
      { item: '6.2.4', description: 'CDI scaling differences: VOR (±10°), GPS (±1nm enroute, ±0.3nm approach), ILS (more sensitive)' },
      { item: '6.2.5', description: 'Navigation database currency requirements and how to check expiration' },
      { item: '6.2.6', description: 'NAV antenna types and locations: VOR, glideslope, GPS' },
    ],
    risks: [
      { description: 'Flying with expired navigation database' },
      { description: 'Misinterpreting CDI scale (GPS vs VOR)' },
      { description: 'ILS approach with wrong frequency or incorrect course setting' },
      { description: 'GPS position error due to antenna obstruction or failure' },
    ],
    tasks: [
      { taskId: '6.4.1', description: 'Tune a VOR frequency, set the OBS, and interpret the CDI for: (a) on course, (b) left of course, (c) right of course. Explain TO/FROM indication.', performanceStandard: 'Correct tuning; all three interpretations correct; TO/FROM explained' },
      { taskId: '6.4.2', description: 'Tune an ILS frequency and explain: (a) how localizer displays, (b) how glideslope displays, (c) how to identify the ILS by audio.', performanceStandard: 'Correct tuning; localizer/glideslope/ident explained' },
      { taskId: '6.4.3', description: 'On a GPS navigator (GTN, G1000, or similar): check database currency, locate expiration date, and explain what happens if database expires.', performanceStandard: 'Currency verified; expiration found; consequences explained' },
      { taskId: '6.4.4', description: 'Identify the VOR, GPS, and glideslope antenna locations on the aircraft.', performanceStandard: 'All three antennas correctly identified' },
      { taskId: '6.4.5', description: 'Explain WAAS: what it provides, how to verify it\'s working, and what LPV approach capability means.', performanceStandard: 'WAAS function, verification, and LPV explained correctly' },
      { taskId: '6.4.6', description: 'Using ramp test equipment, verify VOR receiver accuracy. Document the radial error and determine if within tolerance (±4° ground check).', performanceStandard: 'Test performed correctly; error documented; tolerance applied' },
    ],
  },
  {
    number: 7,
    title: 'Communication Systems',
    objective: 'Demonstrate the ability to verify and troubleshoot aircraft VHF communication systems including antenna system checks.',
    fundamentals: [
      { item: '7.2.1', description: 'VHF COM frequency range and channel spacing' },
      { item: '7.2.2', description: 'Basic transmitter checks: ability to transmit, audio quality' },
      { item: '7.2.3', description: 'Basic receiver checks: ability to receive, squelch function' },
      { item: '7.2.4', description: 'VSWR: what it indicates about the antenna system' },
      { item: '7.2.5', description: 'COM antenna types and mounting considerations' },
      { item: '7.2.6', description: 'Emergency frequency 121.5 MHz' },
    ],
    risks: [
      { description: 'Transmitting with bad antenna causing poor range or radio damage' },
      { description: 'Poor antenna bonding causing receive noise or weak transmit' },
      { description: 'Stuck mic blocking frequency for other aircraft' },
    ],
    tasks: [
      { taskId: '7.4.1', description: 'Perform COM radio functional check: (a) transmit to handheld or ramp radio, (b) receive a transmission, (c) verify squelch operation.', performanceStandard: 'Transmit/receive verified; squelch demonstrated' },
      { taskId: '7.4.2', description: 'Identify COM antenna locations on the aircraft. Explain why antenna location and bonding matter.', performanceStandard: 'Antennas identified; bonding importance explained' },
      { taskId: '7.4.3', description: 'Measure VSWR of the COM antenna system using a VSWR meter or antenna analyzer. State acceptable VSWR limit.', performanceStandard: 'Correct measurement; limit stated (typically less than 2:1)' },
      { taskId: '7.4.4', description: 'Troubleshoot a \'weak transmit\' or \'poor radio range\' squawk. Check: antenna connections, coax cable, VSWR, transmitter output. Document findings.', performanceStandard: 'Systematic approach; findings documented' },
    ],
  },
  {
    number: 8,
    title: 'Transponder and ADS-B Systems',
    objective: 'Demonstrate the ability to test and verify aircraft transponder and ADS-B systems in accordance with regulatory requirements.',
    fundamentals: [
      { item: '8.2.1', description: 'Transponder modes: A (squawk code), C (altitude), S (24-bit address)' },
      { item: '8.2.2', description: 'ADS-B Out: what data it broadcasts, regulatory requirements (91.225, 91.227)' },
      { item: '8.2.3', description: 'Transponder test requirements: 14 CFR 91.413, 24-month cycle' },
      { item: '8.2.4', description: 'Altitude encoder: what it does, correlation with altimeter' },
      { item: '8.2.5', description: 'Transponder antenna types and diversity systems' },
      { item: '8.2.6', description: 'Emergency squawk codes: 7500, 7600, 7700' },
    ],
    risks: [
      { description: 'ADS-B broadcasting incorrect tail number or position' },
      { description: 'Altitude encoding error exceeding 125-foot tolerance' },
      { description: 'Transponder reply issues causing loss of ATC radar identification' },
      { description: 'Incorrect 24-bit ICAO address configuration' },
    ],
    tasks: [
      { taskId: '8.4.1', description: 'Explain transponder modes A, C, and S. Demonstrate mode selection on installed equipment. State the emergency squawk codes.', performanceStandard: 'Modes explained; selection demonstrated; codes stated' },
      { taskId: '8.4.2', description: 'Identify transponder antenna location(s). For diversity systems, explain how the system works.', performanceStandard: 'Antenna(s) identified; diversity explained if applicable' },
      { taskId: '8.4.3', description: 'Verify altitude encoder output matches altimeter indication within 125 feet. Explain what to do if out of tolerance.', performanceStandard: 'Correlation verified; corrective action explained' },
      { taskId: '8.4.4', description: 'Using approved test equipment, perform transponder test per 14 CFR 91.413: Mode A reply, Mode C altitude, Mode S address.', performanceStandard: 'All modes tested; results documented' },
      { taskId: '8.4.5', description: 'Verify ADS-B Out operation: confirm GPS source, aircraft identification, and squawk code are being broadcast correctly.', performanceStandard: 'ADS-B data elements verified' },
      { taskId: '8.4.6', description: 'Complete a transponder test data form with all required information.', performanceStandard: 'Form complete; all required data present' },
    ],
  },
  {
    number: 9,
    title: 'Pitot-Static Systems',
    objective: 'Demonstrate the ability to test and troubleshoot aircraft pitot-static systems in accordance with regulatory requirements.',
    fundamentals: [
      { item: '9.2.1', description: 'Pitot-static instruments: airspeed indicator, altimeter, vertical speed indicator' },
      { item: '9.2.2', description: 'Pitot system: pitot tube function, pitot heat, drain hole' },
      { item: '9.2.3', description: 'Static system: static ports, alternate static source' },
      { item: '9.2.4', description: 'Altimeter test requirements: 14 CFR 91.411, 24-month cycle' },
      { item: '9.2.5', description: 'Leak testing: static system leak rate limits, pitot system checks' },
      { item: '9.2.6', description: 'Altitude encoder correlation requirements' },
    ],
    risks: [
      { description: 'Applying excessive pressure or vacuum causing instrument damage' },
      { description: 'Static system leak causing altitude errors' },
      { description: 'Blocked pitot tube from insects, covers left on, or ice' },
      { description: 'Pitot heat failure leading to icing in IMC' },
    ],
    tasks: [
      { taskId: '9.4.1', description: 'Connect pitot-static test equipment to the aircraft. Demonstrate proper adapter selection and leak-free connections.', performanceStandard: 'Correct adapters; connections verified leak-free' },
      { taskId: '9.4.2', description: 'Perform static system leak test: apply 1,000 feet, hold, measure leak rate. State the maximum allowable leak rate.', performanceStandard: 'Test performed; leak rate stated (100 ft/min max)' },
      { taskId: '9.4.3', description: 'Perform pitot system check: apply airspeed, verify ASI responds correctly.', performanceStandard: 'ASI responds appropriately to applied pressure' },
      { taskId: '9.4.4', description: 'Check altimeter accuracy at three test altitudes. Document scale error at each point.', performanceStandard: 'Three points tested; errors documented' },
      { taskId: '9.4.5', description: 'Verify altitude encoder correlation with altimeter at three altitudes. State acceptable tolerance.', performanceStandard: 'Correlation verified; ±125 feet tolerance stated' },
      { taskId: '9.4.6', description: 'Perform pitot heat functional check: apply power, verify element heats. Explain how to tell it\'s working.', performanceStandard: 'Heat verified; verification method explained' },
      { taskId: '9.4.7', description: 'Given a \'static system leak\' squawk, describe a systematic approach to isolate the leak location.', performanceStandard: 'Logical troubleshooting approach described' },
      { taskId: '9.4.8', description: 'Complete altimeter/static system test documentation per 14 CFR 91.411 requirements.', performanceStandard: 'Documentation complete with all required elements' },
    ],
  },
  {
    number: 10,
    title: 'Autopilot Systems',
    objective: 'Demonstrate the ability to verify and troubleshoot aircraft autopilot systems for safe operation.',
    fundamentals: [
      { item: '10.2.1', description: 'Basic autopilot architecture: controller, computer, servos' },
      { item: '10.2.2', description: 'Autopilot modes: heading, altitude hold, NAV tracking, approach' },
      { item: '10.2.3', description: 'Servo types and clutch engagement' },
      { item: '10.2.4', description: 'Autopilot disconnect methods: control wheel, panel button, trim interrupt' },
      { item: '10.2.5', description: 'Electric trim: manual trim, autopilot-commanded trim, runaway protection' },
      { item: '10.2.6', description: 'Flight director vs autopilot: how they differ' },
    ],
    risks: [
      { description: 'Autopilot malfunction causing uncommanded pitch or roll' },
      { description: 'Servo clutch failure causing binding or no response' },
      { description: 'Trim runaway leading to loss of control' },
      { description: 'Failure to disengage autopilot when required' },
    ],
    tasks: [
      { taskId: '10.4.1', description: 'Explain the basic autopilot system: identify controller, servos, and how pilot commands reach the control surfaces.', performanceStandard: 'Components identified; signal flow explained' },
      { taskId: '10.4.2', description: 'Demonstrate autopilot preflight check per the aircraft POH or manufacturer procedure.', performanceStandard: 'Preflight completed per procedure' },
      { taskId: '10.4.3', description: 'Test autopilot disconnect: verify control wheel disconnect, panel disconnect button, and verify aural/visual annunciation.', performanceStandard: 'All disconnect methods verified; annunciations confirmed' },
      { taskId: '10.4.4', description: 'Verify electric trim operation: demonstrate manual trim, verify proper direction, check trim indicator.', performanceStandard: 'Trim operates correctly; direction verified; indicator accurate' },
      { taskId: '10.4.5', description: 'Perform autopilot functional check: engage heading mode and altitude hold, verify proper response.', performanceStandard: 'Modes engage properly; aircraft responds correctly' },
      { taskId: '10.4.6', description: 'Explain the difference between flight director and autopilot operation.', performanceStandard: 'FD vs AP difference correctly explained' },
      { taskId: '10.4.7', description: 'Troubleshoot an \'autopilot will not engage\' squawk: describe systematic checks of engagement criteria, sensors, servo power.', performanceStandard: 'Logical troubleshooting approach described' },
    ],
  },
  {
    number: 11,
    title: 'Compass Systems',
    objective: 'Demonstrate the ability to verify and calibrate aircraft magnetic compass systems.',
    fundamentals: [
      { item: '11.2.1', description: 'Magnetic compass construction and limitations' },
      { item: '11.2.2', description: 'Compass errors: variation, deviation, acceleration errors, turning errors' },
      { item: '11.2.3', description: 'Slaved compass systems: flux valve, slaving amplifier, HSI' },
      { item: '11.2.4', description: 'Compass swing procedures and when required' },
      { item: '11.2.5', description: 'Deviation card requirements' },
      { item: '11.2.6', description: 'Free gyro vs slaved gyro operation' },
    ],
    risks: [
      { description: 'Compass deviation exceeding limits after avionics installation' },
      { description: 'Swinging compass with magnetic items (tools, equipment) in cockpit' },
      { description: 'Flux valve location too close to magnetic interference sources' },
      { description: 'Failure to update deviation card after changes to aircraft' },
    ],
    tasks: [
      { taskId: '11.4.1', description: 'Inspect magnetic compass: check fluid level, card freedom, lighting. Compare indication to known heading.', performanceStandard: 'Inspection complete; discrepancies noted' },
      { taskId: '11.4.2', description: 'State when a compass swing is required (new radio near compass, engine replacement, aircraft damage repair, etc.).', performanceStandard: 'Triggers for compass swing correctly stated' },
      { taskId: '11.4.3', description: 'Describe compass swing procedure: positioning on compass rose, recording headings, calculating deviation.', performanceStandard: 'Procedure accurately described' },
      { taskId: '11.4.4', description: 'Create or verify a compass deviation card: correct format, values within 10° limit, properly installed.', performanceStandard: 'Card correct format; values within limits; installed properly' },
      { taskId: '11.4.5', description: 'For aircraft with slaved compass: explain how the flux valve, slaving amplifier, and HSI work together.', performanceStandard: 'Slaved system operation correctly explained' },
      { taskId: '11.4.6', description: 'Assist in performing a compass swing. Record data at cardinal and intercardinal headings.', performanceStandard: 'Data recorded accurately at all required headings' },
    ],
  },
  {
    number: 12,
    title: 'Electronic Flight Bags and Connectivity',
    objective: 'Demonstrate the ability to verify Electronic Flight Bag installations and basic aircraft connectivity systems.',
    fundamentals: [
      { item: '12.2.1', description: 'EFB classes and what distinguishes installed vs portable' },
      { item: '12.2.2', description: 'EFB mounting requirements: security, visibility, accessibility' },
      { item: '12.2.3', description: 'EFB power: aircraft power connection vs battery operation' },
      { item: '12.2.4', description: 'EFB data interface: GPS, AHRS, traffic, weather (where installed)' },
      { item: '12.2.5', description: 'Basic WiFi systems: router location, passenger vs cockpit network separation' },
      { item: '12.2.6', description: 'ADS-B In receivers: traffic and weather display' },
    ],
    risks: [
      { description: 'EFB mount failure causing loose equipment in cockpit' },
      { description: 'EFB blocking critical flight controls or instruments' },
      { description: 'WiFi interference with avionics (rare but possible)' },
      { description: 'Reliance on uncertified EFB data for primary navigation' },
    ],
    tasks: [
      { taskId: '12.4.1', description: 'Verify EFB mounting: check mount security, verify it doesn\'t block controls or instruments, confirm pilot can reach disconnect.', performanceStandard: 'Mount secure; no obstruction; disconnect accessible' },
      { taskId: '12.4.2', description: 'Verify EFB power connection (if installed): check wiring, circuit breaker, power indication.', performanceStandard: 'Power connection verified; CB identified' },
      { taskId: '12.4.3', description: 'Verify EFB receives data from installed sources: GPS position, traffic (if equipped), weather (if equipped).', performanceStandard: 'Data reception verified for installed sources' },
      { taskId: '12.4.4', description: 'For aircraft with WiFi: identify router/access point location, verify system powers up, explain network separation if applicable.', performanceStandard: 'Components identified; power verified; separation explained' },
      { taskId: '12.4.5', description: 'Verify portable ADS-B In receiver operation: traffic display, weather display (if equipped), GPS status.', performanceStandard: 'Receiver functions verified' },
      { taskId: '12.4.6', description: 'Troubleshoot \'no data to EFB\' squawk: check data source, connections, EFB settings.', performanceStandard: 'Systematic troubleshooting approach; fault isolated' },
    ],
  },
  {
    number: 13,
    title: 'Flight Management Systems',
    objective: 'Demonstrate the ability to operate, configure, and maintain Flight Management Systems at the level common in GA/BA aircraft.',
    fundamentals: [
      { item: '13.2.1', description: 'FMS/GPS navigator architecture: display unit, GPS receiver, antennas' },
      { item: '13.2.2', description: 'Navigation database: AIRAC cycle, expiration, update process' },
      { item: '13.2.3', description: 'Basic flight plan entry: direct-to, flight plan waypoints, airways' },
      { item: '13.2.4', description: 'Procedures: selecting SID, STAR, and approach' },
      { item: '13.2.5', description: 'FMS-to-autopilot interface: LNAV, VNAV (where equipped), GPS steering' },
      { item: '13.2.6', description: 'FMS messages and alerts: discontinuities, RAIM warnings, terrain alerts' },
    ],
    risks: [
      { description: 'Flying with expired navigation database' },
      { description: 'Incorrect flight plan entry causing navigation errors' },
      { description: 'Not addressing route discontinuities before flight' },
      { description: 'Database update failure corrupting navigation data' },
    ],
    tasks: [
      { taskId: '13.4.1', description: 'Check navigation database currency on a GTN, G1000, or similar unit. Locate current cycle and expiration date.', performanceStandard: 'Database currency verified; dates located' },
      { taskId: '13.4.2', description: 'Perform a navigation database update using Garmin, Jeppesen, or equivalent data card/WiFi method.', performanceStandard: 'Update completed successfully; new cycle verified' },
      { taskId: '13.4.3', description: 'Enter a basic flight plan: origin, destination, one intermediate waypoint. Verify route displays correctly.', performanceStandard: 'Flight plan entered; route displayed correctly' },
      { taskId: '13.4.4', description: 'Select a departure procedure (SID or ODP) and an arrival procedure (STAR) in the flight plan.', performanceStandard: 'Procedures correctly selected and loaded' },
      { taskId: '13.4.5', description: 'Load an approach procedure for the destination. Activate the approach and vectors-to-final.', performanceStandard: 'Approach loaded and activated correctly' },
      { taskId: '13.4.6', description: 'Explain what a route discontinuity is and how to resolve it.', performanceStandard: 'Discontinuity concept explained; resolution method described' },
      { taskId: '13.4.7', description: 'Verify FMS output to autopilot: engage GPS/NAV mode, confirm autopilot follows FMS steering.', performanceStandard: 'Autopilot follows FMS lateral guidance' },
      { taskId: '13.4.8', description: 'Troubleshoot a \'database error\' or \'database not found\' message.', performanceStandard: 'Troubleshooting steps described; resolution identified' },
    ],
  },
]

export const TOTAL_TASKS = PQS_SECTIONS.reduce((sum, s) => sum + s.tasks.length, 0) // 75
