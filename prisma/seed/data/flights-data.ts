import { FlightStatus, ClassType } from "../../../generated/prisma/enums"

export interface FlightSeedData {
  flightNumber: string
  fromCode: string
  toCode: string
  departureTime: Date
  arrivalTime: Date
  aircraftType: string // References AircraftLayout.aircraftType
  status: FlightStatus
  seatClasses: {
    class: ClassType
    priceKES: number
  }[]
}

// Helper to create dates relative to today
const today = new Date()
today.setHours(0, 0, 0, 0)

function daysFromNow(days: number, hours: number, minutes: number = 0): Date {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export const FLIGHTS: FlightSeedData[] = [
  // ─── NBO → LHR (Daily, multiple times) ───
  {
    flightNumber: "KQ100",
    fromCode: "NBO",
    toCode: "LHR",
    departureTime: daysFromNow(7, 8, 0),
    arrivalTime: daysFromNow(7, 15, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 189000 },
      { class: ClassType.MIDDLE, priceKES: 89000 },
      { class: ClassType.ECONOMY, priceKES: 38000 },
    ],
  },
  {
    flightNumber: "KQ102",
    fromCode: "NBO",
    toCode: "LHR",
    departureTime: daysFromNow(7, 22, 0),
    arrivalTime: daysFromNow(8, 5, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 189000 },
      { class: ClassType.MIDDLE, priceKES: 89000 },
      { class: ClassType.ECONOMY, priceKES: 38000 },
    ],
  },

  // ─── NBO → DXB ───
  {
    flightNumber: "KQ310",
    fromCode: "NBO",
    toCode: "DXB",
    departureTime: daysFromNow(5, 10, 0),
    arrivalTime: daysFromNow(5, 16, 30),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 120000 },
      { class: ClassType.MIDDLE, priceKES: 56000 },
      { class: ClassType.ECONOMY, priceKES: 24000 },
    ],
  },
  {
    flightNumber: "KQ312",
    fromCode: "NBO",
    toCode: "IST",
    departureTime: daysFromNow(5, 18, 0),
    arrivalTime: daysFromNow(6, 0, 30),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 120000 },
      { class: ClassType.MIDDLE, priceKES: 56000 },
      { class: ClassType.ECONOMY, priceKES: 24000 },
    ],
  },

  // ─── NBO → MBA (Domestic) ───
  {
    flightNumber: "KQ600",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNow(3, 6, 30),
    arrivalTime: daysFromNow(3, 7, 30),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ602",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNow(3, 14, 0),
    arrivalTime: daysFromNow(3, 15, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },

  // ─── NBO → CPT ───
  {
    flightNumber: "KQ760",
    fromCode: "NBO",
    toCode: "CPT",
    departureTime: daysFromNow(10, 7, 0),
    arrivalTime: daysFromNow(10, 12, 30),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 145000 },
      { class: ClassType.MIDDLE, priceKES: 68000 },
      { class: ClassType.ECONOMY, priceKES: 32000 },
    ],
  },

  // ─── NBO → JFK ───
  {
    flightNumber: "KQ002",
    fromCode: "NBO",
    toCode: "JFK",
    departureTime: daysFromNow(14, 10, 0),
    arrivalTime: daysFromNow(14, 17, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 320000 },
      { class: ClassType.MIDDLE, priceKES: 150000 },
      { class: ClassType.ECONOMY, priceKES: 65000 },
    ],
  },

  // ─── NBO → BKK ───
  {
    flightNumber: "KQ880",
    fromCode: "NBO",
    toCode: "BKK",
    departureTime: daysFromNow(7, 9, 0),
    arrivalTime: daysFromNow(7, 19, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 210000 },
      { class: ClassType.MIDDLE, priceKES: 98000 },
      { class: ClassType.ECONOMY, priceKES: 42000 },
    ],
  },

  {
    flightNumber: "KQ881",
    fromCode: "NBO",
    toCode: "IST",
    departureTime: daysFromNow(7, 22, 0),
    arrivalTime: daysFromNow(8, 7, 30),
    aircraftType: "Boeing 777-300ER",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 210000 },
      { class: ClassType.MIDDLE, priceKES: 98000 },
      { class: ClassType.ECONOMY, priceKES: 42000 },
    ],
  },

  //   ─── NBO → BKK (Late-night red-eye) ───
  {
    flightNumber: "KQ882",
    fromCode: "NBO",
    toCode: "BKK",
    departureTime: daysFromNow(7, 21, 0),
    arrivalTime: daysFromNow(8, 7, 30),
    aircraftType: "Boeing 777-300ER",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 210000 },
      { class: ClassType.MIDDLE, priceKES: 98000 },
      { class: ClassType.ECONOMY, priceKES: 42000 },
    ],
  },
  {
    flightNumber: "KQ883",
    fromCode: "NBO",
    toCode: "OSL",
    departureTime: daysFromNow(7, 23, 0),
    arrivalTime: daysFromNow(8, 7, 30),
    aircraftType: "Boeing 777-300ER",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 210000 },
      { class: ClassType.MIDDLE, priceKES: 98000 },
      { class: ClassType.ECONOMY, priceKES: 42000 },
    ],
  },
  {
    flightNumber: "KQ884",
    fromCode: "NBO",
    toCode: "MAD",
    departureTime: daysFromNow(8, 0, 0),
    arrivalTime: daysFromNow(8, 7, 30),
    aircraftType: "Boeing 777-300ER",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 210000 },
      { class: ClassType.MIDDLE, priceKES: 98000 },
      { class: ClassType.ECONOMY, priceKES: 42000 },
    ],
  },

  {
    flightNumber: "KQ885",
    fromCode: "NBO",
    toCode: "FCO",
    departureTime: daysFromNow(8, 1, 0),
    arrivalTime: daysFromNow(8, 7, 30),
    aircraftType: "Boeing 777-300ER",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 210000 },
      { class: ClassType.MIDDLE, priceKES: 98000 },
      { class: ClassType.ECONOMY, priceKES: 42000 },
    ],
  },
  {
    flightNumber: "KQ886",
    fromCode: "NBO",
    toCode: "DUB",
    departureTime: daysFromNow(8, 2, 0),
    arrivalTime: daysFromNow(8, 7, 30),
    aircraftType: "Boeing 777-300ER",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 210000 },
      { class: ClassType.MIDDLE, priceKES: 98000 },
      { class: ClassType.ECONOMY, priceKES: 42000 },
    ],
  },
  {
    flightNumber: "KQ887",
    fromCode: "NBO",
    toCode: "DUB",
    departureTime: daysFromNow(8, 3, 0),
    arrivalTime: daysFromNow(8, 7, 30),
    aircraftType: "Boeing 777-300ER",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 210000 },
      { class: ClassType.MIDDLE, priceKES: 98000 },
      { class: ClassType.ECONOMY, priceKES: 42000 },
    ],
  },

  // ─── Return flights (for round-trip testing) ───
  {
    flightNumber: "KQ101",
    fromCode: "LHR",
    toCode: "NBO",
    departureTime: daysFromNow(14, 18, 0),
    arrivalTime: daysFromNow(15, 4, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 189000 },
      { class: ClassType.MIDDLE, priceKES: 89000 },
      { class: ClassType.ECONOMY, priceKES: 38000 },
    ],
  },
  {
    flightNumber: "KQ311",
    fromCode: "DXB",
    toCode: "NBO",
    departureTime: daysFromNow(12, 1, 0),
    arrivalTime: daysFromNow(12, 5, 30),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 120000 },
      { class: ClassType.MIDDLE, priceKES: 56000 },
      { class: ClassType.ECONOMY, priceKES: 24000 },
    ],
  },
  {
    flightNumber: "KQ601",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNow(4, 8, 0),
    arrivalTime: daysFromNow(4, 9, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ761",
    fromCode: "CPT",
    toCode: "NBO",
    departureTime: daysFromNow(11, 14, 0),
    arrivalTime: daysFromNow(11, 19, 30),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 145000 },
      { class: ClassType.MIDDLE, priceKES: 68000 },
      { class: ClassType.ECONOMY, priceKES: 32000 },
    ],
  },
  {
    flightNumber: "KQ003",
    fromCode: "JFK",
    toCode: "NBO",
    departureTime: daysFromNow(15, 20, 0),
    arrivalTime: daysFromNow(16, 5, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 320000 },
      { class: ClassType.MIDDLE, priceKES: 150000 },
      { class: ClassType.ECONOMY, priceKES: 65000 },
    ],
  },
]

