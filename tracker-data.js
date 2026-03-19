/* ============================================================
   CAET Part 145 LMS — Data, Quizzes, Training Modules, State
   ============================================================ */

/* ---------- PQS SECTIONS (75 Tasks, 13 Sections) ---------- */
const PQS = [
    {
        num: 1, title: 'Regulatory Compliance and Approved Data', objective: 'Demonstrate understanding of the regulatory framework for avionics maintenance and the ability to identify and use approved data.',
        fundamentals: [{ n: '1.2.1', t: '14 CFR Part 43: Who can perform maintenance, what requires approval' }, { n: '1.2.2', t: '14 CFR Part 91.403: Owner/operator maintenance responsibility' }, { n: '1.2.3', t: 'Approved data: manufacturer data, STCs, AC 43.13-1B, field approvals' }, { n: '1.2.4', t: 'When an STC is required vs. when AC 43.13-1B authority applies' }, { n: '1.2.5', t: 'Part 145 repair station privileges and limitations' }, { n: '1.2.6', t: 'Airworthiness Directives: how to check, compliance requirements' }],
        risks: ['Performing work without proper approved data', 'Assuming AC 43.13-1B covers everything', 'Missing applicable ADs during installation', 'Working outside the scope of your authorization'],
        tasks: [{ id: '1.4.1', d: 'Determine what approved data is required for an avionics installation scenario', s: 'Correct determination with explanation' }, { id: '1.4.2', d: 'Look up whether any ADs apply to a specified avionics unit', s: 'AD search completed correctly; results documented' }, { id: '1.4.3', d: 'Explain the difference between a major and minor alteration with examples', s: 'Distinction explained correctly with relevant examples' }, { id: '1.4.4', d: 'Identify approvals/documentation required to install a GPS navigator', s: 'Correct identification of STC/approval requirements' }]
    },
    {
        num: 2, title: 'Maintenance Documentation', objective: 'Properly document avionics maintenance, inspections, and installations per regulatory requirements.',
        fundamentals: [{ n: '2.2.1', t: 'Logbook entry requirements per 14 CFR 43.9 and 43.11' }, { n: '2.2.2', t: 'What must be included in a maintenance record entry' }, { n: '2.2.3', t: 'FAA Form 337: when required, how to complete' }, { n: '2.2.4', t: 'Return-to-service statements: who can sign, what they mean' }, { n: '2.2.5', t: 'Work order documentation: shop practices, customer records' }, { n: '2.2.6', t: 'Record retention requirements' }],
        risks: ['Incomplete logbook entries creating legal exposure', 'Missing 337 for major alterations', 'Signing off work you didn\'t perform or supervise', 'Failing to reference approved data in logbook entries'],
        tasks: [{ id: '2.4.1', d: 'Write a logbook entry for a transponder inspection per 91.413', s: 'Entry contains all required elements per 43.9' }, { id: '2.4.2', d: 'Write a logbook entry for a pitot-static test per 91.411', s: 'Entry contains all required elements per 43.9' }, { id: '2.4.3', d: 'Write maintenance record entry for completed avionics installation', s: 'Entry complete; approved data properly referenced' }, { id: '2.4.4', d: 'Complete FAA Form 337 for a major alteration (GPS or autopilot)', s: 'Form 337 complete and accurate' }, { id: '2.4.5', d: 'Explain who can sign a return-to-service statement and legal meaning', s: 'Correct explanation of authorization and responsibility' }]
    },
    {
        num: 3, title: 'Wiring Diagrams and Aircraft Drawings', objective: 'Read, interpret, and apply aircraft wiring diagrams and installation drawings.',
        fundamentals: [{ n: '3.2.1', t: 'Common drawing symbols used in avionics wiring diagrams' }, { n: '3.2.2', t: 'Wire identification methods (color codes, wire numbers, labels)' }, { n: '3.2.3', t: 'Drawing types: block, schematic, wiring, interconnect diagrams' }, { n: '3.2.4', t: 'How to locate current revision of manufacturer installation manuals' }, { n: '3.2.5', t: 'Service Bulletin and Service Letter interpretation' }, { n: '3.2.6', t: 'Wire gauge selection based on current load and length (AC 43.13-1B)' }, { n: '3.2.7', t: 'Connector pin-out diagrams and how to trace signal paths' }],
        risks: ['Using outdated or superseded installation drawings', 'Misinterpreting wire gauge requirements', 'Incorrect connector pin assignments', 'Failure to verify drawing applies to specific aircraft S/N'],
        tasks: [{ id: '3.4.1', d: 'Identify wire types/gauges, connector pins, grounds, and CBs from wiring diagram', s: 'Correctly identify all four elements within 10 minutes' }, { id: '3.4.2', d: 'Identify two intentional discrepancies between drawing and installation', s: 'Identify both discrepancies and explain the issue' }, { id: '3.4.3', d: 'Locate current revision of installation manual for a specified unit', s: 'Correct manual located; applicability verified' }, { id: '3.4.4', d: 'Determine Service Bulletin applicability, required parts and labor', s: 'Applicability determined correctly' }]
    },
    {
        num: 4, title: 'Wire Harness Fabrication and Testing', objective: 'Fabricate aircraft wire harnesses to industry standards, perform proper terminations, and verify integrity.',
        fundamentals: [{ n: '4.2.1', t: 'Wire types: shielded, coaxial, twisted pair' }, { n: '4.2.2', t: 'Crimp terminal selection and proper crimping per AC 43.13-1B' }, { n: '4.2.3', t: 'Shield termination methods: pigtail and drain wire' }, { n: '4.2.4', t: 'Coaxial cable connector installation (BNC, TNC, SMA)' }, { n: '4.2.5', t: 'Wire bundling: lacing cord, spiral wrap, cable ties' }, { n: '4.2.6', t: 'Heat shrink tubing selection and application' }, { n: '4.2.7', t: 'Wire labeling requirements' }, { n: '4.2.8', t: 'Multimeter use: continuity, resistance, and voltage checks' }, { n: '4.2.9', t: 'Megohmmeter use: insulation resistance testing and safety' }],
        risks: ['Incorrect crimp die or terminal selection', 'Over-stripping insulation', 'Inadequate shield coverage', 'Applying megohmmeter to sensitive avionics', 'Heat shrink not fully recovered', 'Cable ties over-tightened'],
        tasks: [{ id: '4.4.1', d: 'Fabricate wire harness: shielded wire, standard run, coaxial cable', s: 'Passes visual inspection per AC 43.13-1B' }, { id: '4.4.2', d: 'Demonstrate proper crimp technique with pull test and visual inspection', s: 'Terminal correct; crimp passes pull test' }, { id: '4.4.3', d: 'Bundle and secure wire harness with cable ties without over-tightening', s: 'Bundle neat; no insulation damage' }, { id: '4.4.4', d: 'Check continuity with multimeter pin-to-pin', s: 'Correct meter setup; acceptable value stated' }, { id: '4.4.5', d: 'Perform insulation resistance test with megohmmeter safely', s: 'Safety steps followed; result interpreted' }, { id: '4.4.6', d: 'Locate fault (open or short) in harness using multimeter', s: 'Fault correctly located within 10 minutes' }]
    },
    {
        num: 5, title: 'Audio Panel and Intercom Systems', objective: 'Configure, test, and troubleshoot aircraft audio panels and intercom systems.',
        fundamentals: [{ n: '5.2.1', t: 'Audio panel functions: transmit selection, receiver selection, intercom' }, { n: '5.2.2', t: 'Microphone and headset connector types (PJ-055, PJ-068, GA twin plug, LEMO)' }, { n: '5.2.3', t: 'Intercom modes: isolated, crew, all' }, { n: '5.2.4', t: 'Marker beacon system: function, antenna location, audio/visual indications' }, { n: '5.2.5', t: 'Sidetone: what it is and why it matters' }, { n: '5.2.6', t: 'Emergency/failsafe audio provisions' }],
        risks: ['Transmitting on wrong frequency', 'Missing ATC calls due to receiver not selected', 'Intercom bleed allowing inadvertent transmit', 'Stuck mic blocking frequency'],
        tasks: [{ id: '5.4.1', d: 'Configure audio panel: COM1 TX, COM1+COM2 RX, crew-isolated intercom', s: 'Correct configuration; clear explanation' }, { id: '5.4.2', d: 'Identify audio panel jacks and explain signal flow', s: 'Jacks correctly identified; signal flow explained' }, { id: '5.4.3', d: 'Functional check: TX on COM1, RX on COM2, intercom pilot-copilot', s: 'All three verified functional' }, { id: '5.4.4', d: 'Identify marker beacon antenna; explain O/M/I markers', s: 'Antenna located; markers explained correctly' }, { id: '5.4.5', d: 'Troubleshoot "no transmit" squawk systematically', s: 'Systematic approach; fault isolated or cleared' }]
    },
    {
        num: 6, title: 'Navigation Systems', objective: 'Configure, verify, and test VOR, ILS, and GPS navigation systems.',
        fundamentals: [{ n: '6.2.1', t: 'VOR operation: radials, TO/FROM, CDI deflection, OBS function' }, { n: '6.2.2', t: 'ILS operation: localizer, glideslope, display interpretation' }, { n: '6.2.3', t: 'GPS/GNSS basics: WAAS, LPV approaches, RAIM' }, { n: '6.2.4', t: 'CDI scaling differences: VOR (±10°), GPS (±1nm/±0.3nm), ILS' }, { n: '6.2.5', t: 'Navigation database currency requirements and expiration' }, { n: '6.2.6', t: 'NAV antenna types and locations: VOR, glideslope, GPS' }],
        risks: ['Flying with expired nav database', 'Misinterpreting CDI scale', 'ILS approach with wrong frequency/course', 'GPS position error from antenna issues'],
        tasks: [{ id: '6.4.1', d: 'Tune VOR, set OBS, interpret CDI for on/left/right of course', s: 'Correct tuning; all interpretations correct' }, { id: '6.4.2', d: 'Tune ILS frequency, explain localizer/glideslope/ident', s: 'Correct tuning; all three explained' }, { id: '6.4.3', d: 'Check GPS database currency and expiration date', s: 'Currency verified; expiration found' }, { id: '6.4.4', d: 'Identify VOR, GPS, and glideslope antenna locations', s: 'All three antennas correctly identified' }, { id: '6.4.5', d: 'Explain WAAS function, verification, and LPV capability', s: 'WAAS function and LPV explained correctly' }, { id: '6.4.6', d: 'Verify VOR receiver accuracy with ramp test equipment', s: 'Test performed; error documented; tolerance applied' }]
    },
    {
        num: 7, title: 'Communication Systems', objective: 'Verify and troubleshoot VHF communication systems including antenna checks.',
        fundamentals: [{ n: '7.2.1', t: 'VHF COM frequency range and channel spacing' }, { n: '7.2.2', t: 'Basic transmitter checks: ability to transmit, audio quality' }, { n: '7.2.3', t: 'Basic receiver checks: ability to receive, squelch function' }, { n: '7.2.4', t: 'VSWR: what it indicates about the antenna system' }, { n: '7.2.5', t: 'COM antenna types and mounting considerations' }, { n: '7.2.6', t: 'Emergency frequency 121.5 MHz' }],
        risks: ['Transmitting with bad antenna', 'Poor antenna bonding', 'Stuck mic blocking frequency'],
        tasks: [{ id: '7.4.1', d: 'COM radio functional check: TX, RX, squelch operation', s: 'Transmit/receive verified; squelch demonstrated' }, { id: '7.4.2', d: 'Identify COM antenna locations; explain bonding importance', s: 'Antennas identified; bonding explained' }, { id: '7.4.3', d: 'Measure VSWR of COM antenna system', s: 'Correct measurement; limit stated (<2:1)' }, { id: '7.4.4', d: 'Troubleshoot weak transmit / poor radio range squawk', s: 'Systematic approach; findings documented' }]
    },
    {
        num: 8, title: 'Transponder and ADS-B Systems', objective: 'Test and verify transponder and ADS-B systems per regulatory requirements.',
        fundamentals: [{ n: '8.2.1', t: 'Transponder modes: A (squawk), C (altitude), S (24-bit address)' }, { n: '8.2.2', t: 'ADS-B Out: data broadcast, requirements (91.225, 91.227)' }, { n: '8.2.3', t: 'Transponder test requirements: 14 CFR 91.413, 24-month cycle' }, { n: '8.2.4', t: 'Altitude encoder: function, altimeter correlation' }, { n: '8.2.5', t: 'Transponder antenna types and diversity systems' }, { n: '8.2.6', t: 'Emergency squawk codes: 7500, 7600, 7700' }],
        risks: ['ADS-B broadcasting incorrect data', 'Altitude encoding error >125ft', 'Transponder reply issues', 'Incorrect ICAO address configuration'],
        tasks: [{ id: '8.4.1', d: 'Explain transponder modes A/C/S; demonstrate selection; state emergency codes', s: 'Modes explained; selection demonstrated; codes stated' }, { id: '8.4.2', d: 'Identify transponder antenna(s); explain diversity if applicable', s: 'Antenna(s) identified; diversity explained' }, { id: '8.4.3', d: 'Verify altitude encoder matches altimeter within 125 feet', s: 'Correlation verified; corrective action explained' }, { id: '8.4.4', d: 'Perform transponder test per 91.413 with approved test equipment', s: 'All modes tested; results documented' }, { id: '8.4.5', d: 'Verify ADS-B Out: GPS source, aircraft ID, squawk code broadcast', s: 'ADS-B data elements verified' }, { id: '8.4.6', d: 'Complete transponder test data form', s: 'Form complete; all required data present' }]
    },
    {
        num: 9, title: 'Pitot-Static Systems', objective: 'Test and troubleshoot pitot-static systems per regulatory requirements.',
        fundamentals: [{ n: '9.2.1', t: 'Pitot-static instruments: ASI, altimeter, VSI' }, { n: '9.2.2', t: 'Pitot system: pitot tube function, pitot heat, drain hole' }, { n: '9.2.3', t: 'Static system: static ports, alternate static source' }, { n: '9.2.4', t: 'Altimeter test requirements: 14 CFR 91.411, 24-month cycle' }, { n: '9.2.5', t: 'Leak testing: static system leak rate limits, pitot checks' }, { n: '9.2.6', t: 'Altitude encoder correlation requirements' }],
        risks: ['Excessive pressure/vacuum causing instrument damage', 'Static system leak causing altitude errors', 'Blocked pitot tube', 'Pitot heat failure in IMC'],
        tasks: [{ id: '9.4.1', d: 'Connect pitot-static test equipment with proper adapters', s: 'Correct adapters; connections verified leak-free' }, { id: '9.4.2', d: 'Perform static system leak test at 1,000ft; state max leak rate', s: 'Test performed; leak rate stated (100 ft/min max)' }, { id: '9.4.3', d: 'Pitot system check: apply airspeed, verify ASI responds', s: 'ASI responds appropriately' }, { id: '9.4.4', d: 'Check altimeter accuracy at three test altitudes', s: 'Three points tested; errors documented' }, { id: '9.4.5', d: 'Verify altitude encoder correlation at three altitudes', s: 'Correlation verified; ±125 feet tolerance stated' }, { id: '9.4.6', d: 'Perform pitot heat functional check', s: 'Heat verified; verification method explained' }, { id: '9.4.7', d: 'Describe systematic approach to isolate a static system leak', s: 'Logical troubleshooting approach' }, { id: '9.4.8', d: 'Complete altimeter/static test documentation per 91.411', s: 'Documentation complete with all required elements' }]
    },
    {
        num: 10, title: 'Autopilot Systems', objective: 'Verify and troubleshoot aircraft autopilot systems for safe operation.',
        fundamentals: [{ n: '10.2.1', t: 'Basic autopilot architecture: controller, computer, servos' }, { n: '10.2.2', t: 'Autopilot modes: heading, altitude hold, NAV tracking, approach' }, { n: '10.2.3', t: 'Servo types and clutch engagement' }, { n: '10.2.4', t: 'Disconnect methods: control wheel, panel button, trim interrupt' }, { n: '10.2.5', t: 'Electric trim: manual, autopilot-commanded, runaway protection' }, { n: '10.2.6', t: 'Flight director vs autopilot: how they differ' }],
        risks: ['Uncommanded pitch or roll', 'Servo clutch failure', 'Trim runaway leading to loss of control', 'Failure to disengage when required'],
        tasks: [{ id: '10.4.1', d: 'Explain basic autopilot system: controller, servos, signal flow', s: 'Components identified; signal flow explained' }, { id: '10.4.2', d: 'Demonstrate autopilot preflight check per POH/manufacturer procedure', s: 'Preflight completed per procedure' }, { id: '10.4.3', d: 'Test autopilot disconnect methods; verify annunciations', s: 'All disconnect methods verified' }, { id: '10.4.4', d: 'Verify electric trim operation: direction, indicator', s: 'Trim operates correctly; direction verified' }, { id: '10.4.5', d: 'Autopilot functional check: heading mode and altitude hold', s: 'Modes engage properly; aircraft responds correctly' }, { id: '10.4.6', d: 'Explain the difference between flight director and autopilot', s: 'FD vs AP difference correctly explained' }, { id: '10.4.7', d: 'Troubleshoot "autopilot will not engage" squawk', s: 'Logical troubleshooting approach described' }]
    },
    {
        num: 11, title: 'Compass Systems', objective: 'Verify and calibrate aircraft magnetic compass systems.',
        fundamentals: [{ n: '11.2.1', t: 'Magnetic compass construction and limitations' }, { n: '11.2.2', t: 'Compass errors: variation, deviation, acceleration, turning' }, { n: '11.2.3', t: 'Slaved compass systems: flux valve, slaving amplifier, HSI' }, { n: '11.2.4', t: 'Compass swing procedures and when required' }, { n: '11.2.5', t: 'Deviation card requirements' }, { n: '11.2.6', t: 'Free gyro vs slaved gyro operation' }],
        risks: ['Deviation exceeding limits after avionics install', 'Swinging compass with magnetic items in cockpit', 'Flux valve near interference sources', 'Failure to update deviation card'],
        tasks: [{ id: '11.4.1', d: 'Inspect magnetic compass: fluid, card freedom, lighting', s: 'Inspection complete; discrepancies noted' }, { id: '11.4.2', d: 'State when a compass swing is required', s: 'Triggers for compass swing correctly stated' }, { id: '11.4.3', d: 'Describe compass swing procedure', s: 'Procedure accurately described' }, { id: '11.4.4', d: 'Create or verify compass deviation card', s: 'Card correct format; values within limits' }, { id: '11.4.5', d: 'Explain slaved compass system operation', s: 'Slaved system operation correctly explained' }, { id: '11.4.6', d: 'Assist in compass swing; record data at all headings', s: 'Data recorded accurately' }]
    },
    {
        num: 12, title: 'Electronic Flight Bags and Connectivity', objective: 'Verify EFB installations and basic aircraft connectivity systems.',
        fundamentals: [{ n: '12.2.1', t: 'EFB classes: installed vs portable' }, { n: '12.2.2', t: 'EFB mounting requirements: security, visibility, accessibility' }, { n: '12.2.3', t: 'EFB power: aircraft power connection vs battery operation' }, { n: '12.2.4', t: 'EFB data interface: GPS, AHRS, traffic, weather' }, { n: '12.2.5', t: 'Basic WiFi systems: router location, network separation' }, { n: '12.2.6', t: 'ADS-B In receivers: traffic and weather display' }],
        risks: ['EFB mount failure', 'EFB blocking flight controls/instruments', 'WiFi interference with avionics', 'Reliance on uncertified EFB data for primary nav'],
        tasks: [{ id: '12.4.1', d: 'Verify EFB mounting security; no control obstruction', s: 'Mount secure; no obstruction; disconnect accessible' }, { id: '12.4.2', d: 'Verify EFB power connection and circuit breaker identification', s: 'Power connection verified; CB identified' }, { id: '12.4.3', d: 'Verify EFB receives GPS, traffic, weather data from installed sources', s: 'Data reception verified' }, { id: '12.4.4', d: 'Identify WiFi router/AP location; verify power and network separation', s: 'Components identified; power verified' }, { id: '12.4.5', d: 'Verify portable ADS-B In receiver operation', s: 'Receiver functions verified' }, { id: '12.4.6', d: 'Troubleshoot "no data to EFB" squawk', s: 'Systematic troubleshooting; fault isolated' }]
    },
    {
        num: 13, title: 'Flight Management Systems', objective: 'Operate, configure, and maintain Flight Management Systems for GA/BA aircraft.',
        fundamentals: [{ n: '13.2.1', t: 'FMS/GPS navigator architecture: display unit, GPS receiver, antennas' }, { n: '13.2.2', t: 'Navigation database: AIRAC cycle, expiration, update process' }, { n: '13.2.3', t: 'Basic flight plan entry: direct-to, waypoints, airways' }, { n: '13.2.4', t: 'Procedures: selecting SID, STAR, and approach' }, { n: '13.2.5', t: 'FMS-to-autopilot interface: LNAV, VNAV, GPS steering' }, { n: '13.2.6', t: 'FMS messages: discontinuities, RAIM warnings, terrain alerts' }],
        risks: ['Flying with expired nav database', 'Incorrect flight plan entry', 'Not addressing route discontinuities', 'Database update failure corrupting nav data'],
        tasks: [{ id: '13.4.1', d: 'Check nav database currency on GTN/G1000/similar; locate expiration', s: 'Database currency verified; dates located' }, { id: '13.4.2', d: 'Perform navigation database update', s: 'Update completed successfully; new cycle verified' }, { id: '13.4.3', d: 'Enter basic flight plan: origin, destination, one waypoint', s: 'Flight plan entered; route displayed correctly' }, { id: '13.4.4', d: 'Select departure procedure (SID/ODP) and arrival (STAR)', s: 'Procedures correctly selected and loaded' }, { id: '13.4.5', d: 'Load approach procedure; activate vectors-to-final', s: 'Approach loaded and activated correctly' }, { id: '13.4.6', d: 'Explain route discontinuity and how to resolve it', s: 'Discontinuity concept explained; resolution described' }, { id: '13.4.7', d: 'Verify FMS output to autopilot: engage GPS/NAV mode', s: 'Autopilot follows FMS lateral guidance' }, { id: '13.4.8', d: 'Troubleshoot "database error" or "database not found" message', s: 'Troubleshooting steps described; resolution identified' }]
    }
];
const TOTAL_TASKS = PQS.reduce((s, sec) => s + sec.tasks.length, 0);

