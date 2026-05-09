export interface AircraftLayoutSeedData {
  aircraftType: string
  execRowStart: number
  execRowEnd: number
  execSeatsPerRow: number
  execColumns: string
  midRowStart: number
  midRowEnd: number
  midSeatsPerRow: number
  midColumns: string
  ecoRowStart: number
  ecoRowEnd: number
  ecoSeatsPerRow: number
  ecoColumns: string
}

export const AIRCRAFT_LAYOUTS: AircraftLayoutSeedData[] = [
  {
    aircraftType: "Boeing 787-8 Dreamliner",
    // Executive: Rows 1-4, 4 seats per row (1-2-1 layout)
    execRowStart: 1,
    execRowEnd: 4,
    execSeatsPerRow: 4,
    execColumns: "A,C,D,F",
    // Middle: Rows 5-14, 6 seats per row (3-3 layout)
    midRowStart: 5,
    midRowEnd: 14,
    midSeatsPerRow: 6,
    midColumns: "A,B,C,D,E,F",
    // Economy: Rows 15-34, 6 seats per row (3-3 layout)
    ecoRowStart: 15,
    ecoRowEnd: 34,
    ecoSeatsPerRow: 6,
    ecoColumns: "A,B,C,D,E,F",
  },
  {
    aircraftType: "Embraer E190",
    // Executive: Rows 1-3, 4 seats per row (2-2 layout)
    execRowStart: 1,
    execRowEnd: 3,
    execSeatsPerRow: 4,
    execColumns: "A,B,C,D",
    // Middle: Rows 4-10, 4 seats per row (2-2 layout)
    midRowStart: 4,
    midRowEnd: 10,
    midSeatsPerRow: 4,
    midColumns: "A,B,C,D",
    // Economy: Rows 11-25, 4 seats per row (2-2 layout)
    ecoRowStart: 11,
    ecoRowEnd: 25,
    ecoSeatsPerRow: 4,
    ecoColumns: "A,B,C,D",
  },
  {
    aircraftType: "Boeing 737-800",
    // Executive: Rows 1-2, 4 seats per row (2-2 layout)
    execRowStart: 1,
    execRowEnd: 2,
    execSeatsPerRow: 4,
    execColumns: "A,B,C,D",
    // Middle: Rows 3-8, 6 seats per row (3-3 layout)
    midRowStart: 3,
    midRowEnd: 8,
    midSeatsPerRow: 6,
    midColumns: "A,B,C,D,E,F",
    // Economy: Rows 9-30, 6 seats per row (3-3 layout)
    ecoRowStart: 9,
    ecoRowEnd: 30,
    ecoSeatsPerRow: 6,
    ecoColumns: "A,B,C,D,E,F",
  },
  {
    aircraftType: "Boeing 777-300ER",
    // Executive: Rows 1-5, 4 seats per row (1-2-1 layout)
    execRowStart: 1,
    execRowEnd: 5,
    execSeatsPerRow: 4,
    execColumns: "A,C,D,F",
    // Middle: Rows 6-20, 6 seats per row (3-3 layout)
    midRowStart: 6,
    midRowEnd: 20,
    midSeatsPerRow: 6,
    midColumns: "A,B,C,D,E,F",
    // Economy: Rows 21-50, 6 seats per row (3-3 layout)
    ecoRowStart: 21,
    ecoRowEnd: 50,
    ecoSeatsPerRow: 6,
    ecoColumns: "A,B,C,D,E,F",
  },
]
