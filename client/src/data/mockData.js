// ============================================
// CAMPUSBUDDY AI — MOCK DATA
// Narula Institute of Technology, Kolkata
// ============================================

// Campus center coordinates
export const CAMPUS_CENTER = [88.3791, 22.6767]; // [lng, lat]

// ===== DEMO USERS =====
export const DEMO_USERS = {
  'student@test.com': {
    uid: 'demo-student-001',
    email: 'student@test.com',
    password: '123456',
    displayName: 'Arjun Sharma',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    semester: '5th Semester',
    rollNo: 'NIT/CSE/2024/042',
    avatar: null,
  },
  'faculty@test.com': {
    uid: 'demo-faculty-001',
    email: 'faculty@test.com',
    password: '123456',
    displayName: 'Dr. Priya Mukherjee',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    avatar: null,
  },
  'admin@test.com': {
    uid: 'demo-admin-001',
    email: 'admin@test.com',
    password: '123456',
    displayName: 'Rajesh Kumar',
    role: 'admin',
    department: 'Administration',
    designation: 'Campus Administrator',
    avatar: null,
  },
};

// ===== TODAY'S CLASSES (CSE 3rd Year) =====
export const TODAYS_CLASSES = [
  {
    id: 'cls-1',
    subject: 'Data Structures & Algorithms',
    code: 'CS-301',
    faculty: 'Dr. Priya Mukherjee',
    time: '9:00 AM - 10:00 AM',
    startHour: 9,
    endHour: 10,
    room: 'Room 301, Block A',
    type: 'Lecture',
    color: '#06b6d4',
  },
  {
    id: 'cls-2',
    subject: 'Database Management Systems',
    code: 'CS-302',
    faculty: 'Prof. Amit Roy',
    time: '10:15 AM - 11:15 AM',
    startHour: 10,
    endHour: 11,
    room: 'Room 205, Block B',
    type: 'Lecture',
    color: '#8b5cf6',
  },
  {
    id: 'cls-3',
    subject: 'Operating Systems Lab',
    code: 'CS-391',
    faculty: 'Dr. Sanjay Ghosh',
    time: '11:30 AM - 1:00 PM',
    startHour: 11,
    endHour: 13,
    room: 'Lab 102, CSE Block',
    type: 'Lab',
    color: '#10b981',
  },
  {
    id: 'cls-4',
    subject: 'Software Engineering',
    code: 'CS-304',
    faculty: 'Prof. Neha Das',
    time: '2:00 PM - 3:00 PM',
    startHour: 14,
    endHour: 15,
    room: 'Room 401, Block A',
    type: 'Lecture',
    color: '#f59e0b',
  },
];

// ===== DEADLINES =====
export const DEADLINES = [
  {
    id: 'dl-1',
    title: 'DSA Assignment #5 — Binary Trees',
    subject: 'Data Structures & Algorithms',
    dueDate: (() => {
      const d = new Date();
      d.setHours(d.getHours() + 6);
      return d.toISOString();
    })(),
    type: 'assignment',
    urgency: 'high',
    description: 'Implement AVL tree insertion, deletion, and balancing operations in C++.',
  },
  {
    id: 'dl-2',
    title: 'DBMS Mini Project — Library Management',
    subject: 'Database Management Systems',
    dueDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      return d.toISOString();
    })(),
    type: 'project',
    urgency: 'medium',
    description: 'Design ER diagram and implement CRUD operations for a library system using MySQL.',
  },
  {
    id: 'dl-3',
    title: 'Mid-Semester Examination',
    subject: 'Software Engineering',
    dueDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString();
    })(),
    type: 'exam',
    urgency: 'low',
    description: 'Covers: SDLC models, Agile methodology, UML diagrams, and requirement engineering.',
  },
];

