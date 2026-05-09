import { PrismaPg } from "@prisma/adapter-pg"
import chalk from "chalk"
import * as dotenv from "dotenv"
import * as path from "path"
import { PrismaClient } from "../../generated/prisma/client"
import { FLIGHTS } from "./data/flights-data"
import { SeatPosition, ClassType } from "../../generated/prisma/enums"

const envPath = path.resolve(process.cwd(), ".env")
console.log(chalk.blue(`📁 Loading env from: ${envPath}`))
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error(chalk.red("❌ Failed to load .env file:"), result.error.message)
  process.exit(1)
}

console.log(chalk.green("✅ Environment variables loaded"))

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// ─── Helper: Determine seat position ───
function getSeatPosition(column: string, columns: string[], seatsPerRow: number): SeatPosition {
  const colIndex = columns.indexOf(column)
  if (colIndex === 0 || colIndex === columns.length - 1) return SeatPosition.WINDOW
  if (seatsPerRow === 4 && (colIndex === 1 || colIndex === 2)) return SeatPosition.AISLE
  if (seatsPerRow === 6 && (colIndex === 2 || colIndex === 3)) return SeatPosition.AISLE
  return SeatPosition.MIDDLE
}

// ─── Helper: Generate seats for a flight ───
async function generateSeatsForFlight(flightId: string, aircraftLayout: any, seatClasses: { id: string; class: ClassType; totalSeats: number }[]) {
  const classConfigs = {
    EXECUTIVE: { rowStart: aircraftLayout.execRowStart, rowEnd: aircraftLayout.execRowEnd, columns: aircraftLayout.execColumns, seatsPerRow: aircraftLayout.execSeatsPerRow },
    MIDDLE: { rowStart: aircraftLayout.midRowStart, rowEnd: aircraftLayout.midRowEnd, columns: aircraftLayout.midColumns, seatsPerRow: aircraftLayout.midSeatsPerRow },
    ECONOMY: { rowStart: aircraftLayout.ecoRowStart, rowEnd: aircraftLayout.ecoRowEnd, columns: aircraftLayout.ecoColumns, seatsPerRow: aircraftLayout.ecoSeatsPerRow },
  }

  let totalGenerated = 0

  for (const sc of seatClasses) {
    const config = classConfigs[sc.class]
    const columns = config.columns.split(",")
    const seatRecords: any[] = []

    for (let row = config.rowStart; row <= config.rowEnd; row++) {
      for (const col of columns) {
        seatRecords.push({
          flightId,
          seatClassId: sc.id,
          seatNumber: `${row}${col}`,
          row,
          column: col,
          position: getSeatPosition(col, columns, config.seatsPerRow),
          isBooked: false,
          isBlocked: false,
        })
      }
    }

    // Batch create seats for this class
    if (seatRecords.length > 0) {
      await prisma.seat.createMany({ data: seatRecords })
      totalGenerated += seatRecords.length
    }
  }

  return totalGenerated
}

// ─── Main seed function ───
export async function seedFlights() {
  console.log(chalk.blue("\n🛫 Starting seeding of flights, seat classes, and seats..."))

  // Pre-fetch airports and layouts for quick lookup
  const airports = await prisma.airport.findMany()
  const airportMap = new Map(airports.map(a => [a.code, a]))

  const layouts = await prisma.aircraftLayout.findMany()
  const layoutMap = new Map(layouts.map(l => [l.aircraftType, l]))

  for (const flightData of FLIGHTS) {
    try {
      const departure = airportMap.get(flightData.fromCode)
      const arrival = airportMap.get(flightData.toCode)
      const layout = layoutMap.get(flightData.aircraftType)

      if (!departure || !arrival || !layout) {
        console.error(chalk.red(`❌ Missing reference for ${flightData.flightNumber}: departure=${!!departure}, arrival=${!!arrival}, layout=${!!layout}`))
        continue
      }

      // Create flight
      const flight = await prisma.flight.upsert({
        where: { flightNumber: flightData.flightNumber },
        update: {
          departureId: departure.id,
          arrivalId: arrival.id,
          departureTime: flightData.departureTime,
          arrivalTime: flightData.arrivalTime,
          aircraftLayoutId: layout.id,
          status: flightData.status,
        },
        create: {
          flightNumber: flightData.flightNumber,
          departureId: departure.id,
          arrivalId: arrival.id,
          departureTime: flightData.departureTime,
          arrivalTime: flightData.arrivalTime,
          aircraftLayoutId: layout.id,
          status: flightData.status,
        },
      })

      // Create seat classes for this flight
      const seatClasses: { id: string; class: ClassType; totalSeats: number }[] = []
      for (const sc of flightData.seatClasses) {
        const classConfig = {
          EXECUTIVE: { rowStart: layout.execRowStart, rowEnd: layout.execRowEnd, seatsPerRow: layout.execSeatsPerRow },
          MIDDLE: { rowStart: layout.midRowStart, rowEnd: layout.midRowEnd, seatsPerRow: layout.midSeatsPerRow },
          ECONOMY: { rowStart: layout.ecoRowStart, rowEnd: layout.ecoRowEnd, seatsPerRow: layout.ecoSeatsPerRow },
        }[sc.class]

        const totalSeats = classConfig ? (classConfig.rowEnd - classConfig.rowStart + 1) * classConfig.seatsPerRow : 0

        const seatClass = await prisma.seatClass.create({
          data: {
            flightId: flight.id,
            class: sc.class,
            totalSeats,
            bookedSeats: 0,
            priceKES: sc.priceKES,
          },
        })

        seatClasses.push({ id: seatClass.id, class: sc.class, totalSeats })
      }

      // Generate individual seats
      const seatsGenerated = await generateSeatsForFlight(flight.id, layout, seatClasses)

      console.log(chalk.green(`✅ Flight ${flightData.flightNumber}: ${departure.code} → ${arrival.code} | ` + `${flightData.aircraftType} | ${seatClasses.length} classes | ${seatsGenerated} seats`))
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create flight ${flightData.flightNumber}:`), error)
    }
  }

  console.log(chalk.yellow(`\n🛫 Flights seeding completed — ${FLIGHTS.length} flights processed`))
}

if (require.main === module) {
  seedFlights()
    .catch(e => {
      console.error("Seeding failed:", e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
