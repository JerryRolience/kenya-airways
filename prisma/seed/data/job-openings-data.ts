export interface JobOpeningSeedData {
  title: string
  department: string
  description: string
  isOpen: boolean
  closedAt?: Date
}

export const JOB_OPENINGS: JobOpeningSeedData[] = [
  // ─── Flight Operations ───
  {
    title: "Senior Captain - Boeing 787",
    department: "Flight Operations",
    description:
      "We are seeking an experienced Senior Captain for our Boeing 787 Dreamliner fleet. The ideal candidate will have a minimum of 8,000 flight hours, including 2,000 hours on wide-body aircraft. You will be responsible for commanding long-haul flights across our global network, ensuring the highest standards of safety, operational excellence, and passenger experience. Must hold a valid ATPL with Boeing 787 type rating. This role offers competitive compensation including housing allowance, education support for dependents, and annual profit sharing.",
    isOpen: true,
  },
  {
    title: "First Officer - Embraer E190",
    department: "Flight Operations",
    description:
      "Kenya Airways is looking for a motivated First Officer to join our Embraer E190 regional fleet. You will fly routes across East Africa and domestic Kenya. Minimum requirements include 2,500 flight hours, CPL with instrument rating, and Embraer E-Jet type rating (preferred). This is an excellent opportunity for pilots looking to build hours and experience with Africa's premier airline. Comprehensive training program provided for successful candidates without type rating.",
    isOpen: true,
  },

  // ─── Cabin Crew ───
  {
    title: "Senior Flight Attendant - Long Haul",
    department: "Cabin Crew",
    description:
      "We are hiring experienced Senior Flight Attendants for our long-haul routes to Europe, Asia, and the Americas. Candidates must have a minimum of 3 years of experience in a premium airline, excellent customer service skills, and fluency in English plus one additional language (French, Arabic, Mandarin, or German preferred). You will lead the cabin crew team, deliver exceptional service in Executive and Middle class cabins, and ensure passenger safety and comfort throughout the flight. Attractive tax-free allowances and travel benefits included.",
    isOpen: true,
  },
  {
    title: "Trainee Flight Attendant",
    department: "Cabin Crew",
    description:
      "Join the Pride of Africa! Kenya Airways is recruiting Trainee Flight Attendants for our growing route network. No prior aviation experience is required — we provide comprehensive 8-week training covering safety procedures, first aid, customer service excellence, and grooming standards. Candidates must be at least 21 years old, minimum KCSE C+ or equivalent, fluent in English and Kiswahili, and able to swim. Height requirement: minimum 160cm. This is your opportunity to travel the world while building a rewarding career.",
    isOpen: true,
  },

  // ─── Ground Staff ───
  {
    title: "Airport Operations Coordinator",
    department: "Ground Staff",
    description:
      "We are seeking an Airport Operations Coordinator to manage ground handling activities at Jomo Kenyatta International Airport. You will coordinate with ground handling agents, ensure on-time departures, manage gate assignments, and resolve operational issues in real-time. The ideal candidate has 3+ years in airport operations, strong problem-solving skills, and experience with airport management systems. Shift work including weekends and holidays is required. Knowledge of Amadeus or Sabre systems is a plus.",
    isOpen: true,
  },
  {
    title: "Ramp Services Supervisor",
    department: "Ground Staff",
    description:
      "Oversee all ramp operations including baggage handling, aircraft marshalling, ground power unit connection, and cargo loading/unloading. You will supervise a team of 15-20 ramp agents, ensuring compliance with safety regulations and operational procedures. Requirements include 3+ years of ramp experience, valid airside driving permit, and IATA Dangerous Goods certification. Must be physically fit and able to work in all weather conditions.",
    isOpen: true,
  },

  // ─── Engineering ───
  {
    title: "Aircraft Maintenance Engineer - Avionics",
    department: "Engineering",
    description:
      "We are hiring an Avionics Maintenance Engineer to join our technical team in Nairobi. You will perform scheduled and unscheduled maintenance on Boeing 787, 737, and Embraer E190 aircraft electrical and electronic systems. Requirements include EASA Part 66 or KCAA AMEL with avionics ratings, minimum 5 years of experience on commercial aircraft, and proficiency in troubleshooting complex avionics systems. Type rating on Boeing or Embraer aircraft is highly desirable.",
    isOpen: true,
  },
  {
    title: "Junior Aircraft Mechanic",
    department: "Engineering",
    description:
      "Start your aviation maintenance career with Kenya Airways! We are recruiting Junior Aircraft Mechanics for our Nairobi hangar. You will work under senior engineers performing routine inspections, component replacements, and maintenance checks. Candidates should have a diploma in Aeronautical Engineering or related field, strong mechanical aptitude, and willingness to work shifts. On-the-job training and type course sponsorship available for high performers.",
    isOpen: true,
  },

  // ─── IT Department ───
  {
    title: "Senior Software Engineer - Aviation Systems",
    department: "IT",
    description:
      "Join our digital transformation team as a Senior Software Engineer. You will develop and maintain critical aviation systems including booking engines, passenger management systems, and crew scheduling applications. Tech stack includes React, Node.js, Python, and cloud services (AWS/Azure). Requirements: 5+ years of full-stack development experience, strong database design skills (PostgreSQL), and experience with microservices architecture. Aviation industry experience is a plus. Remote work options available.",
    isOpen: true,
  },
  {
    title: "Cybersecurity Analyst",
    department: "IT",
    description:
      "Protect Kenya Airways' digital assets as our Cybersecurity Analyst. You will monitor security systems, respond to incidents, conduct vulnerability assessments, and ensure compliance with aviation cybersecurity regulations (ICAO, IATA). Requirements include CISSP or CISM certification, 3+ years in cybersecurity, experience with SIEM tools, and knowledge of PCI DSS compliance. This is a critical role in safeguarding passenger data and operational technology systems.",
    isOpen: true,
  },

  // ─── Human Resources ───
  {
    title: "HR Business Partner - Operations",
    department: "Human Resources",
    description:
      "We are looking for an HR Business Partner to support our Flight Operations and Cabin Crew divisions. You will manage employee relations, performance management, succession planning, and organizational development for a workforce of 1,500+ crew members. Requirements: CHRP certification, 7+ years of HR experience with 3+ years in a business partner role, strong knowledge of Kenyan labor law, and experience in a unionized environment. Aviation or hospitality industry experience is preferred.",
    isOpen: true,
  },
  {
    title: "Learning & Development Specialist",
    department: "Human Resources",
    description:
      "Design and deliver training programs for Kenya Airways staff across all departments. You will conduct needs assessments, develop e-learning modules, coordinate external training providers, and measure training effectiveness. Requirements: Diploma in HR or Education, 3+ years in L&D, proficiency in LMS platforms, and excellent presentation skills. Experience in aviation training (DGR, SEP, AVSEC) is a significant advantage.",
    isOpen: true,
  },

  // ─── Finance ───
  {
    title: "Revenue Accountant",
    department: "Finance",
    description:
      "Manage revenue accounting for Kenya Airways' passenger and cargo operations. You will reconcile ticket sales, interline settlements, credit card payments, and ensure compliance with IATA revenue accounting standards. Requirements: CPA(K) or ACCA qualification, 4+ years of revenue accounting experience, proficiency in airline revenue accounting systems (RAPID, RA), and advanced Excel skills. Knowledge of IATA clearing house procedures is essential.",
    isOpen: true,
  },
  {
    title: "Management Accountant - Cost Control",
    department: "Finance",
    description:
      "Drive cost optimization across Kenya Airways operations as our Management Accountant. You will prepare management reports, analyze operational costs (fuel, crew, maintenance, airport charges), develop budgets, and provide financial insights to department heads. Requirements: CPA(K) or CIMA, 5+ years in management accounting, strong analytical skills, and experience with ERP systems (SAP preferred). Airline industry experience is a distinct advantage.",
    isOpen: true,
  },

  // ─── Marketing ───
  {
    title: "Digital Marketing Manager",
    department: "Marketing",
    description:
      "Lead Kenya Airways' digital marketing strategy across web, social media, email, and paid channels. You will manage a team of 5, oversee the digital marketing budget, drive customer acquisition through performance marketing, and enhance our brand presence across Africa and global markets. Requirements: 7+ years in digital marketing, 3+ years in a managerial role, expertise in Google Analytics, Meta Ads, SEO/SEM, and marketing automation platforms. Experience in travel or hospitality marketing is preferred.",
    isOpen: true,
  },
  {
    title: "Brand & Content Specialist",
    department: "Marketing",
    description:
      "Tell the Kenya Airways story! We're hiring a creative Brand & Content Specialist to produce compelling content across all channels. You will create social media content, write blog posts, produce short-form videos, and manage our brand voice. Requirements: 3+ years in content creation, excellent writing and visual storytelling skills, proficiency in Adobe Creative Suite or Canva, and video editing experience. Photography skills and knowledge of African travel markets are plusses.",
    isOpen: true,
  },

  // ─── Customer Service ───
  {
    title: "Call Center Quality Assurance Lead",
    department: "Customer Service",
    description:
      "Ensure world-class customer service across our contact centers in Nairobi and Mumbai. You will monitor calls, provide coaching to agents, develop quality scorecards, and drive continuous improvement in customer satisfaction metrics. Requirements: 4+ years in contact center QA, strong coaching skills, experience with NICE or similar quality management systems, and excellent communication skills. Multilingual candidates (English + French/Arabic) preferred.",
    isOpen: true,
  },

  // ─── Closed Positions (for testing) ───
  {
    title: "Chief Financial Officer",
    department: "Finance",
    description:
      "Strategic leadership role overseeing all financial operations of Kenya Airways including treasury, financial planning, investor relations, and regulatory compliance. The CFO will report directly to the CEO and Board of Directors.",
    isOpen: false,
    closedAt: new Date("2026-04-15"),
  },
  {
    title: "Regional Manager - West Africa",
    department: "Marketing",
    description: "Lead our commercial operations across West Africa including sales, marketing, and station management for Nigeria, Ghana, Senegal, and Côte d'Ivoire markets.",
    isOpen: false,
    closedAt: new Date("2026-03-30"),
  },
  {
    title: "Graduate Trainee - Engineering",
    department: "Engineering",
    description: "2025 graduate training program for aeronautical engineering graduates. 18-month rotational program across maintenance, quality assurance, and planning departments.",
    isOpen: false,
    closedAt: new Date("2026-02-28"),
  },
]