// ===== MESS MENU =====
export const MESS_MENU = {
  breakfast: {
    label: 'Breakfast',
    time: '7:30 AM - 9:00 AM',
    icon: '☀️',
    items: ['Aloo Paratha', 'Bread & Butter', 'Boiled Eggs', 'Cornflakes with Milk', 'Tea / Coffee'],
  },
  lunch: {
    label: 'Lunch',
    time: '12:30 PM - 2:00 PM',
    icon: '🌤️',
    items: ['Steamed Rice', 'Dal Tadka', 'Chicken Curry', 'Mixed Veg', 'Roti', 'Salad', 'Raita'],
  },
  snacks: {
    label: 'Snacks',
    time: '4:30 PM - 5:30 PM',
    icon: '🍿',
    items: ['Samosa (2 pcs)', 'Chai', 'Biscuits'],
  },
  dinner: {
    label: 'Dinner',
    time: '7:30 PM - 9:00 PM',
    icon: '🌙',
    items: ['Jeera Rice', 'Paneer Butter Masala', 'Fish Fry', 'Dal Fry', 'Chapati', 'Gulab Jamun'],
  },
};

// ===== NOTICES =====
export const NOTICES = [
  {
    id: 'nt-1',
    title: 'Mid-Semester Exam Schedule Released',
    category: 'Exam',
    date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString();
    })(),
    body: 'Mid-semester examinations for all departments will commence from next Monday. Check departmental notice board for detailed timetable.',
    priority: 'high',
    author: 'Controller of Examinations',
  },
  {
    id: 'nt-2',
    title: 'TechNova 2026 — Annual Tech Fest',
    category: 'Event',
    date: new Date().toISOString(),
    body: 'Register now for TechNova 2026! Events include Hackathon, Robo-Wars, Code Sprint, and Project Exhibition. Registration closes this Friday.',
    priority: 'medium',
    author: 'Student Activities Cell',
  },
  {
    id: 'nt-3',
    title: 'Infosys Campus Placement Drive',
    category: 'Placement',
    date: new Date().toISOString(),
    body: 'Infosys is visiting campus on 25th August for CSE, IT, and ECE students. Eligible: 60%+ aggregate, no active backlogs. Pre-register on the placement portal.',
    priority: 'high',
    author: 'Training & Placement Cell',
  },
  {
    id: 'nt-4',
    title: 'Library Extended Hours During Exams',
    category: 'General',
    date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 2);
      return d.toISOString();
    })(),
    body: 'The Central Library will remain open until 10:00 PM during the examination period. Students are requested to carry their ID cards.',
    priority: 'low',
    author: 'Chief Librarian',
  },
];