/* ---------- APPRENTICESHIP OJT SECTIONS (Gap Competencies) ---------- */
const OJT = [
    {
        num: 'A1', title: 'Aircraft Structures', objective: 'Demonstrate basic competency in aircraft structural work under supervision.',
        targetHours: 80,
        fundamentals: [{ n: 'A1.1', t: 'Basic sheet metal identification and practices' }, { n: 'A1.2', t: 'Rivet types and selection per AC 43.13-1B' }, { n: 'A1.3', t: 'Composite repair awareness and safety' }, { n: 'A1.4', t: 'Structural hardware identification (AN, MS, NAS)' }],
        risks: ['Using incorrect rivet type or size', 'Composite dust inhalation without PPE', 'Over-drilling or elongating holes', 'Missing corrosion under sealant'],
        tasks: [{ id: 'A1.1', d: 'Identify common aircraft structural hardware (AN bolts, rivets, screws)', s: 'Correct identification of 5+ hardware types' }, { id: 'A1.2', d: 'Perform basic sheet metal drilling and deburring', s: 'Holes clean; no elongation; proper deburring' }, { id: 'A1.3', d: 'Assist with or perform a simple structural repair per approved data', s: 'Repair completed per procedure; inspected by supervisor' }, { id: 'A1.4', d: 'Identify signs of corrosion and describe treatment options', s: 'Corrosion types identified; treatment options stated' }, { id: 'A1.5', d: 'Demonstrate proper use of safety wire and cotter pins', s: 'Safety wire technique correct per AC 43.13-1B' }]
    },
    {
        num: 'A2', title: 'Ground Operations', objective: 'Safely perform aircraft ground handling, servicing, and ramp operations.',
        targetHours: 20,
        fundamentals: [{ n: 'A2.1', t: 'Aircraft marshaling signals' }, { n: 'A2.2', t: 'Tie-down procedures and wind considerations' }, { n: 'A2.3', t: 'Ground support equipment (GPU, tugs, jacks)' }, { n: 'A2.4', t: 'Ramp safety and FOD prevention' }],
        risks: ['Prop/jet blast injuries', 'Unsecured aircraft in high winds', 'FOD damage to engines or control surfaces', 'Improper jacking leading to aircraft damage'],
        tasks: [{ id: 'A2.1', d: 'Demonstrate proper aircraft tie-down procedure', s: 'Tie-down secure; correct knots and anchor points' }, { id: 'A2.2', d: 'Perform FOD walk and explain prevention procedures', s: 'FOD check thorough; prevention procedures explained' }, { id: 'A2.3', d: 'Operate GPU: connect, start, verify voltage, disconnect', s: 'Correct voltage verified; proper connect/disconnect sequence' }, { id: 'A2.4', d: 'Demonstrate aircraft marshaling hand signals', s: 'Signals correct and clearly demonstrated' }, { id: 'A2.5', d: 'Safely tow/move aircraft using approved equipment', s: 'Tow completed safely with wing walkers and proper procedures' }]
    },
    {
        num: 'A3', title: 'Leadership and Quality Assurance', objective: 'Understand shop quality systems, mentoring responsibilities, and professional development.',
        targetHours: 90,
        fundamentals: [{ n: 'A3.1', t: 'Quality system manual: purpose and key sections' }, { n: 'A3.2', t: 'Inspection procedures: required, recommended, buy-back' }, { n: 'A3.3', t: 'Human factors in maintenance: dirty dozen' }, { n: 'A3.4', t: 'Mentoring and knowledge transfer practices' }, { n: 'A3.5', t: 'Professional ethics and integrity in maintenance' }],
        risks: ['Signing off work not personally verified', 'Normalization of deviance', 'Failure to report errors or near-misses', 'Pressure to rush work compromising quality'],
        tasks: [{ id: 'A3.1', d: 'Explain the shop quality system manual and your role within it', s: 'Key sections identified; quality responsibilities stated' }, { id: 'A3.2', d: 'Describe the Dirty Dozen human factors and give examples from avionics', s: 'At least 6 factors named with relevant examples' }, { id: 'A3.3', d: 'Write an incident/near-miss report for a shop scenario', s: 'Report complete with root cause and corrective action' }, { id: 'A3.4', d: 'Mentor a junior technician through a supervised task', s: 'Clear instruction; patience demonstrated; safety emphasized' }, { id: 'A3.5', d: 'Explain the importance of accurate maintenance records and legal implications', s: 'Legal requirements and personal liability correctly stated' }]
    },
    {
        num: 'A4', title: 'Engine Systems Integration', objective: 'Understand basic powerplant interfaces relevant to avionics work.',
        targetHours: 26,
        fundamentals: [{ n: 'A4.1', t: 'Engine instrument systems: EGT, CHT, oil pressure/temp, fuel flow' }, { n: 'A4.2', t: 'Engine data bus interfaces (serial, ARINC 429)' }, { n: 'A4.3', t: 'FADEC systems overview and avionics interaction' }, { n: 'A4.4', t: 'Propeller synchrophaser and governor interfaces' }],
        risks: ['Disconnecting engine sensors without proper lockout', 'Incorrect wiring causing false engine indications', 'Hot exhaust and rotating propeller hazards', 'FADEC power interruption'],
        tasks: [{ id: 'A4.1', d: 'Identify engine instruments and their sensor locations', s: 'Instruments and sensors correctly identified' }, { id: 'A4.2', d: 'Trace an engine instrument signal from sensor to display', s: 'Signal path correctly traced; connectors identified' }, { id: 'A4.3', d: 'Explain avionics-to-engine data bus interface (ARINC 429 or serial)', s: 'Interface explained; data parameters identified' }, { id: 'A4.4', d: 'Perform engine instrument functional check during ground run', s: 'Indications verified; discrepancies documented' }, { id: 'A4.5', d: 'Describe safety precautions when working near engine systems', s: 'Lockout/tagout and hot engine procedures stated' }]
    }
];
const TOTAL_OJT_TASKS = OJT.reduce((s, sec) => s + sec.tasks.length, 0);


