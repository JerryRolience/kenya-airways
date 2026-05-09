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