// ===== CAMPUS BUILDINGS / MAP PINS =====
export const CAMPUS_BUILDINGS = [
  {
    id: 'bld-1',
    name: 'Main Academic Building',
    shortName: 'Main Block',
    emoji: '🏛️',
    coordinates: [88.3790, 22.6770],
    description: 'Houses classrooms, faculty offices, and the administrative wing.',
    hours: '8:00 AM - 6:00 PM',
    category: 'academic',
    color: '#06b6d4',
  },
  {
    id: 'bld-2',
    name: 'Central Library',
    shortName: 'Library',
    emoji: '📚',
    coordinates: [88.3785, 22.6765],
    description: '25,000+ books, digital resource center, reading rooms, and OPAC system.',
    hours: '8:00 AM - 8:00 PM (Extended to 10 PM during exams)',
    category: 'facility',
    color: '#8b5cf6',
  },
  {
    id: 'bld-3',
    name: 'Campus Canteen',
    shortName: 'Canteen',
    emoji: '🍽️',
    coordinates: [88.3795, 22.6763],
    description: 'Main dining area with mess hall and snack counter. Serves 500+ students daily.',
    hours: '7:30 AM - 9:00 PM',
    category: 'food',
    color: '#f59e0b',
  },
  {
    id: 'bld-4',
    name: 'CSE Department & Labs',
    shortName: 'CSE Lab',
    emoji: '💻',
    coordinates: [88.3798, 22.6772],
    description: 'Computer labs with 200+ workstations, AI/ML lab, and networking lab.',
    hours: '9:00 AM - 5:00 PM',
    category: 'academic',
    color: '#10b981',
  },
  {
    id: 'bld-5',
    name: 'ECE Department & Labs',
    shortName: 'ECE Lab',
    emoji: '📡',
    coordinates: [88.3782, 22.6773],
    description: 'Electronics labs, communication lab, VLSI design lab, and embedded systems lab.',
    hours: '9:00 AM - 5:00 PM',
    category: 'academic',
    color: '#ef4444',
  },
  {
    id: 'bld-6',
    name: 'Auditorium',
    shortName: 'Auditorium',
    emoji: '🎭',
    coordinates: [88.3788, 22.6760],
    description: 'Multi-purpose auditorium with 800-seat capacity for events and seminars.',
    hours: 'Event-based',
    category: 'facility',
    color: '#f472b6',
  },
  {
    id: 'bld-7',
    name: 'Boys Hostel',
    shortName: 'Boys Hostel',
    emoji: '🏠',
    coordinates: [88.3800, 22.6758],
    description: 'Residential hostel with 300 rooms, common room, and indoor games area.',
    hours: '24/7 (Gate closes at 10 PM)',
    category: 'residential',
    color: '#64748b',
  },
  {
    id: 'bld-8',
    name: 'Sports Complex',
    shortName: 'Sports',
    emoji: '⚽',
    coordinates: [88.3776, 22.6757],
    description: 'Football ground, basketball court, cricket nets, swimming pool, and gymnasium.',
    hours: '6:00 AM - 8:00 PM',
    category: 'sports',
    color: '#22c55e',
  },
];

// ===== FACULTY AVAILABILITY =====
export const FACULTY_AVAILABILITY = [
  {
    id: 'fac-1',
    name: 'Dr. Priya Mukherjee',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    email: 'priya.mukherjee@nit.edu.in',
    phone: '+91-33-2583-XXXX',
    cabin: 'Room 312, Block A (Main Academic Building)',
    status: 'In Cabin',
    statusColor: '#10b981',
    currentClass: null,
    nextAvailable: 'Available now',
    subjects: ['Data Structures & Algorithms', 'Advanced Algorithms'],
    image: '👩‍🏫',
  },
  {
    id: 'fac-2',
    name: 'Prof. Amit Roy',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    email: 'amit.roy@nit.edu.in',
    phone: '+91-33-2583-XXXX',
    cabin: 'Room 208, Block B',
    status: 'In Class',
    statusColor: '#f59e0b',
    currentClass: {
      subject: 'Database Management Systems',
      room: 'Room 205, Block B',
      time: '10:15 AM - 11:15 AM',
    },
    nextAvailable: 'After 11:15 AM',
    subjects: ['Database Management Systems', 'SQL & NoSQL'],
    image: '👨‍🏫',
  },
  {
    id: 'fac-3',
    name: 'Dr. Sanjay Ghosh',
    department: 'Computer Science & Engineering',
    designation: 'Professor',
    email: 'sanjay.ghosh@nit.edu.in',
    phone: '+91-33-2583-XXXX',
    cabin: 'Room 415, CSE Block',
    status: 'On Leave',
    statusColor: '#ef4444',
    currentClass: null,
    nextAvailable: 'Tomorrow 9:00 AM',
    subjects: ['Operating Systems', 'Distributed Systems'],
    image: '👨‍🏫',
  },
  {
    id: 'fac-4',
    name: 'Prof. Neha Das',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    email: 'neha.das@nit.edu.in',
    phone: '+91-33-2583-XXXX',
    cabin: 'Room 402, Block A',
    status: 'In Cabin',
    statusColor: '#10b981',
    currentClass: null,
    nextAvailable: 'Available now',
    subjects: ['Software Engineering', 'Agile Methodologies'],
    image: '👩‍🏫',
  },
  {
    id: 'fac-5',
    name: 'Dr. Arunava Sen',
    department: 'Electronics & Communication Engineering',
    designation: 'Professor & HOD',
    email: 'arunava.sen@nit.edu.in',
    phone: '+91-33-2583-XXXX',
    cabin: 'Room 501, ECE Block',
    status: 'In Class',
    statusColor: '#f59e0b',
    currentClass: {
      subject: 'Digital Signal Processing',
      room: 'Room 303, ECE Lab',
      time: '11:30 AM - 12:30 PM',
    },
    nextAvailable: 'After 12:30 PM',
    subjects: ['Digital Signal Processing', 'Wireless Communication'],
    image: '👨‍🏫',
  },
  {
    id: 'fac-6',
    name: 'Prof. Soma Chatterjee',
    department: 'Electrical Engineering',
    designation: 'Associate Professor',
    email: 'soma.chatterjee@nit.edu.in',
    phone: '+91-33-2583-XXXX',
    cabin: 'Room 105, EE Block',
    status: 'In Cabin',
    statusColor: '#10b981',
    currentClass: null,
    nextAvailable: 'Available now',
    subjects: ['Power Systems', 'Control Systems'],
    image: '👩‍🏫',
  },
  {
    id: 'fac-7',
    name: 'Dr. Rajesh Kumar',
    department: 'Mechanical Engineering',
    designation: 'Professor',
    email: 'rajesh.kumar@nit.edu.in',
    phone: '+91-33-2583-XXXX',
    cabin: 'Room 201, ME Block',
    status: 'On Leave',
    statusColor: '#ef4444',
    currentClass: null,
    nextAvailable: 'Monday 9:00 AM',
    subjects: ['Thermodynamics', 'Fluid Mechanics'],
    image: '👨‍🏫',
  },
  {
    id: 'fac-8',
    name: 'Prof. Indrani Banerjee',
    department: 'Civil Engineering',
    designation: 'Assistant Professor',
    email: 'indrani.banerjee@nit.edu.in',
    phone: '+91-33-2583-XXXX',
    cabin: 'Room 110, CE Block',
    status: 'In Cabin',
    statusColor: '#10b981',
    currentClass: null,
    nextAvailable: 'Available now',
    subjects: ['Structural Analysis', 'Concrete Technology'],
    image: '👩‍🏫',
  },
];