/* ---------- QUIZ QUESTIONS PER SECTION (from fundamentals/risks) ---------- */
const QUIZZES = {
    1: [
        { q: 'According to 14 CFR Part 43, who is authorized to perform maintenance on aircraft?', opts: ['Any pilot with a valid certificate', 'Certified mechanics, repairmen, and Part 145 repair stations', 'Only the aircraft manufacturer', 'Anyone supervised by a mechanic'], a: 1 },
        { q: 'When is an STC required instead of AC 43.13-1B authority?', opts: ['For any electrical work', 'For major alterations that change the type design', 'Only for engine modifications', 'Only for commercial aircraft'], a: 1 },
        { q: 'What is the primary risk of assuming AC 43.13-1B covers all maintenance tasks?', opts: ['It may lead to incorrect billing', 'AC 43.13-1B does not cover major alterations requiring STCs', 'The manual is often out of date', 'It only applies to helicopters'], a: 1 },
        { q: 'What are Airworthiness Directives (ADs)?', opts: ['Optional manufacturer recommendations', 'Mandatory FAA-issued corrective actions', 'Insurance requirements', 'Shop-specific quality standards'], a: 1 },
        { q: 'What defines the privileges and limitations of a Part 145 repair station?', opts: ['The shop owner\'s preferences', 'The Operations Specifications and ratings listed on the certificate', 'State aviation regulations', 'The manufacturer\'s service bulletins'], a: 1 }
    ],
    2: [
        { q: 'What regulation governs logbook entry requirements for maintenance?', opts: ['14 CFR 91.403', '14 CFR 43.9 and 43.11', '14 CFR 145.201', '14 CFR 21.50'], a: 1 },
        { q: 'When is FAA Form 337 required?', opts: ['For any maintenance work', 'For major repairs and major alterations', 'Only for engine overhauls', 'Only for new aircraft'], a: 1 },
        { q: 'What is the consequence of incomplete logbook entries?', opts: ['A small fine', 'Legal exposure and possible airworthiness questions', 'No consequence if the work was done correctly', 'The aircraft must be grounded permanently'], a: 0 },
        { q: 'A return-to-service statement can be signed by:', opts: ['Any employee of the shop', 'Only FAA inspectors', 'Authorized persons (IA, A&P with IA for major work, or repair station)', 'The aircraft owner'], a: 2 },
        { q: 'What must be referenced in a maintenance logbook entry?', opts: ['The mechanic\'s home address', 'The approved data used for the work', 'The weather conditions', 'The aircraft\'s insurance policy'], a: 1 }
    ],
    3: [
        { q: 'What are the main types of aircraft drawings used in avionics?', opts: ['Blueprint, redline, greenline', 'Block, schematic, wiring, and interconnect diagrams', 'CAD, 3D model, and rendering', 'Orthographic only'], a: 1 },
        { q: 'Why is it critical to verify the drawing revision before starting work?', opts: ['To avoid using outdated or superseded installation data', 'Drawings rarely change', 'It is not important if the mechanic is experienced', 'Only required for military aircraft'], a: 0 },
        { q: 'Wire gauge selection is based on:', opts: ['Wire color only', 'Current load and wire run length per AC 43.13-1B', 'The connector size', 'The aircraft\'s age'], a: 1 },
        { q: 'Connector pin-out diagrams are used to:', opts: ['Determine wire colors only', 'Trace signal paths and verify correct pin assignments', 'Calculate fuel consumption', 'Test battery capacity'], a: 1 },
        { q: 'What is a primary risk of incorrect connector pin assignments?', opts: ['Slightly slower performance', 'Potential short circuits, equipment damage, or safety hazards', 'No real risk if wires are the same gauge', 'The connector will not fit'], a: 1 }
    ],
    4: [
        { q: 'What is the correct way to verify a crimp terminal?', opts: ['Visual inspection only', 'Pull test and visual inspection per AC 43.13-1B', 'Tug on it with your fingers', 'X-ray the connection'], a: 1 },
        { q: 'Why should a megohmmeter NOT be applied to sensitive avionics?', opts: ['It is too slow', 'The high test voltage can damage semiconductor components', 'It only works on DC circuits', 'It is too expensive'], a: 1 },
        { q: 'What indicates an over-tightened cable tie on a wire bundle?', opts: ['The tie is flush with the bundle', 'Visible insulation damage or deformation', 'The wires are perfectly aligned', 'No indication is possible'], a: 1 },
        { q: 'Shield termination methods include:', opts: ['Tape wrapping only', 'Pigtail and drain wire techniques', 'Soldering the shield to the connector shell', 'Using standard cable ties'], a: 1 },
        { q: 'What should you check after heat shrink application?', opts: ['That it is the right color', 'That it is fully recovered (shrunk) with no gaps or bubbles', 'That it can still slide freely', 'That it has been painted'], a: 1 }
    ],
    5: [
        { q: 'What are the three intercom modes typically available?', opts: ['Low, medium, high', 'Isolated, crew, all', 'Pilot, copilot, passenger', 'AM, FM, digital'], a: 1 },
        { q: 'What does "sidetone" provide for the pilot?', opts: ['Background music', 'Audio feedback of their own transmission so they know they are transmitting', 'A warning tone for low fuel', 'Navigation guidance'], a: 1 },
        { q: 'Which connector types are commonly used for aircraft headsets?', opts: ['USB-C and Lightning', 'PJ-055, PJ-068, GA twin plug, and LEMO', 'RCA and 3.5mm', 'XLR and TRS'], a: 1 },
        { q: 'What is the risk of a stuck microphone?', opts: ['Reduced battery life', 'It blocks the frequency for all other aircraft', 'Increased sidetone volume', 'The audio panel will reset'], a: 1 },
        { q: 'Marker beacon indications include which three markers?', opts: ['Red, yellow, green', 'Outer (O), Middle (M), Inner (I)', 'Alpha, Bravo, Charlie', 'Start, Middle, End'], a: 1 }
    ],
    6: [
        { q: 'What does CDI stand for and what does full-scale deflection indicate on a VOR?', opts: ['Course Direction Indicator; ±5° off course', 'Course Deviation Indicator; ±10° off the selected radial', 'Compass Deviation Index; ±20°', 'Central Display Interface; no deviation meaning'], a: 1 },
        { q: 'WAAS improves GPS accuracy for:', opts: ['VOR navigation only', 'LPV approaches with vertical guidance down to 200ft DA', 'Military operations exclusively', 'ADS-B Out compliance'], a: 1 },
        { q: 'What happens if a navigation database expires?', opts: ['Nothing; it still works fine', 'GPS-based IFR approaches may not be legally used', 'The GPS unit shuts down', 'A warning light on the panel illuminates'], a: 1 },
        { q: 'What is RAIM and why does it matter?', opts: ['Receiver Autonomous Integrity Monitoring; it ensures GPS position reliability', 'Radio Altimeter Integration Module; it calibrates altimeters', 'Radar Approach Instrument Method; used for ILS', 'Remote ATC Information Management; for data link'], a: 0 },
        { q: 'Where is a GPS antenna typically mounted on a GA aircraft?', opts: ['On the belly, near the tail', 'On top of the fuselage with clear sky view', 'Inside the cockpit on the glareshield', 'On the wing tips'], a: 1 }
    ],
    7: [
        { q: 'What is considered an acceptable VSWR for a COM antenna system?', opts: ['Less than 5:1', 'Less than 2:1', 'Less than 10:1', 'Exactly 1:1 or nothing'], a: 1 },
        { q: 'Why is proper antenna bonding critical?', opts: ['For paint adhesion', 'Poor bonding causes high VSWR, weak signal, and potential arcing', 'To reduce drag', 'For aesthetic reasons'], a: 1 },
        { q: 'The VHF COM frequency range for aviation is:', opts: ['108.0 – 117.95 MHz', '118.0 – 136.975 MHz', '225 – 400 MHz', '88 – 108 MHz'], a: 1 },
        { q: 'What is the universal emergency frequency?', opts: ['122.0 MHz', '121.5 MHz', '119.1 MHz', '125.5 MHz'], a: 1 },
        { q: 'A weak transmit / poor range squawk should be troubleshot by checking:', opts: ['The audio panel volume first', 'Antenna, coax cables, connectors, and VSWR systematically', 'Only the radio unit itself', 'The aircraft battery voltage'], a: 1 }
    ],
    8: [
        { q: 'What are the three emergency transponder squawk codes?', opts: ['7400, 7500, 7600', '7500 (hijack), 7600 (comm failure), 7700 (emergency)', '1200, 1300, 1400', '7777, 7778, 7779'], a: 1 },
        { q: 'How often must a transponder be tested per 14 CFR 91.413?', opts: ['Every 12 months', 'Every 24 months', 'Every 6 months', 'Only when installed'], a: 1 },
        { q: 'What is the maximum allowable altitude encoder error?', opts: ['±50 feet', '±125 feet', '±200 feet', '±500 feet'], a: 1 },
        { q: 'ADS-B Out requirements are found in:', opts: ['14 CFR 91.225 and 91.227', '14 CFR Part 43 only', 'AC 43.13-1B', '14 CFR Part 145'], a: 0 },
        { q: 'What data does ADS-B Out broadcast?', opts: ['Only the squawk code', 'Position, altitude, velocity, aircraft ID, and other data', 'Only altitude and heading', 'Voice communications'], a: 1 }
    ],
    9: [
        { q: 'What is the maximum allowable static system leak rate?', opts: ['200 feet per minute', '100 feet per minute', '50 feet per minute', 'Zero leakage allowed'], a: 1 },
        { q: 'Which instruments are connected to the pitot system?', opts: ['Altimeter and VSI', 'Airspeed Indicator (ASI)', 'All three: ASI, altimeter, VSI', 'Only the altimeter'], a: 1 },
        { q: 'How often must altimeters be tested per 14 CFR 91.411?', opts: ['Every 12 months', 'Every 24 months', 'Every 6 months', 'Only at annual inspection'], a: 1 },
        { q: 'What is the risk of applying excessive pressure during pitot-static testing?', opts: ['No risk; instruments are robust', 'Instrument damage or permanent calibration errors', 'The test equipment may break', 'It speeds up the test'], a: 1 },
        { q: 'What does the alternate static source provide?', opts: ['Backup pitot pressure', 'An alternate source of static pressure if primary ports are blocked', 'Emergency radio communications', 'GPS backup'], a: 1 }
    ],
    10: [
        { q: 'What are the three main components of an autopilot system?', opts: ['GPS, altimeter, compass', 'Controller, computer, and servos', 'Yoke, pedals, throttle', 'Gyro, accelerometer, magnetometer'], a: 1 },
        { q: 'What is the primary danger of a trim runaway?', opts: ['Excessive fuel consumption', 'Loss of aircraft control', 'Increased noise', 'Instrument failure'], a: 1 },
        { q: 'How does a flight director differ from an autopilot?', opts: ['They are the same thing', 'Flight director provides guidance cues on the display; autopilot physically moves controls', 'Flight director is only for IFR', 'Autopilot only works in VMC'], a: 1 },
        { q: 'Autopilot disconnect methods typically include:', opts: ['Only the panel button', 'Control wheel button, panel button, and trim interrupt', 'Pulling the circuit breaker only', 'Turning off the master switch'], a: 1 },
        { q: 'When troubleshooting "autopilot will not engage," what should you check first?', opts: ['The GPS database', 'Prerequisites: attitude valid, airspeed alive, servos powered, no fault flags', 'The paint on the servo covers', 'The aircraft registration'], a: 1 }
    ],
    11: [
        { q: 'When is a compass swing required?', opts: ['Every annual inspection', 'After installing new radios near the compass, engine replacement, lightning strike, or magnetic disturbance', 'Only on new aircraft', 'Every 6 months'], a: 1 },
        { q: 'What is the maximum allowable compass deviation per heading?', opts: ['5°', '10°', '15°', '20°'], a: 1 },
        { q: 'A slaved compass system consists of:', opts: ['Just a magnetic compass', 'Flux valve, slaving amplifier, and HSI', 'GPS and attitude indicator', 'Gyro and accelerometer'], a: 1 },
        { q: 'Compass acceleration error causes the compass to:', opts: ['Read correctly at all times', 'Show erroneous readings during acceleration/deceleration on east/west headings', 'Stop working entirely', 'Spin continuously'], a: 1 },
        { q: 'What must be updated after any compass swing?', opts: ['The aircraft registration', 'The compass deviation card', 'The flight manual supplement', 'The insurance policy'], a: 1 }
    ],
    12: [
        { q: 'What distinguishes an installed EFB from a portable EFB?', opts: ['Price', 'Installed EFBs are permanently mounted and may receive aircraft data; portable are removable', 'Size only', 'Software version'], a: 1 },
        { q: 'What is the primary safety concern with an EFB mount?', opts: ['Weight', 'The EFB could come loose and block controls or injure crew', 'Screen glare', 'Battery drainage'], a: 1 },
        { q: 'WiFi systems in aircraft must have:', opts: ['No special requirements', 'Network separation between cockpit/avionics and passenger networks', 'The fastest available speed', 'Bluetooth backup'], a: 1 },
        { q: 'ADS-B In receivers display what information?', opts: ['Only weather', 'Traffic and weather information', 'ATC instructions', 'Engine parameters'], a: 1 },
        { q: 'If an EFB is not receiving data from installed sources, you should check:', opts: ['The EFB app store first', 'Data source power, connections, EFB settings, and interface configuration', 'Only the WiFi', 'Replace the EFB immediately'], a: 1 }
    ],
    13: [
        { q: 'What is an AIRAC cycle?', opts: ['An engine inspection cycle', 'A 28-day update cycle for navigation databases', 'A compass calibration schedule', 'A transponder test cycle'], a: 1 },
        { q: 'A route discontinuity in the FMS means:', opts: ['The flight plan is complete', 'There is a gap in the route that must be resolved before flying', 'The GPS has failed', 'The fuel is low'], a: 1 },
        { q: 'How do you update a navigation database?', opts: ['The FMS updates automatically via ADS-B', 'Using manufacturer data cards, USB, or WiFi per approved procedure', 'By entering waypoints manually', 'Databases never need updating'], a: 1 },
        { q: 'What does LNAV mean in the context of FMS?', opts: ['Low Noise Audio Volume', 'Lateral Navigation — the FMS provides lateral steering commands', 'Landing Navigation', 'Long-range NAV mode'], a: 1 },
        { q: 'When troubleshooting a "database not found" error, you should first check:', opts: ['The aircraft battery', 'The data card is properly seated, correct format, and not corrupted', 'The autopilot', 'The transponder'], a: 1 }
    ]
};

