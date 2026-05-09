import { PrismaPg } from "@prisma/adapter-pg"
import chalk from "chalk"
import * as dotenv from "dotenv"
import * as path from "path"
import { PrismaClient } from "../../generated/prisma/client"
import { AIRPORTS } from "./data/airports-data"

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

export async function seedAirports() {
  console.log(chalk.blue("\n🛫 Starting seeding of airports..."))

  for (const airport of AIRPORTS) {
    try {
      await prisma.airport.upsert({
        where: { code: airport.code },
        update: airport,
        create: airport,
      })

      console.log(chalk.green(`✅ Airport: ${airport.code} — ${airport.city}, ${airport.country}`))
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create airport ${airport.code}:`), error)
    }
  }

  console.log(chalk.yellow(`\n🛫 Airports seeding completed — ${AIRPORTS.length} airports processed`))
}

// Only run directly if called as script (not imported)
if (require.main === module) {
  seedAirports()
    .catch(e => {
      console.error("Seeding failed:", e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