// ===== RAG KNOWLEDGE BASE =====
export const KNOWLEDGE_BASE = [
  {
    id: 'kb-1',
    topic: 'campus location address',
    question: 'Where is Narula Institute of Technology located?',
    answer: 'Narula Institute of Technology (NiT) is located at 81, Nilgunj Road, Agarpara, Kolkata - 700109, West Bengal, India. It is well-connected by road and rail. The nearest railway station is Agarpara Station on the Sealdah-Ranaghat line.',
    keywords: ['location', 'address', 'where', 'directions', 'reach', 'agarpara', 'kolkata', 'nilgunj'],
  },
  {
    id: 'kb-2',
    topic: 'departments offered',
    question: 'What departments/courses does NIT offer?',
    answer: 'Narula Institute of Technology offers undergraduate and postgraduate programs in: Computer Science & Engineering (CSE), Electronics & Communication Engineering (ECE), Information Technology (IT), Electrical Engineering (EE), Civil Engineering (CE), Mechanical Engineering (ME), Electronics & Computer Science, Basic Science & Humanities, BBA, BCA, and MCA.',
    keywords: ['departments', 'courses', 'programs', 'branches', 'streams', 'cse', 'ece', 'it', 'mechanical', 'civil', 'electrical'],
  },
  {
    id: 'kb-3',
    topic: 'library information',
    question: 'What are the library timings and facilities?',
    answer: 'The Central Library is open from 8:00 AM to 8:00 PM on regular days, extended to 10:00 PM during examination periods. It houses over 25,000 books, digital resources, OPAC system, reading rooms, and a reference section. Students need their ID card for entry. The library is located near the main academic building.',
    keywords: ['library', 'books', 'reading', 'timings', 'hours', 'study', 'borrow', 'reference'],
  },
  {
    id: 'kb-4',
    topic: 'canteen mess food',
    question: 'What are the canteen/mess timings?',
    answer: 'The campus canteen and mess hall operates as follows: Breakfast: 7:30 AM - 9:00 AM, Lunch: 12:30 PM - 2:00 PM, Snacks: 4:30 PM - 5:30 PM, Dinner: 7:30 PM - 9:00 PM. The canteen serves both vegetarian and non-vegetarian options. A snack counter is also available throughout the day.',
    keywords: ['canteen', 'mess', 'food', 'lunch', 'dinner', 'breakfast', 'snacks', 'eat', 'menu', 'timing'],
  },
  {
    id: 'kb-5',
    topic: 'hostel accommodation',
    question: 'Tell me about the hostel facilities.',
    answer: 'NIT has separate hostels for boys and girls. The Boys Hostel has 300 rooms with common rooms, indoor games, and Wi-Fi. Gate timings: opens at 6 AM, closes at 10 PM. The Girls Hostel has 150 rooms with similar facilities and 24/7 security. Both hostels have mess facilities, laundry service, and medical room.',
    keywords: ['hostel', 'accommodation', 'rooms', 'stay', 'boys', 'girls', 'residential', 'gate'],
  },
  {
    id: 'kb-6',
    topic: 'cse lab computer lab',
    question: 'Where are the computer labs?',
    answer: 'The CSE Department & Labs are located in the eastern wing of the campus. There are 200+ workstations across multiple labs: General Computing Lab, AI/ML Lab, Networking Lab, and Project Lab. Lab hours are 9:00 AM to 5:00 PM. Students can access labs during free periods with prior permission from the HOD.',
    keywords: ['lab', 'computer', 'cse', 'programming', 'coding', 'workstation', 'ai', 'ml', 'networking'],
  },
  {
    id: 'kb-7',
    topic: 'placement training',
    question: 'How is the placement record at NIT?',
    answer: 'The Training & Placement Cell actively coordinates campus placements. Top recruiters include Infosys, TCS, Wipro, Cognizant, Capgemini, and Accenture. The placement percentage for CSE averages around 75-80%. Pre-placement training includes aptitude, coding, and soft skills programs. The placement cell is located on the first floor of the Main Academic Building.',
    keywords: ['placement', 'job', 'recruitment', 'company', 'infosys', 'tcs', 'salary', 'package', 'career', 'training'],
  },
  {
    id: 'kb-8',
    topic: 'sports facilities',
    question: 'What sports facilities are available?',
    answer: 'The Sports Complex includes: a full-size football ground, basketball court, cricket practice nets, swimming pool (seasonal), gymnasium with modern equipment, and table tennis room. The complex is open from 6:00 AM to 8:00 PM. Annual sports fest "Sportica" is held in January.',
    keywords: ['sports', 'football', 'cricket', 'basketball', 'gym', 'swimming', 'games', 'playground', 'exercise'],
  },
  {
    id: 'kb-9',
    topic: 'auditorium events',
    question: 'Tell me about the auditorium.',
    answer: 'The auditorium has a seating capacity of 800 and is equipped with modern audio-visual systems, air conditioning, and stage lighting. It hosts seminars, guest lectures, cultural events, and the annual tech fest TechNova. Booking can be done through the administrative office.',
    keywords: ['auditorium', 'event', 'seminar', 'cultural', 'fest', 'stage', 'program', 'function', 'technova'],
  },
  {
    id: 'kb-10',
    topic: 'examination schedule',
    question: 'When are the exams?',
    answer: 'Mid-semester examinations are scheduled to begin next week. The detailed timetable has been posted on departmental notice boards and the student portal. Exam timings are generally from 10:00 AM to 1:00 PM. Students must carry their admit card and college ID. The examination cell is on the second floor of the Main Building.',
    keywords: ['exam', 'examination', 'test', 'mid-sem', 'end-sem', 'schedule', 'timetable', 'admit', 'marks', 'result'],
  },
  {
    id: 'kb-11',
    topic: 'wifi internet',
    question: 'Is there Wi-Fi on campus?',
    answer: 'Yes! NIT provides campus-wide Wi-Fi connectivity. The network name is "NIT-Campus". Students can log in with their enrollment number and registered password. Wi-Fi is available in all academic blocks, library, hostels, and canteen. Speed: 100 Mbps shared. For connection issues, contact the IT support desk in the CSE block.',
    keywords: ['wifi', 'wi-fi', 'internet', 'network', 'connectivity', 'broadband', 'login', 'password'],
  },
  {
    id: 'kb-12',
    topic: 'medical health center',
    question: 'Is there a medical facility on campus?',
    answer: 'Yes, the campus has a Medical Center near the hostel area staffed by a resident doctor and nurse. It is open from 9:00 AM to 5:00 PM on weekdays. For emergencies, the nearest hospital is KPC Medical College (2 km away). First-aid kits are available in all departments and hostels.',
    keywords: ['medical', 'doctor', 'health', 'hospital', 'sick', 'medicine', 'first-aid', 'emergency', 'clinic'],
  },
  {
    id: 'kb-13',
    topic: 'directions navigation',
    question: 'How do I get to the library from the main gate?',
    answer: 'From the Main Gate, walk straight along the central pathway for about 100 meters. The Main Academic Building will be on your right. The Central Library is just behind the Main Building, on the left side. Look for the "📚 Library" signboard. Total walking time: approximately 3 minutes.',
    keywords: ['direction', 'navigate', 'route', 'how to get', 'where is', 'find', 'way', 'walk', 'path', 'go to'],
  },
  {
    id: 'kb-14',
    topic: 'timetable schedule classes',
    question: 'What is the class timetable for CSE 3rd year?',
    answer: 'The CSE 3rd Year (5th Semester) schedule for today: 9:00-10:00 AM: Data Structures & Algorithms (Room 301, Block A) with Dr. Priya Mukherjee, 10:15-11:15 AM: DBMS (Room 205, Block B) with Prof. Amit Roy, 11:30 AM-1:00 PM: OS Lab (Lab 102, CSE Block) with Dr. Sanjay Ghosh, 2:00-3:00 PM: Software Engineering (Room 401, Block A) with Prof. Neha Das.',
    keywords: ['timetable', 'schedule', 'class', 'lecture', 'today', 'period', 'subject', 'teacher', 'faculty', 'room'],
  },
  {
    id: 'kb-15',
    topic: 'principal contact administration',
    question: 'How can I contact the administration?',
    answer: 'Administrative Office: First floor, Main Academic Building. Hours: 9:30 AM - 4:30 PM (Mon-Fri). Principal: Dr. S.K. Narula. General inquiries: reception desk at main entrance. For urgent matters, contact the admin helpline displayed on the college notice board. Student grievance cell is on the ground floor.',
    keywords: ['contact', 'phone', 'principal', 'admin', 'office', 'enquiry', 'complaint', 'grievance', 'help'],
  },
  {
    id: 'kb-16',
    topic: 'fees payment',
    question: 'How do I pay my fees?',
    answer: 'Fees can be paid online through the college student portal or at the accounts office (Ground Floor, Main Building). The accounts office accepts payments from 10:00 AM to 3:00 PM on weekdays. Accepted methods: UPI, NEFT, demand draft, or cash. Fee receipts are generated instantly for online payments.',
    keywords: ['fees', 'payment', 'pay', 'tuition', 'accounts', 'money', 'scholarship', 'concession'],
  },
  {
    id: 'kb-17',
    topic: 'bus transport',
    question: 'Is there a college bus service?',
    answer: 'Yes, NIT operates a fleet of buses covering major routes in Kolkata: Howrah, Sealdah, Salt Lake, Barasat, Barrackpore, and Dum Dum. Bus timings: Morning pickup at 7:30 AM from respective stops, departure from campus at 5:00 PM. Bus pass can be obtained from the transport office next to the main gate.',
    keywords: ['bus', 'transport', 'commute', 'travel', 'route', 'pickup', 'drop', 'vehicle'],
  },
  {
    id: 'kb-18',
    topic: 'clubs societies',
    question: 'What student clubs are there?',
    answer: 'NIT has several active student clubs: Coding Club (weekly contests), Robotics Club (Robo-Wars), Literary Society (debates & quizzes), Photography Club, Music Club, Drama Society, NSS (National Service Scheme), and the Entrepreneurship Cell. Most clubs meet every Saturday in the auditorium or respective department rooms.',
    keywords: ['club', 'society', 'extracurricular', 'coding', 'robotics', 'music', 'drama', 'nss', 'cultural'],
  },
  {
    id: 'kb-19',
    topic: 'attendance rules',
    question: 'What are the attendance rules?',
    answer: 'Minimum 75% attendance is mandatory in each subject to sit for end-semester exams. Attendance is tracked biometrically in labs and manually in lectures. Students falling below 65% receive a warning letter. Medical leave requires a valid medical certificate submitted within 7 days. Attendance can be checked on the student portal.',
    keywords: ['attendance', 'absent', 'leave', 'present', 'percentage', 'proxy', 'biometric', 'minimum'],
  },
  {
    id: 'kb-20',
    topic: 'technova fest',
    question: 'What is TechNova?',
    answer: 'TechNova is NIT\'s annual technical festival, usually held in September. Events include: Hackathon (24-hour coding), Robo-Wars, Code Sprint, Paper Presentation, Project Exhibition, Gaming Tournament, and workshops. Students from across West Bengal participate. This year TechNova 2026 registration is open — check the notice board for details.',
    keywords: ['technova', 'fest', 'festival', 'hackathon', 'coding', 'competition', 'event', 'annual', 'cultural', 'technical'],
  },
];