/* ---------- RISE ONLINE MODULE MAPPING ---------- */
/* Maps PQS sections to their corresponding CAET online training modules */
const RISE_MODULES = {
    1:  { mod: 'mod1-maintenance-regs', title: 'Maintenance Regulations', desc: 'Parts 43/91/145, maintenance records, ADs, and STCs' },
    2:  { mod: 'mod1-maintenance-regs', title: 'Maintenance Regulations', desc: 'Documentation standards, test records, and repair station operations' },
    3:  { mod: 'mod6-aircraft-wiring',  title: 'Aircraft Wiring',        desc: 'Wiring diagrams, schematics, and circuit analysis' },
    4:  { mod: 'mod6-aircraft-wiring',  title: 'Aircraft Wiring',        desc: 'Wire harness fabrication, termination, and crimping' },
    5:  { mod: 'mod3-cns-systems',      title: 'CNS Systems',            desc: 'Audio panels, intercom systems, and audio routing' },
    6:  { mod: 'mod3-cns-systems',      title: 'CNS Systems',            desc: 'VOR, ILS, GPS, and navigation receivers' },
    7:  { mod: 'mod3-cns-systems',      title: 'CNS Systems',            desc: 'VHF/HF comm, SELCAL, and antenna systems' },
    8:  { mod: 'mod3-cns-systems',      title: 'CNS Systems',            desc: 'Transponders, Mode S, ADS-B, and TCAS' },
    9:  { mod: 'mod4-flight-instruments', title: 'Flight Instruments',   desc: 'Pitot-static system, altimeters, and air data computers' },
    10: { mod: 'mod4-flight-instruments', title: 'Flight Instruments',   desc: 'Autopilot, flight director, and servo systems' },
    11: { mod: 'mod4-flight-instruments', title: 'Flight Instruments',   desc: 'Compass systems, swing procedures, and slaving' },
    12: { mod: 'mod5-digital-databus',  title: 'Digital Databus',        desc: 'EFB integration, connectivity, and data interfaces' },
    13: { mod: 'mod5-digital-databus',  title: 'Digital Databus',        desc: 'FMS, navigation databases, and AIRAC cycles' }
};

/* ---------- CAET TRAINING COURSE MODULES ---------- */
/* 8 full training modules with flashcards, drill, jeopardy, and final tests */
/* Each maps to PQS sections for automatic RTI hour credit */
const TRAINING_MODULES = [
    {
        id: 'mod1-maintenance-regs', num: 'MRD', title: 'Maintenance Regulations & Documentation',
        desc: 'Master the regulatory framework, FAA documentation requirements, maintenance records, and compliance standards.',
        color: '#58a6ff', objectives: 31, pqsSections: [1, 2],
        rtiHoursTarget: 22, // Sec 1 (10h) + Sec 2 (12h)
        activities: ['flashcards', 'drill', 'jeopardy', 'final']
    },
    {
        id: 'mod2-basic-electrical', num: 'BEE', title: 'Basic Electrical & Electronics',
        desc: 'Fundamental electrical theory, circuit analysis, electron flow, Ohm\'s law, and component identification.',
        color: '#3fb950', objectives: 30, pqsSections: [3, 4],
        rtiHoursTarget: 40,
        activities: ['flashcards', 'drill', 'jeopardy', 'final']
    },
    {
        id: 'mod3-cns-systems', num: 'CNS', title: 'Communication, Navigation & Surveillance',
        desc: 'Audio panels, VOR/ILS/GPS navigation, VHF/HF comm systems, transponders, ADS-B, and TCAS.',
        color: '#f0883e', objectives: 30, pqsSections: [5, 6, 7, 8],
        rtiHoursTarget: 61,
        activities: ['flashcards', 'drill', 'jeopardy', 'final']
    },
    {
        id: 'mod4-flight-instruments', num: 'FIS', title: 'Flight Instruments & Systems',
        desc: 'Pitot-static systems, autopilot, flight directors, compass systems, and air data computers.',
        color: '#a371f7', objectives: 30, pqsSections: [9, 10, 11],
        rtiHoursTarget: 70,
        activities: ['flashcards', 'drill', 'jeopardy', 'final']
    },
    {
        id: 'mod5-digital-databus', num: 'DDB', title: 'Digital Databus Systems',
        desc: 'ARINC 429, MIL-STD-1553, EFB integration, FMS operations, and data interfaces.',
        color: '#56d4dd', objectives: 30, pqsSections: [12, 13],
        rtiHoursTarget: 27,
        activities: ['flashcards', 'drill', 'jeopardy', 'final']
    },
    {
        id: 'mod6-aircraft-wiring', num: 'AWH', title: 'Aircraft Wiring & Hardware',
        desc: 'Wiring practices per AC 43.13-1B, harness fabrication, connectors, and termination techniques.',
        color: '#f85149', objectives: 30, pqsSections: [3, 4],
        rtiHoursTarget: 0, // Shared with Mod 2
        activities: ['flashcards', 'drill', 'jeopardy', 'final']
    },
    {
        id: 'mod7-tools-test-equipment', num: 'TTE', title: 'Tools & Test Equipment',
        desc: 'DMMs, oscilloscopes, pitot-static test sets, transponder test sets, and calibration requirements.',
        color: '#d4a853', objectives: 30, pqsSections: [],
        rtiHoursTarget: 0, // Cross-cutting
        activities: ['flashcards', 'drill', 'jeopardy', 'final']
    },
    {
        id: 'mod8-shop-safety', num: 'SSP', title: 'Shop Safety & Practices',
        desc: 'FOD prevention, ESD protection, hazardous materials, lockout/tagout, and Part 145 shop requirements.',
        color: '#2ea043', objectives: 30, pqsSections: [],
        rtiHoursTarget: 0, // Cross-cutting
        activities: ['flashcards', 'drill', 'jeopardy', 'final']
    }
];