// Add these to your FLIGHTS array

export const DEMO_FLIGHTS: FlightSeedData[] = [
  // ═══════════════════════════════════════════════════════════
  // NBO → JFK (Nairobi to New York) — May 24-27
  // ═══════════════════════════════════════════════════════════
  {
    flightNumber: "KQ004",
    fromCode: "NBO",
    toCode: "JFK",
    departureTime: daysFromNow(0, 8, 0), // Today 8:00 AM
    arrivalTime: daysFromNow(0, 15, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 320000 },
      { class: ClassType.MIDDLE, priceKES: 150000 },
      { class: ClassType.ECONOMY, priceKES: 65000 },
    ],
  },
  {
    flightNumber: "KQ006",
    fromCode: "NBO",
    toCode: "JFK",
    departureTime: daysFromNow(0, 22, 0), // Today 10:00 PM
    arrivalTime: daysFromNow(1, 5, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 320000 },
      { class: ClassType.MIDDLE, priceKES: 150000 },
      { class: ClassType.ECONOMY, priceKES: 65000 },
    ],
  },
  {
    flightNumber: "KQ008",
    fromCode: "NBO",
    toCode: "JFK",
    departureTime: daysFromNow(1, 10, 0), // Tomorrow 10:00 AM
    arrivalTime: daysFromNow(1, 17, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 310000 },
      { class: ClassType.MIDDLE, priceKES: 145000 },
      { class: ClassType.ECONOMY, priceKES: 62000 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // JFK → NBO (New York to Nairobi) — Return flights
  // ═══════════════════════════════════════════════════════════
  {
    flightNumber: "KQ005",
    fromCode: "JFK",
    toCode: "NBO",
    departureTime: daysFromNow(2, 20, 0), // May 26
    arrivalTime: daysFromNow(3, 5, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 320000 },
      { class: ClassType.MIDDLE, priceKES: 150000 },
      { class: ClassType.ECONOMY, priceKES: 65000 },
    ],
  },
  {
    flightNumber: "KQ007",
    fromCode: "JFK",
    toCode: "NBO",
    departureTime: daysFromNow(2, 23, 0), // May 26 - Late night
    arrivalTime: daysFromNow(3, 8, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 310000 },
      { class: ClassType.MIDDLE, priceKES: 145000 },
      { class: ClassType.ECONOMY, priceKES: 62000 },
    ],
  },
  {
    flightNumber: "KQ009",
    fromCode: "JFK",
    toCode: "NBO",
    departureTime: daysFromNow(3, 18, 0), // May 27
    arrivalTime: daysFromNow(4, 5, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 320000 },
      { class: ClassType.MIDDLE, priceKES: 150000 },
      { class: ClassType.ECONOMY, priceKES: 65000 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // NBO → MBA (Nairobi to Mombasa) — May 24-27
  // ═══════════════════════════════════════════════════════════
  {
    flightNumber: "KQ604",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNow(0, 9, 0), // Today 9:00 AM
    arrivalTime: daysFromNow(0, 10, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ606",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNow(0, 16, 0), // Today 4:00 PM
    arrivalTime: daysFromNow(0, 17, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ608",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNow(1, 7, 0), // Tomorrow 7:00 AM
    arrivalTime: daysFromNow(1, 8, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ610",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNow(1, 18, 0), // Tomorrow 6:00 PM
    arrivalTime: daysFromNow(1, 19, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // MBA → NBO (Mombasa to Nairobi) — Return flights
  // ═══════════════════════════════════════════════════════════
  {
    flightNumber: "KQ605",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNow(0, 11, 0), // Today 11:00 AM
    arrivalTime: daysFromNow(0, 12, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ607",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNow(0, 18, 0), // Today 6:00 PM
    arrivalTime: daysFromNow(0, 19, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ609",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNow(1, 9, 0), // Tomorrow 9:00 AM
    arrivalTime: daysFromNow(1, 10, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ611",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNow(1, 20, 0), // Tomorrow 8:00 PM
    arrivalTime: daysFromNow(1, 21, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // NBO → DUB (Nairobi to Dublin) — May 24-27
  // ═══════════════════════════════════════════════════════════
  {
    flightNumber: "KQ890",
    fromCode: "NBO",
    toCode: "DUB",
    departureTime: daysFromNow(0, 6, 0), // Today 6:00 AM
    arrivalTime: daysFromNow(0, 13, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 195000 },
      { class: ClassType.MIDDLE, priceKES: 92000 },
      { class: ClassType.ECONOMY, priceKES: 40000 },
    ],
  },
  {
    flightNumber: "KQ892",
    fromCode: "NBO",
    toCode: "DUB",
    departureTime: daysFromNow(0, 20, 0), // Today 8:00 PM
    arrivalTime: daysFromNow(1, 3, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 195000 },
      { class: ClassType.MIDDLE, priceKES: 92000 },
      { class: ClassType.ECONOMY, priceKES: 40000 },
    ],
  },
  {
    flightNumber: "KQ894",
    fromCode: "NBO",
    toCode: "DUB",
    departureTime: daysFromNow(1, 14, 0), // Tomorrow 2:00 PM
    arrivalTime: daysFromNow(1, 21, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 190000 },
      { class: ClassType.MIDDLE, priceKES: 89000 },
      { class: ClassType.ECONOMY, priceKES: 38000 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // DUB → NBO (Dublin to Nairobi) — Return flights
  // ═══════════════════════════════════════════════════════════
  {
    flightNumber: "KQ891",
    fromCode: "DUB",
    toCode: "NBO",
    departureTime: daysFromNow(2, 15, 0), // May 26 - 3:00 PM
    arrivalTime: daysFromNow(3, 0, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 195000 },
      { class: ClassType.MIDDLE, priceKES: 92000 },
      { class: ClassType.ECONOMY, priceKES: 40000 },
    ],
  },
  {
    flightNumber: "KQ893",
    fromCode: "DUB",
    toCode: "NBO",
    departureTime: daysFromNow(3, 8, 0), // May 27 - 8:00 AM
    arrivalTime: daysFromNow(3, 17, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 190000 },
      { class: ClassType.MIDDLE, priceKES: 89000 },
      { class: ClassType.ECONOMY, priceKES: 38000 },
    ],
  },
  {
    flightNumber: "KQ895",
    fromCode: "DUB",
    toCode: "NBO",
    departureTime: daysFromNow(3, 21, 0), // May 27 - 9:00 PM
    arrivalTime: daysFromNow(4, 6, 30),
    aircraftType: "Boeing 787-8 Dreamliner",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 195000 },
      { class: ClassType.MIDDLE, priceKES: 92000 },
      { class: ClassType.ECONOMY, priceKES: 40000 },
    ],
  },
]

// Helper to create dates relative to a specific date
// For May 30, 2026 (6 days from today if today is May 24)
function daysFromNowMombasa(days: number, hours: number, minutes: number = 0): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export const NBO_MBA_MAY30_FLIGHTS: FlightSeedData[] = [
  // ═══════════════════════════════════════════════════════════
  // NBO → MBA (Nairobi to Mombasa) — May 30, 2026
  // ═══════════════════════════════════════════════════════════
  {
    flightNumber: "KQ620",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNowMombasa(6, 6, 0), // May 30 - 6:00 AM
    arrivalTime: daysFromNowMombasa(6, 7, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ622",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNowMombasa(6, 7, 30), // May 30 - 7:30 AM
    arrivalTime: daysFromNowMombasa(6, 8, 30),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 32000 },
      { class: ClassType.MIDDLE, priceKES: 18000 },
      { class: ClassType.ECONOMY, priceKES: 9500 },
    ],
  },
  {
    flightNumber: "KQ624",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNowMombasa(6, 10, 0), // May 30 - 10:00 AM
    arrivalTime: daysFromNowMombasa(6, 11, 0),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 30000 },
      { class: ClassType.MIDDLE, priceKES: 17000 },
      { class: ClassType.ECONOMY, priceKES: 9200 },
    ],
  },
  {
    flightNumber: "KQ626",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNowMombasa(6, 13, 0), // May 30 - 1:00 PM
    arrivalTime: daysFromNowMombasa(6, 14, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ628",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNowMombasa(6, 15, 30), // May 30 - 3:30 PM
    arrivalTime: daysFromNowMombasa(6, 16, 30),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 35000 },
      { class: ClassType.MIDDLE, priceKES: 20000 },
      { class: ClassType.ECONOMY, priceKES: 11000 },
    ],
  },
  {
    flightNumber: "KQ630",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNowMombasa(6, 17, 0), // May 30 - 5:00 PM
    arrivalTime: daysFromNowMombasa(6, 18, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ632",
    fromCode: "NBO",
    toCode: "MBA",
    departureTime: daysFromNowMombasa(6, 19, 0), // May 30 - 7:00 PM
    arrivalTime: daysFromNowMombasa(6, 20, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 30000 },
      { class: ClassType.MIDDLE, priceKES: 18000 },
      { class: ClassType.ECONOMY, priceKES: 9500 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // MBA → NBO (Mombasa to Nairobi) — May 30, 2026
  // ═══════════════════════════════════════════════════════════
  {
    flightNumber: "KQ621",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNowMombasa(6, 7, 30), // May 30 - 7:30 AM
    arrivalTime: daysFromNowMombasa(6, 8, 30),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ623",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNowMombasa(6, 9, 0), // May 30 - 9:00 AM
    arrivalTime: daysFromNowMombasa(6, 10, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 32000 },
      { class: ClassType.MIDDLE, priceKES: 18000 },
      { class: ClassType.ECONOMY, priceKES: 9500 },
    ],
  },
  {
    flightNumber: "KQ625",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNowMombasa(6, 11, 30), // May 30 - 11:30 AM
    arrivalTime: daysFromNowMombasa(6, 12, 30),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 30000 },
      { class: ClassType.MIDDLE, priceKES: 17000 },
      { class: ClassType.ECONOMY, priceKES: 9200 },
    ],
  },
  {
    flightNumber: "KQ627",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNowMombasa(6, 14, 30), // May 30 - 2:30 PM
    arrivalTime: daysFromNowMombasa(6, 15, 30),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ629",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNowMombasa(6, 16, 0), // May 30 - 4:00 PM
    arrivalTime: daysFromNowMombasa(6, 17, 0),
    aircraftType: "Boeing 737-800",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 35000 },
      { class: ClassType.MIDDLE, priceKES: 20000 },
      { class: ClassType.ECONOMY, priceKES: 11000 },
    ],
  },
  {
    flightNumber: "KQ631",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNowMombasa(6, 18, 0), // May 30 - 6:00 PM
    arrivalTime: daysFromNowMombasa(6, 19, 0),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 28000 },
      { class: ClassType.MIDDLE, priceKES: 16000 },
      { class: ClassType.ECONOMY, priceKES: 8900 },
    ],
  },
  {
    flightNumber: "KQ633",
    fromCode: "MBA",
    toCode: "NBO",
    departureTime: daysFromNowMombasa(6, 20, 30), // May 30 - 8:30 PM
    arrivalTime: daysFromNowMombasa(6, 21, 30),
    aircraftType: "Embraer E190",
    status: FlightStatus.SCHEDULED,
    seatClasses: [
      { class: ClassType.EXECUTIVE, priceKES: 30000 },
      { class: ClassType.MIDDLE, priceKES: 18000 },
      { class: ClassType.ECONOMY, priceKES: 9500 },
    ],
  },
]