// ===== COLLEGE INFO =====
export const COLLEGE_INFO = {
  name: 'Narula Institute of Technology',
  shortName: 'NIT',
  tagline: 'Excellence in Engineering Education Since 2001',
  address: '81, Nilgunj Road, Agarpara, Kolkata - 700109, West Bengal',
  established: 2001,
  affiliation: 'Maulana Abul Kalam Azad University of Technology (MAKAUT)',
  accreditation: 'NAAC Accredited',
  campus: '5 Acre Campus',
  stats: [
    { label: 'Students', value: '3000+', icon: '🎓' },
    { label: 'Faculty', value: '150+', icon: '👨‍🏫' },
    { label: 'Departments', value: '8', icon: '🏗️' },
    { label: 'Placement Rate', value: '80%', icon: '💼' },
  ],
  departments: [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Information Technology',
    'Electrical Engineering',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electronics & Computer Science',
    'Basic Science & Humanities',
  ],
};

// Helper: Get current meal period
export function getCurrentMealPeriod() {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 9) return 'breakfast';
  if (hour >= 12 && hour < 14) return 'lunch';
  if (hour >= 16 && hour < 17) return 'snacks';
  if (hour >= 19 && hour < 21) return 'dinner';
  // Default to next upcoming
  if (hour < 7) return 'breakfast';
  if (hour < 12) return 'lunch';
  if (hour < 16) return 'snacks';
  return 'dinner';
}

// Helper: Get class status
export function getClassStatus(cls) {
  const now = new Date().getHours();
  if (now >= cls.startHour && now < cls.endHour) return 'ongoing';
  if (now < cls.startHour) return 'upcoming';
  return 'completed';
}

// Helper: Format time remaining
export function formatTimeRemaining(dateStr) {
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return 'Overdue!';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days > 0) return `${days}d ${remainingHours}h remaining`;
  if (hours > 0) return `${hours}h remaining`;
  const mins = Math.floor(diff / (1000 * 60));
  return `${mins}m remaining`;
}

// Helper: Format date
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