/* ---------- SUPERVISOR TRAINING MODULES ---------- */
const SUP_TRAINING = [
    {
        id: 'sup1', title: 'Evaluator Roles & Responsibilities', desc: 'Your legal and ethical obligations as a CAET evaluator, scope of authority, and what your sign-off means under Part 145.',
        content: [
            'THE WEIGHT OF YOUR SIGN-OFF: When you sign off a PQS task, you are making a legal attestation that you personally witnessed the apprentice demonstrate competency to the stated performance standard. This is not a formality — it means the apprentice can perform this task independently, unsupervised, on a customer aircraft. If the apprentice later causes damage or creates an unsafe condition on a task you signed off, your sign-off will be examined.',
            'WHO CAN BE AN EVALUATOR: Per the CAET program, evaluators must be employed by a Part 145 repair station with appropriate ratings. While an A&P certificate is commonly held, it is not strictly required to serve as an evaluator. The shop\'s quality manager is responsible for approving evaluators based on their demonstrated practical avionics experience. You cannot evaluate tasks in areas where you lack practical experience — for example, don\'t sign off FMS tasks if you\'ve never worked with flight management systems.',
            'WHAT "DEMONSTRATED COMPETENCY" MEANS: The apprentice must physically perform the task or verbally demonstrate knowledge to your satisfaction. Watching a YouTube video doesn\'t count. Reading the task description back to you doesn\'t count. They need to show you they can do it — hands on the equipment, explaining their reasoning as they go. For knowledge-based tasks, they need to explain concepts in their own words, not memorized phrases.',
            'DOCUMENTATION STANDARDS: Every sign-off requires your name, date, and written observations. Generic comments like "good" or "satisfactory" are insufficient. Write what you actually observed: "Apprentice correctly identified the flux valve on N12345, explained how it feeds the HSI via the slaving amplifier, and described two conditions that would require a compass swing." These notes become part of the permanent training record reviewed by AEA.',
            'CONFLICT OF INTEREST: Don\'t sign off tasks for family members or close personal friends without disclosing the relationship to your quality manager. Don\'t sign off tasks under pressure from shop management to "speed things up" — if the apprentice isn\'t ready, they aren\'t ready. Your professional reputation and the safety of the program depend on honest evaluation.',
            'SCOPE BOUNDARIES: You can only evaluate tasks within your repair station\'s ratings and your personal area of competency. If your shop doesn\'t do autopilot work, you shouldn\'t be signing off autopilot tasks. If you\'re unsure whether you\'re qualified to evaluate a specific task, ask your quality manager.'
        ],
        quiz: [
            { q: 'Your sign-off on a PQS task is a legal attestation that:', opts: ['The apprentice read the relevant manual', 'You personally witnessed the apprentice demonstrate competency to the performance standard', 'The shop manager approved the work', 'The apprentice has been employed for the required time period'], a: 1 },
            { q: 'A shop supervisor asks you to batch sign-off 10 tasks for an apprentice who "definitely knows this stuff." You should:', opts: ['Sign them off to maintain a good relationship', 'Refuse — each task must be individually observed and documented', 'Sign them off but note your concern', 'Ask another evaluator to do it instead'], a: 1 },
            { q: 'Why are generic comments like "satisfactory" insufficient for sign-off documentation?', opts: ['They take too little time to write', 'They don\'t demonstrate that you actually observed specific competency, which AEA reviews', 'They are grammatically incorrect', 'No reason; they are fine'], a: 1 },
            { q: 'You are asked to sign off an FMS task, but your shop only works on basic COM/NAV installations. You should:', opts: ['Sign it off since you are an approved evaluator', 'Decline — this is outside your scope of competency and shop ratings', 'Ask the apprentice to explain it and then sign off', 'Sign off and note your limited experience'], a: 1 },
            { q: 'If an apprentice\'s signed-off task later results in an unsafe condition, what happens?', opts: ['Nothing — the apprentice is solely responsible', 'Your sign-off will be examined as part of any investigation into the evaluator\'s attestation', 'Only the shop owner is liable', 'AEA absorbs all liability'], a: 1 }
        ]
    },
    {
        id: 'sup2', title: 'Effective Training Techniques for the Shop', desc: 'Proven methods for teaching avionics tasks in a real shop environment — demonstration, guided practice, and building independent competency.',
        content: [
            'THE "I DO, WE DO, YOU DO" METHOD: This is the foundation of effective hands-on training. First, YOU demonstrate the complete task while the apprentice observes and takes notes. Narrate your thought process: "I\'m selecting the 22-gauge wire because the current load is 3 amps and the run is 8 feet — checking the AC 43.13-1B table, that\'s within limits." Second, do the task TOGETHER — you guide while they perform. Third, they do it ALONE while you observe. Only sign off after stage three.',
            'EXPLAIN THE "WHY" — NOT JUST THE "HOW": An apprentice who knows HOW to crimp a terminal but doesn\'t understand WHY proper crimp depth matters will fail in novel situations. When teaching, always connect the procedure to the underlying principle. Example: "We use a pull test after crimping because a cold solder joint or improper crimp can look perfect but fail under vibration — and in an aircraft, vibration is constant."',
            'USE REAL SQUAWKS AS TRAINING OPPORTUNITIES: When a customer aircraft comes in with a "weak COM1 transmit" squawk, walk your apprentice through the systematic troubleshooting process in real time. Start at the antenna, check VSWR, inspect the coax, verify the radio. Real squawks teach more than any textbook because the apprentice learns to deal with corrosion, chafed wires, and the reality of aircraft that have been flying for 30 years.',
            'SCAFFOLDING: Start simple and build complexity. Don\'t throw an apprentice at a full GPS installation on day one. Start with wire identification. Then crimping. Then a simple harness. Then harness routing. Then a complete run from the radio tray to the antenna. Each step builds on the last. If they struggle at any step, go back one level — never push forward on a weak foundation.',
            'CREATE A SAFE LEARNING ENVIRONMENT: Apprentices who are afraid to ask questions or admit confusion will hide their mistakes. Make it clear that questions are expected and valued. When an apprentice makes an error, use it as a teaching moment, not a punishment. "Good catch that you noticed the shield wasn\'t grounded — that\'s exactly the kind of attention to detail we need. Here\'s how to fix it."',
            'TIME ON TASK MATTERS: Skills develop through repetition. An apprentice who crimps one terminal has practiced; an apprentice who crimps fifty has developed muscle memory and consistent technique. Build in repetitive practice for critical skills like crimping, wire stripping, and connector pin insertion. It\'s not busywork — it\'s building competency.',
            'CONNECT TO AIRCRAFT TYPES: When possible, teach the same concept across different aircraft. "We just did a COM check on the Cessna 182 with a GMA 345 — now let\'s look at how the King Air\'s audio system handles the same functions differently." This builds adaptable knowledge, not just memorized procedures for one aircraft.'
        ],
        quiz: [
            { q: 'In the "I Do, We Do, You Do" method, when should you sign off a task?', opts: ['After the "I Do" demonstration', 'After the "We Do" guided practice', 'Only after the "You Do" stage where the apprentice performs independently', 'After watching a training video together'], a: 2 },
            { q: 'A customer aircraft arrives with a "COM1 no transmit" squawk. How should you use this for training?', opts: ['Fix it yourself since the customer is waiting', 'Walk the apprentice through systematic troubleshooting in real time, explaining your reasoning', 'Have the apprentice read the troubleshooting manual', 'Save it for later when you have more time'], a: 1 },
            { q: 'An apprentice crimps a terminal that looks perfect but hasn\'t performed a pull test. Why is this a problem?', opts: ['Pull tests are optional for experienced apprentices', 'A visually perfect crimp can still fail under vibration — the pull test verifies mechanical integrity', 'Pull tests damage the terminal', 'The apprentice is being too careful'], a: 1 },
            { q: '"Scaffolding" in training means:', opts: ['Building physical supports for work platforms', 'Starting with simple tasks and progressively building complexity, never advancing on a weak foundation', 'Assigning all tasks at once and letting the apprentice choose', 'Only using training mannuals'], a: 1 },
            { q: 'Why should the same concept be taught across different aircraft types?', opts: ['To pad the training hours log', 'It builds adaptable knowledge rather than memorized procedures for one specific aircraft', 'Different aircraft don\'t really differ', 'It is required by the FAA for every task'], a: 1 }
        ]
    },
    {
        id: 'sup3', title: 'Assessing True Understanding', desc: 'How to tell if your apprentice actually gets it — probing questions, scenario-based assessment, and recognizing red flags.',
        content: [
            'PROBING QUESTIONS THAT REVEAL UNDERSTANDING: Don\'t just ask "Can you do this?" — of course they\'ll say yes. Instead, ask questions that require them to apply knowledge: "You just checked the nav database currency on this G1000. The database expired yesterday. What are the operational implications? Can the pilot still fly IFR? What about VFR?" If they can answer confidently, they understand the concept. If they hesitate or guess, they\'ve memorized a procedure without understanding it.',
            'THE "WHAT IF" TECHNIQUE: After a task, change one variable and see how they adapt. "You just connected the pitot-static test set. What if, when you apply 100 knots of airspeed, the ASI reads 85? What would you check? What if the altimeter reads correctly but the VSI doesn\'t respond at all?" This reveals whether they understand the system or just memorized the steps.',
            'TEACH-BACK METHOD: Have the apprentice explain the task to you as if you were a new apprentice. "Pretend I\'ve never done a transponder test. Walk me through it from start to finish." This is one of the most powerful assessment tools because it forces them to organize their knowledge and reveals gaps they may not realize they have. Listen for vague hand-waving ("then you just hook it up") vs. specific steps ("connect the test set to the bottom antenna using the BNC adapter, then set the test set to Mode C").',
            'WATCH FOR ROTE VS. ADAPTIVE PERFORMANCE: A rote performer does every step in the exact order they were taught and freezes when something unexpected happens. An adaptive performer understands the underlying system well enough to handle variations. When something goes wrong during a task (and it will — aircraft are unpredictable), watch how the apprentice responds. Do they stop and think? Do they refer to the manual? Do they ask for help? All of these are good signs. Do they push forward hoping it will work? That\'s a red flag.',
            'SAFETY CONSCIOUSNESS IS NON-NEGOTIABLE: Observe whether the apprentice checks for hazards unprompted. Do they put on safety glasses before drilling? Do they verify the master switch is off before touching wiring? Do they check for FOD before closing an access panel? Safety behavior that requires constant reminding is a sign the apprentice is not ready for independent work. Safety must be reflexive, not prompted.',
            'RED FLAGS THAT MEAN "NOT READY": Rushing through steps. Skipping safety checks. Inability to explain what they just did. Looking to you for approval after every step instead of working confidently. Making the same mistake twice without recognizing it. Saying "I think" instead of "I know" on critical items. These are all indicators that the apprentice needs more practice, not a sign-off.'
        ],
        quiz: [
            { q: 'You ask an apprentice what happens if the nav database expires. They shrug and say "it probably still works." This indicates:', opts: ['Confidence', 'They have memorized the update procedure but don\'t understand the operational implications', 'They are correct — databases always work when expired', 'They need more time to think'], a: 1 },
            { q: 'The teach-back method works because:', opts: ['It saves the supervisor time', 'Explaining a task forces the apprentice to organize knowledge, revealing gaps they may not realize they have', 'It is a required step in the PQS', 'It lets the apprentice practice public speaking'], a: 1 },
            { q: 'An apprentice performs a transponder test perfectly but freezes when the test set shows an unexpected altitude error. This suggests:', opts: ['Equipment failure', 'The apprentice memorized the steps but doesn\'t understand the underlying system well enough to troubleshoot', 'The apprentice is having a bad day', 'The test set needs calibration'], a: 1 },
            { q: 'Which of the following is NOT a red flag during evaluation?', opts: ['Rushing through safety checks', 'Looking up a procedure in the manual before starting', 'Making the same mistake twice without recognizing it', 'Saying "I think" instead of "I know" on critical items'], a: 1 },
            { q: 'Safety consciousness should be:', opts: ['Prompted by the supervisor each time', 'Reflexive and unprompted — automatic behavior during every task', 'Only important during checkrides', 'Required only for major alterations'], a: 1 }
        ]
    },
    {
        id: 'sup4', title: 'Feedback, Rejection, and Documentation', desc: 'How to give effective feedback, when and how to reject tasks, and documentation standards that protect you and the apprentice.',
        content: [
            'SPECIFIC FEEDBACK IS THE ONLY USEFUL FEEDBACK: "Good job" teaches nothing. "You correctly identified the loose BNC connector on the COM2 antenna feedline, applied the appropriate torque, and verified VSWR improved from 3.5:1 to 1.3:1 — that\'s exactly the systematic approach we need" — that reinforces what they did right and why it matters. Every sign-off should include specific observations.',
            'WHEN TO REJECT A TASK: Rejection is not punishment — it\'s protection. Reject when: the apprentice cannot perform the task independently (needed too much guidance), the result doesn\'t meet the performance standard (e.g., crimp failed pull test), safety procedures were skipped, or the apprentice cannot explain what they did and why. Never sign off out of sympathy or convenience.',
            'HOW TO GIVE REJECTION FEEDBACK: Be direct but constructive. Never say "you failed." Instead: "The shield termination on your harness had three issues: the pigtail was 2 inches instead of the maximum 1 inch, the drain wire wasn\'t connected to ground, and the heat shrink didn\'t fully cover the exposed shield braid. Here\'s what I want you to practice before we try again: [specific remediation steps]." Give them a clear path back to success.',
            'DOCUMENT EVERYTHING — GOOD AND BAD: For sign-offs, record what the apprentice demonstrated, on what aircraft/equipment, and your specific observations. For rejections, record what was deficient, what the performance standard requires, and what the apprentice needs to do to meet it. This protects both of you — the apprentice can\'t claim they were unfairly rejected, and you can demonstrate your evaluation was thorough and objective.',
            'THE FEEDBACK SANDWICH IS NOT ALWAYS APPROPRIATE: In safety-critical fields, don\'t bury important corrective feedback between compliments. If an apprentice skipped the step of verifying master-off before working on wiring, that needs to be addressed directly and immediately — not sandwiched between "nice wire labeling" and "keep up the good work." Be pleasant but clear: "You need to verify master-off before touching wiring. Every time. This is a non-negotiable safety practice."',
            'TRACKING PATTERNS ACROSS TASKS: Keep informal notes on each apprentice\'s recurring strengths and weaknesses. If an apprentice consistently struggles with documentation but excels at hands-on work, that pattern tells you where to focus additional training. If they keep skipping the same safety practice, that\'s a pattern that needs to be addressed before signing off any more tasks.',
            'WHEN AN APPRENTICE DISAGREES WITH YOUR REJECTION: Explain your reasoning calmly and reference the performance standard. If they still disagree, involve your quality manager. Never argue — the performance standard is the objective measure, not your opinion vs. theirs.'
        ],
        quiz: [
            { q: '"Good job" as sign-off feedback is:', opts: ['Perfectly adequate', 'Insufficient — feedback must describe specific observations of demonstrated competency', 'Encouraged for morale', 'Better than nothing'], a: 1 },
            { q: 'A scenario: your apprentice almost completed a harness perfectly, but the shield drain wire is not connected to ground. You should:', opts: ['Sign off since it was mostly correct', 'Reject the task, explain the specific deficiency, and give them a clear remediation path', 'Fix it yourself and sign off', 'Ignore it since it\'s a minor issue'], a: 1 },
            { q: 'Documentation of a rejection should include:', opts: ['Just the date and "rejected"', 'What was deficient, what the standard requires, and what the apprentice needs to do to meet it', 'A vague note about "needs improvement"', 'Nothing — rejections don\'t need documentation'], a: 1 },
            { q: 'An apprentice consistently skips verifying master-off before wire work. You should:', opts: ['Mention it casually next time', 'Address it directly and immediately — this is a non-negotiable safety practice that blocks further sign-offs', 'Wait until they cause an incident', 'Include it in a feedback sandwich'], a: 1 },
            { q: 'When an apprentice disagrees with your rejection, the correct approach is:', opts: ['Argue until they accept it', 'Explain your reasoning calmly, reference the performance standard, and involve your quality manager if needed', 'Give in to avoid conflict', 'Reject all their future tasks as retaliation'], a: 1 }
        ]
    }
];

