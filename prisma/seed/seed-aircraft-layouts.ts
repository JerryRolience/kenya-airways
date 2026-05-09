import { PrismaPg } from "@prisma/adapter-pg"
import chalk from "chalk"
import * as dotenv from "dotenv"
import * as path from "path"
import { PrismaClient } from "../../generated/prisma/client"
import { AIRCRAFT_LAYOUTS } from "./data/aircraft-layouts-data"

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

export async function seedAircraftLayouts() {
  console.log(chalk.blue("\n✈️ Starting seeding of aircraft layouts..."))

  for (const layout of AIRCRAFT_LAYOUTS) {
    try {
      await prisma.aircraftLayout.upsert({
        where: { aircraftType: layout.aircraftType },
        update: layout,
        create: layout,
      })

      const totalSeats =
        (layout.execRowEnd - layout.execRowStart + 1) * layout.execSeatsPerRow +
        (layout.midRowEnd - layout.midRowStart + 1) * layout.midSeatsPerRow +
        (layout.ecoRowEnd - layout.ecoRowStart + 1) * layout.ecoSeatsPerRow

      console.log(chalk.green(`✅ Layout: ${layout.aircraftType} — ${totalSeats} total seats`))
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create layout ${layout.aircraftType}:`), error)
    }
  }

  console.log(chalk.yellow(`\n✈️ Aircraft layouts seeding completed — ${AIRCRAFT_LAYOUTS.length} layouts processed`))
}

if (require.main === module) {
  seedAircraftLayouts()
    .catch(e => {
      console.error("Seeding failed:", e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