/* ============================================================
   ORAL BOARD RUBRIC — Score Descriptors (1-5 per phase)
   ============================================================ */
const ORAL_RUBRIC = {
    technical: {
        title: 'Phase 1: Technical Knowledge',
        desc: 'Regulatory understanding, system theory, documentation standards',
        scores: {
            5: { label: 'Expert', desc: 'Cites specific FARs/ACs from memory. Explains STC vs field approval nuances, AD compliance logic, and approved data hierarchy without prompting. Could teach this material.' },
            4: { label: 'Proficient', desc: 'Strong regulatory knowledge. Understands Part 43 authority, documentation requirements, and system theory. Minor gaps only on edge cases (RVSM, ETOPS).' },
            3: { label: 'Competent', desc: 'Adequate understanding of core regulations and systems. Can find answers in references. Knows when something requires an IA sign-off vs repairman.' },
            2: { label: 'Developing', desc: 'Gaps in fundamental understanding. Confuses Part 43 vs Part 145 authority. Struggles with key concepts like major vs minor alteration.' },
            1: { label: 'Insufficient', desc: 'Cannot demonstrate basic regulatory understanding. Unable to identify approved data sources or explain maintenance documentation requirements.' }
        },
        questions: [
            'What approved data sources can you use for avionics installations?',
            'Explain the difference between a major alteration and a major repair.',
            'When is a Form 337 required? Who can approve it?',
            'What are the requirements for a 91.413 transponder test?',
            'How do you determine if an AD applies to a specific aircraft?',
            'What is the difference between STC and field approval?',
            'Explain the pitot-static system and what 91.411 requires.',
            'What wire types are used in avionics and when?'
        ]
    },
    practical: {
        title: 'Phase 2: Practical Application',
        desc: 'Troubleshooting methodology, hands-on reasoning, tool proficiency',
        scores: {
            5: { label: 'Expert', desc: 'Systematic troubleshooting — isolates faults methodically, identifies root cause on first approach. Selects proper test equipment and interprets readings correctly. Describes real-world examples from shop experience.' },
            4: { label: 'Proficient', desc: 'Good troubleshooting methodology. Reaches correct conclusions with minimal prompting. Proper tool selection. Can explain signal flow through systems.' },
            3: { label: 'Competent', desc: 'Adequate troubleshooting approach. Can work through scenarios with some guidance. Understands basic test equipment usage. May need prompting on complex faults.' },
            2: { label: 'Developing', desc: 'Needs significant coaching to troubleshoot. Makes procedural errors. Struggles with test equipment selection or reading interpretation.' },
            1: { label: 'Insufficient', desc: 'Cannot troubleshoot systematically. Guesses at causes. Cannot identify proper test equipment or describe a logical fault isolation process.' }
        },
        questions: [
            'Walk me through troubleshooting a nav receiver that is not tracking VOR.',
            'You measure 28V at a connector but the unit is not powering up. What next?',
            'How would you verify an ADS-B Out installation meets the requirements?',
            'Describe your process for a compass swing.',
            'An autopilot is trimming nose-down in straight and level flight. Where do you start?',
            'How do you verify proper antenna VSWR?',
            'What would you check if a transponder passes bench test but fails in the aircraft?'
        ]
    },
    professional: {
        title: 'Phase 3: Professional Standards',
        desc: 'Safety awareness, communication, industry professionalism',
        scores: {
            5: { label: 'Exemplary', desc: 'Safety-first mindset is second nature. Communicates clearly with pilots, customers, and inspectors. Understands liability, human factors, and the weight of signing a logbook entry. Ready for unsupervised work.' },
            4: { label: 'Strong', desc: 'Strong safety awareness and communication skills. Understands the importance of documentation and customer interaction. Would represent a shop well.' },
            3: { label: 'Adequate', desc: 'Meets basic professional standards. Safety-conscious with oversight. Communication is clear but may lack confidence in customer-facing situations.' },
            2: { label: 'Developing', desc: 'Safety awareness needs reinforcement. May cut corners when unsupervised. Communication skills need work for customer interactions.' },
            1: { label: 'Insufficient', desc: 'Demonstrates unsafe tendencies or dismissive attitude toward safety procedures. Not ready for unsupervised maintenance work.' }
        },
        questions: [
            'You discover a discrepancy in a logbook entry from a previous shop. What do you do?',
            'A pilot asks you to defer a squawk that you believe is an airworthiness issue. How do you handle it?',
            'Describe the human factors \"Dirty Dozen\" and give an example from your experience.',
            'What does FOD prevention look like in your daily work?',
            'When would you stop work and consult your supervisor or IA?'
        ]
    }
};

/* ============================================================
   PRACTICAL EVALUATION RUBRIC — 5 Stations (10 points total)
   Standardized for consistent grading across all AEA member shops
   ============================================================ */
const PRACTICAL_RUBRIC = {
    passScore: 7,
    totalPoints: 10,
    stations: [
        {
            key: 'wiring',
            title: 'Station 1: Wire Harness & Termination',
            points: 2,
            desc: 'Wire preparation, terminal crimping, harness routing',
            timeAllowed: '30 min',
            criteria: [
                { item: 'Strip length within spec (±1/32″ for terminal barrel depth)', accept: true },
                { item: 'Zero conductor damage — no nicks, cuts, or severed strands', accept: true },
                { item: 'Crimps show bellmouth both ends, correct calibrated tool used', accept: true },
                { item: 'Harness routed per diagram, bend radius ≥10× bundle OD', accept: true },
                { item: 'All wires labeled/identified per wiring diagram', accept: true }
            ],
            tips: 'Inspect each stripped end at eye level. Roll wire 360° to check for ring cuts. Ask: \"How did you determine the correct strip length?\"',
            errors: 'Wrong stripper die for gauge, pulling insulation vs clean cut, using pliers instead of calibrated crimper, skipping wire identification.',
            critical: 'Conductor strands severed by crimp die. Terminal fails pull test. Use of non-calibrated crimp tool for mil-spec terminals.',
            scoring: {
                2: 'All wires stripped to spec, zero damage, correct crimps, routing matches diagram, proper labels.',
                1: '1-2 minor issues (slight strip length variance, minor label error) but no conductor damage or structural crimp failure.',
                0: 'Conductor damage, wrong crimp tool, multiple routing errors, or missing identification.'
            }
        },
        {
            key: 'troubleshooting',
            title: 'Station 2: System Troubleshooting',
            points: 2,
            desc: 'Fault isolation on a provided avionics system or trainer',
            timeAllowed: '20 min',
            criteria: [
                { item: 'Follows logical fault isolation (half-split or signal tracing)', accept: true },
                { item: 'Selects correct test equipment for the measurement', accept: true },
                { item: 'Correctly reads and interprets measurements', accept: true },
                { item: 'Identifies the fault or explains the correct approach', accept: true },
                { item: 'Documents findings clearly (would produce a usable squawk sheet)', accept: true }
            ],
            tips: 'Watch their approach — do they check power first? Do they reference a wiring diagram or just start poking wires? Ask: \"Why did you measure there?\"',
            errors: 'Random probing without a plan, measuring voltage with meter in current mode, not verifying master-off before opening connectors.',
            critical: 'Probing a live circuit with metal tools. Not verifying battery master position before disconnecting avionics.',
            scoring: {
                2: 'Systematic approach, correct equipment, accurate readings, fault identified, clear documentation.',
                1: 'Correct general approach but needed 1-2 hints, or correctly narrowed the fault without fully isolating it.',
                0: 'No logical approach, unsafe procedures, wrong equipment, or unable to make basic measurements.'
            }
        },
        {
            key: 'test_equipment',
            title: 'Station 3: Test Equipment Proficiency',
            points: 2,
            desc: 'Transponder test set, pitot-static tester, or DMM operation',
            timeAllowed: '15 min',
            criteria: [
                { item: 'Correct setup and connection of test equipment', accept: true },
                { item: 'Verifies calibration status before use', accept: true },
                { item: 'Performs required test sequence per the applicable FAR', accept: true },
                { item: 'Correctly reads and records test data', accept: true },
                { item: 'Identifies pass/fail based on tolerances', accept: true }
            ],
            tips: 'Ask them to check calibration sticker FIRST. Watch if they zero leads on DMM. For transponder test: do they know the 91.413 tolerances? For pitot-static: 91.411 requirements?',
            errors: 'Forgetting to check calibration, incorrect connections, confusing mode A vs mode C replies, not accounting for ambient conditions on pitot-static.',
            critical: 'Using equipment with expired calibration. Applying pressure to a sealed pitot-static system too rapidly.',
            scoring: {
                2: 'Correct setup, calibration verified, complete test sequence, accurate readings, correct pass/fail determination.',
                1: 'Correct setup and operation but minor errors (forgot to check cal, slight reading misinterpretation) — self-corrected when prompted.',
                0: 'Cannot set up equipment, skips calibration check, wrong test sequence, or incorrect pass/fail determination.'
            }
        },
        {
            key: 'documentation',
            title: 'Station 4: Maintenance Documentation',
            points: 2,
            desc: 'Logbook entries, Form 337, and return-to-service documentation',
            timeAllowed: '15 min',
            criteria: [
                { item: 'Logbook entry contains all required elements (date, description, references, signature, certificate)', accept: true },
                { item: 'Correct use of approved data references (AC, STC, manufacturer documents)', accept: true },
                { item: 'Form 337 completed correctly for a major alteration scenario', accept: true },
                { item: 'Return-to-service statement uses correct regulatory language', accept: true },
                { item: 'Would pass a ramp check or FSDO audit', accept: true }
            ],
            tips: 'Give them a scenario: \"You just installed a GTN 750Xi under STC. Write the logbook entry.\" Check for: part number, STC number, W&B reference, return-to-service statement.',
            errors: 'Missing part numbers, wrong STC reference, incorrect return-to-service language (\"inspected\" vs \"approved for return to service\"), no W&B indication.',
            critical: 'Using return-to-service language they are not authorized to use. Missing required AD compliance statement.',
            scoring: {
                2: 'Complete, accurate documentation — all required elements present, correct references, proper RTS language. Audit-ready.',
                1: 'Documentation mostly correct but missing 1-2 elements (e.g., no W&B reference, slightly incorrect RTS language). Correctable.',
                0: 'Major omissions (no approved data reference, wrong RTS language, missing signature block) or would fail a FSDO audit.'
            }
        },
        {
            key: 'safety_inspection',
            title: 'Station 5: Safety & Final Inspection',
            points: 2,
            desc: 'FOD prevention, workmanship inspection, airworthiness determination',
            timeAllowed: '10 min',
            criteria: [
                { item: 'FOD check performed — all tools and hardware accounted for', accept: true },
                { item: 'Wire bundle breakouts properly secured, no chafing hazards', accept: true },
                { item: 'All connectors fully seated, locking mechanisms engaged', accept: true },
                { item: 'No sharp edges on cable ties, proper orientation', accept: true },
                { item: 'Candidate can articulate go/no-go decision for airworthiness', accept: true }
            ],
            tips: 'Present them with a completed installation (or photos) and ask them to inspect it. Include 2-3 planted defects. Can they find them? Ask: \"Would you sign this off for return to service?\"',
            errors: 'Rushing through inspection, missing obvious defects (unsecured connector, chafing wire), not performing FOD check before closing panels.',
            critical: 'Signing off work with known defects. Unable to identify an obvious airworthiness issue.',
            scoring: {
                2: 'Thorough inspection, identifies all planted defects, proper FOD awareness, clear airworthiness reasoning.',
                1: 'Catches most defects but misses 1 non-critical issue. Demonstrates safety awareness but needs refinement.',
                0: 'Misses critical defect, no FOD awareness, or cannot articulate airworthiness determination.'
            }
        }
    ]
};

const PORTFOLIO_ITEMS = [
    { key: 'qual_record', label: 'Qualification Record', desc: 'Official CAET Advanced Qualification Record signed by evaluator', category: 'certification' },
    { key: 'written_cert', label: 'Written Exam Certificate', desc: 'CAET Advanced written exam passing certificate from AEA', category: 'certification' },
    { key: 'logbook_transponder', label: 'Transponder Test Logbook Entry', desc: 'Sample logbook entry for 91.413 transponder test performed during training', category: 'evidence' },
    { key: 'logbook_pitot', label: 'Pitot-Static Test Logbook Entry', desc: 'Sample logbook entry for 91.411 altimeter/static test performed during training', category: 'evidence' },
    { key: 'form_337', label: 'FAA Form 337 (Major Alteration)', desc: 'Completed Form 337 for a major alteration (GPS or autopilot installation)', category: 'evidence' },
    { key: 'transponder_form', label: 'Transponder Test Data Form', desc: 'Completed transponder test data sheet with all required measurements', category: 'evidence' },
    { key: 'deviation_card', label: 'Compass Deviation Card', desc: 'Compass deviation card created or verified during compass swing training', category: 'evidence' },
    { key: 'work_samples', label: 'Work Sample Photos', desc: 'Photographs documenting quality of wire harness work, installations, or test setups', category: 'evidence' },
    { key: 'ojt_log', label: 'OJT Hours Log', desc: 'On-the-job training hours log documenting supervised shop time', category: 'training_record' }
];

const GALLERY_CATEGORIES = [
    { key: 'work_photos', label: 'Work Photos', desc: 'Harnesses, installations, test setups', icon: '📸', maxFiles: 5, accept: 'image/*' },
    { key: 'documentation', label: 'Documentation Samples', desc: 'Logbook entries, 337s, test forms beyond required items', icon: '📝', maxFiles: 5, accept: '.pdf,image/*,.doc,.docx' },
    { key: 'endorsements', label: 'Endorsement Letters', desc: 'Written recommendations from supervisors or shop owners', icon: '✉️', maxFiles: 3, accept: '.pdf,image/*,.doc,.docx' },
    { key: 'additional', label: 'Additional Evidence', desc: 'Any other supporting work samples', icon: '📎', maxFiles: 5, accept: '*' }
];

/* CAET Recertification: holders must recertify every 3 years */
const RECERT_YEARS = 3;
function calcRecertDate(certDate) {
    if (!certDate) return null;
    const d = new Date(certDate); d.setFullYear(d.getFullYear() + RECERT_YEARS); return d.toISOString().slice(0, 10)
}
function recertStatus(certDate) {
    if (!certDate) return { status: 'not_certified', label: 'Not Certified', cls: 'badge-notstarted' };
    const recertDate = calcRecertDate(certDate);
    const now = new Date(); const recert = new Date(recertDate);
    const daysLeft = Math.ceil((recert - now) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { status: 'expired', label: 'EXPIRED — Recertify Now', cls: 'badge-needswork', days: daysLeft, recertDate };
    if (daysLeft <= 180) return { status: 'expiring_soon', label: 'Expires in ' + daysLeft + ' days', cls: 'badge-submitted', days: daysLeft, recertDate };
    return { status: 'current', label: 'Current — expires ' + recertDate, cls: 'badge-signed', days: daysLeft, recertDate }
}

const QUIZ_PASS_SCORE = 80;

/* RTI Hour Requirements per PQS Section (CAET Advanced = 220 total hours) */
const RTI_REQUIRED_HOURS = {
    1: 10,  // Regulatory Compliance
    2: 12,  // Maintenance Documentation
    3: 15,  // Wiring Diagrams
    4: 25,  // Wire Harness Fabrication
    5: 12,  // Audio Panel/Intercom
    6: 22,  // Navigation Systems
    7: 12,  // Communication Systems
    8: 15,  // Transponder/ADS-B
    9: 25,  // Pitot-Static
    10: 30, // Autopilot
    11: 15, // Compass Systems
    12: 12, // EFB/Connectivity
    13: 15  // FMS
};
const RTI_TOTAL_REQUIRED = Object.values(RTI_REQUIRED_HOURS).reduce((s, h) => s + h, 0); // 220

/* OJT Hour Requirements per Gap Section (Apprenticeship = 216 total hours) */
const OJT_REQUIRED_HOURS = {
    'A1': 80,  // Aircraft Structures
    'A2': 20,  // Ground Operations
    'A3': 90,  // Leadership & QA
    'A4': 26   // Engine Systems Integration
};
const OJT_TOTAL_REQUIRED = Object.values(OJT_REQUIRED_HOURS).reduce((s, h) => s + h, 0); // 216

/* DOL Phase Definitions (500h RTI total) */
const APPRENTICESHIP_PHASES = [
    { phase: 1, label: 'Foundation',    targetHours: 150, sections: [1,2,3,4],            desc: 'Regulations, Documentation, Wiring, Harness Fabrication' },
    { phase: 2, label: 'Systems',       targetHours: 150, sections: [5,6,7,8,9],          desc: 'Audio, Navigation, Communication, Transponder, Pitot-Static' },
    { phase: 3, label: 'Advanced',      targetHours: 100, sections: [10,11,12,13],        desc: 'Autopilot, Compass, EFB/Connectivity, FMS' },
    { phase: 4, label: 'Mastery & OJT', targetHours: 100, sections: ['A1','A2','A3','A4'], desc: 'Structures, Ground Ops, Leadership/QA, Engine Integration' }
];
const PHASE_TOTAL_HOURS = APPRENTICESHIP_PHASES.reduce((s, p) => s + p.targetHours, 0); // 500

/* ---------- BUILD DEMO STATE ---------- */
function createDemoState() {
    const people = [
        { id: 'a1', name: 'John Smith', role: 'apprentice', supervisorId: 's1',
          apprenticeship: { enrollDate: '2025-09-15', expectedCompletion: '2027-09-15', rapNumber: 'RAP-2025-0042', sponsor: 'Thompson Avionics', mentorId: 's1', status: 'active' } },
        { id: 'a2', name: 'David Miller', role: 'apprentice', supervisorId: 's1',
          apprenticeship: { enrollDate: '2025-10-01', expectedCompletion: '2027-10-01', rapNumber: 'RAP-2025-0058', sponsor: 'Thompson Avionics', mentorId: 's1', status: 'active' } },
        { id: 'a3', name: 'Robert Davis', role: 'apprentice', supervisorId: 's1',
          apprenticeship: { enrollDate: '2025-11-10', expectedCompletion: '2027-11-10', rapNumber: 'RAP-2025-0071', sponsor: 'Thompson Avionics', mentorId: 's1', status: 'active' } },
        { id: 's1', name: 'Thomas Anderson', role: 'supervisor' },
        { id: 'c1', name: 'Patricia Hayes', role: 'committee' },
        { id: 'c2', name: 'Richard Kowalski', role: 'committee' },
        { id: 'admin1', name: 'Shop Manager', role: 'admin' }
    ];
    const taskData = { a1: {}, a2: {}, a3: {} };
    // John: ALL 75 signed off (ready for oral board)
    let c = 0; const bd = new Date('2025-11-01');
    PQS.forEach(sec => {
        sec.tasks.forEach(t => {
            c++;
            const d = new Date(bd); d.setDate(d.getDate() + c * 2);
            taskData.a1[t.id] = { status: 'signed_off', date: d.toISOString().slice(0, 10), evaluator: 'Thomas Anderson', feedback: c <= 25 ? 'Good demonstration of competency.' : c <= 50 ? 'Solid understanding shown. Well prepared.' : 'Excellent work — thorough and professional.' };
        });
    });
    // David: 28 signed, 2 requested
    c = 0; PQS.forEach(sec => {
        sec.tasks.forEach(t => {
            c++;
            if (c <= 28) { const d = new Date(bd); d.setDate(d.getDate() + c * 3); taskData.a2[t.id] = { status: 'signed_off', date: d.toISOString().slice(0, 10), evaluator: 'Mike Rodriguez', feedback: 'Satisfactory performance.' }; }
            else if (c <= 30) taskData.a2[t.id] = { status: 'requested', date: '2026-02-28', comments: 'Practiced this with the Cessna 172 avionics. Please review.' };
            else taskData.a2[t.id] = { status: 'not_started' };
        });
    });
    // Robert: 10 signed
    c = 0; PQS.forEach(sec => {
        sec.tasks.forEach(t => {
            c++;
            if (c <= 10) { const d = new Date(bd); d.setDate(d.getDate() + c * 4); taskData.a3[t.id] = { status: 'signed_off', date: d.toISOString().slice(0, 10), evaluator: 'Mike Rodriguez', feedback: 'Good work.' }; }
            else taskData.a3[t.id] = { status: 'not_started' };
        });
    });

    return {
        shopName: 'Thompson Avionics',
        people,
        taskData,
        portfolio: {
            a1: {
                items: {
                    qual_record: { uploaded: true, fileName: 'CAET_Qualification_Record_JSmith.pdf', fileType: 'application/pdf', fileSize: 245000, uploadDate: '2026-02-15' },
                    written_cert: { uploaded: true, fileName: 'Written_Exam_Certificate_JSmith.pdf', fileType: 'application/pdf', fileSize: 180000, uploadDate: '2025-10-20' },
                    logbook_transponder: { uploaded: true, fileName: 'Transponder_Test_Logbook_N12345.pdf', fileType: 'application/pdf', fileSize: 320000, uploadDate: '2026-01-08' },
                    logbook_pitot: { uploaded: true, fileName: 'PitotStatic_Test_Logbook_N12345.pdf', fileType: 'application/pdf', fileSize: 295000, uploadDate: '2026-01-12' },
                    form_337: { uploaded: true, fileName: 'FAA_Form337_GPS_Install_N12345.pdf', fileType: 'application/pdf', fileSize: 410000, uploadDate: '2026-01-20' },
                    transponder_form: { uploaded: true, fileName: 'Transponder_Test_Data_N12345.pdf', fileType: 'application/pdf', fileSize: 185000, uploadDate: '2026-01-10' },
                    deviation_card: { uploaded: true, fileName: 'Compass_Deviation_Card_N12345.jpg', fileType: 'image/jpeg', fileSize: 520000, uploadDate: '2026-02-05' },
                    work_samples: { uploaded: true, fileName: 'Wire_Harness_Photos.zip', fileType: 'application/zip', fileSize: 1800000, uploadDate: '2026-02-08' },
                    ojt_log: { uploaded: true, fileName: 'OJT_Hours_Log_JSmith_2025-2026.xlsx', fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileSize: 95000, uploadDate: '2026-02-20' }
                },
                gallery: [
                    { id: 'g1', category: 'work_photos', title: 'GTN 750Xi Wire Harness', description: 'Custom wire harness fabricated for Garmin GTN 750Xi installation in Cessna 182 N12345. Includes shielded cables, D-sub connectors, and heat shrink labels.', fileName: 'harness_gtn750xi_n12345.jpg', fileType: 'image/jpeg', fileSize: 2400000, uploadDate: '2026-01-15' },
                    { id: 'g2', category: 'work_photos', title: 'Transponder Antenna Install', description: 'L-band antenna installation on belly of Piper PA-28. Proper doubler plate, sealant, and ground plane verification.', fileName: 'xpdr_antenna_pa28.jpg', fileType: 'image/jpeg', fileSize: 1800000, uploadDate: '2026-01-22' },
                    { id: 'g3', category: 'documentation', title: 'IFR GPS Installation 337', description: 'Completed FAA Form 337 for GTN 750Xi IFR GPS installation. Major alteration per AC 43-2B with all required fields.', fileName: 'form337_gtn750xi_complete.pdf', fileType: 'application/pdf', fileSize: 450000, uploadDate: '2026-02-01' },
                    { id: 'g4', category: 'work_photos', title: 'Pitot-Static Test Setup', description: 'Pitot-static test equipment connected to Cessna 172 for 91.411 biennial test. RVSM-capable test set with calibration current.', fileName: 'pitot_static_test_setup.jpg', fileType: 'image/jpeg', fileSize: 2100000, uploadDate: '2026-02-08' }
                ],
                endorsement: { text: 'John has demonstrated exceptional growth throughout his apprenticeship. His wire harness work is consistently clean and professional, and his troubleshooting instincts are developing rapidly. He takes initiative on difficult installations and communicates clearly with pilots and customers. I recommend him without reservation for CAET Advanced certification.', author: 'Thomas Anderson', authorId: 's1', date: '2026-03-01' }
            },
            a2: {
                items: {
                    qual_record: { uploaded: true, fileName: 'CAET_Qual_Record_DMiller.pdf', fileType: 'application/pdf', fileSize: 240000, uploadDate: '2025-12-01' },
                    written_cert: { uploaded: true, fileName: 'Written_Cert_DMiller.pdf', fileType: 'application/pdf', fileSize: 175000, uploadDate: '2025-08-25' }
                },
                gallery: [],
                endorsement: null
            },
            a3: { items: {}, gallery: [], endorsement: null }
        },
        certDates: {
            a1: { written_date: '2025-10-18', written_passed: true, oral_date: '2026-03-05', oral_passed: true, cert_date: null },
            a2: { written_date: '2025-08-22', written_passed: true, oral_date: null, oral_passed: false, cert_date: null },
            a3: { written_date: null, written_passed: false, oral_date: null, oral_passed: false, cert_date: null }
        },
        oralBoards: [
            {
                id: 'ob1', candidateId: 'a1', candidateName: 'John Smith',
                status: 'completed', scheduledDate: '2026-03-05',
                evaluators: [
                    {
                        id: 'c1', name: 'Patricia Hayes',
                        scores: { technical: 4, practical: 5, professional: 4 },
                        comments: { technical: 'Strong regulatory knowledge. Correctly cited Part 43 and 91.413 requirements without hesitation.', practical: 'Exceptional troubleshooting methodology. Systematically isolated a transponder fault and clearly explained each step.', professional: 'Professional demeanor. Communicated clearly and demonstrated strong safety awareness throughout.' }
                    },
                    {
                        id: 'c2', name: 'Richard Kowalski',
                        scores: { technical: 4, practical: 4, professional: 5 },
                        comments: { technical: 'Good understanding of approved data requirements. Minor hesitation on STC vs field approval distinction.', practical: 'Competent hands-on reasoning. Proper tool selection and measurement technique.', professional: 'Outstanding professionalism. Excellent communication skills and mature safety consciousness.' }
                    }
                ],
                result: 'qualified',
                completedDate: '2026-03-05',
                notes: 'Candidate demonstrated strong competency across all phases. Ready for CAET Advanced certification.'
            }
        ],
        rtiLog: {
            a1: [
                { id: 'rti1', secNum: 1, hours: 4.0, date: '2025-10-20', desc: 'Part 43 regulatory review with evaluator. Covered maintenance authority, approved data hierarchy.', approved: true, approvedBy: 's1' },
                { id: 'rti2', secNum: 1, hours: 2.5, date: '2025-10-22', desc: 'AD research exercise — practiced FAA AD search tools for transponders and GPS units.', approved: true, approvedBy: 's1' },
                { id: 'rti3', secNum: 2, hours: 3.0, date: '2025-10-28', desc: 'Documentation workshop — wrote practice logbook entries and reviewed Form 337 requirements.', approved: true, approvedBy: 's1' },
                { id: 'rti4', secNum: 3, hours: 3.5, date: '2025-11-05', desc: 'Wiring diagram reading session — identified symbols, wire types, and traced signal paths on installation drawings.', approved: true, approvedBy: 's1' },
                { id: 'rti5', secNum: 4, hours: 5.0, date: '2025-11-12', desc: 'Hands-on wire harness lab — crimp technique, shielding, coax termination practice.', approved: true, approvedBy: 's1' },
                { id: 'rti6', secNum: 5, hours: 2.0, date: '2025-11-20', desc: 'Audio panel theory review — intercom modes, marker beacon system, signal flow.', approved: true, approvedBy: 's1' },
                { id: 'rti7', secNum: 6, hours: 4.0, date: '2025-12-01', desc: 'Navigation systems classroom — VOR/ILS theory, GPS/WAAS, CDI scaling differences.', approved: true, approvedBy: 's1' },
                { id: 'rti8', secNum: 7, hours: 2.5, date: '2025-12-08', desc: 'COM systems and antenna theory — VSWR measurement, bonding requirements, troubleshooting.', approved: true, approvedBy: 's1' },
                { id: 'rti9', secNum: 8, hours: 3.5, date: '2025-12-15', desc: 'Transponder and ADS-B systems — modes A/C/S, 91.413 test procedures, ADS-B Out verification.', approved: true, approvedBy: 's1' },
                { id: 'rti10', secNum: 9, hours: 4.0, date: '2026-01-06', desc: 'Pitot-static systems deep dive — leak testing theory, altimeter tolerances, 91.411 documentation.', approved: true, approvedBy: 's1' },
                { id: 'rti11', secNum: 10, hours: 3.0, date: '2026-01-15', desc: 'Autopilot systems review — servo types, disconnect methods, trim runaway procedures.', approved: true, approvedBy: 's1' },
                { id: 'rti12', secNum: 11, hours: 2.0, date: '2026-01-22', desc: 'Compass systems classroom — swing procedure, deviation card, slaved compass theory.', approved: true, approvedBy: 's1' },
                { id: 'rti13', secNum: 12, hours: 2.0, date: '2026-02-01', desc: 'EFB and connectivity review — mounting requirements, data sources, WiFi considerations.', approved: true, approvedBy: 's1' },
                { id: 'rti14', secNum: 13, hours: 3.5, date: '2026-02-10', desc: 'FMS operations — database management, flight plan entry, approach procedures, route discontinuities.', approved: false },
                { id: 'rti15', secNum: 'A1', hours: 8.0, date: '2026-02-15', desc: 'Aircraft structures — rivet identification, basic sheet metal drilling, hardware identification exercise.', approved: true, approvedBy: 's1', program: 'ojt' },
                { id: 'rti16', secNum: 'A1', hours: 6.0, date: '2026-02-20', desc: 'Structural repair assist — helped senior tech with panel repair on Cessna 182. Deburring and dimpling practice.', approved: true, approvedBy: 's1', program: 'ojt' },
                { id: 'rti17', secNum: 'A2', hours: 4.0, date: '2026-02-22', desc: 'Ground operations — aircraft tie-down, FOD walk, GPU connect/disconnect, marshaling signals.', approved: true, approvedBy: 's1', program: 'ojt' },
                { id: 'rti18', secNum: 'A3', hours: 6.0, date: '2026-02-28', desc: 'Quality systems overview — reviewed shop QSM, inspection procedures, human factors dirty dozen discussion.', approved: true, approvedBy: 's1', program: 'ojt' },
                { id: 'rti19', secNum: 'A4', hours: 4.0, date: '2026-03-05', desc: 'Engine instrument identification — traced EGT/CHT sensor signals, identified ARINC 429 data bus connections.', approved: true, approvedBy: 's1', program: 'ojt' },
                { id: 'rti19b', secNum: 'A3', hours: 4.0, date: '2026-03-10', desc: 'Mentoring session — guided new junior tech through wire stripping and crimping basics.', approved: false, program: 'ojt' }
            ],
            a2: [
                { id: 'rti20', secNum: 1, hours: 4.0, date: '2025-09-15', desc: 'Regulatory overview — Part 43 maintenance authority and approved data.', approved: true, approvedBy: 's1' },
                { id: 'rti21', secNum: 2, hours: 3.0, date: '2025-09-22', desc: 'Documentation practice — logbook entries and Form 337 completion.', approved: true, approvedBy: 's1' },
                { id: 'rti22', secNum: 3, hours: 2.5, date: '2025-10-01', desc: 'Wiring diagram reading and interpretation session.', approved: true, approvedBy: 's1' },
                { id: 'rti23', secNum: 4, hours: 4.0, date: '2025-10-15', desc: 'Wire harness fabrication lab — crimping and testing.', approved: true, approvedBy: 's1' },
                { id: 'rti24', secNum: 5, hours: 2.0, date: '2025-11-01', desc: 'Audio panel and intercom theory session.', approved: false }
            ],
            a3: [
                { id: 'rti30', secNum: 1, hours: 3.0, date: '2025-11-10', desc: 'Introduction to Part 43 and avionics maintenance regulations.', approved: true, approvedBy: 's1' },
                { id: 'rti31', secNum: 2, hours: 2.0, date: '2025-11-20', desc: 'Logbook entry practice and documentation requirements.', approved: false }
            ]
        },
        quizResults: { a1: {}, a2: {}, a3: {}, s1: {}, c1: {}, c2: {} },
        supTrainingResults: { s1: {} },
        customCourseResults: {},
        assignedTraining: {},
        customCourses: [
            {
                id: 'custom_1', title: 'Shop Safety & FOD Prevention', targetRole: 'both',
                desc: 'Critical safety practices for the shop floor: FOD prevention, PPE requirements, and hazard awareness.',
                content: [
                    { type: 'text', title: 'What is FOD?', body: 'Foreign Object Debris (FOD) is one of the most preventable yet dangerous hazards in aviation maintenance. A single loose washer, wire clipping, or tool left inside an aircraft can cause catastrophic damage to flight control systems, engines, or avionics.' },
                    { type: 'warning', body: 'Before closing ANY access panel or replacing ANY cowling, perform a FOD check: account for all tools, hardware, and debris. Use FOD bags at every work station. Never set loose hardware on top of an aircraft.' },
                    { type: 'text', title: 'Personal Protective Equipment', body: 'PPE requirements in the avionics shop: safety glasses when drilling or cutting, hearing protection near running engines or APUs, ESD wrist straps when handling circuit boards, and proper footwear at all times.' },
                    { type: 'callout', body: 'Chemical safety: know the location of MSDS/SDS sheets for all solvents, cleaners, and adhesives used in the shop. Use adequate ventilation when using contact cleaner, flux, or conformal coating.' },
                    { type: 'key', body: 'Always perform a FOD check before closing panels. Wear proper PPE for every task. Know your MSDS/SDS sheets. If in doubt, ask your supervisor.' }
                ],
                quiz: [
                    { q: 'What is FOD?', opts: ['A type of antenna', 'Foreign Object Debris — loose items that can damage aircraft systems', 'A wiring diagram symbol', 'A regulatory requirement number'], a: 1 },
                    { q: 'When should you perform a FOD check?', opts: ['Only at end of shift', 'Before closing any access panel or cowling', 'Only during annual inspections', 'Only when the customer requests it'], a: 1 },
                    { q: 'ESD wrist straps should be worn when:', opts: ['Drilling holes', 'Handling circuit boards and sensitive electronic components', 'Walking in the hangar', 'Fueling the aircraft'], a: 1 }
                ],
                createdDate: '2026-02-10', createdBy: 'Shop Manager'
            }
        ],
        notifications: {
            a1: [
                { id: 'n1', msg: 'Thomas Anderson signed off Task 9.4.5 — great work!', time: '2026-02-22', read: false, type: 'success' },
                { id: 'n2', msg: 'Task 10.4.5 requires rework. See supervisor feedback.', time: '2026-02-20', read: false, type: 'warning' }
            ], a2: [], a3: [], s1: [
                { id: 'n3', msg: 'John Smith requested sign-off on 3 tasks.', time: '2026-02-25', read: false, type: 'info' },
                { id: 'n4', msg: 'David Miller requested sign-off on 2 tasks.', time: '2026-02-28', read: false, type: 'info' },
                { id: 'n5', msg: 'Admin assigned training: "Evaluator Roles & Responsibilities"', time: '2026-02-15', read: true, type: 'info' }
            ], admin1: []
        },
        boardRequests: []
    };
}

function createFreshState(shopName) {
    return {
        shopName: shopName || 'My Shop',
        people: [],
        taskData: {},
        portfolio: {},
        certDates: {},
        oralBoards: [],
        rtiLog: {},
        quizResults: {},
        supTrainingResults: {},
        customCourseResults: {},
        assignedTraining: {},
        customCourses: [],
        notifications: {},
        boardRequests: []
    };
}

function addPersonToState(name, role, supervisorId) {
    const id = role.charAt(0) + '_' + Date.now();
    const person = { id, name, role };
    if (role === 'apprentice' && supervisorId) person.supervisorId = supervisorId;
    if (role === 'apprentice') {
        person.apprenticeship = {
            enrollDate: new Date().toISOString().slice(0, 10),
            expectedCompletion: null,
            rapNumber: null,
            sponsor: STATE.shopName || null,
            mentorId: supervisorId || null,
            status: 'active'
        };
    }
    STATE.people.push(person);
    if (role === 'apprentice') {
        STATE.taskData[id] = {};
        STATE.portfolio[id] = { items: {}, gallery: [], endorsement: null };
        STATE.certDates[id] = { written_date: null, written_passed: false, oral_date: null, oral_passed: false, cert_date: null };
        STATE.rtiLog[id] = [];
        STATE.quizResults[id] = {};
    }
    if (role === 'supervisor') {
        STATE.supTrainingResults[id] = {};
    }
    STATE.notifications[id] = [];
    saveState();
    return person;
}

function removePersonFromState(personId) {
    STATE.people = STATE.people.filter(p => p.id !== personId);
    delete STATE.taskData[personId];
    delete STATE.portfolio[personId];
    delete STATE.certDates[personId];
    if (STATE.rtiLog) delete STATE.rtiLog[personId];
    delete STATE.quizResults[personId];
    delete STATE.supTrainingResults[personId];
    delete STATE.notifications[personId];
    // Remove supervisor assignments pointing to deleted person
    STATE.people.filter(p => p.supervisorId === personId).forEach(p => { p.supervisorId = null; });
    saveState();
}
